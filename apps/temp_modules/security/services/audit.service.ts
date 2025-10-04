import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logActivity(activityDto: any) {
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

  async getAuditLogs(query: any, user: any) {
    const { fromDate, toDate, action, entityType, entityId, userId } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate) where.timestamp = { ...where.timestamp, gte: new Date(fromDate) };
    if (toDate) where.timestamp = { ...where.timestamp, lte: new Date(toDate) };
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (userId) where.userId = userId;

    const auditLogs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100, // Limit to prevent large result sets
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

  async getEntityAuditLogs(entityType: string, entityId: string, user: any) {
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

  async getAuditStats(tenantId: string) {
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

  async cleanupOldAuditLogs(retentionDays: number = 365) {
    this.logger.log(`Cleaning up audit logs older than ${retentionDays} days`);

    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    const deletedLogs = await this.prisma.auditLog.deleteMany({
      where: {
        timestamp: { lt: cutoffDate },
      },
    });

    return { deletedCount: deletedLogs.count };
  }

  async searchAuditLogs(searchQuery: string, user: any) {
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
}
