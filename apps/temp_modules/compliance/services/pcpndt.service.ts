import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';

@Injectable()
export class PcpndtService {
  private readonly logger = new Logger(PcpndtService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async requestAccess(requestDto: any, user: any) {
    this.logger.log(`PC-PNDT access request from user ${user.id}`);

    // Check if user has PC-PNDT certification
    const userCertification = await this.prisma.userCertification.findFirst({
      where: {
        userId: user.id,
        certificationType: 'PCPNDT',
        status: 'ACTIVE',
        validTill: { gte: new Date() },
      },
    });

    if (!userCertification) {
      throw new BadRequestException('PC-PNDT certification required for access');
    }

    // Create access request
    const accessRequest = await this.prisma.pcpndtAccessRequest.create({
      data: {
        userId: user.id,
        patientId: requestDto.patientId,
        procedureType: requestDto.procedureType,
        reason: requestDto.reason,
        status: 'PENDING',
        requestedAt: new Date(),
      },
    });

    // Log the request
    await this.auditService.logActivity({
      action: 'PCPNDT_ACCESS_REQUESTED',
      entityType: 'PCPNDT_ACCESS',
      entityId: accessRequest.id,
      userId: user.id,
      details: {
        patientId: requestDto.patientId,
        procedureType: requestDto.procedureType,
        reason: requestDto.reason,
      },
    });

    return {
      id: accessRequest.id,
      status: accessRequest.status,
      requestedAt: accessRequest.requestedAt,
    };
  }

  async approveAccess(requestId: string, approverUser: any) {
    this.logger.log(`Approving PC-PNDT access request ${requestId}`);

    const accessRequest = await this.prisma.pcpndtAccessRequest.findUnique({
      where: { id: requestId },
    });

    if (!accessRequest) {
      throw new NotFoundException('Access request not found');
    }

    if (accessRequest.status !== 'PENDING') {
      throw new BadRequestException('Request already processed');
    }

    const updatedRequest = await this.prisma.pcpndtAccessRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        approvedBy: approverUser.id,
        approvedAt: new Date(),
      },
    });

    // Create access log
    await this.prisma.pcpndtAccessLog.create({
      data: {
        requestId,
        userId: accessRequest.userId,
        patientId: accessRequest.patientId,
        procedureType: accessRequest.procedureType,
        accessedAt: new Date(),
        ipAddress: approverUser.ipAddress,
        userAgent: approverUser.userAgent,
      },
    });

    // Log the approval
    await this.auditService.logActivity({
      action: 'PCPNDT_ACCESS_APPROVED',
      entityType: 'PCPNDT_ACCESS',
      entityId: requestId,
      userId: approverUser.id,
      details: { requestId, patientId: accessRequest.patientId },
    });

    return updatedRequest;
  }

  async denyAccess(requestId: string, reason: string, approverUser: any) {
    this.logger.log(`Denying PC-PNDT access request ${requestId}`);

    const accessRequest = await this.prisma.pcpndtAccessRequest.findUnique({
      where: { id: requestId },
    });

    if (!accessRequest) {
      throw new NotFoundException('Access request not found');
    }

    const updatedRequest = await this.prisma.pcpndtAccessRequest.update({
      where: { id: requestId },
      data: {
        status: 'DENIED',
        denialReason: reason,
        deniedBy: approverUser.id,
        deniedAt: new Date(),
      },
    });

    // Log the denial
    await this.auditService.logActivity({
      action: 'PCPNDT_ACCESS_DENIED',
      entityType: 'PCPNDT_ACCESS',
      entityId: requestId,
      userId: approverUser.id,
      details: { requestId, patientId: accessRequest.patientId, reason },
    });

    return updatedRequest;
  }

  async getAccessLogs(query: any, user: any) {
    this.logger.log(`Retrieving PC-PNDT access logs for user ${user.id}`);

    const { patientId, userId, fromDate, toDate, page = '1', limit = '50' } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (userId) where.userId = userId;
    if (fromDate || toDate) {
      where.accessedAt = {};
      if (fromDate) where.accessedAt.gte = new Date(fromDate);
      if (toDate) where.accessedAt.lte = new Date(toDate);
    }

    const [logs, total] = await Promise.all([
      this.prisma.pcpndtAccessLog.findMany({
        where,
        include: {
          request: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { accessedAt: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.pcpndtAccessLog.count({ where }),
    ]);

    // Log the access
    await this.auditService.logActivity({
      action: 'PCPNDT_LOGS_ACCESSED',
      entityType: 'PCPNDT_ACCESS',
      userId: user.id,
      details: { filters: query, count: total },
    });

    return {
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async getComplianceStatus() {
    const totalRequests = await this.prisma.pcpndtAccessRequest.count();
    const approvedRequests = await this.prisma.pcpndtAccessRequest.count({
      where: { status: 'APPROVED' },
    });
    const deniedRequests = await this.prisma.pcpndtAccessRequest.count({
      where: { status: 'DENIED' },
    });
    const pendingRequests = totalRequests - approvedRequests - deniedRequests;

    const totalAccessLogs = await this.prisma.pcpndtAccessLog.count();

    return {
      totalRecords: totalRequests,
      compliantRecords: approvedRequests,
      nonCompliantRecords: pendingRequests + deniedRequests,
      compliancePercentage: totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 100,
      lastUpdated: new Date(),
      details: {
        totalRequests,
        approvedRequests,
        deniedRequests,
        pendingRequests,
        totalAccessLogs,
      },
    };
  }

  async validateCompliance(entityId: string) {
    const request = await this.prisma.pcpndtAccessRequest.findUnique({
      where: { id: entityId },
    });

    if (!request) {
      return {
        isCompliant: false,
        issues: ['PC-PNDT access request not found'],
      };
    }

    const issues = [];

    if (request.status === 'PENDING') {
      issues.push('Access request is pending');
    }

    if (request.status === 'DENIED') {
      issues.push('Access request was denied');
    }

    return {
      isCompliant: issues.length === 0,
      issues,
    };
  }

  async getCertificationStatus(userId: string) {
    const certifications = await this.prisma.userCertification.findMany({
      where: {
        userId,
        certificationType: 'PCPNDT',
        OR: [
          { status: 'ACTIVE' },
          { validTill: { gte: new Date() } },
        ],
      },
      orderBy: { validTill: 'desc' },
    });

    return certifications;
  }

  async validateUserCertification(userId: string): Promise<boolean> {
    const activeCertification = await this.prisma.userCertification.findFirst({
      where: {
        userId,
        certificationType: 'PCPNDT',
        status: 'ACTIVE',
        validTill: { gte: new Date() },
      },
    });

    return !!activeCertification;
  }
}
