import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    listActivePlans(): any;
    getSubscription(tenantId: string): Promise<any>;
    changePlan(tenantId: string, planCode: string): Promise<any>;
    cancelSubscription(tenantId: string): Promise<{
        ok: boolean;
    }>;
    createCheckoutSession(tenantId: string, planCode: string): Promise<{
        provider: string;
        order: import("razorpay/dist/types/orders").Orders.RazorpayOrder;
    }>;
    verifyWebhook(signature: string, bodyRaw: string): Promise<boolean>;
    handleWebhookParsed(event: any): Promise<{
        ok: boolean;
    }>;
}
