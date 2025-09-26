import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsArray, IsObject, IsDateString } from 'class-validator';

export enum DeploymentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  ROLLED_BACK = 'ROLLED_BACK'
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum BackupStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL'
}

export enum MetricType {
  COUNTER = 'COUNTER',
  GAUGE = 'GAUGE',
  HISTOGRAM = 'HISTOGRAM',
  SUMMARY = 'SUMMARY'
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export class CreateDeploymentDto {
  @ApiProperty({ description: 'Deployment version', required: true })
  @IsString()
  version: string;

  @ApiProperty({ description: 'Environment to deploy to', required: true })
  @IsString()
  environment: string;

  @ApiPropertyOptional({ description: 'Deployment description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Features included in deployment' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ description: 'Configuration changes' })
  @IsOptional()
  @IsObject()
  configChanges?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Rollback plan' })
  @IsOptional()
  @IsString()
  rollbackPlan?: string;
}

export class DeploymentFilterDto {
  @ApiPropertyOptional({ description: 'Filter by environment' })
  @IsOptional()
  @IsString()
  environment?: string;

  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsOptional()
  @IsEnum(DeploymentStatus)
  status?: DeploymentStatus;

  @ApiPropertyOptional({ description: 'Filter by version' })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({ description: 'Date from' })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Date to' })
  @IsOptional()
  @IsString()
  dateTo?: string;
}

export class DeploymentListDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', default: false })
  @IsOptional()
  @IsBoolean()
  sortOrder?: boolean;
}

export class CreateIncidentDto {
  @ApiProperty({ description: 'Incident title', required: true })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Incident description', required: true })
  @IsString()
  description: string;

  @ApiProperty({ enum: IncidentSeverity, description: 'Incident severity', required: true })
  @IsEnum(IncidentSeverity)
  severity: IncidentSeverity;

  @ApiPropertyOptional({ description: 'Affected services' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedServices?: string[];

  @ApiPropertyOptional({ description: 'Environment affected' })
  @IsOptional()
  @IsString()
  environment?: string;

  @ApiPropertyOptional({ description: 'Error details' })
  @IsOptional()
  @IsObject()
  errorDetails?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Steps to reproduce' })
  @IsOptional()
  @IsString()
  stepsToReproduce?: string;

  @ApiPropertyOptional({ description: 'Workaround available' })
  @IsOptional()
  @IsString()
  workaround?: string;
}

export class UpdateIncidentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: IncidentSeverity })
  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;

  @ApiPropertyOptional({ enum: IncidentStatus })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedServices?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  errorDetails?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stepsToReproduce?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workaround?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rootCause?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preventionMeasures?: string;
}

export class IncidentFilterDto {
  @ApiPropertyOptional({ enum: IncidentSeverity })
  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;

  @ApiPropertyOptional({ enum: IncidentStatus })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  environment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  service?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateTo?: string;
}

export class CreateBackupDto {
  @ApiProperty({ description: 'Backup name', required: true })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Backup description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Backup type' })
  @IsOptional()
  @IsString()
  backupType?: string;

