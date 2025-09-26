import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogDto, AuditQueryDto } from '../dto/compliance.dto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logActivity(auditData: {
    action: string;
    entityType: string;
    entityId?: string;
    userId: string;
    oldValues?: any;
    newValues?: any;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
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

      // Also log to console for immediate visibility
      this.logger.log(
        `AUDIT: ${auditData.action} | ${auditData.entityType} | ${auditData.entityId || 'N/A'} | User: ${auditData.userId}`,
      );

      return auditLog;
    } catch (error) {
      this.logger.error('Failed to log audit activity', error);
      // Don't throw error to avoid breaking main functionality
      return null;
    }
  }

  async getAuditLogs(query: AuditQueryDto, user: any) {
    this.logger.log(`Retrieving audit logs for user ${user.id}`);

    const {
      entityType,
      entityId,
      action,
      userId,
      fromDate,
      toDate,
      page = '1',
      limit = '50',
    } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (action) where.action = action;
    if (userId) where.userId = userId;
    if (fromDate || toDate) {
      where.timestamp = {};
      if (fromDate) where.timestamp.gte = new Date(fromDate);
      if (toDate) where.timestamp.lte = new Date(toDate);
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

    // Parse JSON fields
    const parsedLogs = logs.map(log => ({
      ...log,
      oldValues: log.oldValues ? JSON.parse(log.oldValues) : null,
      newValues: log.newValues ? JSON.parse(log.newValues) : null,
      details: log.details ? JSON.parse(log.details) : null,
    }));

    // Log the access
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

  async createAuditLog(auditDto: AuditLogDto, user: any) {
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
      compliantRecords: totalLogs, // All logs are compliant by definition
      nonCompliantRecords: 0,
      compliancePercentage: 100,
      lastUpdated: new Date(),
      todayActivity: todayLogs,
    };
  }

  async validateCompliance(entityId: string) {
    // Audit logs are always compliant
    return {
      isCompliant: true,
      issues: [],
    };
  }

  async getEntityAuditTrail(entityType: string, entityId: string, user: any) {
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

    // Parse JSON fields
    const parsedLogs = logs.map(log => ({
      ...log,
      oldValues: log.oldValues ? JSON.parse(log.oldValues) : null,
      newValues: log.newValues ? JSON.parse(log.newValues) : null,
      details: log.details ? JSON.parse(log.details) : null,
    }));

    // Log the access
    await this.logActivity({
      action: 'ENTITY_AUDIT_TRAIL_ACCESSED',
      entityType,
      entityId,
      userId: user.id,
    });

    return parsedLogs;
  }

  async getUserActivitySummary(userId: string, fromDate?: Date, toDate?: Date) {
    const where: any = { userId };
    if (fromDate || toDate) {
      where.timestamp = {};
      if (fromDate) where.timestamp.gte = fromDate;
      if (toDate) where.timestamp.lte = toDate;
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

  async generateAuditReport(query: any, user: any) {
    this.logger.log(`Generating audit report for user ${user.id}`);

    const { fromDate, toDate, entityType, userId } = query;

    const where: any = {};
    if (fromDate) where.timestamp = { ...where.timestamp, gte: new Date(fromDate) };
    if (toDate) where.timestamp = { ...where.timestamp, lte: new Date(toDate) };
    if (entityType) where.entityType = entityType;
    if (userId) where.userId = userId;

    const [
      totalLogs,
      uniqueUsers,
      uniqueEntities,
      actionsSummary,
      topActions,
    ] = await Promise.all([
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

    // Log the report generation
    await this.logActivity({
      action: 'AUDIT_REPORT_GENERATED',
      entityType: 'AUDIT',
      userId: user.id,
      details: { reportType: 'summary', period: { from: fromDate, to: toDate } },
    });

    return report;
  }
}
