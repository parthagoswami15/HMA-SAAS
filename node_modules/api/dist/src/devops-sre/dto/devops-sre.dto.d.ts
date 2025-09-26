export declare enum DeploymentStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    ROLLED_BACK = "ROLLED_BACK"
}
export declare enum IncidentSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare enum IncidentStatus {
    OPEN = "OPEN",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
export declare enum BackupStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PARTIAL = "PARTIAL"
}
export declare enum MetricType {
    COUNTER = "COUNTER",
    GAUGE = "GAUGE",
    HISTOGRAM = "HISTOGRAM",
    SUMMARY = "SUMMARY"
}
export declare enum AlertSeverity {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    CRITICAL = "CRITICAL"
}
export declare class CreateDeploymentDto {
    version: string;
    environment: string;
    description?: string;
    features?: string[];
    configChanges?: Record<string, any>;
    rollbackPlan?: string;
}
export declare class DeploymentFilterDto {
    environment?: string;
    status?: DeploymentStatus;
    version?: string;
    dateFrom?: string;
    dateTo?: string;
}
export declare class DeploymentListDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: boolean;
}
export declare class CreateIncidentDto {
    title: string;
    description: string;
    severity: IncidentSeverity;
    affectedServices?: string[];
    environment?: string;
    errorDetails?: Record<string, any>;
    stepsToReproduce?: string;
    workaround?: string;
}
export declare class UpdateIncidentDto {
    title?: string;
    description?: string;
    severity?: IncidentSeverity;
    status?: IncidentStatus;
    affectedServices?: string[];
    errorDetails?: Record<string, any>;
    stepsToReproduce?: string;
    workaround?: string;
    resolution?: string;
    rootCause?: string;
    preventionMeasures?: string;
}
export declare class IncidentFilterDto {
    severity?: IncidentSeverity;
    status?: IncidentStatus;
    environment?: string;
    service?: string;
    assignedTo?: string;
    dateFrom?: string;
    dateTo?: string;
}
export declare class CreateBackupDto {
    name: string;
    description?: string;
    backupType?: string;
    tenantIds?: string[];
    dataTypes?: string[];
    compression?: boolean;
    encryption?: boolean;
}
export declare class BackupFilterDto {
    status?: BackupStatus;
    backupType?: string;
    tenantId?: string;
    dateFrom?: string;
    dateTo?: string;
}
export declare class RestoreRequestDto {
    backupId: string;
    targetEnvironment?: string;
    pointInTime?: string;
    tenantIds?: string[];
    testRestore?: boolean;
}
export declare class CreateMetricDto {
    name: string;
    type: MetricType;
    description?: string;
    labels?: Record<string, string>;
    value?: number;
    timestamp?: string;
}
export declare class MetricQueryDto {
    metricName: string;
    labelFilters?: Record<string, string>;
    startTime?: string;
    endTime?: string;
    step?: string;
}
export declare class CreateAlertRuleDto {
    name: string;
    query: string;
    severity: AlertSeverity;
    description?: string;
    threshold?: number;
    operator?: string;
    evaluationInterval?: number;
    forDuration?: string;
    notificationChannels?: string[];
    labels?: Record<string, string>;
}
export declare class UpdateAlertRuleDto {
    name?: string;
    query?: string;
    severity?: AlertSeverity;
    description?: string;
    threshold?: number;
    operator?: string;
    evaluationInterval?: number;
    forDuration?: string;
    notificationChannels?: string[];
    labels?: Record<string, string>;
    enabled?: boolean;
}
export declare class CreateSLODto {
    name: string;
    description: string;
    serviceName: string;
    targetPercentage: number;
    timeWindow?: string;
    query?: string;
    alertThresholds?: Record<string, number>;
}
export declare class UpdateSLODto {
    name?: string;
    description?: string;
    targetPercentage?: number;
    timeWindow?: string;
    query?: string;
    alertThresholds?: Record<string, number>;
    enabled?: boolean;
}
export declare class CreateFeatureFlagDto {
    key: string;
    name: string;
    description?: string;
    defaultValue?: boolean;
    targetingRules?: Record<string, any>;
    prerequisites?: string[];
}
export declare class UpdateFeatureFlagDto {
    name?: string;
    description?: string;
    defaultValue?: boolean;
    targetingRules?: Record<string, any>;
    prerequisites?: string[];
    enabled?: boolean;
}
export declare class MigrationRequestDto {
    migrationName: string;
    targetVersion?: string;
    options?: Record<string, any>;
    dryRun?: boolean;
    force?: boolean;
}
export declare class LogQueryDto {
    level?: string;
    service?: string;
    startTime?: string;
    endTime?: string;
    query?: string;
    limit?: number;
}
export declare class TraceQueryDto {
    service?: string;
    operation?: string;
    traceId?: string;
    startTime?: string;
    endTime?: string;
    minDuration?: number;
}
