export declare enum TestPriority {
    STAT = "STAT",
    URGENT = "URGENT",
    ROUTINE = "ROUTINE"
}
export declare enum TATStatus {
    ON_TIME = "ON_TIME",
    WARNING = "WARNING",
    OVERDUE = "OVERDUE"
}
export declare class TATConfigDto {
    id: string;
    testId: string;
    priority: TestPriority;
    targetMinutes: number;
    warningMinutes: number;
    isActive: boolean;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class TATMetricsDto {
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
    status: TATStatus;
}
export declare class CreateTATConfigDto {
    testId: string;
    priority: TestPriority;
    targetMinutes: number;
    warningMinutes: number;
    isActive: boolean;
}
export declare class UpdateTATConfigDto {
    targetMinutes?: number;
    warningMinutes?: number;
    isActive?: boolean;
}
export declare class TATPerformanceDto {
    summary: {
        totalTests: number;
        onTimeTests: number;
        warningTests: number;
        overdueTests: number;
        onTimePercentage: number;
        averageTAT: number;
        medianTAT: number;
    };
    priorityBreakdown: {
        STAT: any;
        URGENT: any;
        ROUTINE: any;
    };
}
export declare class SLAViolationDto {
    orderId: string;
    testId: string;
    testName: string;
    priority: string;
    targetMinutes: number;
    actualMinutes: number;
    minutesOverdue: number;
    orderedAt: Date;
    resultedAt: Date;
}
export declare class STATOrderAlertDto {
    orderId: string;
    patientName: string;
    testName: string;
    minutesOverdue: number;
    priority: string;
    orderedAt: Date;
}
