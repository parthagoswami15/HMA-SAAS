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
var PacsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let PacsService = PacsService_1 = class PacsService {
    prisma;
    auditService;
    logger = new common_1.Logger(PacsService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async uploadStudy(studyDto, user) {
        this.logger.log(`Uploading PACS study for tenant: ${user.tenantId}`);
        const { patientId, studyInstanceUid, seriesInstanceUid, sopInstanceUid, modality, studyDescription, studyDate, studyTime, dicomData, } = studyDto;
        const existingStudy = await this.prisma.pacsStudy.findFirst({
            where: {
                studyInstanceUid,
                tenantId: user.tenantId,
            },
        });
        if (existingStudy) {
            throw new common_1.BadRequestException('Study already exists');
        }
        const study = await this.prisma.pacsStudy.create({
            data: {
                patientId,
                studyInstanceUid,
                seriesInstanceUid,
                sopInstanceUid,
                modality,
                studyDescription,
                studyDate: new Date(studyDate),
                studyTime,
                status: 'UPLOADED',
                uploadedBy: user.id,
                tenantId: user.tenantId,
                metadata: JSON.stringify(dicomData.metadata || {}),
            },
        });
        await this.storeDicomData(study.id, dicomData);
        await this.auditService.logActivity({
            action: 'PACS_STUDY_UPLOADED',
            entityType: 'PACS_STUDY',
            entityId: study.id,
            userId: user.id,
            details: { modality, studyDescription },
        });
        return {
            studyId: study.id,
            studyInstanceUid,
            status: 'UPLOADED',
        };
    }
    async getStudy(studyId, user) {
        this.logger.log(`Getting PACS study: ${studyId}`);
        const study = await this.prisma.pacsStudy.findFirst({
            where: {
                id: studyId,
                tenantId: user.tenantId,
            },
            include: {
                patient: { select: { id: true, name: true } },
                reports: {
                    select: {
                        id: true,
                        reportType: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!study) {
            throw new common_1.NotFoundException('Study not found');
        }
        return {
            studyId: study.id,
            patient: study.patient,
            studyInstanceUid: study.studyInstanceUid,
            modality: study.modality,
            studyDescription: study.studyDescription,
            studyDate: study.studyDate,
            studyTime: study.studyTime,
            status: study.status,
            reports: study.reports,
            metadata: JSON.parse(study.metadata || '{}'),
        };
    }
    async getPatientStudies(patientId, user) {
        this.logger.log(`Getting PACS studies for patient: ${patientId}`);
        const studies = await this.prisma.pacsStudy.findMany({
            where: {
                patientId,
                tenantId: user.tenantId,
            },
            orderBy: { studyDate: 'desc' },
        });
        return studies.map(study => ({
            studyId: study.id,
            studyInstanceUid: study.studyInstanceUid,
            modality: study.modality,
            studyDescription: study.studyDescription,
            studyDate: study.studyDate,
            status: study.status,
        }));
    }
    async addStudyReport(studyId, reportDto, user) {
        this.logger.log(`Adding report to PACS study: ${studyId}`);
        const { reportType, reportContent, findings, impression } = reportDto;
        const study = await this.prisma.pacsStudy.findFirst({
            where: {
                id: studyId,
                tenantId: user.tenantId,
            },
        });
        if (!study) {
            throw new common_1.NotFoundException('Study not found');
        }
        const report = await this.prisma.pacsReport.create({
            data: {
                studyId,
                reportType,
                reportContent,
                findings,
                impression,
                status: 'COMPLETED',
                createdBy: user.id,
                createdAt: new Date(),
            },
        });
        await this.prisma.pacsStudy.update({
            where: { id: studyId },
            data: {
                status: 'REPORTED',
                reportedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'PACS_REPORT_ADDED',
            entityType: 'PACS_REPORT',
            entityId: report.id,
            userId: user.id,
            details: { studyId, reportType },
        });
        return {
            reportId: report.id,
            studyId,
            status: 'COMPLETED',
        };
    }
    async getStatus(tenantId) {
        this.logger.log(`Getting PACS status for tenant: ${tenantId}`);
        const config = await this.prisma.integrationConfiguration.findFirst({
            where: {
                tenantId,
                integrationType: 'PACS',
            },
        });
        return {
            integrationType: 'PACS',
            status: config?.isActive ? 'HEALTHY' : 'ERROR',
            lastSyncAt: config?.lastSyncAt,
            isActive: config?.isActive || false,
        };
    }
    async getStats(tenantId) {
        this.logger.log(`Getting PACS stats for tenant: ${tenantId}`);
        const studyCount = await this.prisma.pacsStudy.count({ where: { tenantId } });
        const reportCount = await this.prisma.pacsReport.count({ where: { tenantId } });
        const studiesByModality = await this.prisma.pacsStudy.groupBy({
            by: ['modality'],
            where: { tenantId },
            _count: { modality: true },
        });
        const studiesByStatus = await this.prisma.pacsStudy.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: { status: true },
        });
        return {
            totalStudies: studyCount,
            totalReports: reportCount,
            studiesByModality,
            studiesByStatus,
        };
    }
    async retryOperation(log) {
        this.logger.log(`Retrying PACS operation: ${log.id}`);
        const retryResult = {
            success: true,
            message: 'Operation retried successfully',
        };
        return retryResult;
    }
    async storeDicomData(studyId, dicomData) {
        this.logger.log(`Storing DICOM data for study: ${studyId}`);
        await this.prisma.dicomStorage.create({
            data: {
                studyId,
                filePath: `dicom/${studyId}/`,
                fileSize: JSON.stringify(dicomData).length,
                storedAt: new Date(),
            },
        });
    }
};
exports.PacsService = PacsService;
exports.PacsService = PacsService = PacsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PacsService);
//# sourceMappingURL=pacs.service.js.map