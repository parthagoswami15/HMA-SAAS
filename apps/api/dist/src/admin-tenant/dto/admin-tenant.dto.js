"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceGenerationDto = exports.MeteringDataDto = exports.EnvironmentConfigDto = exports.BackupScheduleDto = exports.DataExportDto = exports.UserSeatsDto = exports.StorageQuotaDto = exports.TenantListDto = exports.TenantFilterDto = exports.SubscriptionPlanDto = exports.ModuleToggleDto = exports.TenantProvisioningDto = exports.UpdateTenantDto = exports.CreateTenantDto = exports.EnvironmentType = exports.SubscriptionPlan = exports.BillingMode = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var BillingMode;
(function (BillingMode) {
    BillingMode["CENTRALIZED"] = "CENTRALIZED";
    BillingMode["SEPARATE"] = "SEPARATE";
})(BillingMode || (exports.BillingMode = BillingMode = {}));
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["BASIC"] = "BASIC";
    SubscriptionPlan["PROFESSIONAL"] = "PROFESSIONAL";
    SubscriptionPlan["ENTERPRISE"] = "ENTERPRISE";
    SubscriptionPlan["CUSTOM"] = "CUSTOM";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
var EnvironmentType;
(function (EnvironmentType) {
    EnvironmentType["SANDBOX"] = "SANDBOX";
    EnvironmentType["PRODUCTION"] = "PRODUCTION";
})(EnvironmentType || (exports.EnvironmentType = EnvironmentType = {}));
class CreateTenantDto {
    name;
    slug;
    description;
    domain;
    contactEmail;
    contactPhone;
    billingMode;
    subscriptionPlan;
    storageQuota;
    userSeats;
    enabledModules;
    themeConfig;
    taxProfile;
    tariffs;
}
exports.CreateTenantDto = CreateTenantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant slug (unique identifier)', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tenant description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Primary domain' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact phone' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: BillingMode, description: 'Billing mode', required: true }),
    (0, class_validator_1.IsEnum)(BillingMode),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "billingMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SubscriptionPlan, description: 'Subscription plan', required: true }),
    (0, class_validator_1.IsEnum)(SubscriptionPlan),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "subscriptionPlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Storage quota in GB' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTenantDto.prototype, "storageQuota", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User seats limit' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTenantDto.prototype, "userSeats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enabled modules' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTenantDto.prototype, "enabledModules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Theme configuration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTenantDto.prototype, "themeConfig", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tax profile' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTenantDto.prototype, "taxProfile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom tariffs' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], CreateTenantDto.prototype, "tariffs", void 0);
