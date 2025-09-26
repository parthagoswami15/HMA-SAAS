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
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuditService = AuditService_1 = class AuditService {
    prisma;
    logger = new common_1.Logger(AuditService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(data) {
        try {
            const logEntry = await this.prisma.auditLog.create({
                data: {
                    tenantId: data.tenantId,
                    userId: data.userId,
                    action: data.action,
                    resource: data.resource,
                    resourceId: data.resourceId,
                    oldValues: data.oldValues ?? client_1.Prisma.JsonNull,
                    newValues: data.newValues ?? client_1.Prisma.JsonNull,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                    timestamp: data.timestamp || new Date(),
                    statusCode: data.statusCode || 200,
                    metadata: data.metadata ?? client_1.Prisma.JsonNull,
                },
            });
            return logEntry;
        }
        catch (error) {
            this.logger.error('Audit logging failed:', error);
            return null;
        }
    }
    async getAuditLogs(params) {
        const { tenantId, userId, resource, action, startDate, endDate, limit, offset } = params;
        const where = {
            tenantId,
            ...(userId && { userId }),
            ...(resource && { resource }),
            ...(action && { action }),
            ...((startDate || endDate) && {
                timestamp: {
                    ...(startDate && { gte: startDate }),
                    ...(endDate && { lte: endDate }),
                },
            }),
        };
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { timestamp: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            data: logs,
            meta: {
                total,
                page: Math.floor(offset / limit) + 1,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getAuditLogsByUser(params) {
        const { tenantId, userId, limit } = params;
        const logs = await this.prisma.auditLog.findMany({
            where: { tenantId, userId },
            take: limit,
            orderBy: { timestamp: 'desc' },
            select: {
                id: true,
                action: true,
                resource: true,
                resourceId: true,
                timestamp: true,
                statusCode: true,
            },
        });
        return logs;
    }
    async getAuditLogsByResource(params) {
        const { tenantId, resource, limit } = params;
        const logs = await this.prisma.auditLog.findMany({
            where: { tenantId, resource },
            take: limit,
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return logs;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map