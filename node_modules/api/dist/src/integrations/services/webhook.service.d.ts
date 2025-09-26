import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class WebhookService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    handleWebhook(webhookId: string, webhookDto: any): Promise<{
        status: string;
        eventId: any;
    }>;
    createWebhook(webhookDto: any, user: any): Promise<{
        webhookId: any;
        name: any;
        url: any;
        secret: any;
        isActive: any;
    }>;
    getWebhooks(user: any): Promise<any>;
    updateWebhook(webhookId: string, webhookDto: any, user: any): Promise<{
        webhookId: any;
        name: any;
        url: any;
        isActive: any;
    }>;
    deleteWebhook(webhookId: string, user: any): Promise<void>;
    testWebhook(webhookId: string, user: any): Promise<{
        webhookId: string;
        status: string;
        response: {
            status: number;
            message: string;
        };
    }>;
    getStatus(tenantId: string): Promise<{
        integrationType: string;
        status: string;
        lastSyncAt: any;
        isActive: any;
    }>;
    getStats(tenantId: string): Promise<{
        totalWebhooks: any;
        totalEvents: any;
        eventsByStatus: any;
    }>;
    private processWebhookEvent;
    private handleAppointmentCreated;
    private handlePaymentCompleted;
    private handlePatientAdmitted;
    private sendWebhook;
    private generateWebhookSecret;
    private verifyWebhookSignature;
    private updateWebhookEventStatus;
}
