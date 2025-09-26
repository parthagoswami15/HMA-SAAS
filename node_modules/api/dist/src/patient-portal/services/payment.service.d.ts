import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class PaymentService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getBills(query: any, user: any): Promise<{
        bills: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    processPayment(paymentDto: any, user: any): Promise<{
        paymentId: any;
        billId: any;
        amount: any;
        status: string;
        reference: string;
    }>;
    getPaymentHistory(query: any, user: any): Promise<{
        payments: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    getPaymentStatus(paymentId: string, user: any): Promise<{
        paymentId: string;
        amount: any;
        paymentMethod: any;
        status: any;
        paidAt: any;
        bill: any;
    }>;
    getPendingBills(user: any): Promise<any>;
    getPaymentMethods(user: any): Promise<{
        method: string;
        name: string;
        supported: boolean;
        fees: number;
    }[]>;
    getPaymentStats(user: any): Promise<{
        userId: any;
        totalPayments: any;
        totalAmount: any;
        pendingBills: any;
        pendingAmount: any;
        paymentsByMethod: any;
    }>;
    private processUpiPayment;
    private processCardPayment;
    private processNetBankingPayment;
    private processWalletPayment;
}
