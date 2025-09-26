import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class PaymentService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    processPayment(paymentDto: any, user: any): Promise<{
        paymentId: any;
        amount: number;
        status: string;
        reference: string;
    }>;
    processPostPayment(consultationId: string, paymentDetails: any): Promise<any>;
    processRefund(consultationId: string, refundDto: any, user: any): Promise<any>;
    getPaymentStatus(consultationId: string, user: any): Promise<{
        consultationId: string;
        paymentStatus: any;
        payments: any;
        refunds: any;
        totalPaid: any;
        totalRefunded: any;
    }>;
    getPaymentMethods(user: any): Promise<{
        method: string;
        name: string;
        supported: boolean;
        fees: number;
    }[]>;
    private calculateConsultationAmount;
    private processCardPayment;
    private processUpiPayment;
    private processNetBankingPayment;
    private processWalletPayment;
    private processInsurancePayment;
    getPaymentHistory(user: any): Promise<any>;
    getRevenueAnalytics(user: any): Promise<{
        totalRevenue: any;
        consultationCount: any;
        averageRevenuePerConsultation: number;
        monthlyRevenue: any;
    }>;
}
