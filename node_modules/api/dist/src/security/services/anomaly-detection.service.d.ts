import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
export declare class AnomalyDetectionService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    detectAnomalies(user: any): Promise<({
        type: string;
        severity: string;
        description: string;
        metadata: {
            failedCount: any;
            ipCount?: undefined;
            ips?: undefined;
            unusualCount?: undefined;
        };
    } | {
        type: string;
        severity: string;
        description: string;
        metadata: {
            ipCount: number;
            ips: unknown[];
            failedCount?: undefined;
            unusualCount?: undefined;
        };
    } | {
        type: string;
        severity: string;
        description: string;
        metadata: {
            unusualCount: any;
            failedCount?: undefined;
            ipCount?: undefined;
            ips?: undefined;
        };
    } | {
        type: string;
        severity: string;
        description: string;
        metadata: {
            rapidActions: number;
            sensitiveAccessCount?: undefined;
        };
    } | {
        type: string;
        severity: string;
        description: string;
        metadata: {
            sensitiveAccessCount: any;
            rapidActions?: undefined;
        };
    } | {
        type: string;
        severity: string;
        description: string;
        metadata: {
            bulkAccessCount: any;
            dailyAverage?: undefined;
        };
    } | {
        type: string;
        severity: string;
        description: string;
        metadata: {
            dailyAverage: number;
            bulkAccessCount?: undefined;
        };
    })[]>;
    getAnomalies(query: any, user: any): Promise<any>;
    resolveAnomaly(anomalyId: string, resolveDto: any, user: any): Promise<any>;
    private detectLoginAnomalies;
    private detectAccessAnomalies;
    private detectDataAccessAnomalies;
    private detectRapidActions;
    getAnomalyStats(user: any): Promise<{
        tenantId: any;
        totalAnomalies: any;
        unresolvedAnomalies: any;
        anomaliesByType: any;
        anomaliesBySeverity: any;
    }>;
}
