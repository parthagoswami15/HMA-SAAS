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
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuditService = AuditService_1 = class AuditService {
    prisma;
    logger = new common_1.Logger(AuditService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logActivity(activityDto) {
        this.logger.log(`Logging activity: ${activityDto.action}`);
        const auditLog = await this.prisma.auditLog.create({
            data: {
                userId: activityDto.userId,
                tenantId: activityDto.tenantId,
                action: activityDto.action,
                entityType: activityDto.entityType,
                entityId: activityDto.entityId,
                details: JSON.stringify(activityDto.details || {}),
                ipAddress: activityDto.ipAddress,
                userAgent: activityDto.userAgent,
                timestamp: new Date(),
            },
        });
        return auditLog;
    }
    async getAuditLogs(query, user) {
        const { fromDate, toDate, action, entityType, entityId, userId } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate)
            where.timestamp = { ...where.timestamp, gte: new Date(fromDate) };
        if (toDate)
            where.timestamp = { ...where.timestamp, lte: new Date(toDate) };
        if (action)
            where.action = action;
        if (entityType)
            where.entityType = entityType;
        if (entityId)
            where.entityId = entityId;
        if (userId)
            where.userId = userId;
        const auditLogs = await this.prisma.auditLog.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            take: 100,
        });
        return auditLogs.map(log => ({
            id: log.id,
            userId: log.userId,
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            details: JSON.parse(log.details || '{}'),
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            timestamp: log.timestamp,
        }));
    }
    async getEntityAuditLogs(entityType, entityId, user) {
        const auditLogs = await this.prisma.auditLog.findMany({
            where: {
                tenantId: user.tenantId,
                entityType,
                entityId,
            },
            orderBy: { timestamp: 'desc' },
        });
        return auditLogs.map(log => ({
            id: log.id,
            userId: log.userId,
            action: log.action,
            details: JSON.parse(log.details || '{}'),
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            timestamp: log.timestamp,
        }));
    }
    async getAuditStats(tenantId) {
        const totalLogs = await this.prisma.auditLog.count({
            where: { tenantId },
        });
        const logsLast24h = await this.prisma.auditLog.count({
            where: {
                tenantId,
                timestamp: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
        });
        const logsByAction = await this.prisma.auditLog.groupBy({
            by: ['action'],
            where: { tenantId },
            _count: { action: true },
        });
        const logsByEntityType = await this.prisma.auditLog.groupBy({
            by: ['entityType'],
            where: { tenantId },
            _count: { entityType: true },
        });
        return {
            tenantId,
            totalLogs,
            logsLast24h,
            logsByAction,
            logsByEntityType,
        };
    }
    async cleanupOldAuditLogs(retentionDays = 365) {
        this.logger.log(`Cleaning up audit logs older than ${retentionDays} days`);
        const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
        const deletedLogs = await this.prisma.auditLog.deleteMany({
            where: {
                timestamp: { lt: cutoffDate },
            },
        });
        return { deletedCount: deletedLogs.count };
    }
    async searchAuditLogs(searchQuery, user) {
        const logs = await this.prisma.auditLog.findMany({
            where: {
                tenantId: user.tenantId,
                OR: [
                    { action: { contains: searchQuery, mode: 'insensitive' } },
                    { entityType: { contains: searchQuery, mode: 'insensitive' } },
                    { details: { contains: searchQuery, mode: 'insensitive' } },
                ],
            },
            orderBy: { timestamp: 'desc' },
            take: 50,
        });
        return logs.map(log => ({
            id: log.id,
            userId: log.userId,
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            details: JSON.parse(log.details || '{}'),
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            timestamp: log.timestamp,
        }));
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map