import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FhirService } from './services/fhir.service';
import { Hl7Service } from './services/hl7.service';
import { PacsService } from './services/pacs.service';
import { LisService } from './services/lis.service';
import { PaymentGatewayService } from './services/payment-gateway.service';
import { GstService } from './services/gst.service';
import { AccountingService } from './services/accounting.service';
import { WebhookService } from './services/webhook.service';
import { ApiKeyService } from './services/api-key.service';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fhirService: FhirService,
    private readonly hl7Service: Hl7Service,
    private readonly pacsService: PacsService,
    private readonly lisService: LisService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly gstService: GstService,
    private readonly accountingService: AccountingService,
    private readonly webhookService: WebhookService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  async getIntegrationStatus(user: any) {
    this.logger.log(`Getting integration status for tenant: ${user.tenantId}`);

    const [
      fhirStatus,
      hl7Status,
      pacsStatus,
      lisStatus,
      paymentStatus,
      gstStatus,
      accountingStatus,
      webhookStatus,
    ] = await Promise.all([
      this.fhirService.getStatus(user.tenantId),
      this.hl7Service.getStatus(user.tenantId),
      this.pacsService.getStatus(user.tenantId),
      this.lisService.getStatus(user.tenantId),
      this.paymentGatewayService.getStatus(user.tenantId),
      this.gstService.getStatus(user.tenantId),
      this.accountingService.getStatus(user.tenantId),
      this.webhookService.getStatus(user.tenantId),
    ]);

    return {
      tenantId: user.tenantId,
      overall: this.calculateOverallStatus([
        fhirStatus,
        hl7Status,
        pacsStatus,
        lisStatus,
        paymentStatus,
        gstStatus,
        accountingStatus,
        webhookStatus,
      ]),
      integrations: {
        fhir: fhirStatus,
        hl7: hl7Status,
        pacs: pacsStatus,
        lis: lisStatus,
        payment: paymentStatus,
        gst: gstStatus,
        accounting: accountingStatus,
        webhooks: webhookStatus,
      },
    };
  }

  async getIntegrationConfigurations(user: any) {
    this.logger.log(`Getting integration configurations for tenant: ${user.tenantId}`);

    const configurations = await this.prisma.integrationConfiguration.findMany({
      where: { tenantId: user.tenantId },
      select: {
        id: true,
        integrationType: true,
        name: true,
        isActive: true,
        configuration: true,
        lastSyncAt: true,
        createdAt: true,
      },
    });

    return configurations;
  }

  async updateIntegrationConfiguration(configDto: any, user: any) {
    this.logger.log(`Updating integration configuration for tenant: ${user.tenantId}`);

    const { integrationType, configuration } = configDto;

    const updatedConfig = await this.prisma.integrationConfiguration.upsert({
      where: {
        tenantId_integrationType: {
          tenantId: user.tenantId,
          integrationType,
        },
      },
      update: {
        configuration,
        updatedAt: new Date(),
      },
      create: {
        tenantId: user.tenantId,
        integrationType,
        name: `${integrationType} Integration`,
        configuration,
        isActive: true,
      },
    });

    return updatedConfig;
  }

  async syncFhirData(syncDto: any, user: any) {
    this.logger.log(`Syncing FHIR data for tenant: ${user.tenantId}`);

    const { resourceType, syncFrom, syncTo } = syncDto;

    const syncResult = await this.fhirService.syncData(
      resourceType,
      syncFrom,
      syncTo,
      user.tenantId
    );

    return syncResult;
  }

  async syncHl7Data(syncDto: any, user: any) {
    this.logger.log(`Syncing HL7 data for tenant: ${user.tenantId}`);

    const { messageType, syncFrom, syncTo } = syncDto;

    const syncResult = await this.hl7Service.syncData(
      messageType,
      syncFrom,
      syncTo,
      user.tenantId
    );

    return syncResult;
  }

  async getSyncStatus(user: any) {
    this.logger.log(`Getting sync status for tenant: ${user.tenantId}`);

    const syncJobs = await this.prisma.dataSyncJob.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { startedAt: 'desc' },
      take: 10,
    });

    return syncJobs.map(job => ({
      id: job.id,
      syncType: job.syncType,
      status: job.status,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      recordsProcessed: job.recordsProcessed,
      errors: job.errors,
    }));
  }

  async getIntegrationStats(user: any) {
    this.logger.log(`Getting integration stats for tenant: ${user.tenantId}`);

    const [
      fhirStats,
      hl7Stats,
      pacsStats,
      lisStats,
      paymentStats,
      webhookStats,
    ] = await Promise.all([
      this.fhirService.getStats(user.tenantId),
      this.hl7Service.getStats(user.tenantId),
      this.pacsService.getStats(user.tenantId),
      this.lisService.getStats(user.tenantId),
      this.paymentGatewayService.getStats(user.tenantId),
      this.webhookService.getStats(user.tenantId),
    ]);

    return {
      tenantId: user.tenantId,
      fhir: fhirStats,
      hl7: hl7Stats,
      pacs: pacsStats,
      lis: lisStats,
      payment: paymentStats,
      webhooks: webhookStats,
    };
  }

  private calculateOverallStatus(statuses: any[]): 'HEALTHY' | 'WARNING' | 'ERROR' | 'UNKNOWN' {
    const errorCount = statuses.filter(s => s.status === 'ERROR').length;
    const warningCount = statuses.filter(s => s.status === 'WARNING').length;

    if (errorCount > 0) return 'ERROR';
    if (warningCount > 0) return 'WARNING';
    if (statuses.every(s => s.status === 'HEALTHY')) return 'HEALTHY';
    return 'UNKNOWN';
  }

  async getIntegrationLogs(user: any, query: any) {
    this.logger.log(`Getting integration logs for tenant: ${user.tenantId}`);

    const { integrationType, fromDate, toDate, level } = query;

    const where: any = { tenantId: user.tenantId };
    if (integrationType) where.integrationType = integrationType;
    if (level) where.level = level;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const logs = await this.prisma.integrationLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return logs;
  }

  async retryFailedIntegration(integrationId: string, user: any) {
    this.logger.log(`Retrying failed integration: ${integrationId}`);

    const failedLog = await this.prisma.integrationLog.findFirst({
      where: {
        id: integrationId,
        tenantId: user.tenantId,
        level: 'ERROR',
      },
    });

    if (!failedLog) {
      throw new Error('Failed integration log not found');
    }

    // Retry the integration based on type
    const retryResult = await this.retryIntegrationByType(failedLog.integrationType, failedLog);

    return retryResult;
  }

  private async retryIntegrationByType(integrationType: string, log: any) {
    switch (integrationType) {
      case 'FHIR':
        return this.fhirService.retryOperation(log);
      case 'HL7':
        return this.hl7Service.retryOperation(log);
      case 'PACS':
        return this.pacsService.retryOperation(log);
      case 'LIS':
        return this.lisService.retryOperation(log);
      default:
        throw new Error(`Unknown integration type: ${integrationType}`);
    }
  }
}
