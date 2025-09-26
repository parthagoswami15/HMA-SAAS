export declare enum PerformanceMetricType {
    PATIENT_VISITS = "PATIENT_VISITS",
    PROCEDURES = "PROCEDURES",
    REVENUE = "REVENUE",
    PATIENT_SATISFACTION = "PATIENT_SATISFACTION",
    DOCUMENTATION_COMPLETENESS = "DOCUMENTATION_COMPLETENESS",
    ON_TIME_ARRIVAL = "ON_TIME_ARRIVAL",
    PRODUCTIVITY = "PRODUCTIVITY",
    QUALITY = "QUALITY",
    EFFICIENCY = "EFFICIENCY",
    CUSTOM = "CUSTOM"
}
export declare enum PerformanceTimeframe {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY",
    CUSTOM = "CUSTOM"
}
export declare class PerformanceMetricDto {
    type: PerformanceMetricType;
    name: string;
    value: number;
    target?: number;
    unit?: string;
    isPositive?: boolean;
    metadata?: Record<string, any>;
}
export declare class StaffPerformanceDto {
    staffId: string;
    staffName: string;
    department?: string;
    designation?: string;
    metrics: PerformanceMetricDto[];
    overallScore: number;
    rating: number;
    periodStart: string;
    periodEnd: string;
    evaluatedAt?: string;
    evaluatedById?: string;
    evaluatedByName?: string;
    comments?: string;
}
export declare class PerformanceQueryDto {
    staffId?: string;
    departmentId?: string;
    metricType?: PerformanceMetricType;
    minRating?: number;
    maxRating?: number;
    startDate?: string;
    endDate?: string;
    timeframe?: PerformanceTimeframe;
    includeDetails?: boolean;
    page?: number;
    limit?: number;
}
export declare class PerformanceGoalDto {
    title: string;
    description: string;
    metricType: PerformanceMetricType;
    targetValue: number;
    currentValue: number;
    startDate: string;
    targetDate: string;
    completedDate?: string;
    progress: number;
    priority?: number;
    isActive?: boolean;
    notes?: string;
    tags?: string[];
}
