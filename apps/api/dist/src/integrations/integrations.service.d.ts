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
export declare class IntegrationsService {
    private readonly prisma;
    private readonly fhirService;
    private readonly hl7Service;
    private readonly pacsService;
    private readonly lisService;
    private readonly paymentGatewayService;
    private readonly gstService;
    private readonly accountingService;
    private readonly webhookService;
    private readonly apiKeyService;
    private readonly logger;
    constructor(prisma: PrismaService, fhirService: FhirService, hl7Service: Hl7Service, pacsService: PacsService, lisService: LisService, paymentGatewayService: PaymentGatewayService, gstService: GstService, accountingService: AccountingService, webhookService: WebhookService, apiKeyService: ApiKeyService);
    getIntegrationStatus(user: any): Promise<{
        tenantId: any;
        overall: "UNKNOWN" | "ERROR" | "HEALTHY" | "WARNING";
        integrations: {
            fhir: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            hl7: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            pacs: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            lis: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            payment: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            gst: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            accounting: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
            webhooks: {
                integrationType: string;
                status: string;
                lastSyncAt: any;
                isActive: any;
            };
        };
    }>;
    getIntegrationConfigurations(user: any): Promise<any>;
    updateIntegrationConfiguration(configDto: any, user: any): Promise<any>;
    syncFhirData(syncDto: any, user: any): Promise<{
        resourceType: string;
        syncedFrom: Date;
        syncedTo: Date;
        recordsProcessed: number;
        errors: never[];
    }>;
    syncHl7Data(syncDto: any, user: any): Promise<{
        messageType: string;
        syncedFrom: Date;
        syncedTo: Date;
        recordsProcessed: number;
        errors: never[];
    }>;
    getSyncStatus(user: any): Promise<any>;
    getIntegrationStats(user: any): Promise<{
        tenantId: any;
        fhir: {
            patients: any;
            observations: any;
            encounters: any;
        };
        hl7: {
            totalMessages: any;
            processedMessages: any;
            failedMessages: any;
            messagesByType: any;
        };
        pacs: {
            totalStudies: any;
            totalReports: any;
            studiesByModality: any;
            studiesByStatus: any;
        };
        lis: {
            totalOrders: any;
            totalResults: any;
            ordersByStatus: any;
            resultsByStatus: any;
        };
        payment: {
            totalTransactions: any;
            totalRefunds: any;
            totalAmount: any;
            refundedAmount: any;
            transactionsByMethod: any;
        };
        webhooks: {
            totalWebhooks: any;
            totalEvents: any;
            eventsByStatus: any;
        };
    }>;
    private calculateOverallStatus;
    getIntegrationLogs(user: any, query: any): Promise<any>;
    retryFailedIntegration(integrationId: string, user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    private retryIntegrationByType;
}
