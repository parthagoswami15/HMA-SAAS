"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let ReportService = ReportService_1 = class ReportService {
    prisma;
    auditService;
    logger = new common_1.Logger(ReportService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getReports(query, user) {
        this.logger.log(`Getting reports for user: ${user.id}`);
        const { reportType, fromDate, toDate, status, page = 1, limit = 10, } = query;
        const where = { patientId: user.id };
        if (reportType)
            where.reportType = reportType;
        if (status)
            where.status = status;
        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate)
                where.createdAt.gte = new Date(fromDate);
            if (toDate)
                where.createdAt.lte = new Date(toDate);
        }
        const reports = await this.prisma.medicalReport.findMany({
            where,
            include: {
                doctor: { select: { name: true, specialization: true } },
                appointment: { select: { id: true, appointmentType: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await this.prisma.medicalReport.count({ where });
        return {
            reports,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getReport(reportId, user) {
        this.logger.log(`Getting report: ${reportId}`);
        const report = await this.prisma.medicalReport.findFirst({
            where: {
                id: reportId,
                patientId: user.id,
            },
            include: {
                doctor: { select: { name: true, specialization: true } },
                appointment: { select: { id: true, appointmentType: true } },
            },
        });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        return report;
    }
    async downloadReport(reportId, user) {
        this.logger.log(`Downloading report: ${reportId}`);
        const report = await this.prisma.medicalReport.findFirst({
            where: {
                id: reportId,
                patientId: user.id,
            },
        });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        if (report.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Report is not ready for download');
        }
        const fileContent = await this.getReportFile(report.fileUrl);
        await this.auditService.logActivity({
            action: 'REPORT_DOWNLOADED',
            entityType: 'MEDICAL_REPORT',
            entityId: reportId,
            userId: user.id,
        });
        return {
            reportId,
            fileName: report.fileName,
            fileType: report.fileType,
            content: fileContent,
        };
    }
    async getPrescriptions(query, user) {
        this.logger.log(`Getting prescriptions for user: ${user.id}`);
        const { fromDate, toDate, doctorId, page = 1, limit = 10, } = query;
        const where = { patientId: user.id };
        if (doctorId)
            where.doctorId = doctorId;
        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate)
                where.createdAt.gte = new Date(fromDate);
            if (toDate)
                where.createdAt.lte = new Date(toDate);
        }
        const prescriptions = await this.prisma.prescription.findMany({
            where,
            include: {
                doctor: { select: { name: true, specialization: true } },
                appointment: { select: { id: true, appointmentType: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await this.prisma.prescription.count({ where });
        return {
            prescriptions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getPrescription(prescriptionId, user) {
        this.logger.log(`Getting prescription: ${prescriptionId}`);
        const prescription = await this.prisma.prescription.findFirst({
            where: {
                id: prescriptionId,
                patientId: user.id,
            },
            include: {
                doctor: { select: { name: true, specialization: true } },
                appointment: { select: { id: true, appointmentType: true } },
                medications: true,
            },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        return prescription;
    }
    async downloadPrescription(prescriptionId, user) {
        this.logger.log(`Downloading prescription: ${prescriptionId}`);
        const prescription = await this.prisma.prescription.findFirst({
            where: {
                id: prescriptionId,
                patientId: user.id,
            },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        const pdfContent = await this.generatePrescriptionPdf(prescription);
        await this.auditService.logActivity({
            action: 'PRESCRIPTION_DOWNLOADED',
            entityType: 'PRESCRIPTION',
            entityId: prescriptionId,
            userId: user.id,
        });
        return {
            prescriptionId,
            fileName: `prescription_${prescription.id}.pdf`,
            content: pdfContent,
        };
    }
    async shareDocument(shareDto, user) {
        this.logger.log(`Sharing document for user: ${user.id}`);
        const { documentId, documentType, recipientEmail, recipientPhone, message } = shareDto;
        let document;
        if (documentType === 'REPORT') {
            document = await this.prisma.medicalReport.findFirst({
                where: { id: documentId, patientId: user.id },
            });
        }
        else if (documentType === 'PRESCRIPTION') {
            document = await this.prisma.prescription.findFirst({
                where: { id: documentId, patientId: user.id },
            });
        }
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        const share = await this.prisma.documentShare.create({
            data: {
                documentId,
                documentType,
                sharedBy: user.id,
                recipientEmail,
                recipientPhone,
                message,
                shareToken: this.generateShareToken(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
        });
        await this.sendShareNotification(share);
        await this.auditService.logActivity({
            action: 'DOCUMENT_SHARED',
            entityType: 'DOCUMENT_SHARE',
            entityId: share.id,
            userId: user.id,
            details: { documentType, recipientEmail },
        });
        return {
            shareId: share.id,
            shareToken: share.shareToken,
            expiresAt: share.expiresAt,
        };
    }
    async requestDocumentAccess(accessDto, user) {
        this.logger.log(`Requesting document access for user: ${user.id}`);
        const { documentId, documentType, requestMessage } = accessDto;
        const accessRequest = await this.prisma.documentAccessRequest.create({
            data: {
                documentId,
                documentType,
                requestedBy: user.id,
                requestMessage,
                status: 'PENDING',
            },
        });
        await this.notifyDocumentOwner(accessRequest);
        await this.auditService.logActivity({
            action: 'DOCUMENT_ACCESS_REQUESTED',
            entityType: 'DOCUMENT_ACCESS_REQUEST',
            entityId: accessRequest.id,
            userId: user.id,
            details: { documentType },
        });
        return {
            requestId: accessRequest.id,
            status: 'PENDING',
            message: 'Access request submitted successfully',
        };
    }
    async getReportStats(user) {
        const totalReports = await this.prisma.medicalReport.count({
            where: { patientId: user.id },
        });
        const reportsByType = await this.prisma.medicalReport.groupBy({
            by: ['reportType'],
            where: { patientId: user.id },
            _count: { reportType: true },
        });
        const reportsByStatus = await this.prisma.medicalReport.groupBy({
            by: ['status'],
            where: { patientId: user.id },
            _count: { status: true },
        });
        const totalPrescriptions = await this.prisma.prescription.count({
            where: { patientId: user.id },
        });
        return {
            userId: user.id,
            totalReports,
            reportsByType,
            reportsByStatus,
            totalPrescriptions,
        };
    }
    async getReportFile(fileUrl) {
        this.logger.log(`Getting report file: ${fileUrl}`);
        return Buffer.from('Mock report content');
    }
    async generatePrescriptionPdf(prescription) {
        this.logger.log(`Generating PDF for prescription: ${prescription.id}`);
        return Buffer.from('Mock prescription PDF content');
    }
    generateShareToken() {
        return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async sendShareNotification(share) {
        console.log(`Share notification sent for share ${share.id}`);
    }
    async notifyDocumentOwner(accessRequest) {
        console.log(`Access request notification sent for request ${accessRequest.id}`);
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = ReportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ReportService);
//# sourceMappingURL=report.service.js.map