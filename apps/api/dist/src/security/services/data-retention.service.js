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
var DataRetentionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataRetentionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
let DataRetentionService = DataRetentionService_1 = class DataRetentionService {
    prisma;
    auditService;
    logger = new common_1.Logger(DataRetentionService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getRetentionPolicies(tenantId) {
        const policies = await this.prisma.dataRetentionPolicy.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
        return policies;
    }
    async createRetentionPolicy(policyDto, user) {
        this.logger.log(`Creating retention policy for tenant: ${user.tenantId}`);
        const { dataType, retentionPeriod, description } = policyDto;
        const policy = await this.prisma.dataRetentionPolicy.create({
            data: {
                tenantId: user.tenantId,
                dataType,
                retentionPeriod,
                description,
                createdBy: user.id,
                isActive: true,
            },
        });
        await this.auditService.logActivity({
            action: 'RETENTION_POLICY_CREATED',
            entityType: 'DATA_RETENTION_POLICY',
            entityId: policy.id,
            userId: user.id,
            details: { dataType, retentionPeriod },
        });
        return policy;
    }
    async updateRetentionPolicy(policyId, policyDto, user) {
        this.logger.log(`Updating retention policy: ${policyId}`);
        const policy = await this.prisma.dataRetentionPolicy.update({
            where: { id: policyId },
            data: {
                ...policyDto,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'RETENTION_POLICY_UPDATED',
            entityType: 'DATA_RETENTION_POLICY',
            entityId: policyId,
            userId: user.id,
        });
        return policy;
    }
    async deleteRetentionPolicy(policyId, user) {
        this.logger.log(`Deleting retention policy: ${policyId}`);
        await this.prisma.dataRetentionPolicy.delete({
            where: { id: policyId },
        });
        await this.auditService.logActivity({
            action: 'RETENTION_POLICY_DELETED',
            entityType: 'DATA_RETENTION_POLICY',
            entityId: policyId,
            userId: user.id,
        });
        return { success: true };
    }
    async requestDataErasure(erasureDto, user) {
        this.logger.log(`Processing data erasure request for user: ${user.id}`);
        const { dataTypes, reason } = erasureDto;
        const erasureRequest = await this.prisma.dataErasureRequest.create({
            data: {
                userId: user.id,
                tenantId: user.tenantId,
                dataTypes,
                reason,
                status: 'PENDING',
                requestedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'DATA_ERASURE_REQUESTED',
            entityType: 'DATA_ERASURE_REQUEST',
            entityId: erasureRequest.id,
            userId: user.id,
            details: { dataTypes, reason },
        });
        return erasureRequest;
    }
    async getDataErasureRequests(tenantId) {
        const requests = await this.prisma.dataErasureRequest.findMany({
            where: { tenantId },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { requestedAt: 'desc' },
        });
        return requests;
    }
    async processDataErasure(requestId, user) {
        this.logger.log(`Processing data erasure request: ${requestId}`);
        const erasureRequest = await this.prisma.dataErasureRequest.findUnique({
            where: { id: requestId },
        });
        if (!erasureRequest) {
            throw new Error('Erasure request not found');
        }
        for (const dataType of erasureRequest.dataTypes) {
            await this.eraseDataByType(erasureRequest.userId, dataType);
        }
        await this.prisma.dataErasureRequest.update({
            where: { id: requestId },
            data: {
                status: 'COMPLETED',
                processedAt: new Date(),
                processedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'DATA_ERASURE_COMPLETED',
            entityType: 'DATA_ERASURE_REQUEST',
            entityId: requestId,
            userId: user.id,
            details: { dataTypes: erasureRequest.dataTypes },
        });
        return { success: true };
    }
    async eraseDataByType(userId, dataType) {
        switch (dataType) {
            case 'patient_records':
                await this.erasePatientRecords(userId);
                break;
            case 'consultation_data':
                await this.eraseConsultationData(userId);
                break;
            case 'audit_logs':
                await this.eraseAuditLogs(userId);
                break;
            case 'session_data':
                await this.eraseSessionData(userId);
                break;
            default:
                this.logger.warn(`Unknown data type for erasure: ${dataType}`);
        }
    }
    async erasePatientRecords(userId) {
        await this.prisma.patient.updateMany({
            where: { userId },
            data: {
                personalInfo: 'ANONYMIZED',
                contactInfo: 'ANONYMIZED',
                isActive: false,
            },
        });
    }
    async eraseConsultationData(userId) {
        await this.prisma.telemedicineConsultation.deleteMany({
            where: { patientId: userId },
        });
    }
    async eraseAuditLogs(userId) {
        await this.prisma.auditLog.deleteMany({
            where: { userId },
        });
    }
    async eraseSessionData(userId) {
        await this.prisma.session.deleteMany({
            where: { userId },
        });
    }
    async getRetentionStats(tenantId) {
        const policies = await this.prisma.dataRetentionPolicy.count({
            where: { tenantId },
        });
        const erasureRequests = await this.prisma.dataErasureRequest.count({
            where: { tenantId },
        });
        const pendingErasures = await this.prisma.dataErasureRequest.count({
            where: {
                tenantId,
                status: 'PENDING',
            },
        });
        return {
            tenantId,
            policiesConfigured: policies,
            totalErasureRequests: erasureRequests,
            pendingErasures,
        };
    }
};
exports.DataRetentionService = DataRetentionService;
exports.DataRetentionService = DataRetentionService = DataRetentionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], DataRetentionService);
//# sourceMappingURL=data-retention.service.js.map