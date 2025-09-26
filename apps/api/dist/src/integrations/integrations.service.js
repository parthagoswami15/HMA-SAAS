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
var IntegrationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fhir_service_1 = require("./services/fhir.service");
const hl7_service_1 = require("./services/hl7.service");
const pacs_service_1 = require("./services/pacs.service");
const lis_service_1 = require("./services/lis.service");
const payment_gateway_service_1 = require("./services/payment-gateway.service");
const gst_service_1 = require("./services/gst.service");
const accounting_service_1 = require("./services/accounting.service");
const webhook_service_1 = require("./services/webhook.service");
const api_key_service_1 = require("./services/api-key.service");
let IntegrationsService = IntegrationsService_1 = class IntegrationsService {
    prisma;
    fhirService;
    hl7Service;
    pacsService;
    lisService;
    paymentGatewayService;
    gstService;
    accountingService;
    webhookService;
    apiKeyService;
    logger = new common_1.Logger(IntegrationsService_1.name);
    constructor(prisma, fhirService, hl7Service, pacsService, lisService, paymentGatewayService, gstService, accountingService, webhookService, apiKeyService) {
        this.prisma = prisma;
        this.fhirService = fhirService;
        this.hl7Service = hl7Service;
        this.pacsService = pacsService;
        this.lisService = lisService;
        this.paymentGatewayService = paymentGatewayService;
        this.gstService = gstService;
        this.accountingService = accountingService;
        this.webhookService = webhookService;
        this.apiKeyService = apiKeyService;
    }
    async getIntegrationStatus(user) {
        this.logger.log(`Getting integration status for tenant: ${user.tenantId}`);
        const [fhirStatus, hl7Status, pacsStatus, lisStatus, paymentStatus, gstStatus, accountingStatus, webhookStatus,] = await Promise.all([
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
    async getIntegrationConfigurations(user) {
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
    async updateIntegrationConfiguration(configDto, user) {
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
    async syncFhirData(syncDto, user) {
        this.logger.log(`Syncing FHIR data for tenant: ${user.tenantId}`);
        const { resourceType, syncFrom, syncTo } = syncDto;
        const syncResult = await this.fhirService.syncData(resourceType, syncFrom, syncTo, user.tenantId);
        return syncResult;
    }
    async syncHl7Data(syncDto, user) {
        this.logger.log(`Syncing HL7 data for tenant: ${user.tenantId}`);
        const { messageType, syncFrom, syncTo } = syncDto;
        const syncResult = await this.hl7Service.syncData(messageType, syncFrom, syncTo, user.tenantId);
        return syncResult;
    }
    async getSyncStatus(user) {
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
    async getIntegrationStats(user) {
        this.logger.log(`Getting integration stats for tenant: ${user.tenantId}`);
        const [fhirStats, hl7Stats, pacsStats, lisStats, paymentStats, webhookStats,] = await Promise.all([
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
    calculateOverallStatus(statuses) {
        const errorCount = statuses.filter(s => s.status === 'ERROR').length;
        const warningCount = statuses.filter(s => s.status === 'WARNING').length;
        if (errorCount > 0)
            return 'ERROR';
        if (warningCount > 0)
            return 'WARNING';
        if (statuses.every(s => s.status === 'HEALTHY'))
            return 'HEALTHY';
        return 'UNKNOWN';
    }
    async getIntegrationLogs(user, query) {
        this.logger.log(`Getting integration logs for tenant: ${user.tenantId}`);
        const { integrationType, fromDate, toDate, level } = query;
        const where = { tenantId: user.tenantId };
        if (integrationType)
            where.integrationType = integrationType;
        if (level)
            where.level = level;
        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate)
                where.createdAt.gte = new Date(fromDate);
            if (toDate)
                where.createdAt.lte = new Date(toDate);
        }
        const logs = await this.prisma.integrationLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        return logs;
    }
    async retryFailedIntegration(integrationId, user) {
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
        const retryResult = await this.retryIntegrationByType(failedLog.integrationType, failedLog);
        return retryResult;
    }
    async retryIntegrationByType(integrationType, log) {
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
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = IntegrationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fhir_service_1.FhirService,
        hl7_service_1.Hl7Service,
        pacs_service_1.PacsService,
        lis_service_1.LisService,
        payment_gateway_service_1.PaymentGatewayService,
        gst_service_1.GstService,
        accounting_service_1.AccountingService,
        webhook_service_1.WebhookService,
        api_key_service_1.ApiKeyService])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map