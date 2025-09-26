export declare enum BillingMode {
    CENTRALIZED = "CENTRALIZED",
    SEPARATE = "SEPARATE"
}
export declare enum SubscriptionPlan {
    BASIC = "BASIC",
    PROFESSIONAL = "PROFESSIONAL",
    ENTERPRISE = "ENTERPRISE",
    CUSTOM = "CUSTOM"
}
export declare enum EnvironmentType {
    SANDBOX = "SANDBOX",
    PRODUCTION = "PRODUCTION"
}
export declare class CreateTenantDto {
    name: string;
    slug: string;
    description?: string;
    domain?: string;
    contactEmail?: string;
    contactPhone?: string;
    billingMode: BillingMode;
    subscriptionPlan: SubscriptionPlan;
    storageQuota?: number;
    userSeats?: number;
    enabledModules?: string[];
    themeConfig?: Record<string, any>;
    taxProfile?: Record<string, any>;
    tariffs?: Record<string, any>[];
}
export declare class UpdateTenantDto {
    name?: string;
    description?: string;
    domain?: string;
    contactEmail?: string;
    contactPhone?: string;
    billingMode?: BillingMode;
    subscriptionPlan?: SubscriptionPlan;
    storageQuota?: number;
    userSeats?: number;
    enabledModules?: string[];
    themeConfig?: Record<string, any>;
    taxProfile?: Record<string, any>;
    tariffs?: Record<string, any>[];
    isActive?: boolean;
}
export declare class TenantProvisioningDto {
    template: string;
    configOverrides?: Record<string, any>;
    skipSeeding?: boolean;
    adminUser?: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    };
}
export declare class ModuleToggleDto {
    moduleName: string;
    enabled: boolean;
    config?: Record<string, any>;
}
export declare class SubscriptionPlanDto {
    plan: SubscriptionPlan;
    customPrice?: number;
    billingCycle?: string;
    additionalFeatures?: string[];
}
export declare class TenantFilterDto {
    billingMode?: BillingMode;
    subscriptionPlan?: SubscriptionPlan;
    isActive?: boolean;
    search?: string;
}
export declare class TenantListDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: boolean;
}
export declare class StorageQuotaDto {
    quotaGB: number;
    warningThreshold?: number;
    criticalThreshold?: number;
}
export declare class UserSeatsDto {
    seatsLimit: number;
    currentUsers?: number;
}
export declare class DataExportDto {
    exportType: string;
    dateFrom?: string;
    dateTo?: string;
    modules?: string[];
    format?: string;
    includeAuditLogs?: boolean;
}
export declare class BackupScheduleDto {
    frequency: string;
    retentionDays?: number;
    windowStart?: string;
    windowEnd?: string;
    dataTypes?: string[];
}
export declare class EnvironmentConfigDto {
    environmentType: EnvironmentType;
    config?: Record<string, any>;
    featureFlags?: Record<string, any>;
}
export declare class MeteringDataDto {
    tenantId: string;
    periodStart: string;
    periodEnd: string;
    metrics?: Record<string, any>;
    costs?: Record<string, any>;
}
export declare class InvoiceGenerationDto {
    tenantId: string;
    billingPeriod: string;
    previewOnly?: boolean;
    includeDetails?: boolean;
}
