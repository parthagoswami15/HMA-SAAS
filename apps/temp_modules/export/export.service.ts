import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { createGzip } from 'zlib';

const pipelineAsync = promisify(pipeline);

export interface ExportOptions {
  format: 'excel' | 'csv' | 'json';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  includeDeleted?: boolean;
}

export interface BackupOptions {
  includeAuditLogs?: boolean;
  includeNotifications?: boolean;
  compress?: boolean;
}

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(private prisma: PrismaService) {}

  async exportPatients(tenantId: string, options: ExportOptions) {
    const patients = await this.prisma.patient.findMany({
      where: {
        tenantId,
        ...(options.dateRange && {
          createdAt: {
            gte: options.dateRange.startDate,
            lte: options.dateRange.endDate,
          },
        }),
      },
      include: {
        appointments: true,
        labOrders: true,
        prescriptions: true,
        invoices: true,
      },
    });

    switch (options.format) {
      case 'excel':
        return this.createExcelFile(patients, 'patients');
      case 'csv':
        return this.createCSVFile(patients, 'patients');
      case 'json':
        return this.createJSONFile(patients, 'patients');
      default:
        throw new Error('Unsupported export format');
    }
  }

  async exportLabResults(tenantId: string, options: ExportOptions) {
    const labResults = await this.prisma.labResult.findMany({
      where: {
        tenantId,
        ...(options.dateRange && {
          reportedAt: {
            gte: options.dateRange.startDate,
            lte: options.dateRange.endDate,
          },
        }),
      },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
        test: true,
      },
    });

    switch (options.format) {
      case 'excel':
        return this.createExcelFile(labResults, 'lab-results');
      case 'csv':
        return this.createCSVFile(labResults, 'lab-results');
      case 'json':
        return this.createJSONFile(labResults, 'lab-results');
      default:
        throw new Error('Unsupported export format');
    }
  }

  async exportFinancialData(tenantId: string, options: ExportOptions) {
    const invoices = await this.prisma.invoice.findMany({
      where: {
        tenantId,
        ...(options.dateRange && {
          createdAt: {
            gte: options.dateRange.startDate,
            lte: options.dateRange.endDate,
          },
        }),
      },
      include: {
        patient: true,
        payments: true,
      },
    });

    const prescriptions = await this.prisma.prescription.findMany({
      where: {
        tenantId,
        ...(options.dateRange && {
          createdAt: {
            gte: options.dateRange.startDate,
            lte: options.dateRange.endDate,
          },
        }),
      },
      include: {
        patient: true,
      },
    });

    const data = {
      invoices,
      prescriptions,
      summary: {
        totalInvoices: invoices.length,
        totalRevenue: invoices.reduce((sum, inv) => sum + inv.amountCents, 0),
        totalPrescriptions: prescriptions.length,
      },
    };

    switch (options.format) {
      case 'excel':
        return this.createFinancialExcelFile(data);
      case 'json':
        return this.createJSONFile(data, 'financial-data');
      default:
        throw new Error('Unsupported export format for financial data');
    }
  }

  async createFullBackup(tenantId: string, options: BackupOptions = {}) {
    this.logger.log(`Creating full backup for tenant: ${tenantId}`);

    const backupData = {
      metadata: {
        tenantId,
        createdAt: new Date(),
        version: '1.0',
      },
      patients: await this.prisma.patient.findMany({
        where: { tenantId },
        include: {
          appointments: true,
          labOrders: {
            include: {
              samples: true,
              results: true,
            },
          },
          prescriptions: true,
          invoices: {
            include: {
              payments: true,
            },
          },
          admissions: true,
          encounters: true,
          emergencyCases: true,
        },
      }),
      users: await this.prisma.user.findMany({
        where: { tenantId },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      labTests: await this.prisma.labTest.findMany({
        where: { tenantId },
      }),
      inventoryItems: await this.prisma.inventoryItem.findMany({
        where: { tenantId },
      }),
      chambers: await this.prisma.chamber.findMany({
        where: { tenantId },
      }),
    };

    if (options.includeAuditLogs) {
      (backupData as any)['auditLogs'] = await this.prisma.auditLog.findMany({
        where: { tenantId },
      });
    }

    if (options.includeNotifications) {
      (backupData as any)['notifications'] = await this.prisma.notification.findMany({
        where: { tenantId },
      });
    }

    const fileName = `backup-${tenantId}-${new Date().toISOString().split('T')[0]}.json`;
    const filePath = join(process.cwd(), 'backups', fileName);

    if (options.compress) {
      const compressedFileName = `${fileName}.gz`;
      const compressedFilePath = join(process.cwd(), 'backups', compressedFileName);
      
      await pipelineAsync(
        JSON.stringify(backupData),
        createGzip(),
        createWriteStream(compressedFilePath)
      );
      
      return { filePath: compressedFilePath, fileName: compressedFileName };
    }

    await this.writeJSONFile(filePath, backupData);
    return { filePath, fileName };
  }

  async restoreFromBackup(tenantId: string, backupFilePath: string) {
    this.logger.log(`Restoring backup for tenant: ${tenantId}`);

    const backupData = JSON.parse(await this.readFile(backupFilePath));

    // Validate backup data
    if (backupData.metadata?.tenantId !== tenantId) {
      throw new Error('Backup tenant ID does not match');
    }

    // Begin transaction for atomic restore
    await this.prisma.$transaction(async (tx) => {
      // Clear existing data (be careful!)
      await tx.emergencyCase.deleteMany({ where: { tenantId } });
      await tx.encounter.deleteMany({ where: { tenantId } });
      await tx.admission.deleteMany({ where: { tenantId } });
      await tx.labResult.deleteMany({ where: { tenantId } });
      await tx.labSample.deleteMany({ where: { tenantId } });
      await tx.labOrder.deleteMany({ where: { tenantId } });
      await tx.prescription.deleteMany({ where: { tenantId } });
      await tx.appointment.deleteMany({ where: { tenantId } });
      await tx.patient.deleteMany({ where: { tenantId } });

      // Restore data
      for (const patient of backupData.patients) {
        await tx.patient.create({
          data: {
            ...patient,
            appointments: {
              create: patient.appointments,
            },
            labOrders: {
              create: patient.labOrders.map((order: any) => ({
                ...order,
                samples: {
                  create: order.samples,
                },
                results: {
                  create: order.results,
                },
              })),
            },
            prescriptions: {
              create: patient.prescriptions,
            },
            invoices: {
              create: patient.invoices.map((invoice: any) => ({
                ...invoice,
                payments: {
                  create: invoice.payments,
                },
              })),
            },
            admissions: {
              create: patient.admissions,
            },
            encounters: {
              create: patient.encounters,
            },
            emergencyCases: {
              create: patient.emergencyCases,
            },
          },
        });
      }
    });

    this.logger.log(`Backup restored successfully for tenant: ${tenantId}`);
  }

  private async createExcelFile(data: any[], sheetName: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length > 0) {
      // Add headers
      const headers = Object.keys(this.flattenObject(data[0]));
      worksheet.addRow(headers);

      // Add data rows
      data.forEach(item => {
        const flatItem = this.flattenObject(item);
        worksheet.addRow(Object.values(flatItem));
      });

      // Style headers
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };
    }

    const fileName = `${sheetName}-${new Date().toISOString().split('T')[0]}.xlsx`;
    const filePath = join(process.cwd(), 'exports', fileName);
    
    await workbook.xlsx.writeFile(filePath);
    return { filePath, fileName };
  }

  private async createCSVFile(data: any[], fileName: string) {
    if (data.length === 0) {
      throw new Error('No data to export');
    }

    const flatData = data.map(item => this.flattenObject(item));
    const headers = Object.keys(flatData[0]);
    
    let csvContent = headers.join(',') + '\n';
    flatData.forEach(item => {
      csvContent += Object.values(item).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',') + '\n';
    });

    const csvFileName = `${fileName}-${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = join(process.cwd(), 'exports', csvFileName);
    
    await this.writeFile(filePath, csvContent);
    return { filePath, fileName: csvFileName };
  }

  private async createJSONFile(data: any, fileName: string) {
    const jsonFileName = `${fileName}-${new Date().toISOString().split('T')[0]}.json`;
    const filePath = join(process.cwd(), 'exports', jsonFileName);
    
    await this.writeJSONFile(filePath, data);
    return { filePath, fileName: jsonFileName };
  }

  private async createFinancialExcelFile(data: any) {
    const workbook = new ExcelJS.Workbook();
    
    // Invoices sheet
    const invoicesSheet = workbook.addWorksheet('Invoices');
    if (data.invoices.length > 0) {
      const invoiceHeaders = Object.keys(this.flattenObject(data.invoices[0]));
      invoicesSheet.addRow(invoiceHeaders);
      data.invoices.forEach((invoice: any) => {
        invoicesSheet.addRow(Object.values(this.flattenObject(invoice)));
      });
    }

    // Prescriptions sheet
    const prescriptionsSheet = workbook.addWorksheet('Prescriptions');
    if (data.prescriptions.length > 0) {
      const prescriptionHeaders = Object.keys(this.flattenObject(data.prescriptions[0]));
      prescriptionsSheet.addRow(prescriptionHeaders);
      data.prescriptions.forEach((prescription: any) => {
        prescriptionsSheet.addRow(Object.values(this.flattenObject(prescription)));
      });
    }

    // Summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.addRow(['Metric', 'Value']);
    summarySheet.addRow(['Total Invoices', data.summary.totalInvoices]);
    summarySheet.addRow(['Total Revenue', data.summary.totalRevenue]);
    summarySheet.addRow(['Total Prescriptions', data.summary.totalPrescriptions]);

    const fileName = `financial-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    const filePath = join(process.cwd(), 'exports', fileName);
    
    await workbook.xlsx.writeFile(filePath);
    return { filePath, fileName };
  }

  private flattenObject(obj: any, prefix = ''): any {
    const flattened = {};
    
    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) {
        (flattened as any)[prefix + key] = '';
      } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
        Object.assign(flattened, this.flattenObject(obj[key], prefix + key + '.'));
      } else if (Array.isArray(obj[key])) {
        (flattened as any)[prefix + key] = (obj as any)[key].length;
      } else {
        (flattened as any)[prefix + key] = (obj as any)[key];
      }
    }
    
    return flattened;
  }

  private async writeFile(filePath: string, content: string) {
    const fs = require('fs').promises;
    await fs.mkdir(require('path').dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
  }

  private async writeJSONFile(filePath: string, data: any) {
    await this.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  private async readFile(filePath: string): Promise<string> {
    const fs = require('fs').promises;
    return fs.readFile(filePath, 'utf8');
  }
}
