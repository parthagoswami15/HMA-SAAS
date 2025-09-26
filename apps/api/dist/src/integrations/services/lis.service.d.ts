import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class LisService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    createLabOrder(orderDto: any, user: any): Promise<{
        orderId: any;
        status: string;
        message: string;
    }>;
    getLabOrder(orderId: string, user: any): Promise<any>;
    updateLabResult(orderId: string, resultDto: any, user: any): Promise<{
        resultId: any;
        orderId: string;
        testId: any;
        status: any;
    }>;
    getPatientLabOrders(patientId: string, user: any): Promise<any>;
    getStatus(tenantId: string): Promise<{
        integrationType: string;
        status: string;
        lastSyncAt: any;
        isActive: any;
    }>;
    getStats(tenantId: string): Promise<{
        totalOrders: any;
        totalResults: any;
        ordersByStatus: any;
        resultsByStatus: any;
    }>;
    retryOperation(log: any): Promise<{
        success: boolean;
        message: string;
    }>;
    private updateOrderStatus;
}
