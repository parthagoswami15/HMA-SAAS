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
var PcpndtService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PcpndtService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
let PcpndtService = PcpndtService_1 = class PcpndtService {
    prisma;
    auditService;
    logger = new common_1.Logger(PcpndtService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async requestAccess(requestDto, user) {
        this.logger.log(`PC-PNDT access request from user ${user.id}`);
        const userCertification = await this.prisma.userCertification.findFirst({
            where: {
                userId: user.id,
                certificationType: 'PCPNDT',
                status: 'ACTIVE',
                validTill: { gte: new Date() },
            },
        });
        if (!userCertification) {
            throw new common_1.BadRequestException('PC-PNDT certification required for access');
        }
        const accessRequest = await this.prisma.pcpndtAccessRequest.create({
            data: {
                userId: user.id,
                patientId: requestDto.patientId,
                procedureType: requestDto.procedureType,
                reason: requestDto.reason,
                status: 'PENDING',
                requestedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'PCPNDT_ACCESS_REQUESTED',
            entityType: 'PCPNDT_ACCESS',
            entityId: accessRequest.id,
            userId: user.id,
            details: {
                patientId: requestDto.patientId,
                procedureType: requestDto.procedureType,
                reason: requestDto.reason,
            },
        });
        return {
            id: accessRequest.id,
            status: accessRequest.status,
            requestedAt: accessRequest.requestedAt,
        };
    }
    async approveAccess(requestId, approverUser) {
        this.logger.log(`Approving PC-PNDT access request ${requestId}`);
        const accessRequest = await this.prisma.pcpndtAccessRequest.findUnique({
            where: { id: requestId },
        });
        if (!accessRequest) {
            throw new common_1.NotFoundException('Access request not found');
        }
        if (accessRequest.status !== 'PENDING') {
            throw new common_1.BadRequestException('Request already processed');
        }
        const updatedRequest = await this.prisma.pcpndtAccessRequest.update({
            where: { id: requestId },
            data: {
                status: 'APPROVED',
                approvedBy: approverUser.id,
                approvedAt: new Date(),
            },
        });
        await this.prisma.pcpndtAccessLog.create({
            data: {
                requestId,
                userId: accessRequest.userId,
                patientId: accessRequest.patientId,
                procedureType: accessRequest.procedureType,
                accessedAt: new Date(),
                ipAddress: approverUser.ipAddress,
                userAgent: approverUser.userAgent,
            },
        });
        await this.auditService.logActivity({
            action: 'PCPNDT_ACCESS_APPROVED',
            entityType: 'PCPNDT_ACCESS',
            entityId: requestId,
            userId: approverUser.id,
            details: { requestId, patientId: accessRequest.patientId },
        });
        return updatedRequest;
    }
    async denyAccess(requestId, reason, approverUser) {
        this.logger.log(`Denying PC-PNDT access request ${requestId}`);
        const accessRequest = await this.prisma.pcpndtAccessRequest.findUnique({
            where: { id: requestId },
        });
        if (!accessRequest) {
            throw new common_1.NotFoundException('Access request not found');
        }
        const updatedRequest = await this.prisma.pcpndtAccessRequest.update({
            where: { id: requestId },
            data: {
                status: 'DENIED',
                denialReason: reason,
                deniedBy: approverUser.id,
                deniedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'PCPNDT_ACCESS_DENIED',
            entityType: 'PCPNDT_ACCESS',
            entityId: requestId,
            userId: approverUser.id,
            details: { requestId, patientId: accessRequest.patientId, reason },
        });
        return updatedRequest;
    }
    async getAccessLogs(query, user) {
        this.logger.log(`Retrieving PC-PNDT access logs for user ${user.id}`);
        const { patientId, userId, fromDate, toDate, page = '1', limit = '50' } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (patientId)
            where.patientId = patientId;
        if (userId)
            where.userId = userId;
        if (fromDate || toDate) {
            where.accessedAt = {};
            if (fromDate)
                where.accessedAt.gte = new Date(fromDate);
            if (toDate)
                where.accessedAt.lte = new Date(toDate);
        }
        const [logs, total] = await Promise.all([
            this.prisma.pcpndtAccessLog.findMany({
                where,
                include: {
                    request: true,
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
                orderBy: { accessedAt: 'desc' },
                skip,
                take: limitNum,
            }),
            this.prisma.pcpndtAccessLog.count({ where }),
        ]);
        await this.auditService.logActivity({
            action: 'PCPNDT_LOGS_ACCESSED',
            entityType: 'PCPNDT_ACCESS',
            userId: user.id,
            details: { filters: query, count: total },
        });
        return {
            logs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        };
    }
    async getComplianceStatus() {
        const totalRequests = await this.prisma.pcpndtAccessRequest.count();
        const approvedRequests = await this.prisma.pcpndtAccessRequest.count({
            where: { status: 'APPROVED' },
        });
        const deniedRequests = await this.prisma.pcpndtAccessRequest.count({
            where: { status: 'DENIED' },
        });
        const pendingRequests = totalRequests - approvedRequests - deniedRequests;
        const totalAccessLogs = await this.prisma.pcpndtAccessLog.count();
        return {
            totalRecords: totalRequests,
            compliantRecords: approvedRequests,
            nonCompliantRecords: pendingRequests + deniedRequests,
            compliancePercentage: totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 100,
            lastUpdated: new Date(),
            details: {
                totalRequests,
                approvedRequests,
                deniedRequests,
                pendingRequests,
                totalAccessLogs,
            },
        };
    }
    async validateCompliance(entityId) {
        const request = await this.prisma.pcpndtAccessRequest.findUnique({
            where: { id: entityId },
        });
        if (!request) {
            return {
                isCompliant: false,
                issues: ['PC-PNDT access request not found'],
            };
        }
        const issues = [];
        if (request.status === 'PENDING') {
            issues.push('Access request is pending');
        }
        if (request.status === 'DENIED') {
            issues.push('Access request was denied');
        }
        return {
            isCompliant: issues.length === 0,
            issues,
        };
    }
    async getCertificationStatus(userId) {
        const certifications = await this.prisma.userCertification.findMany({
            where: {
                userId,
                certificationType: 'PCPNDT',
                OR: [
                    { status: 'ACTIVE' },
                    { validTill: { gte: new Date() } },
                ],
            },
            orderBy: { validTill: 'desc' },
        });
        return certifications;
    }
    async validateUserCertification(userId) {
        const activeCertification = await this.prisma.userCertification.findFirst({
            where: {
                userId,
                certificationType: 'PCPNDT',
                status: 'ACTIVE',
                validTill: { gte: new Date() },
            },
        });
        return !!activeCertification;
    }
};
exports.PcpndtService = PcpndtService;
exports.PcpndtService = PcpndtService = PcpndtService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PcpndtService);
//# sourceMappingURL=pcpndt.service.js.map