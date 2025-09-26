import { PrismaService } from '../../prisma/prisma.service';
export interface TATConfig {
    id: string;
    testId: string;
    priority: 'STAT' | 'URGENT' | 'ROUTINE';
    targetMinutes: number;
    warningMinutes: number;
    isActive: boolean;
    tenantId: string;
}
export interface TATMetrics {
    orderId: string;
    testId: string;
    testName: string;
    priority: string;
    orderedAt: Date;
    collectedAt?: Date;
    receivedAt?: Date;
    resultedAt?: Date;
    verifiedAt?: Date;
    publishedAt?: Date;
    tatMinutes: number;
    isWithinTarget: boolean;
    isOverdue: boolean;
    status: 'ON_TIME' | 'WARNING' | 'OVERDUE';
}
export declare class LabTatService {
    private prisma;
    constructor(prisma: PrismaService);
    private defaultTATConfigs;
    calculateTAT(orderId: string): Promise<TATMetrics[]>;
    getTATPerformance(tenantId: string, startDate: Date, endDate: Date): Promise<any>;
    checkSLAViolations(tenantId: string): Promise<any[]>;
    getTATConfigs(tenantId: string): Promise<TATConfig[]>;
    updateTATConfig(id: string, config: Partial<TATConfig>): Promise<TATConfig>;
    getSTATOrdersRequiringAttention(): Promise<any[]>;
    private calculateSingleTAT;
    private checkSingleSLAViolation;
    private getTATConfig;
    private aggregateTATMetrics;
    private aggregateByPriority;
    private calculateMedian;
}
