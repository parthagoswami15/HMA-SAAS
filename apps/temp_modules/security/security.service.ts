import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthorizationService } from './services/authorization.service';
import { MfaService } from './services/mfa.service';
import { EncryptionService } from './services/encryption.service';
import { AuditService } from './services/audit.service';
import { SessionService } from './services/session.service';
import { DeviceService } from './services/device.service';
import { IpService } from './services/ip.service';
import { DataRetentionService } from './services/data-retention.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly authenticationService: AuthenticationService,
    private readonly authorizationService: AuthorizationService,
    private readonly mfaService: MfaService,
    private readonly encryptionService: EncryptionService,
    private readonly auditService: AuditService,
    private readonly sessionService: SessionService,
    private readonly deviceService: DeviceService,
    private readonly ipService: IpService,
    private readonly dataRetentionService: DataRetentionService,
    private readonly anomalyDetectionService: AnomalyDetectionService,
  ) {}

  async getSecuritySettings(tenantId: string) {
    this.logger.log(`Getting security settings for tenant ${tenantId}`);

    const settings = await this.prisma.securitySettings.findUnique({
      where: { tenantId },
    });

    if (!settings) {
      // Return default settings
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
        sessionTimeout: 30, // minutes
        maxLoginAttempts: 5,
        lockoutDuration: 15, // minutes
        ipAllowlistEnabled: false,
        deviceTrackingEnabled: true,
        auditLogRetention: 365, // days
        dataRetention: {
          patientRecords: 2555, // 7 years
          auditLogs: 365, // 1 year
          sessionLogs: 90, // 3 months
        },
      };
    }

    return settings;
  }

  async updateSecuritySettings(settingsDto: any, user: any) {
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

    // Log the settings update
    await this.auditService.logActivity({
      action: 'SECURITY_SETTINGS_UPDATED',
      entityType: 'SECURITY_SETTINGS',
      entityId: updatedSettings.id,
      userId: user.id,
      details: { updatedFields: Object.keys(settingsDto) },
    });

    return updatedSettings;
  }

  async getSecurityHealth(tenantId: string) {
    this.logger.log(`Getting security health for tenant ${tenantId}`);

    // Get various security metrics
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
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
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

  async getLoginAttemptsReport(query: any, user: any) {
    const { fromDate, toDate, userId, status } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate) where.attemptedAt = { ...where.attemptedAt, gte: new Date(fromDate) };
    if (toDate) where.attemptedAt = { ...where.attemptedAt, lte: new Date(toDate) };
    if (userId) where.userId = userId;
    if (status !== undefined) where.success = status === 'success';

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

  async getSecurityEventsReport(query: any, user: any) {
    const { fromDate, toDate, eventType, severity } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate) where.createdAt = { ...where.createdAt, gte: new Date(fromDate) };
    if (toDate) where.createdAt = { ...where.createdAt, lte: new Date(toDate) };
    if (eventType) where.eventType = eventType;
    if (severity) where.severity = severity;

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

  async getComplianceReport(query: any, user: any) {
    const { fromDate, toDate } = query;

    // Get compliance metrics
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
          suspiciousActivities: 0, // Would be calculated from security events
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

  async getCertificates(tenantId: string) {
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

  async renewCertificate(renewDto: any, user: any) {
    this.logger.log(`Renewing certificate for domain ${renewDto.domain}`);

    // In production, integrate with certificate authority
    const renewedCertificate = await this.prisma.tlsCertificate.update({
      where: { id: renewDto.certificateId },
      data: {
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        renewedAt: new Date(),
        renewedBy: user.id,
      },
    });

    // Log the renewal
    await this.auditService.logActivity({
      action: 'CERTIFICATE_RENEWED',
      entityType: 'TLS_CERTIFICATE',
      entityId: renewedCertificate.id,
      userId: user.id,
      details: { domain: renewDto.domain },
    });

    return renewedCertificate;
  }

  async getSecurityPolicies(tenantId: string) {
    const policies = await this.prisma.securityPolicy.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return policies;
  }

  async updateSecurityPolicies(policiesDto: any, user: any) {
    this.logger.log(`Updating security policies for tenant ${user.tenantId}`);

    // Update or create policies
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

    // Log the policy update
    await this.auditService.logActivity({
      action: 'SECURITY_POLICIES_UPDATED',
      entityType: 'SECURITY_POLICY',
      userId: user.id,
      details: { updatedPolicies: updatedPolicies.length },
    });

    return updatedPolicies;
  }

  private calculateOverallHealth(metrics: any): 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' {
    const { mfaAdoptionRate, failedLoginRate, activeSessions, securityEvents } = metrics;

    if (mfaAdoptionRate >= 80 && failedLoginRate <= 5 && securityEvents === 0) {
      return 'EXCELLENT';
    } else if (mfaAdoptionRate >= 60 && failedLoginRate <= 10 && securityEvents <= 2) {
      return 'GOOD';
    } else if (mfaAdoptionRate >= 40 && failedLoginRate <= 20 && securityEvents <= 5) {
      return 'FAIR';
    } else {
      return 'POOR';
    }
  }

  private generateSecurityRecommendations(metrics: any): string[] {
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

  private generateComplianceRecommendations(metrics: any): string[] {
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
}
