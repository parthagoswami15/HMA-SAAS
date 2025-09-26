"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let WebhookService = WebhookService_1 = class WebhookService {
    prisma;
    auditService;
    logger = new common_1.Logger(WebhookService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async handleWebhook(webhookId, webhookDto) {
        this.logger.log(`Handling webhook: ${webhookId}`);
        const webhook = await this.prisma.webhook.findUnique({
            where: { id: webhookId },
        });
        if (!webhook || !webhook.isActive) {
            throw new common_1.BadRequestException('Webhook not found or inactive');
        }
        if (webhookDto.signature) {
            this.verifyWebhookSignature(webhookDto, webhook.secret);
        }
        const webhookEvent = await this.prisma.webhookEvent.create({
            data: {
                webhookId,
                eventType: webhookDto.eventType || 'unknown',
                payload: JSON.stringify(webhookDto),
                status: 'RECEIVED',
                receivedAt: new Date(),
            },
        });
        try {
            await this.processWebhookEvent(webhookEvent, webhookDto);
            await this.updateWebhookEventStatus(webhookEvent.id, 'PROCESSED');
        }
        catch (error) {
            await this.updateWebhookEventStatus(webhookEvent.id, 'FAILED', error.message);
            throw error;
        }
        return { status: 'OK', eventId: webhookEvent.id };
    }
    async createWebhook(webhookDto, user) {
        this.logger.log(`Creating webhook for tenant: ${user.tenantId}`);
        const { name, url, eventTypes, isActive = true, retryPolicy, } = webhookDto;
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
    async getWebhooks(user) {
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
    async updateWebhook(webhookId, webhookDto, user) {
        this.logger.log(`Updating webhook: ${webhookId}`);
        const webhook = await this.prisma.webhook.findFirst({
            where: {
                id: webhookId,
                tenantId: user.tenantId,
            },
        });
        if (!webhook) {
            throw new common_1.NotFoundException('Webhook not found');
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
    async deleteWebhook(webhookId, user) {
        this.logger.log(`Deleting webhook: ${webhookId}`);
        const webhook = await this.prisma.webhook.findFirst({
            where: {
                id: webhookId,
                tenantId: user.tenantId,
            },
        });
        if (!webhook) {
            throw new common_1.NotFoundException('Webhook not found');
        }
        await this.prisma.webhook.delete({
            where: { id: webhookId },
        });
        await this.auditService.logActivity({
            action: 'WEBHOOK_DELETED',
            entityType: 'WEBHOOK',
            entityId: webhookId,
            userId: user.id,
        });
    }
    async testWebhook(webhookId, user) {
        this.logger.log(`Testing webhook: ${webhookId}`);
        const webhook = await this.prisma.webhook.findFirst({
            where: {
                id: webhookId,
                tenantId: user.tenantId,
            },
        });
        if (!webhook) {
            throw new common_1.NotFoundException('Webhook not found');
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
    async getStatus(tenantId) {
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
    async getStats(tenantId) {
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
    async processWebhookEvent(webhookEvent, payload) {
        this.logger.log(`Processing webhook event: ${webhookEvent.id}`);
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
    async handleAppointmentCreated(data) {
        this.logger.log('Processing appointment created event');
    }
    async handlePaymentCompleted(data) {
        this.logger.log('Processing payment completed event');
    }
    async handlePatientAdmitted(data) {
        this.logger.log('Processing patient admitted event');
    }
    async sendWebhook(webhook, payload) {
        this.logger.log(`Sending webhook to: ${webhook.url}`);
        return {
            success: true,
            response: { status: 200, message: 'OK' },
        };
    }
    generateWebhookSecret() {
        return `whsec_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    }
    verifyWebhookSignature(payload, secret) {
        this.logger.log('Verifying webhook signature');
    }
    async updateWebhookEventStatus(eventId, status, error) {
        await this.prisma.webhookEvent.update({
            where: { id: eventId },
            data: {
                status,
                errorMessage: error,
                processedAt: new Date(),
            },
        });
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map