import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';

@Injectable()
export class DataRetentionService {
  private readonly logger = new Logger(DataRetentionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getRetentionPolicies(tenantId: string) {
    const policies = await this.prisma.dataRetentionPolicy.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return policies;
  }

  async createRetentionPolicy(policyDto: any, user: any) {
    this.logger.log(`Creating retention policy for tenant: ${user.tenantId}`);

    const { dataType, retentionPeriod, description } = policyDto;

    const policy = await this.prisma.dataRetentionPolicy.create({
      data: {
        tenantId: user.tenantId,
        dataType,
        retentionPeriod,
        description,
        createdBy: user.id,
        isActive: true,
      },
    });

    // Log policy creation
    await this.auditService.logActivity({
      action: 'RETENTION_POLICY_CREATED',
      entityType: 'DATA_RETENTION_POLICY',
      entityId: policy.id,
      userId: user.id,
      details: { dataType, retentionPeriod },
    });

    return policy;
  }

  async updateRetentionPolicy(policyId: string, policyDto: any, user: any) {
    this.logger.log(`Updating retention policy: ${policyId}`);

    const policy = await this.prisma.dataRetentionPolicy.update({
      where: { id: policyId },
      data: {
        ...policyDto,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    // Log policy update
    await this.auditService.logActivity({
      action: 'RETENTION_POLICY_UPDATED',
      entityType: 'DATA_RETENTION_POLICY',
      entityId: policyId,
      userId: user.id,
    });

    return policy;
  }

  async deleteRetentionPolicy(policyId: string, user: any) {
    this.logger.log(`Deleting retention policy: ${policyId}`);

    await this.prisma.dataRetentionPolicy.delete({
      where: { id: policyId },
    });

    // Log policy deletion
    await this.auditService.logActivity({
      action: 'RETENTION_POLICY_DELETED',
      entityType: 'DATA_RETENTION_POLICY',
      entityId: policyId,
      userId: user.id,
    });

    return { success: true };
  }

  async requestDataErasure(erasureDto: any, user: any) {
    this.logger.log(`Processing data erasure request for user: ${user.id}`);

    const { dataTypes, reason } = erasureDto;

    const erasureRequest = await this.prisma.dataErasureRequest.create({
      data: {
        userId: user.id,
        tenantId: user.tenantId,
        dataTypes,
        reason,
        status: 'PENDING',
        requestedAt: new Date(),
      },
    });

    // Log erasure request
    await this.auditService.logActivity({
      action: 'DATA_ERASURE_REQUESTED',
      entityType: 'DATA_ERASURE_REQUEST',
      entityId: erasureRequest.id,
      userId: user.id,
      details: { dataTypes, reason },
    });

    return erasureRequest;
  }

  async getDataErasureRequests(tenantId: string) {
    const requests = await this.prisma.dataErasureRequest.findMany({
      where: { tenantId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { requestedAt: 'desc' },
    });

    return requests;
  }

  async processDataErasure(requestId: string, user: any) {
    this.logger.log(`Processing data erasure request: ${requestId}`);

    const erasureRequest = await this.prisma.dataErasureRequest.findUnique({
      where: { id: requestId },
    });

    if (!erasureRequest) {
      throw new Error('Erasure request not found');
    }

    // Process erasure based on data types
    for (const dataType of erasureRequest.dataTypes) {
      await this.eraseDataByType(erasureRequest.userId, dataType);
    }

    // Update request status
    await this.prisma.dataErasureRequest.update({
      where: { id: requestId },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
        processedBy: user.id,
      },
    });

    // Log erasure completion
    await this.auditService.logActivity({
      action: 'DATA_ERASURE_COMPLETED',
      entityType: 'DATA_ERASURE_REQUEST',
      entityId: requestId,
      userId: user.id,
      details: { dataTypes: erasureRequest.dataTypes },
    });

    return { success: true };
  }

  private async eraseDataByType(userId: string, dataType: string) {
    // Implement data erasure based on type
    switch (dataType) {
      case 'patient_records':
        await this.erasePatientRecords(userId);
        break;
      case 'consultation_data':
        await this.eraseConsultationData(userId);
        break;
      case 'audit_logs':
        await this.eraseAuditLogs(userId);
        break;
      case 'session_data':
        await this.eraseSessionData(userId);
        break;
      default:
        this.logger.warn(`Unknown data type for erasure: ${dataType}`);
    }
  }

  private async erasePatientRecords(userId: string) {
    // Anonymize or delete patient records
    await this.prisma.patient.updateMany({
      where: { userId },
      data: {
        personalInfo: 'ANONYMIZED',
        contactInfo: 'ANONYMIZED',
        isActive: false,
      },
    });
  }

  private async eraseConsultationData(userId: string) {
    // Delete consultation records
    await this.prisma.telemedicineConsultation.deleteMany({
      where: { patientId: userId },
    });
  }

  private async eraseAuditLogs(userId: string) {
    // Delete audit logs
    await this.prisma.auditLog.deleteMany({
      where: { userId },
    });
  }

  private async eraseSessionData(userId: string) {
    // Delete session data
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async getRetentionStats(tenantId: string) {
    const policies = await this.prisma.dataRetentionPolicy.count({
      where: { tenantId },
    });

    const erasureRequests = await this.prisma.dataErasureRequest.count({
      where: { tenantId },
    });

    const pendingErasures = await this.prisma.dataErasureRequest.count({
      where: {
        tenantId,
        status: 'PENDING',
      },
    });

    return {
      tenantId,
      policiesConfigured: policies,
      totalErasureRequests: erasureRequests,
      pendingErasures,
    };
  }
}
