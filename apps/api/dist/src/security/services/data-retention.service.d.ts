import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
export declare class DataRetentionService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getRetentionPolicies(tenantId: string): Promise<any>;
    createRetentionPolicy(policyDto: any, user: any): Promise<any>;
    updateRetentionPolicy(policyId: string, policyDto: any, user: any): Promise<any>;
    deleteRetentionPolicy(policyId: string, user: any): Promise<{
        success: boolean;
    }>;
    requestDataErasure(erasureDto: any, user: any): Promise<any>;
    getDataErasureRequests(tenantId: string): Promise<any>;
    processDataErasure(requestId: string, user: any): Promise<{
        success: boolean;
    }>;
    private eraseDataByType;
    private erasePatientRecords;
    private eraseConsultationData;
    private eraseAuditLogs;
    private eraseSessionData;
    getRetentionStats(tenantId: string): Promise<{
        tenantId: string;
        policiesConfigured: any;
        totalErasureRequests: any;
        pendingErasures: any;
    }>;
}