class UpdateTenantDto {
    name;
    description;
    domain;
    contactEmail;
    contactPhone;
    billingMode;
    subscriptionPlan;
    storageQuota;
    userSeats;
    enabledModules;
    themeConfig;
    taxProfile;
    tariffs;
    isActive;
}
exports.UpdateTenantDto = UpdateTenantDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: BillingMode }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BillingMode),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "billingMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: SubscriptionPlan }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SubscriptionPlan),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "subscriptionPlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTenantDto.prototype, "storageQuota", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTenantDto.prototype, "userSeats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateTenantDto.prototype, "enabledModules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateTenantDto.prototype, "themeConfig", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateTenantDto.prototype, "taxProfile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], UpdateTenantDto.prototype, "tariffs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantDto.prototype, "isActive", void 0);
class TenantProvisioningDto {
    template;
    configOverrides;
    skipSeeding;
    adminUser;
}
exports.TenantProvisioningDto = TenantProvisioningDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Template to use for provisioning', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenantProvisioningDto.prototype, "template", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom configuration overrides' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TenantProvisioningDto.prototype, "configOverrides", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skip data seeding' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TenantProvisioningDto.prototype, "skipSeeding", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Administrator user details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TenantProvisioningDto.prototype, "adminUser", void 0);
class ModuleToggleDto {
    moduleName;
    enabled;
    config;
}
exports.ModuleToggleDto = ModuleToggleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Module name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModuleToggleDto.prototype, "moduleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Enable or disable module', required: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ModuleToggleDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Module-specific configuration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ModuleToggleDto.prototype, "config", void 0);
class SubscriptionPlanDto {
    plan;
    customPrice;
    billingCycle;
    additionalFeatures;
}
exports.SubscriptionPlanDto = SubscriptionPlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SubscriptionPlan, description: 'Plan type', required: true }),
    (0, class_validator_1.IsEnum)(SubscriptionPlan),
    __metadata("design:type", String)
], SubscriptionPlanDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom pricing' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubscriptionPlanDto.prototype, "customPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Billing cycle (monthly/annually)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionPlanDto.prototype, "billingCycle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional features' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SubscriptionPlanDto.prototype, "additionalFeatures", void 0);
class TenantFilterDto {
    billingMode;
    subscriptionPlan;
    isActive;
    search;
}
exports.TenantFilterDto = TenantFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by billing mode' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BillingMode),
    __metadata("design:type", String)
], TenantFilterDto.prototype, "billingMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by subscription plan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SubscriptionPlan),
    __metadata("design:type", String)
], TenantFilterDto.prototype, "subscriptionPlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TenantFilterDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search by name or slug' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenantFilterDto.prototype, "search", void 0);
class TenantListDto {
    page;
    limit;
    sortBy;
    sortOrder;
}
exports.TenantListDto = TenantListDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TenantListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TenantListDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort by field' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenantListDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort order', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TenantListDto.prototype, "sortOrder", void 0);
class StorageQuotaDto {
    quotaGB;
    warningThreshold;
    criticalThreshold;
}
exports.StorageQuotaDto = StorageQuotaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Storage quota in GB', required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StorageQuotaDto.prototype, "quotaGB", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Warning threshold percentage' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StorageQuotaDto.prototype, "warningThreshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Critical threshold percentage' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StorageQuotaDto.prototype, "criticalThreshold", void 0);
class UserSeatsDto {
    seatsLimit;
    currentUsers;
}
exports.UserSeatsDto = UserSeatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User seats limit', required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserSeatsDto.prototype, "seatsLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Current active users' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserSeatsDto.prototype, "currentUsers", void 0);
class DataExportDto {
    exportType;
    dateFrom;
    dateTo;
    modules;
    format;
    includeAuditLogs;
}
exports.DataExportDto = DataExportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Export type', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DataExportDto.prototype, "exportType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date from' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DataExportDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DataExportDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include specific modules' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], DataExportDto.prototype, "modules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Export format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DataExportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include audit logs' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DataExportDto.prototype, "includeAuditLogs", void 0);
class BackupScheduleDto {
    frequency;
    retentionDays;
    windowStart;
    windowEnd;
    dataTypes;
}
exports.BackupScheduleDto = BackupScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Backup frequency', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BackupScheduleDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Retention period in days' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BackupScheduleDto.prototype, "retentionDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Backup window start time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BackupScheduleDto.prototype, "windowStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Backup window end time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BackupScheduleDto.prototype, "windowEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include specific data types' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BackupScheduleDto.prototype, "dataTypes", void 0);
class EnvironmentConfigDto {
    environmentType;
    config;
    featureFlags;
}
exports.EnvironmentConfigDto = EnvironmentConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EnvironmentType, description: 'Environment type', required: true }),
    (0, class_validator_1.IsEnum)(EnvironmentType),
    __metadata("design:type", String)
], EnvironmentConfigDto.prototype, "environmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Environment-specific configuration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], EnvironmentConfigDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Feature flags for this environment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], EnvironmentConfigDto.prototype, "featureFlags", void 0);
class MeteringDataDto {
    tenantId;
    periodStart;
    periodEnd;
    metrics;
    costs;
}
exports.MeteringDataDto = MeteringDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant ID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MeteringDataDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metering period start', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MeteringDataDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metering period end', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MeteringDataDto.prototype, "periodEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Usage metrics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MeteringDataDto.prototype, "metrics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cost breakdown' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MeteringDataDto.prototype, "costs", void 0);
class InvoiceGenerationDto {
    tenantId;
    billingPeriod;
    previewOnly;
    includeDetails;
}
exports.InvoiceGenerationDto = InvoiceGenerationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant ID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InvoiceGenerationDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing period', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InvoiceGenerationDto.prototype, "billingPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Generate preview only' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], InvoiceGenerationDto.prototype, "previewOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include detailed breakdown' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], InvoiceGenerationDto.prototype, "includeDetails", void 0);
//# sourceMappingURL=admin-tenant.dto.js.map