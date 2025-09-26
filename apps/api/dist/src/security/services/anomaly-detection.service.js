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
var AnomalyDetectionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnomalyDetectionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
let AnomalyDetectionService = AnomalyDetectionService_1 = class AnomalyDetectionService {
    prisma;
    auditService;
    logger = new common_1.Logger(AnomalyDetectionService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async detectAnomalies(user) {
        this.logger.log(`Detecting anomalies for user: ${user.id}`);
        const anomalies = [];
        const loginAnomalies = await this.detectLoginAnomalies(user);
        anomalies.push(...loginAnomalies);
        const accessAnomalies = await this.detectAccessAnomalies(user);
        anomalies.push(...accessAnomalies);
        const dataAnomalies = await this.detectDataAccessAnomalies(user);
        anomalies.push(...dataAnomalies);
        for (const anomaly of anomalies) {
            await this.prisma.securityAnomaly.create({
                data: {
                    userId: user.id,
                    tenantId: user.tenantId,
                    anomalyType: anomaly.type,
                    severity: anomaly.severity,
                    description: anomaly.description,
                    metadata: JSON.stringify(anomaly.metadata),
                    detectedAt: new Date(),
                    status: 'DETECTED',
                },
            });
        }
        return anomalies;
    }
    async getAnomalies(query, user) {
        const { fromDate, toDate, severity, status, anomalyType } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate)
            where.detectedAt = { ...where.detectedAt, gte: new Date(fromDate) };
        if (toDate)
            where.detectedAt = { ...where.detectedAt, lte: new Date(toDate) };
        if (severity)
            where.severity = severity;
        if (status)
            where.status = status;
        if (anomalyType)
            where.anomalyType = anomalyType;
        const anomalies = await this.prisma.securityAnomaly.findMany({
            where,
            orderBy: { detectedAt: 'desc' },
        });
        return anomalies.map(anomaly => ({
            id: anomaly.id,
            anomalyType: anomaly.anomalyType,
            severity: anomaly.severity,
            description: anomaly.description,
            metadata: JSON.parse(anomaly.metadata || '{}'),
            detectedAt: anomaly.detectedAt,
            resolvedAt: anomaly.resolvedAt,
            status: anomaly.status,
        }));
    }
    async resolveAnomaly(anomalyId, resolveDto, user) {
        this.logger.log(`Resolving anomaly: ${anomalyId}`);
        const { resolution, notes } = resolveDto;
        const anomaly = await this.prisma.securityAnomaly.update({
            where: { id: anomalyId },
            data: {
                status: 'RESOLVED',
                resolution,
                notes,
                resolvedAt: new Date(),
                resolvedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'ANOMALY_RESOLVED',
            entityType: 'SECURITY_ANOMALY',
            entityId: anomalyId,
            userId: user.id,
            details: { resolution },
        });
        return anomaly;
    }
    async detectLoginAnomalies(user) {
        const anomalies = [];
        const recentLogins = await this.prisma.loginAttempt.findMany({
            where: {
                userId: user.id,
                attemptedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
            orderBy: { attemptedAt: 'desc' },
        });
        const failedAttempts = recentLogins.filter(login => !login.success);
        if (failedAttempts.length > 5) {
            anomalies.push({
                type: 'MULTIPLE_FAILED_LOGINS',
                severity: 'HIGH',
                description: `Multiple failed login attempts detected (${failedAttempts.length} attempts)`,
                metadata: { failedCount: failedAttempts.length },
            });
        }
        const uniqueIPs = [...new Set(recentLogins.map(login => login.ipAddress))];
        if (uniqueIPs.length > 3) {
            anomalies.push({
                type: 'UNUSUAL_LOGIN_LOCATIONS',
                severity: 'MEDIUM',
                description: `Login attempts from multiple IP addresses (${uniqueIPs.length} different IPs)`,
                metadata: { ipCount: uniqueIPs.length, ips: uniqueIPs },
            });
        }
        const unusualHours = recentLogins.filter(login => {
            const hour = new Date(login.attemptedAt).getHours();
            return hour < 6 || hour > 22;
        });
        if (unusualHours.length > 2) {
            anomalies.push({
                type: 'UNUSUAL_LOGIN_HOURS',
                severity: 'MEDIUM',
                description: `Login attempts during unusual hours (${unusualHours.length} attempts)`,
                metadata: { unusualCount: unusualHours.length },
            });
        }
        return anomalies;
    }
    async detectAccessAnomalies(user) {
        const anomalies = [];
        const recentActivities = await this.prisma.auditLog.findMany({
            where: {
                userId: user.id,
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const rapidActions = this.detectRapidActions(recentActivities);
        if (rapidActions.length > 0) {
            anomalies.push({
                type: 'RAPID_SUCCESSIVE_ACTIONS',
                severity: 'HIGH',
                description: `Rapid successive actions detected (${rapidActions.length} actions in short time)`,
                metadata: { rapidActions: rapidActions.length },
            });
        }
        const sensitiveAccesses = recentActivities.filter(activity => activity.action.includes('PATIENT') || activity.action.includes('MEDICAL'));
        if (sensitiveAccesses.length > 10) {
            anomalies.push({
                type: 'EXCESSIVE_SENSITIVE_ACCESS',
                severity: 'MEDIUM',
                description: `Excessive access to sensitive data (${sensitiveAccesses.length} accesses)`,
                metadata: { sensitiveAccessCount: sensitiveAccesses.length },
            });
        }
        return anomalies;
    }
    async detectDataAccessAnomalies(user) {
        const anomalies = [];
        const dataAccesses = await this.prisma.auditLog.findMany({
            where: {
                userId: user.id,
                entityType: { in: ['PATIENT', 'CONSULTATION', 'PRESCRIPTION'] },
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            },
        });
        const bulkAccesses = dataAccesses.filter(access => access.action.includes('BULK') || access.action.includes('EXPORT'));
        if (bulkAccesses.length > 3) {
            anomalies.push({
                type: 'BULK_DATA_ACCESS',
                severity: 'HIGH',
                description: `Bulk data access detected (${bulkAccesses.length} bulk operations)`,
                metadata: { bulkAccessCount: bulkAccesses.length },
            });
        }
        const totalAccesses = dataAccesses.length;
        const averageDailyAccess = totalAccesses / 7;
        if (averageDailyAccess > 50) {
            anomalies.push({
                type: 'UNUSUAL_DATA_VOLUME',
                severity: 'MEDIUM',
                description: `Unusual data access volume (${Math.round(averageDailyAccess)} accesses per day)`,
                metadata: { dailyAverage: Math.round(averageDailyAccess) },
            });
        }
        return anomalies;
    }
    detectRapidActions(activities) {
        const rapidActions = [];
        for (let i = 1; i < activities.length; i++) {
            const current = activities[i];
            const previous = activities[i - 1];
            const timeDiff = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime();
            const timeDiffSeconds = timeDiff / 1000;
            if (timeDiffSeconds < 5) {
                rapidActions.push({
                    action: current.action,
                    timestamp: current.createdAt,
                    timeDiff: timeDiffSeconds,
                });
            }
        }
        return rapidActions;
    }
    async getAnomalyStats(user) {
        const totalAnomalies = await this.prisma.securityAnomaly.count({
            where: { tenantId: user.tenantId },
        });
        const unresolvedAnomalies = await this.prisma.securityAnomaly.count({
            where: {
                tenantId: user.tenantId,
                status: { not: 'RESOLVED' },
            },
        });
        const anomaliesByType = await this.prisma.securityAnomaly.groupBy({
            by: ['anomalyType'],
            where: { tenantId: user.tenantId },
            _count: { anomalyType: true },
        });
        const anomaliesBySeverity = await this.prisma.securityAnomaly.groupBy({
            by: ['severity'],
            where: { tenantId: user.tenantId },
            _count: { severity: true },
        });
        return {
            tenantId: user.tenantId,
            totalAnomalies,
            unresolvedAnomalies,
            anomaliesByType,
            anomaliesBySeverity,
        };
    }
};
exports.AnomalyDetectionService = AnomalyDetectionService;
exports.AnomalyDetectionService = AnomalyDetectionService = AnomalyDetectionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], AnomalyDetectionService);
//# sourceMappingURL=anomaly-detection.service.js.map