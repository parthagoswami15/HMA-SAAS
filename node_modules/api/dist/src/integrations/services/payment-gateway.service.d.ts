import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class PaymentGatewayService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    processPayment(paymentDto: any, user: any): Promise<{
        paymentId: any;
        amount: any;
        status: string;
        reference: string;
    }>;
    getPaymentStatus(paymentId: string, user: any): Promise<{
        paymentId: string;
        amount: any;
        currency: any;
        paymentMethod: any;
        status: any;
        processedAt: any;
        gatewayResponse: any;
    }>;
    processRefund(refundDto: any, user: any): Promise<{
        refundId: any;
        paymentId: any;
        amount: any;
        status: string;
    }>;
    getAvailableGateways(user: any): Promise<any>;
    getStatus(tenantId: string): Promise<{
        integrationType: string;
        status: string;
        lastSyncAt: any;
        isActive: any;
    }>;
    getStats(tenantId: string): Promise<{
        totalTransactions: any;
        totalRefunds: any;
        totalAmount: any;
        refundedAmount: any;
        transactionsByMethod: any;
    }>;
    private processUpiPayment;
    private processCardPayment;
    private processNetBankingPayment;
    private processWalletPayment;
    private processRefundWithGateway;
}
