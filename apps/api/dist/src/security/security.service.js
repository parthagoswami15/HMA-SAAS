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
var SecurityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const authentication_service_1 = require("./services/authentication.service");
const authorization_service_1 = require("./services/authorization.service");
const mfa_service_1 = require("./services/mfa.service");
const encryption_service_1 = require("./services/encryption.service");
const audit_service_1 = require("./services/audit.service");
const session_service_1 = require("./services/session.service");
const device_service_1 = require("./services/device.service");
const ip_service_1 = require("./services/ip.service");
const data_retention_service_1 = require("./services/data-retention.service");
const anomaly_detection_service_1 = require("./services/anomaly-detection.service");
let SecurityService = SecurityService_1 = class SecurityService {
    prisma;
    authenticationService;
    authorizationService;
    mfaService;
    encryptionService;
    auditService;
    sessionService;
    deviceService;
    ipService;
    dataRetentionService;
    anomalyDetectionService;
    logger = new common_1.Logger(SecurityService_1.name);
    constructor(prisma, authenticationService, authorizationService, mfaService, encryptionService, auditService, sessionService, deviceService, ipService, dataRetentionService, anomalyDetectionService) {
        this.prisma = prisma;
        this.authenticationService = authenticationService;
        this.authorizationService = authorizationService;
        this.mfaService = mfaService;
        this.encryptionService = encryptionService;
        this.auditService = auditService;
        this.sessionService = sessionService;
        this.deviceService = deviceService;
        this.ipService = ipService;
        this.dataRetentionService = dataRetentionService;
        this.anomalyDetectionService = anomalyDetectionService;
    }
    async getSecuritySettings(tenantId) {
        this.logger.log(`Getting security settings for tenant ${tenantId}`);
        const settings = await this.prisma.securitySettings.findUnique({
            where: { tenantId },
        });
        if (!settings) {
            return {
                mfaRequired: false,
                passwordPolicy: {
                    minLength: 8,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSymbols: true,
                    maxAge: 90,
                },
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                lockoutDuration: 15,
                ipAllowlistEnabled: false,
                deviceTrackingEnabled: true,
                auditLogRetention: 365,
                dataRetention: {
                    patientRecords: 2555,
                    auditLogs: 365,
                    sessionLogs: 90,
                },
            };
        }
        return settings;
    }
    async updateSecuritySettings(settingsDto, user) {
        this.logger.log(`Updating security settings for tenant ${user.tenantId}`);
        const updatedSettings = await this.prisma.securitySettings.upsert({
            where: { tenantId: user.tenantId },
            update: {
                ...settingsDto,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
            create: {
                tenantId: user.tenantId,
                ...settingsDto,
                createdBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'SECURITY_SETTINGS_UPDATED',
            entityType: 'SECURITY_SETTINGS',
            entityId: updatedSettings.id,
            userId: user.id,
            details: { updatedFields: Object.keys(settingsDto) },
        });
        return updatedSettings;
    }
    async getSecurityHealth(tenantId) {
        this.logger.log(`Getting security health for tenant ${tenantId}`);
        const totalUsers = await this.prisma.user.count({ where: { tenantId } });
        const usersWithMfa = await this.prisma.user.count({
            where: {
                tenantId,
                mfaEnabled: true,
            },
        });
        const recentLoginAttempts = await this.prisma.loginAttempt.count({
            where: {
                user: { tenantId },
                attemptedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
        });
        const failedLoginAttempts = await this.prisma.loginAttempt.count({
            where: {
                user: { tenantId },
                success: false,
                attemptedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
        });
        const activeSessions = await this.prisma.session.count({
            where: {
                user: { tenantId },
                expiresAt: { gt: new Date() },
            },
        });
        const securityEvents = await this.prisma.securityEvent.count({
            where: {
                tenantId,
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
        });
        const mfaAdoptionRate = totalUsers > 0 ? (usersWithMfa / totalUsers) * 100 : 0;
        return {
            tenantId,
            overall: this.calculateOverallHealth({
                mfaAdoptionRate,
                failedLoginRate: recentLoginAttempts > 0 ? (failedLoginAttempts / recentLoginAttempts) * 100 : 0,
                activeSessions,
                securityEvents,
            }),
            metrics: {
                totalUsers,
                usersWithMfa,
                mfaAdoptionRate,
                recentLoginAttempts,
                failedLoginAttempts,
                failedLoginRate: recentLoginAttempts > 0 ? (failedLoginAttempts / recentLoginAttempts) * 100 : 0,
                activeSessions,
                securityEvents,
            },
            recommendations: this.generateSecurityRecommendations({
                mfaAdoptionRate,
                failedLoginRate: recentLoginAttempts > 0 ? (failedLoginAttempts / recentLoginAttempts) * 100 : 0,
                securityEvents,
            }),
        };
    }
    async getLoginAttemptsReport(query, user) {
        const { fromDate, toDate, userId, status } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate)
            where.attemptedAt = { ...where.attemptedAt, gte: new Date(fromDate) };
        if (toDate)
            where.attemptedAt = { ...where.attemptedAt, lte: new Date(toDate) };
        if (userId)
            where.userId = userId;
        if (status !== undefined)
            where.success = status === 'success';
        const attempts = await this.prisma.loginAttempt.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { attemptedAt: 'desc' },
        });
        const total = attempts.length;
        const successful = attempts.filter(a => a.success).length;
        const failed = total - successful;
        return {
            total,
            successful,
            failed,
            successRate: total > 0 ? (successful / total) * 100 : 0,
            attempts,
        };
    }
    async getSecurityEventsReport(query, user) {
        const { fromDate, toDate, eventType, severity } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate)
            where.createdAt = { ...where.createdAt, gte: new Date(fromDate) };
        if (toDate)
            where.createdAt = { ...where.createdAt, lte: new Date(toDate) };
        if (eventType)
            where.eventType = eventType;
        if (severity)
            where.severity = severity;
        const events = await this.prisma.securityEvent.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        const byType = events.reduce((acc, event) => {
            acc[event.eventType] = (acc[event.eventType] || 0) + 1;
            return acc;
        }, {});
        const bySeverity = events.reduce((acc, event) => {
            acc[event.severity] = (acc[event.severity] || 0) + 1;
            return acc;
        }, {});
        return {
            total: events.length,
            byType,
            bySeverity,
            events,
        };
    }
    async getComplianceReport(query, user) {
        const { fromDate, toDate } = query;
        const totalUsers = await this.prisma.user.count({ where: { tenantId: user.tenantId } });
        const usersWithMfa = await this.prisma.user.count({
            where: {
                tenantId: user.tenantId,
                mfaEnabled: true,
            },
        });
        const recentFailedLogins = await this.prisma.loginAttempt.count({
            where: {
                user: { tenantId: user.tenantId },
                success: false,
                attemptedAt: {
                    gte: fromDate ? new Date(fromDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
        });
        const auditLogsCount = await this.prisma.auditLog.count({
            where: {
                user: { tenantId: user.tenantId },
                createdAt: {
                    gte: fromDate ? new Date(fromDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
        });
        const dataRetentionPolicies = await this.prisma.dataRetentionPolicy.count({
            where: { tenantId: user.tenantId },
        });
        return {
            period: { from: fromDate, to: toDate },
            compliance: {
                mfaAdoption: {
                    total: totalUsers,
                    withMfa: usersWithMfa,
                    rate: totalUsers > 0 ? (usersWithMfa / totalUsers) * 100 : 0,
                },
                securityIncidents: {
                    failedLogins: recentFailedLogins,
                    suspiciousActivities: 0,
                },
                audit: {
                    totalLogs: auditLogsCount,
                    logsPerDay: auditLogsCount / 30,
                },
                dataRetention: {
                    policiesConfigured: dataRetentionPolicies,
                    compliance: dataRetentionPolicies > 0 ? 'COMPLIANT' : 'NON_COMPLIANT',
                },
            },
            recommendations: this.generateComplianceRecommendations({
                mfaRate: totalUsers > 0 ? (usersWithMfa / totalUsers) * 100 : 0,
                failedLogins: recentFailedLogins,
                auditLogs: auditLogsCount,
                dataRetentionPolicies,
            }),
        };
    }
    async getCertificates(tenantId) {
        const certificates = await this.prisma.tlsCertificate.findMany({
            where: { tenantId },
            orderBy: { expiresAt: 'asc' },
        });
        return certificates.map(cert => ({
            id: cert.id,
            domain: cert.domain,
            issuer: cert.issuer,
            issuedAt: cert.issuedAt,
            expiresAt: cert.expiresAt,
            status: cert.expiresAt > new Date() ? 'ACTIVE' : 'EXPIRED',
            daysUntilExpiry: Math.ceil((cert.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        }));
    }
    async renewCertificate(renewDto, user) {
        this.logger.log(`Renewing certificate for domain ${renewDto.domain}`);
        const renewedCertificate = await this.prisma.tlsCertificate.update({
            where: { id: renewDto.certificateId },
            data: {
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                renewedAt: new Date(),
                renewedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'CERTIFICATE_RENEWED',
            entityType: 'TLS_CERTIFICATE',
            entityId: renewedCertificate.id,
            userId: user.id,
            details: { domain: renewDto.domain },
        });
        return renewedCertificate;
    }
    async getSecurityPolicies(tenantId) {
        const policies = await this.prisma.securityPolicy.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
        return policies;
    }
    async updateSecurityPolicies(policiesDto, user) {
        this.logger.log(`Updating security policies for tenant ${user.tenantId}`);
        const updatedPolicies = [];
        for (const policy of policiesDto.policies) {
            const updatedPolicy = await this.prisma.securityPolicy.upsert({
                where: { id: policy.id },
                update: {
                    ...policy,
                    updatedBy: user.id,
                    updatedAt: new Date(),
                },
                create: {
                    tenantId: user.tenantId,
                    ...policy,
                    createdBy: user.id,
                },
            });
            updatedPolicies.push(updatedPolicy);
        }
        await this.auditService.logActivity({
            action: 'SECURITY_POLICIES_UPDATED',
            entityType: 'SECURITY_POLICY',
            userId: user.id,
            details: { updatedPolicies: updatedPolicies.length },
        });
        return updatedPolicies;
    }
    calculateOverallHealth(metrics) {
        const { mfaAdoptionRate, failedLoginRate, activeSessions, securityEvents } = metrics;
        if (mfaAdoptionRate >= 80 && failedLoginRate <= 5 && securityEvents === 0) {
            return 'EXCELLENT';
        }
        else if (mfaAdoptionRate >= 60 && failedLoginRate <= 10 && securityEvents <= 2) {
            return 'GOOD';
        }
        else if (mfaAdoptionRate >= 40 && failedLoginRate <= 20 && securityEvents <= 5) {
            return 'FAIR';
        }
        else {
            return 'POOR';
        }
    }
    generateSecurityRecommendations(metrics) {
        const recommendations = [];
        const { mfaAdoptionRate, failedLoginRate, securityEvents } = metrics;
        if (mfaAdoptionRate < 50) {
            recommendations.push('Enable MFA for more users to improve security');
        }
        if (failedLoginRate > 10) {
            recommendations.push('High failed login rate detected. Consider implementing CAPTCHA');
        }
        if (securityEvents > 5) {
            recommendations.push('Multiple security events detected. Review security logs');
        }
        if (recommendations.length === 0) {
            recommendations.push('Security posture looks good. Continue monitoring');
        }
        return recommendations;
    }
    generateComplianceRecommendations(metrics) {
        const recommendations = [];
        const { mfaRate, failedLogins, auditLogs, dataRetentionPolicies } = metrics;
        if (mfaRate < 75) {
            recommendations.push('MFA adoption is below recommended threshold');
        }
        if (failedLogins > 50) {
            recommendations.push('High number of failed login attempts. Investigate potential security threats');
        }
        if (auditLogs < 1000) {
            recommendations.push('Audit logging appears low. Ensure all security events are being logged');
        }
        if (dataRetentionPolicies === 0) {
            recommendations.push('No data retention policies configured. Create policies to ensure compliance');
        }
        if (recommendations.length === 0) {
            recommendations.push('Compliance posture looks good');
        }
        return recommendations;
    }
};
exports.SecurityService = SecurityService;
exports.SecurityService = SecurityService = SecurityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        authentication_service_1.AuthenticationService,
        authorization_service_1.AuthorizationService,
        mfa_service_1.MfaService,
        encryption_service_1.EncryptionService,
        audit_service_1.AuditService,
        session_service_1.SessionService,
        device_service_1.DeviceService,
        ip_service_1.IpService,
        data_retention_service_1.DataRetentionService,
        anomaly_detection_service_1.AnomalyDetectionService])
], SecurityService);
//# sourceMappingURL=security.service.js.map