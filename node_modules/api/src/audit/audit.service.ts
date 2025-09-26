import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface AuditLogEntry {
  tenantId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  statusCode?: number;
}

export interface GetAuditLogsParams {
  tenantId: string;
  userId?: string;
  resource?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit: number;
  offset: number;
}

export interface GetLogsByUserParams {
  tenantId: string;
  userId: string;
  limit: number;
}

export interface GetLogsByResourceParams {
  tenantId: string;
  resource: string;
  limit: number;
}

type CreateAuditLogInput = Omit<AuditLogEntry, 'timestamp'> & {
  timestamp?: Date;
};

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(data: CreateAuditLogInput) {
    try {
      const logEntry = await this.prisma.auditLog.create({
        data: {
          tenantId: data.tenantId,
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          oldValues: data.oldValues ?? Prisma.JsonNull,
          newValues: data.newValues ?? Prisma.JsonNull,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          timestamp: data.timestamp || new Date(),
          statusCode: data.statusCode || 200,
          metadata: data.metadata ?? Prisma.JsonNull,
        },
      });
      return logEntry;
    } catch (error) {
      this.logger.error('Audit logging failed:', error);
      return null;
    }
  }

  async getAuditLogs(params: GetAuditLogsParams) {
    const { tenantId, userId, resource, action, startDate, endDate, limit, offset } = params;
    
    const where: Prisma.AuditLogWhereInput = {
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

  async getAuditLogsByUser(params: GetLogsByUserParams) {
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

  async getAuditLogsByResource(params: GetLogsByResourceParams) {
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

}
