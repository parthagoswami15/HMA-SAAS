import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsArray, IsObject, IsEmail } from 'class-validator';

export enum BillingMode {
  CENTRALIZED = 'CENTRALIZED',
  SEPARATE = 'SEPARATE'
}

export enum SubscriptionPlan {
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM'
}

export enum EnvironmentType {
  SANDBOX = 'SANDBOX',
  PRODUCTION = 'PRODUCTION'
}

export class CreateTenantDto {
  @ApiProperty({ description: 'Tenant name', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Tenant slug (unique identifier)', required: true })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Tenant description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Primary domain' })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Contact phone' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ enum: BillingMode, description: 'Billing mode', required: true })
  @IsEnum(BillingMode)
  billingMode: BillingMode;

  @ApiProperty({ enum: SubscriptionPlan, description: 'Subscription plan', required: true })
  @IsEnum(SubscriptionPlan)
  subscriptionPlan: SubscriptionPlan;

  @ApiPropertyOptional({ description: 'Storage quota in GB' })
  @IsOptional()
  @IsNumber()
  storageQuota?: number;

  @ApiPropertyOptional({ description: 'User seats limit' })
  @IsOptional()
  @IsNumber()
  userSeats?: number;

  @ApiPropertyOptional({ description: 'Enabled modules' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enabledModules?: string[];

  @ApiPropertyOptional({ description: 'Theme configuration' })
  @IsOptional()
  @IsObject()
  themeConfig?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Tax profile' })
  @IsOptional()
  @IsObject()
  taxProfile?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Custom tariffs' })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  tariffs?: Record<string, any>[];
}

export class UpdateTenantDto {
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
  @IsString()
  domain?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ enum: BillingMode })
  @IsOptional()
  @IsEnum(BillingMode)
  billingMode?: BillingMode;

  @ApiPropertyOptional({ enum: SubscriptionPlan })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscriptionPlan?: SubscriptionPlan;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  storageQuota?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  userSeats?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enabledModules?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  themeConfig?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  taxProfile?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  tariffs?: Record<string, any>[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class TenantProvisioningDto {
  @ApiProperty({ description: 'Template to use for provisioning', required: true })
  @IsString()
  template: string;

  @ApiPropertyOptional({ description: 'Custom configuration overrides' })
  @IsOptional()
  @IsObject()
  configOverrides?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Skip data seeding' })
  @IsOptional()
  @IsBoolean()
  skipSeeding?: boolean;

  @ApiPropertyOptional({ description: 'Administrator user details' })
  @IsOptional()
  @IsObject()
  adminUser?: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

export class ModuleToggleDto {
  @ApiProperty({ description: 'Module name', required: true })
  @IsString()
  moduleName: string;

  @ApiProperty({ description: 'Enable or disable module', required: true })
  @IsBoolean()
  enabled: boolean;

  @ApiPropertyOptional({ description: 'Module-specific configuration' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class SubscriptionPlanDto {
  @ApiProperty({ enum: SubscriptionPlan, description: 'Plan type', required: true })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @ApiPropertyOptional({ description: 'Custom pricing' })
  @IsOptional()
  @IsNumber()
  customPrice?: number;

  @ApiPropertyOptional({ description: 'Billing cycle (monthly/annually)' })
  @IsOptional()
  @IsString()
  billingCycle?: string;

  @ApiPropertyOptional({ description: 'Additional features' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalFeatures?: string[];
}

export class TenantFilterDto {
  @ApiPropertyOptional({ description: 'Filter by billing mode' })
  @IsOptional()
  @IsEnum(BillingMode)
  billingMode?: BillingMode;

  @ApiPropertyOptional({ description: 'Filter by subscription plan' })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscriptionPlan?: SubscriptionPlan;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Search by name or slug' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class TenantListDto {
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

export class StorageQuotaDto {
  @ApiProperty({ description: 'Storage quota in GB', required: true })
  @IsNumber()
  quotaGB: number;

  @ApiPropertyOptional({ description: 'Warning threshold percentage' })
  @IsOptional()
  @IsNumber()
  warningThreshold?: number;

  @ApiPropertyOptional({ description: 'Critical threshold percentage' })
  @IsOptional()
  @IsNumber()
  criticalThreshold?: number;
}

export class UserSeatsDto {
  @ApiProperty({ description: 'User seats limit', required: true })
  @IsNumber()
  seatsLimit: number;

  @ApiPropertyOptional({ description: 'Current active users' })
  @IsOptional()
  @IsNumber()
  currentUsers?: number;
}

export class DataExportDto {
  @ApiProperty({ description: 'Export type', required: true })
  @IsString()
  exportType: string;

  @ApiPropertyOptional({ description: 'Date from' })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Date to' })
  @IsOptional()
  @IsString()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Include specific modules' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  modules?: string[];

  @ApiPropertyOptional({ description: 'Export format' })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({ description: 'Include audit logs' })
  @IsOptional()
  @IsBoolean()
  includeAuditLogs?: boolean;
}

export class BackupScheduleDto {
  @ApiProperty({ description: 'Backup frequency', required: true })
  @IsString()
  frequency: string;

  @ApiPropertyOptional({ description: 'Retention period in days' })
  @IsOptional()
  @IsNumber()
  retentionDays?: number;

  @ApiPropertyOptional({ description: 'Backup window start time' })
  @IsOptional()
  @IsString()
  windowStart?: string;

  @ApiPropertyOptional({ description: 'Backup window end time' })
  @IsOptional()
  @IsString()
  windowEnd?: string;

  @ApiPropertyOptional({ description: 'Include specific data types' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dataTypes?: string[];
}

export class EnvironmentConfigDto {
  @ApiProperty({ enum: EnvironmentType, description: 'Environment type', required: true })
  @IsEnum(EnvironmentType)
  environmentType: EnvironmentType;

  @ApiPropertyOptional({ description: 'Environment-specific configuration' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Feature flags for this environment' })
  @IsOptional()
  @IsObject()
  featureFlags?: Record<string, any>;
}

export class MeteringDataDto {
  @ApiProperty({ description: 'Tenant ID', required: true })
  @IsString()
  tenantId: string;

  @ApiProperty({ description: 'Metering period start', required: true })
  @IsString()
  periodStart: string;

  @ApiProperty({ description: 'Metering period end', required: true })
  @IsString()
  periodEnd: string;

  @ApiPropertyOptional({ description: 'Usage metrics' })
  @IsOptional()
  @IsObject()
  metrics?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Cost breakdown' })
  @IsOptional()
  @IsObject()
  costs?: Record<string, any>;
}

export class InvoiceGenerationDto {
  @ApiProperty({ description: 'Tenant ID', required: true })
  @IsString()
  tenantId: string;

  @ApiProperty({ description: 'Billing period', required: true })
  @IsString()
  billingPeriod: string;

  @ApiPropertyOptional({ description: 'Generate preview only' })
  @IsOptional()
  @IsBoolean()
  previewOnly?: boolean;

  @ApiPropertyOptional({ description: 'Include detailed breakdown' })
  @IsOptional()
  @IsBoolean()
  includeDetails?: boolean;
}
