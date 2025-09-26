import { PrismaService } from '../../prisma/prisma.service';
export declare class AuditService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    logActivity(activityDto: any): Promise<any>;
    getAuditLogs(query: any, user: any): Promise<any>;
    getEntityAuditLogs(entityType: string, entityId: string, user: any): Promise<any>;
    getAuditStats(tenantId: string): Promise<{
        tenantId: string;
        totalLogs: any;
        logsLast24h: any;
        logsByAction: any;
        logsByEntityType: any;
    }>;
    cleanupOldAuditLogs(retentionDays?: number): Promise<{
        deletedCount: any;
    }>;
    searchAuditLogs(searchQuery: string, user: any): Promise<any>;
}
