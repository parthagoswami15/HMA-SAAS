"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ExportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ExcelJS = __importStar(require("exceljs"));
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const stream_1 = require("stream");
const zlib_1 = require("zlib");
const pipelineAsync = (0, util_1.promisify)(stream_1.pipeline);
let ExportService = ExportService_1 = class ExportService {
    prisma;
    logger = new common_1.Logger(ExportService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async exportPatients(tenantId, options) {
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
    async exportLabResults(tenantId, options) {
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
    async exportFinancialData(tenantId, options) {
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
    async createFullBackup(tenantId, options = {}) {
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
            backupData['auditLogs'] = await this.prisma.auditLog.findMany({
                where: { tenantId },
            });
        }
        if (options.includeNotifications) {
            backupData['notifications'] = await this.prisma.notification.findMany({
                where: { tenantId },
            });
        }
        const fileName = `backup-${tenantId}-${new Date().toISOString().split('T')[0]}.json`;
        const filePath = (0, path_1.join)(process.cwd(), 'backups', fileName);
        if (options.compress) {
            const compressedFileName = `${fileName}.gz`;
            const compressedFilePath = (0, path_1.join)(process.cwd(), 'backups', compressedFileName);
            await pipelineAsync(JSON.stringify(backupData), (0, zlib_1.createGzip)(), (0, fs_1.createWriteStream)(compressedFilePath));
            return { filePath: compressedFilePath, fileName: compressedFileName };
        }
        await this.writeJSONFile(filePath, backupData);
        return { filePath, fileName };
    }
    async restoreFromBackup(tenantId, backupFilePath) {
        this.logger.log(`Restoring backup for tenant: ${tenantId}`);
        const backupData = JSON.parse(await this.readFile(backupFilePath));
        if (backupData.metadata?.tenantId !== tenantId) {
            throw new Error('Backup tenant ID does not match');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.emergencyCase.deleteMany({ where: { tenantId } });
            await tx.encounter.deleteMany({ where: { tenantId } });
            await tx.admission.deleteMany({ where: { tenantId } });
            await tx.labResult.deleteMany({ where: { tenantId } });
            await tx.labSample.deleteMany({ where: { tenantId } });
            await tx.labOrder.deleteMany({ where: { tenantId } });
            await tx.prescription.deleteMany({ where: { tenantId } });
            await tx.appointment.deleteMany({ where: { tenantId } });
            await tx.patient.deleteMany({ where: { tenantId } });
            for (const patient of backupData.patients) {
                await tx.patient.create({
                    data: {
                        ...patient,
                        appointments: {
                            create: patient.appointments,
                        },
                        labOrders: {
                            create: patient.labOrders.map((order) => ({
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
                            create: patient.invoices.map((invoice) => ({
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
    async createExcelFile(data, sheetName) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);
        if (data.length > 0) {
            const headers = Object.keys(this.flattenObject(data[0]));
            worksheet.addRow(headers);
            data.forEach(item => {
                const flatItem = this.flattenObject(item);
                worksheet.addRow(Object.values(flatItem));
            });
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' },
            };
        }
        const fileName = `${sheetName}-${new Date().toISOString().split('T')[0]}.xlsx`;
        const filePath = (0, path_1.join)(process.cwd(), 'exports', fileName);
        await workbook.xlsx.writeFile(filePath);
        return { filePath, fileName };
    }
    async createCSVFile(data, fileName) {
        if (data.length === 0) {
            throw new Error('No data to export');
        }
        const flatData = data.map(item => this.flattenObject(item));
        const headers = Object.keys(flatData[0]);
        let csvContent = headers.join(',') + '\n';
        flatData.forEach(item => {
            csvContent += Object.values(item).map(value => typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value).join(',') + '\n';
        });
        const csvFileName = `${fileName}-${new Date().toISOString().split('T')[0]}.csv`;
        const filePath = (0, path_1.join)(process.cwd(), 'exports', csvFileName);
        await this.writeFile(filePath, csvContent);
        return { filePath, fileName: csvFileName };
    }
    async createJSONFile(data, fileName) {
        const jsonFileName = `${fileName}-${new Date().toISOString().split('T')[0]}.json`;
        const filePath = (0, path_1.join)(process.cwd(), 'exports', jsonFileName);
        await this.writeJSONFile(filePath, data);
        return { filePath, fileName: jsonFileName };
    }
    async createFinancialExcelFile(data) {
        const workbook = new ExcelJS.Workbook();
        const invoicesSheet = workbook.addWorksheet('Invoices');
        if (data.invoices.length > 0) {
            const invoiceHeaders = Object.keys(this.flattenObject(data.invoices[0]));
            invoicesSheet.addRow(invoiceHeaders);
            data.invoices.forEach((invoice) => {
                invoicesSheet.addRow(Object.values(this.flattenObject(invoice)));
            });
        }
        const prescriptionsSheet = workbook.addWorksheet('Prescriptions');
        if (data.prescriptions.length > 0) {
            const prescriptionHeaders = Object.keys(this.flattenObject(data.prescriptions[0]));
            prescriptionsSheet.addRow(prescriptionHeaders);
            data.prescriptions.forEach((prescription) => {
                prescriptionsSheet.addRow(Object.values(this.flattenObject(prescription)));
            });
        }
        const summarySheet = workbook.addWorksheet('Summary');
        summarySheet.addRow(['Metric', 'Value']);
        summarySheet.addRow(['Total Invoices', data.summary.totalInvoices]);
        summarySheet.addRow(['Total Revenue', data.summary.totalRevenue]);
        summarySheet.addRow(['Total Prescriptions', data.summary.totalPrescriptions]);
        const fileName = `financial-report-${new Date().toISOString().split('T')[0]}.xlsx`;
        const filePath = (0, path_1.join)(process.cwd(), 'exports', fileName);
        await workbook.xlsx.writeFile(filePath);
        return { filePath, fileName };
    }
    flattenObject(obj, prefix = '') {
        const flattened = {};
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                flattened[prefix + key] = '';
            }
            else if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
                Object.assign(flattened, this.flattenObject(obj[key], prefix + key + '.'));
            }
            else if (Array.isArray(obj[key])) {
                flattened[prefix + key] = obj[key].length;
            }
            else {
                flattened[prefix + key] = obj[key];
            }
        }
        return flattened;
    }
    async writeFile(filePath, content) {
        const fs = require('fs').promises;
        await fs.mkdir(require('path').dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content, 'utf8');
    }
    async writeJSONFile(filePath, data) {
        await this.writeFile(filePath, JSON.stringify(data, null, 2));
    }
    async readFile(filePath) {
        const fs = require('fs').promises;
        return fs.readFile(filePath, 'utf8');
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = ExportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportService);
//# sourceMappingURL=export.service.js.map