  @ApiPropertyOptional({ description: 'Include specific tenants' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tenantIds?: string[];

  @ApiPropertyOptional({ description: 'Include specific data types' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dataTypes?: string[];

  @ApiPropertyOptional({ description: 'Compression enabled' })
  @IsOptional()
  @IsBoolean()
  compression?: boolean;

  @ApiPropertyOptional({ description: 'Encryption enabled' })
  @IsOptional()
  @IsBoolean()
  encryption?: boolean;
}

export class BackupFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BackupStatus)
  status?: BackupStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backupType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateTo?: string;
}

export class RestoreRequestDto {
  @ApiProperty({ description: 'Backup ID to restore from', required: true })
  @IsString()
  backupId: string;

  @ApiPropertyOptional({ description: 'Target environment' })
  @IsOptional()
  @IsString()
  targetEnvironment?: string;

  @ApiPropertyOptional({ description: 'Point in time to restore to' })
  @IsOptional()
  @IsString()
  pointInTime?: string;

  @ApiPropertyOptional({ description: 'Specific tenants to restore' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tenantIds?: string[];

  @ApiPropertyOptional({ description: 'Test restore only' })
  @IsOptional()
  @IsBoolean()
  testRestore?: boolean;
}

export class CreateMetricDto {
  @ApiProperty({ description: 'Metric name', required: true })
  @IsString()
  name: string;

  @ApiProperty({ enum: MetricType, description: 'Metric type', required: true })
  @IsEnum(MetricType)
  type: MetricType;

  @ApiPropertyOptional({ description: 'Metric description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Metric labels' })
  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Metric value' })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional({ description: 'Timestamp' })
  @IsOptional()
  @IsString()
  timestamp?: string;
}

export class MetricQueryDto {
  @ApiProperty({ description: 'Metric name', required: true })
  @IsString()
  metricName: string;

  @ApiPropertyOptional({ description: 'Label filters' })
  @IsOptional()
  @IsObject()
  labelFilters?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Time range start' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'Time range end' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Step interval' })
  @IsOptional()
  @IsString()
  step?: string;
}

export class CreateAlertRuleDto {
  @ApiProperty({ description: 'Alert name', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Alert query', required: true })
  @IsString()
  query: string;

  @ApiProperty({ enum: AlertSeverity, description: 'Alert severity', required: true })
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @ApiPropertyOptional({ description: 'Alert description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Threshold value' })
  @IsOptional()
  @IsNumber()
  threshold?: number;

  @ApiPropertyOptional({ description: 'Threshold operator' })
  @IsOptional()
  @IsString()
  operator?: string;

  @ApiPropertyOptional({ description: 'Evaluation interval in seconds' })
  @IsOptional()
  @IsNumber()
  evaluationInterval?: number;

  @ApiPropertyOptional({ description: 'For duration' })
  @IsOptional()
  @IsString()
  forDuration?: string;

  @ApiPropertyOptional({ description: 'Notification channels' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notificationChannels?: string[];

  @ApiPropertyOptional({ description: 'Alert labels' })
  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;
}

export class UpdateAlertRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ enum: AlertSeverity })
  @IsOptional()
  @IsEnum(AlertSeverity)
  severity?: AlertSeverity;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  threshold?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  operator?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  evaluationInterval?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  forDuration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notificationChannels?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class CreateSLODto {
  @ApiProperty({ description: 'SLO name', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: 'SLO description', required: true })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Service name', required: true })
  @IsString()
  serviceName: string;

  @ApiProperty({ description: 'SLO target percentage (99.9)', required: true })
  @IsNumber()
  targetPercentage: number;

  @ApiPropertyOptional({ description: 'Time window (30d)' })
  @IsOptional()
  @IsString()
  timeWindow?: string;

  @ApiPropertyOptional({ description: 'SLO query' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Alert thresholds' })
  @IsOptional()
  @IsObject()
  alertThresholds?: Record<string, number>;
}

export class UpdateSLODto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  targetPercentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timeWindow?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  alertThresholds?: Record<string, number>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class CreateFeatureFlagDto {
  @ApiProperty({ description: 'Feature flag key', required: true })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Feature flag name', required: true })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Feature flag description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Default value' })
  @IsOptional()
  @IsBoolean()
  defaultValue?: boolean;

  @ApiPropertyOptional({ description: 'Targeting rules' })
  @IsOptional()
  @IsObject()
  targetingRules?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Prerequisites' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prerequisites?: string[];
}

export class UpdateFeatureFlagDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  defaultValue?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  targetingRules?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prerequisites?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class MigrationRequestDto {
  @ApiProperty({ description: 'Migration name', required: true })
  @IsString()
  migrationName: string;

  @ApiPropertyOptional({ description: 'Target version' })
  @IsOptional()
  @IsString()
  targetVersion?: string;

  @ApiPropertyOptional({ description: 'Migration options' })
  @IsOptional()
  @IsObject()
  options?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Dry run only' })
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;

  @ApiPropertyOptional({ description: 'Force migration' })
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}

export class LogQueryDto {
  @ApiPropertyOptional({ description: 'Log level' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ description: 'Service name' })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiPropertyOptional({ description: 'Start time' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Limit results' })
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class TraceQueryDto {
  @ApiPropertyOptional({ description: 'Service name' })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiPropertyOptional({ description: 'Operation name' })
  @IsOptional()
  @IsString()
  operation?: string;

  @ApiPropertyOptional({ description: 'Trace ID' })
  @IsOptional()
  @IsString()
  traceId?: string;

  @ApiPropertyOptional({ description: 'Start time' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Minimum duration' })
  @IsOptional()
  @IsNumber()
  minDuration?: number;
}
