import { Controller, Get, Query, UseGuards, Post, Body, Req } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuditService } from './audit.service';
import type { AuditLogEntry } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';


@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post('log')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.NURSE, Role.SUPER_ADMIN)
  async createAuditLog(
    @Body() entry: Omit<AuditLogEntry, 'tenantId' | 'userId' | 'ipAddress' | 'userAgent'>,
    @CurrentUser() user: { id: string; tenantId: string; role: Role },
    @Req() req: ExpressRequest,
  ) {
    return this.auditService.log({
      ...entry,
      tenantId: user.tenantId,
      userId: user.id,
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      timestamp: new Date(),
    });
  }

  @Get('logs')
  @Roles(Role.HOSPITAL_ADMIN, Role.SUPER_ADMIN)
  async getAuditLogs(
    @CurrentUser() user: any,
    @Query('userId') userId?: string,
    @Query('resource') resource?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.auditService.getAuditLogs({
      tenantId: user.tenantId,
      userId,
      resource,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : 100,
      offset: offset ? parseInt(offset) : 0,
    });
  }

  @Get('logs/user')
  @Roles(Role.HOSPITAL_ADMIN, Role.SUPER_ADMIN)
  async getAuditLogsByUser(
    @CurrentUser() user: any,
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.getAuditLogsByUser({
      tenantId: user.tenantId,
      userId,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Get('logs/resource')
  @Roles(Role.HOSPITAL_ADMIN, Role.SUPER_ADMIN)
  async getAuditLogsByResource(
    @CurrentUser() user: any,
    @Query('resource') resource: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.getAuditLogsByResource({
      tenantId: user.tenantId,
      resource,
      limit: limit ? parseInt(limit) : 50,
    });
  }
}
