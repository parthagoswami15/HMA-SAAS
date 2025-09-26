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
    async logActivity(auditData) {
        this.logger.debug(`Logging audit activity: ${auditData.action} on ${auditData.entityType}`);
        try {
            const auditLog = await this.prisma.auditLog.create({
                data: {
                    action: auditData.action,
                    entityType: auditData.entityType,
                    entityId: auditData.entityId,
                    userId: auditData.userId,
                    oldValues: auditData.oldValues ? JSON.stringify(auditData.oldValues) : null,
                    newValues: auditData.newValues ? JSON.stringify(auditData.newValues) : null,
                    details: auditData.details ? JSON.stringify(auditData.details) : null,
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent,
                    timestamp: new Date(),
                },
            });
            this.logger.log(`AUDIT: ${auditData.action} | ${auditData.entityType} | ${auditData.entityId || 'N/A'} | User: ${auditData.userId}`);
            return auditLog;
        }
        catch (error) {
            this.logger.error('Failed to log audit activity', error);
            return null;
        }
    }
    async getAuditLogs(query, user) {
        this.logger.log(`Retrieving audit logs for user ${user.id}`);
        const { entityType, entityId, action, userId, fromDate, toDate, page = '1', limit = '50', } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (entityType)
            where.entityType = entityType;
        if (entityId)
            where.entityId = entityId;
        if (action)
            where.action = action;
        if (userId)
            where.userId = userId;
        if (fromDate || toDate) {
            where.timestamp = {};
            if (fromDate)
                where.timestamp.gte = new Date(fromDate);
            if (toDate)
                where.timestamp.lte = new Date(toDate);
        }
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                skip,
                take: limitNum,
                select: {
                    id: true,
                    action: true,
                    entityType: true,
                    entityId: true,
                    userId: true,
                    oldValues: true,
                    newValues: true,
                    details: true,
                    ipAddress: true,
                    userAgent: true,
                    timestamp: true,
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        const parsedLogs = logs.map(log => ({
            ...log,
            oldValues: log.oldValues ? JSON.parse(log.oldValues) : null,
            newValues: log.newValues ? JSON.parse(log.newValues) : null,
            details: log.details ? JSON.parse(log.details) : null,
        }));
        await this.logActivity({
            action: 'AUDIT_LOGS_ACCESSED',
            entityType: 'AUDIT',
            userId: user.id,
            details: { filters: query, count: total },
        });
        return {
            logs: parsedLogs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        };
    }
    async createAuditLog(auditDto, user) {
        this.logger.log(`Creating manual audit log: ${auditDto.action}`);
        return this.logActivity({
            action: auditDto.action,
            entityType: auditDto.entityType,
            entityId: auditDto.entityId,
            userId: user.id,
            oldValues: auditDto.oldValues,
            newValues: auditDto.newValues,
            ipAddress: auditDto.ipAddress,
            userAgent: auditDto.userAgent,
        });
    }
    async getComplianceStatus() {
        const totalLogs = await this.prisma.auditLog.count();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayLogs = await this.prisma.auditLog.count({
            where: { timestamp: { gte: today } },
        });
        return {
            totalRecords: totalLogs,
            compliantRecords: totalLogs,
            nonCompliantRecords: 0,
            compliancePercentage: 100,
            lastUpdated: new Date(),
            todayActivity: todayLogs,
        };
    }
    async validateCompliance(entityId) {
        return {
            isCompliant: true,
            issues: [],
        };
    }
    async getEntityAuditTrail(entityType, entityId, user) {
        this.logger.log(`Retrieving audit trail for ${entityType}:${entityId}`);
        const logs = await this.prisma.auditLog.findMany({
            where: { entityType, entityId },
            orderBy: { timestamp: 'asc' },
            select: {
                id: true,
                action: true,
                userId: true,
                oldValues: true,
                newValues: true,
                details: true,
                ipAddress: true,
                userAgent: true,
                timestamp: true,
            },
        });
        const parsedLogs = logs.map(log => ({
            ...log,
            oldValues: log.oldValues ? JSON.parse(log.oldValues) : null,
            newValues: log.newValues ? JSON.parse(log.newValues) : null,
            details: log.details ? JSON.parse(log.details) : null,
        }));
        await this.logActivity({
            action: 'ENTITY_AUDIT_TRAIL_ACCESSED',
            entityType,
            entityId,
            userId: user.id,
        });
        return parsedLogs;
    }
    async getUserActivitySummary(userId, fromDate, toDate) {
        const where = { userId };
        if (fromDate || toDate) {
            where.timestamp = {};
            if (fromDate)
                where.timestamp.gte = fromDate;
            if (toDate)
                where.timestamp.lte = toDate;
        }
        const activities = await this.prisma.auditLog.groupBy({
            by: ['action'],
            where,
            _count: { action: true },
            orderBy: { _count: { action: 'desc' } },
        });
        const totalActivities = await this.prisma.auditLog.count({ where });
        return {
            userId,
            period: { from: fromDate, to: toDate },
            totalActivities,
            activitiesByAction: activities,
        };
    }
    async generateAuditReport(query, user) {
        this.logger.log(`Generating audit report for user ${user.id}`);
        const { fromDate, toDate, entityType, userId } = query;
        const where = {};
        if (fromDate)
            where.timestamp = { ...where.timestamp, gte: new Date(fromDate) };
        if (toDate)
            where.timestamp = { ...where.timestamp, lte: new Date(toDate) };
        if (entityType)
            where.entityType = entityType;
        if (userId)
            where.userId = userId;
        const [totalLogs, uniqueUsers, uniqueEntities, actionsSummary, topActions,] = await Promise.all([
            this.prisma.auditLog.count({ where }),
            this.prisma.auditLog.groupBy({
                by: ['userId'],
                where,
                _count: { userId: true },
            }),
            this.prisma.auditLog.groupBy({
                by: ['entityType', 'entityId'],
                where,
                _count: { entityId: true },
            }),
            this.prisma.auditLog.groupBy({
                by: ['action'],
                where,
                _count: { action: true },
            }),
            this.prisma.auditLog.groupBy({
                by: ['action'],
                where,
                _count: { action: true },
                orderBy: { _count: { action: 'desc' } },
                take: 10,
            }),
        ]);
        const report = {
            period: { from: fromDate, to: toDate },
            summary: {
                totalLogs,
                uniqueUsers: uniqueUsers.length,
                uniqueEntities: uniqueEntities.length,
                actionsCount: actionsSummary.length,
            },
            topActions: topActions.map(item => ({
                action: item.action,
                count: item._count.action,
            })),
            generatedAt: new Date(),
            generatedBy: user.id,
        };
        await this.logActivity({
            action: 'AUDIT_REPORT_GENERATED',
            entityType: 'AUDIT',
            userId: user.id,
            details: { reportType: 'summary', period: { from: fromDate, to: toDate } },
        });
        return report;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map