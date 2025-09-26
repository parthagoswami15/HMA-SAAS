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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ExportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ExcelJS = __importStar(require("exceljs"));
const PDFDocument = __importStar(require("pdfkit"));
const reports_entity_1 = require("../entities/reports.entity");
let ExportService = ExportService_1 = class ExportService {
    savedReportRepo;
    logger = new common_1.Logger(ExportService_1.name);
    constructor(savedReportRepo) {
        this.savedReportRepo = savedReportRepo;
    }
    async exportReport(tenantId, userId, exportRequest) {
        const { reportId, format, filters, columns, fileName } = exportRequest;
        const reportData = await this.getReportData(tenantId, reportId, filters);
        const exportId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = new Date().toISOString();
        let buffer;
        let mimeType;
        let extension;
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
                throw new common_1.BadRequestException(`Unsupported export format: ${format}`);
        }
        const savedExport = this.savedReportRepo.create({
            tenantId,
            reportId,
            name: fileName || `Export_${reportId}_${timestamp}`,
            data: { exportId, format, data: reportData, columns },
            status: 'GENERATED',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            generatedBy: userId,
            exportFormat: format,
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
    async downloadExport(tenantId, exportId) {
        const exportRecord = await this.savedReportRepo.findOne({
            where: { tenantId },
            select: ['id', 'data', 'exportFormat'],
        });
        if (!exportRecord) {
            throw new common_1.BadRequestException('Export not found or expired');
        }
        const { data, exportFormat } = exportRecord.data;
        let buffer;
        let mimeType;
        let fileName;
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
                throw new common_1.BadRequestException(`Unsupported export format: ${exportFormat}`);
        }
        return { buffer, fileName, mimeType };
    }
    async getExportStatus(tenantId, exportId) {
        const exportRecord = await this.savedReportRepo.findOne({
            where: { tenantId },
            select: ['id', 'status', 'createdAt', 'expiresAt', 'data'],
        });
        if (!exportRecord) {
            throw new common_1.BadRequestException('Export not found');
        }
        return {
            exportId,
            status: exportRecord.status,
            createdAt: exportRecord.createdAt,
            expiresAt: exportRecord.expiresAt,
            progress: exportRecord.status === 'GENERATED' ? 100 : 0,
        };
    }
    async getReportData(tenantId, reportId, filters) {
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
        ];
    }
    async generateCSV(data, columns) {
        if (!data || data.length === 0) {
            throw new common_1.BadRequestException('No data to export');
        }
        if (!columns) {
            columns = Object.keys(data[0]);
        }
        const csvRows = [];
        csvRows.push(columns.join(','));
        data.forEach(row => {
            const values = columns.map(col => {
                const value = row[col];
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
    async generateExcel(data, columns) {
        if (!data || data.length === 0) {
            throw new common_1.BadRequestException('No data to export');
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report Data');
        if (!columns) {
            columns = Object.keys(data[0]);
        }
        worksheet.addRow(columns);
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' },
        };
        data.forEach(row => {
            const rowData = columns.map(col => row[col] ?? '');
            worksheet.addRow(rowData);
        });
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
    async generatePDF(data, columns) {
        if (!data || data.length === 0) {
            throw new common_1.BadRequestException('No data to export');
        }
        return new Promise((resolve, reject) => {
            try {
                const buffers = [];
                const doc = new PDFDocument({ margin: 50, size: 'A4' });
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const buffer = Buffer.concat(buffers);
                    resolve({
                        buffer,
                        mimeType: 'application/pdf',
                        extension: 'pdf',
                    });
                });
                doc.fontSize(18).text('Report Export', { align: 'center' });
                doc.moveDown();
                doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
                doc.moveDown(2);
                if (!columns) {
                    columns = Object.keys(data[0]);
                }
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
                    if ((rowIndex + 1) % 10 === 0 && rowIndex < data.length - 1) {
                        doc.moveDown();
                        doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
                        doc.moveDown();
                    }
                });
                let pageNumber = 1;
                doc.on('pageAdded', () => {
                    pageNumber++;
                    doc.fontSize(10).text(`Page ${pageNumber}`, 50, doc.page.height - 50, { align: 'center' });
                });
                doc.end();
            }
            catch (error) {
                reject(new common_1.BadRequestException(`Failed to generate PDF: ${error.message}`));
            }
        });
    }
    async generateJSON(data) {
        if (!data || data.length === 0) {
            throw new common_1.BadRequestException('No data to export');
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
    async generateScheduledReport(tenantId, reportId, scheduleId, format) {
        const reportData = await this.getReportData(tenantId, reportId, {});
        let buffer;
        let mimeType;
        let extension;
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
    async cleanupExpiredExports() {
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
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = ExportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reports_entity_1.SavedReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExportService);
//# sourceMappingURL=export.service.js.map