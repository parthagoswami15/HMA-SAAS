import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
export declare class PcpndtService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    requestAccess(requestDto: any, user: any): Promise<{
        id: any;
        status: any;
        requestedAt: any;
    }>;
    approveAccess(requestId: string, approverUser: any): Promise<any>;
    denyAccess(requestId: string, reason: string, approverUser: any): Promise<any>;
    getAccessLogs(query: any, user: any): Promise<{
        logs: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getComplianceStatus(): Promise<{
        totalRecords: any;
        compliantRecords: any;
        nonCompliantRecords: any;
        compliancePercentage: number;
        lastUpdated: Date;
        details: {
            totalRequests: any;
            approvedRequests: any;
            deniedRequests: any;
            pendingRequests: number;
            totalAccessLogs: any;
        };
    }>;
    validateCompliance(entityId: string): Promise<{
        isCompliant: boolean;
        issues: string[];
    }>;
    getCertificationStatus(userId: string): Promise<any>;
    validateUserCertification(userId: string): Promise<boolean>;
}
