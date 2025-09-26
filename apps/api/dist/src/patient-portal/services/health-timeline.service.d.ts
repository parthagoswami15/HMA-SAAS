import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class HealthTimelineService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getHealthTimeline(query: any, user: any): Promise<{
        entries: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    getTimelineSummary(user: any): Promise<{
        userId: any;
        totalEntries: any;
        entriesByType: any;
        recentEntries: any;
        monthlyEntries: any;
    }>;
    addTimelineEntry(entryDto: any, user: any): Promise<any>;
    updateTimelineEntry(entryId: string, updateDto: any, user: any): Promise<any>;
    deleteTimelineEntry(entryId: string, user: any): Promise<void>;
    getRecentTimeline(user: any): Promise<any>;
    getTimelineByType(type: string, user: any): Promise<any>;
    hideTimelineEntry(entryId: string, user: any): Promise<any>;
    getTimelineStats(user: any): Promise<{
        userId: any;
        totalEntries: any;
        visibleEntries: any;
        hiddenEntries: number;
        entriesByType: any;
        monthlyEntries: any;
    }>;
}
