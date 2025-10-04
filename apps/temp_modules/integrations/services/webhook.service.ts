import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async handleWebhook(webhookId: string, webhookDto: any) {
    this.logger.log(`Handling webhook: ${webhookId}`);

    const webhook = await this.prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook || !webhook.isActive) {
      throw new BadRequestException('Webhook not found or inactive');
    }

    // Verify webhook signature if provided
    if (webhookDto.signature) {
      this.verifyWebhookSignature(webhookDto, webhook.secret);
    }

    // Log webhook event
    const webhookEvent = await this.prisma.webhookEvent.create({
      data: {
        webhookId,
        eventType: webhookDto.eventType || 'unknown',
        payload: JSON.stringify(webhookDto),
        status: 'RECEIVED',
        receivedAt: new Date(),
      },
    });

    // Process webhook based on event type
    try {
      await this.processWebhookEvent(webhookEvent, webhookDto);
      await this.updateWebhookEventStatus(webhookEvent.id, 'PROCESSED');
    } catch (error) {
      await this.updateWebhookEventStatus(webhookEvent.id, 'FAILED', error.message);
      throw error;
    }

    return { status: 'OK', eventId: webhookEvent.id };
  }

  async createWebhook(webhookDto: any, user: any) {
    this.logger.log(`Creating webhook for tenant: ${user.tenantId}`);

    const {
      name,
      url,
      eventTypes,
      isActive = true,
      retryPolicy,
    } = webhookDto;

    const webhook = await this.prisma.webhook.create({
      data: {
        tenantId: user.tenantId,
        name,
        url,
        eventTypes: JSON.stringify(eventTypes),
        secret: this.generateWebhookSecret(),
        isActive,
        retryPolicy: JSON.stringify(retryPolicy || { maxRetries: 3, backoffMs: 1000 }),
        createdBy: user.id,
      },
    });

    // Log webhook creation
    await this.auditService.logActivity({
      action: 'WEBHOOK_CREATED',
      entityType: 'WEBHOOK',
      entityId: webhook.id,
      userId: user.id,
      details: { name, url },
    });

    return {
      webhookId: webhook.id,
      name: webhook.name,
      url: webhook.url,
      secret: webhook.secret,
      isActive: webhook.isActive,
    };
  }

  async getWebhooks(user: any) {
    this.logger.log(`Getting webhooks for tenant: ${user.tenantId}`);

    const webhooks = await this.prisma.webhook.findMany({
      where: { tenantId: user.tenantId },
      select: {
        id: true,
        name: true,
        url: true,
        eventTypes: true,
        isActive: true,
        createdAt: true,
        lastTriggeredAt: true,
      },
    });

    return webhooks.map(webhook => ({
      webhookId: webhook.id,
      name: webhook.name,
      url: webhook.url,
      eventTypes: JSON.parse(webhook.eventTypes || '[]'),
      isActive: webhook.isActive,
      createdAt: webhook.createdAt,
      lastTriggeredAt: webhook.lastTriggeredAt,
    }));
  }

  async updateWebhook(webhookId: string, webhookDto: any, user: any) {
    this.logger.log(`Updating webhook: ${webhookId}`);

    const webhook = await this.prisma.webhook.findFirst({
      where: {
        id: webhookId,
        tenantId: user.tenantId,
      },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    const updatedWebhook = await this.prisma.webhook.update({
      where: { id: webhookId },
      data: {
        ...webhookDto,
        eventTypes: webhookDto.eventTypes ? JSON.stringify(webhookDto.eventTypes) : undefined,
        retryPolicy: webhookDto.retryPolicy ? JSON.stringify(webhookDto.retryPolicy) : undefined,
        updatedAt: new Date(),
      },
    });

    // Log webhook update
    await this.auditService.logActivity({
      action: 'WEBHOOK_UPDATED',
      entityType: 'WEBHOOK',
      entityId: webhookId,
      userId: user.id,
      details: webhookDto,
    });

    return {
      webhookId: updatedWebhook.id,
      name: updatedWebhook.name,
      url: updatedWebhook.url,
      isActive: updatedWebhook.isActive,
    };
  }

  async deleteWebhook(webhookId: string, user: any) {
    this.logger.log(`Deleting webhook: ${webhookId}`);

    const webhook = await this.prisma.webhook.findFirst({
      where: {
        id: webhookId,
        tenantId: user.tenantId,
      },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    await this.prisma.webhook.delete({
      where: { id: webhookId },
    });

    // Log webhook deletion
    await this.auditService.logActivity({
      action: 'WEBHOOK_DELETED',
      entityType: 'WEBHOOK',
      entityId: webhookId,
      userId: user.id,
    });
  }

  async testWebhook(webhookId: string, user: any) {
    this.logger.log(`Testing webhook: ${webhookId}`);

    const webhook = await this.prisma.webhook.findFirst({
      where: {
        id: webhookId,
        tenantId: user.tenantId,
      },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    const testPayload = {
      eventType: 'webhook.test',
      timestamp: new Date().toISOString(),
      data: { test: true },
    };

    const result = await this.sendWebhook(webhook, testPayload);

    return {
      webhookId,
      status: result.success ? 'SUCCESS' : 'FAILED',
      response: result.response,
    };
  }

  async getStatus(tenantId: string) {
    this.logger.log(`Getting webhook status for tenant: ${tenantId}`);

    const config = await this.prisma.integrationConfiguration.findFirst({
      where: {
        tenantId,
        integrationType: 'WEBHOOK',
      },
    });

    return {
      integrationType: 'WEBHOOK',
      status: config?.isActive ? 'HEALTHY' : 'ERROR',
      lastSyncAt: config?.lastSyncAt,
      isActive: config?.isActive || false,
    };
  }

  async getStats(tenantId: string) {
    this.logger.log(`Getting webhook stats for tenant: ${tenantId}`);

    const webhookCount = await this.prisma.webhook.count({ where: { tenantId } });
    const eventCount = await this.prisma.webhookEvent.count({ where: { tenantId } });

    const eventsByStatus = await this.prisma.webhookEvent.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { status: true },
    });

    return {
      totalWebhooks: webhookCount,
      totalEvents: eventCount,
      eventsByStatus,
    };
  }

  private async processWebhookEvent(webhookEvent: any, payload: any) {
    this.logger.log(`Processing webhook event: ${webhookEvent.id}`);

    // In production, implement event processing logic
    switch (payload.eventType) {
      case 'appointment.created':
        await this.handleAppointmentCreated(payload.data);
        break;
      case 'payment.completed':
        await this.handlePaymentCompleted(payload.data);
        break;
      case 'patient.admitted':
        await this.handlePatientAdmitted(payload.data);
        break;
      default:
        this.logger.log(`Unhandled event type: ${payload.eventType}`);
    }
  }

  private async handleAppointmentCreated(data: any) {
    // Process appointment created event
    this.logger.log('Processing appointment created event');
  }

  private async handlePaymentCompleted(data: any) {
    // Process payment completed event
    this.logger.log('Processing payment completed event');
  }

  private async handlePatientAdmitted(data: any) {
    // Process patient admitted event
    this.logger.log('Processing patient admitted event');
  }

  private async sendWebhook(webhook: any, payload: any) {
    // In production, send HTTP request to webhook URL
    this.logger.log(`Sending webhook to: ${webhook.url}`);

    // Mock webhook sending
    return {
      success: true,
      response: { status: 200, message: 'OK' },
    };
  }

  private generateWebhookSecret(): string {
    return `whsec_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  private verifyWebhookSignature(payload: any, secret: string) {
    // In production, verify HMAC signature
    this.logger.log('Verifying webhook signature');
  }

  private async updateWebhookEventStatus(eventId: string, status: string, error?: string) {
    await this.prisma.webhookEvent.update({
      where: { id: eventId },
      data: {
        status,
        errorMessage: error,
        processedAt: new Date(),
      },
    });
  }
}
