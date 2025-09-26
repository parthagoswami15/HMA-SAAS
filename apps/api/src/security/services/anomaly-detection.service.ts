import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';

@Injectable()
export class AnomalyDetectionService {
  private readonly logger = new Logger(AnomalyDetectionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async detectAnomalies(user: any) {
    this.logger.log(`Detecting anomalies for user: ${user.id}`);

    const anomalies = [];

    // Check for unusual login patterns
    const loginAnomalies = await this.detectLoginAnomalies(user);
    anomalies.push(...loginAnomalies);

    // Check for unusual access patterns
    const accessAnomalies = await this.detectAccessAnomalies(user);
    anomalies.push(...accessAnomalies);

    // Check for data access anomalies
    const dataAnomalies = await this.detectDataAccessAnomalies(user);
    anomalies.push(...dataAnomalies);

    // Store detected anomalies
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

  async getAnomalies(query: any, user: any) {
    const { fromDate, toDate, severity, status, anomalyType } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate) where.detectedAt = { ...where.detectedAt, gte: new Date(fromDate) };
    if (toDate) where.detectedAt = { ...where.detectedAt, lte: new Date(toDate) };
    if (severity) where.severity = severity;
    if (status) where.status = status;
    if (anomalyType) where.anomalyType = anomalyType;

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

  async resolveAnomaly(anomalyId: string, resolveDto: any, user: any) {
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

    // Log anomaly resolution
    await this.auditService.logActivity({
      action: 'ANOMALY_RESOLVED',
      entityType: 'SECURITY_ANOMALY',
      entityId: anomalyId,
      userId: user.id,
      details: { resolution },
    });

    return anomaly;
  }

  private async detectLoginAnomalies(user: any) {
    const anomalies = [];

    // Get recent login attempts
    const recentLogins = await this.prisma.loginAttempt.findMany({
      where: {
        userId: user.id,
        attemptedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: { attemptedAt: 'desc' },
    });

    // Check for multiple failed attempts
    const failedAttempts = recentLogins.filter(login => !login.success);
    if (failedAttempts.length > 5) {
      anomalies.push({
        type: 'MULTIPLE_FAILED_LOGINS',
        severity: 'HIGH',
        description: `Multiple failed login attempts detected (${failedAttempts.length} attempts)`,
        metadata: { failedCount: failedAttempts.length },
      });
    }

    // Check for login from unusual location
    const uniqueIPs = [...new Set(recentLogins.map(login => login.ipAddress))];
    if (uniqueIPs.length > 3) {
      anomalies.push({
        type: 'UNUSUAL_LOGIN_LOCATIONS',
        severity: 'MEDIUM',
        description: `Login attempts from multiple IP addresses (${uniqueIPs.length} different IPs)`,
        metadata: { ipCount: uniqueIPs.length, ips: uniqueIPs },
      });
    }

    // Check for unusual login times
    const unusualHours = recentLogins.filter(login => {
      const hour = new Date(login.attemptedAt).getHours();
      return hour < 6 || hour > 22; // Outside normal business hours
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

  private async detectAccessAnomalies(user: any) {
    const anomalies = [];

    // Get recent audit logs
    const recentActivities = await this.prisma.auditLog.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check for rapid successive actions
    const rapidActions = this.detectRapidActions(recentActivities);
    if (rapidActions.length > 0) {
      anomalies.push({
        type: 'RAPID_SUCCESSIVE_ACTIONS',
        severity: 'HIGH',
        description: `Rapid successive actions detected (${rapidActions.length} actions in short time)`,
        metadata: { rapidActions: rapidActions.length },
      });
    }

    // Check for access to sensitive data
    const sensitiveAccesses = recentActivities.filter(activity =>
      activity.action.includes('PATIENT') || activity.action.includes('MEDICAL')
    );

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

  private async detectDataAccessAnomalies(user: any) {
    const anomalies = [];

    // Get data access patterns
    const dataAccesses = await this.prisma.auditLog.findMany({
      where: {
        userId: user.id,
        entityType: { in: ['PATIENT', 'CONSULTATION', 'PRESCRIPTION'] },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    // Check for bulk data access
    const bulkAccesses = dataAccesses.filter(access =>
      access.action.includes('BULK') || access.action.includes('EXPORT')
    );

    if (bulkAccesses.length > 3) {
      anomalies.push({
        type: 'BULK_DATA_ACCESS',
        severity: 'HIGH',
        description: `Bulk data access detected (${bulkAccesses.length} bulk operations)`,
        metadata: { bulkAccessCount: bulkAccesses.length },
      });
    }

    // Check for unusual data volume
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

  private detectRapidActions(activities: any[]): any[] {
    const rapidActions = [];

    for (let i = 1; i < activities.length; i++) {
      const current = activities[i];
      const previous = activities[i - 1];

      const timeDiff = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime();
      const timeDiffSeconds = timeDiff / 1000;

      if (timeDiffSeconds < 5) { // Less than 5 seconds between actions
        rapidActions.push({
          action: current.action,
          timestamp: current.createdAt,
          timeDiff: timeDiffSeconds,
        });
      }
    }

    return rapidActions;
  }

  async getAnomalyStats(user: any) {
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
}
