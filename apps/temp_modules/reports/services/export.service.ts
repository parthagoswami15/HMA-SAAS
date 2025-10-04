import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import { SavedReport } from '../entities/reports.entity';
import { ExportRequestDto } from '../dto/reports.dto';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(
    @InjectRepository(SavedReport)
    private readonly savedReportRepo: Repository<SavedReport>,
  ) {}

  async exportReport(tenantId: string, userId: string, exportRequest: ExportRequestDto): Promise<any> {
    const { reportId, format, filters, columns, fileName } = exportRequest;

    // Get the report data
    const reportData = await this.getReportData(tenantId, reportId, filters);

    // Generate export based on format
    const exportId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    let buffer: Buffer;
    let mimeType: string;
    let extension: string;

    switch (format.toLowerCase()) {
      case 'csv':
        ({ buffer, mimeType, extension } = await this.generateCSV(reportData, columns));
        break;
      case 'xlsx':
        ({ buffer, mimeType, extension } = await this.generateExcel(reportData, columns));
        break;
      case 'pdf':
        ({ buffer, mimeType, extension } = await this.generatePDF(reportData, columns));
        break;
      case 'json':
        ({ buffer, mimeType, extension } = await this.generateJSON(reportData));
        break;
      default:
        throw new BadRequestException(`Unsupported export format: ${format}`);
    }

    // Save export record
    const savedExport = this.savedReportRepo.create({
      tenantId,
      reportId,
      name: fileName || `Export_${reportId}_${timestamp}`,
      data: { exportId, format, data: reportData, columns },
      status: 'GENERATED',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      generatedBy: userId,
      exportFormat: format as any,
    });

    await this.savedReportRepo.save(savedExport);

    const finalFileName = fileName ? `${fileName}.${extension}` : `export_${Date.now()}.${extension}`;

    return {
      exportId,
      fileName: finalFileName,
      mimeType,
      size: buffer.length,
      downloadUrl: `/reports/export/${exportId}`,
      expiresAt: savedExport.expiresAt,
    };
  }

  async downloadExport(tenantId: string, exportId: string): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
    const exportRecord = await this.savedReportRepo.findOne({
      where: { tenantId },
      select: ['id', 'data', 'exportFormat'],
    });

    if (!exportRecord) {
      throw new BadRequestException('Export not found or expired');
    }

    const { data, exportFormat } = exportRecord.data;

    let buffer: Buffer;
    let mimeType: string;
    let fileName: string;

    switch (exportFormat.toLowerCase()) {
      case 'csv':
        ({ buffer, mimeType } = await this.generateCSV(data, data.columns));
        fileName = `export_${exportId}.csv`;
        break;
      case 'xlsx':
        ({ buffer, mimeType } = await this.generateExcel(data, data.columns));
        fileName = `export_${exportId}.xlsx`;
        break;
      case 'pdf':
        ({ buffer, mimeType } = await this.generatePDF(data, data.columns));
        fileName = `export_${exportId}.pdf`;
        break;
      case 'json':
        ({ buffer, mimeType } = await this.generateJSON(data));
        fileName = `export_${exportId}.json`;
        break;
      default:
        throw new BadRequestException(`Unsupported export format: ${exportFormat}`);
    }

    return { buffer, fileName, mimeType };
  }

  async getExportStatus(tenantId: string, exportId: string): Promise<any> {
    const exportRecord = await this.savedReportRepo.findOne({
      where: { tenantId },
      select: ['id', 'status', 'createdAt', 'expiresAt', 'data'],
    });

    if (!exportRecord) {
      throw new BadRequestException('Export not found');
    }

    return {
      exportId,
      status: exportRecord.status,
      createdAt: exportRecord.createdAt,
      expiresAt: exportRecord.expiresAt,
      progress: exportRecord.status === 'GENERATED' ? 100 : 0,
    };
  }

  private async getReportData(tenantId: string, reportId: string, filters: Record<string, any>): Promise<any[]> {
    // This would typically call the ReportsService to execute the report
    // For now, returning mock data
    return [
      {
        id: '1',
        date: '2024-01-15',
        department: 'General Medicine',
        revenue: 15000,
        patients: 45,
        status: 'Completed',
      },
      {
        id: '2',
        date: '2024-01-16',
        department: 'Cardiology',
        revenue: 22000,
        patients: 32,
        status: 'Completed',
      },
      // ... more mock data
    ];
  }

  private async generateCSV(data: any[], columns?: string[]): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
    if (!data || data.length === 0) {
      throw new BadRequestException('No data to export');
    }

    // Determine columns if not provided
    if (!columns) {
      columns = Object.keys(data[0]);
    }

    const csvRows = [];

    // Add header row
    csvRows.push(columns.join(','));

    // Add data rows
    data.forEach(row => {
      const values = columns.map(col => {
        const value = row[col];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const buffer = Buffer.from(csvContent, 'utf8');

    return {
      buffer,
      mimeType: 'text/csv',
      extension: 'csv',
    };
  }

  private async generateExcel(data: any[], columns?: string[]): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
    if (!data || data.length === 0) {
      throw new BadRequestException('No data to export');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report Data');

    // Determine columns if not provided
    if (!columns) {
      columns = Object.keys(data[0]);
    }

    // Add header row
    worksheet.addRow(columns);

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' },
    };

    // Add data rows
    data.forEach(row => {
      const rowData = columns.map(col => row[col] ?? '');
      worksheet.addRow(rowData);
    });

    // Auto-size columns
    columns.forEach((col, index) => {
      const column = worksheet.getColumn(index + 1);
      column.width = Math.max(col.length, 15);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return {
      buffer: Buffer.from(buffer),
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: 'xlsx',
    };
  }

  private async generatePDF(data: any[], columns?: string[]): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
    if (!data || data.length === 0) {
      throw new BadRequestException('No data to export');
    }

    return new Promise((resolve, reject) => {
      try {
        const buffers: Buffer[] = [];
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        // Collect PDF data
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const buffer = Buffer.concat(buffers);
          resolve({
            buffer,
            mimeType: 'application/pdf',
            extension: 'pdf',
          });
        });

        // PDF Title
        doc.fontSize(18).text('Report Export', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        // Determine columns if not provided
        if (!columns) {
          columns = Object.keys(data[0]);
        }

        // Table headers
        const tableTop = doc.y;
        const columnWidth = (doc.page.width - 100) / columns.length;

        doc.font('Helvetica-Bold');
        columns.forEach((col, index) => {
          doc.text(col, 50 + (index * columnWidth), tableTop, {
            width: columnWidth,
            align: 'left',
          });
        });

        doc.moveDown();
        doc.font('Helvetica');

        // Table rows
        data.forEach((row, rowIndex) => {
          const rowTop = doc.y;

          columns.forEach((col, colIndex) => {
            const value = row[col] ?? '';
            doc.text(String(value), 50 + (colIndex * columnWidth), rowTop, {
              width: columnWidth,
              align: 'left',
            });
          });

          doc.moveDown(0.5);

          // Add line separator every 10 rows
          if ((rowIndex + 1) % 10 === 0 && rowIndex < data.length - 1) {
            doc.moveDown();
            doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
            doc.moveDown();
          }
        });

        // Add page numbers if multiple pages
        let pageNumber = 1;
        doc.on('pageAdded', () => {
          pageNumber++;
          doc.fontSize(10).text(`Page ${pageNumber}`, 50, doc.page.height - 50, { align: 'center' });
        });

        doc.end();
      } catch (error) {
        reject(new BadRequestException(`Failed to generate PDF: ${error.message}`));
      }
    });
  }

  private async generateJSON(data: any[]): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
    if (!data || data.length === 0) {
      throw new BadRequestException('No data to export');
    }

    const jsonContent = JSON.stringify({
      exportInfo: {
        generatedAt: new Date().toISOString(),
        recordCount: data.length,
        version: '1.0',
      },
      data,
    }, null, 2);

    const buffer = Buffer.from(jsonContent, 'utf8');

    return {
      buffer,
      mimeType: 'application/json',
      extension: 'json',
    };
  }

  async generateScheduledReport(
    tenantId: string,
    reportId: string,
    scheduleId: string,
    format: string,
  ): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
    // Get the report data
    const reportData = await this.getReportData(tenantId, reportId, {});

    let buffer: Buffer;
    let mimeType: string;
    let extension: string;

    switch (format.toLowerCase()) {
      case 'csv':
        ({ buffer, mimeType, extension } = await this.generateCSV(reportData));
        break;
      case 'xlsx':
        ({ buffer, mimeType, extension } = await this.generateExcel(reportData));
        break;
      case 'pdf':
        ({ buffer, mimeType, extension } = await this.generatePDF(reportData));
        break;
      default:
        ({ buffer, mimeType, extension } = await this.generateCSV(reportData));
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `scheduled_report_${reportId}_${timestamp}.${extension}`;

    return { buffer, fileName, mimeType };
  }

  async cleanupExpiredExports(): Promise<void> {
    const expiredExports = await this.savedReportRepo.find({
      where: {
        status: 'GENERATED',
        expiresAt: LessThan(new Date()),
      },
    });

    if (expiredExports.length > 0) {
      await this.savedReportRepo.remove(expiredExports);
      this.logger.log(`Cleaned up ${expiredExports.length} expired exports`);
    }
  }
}
