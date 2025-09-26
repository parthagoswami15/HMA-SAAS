import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogDto, AuditQueryDto } from '../dto/compliance.dto';
export declare class AuditService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    logActivity(auditData: {
        action: string;
        entityType: string;
        entityId?: string;
        userId: string;
        oldValues?: any;
        newValues?: any;
        details?: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<any>;
    getAuditLogs(query: AuditQueryDto, user: any): Promise<{
        logs: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    createAuditLog(auditDto: AuditLogDto, user: any): Promise<any>;
    getComplianceStatus(): Promise<{
        totalRecords: any;
        compliantRecords: any;
        nonCompliantRecords: number;
        compliancePercentage: number;
        lastUpdated: Date;
        todayActivity: any;
    }>;
    validateCompliance(entityId: string): Promise<{
        isCompliant: boolean;
        issues: never[];
    }>;
    getEntityAuditTrail(entityType: string, entityId: string, user: any): Promise<any>;
    getUserActivitySummary(userId: string, fromDate?: Date, toDate?: Date): Promise<{
        userId: string;
        period: {
            from: Date | undefined;
            to: Date | undefined;
        };
        totalActivities: any;
        activitiesByAction: any;
    }>;
    generateAuditReport(query: any, user: any): Promise<{
        period: {
            from: any;
            to: any;
        };
        summary: {
            totalLogs: any;
            uniqueUsers: any;
            uniqueEntities: any;
            actionsCount: any;
        };
        topActions: any;
        generatedAt: Date;
        generatedBy: any;
    }>;
}
