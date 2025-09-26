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
exports.DashboardLayoutDto = exports.DashboardWidgetDto = exports.ReportExecutionDto = exports.ReportPreviewDto = exports.ReportTemplateDto = exports.ReportMetric = exports.ReportDimension = exports.ReportQuery = exports.ReportSort = exports.ReportFilter = exports.ReportBuilderDto = exports.ExportStatusDto = exports.ExportRequestDto = exports.ReferralAnalysisDto = exports.NPSDto = exports.PatientRetentionDto = exports.PatientAcquisitionDto = exports.PatientReportDto = exports.PharmacyExpiryDto = exports.BedTurnoverDto = exports.LOSDto = exports.OccupancyDto = exports.OperationalReportDto = exports.TATDto = exports.ReadmissionDto = exports.InfectionRateDto = exports.CaseMixDto = exports.ClinicalReportDto = exports.AgingAnalysisDto = exports.GSTReportDto = exports.RevenueAnalysisDto = exports.DailyCollectionsDto = exports.FinancialReportDto = exports.UpdateDashboardDto = exports.CreateDashboardDto = exports.ReportScheduleDto = exports.UpdateReportDto = exports.CreateReportDto = exports.BaseReportDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class BaseReportDto {
    tenantId;
    startDate;
    endDate;
    dimensions;
    filters;
    groupBy;
    orderBy;
    sortOrder;
    limit = 1000;
    offset = 0;
}
exports.BaseReportDto = BaseReportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseReportDto.prototype, "tenantId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseReportDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseReportDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BaseReportDto.prototype, "dimensions", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BaseReportDto.prototype, "filters", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseReportDto.prototype, "groupBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseReportDto.prototype, "orderBy", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['ASC', 'DESC']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseReportDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BaseReportDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BaseReportDto.prototype, "offset", void 0);
class CreateReportDto {
    name;
    description;
    category;
    type;
    configuration;
    parameters;
    accessLevel;
    tags;
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['FINANCIAL', 'CLINICAL', 'OPERATIONAL', 'PATIENT', 'CUSTOM']),
    __metadata("design:type", String)
], CreateReportDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['TABULAR', 'CHART', 'DASHBOARD', 'KPI', 'TREND']),
    __metadata("design:type", String)
], CreateReportDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateReportDto.prototype, "configuration", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateReportDto.prototype, "parameters", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PRIVATE', 'DEPARTMENT', 'TENANT', 'PUBLIC']),
    __metadata("design:type", String)
], CreateReportDto.prototype, "accessLevel", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateReportDto.prototype, "tags", void 0);
class UpdateReportDto {
    name;
    description;
    configuration;
    parameters;
    isActive;
    accessLevel;
    tags;
}
exports.UpdateReportDto = UpdateReportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateReportDto.prototype, "configuration", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateReportDto.prototype, "parameters", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateReportDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PRIVATE', 'DEPARTMENT', 'TENANT', 'PUBLIC']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "accessLevel", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateReportDto.prototype, "tags", void 0);
class ReportScheduleDto {
    frequency;
    dayOfWeek;
    dayOfMonth;
    scheduledTime;
    format;
    recipients;
    filters;
}
exports.ReportScheduleDto = ReportScheduleDto;
__decorate([
    (0, class_validator_1.IsEnum)(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'MANUAL']),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "frequency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ReportScheduleDto.prototype, "dayOfMonth", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "scheduledTime", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PDF', 'CSV', 'XLSX', 'EMAIL']),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ReportScheduleDto.prototype, "recipients", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ReportScheduleDto.prototype, "filters", void 0);
class CreateDashboardDto {
    name;
    description;
    layout;
    accessLevel;
    tags;
}
exports.CreateDashboardDto = CreateDashboardDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDashboardDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDashboardDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateDashboardDto.prototype, "layout", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PRIVATE', 'DEPARTMENT', 'TENANT', 'PUBLIC']),
    __metadata("design:type", String)
], CreateDashboardDto.prototype, "accessLevel", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateDashboardDto.prototype, "tags", void 0);
class UpdateDashboardDto {
    name;
    description;
    layout;
    isDefault;
    accessLevel;
    tags;
}
exports.UpdateDashboardDto = UpdateDashboardDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDashboardDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDashboardDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDashboardDto.prototype, "layout", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDashboardDto.prototype, "isDefault", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PRIVATE', 'DEPARTMENT', 'TENANT', 'PUBLIC']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDashboardDto.prototype, "accessLevel", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDashboardDto.prototype, "tags", void 0);
class FinancialReportDto extends BaseReportDto {
    reportType;
    paymentMethod;
    departments;
    serviceCategories;
    includeRefunds;
    agingDays;
}
exports.FinancialReportDto = FinancialReportDto;
__decorate([
    (0, class_validator_1.IsEnum)(['DAILY_COLLECTIONS', 'REVENUE_BY_DEPARTMENT', 'GST_OUTPUT', 'AGING_ANALYSIS', 'PROFIT_LOSS']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FinancialReportDto.prototype, "reportType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CASH', 'INSURANCE', 'CORPORATE', 'GOVERNMENT', 'OTHER']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FinancialReportDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FinancialReportDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FinancialReportDto.prototype, "serviceCategories", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FinancialReportDto.prototype, "includeRefunds", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(365),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FinancialReportDto.prototype, "agingDays", void 0);
class DailyCollectionsDto {
    date;
    department;
    serviceCategory;
    paymentMethod;
}
exports.DailyCollectionsDto = DailyCollectionsDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DailyCollectionsDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DailyCollectionsDto.prototype, "department", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DailyCollectionsDto.prototype, "serviceCategory", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CASH', 'INSURANCE', 'CORPORATE', 'GOVERNMENT', 'OTHER']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DailyCollectionsDto.prototype, "paymentMethod", void 0);
class RevenueAnalysisDto {
    startDate;
    endDate;
    departments;
    providers;
    serviceTypes;
    includeBreakdown;
}
exports.RevenueAnalysisDto = RevenueAnalysisDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RevenueAnalysisDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RevenueAnalysisDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RevenueAnalysisDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RevenueAnalysisDto.prototype, "providers", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RevenueAnalysisDto.prototype, "serviceTypes", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], RevenueAnalysisDto.prototype, "includeBreakdown", void 0);
class GSTReportDto {
    startDate;
    endDate;
    gstRate;
    includeExempted;
    includeZeroRated;
}
exports.GSTReportDto = GSTReportDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GSTReportDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GSTReportDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['0', '5', '12', '18', '28']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GSTReportDto.prototype, "gstRate", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GSTReportDto.prototype, "includeExempted", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GSTReportDto.prototype, "includeZeroRated", void 0);
class AgingAnalysisDto {
    asOfDate;
    agingDays;
    departments;
    status;
}
exports.AgingAnalysisDto = AgingAnalysisDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AgingAnalysisDto.prototype, "asOfDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], AgingAnalysisDto.prototype, "agingDays", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], AgingAnalysisDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['OUTSTANDING', 'OVERDUE', 'PARTIAL']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AgingAnalysisDto.prototype, "status", void 0);
class ClinicalReportDto extends BaseReportDto {
    reportType;
    departments;
    providers;
    diagnosisCodes;
    procedureCodes;
    visitType;
    severityLevel;
}
exports.ClinicalReportDto = ClinicalReportDto;
__decorate([
    (0, class_validator_1.IsEnum)(['CASE_MIX', 'INFECTION_RATES', 'READMISSIONS', 'TURNAROUND_TIME', 'OUTCOME_ANALYSIS']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ClinicalReportDto.prototype, "reportType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ClinicalReportDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ClinicalReportDto.prototype, "providers", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ClinicalReportDto.prototype, "diagnosisCodes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ClinicalReportDto.prototype, "procedureCodes", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['OPD', 'IPD', 'EMERGENCY', 'SURGERY']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ClinicalReportDto.prototype, "visitType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ClinicalReportDto.prototype, "severityLevel", void 0);
class CaseMixDto {
    startDate;
    endDate;
    classification;
    includeSeverity;
    includeComorbidities;
}
exports.CaseMixDto = CaseMixDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CaseMixDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CaseMixDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['DIAGNOSIS', 'PROCEDURE', 'DRG']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CaseMixDto.prototype, "classification", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CaseMixDto.prototype, "includeSeverity", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CaseMixDto.prototype, "includeComorbidities", void 0);
class InfectionRateDto {
    startDate;
    endDate;
    infectionTypes;
    departments;
    includeHAI;
    includeCAI;
}
exports.InfectionRateDto = InfectionRateDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InfectionRateDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InfectionRateDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], InfectionRateDto.prototype, "infectionTypes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], InfectionRateDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], InfectionRateDto.prototype, "includeHAI", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], InfectionRateDto.prototype, "includeCAI", void 0);
class ReadmissionDto {
    startDate;
    endDate;
    readmissionWindow;
    departments;
    diagnosisCodes;
    includePlanned;
    includeUnplanned;
}
exports.ReadmissionDto = ReadmissionDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReadmissionDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReadmissionDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], ReadmissionDto.prototype, "readmissionWindow", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ReadmissionDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ReadmissionDto.prototype, "diagnosisCodes", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReadmissionDto.prototype, "includePlanned", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReadmissionDto.prototype, "includeUnplanned", void 0);
class TATDto {
    startDate;
    endDate;
    serviceType;
    includeBenchmarks;
    targetTAT;
}
exports.TATDto = TATDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TATDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TATDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['LAB', 'RADIOLOGY', 'PHARMACY', 'SURGERY', 'DISCHARGE']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TATDto.prototype, "serviceType", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], TATDto.prototype, "includeBenchmarks", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TATDto.prototype, "targetTAT", void 0);
class OperationalReportDto extends BaseReportDto {
    reportType;
    departments;
    bedTypes;
    roomTypes;
    equipment;
    threshold;
}
exports.OperationalReportDto = OperationalReportDto;
__decorate([
    (0, class_validator_1.IsEnum)(['OCCUPANCY', 'LOS', 'BED_TURNS', 'PHARMACY_EXPIRY', 'RESOURCE_UTILIZATION']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OperationalReportDto.prototype, "reportType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], OperationalReportDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], OperationalReportDto.prototype, "bedTypes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], OperationalReportDto.prototype, "roomTypes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], OperationalReportDto.prototype, "equipment", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], OperationalReportDto.prototype, "threshold", void 0);
class OccupancyDto {
    startDate;
    endDate;
    departments;
    bedTypes;
    granularity;
    includeForecasting;
}
exports.OccupancyDto = OccupancyDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OccupancyDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OccupancyDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], OccupancyDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], OccupancyDto.prototype, "bedTypes", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OccupancyDto.prototype, "granularity", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], OccupancyDto.prototype, "includeForecasting", void 0);
class LOSDto {
    startDate;
    endDate;
    departments;
    diagnosisCodes;
    admissionTypes;
    includeALOS;
    includeVariances;
}
exports.LOSDto = LOSDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], LOSDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], LOSDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], LOSDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], LOSDto.prototype, "diagnosisCodes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], LOSDto.prototype, "admissionTypes", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], LOSDto.prototype, "includeALOS", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], LOSDto.prototype, "includeVariances", void 0);
class BedTurnoverDto {
    startDate;
    endDate;
    departments;
    bedTypes;
    includeTurnoverRate;
    includeUtilizationRate;
}
exports.BedTurnoverDto = BedTurnoverDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BedTurnoverDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BedTurnoverDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BedTurnoverDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BedTurnoverDto.prototype, "bedTypes", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BedTurnoverDto.prototype, "includeTurnoverRate", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BedTurnoverDto.prototype, "includeUtilizationRate", void 0);
class PharmacyExpiryDto {
    expiryBefore;
    drugCategories;
    manufacturers;
    alertDays;
    includeExpired;
    includeValue;
}
exports.PharmacyExpiryDto = PharmacyExpiryDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PharmacyExpiryDto.prototype, "expiryBefore", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PharmacyExpiryDto.prototype, "drugCategories", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PharmacyExpiryDto.prototype, "manufacturers", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PharmacyExpiryDto.prototype, "alertDays", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PharmacyExpiryDto.prototype, "includeExpired", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PharmacyExpiryDto.prototype, "includeValue", void 0);
class PatientReportDto extends BaseReportDto {
    reportType;
    ageGroups;
    genders;
    locations;
    referralSources;
    npsScore;
}
exports.PatientReportDto = PatientReportDto;
__decorate([
    (0, class_validator_1.IsEnum)(['ACQUISITION', 'RETENTION', 'NPS', 'REFERRAL_SOURCES', 'DEMOGRAPHICS']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientReportDto.prototype, "reportType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PatientReportDto.prototype, "ageGroups", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PatientReportDto.prototype, "genders", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PatientReportDto.prototype, "locations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PatientReportDto.prototype, "referralSources", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PatientReportDto.prototype, "npsScore", void 0);
class PatientAcquisitionDto {
    startDate;
    endDate;
    acquisitionType;
    channels;
    includeConversionRates;
    includeDemographics;
}
exports.PatientAcquisitionDto = PatientAcquisitionDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PatientAcquisitionDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PatientAcquisitionDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['NEW', 'RETURNING', 'REFERRAL']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientAcquisitionDto.prototype, "acquisitionType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PatientAcquisitionDto.prototype, "channels", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PatientAcquisitionDto.prototype, "includeConversionRates", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PatientAcquisitionDto.prototype, "includeDemographics", void 0);
class PatientRetentionDto {
    startDate;
    endDate;
    retentionPeriod;
    segments;
    includeCohortAnalysis;
    includeChurnRate;
}
exports.PatientRetentionDto = PatientRetentionDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PatientRetentionDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PatientRetentionDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], PatientRetentionDto.prototype, "retentionPeriod", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PatientRetentionDto.prototype, "segments", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PatientRetentionDto.prototype, "includeCohortAnalysis", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PatientRetentionDto.prototype, "includeChurnRate", void 0);
class NPSDto {
    startDate;
    endDate;
    minScore;
    maxScore;
    departments;
    providers;
    includeComments;
    includeTrends;
}
exports.NPSDto = NPSDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], NPSDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], NPSDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], NPSDto.prototype, "minScore", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], NPSDto.prototype, "maxScore", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], NPSDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], NPSDto.prototype, "providers", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], NPSDto.prototype, "includeComments", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], NPSDto.prototype, "includeTrends", void 0);
class ReferralAnalysisDto {
    startDate;
    endDate;
    sourceTypes;
    referringEntities;
    includeConversionRates;
    includeRevenueImpact;
}
exports.ReferralAnalysisDto = ReferralAnalysisDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReferralAnalysisDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReferralAnalysisDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ReferralAnalysisDto.prototype, "sourceTypes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ReferralAnalysisDto.prototype, "referringEntities", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReferralAnalysisDto.prototype, "includeConversionRates", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReferralAnalysisDto.prototype, "includeRevenueImpact", void 0);
class ExportRequestDto {
    reportId;
    format;
    filters;
    columns;
    fileName;
    includeHeaders;
    compress;
}
exports.ExportRequestDto = ExportRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportRequestDto.prototype, "reportId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CSV', 'XLSX', 'PDF', 'JSON']),
    __metadata("design:type", String)
], ExportRequestDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ExportRequestDto.prototype, "filters", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ExportRequestDto.prototype, "columns", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ExportRequestDto.prototype, "fileName", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ExportRequestDto.prototype, "includeHeaders", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ExportRequestDto.prototype, "compress", void 0);
class ExportStatusDto {
    exportId;
    status;
    progress;
    downloadUrl;
    errorMessage;
    expiresAt;
}
exports.ExportStatusDto = ExportStatusDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportStatusDto.prototype, "exportId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
    __metadata("design:type", String)
], ExportStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ExportStatusDto.prototype, "progress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ExportStatusDto.prototype, "downloadUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ExportStatusDto.prototype, "errorMessage", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ExportStatusDto.prototype, "expiresAt", void 0);
class ReportBuilderDto {
    factTable;
    dimensions;
    metrics;
    filters;
    groupBy;
    sortBy;
    limit;
    options;
}
exports.ReportBuilderDto = ReportBuilderDto;
__decorate([
    (0, class_validator_1.IsEnum)(['FactBilling', 'FactVisits', 'FactLabs']),
    __metadata("design:type", String)
], ReportBuilderDto.prototype, "factTable", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReportBuilderDto.prototype, "dimensions", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReportBuilderDto.prototype, "metrics", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => ReportFilter),
    __metadata("design:type", Array)
], ReportBuilderDto.prototype, "filters", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ReportBuilderDto.prototype, "groupBy", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => ReportSort),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ReportBuilderDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ReportBuilderDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ReportBuilderDto.prototype, "options", void 0);
class ReportFilter {
    field;
    operator;
    value;
    condition;
}
exports.ReportFilter = ReportFilter;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportFilter.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'between', 'isnull', 'notnull']),
    __metadata("design:type", String)
], ReportFilter.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ReportFilter.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportFilter.prototype, "condition", void 0);
class ReportSort {
    field;
    direction;
}
exports.ReportSort = ReportSort;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportSort.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['ASC', 'DESC']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportSort.prototype, "direction", void 0);
class ReportQuery {
    query;
    parameters;
    format;
}
exports.ReportQuery = ReportQuery;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportQuery.prototype, "query", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ReportQuery.prototype, "parameters", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['SQL', 'JSON']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQuery.prototype, "format", void 0);
class ReportDimension {
    name;
    displayName;
    dataType;
    description;
    filterable;
    sortable;
}
exports.ReportDimension = ReportDimension;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportDimension.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportDimension.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['STRING', 'NUMBER', 'DATE', 'BOOLEAN']),
    __metadata("design:type", String)
], ReportDimension.prototype, "dataType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportDimension.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReportDimension.prototype, "filterable", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReportDimension.prototype, "sortable", void 0);
class ReportMetric {
    name;
    displayName;
    aggregation;
    description;
    filterable;
}
exports.ReportMetric = ReportMetric;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportMetric.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportMetric.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', 'COUNT_DISTINCT']),
    __metadata("design:type", String)
], ReportMetric.prototype, "aggregation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportMetric.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReportMetric.prototype, "filterable", void 0);
class ReportTemplateDto {
    id;
    name;
    description;
    category;
    template;
}
exports.ReportTemplateDto = ReportTemplateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportTemplateDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportTemplateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportTemplateDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['FINANCIAL', 'CLINICAL', 'OPERATIONAL', 'PATIENT', 'CUSTOM']),
    __metadata("design:type", String)
], ReportTemplateDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ReportTemplateDto.prototype, "template", void 0);
class ReportPreviewDto {
    reportId;
    limit = 10;
    filters;
}
exports.ReportPreviewDto = ReportPreviewDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportPreviewDto.prototype, "reportId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ReportPreviewDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ReportPreviewDto.prototype, "filters", void 0);
class ReportExecutionDto {
    reportId;
    parameters;
    format;
    async;
}
exports.ReportExecutionDto = ReportExecutionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportExecutionDto.prototype, "reportId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ReportExecutionDto.prototype, "parameters", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['JSON', 'CSV', 'XLSX', 'PDF']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportExecutionDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReportExecutionDto.prototype, "async", void 0);
class DashboardWidgetDto {
    id;
    type;
    reportId;
    position;
    config;
}
exports.DashboardWidgetDto = DashboardWidgetDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DashboardWidgetDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CHART', 'KPI', 'TABLE', 'TEXT']),
    __metadata("design:type", String)
], DashboardWidgetDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DashboardWidgetDto.prototype, "reportId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], DashboardWidgetDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DashboardWidgetDto.prototype, "config", void 0);
class DashboardLayoutDto {
    widgets;
    columns;
    rowHeight;
    margin;
    containerPadding;
}
exports.DashboardLayoutDto = DashboardLayoutDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => DashboardWidgetDto),
    __metadata("design:type", Array)
], DashboardLayoutDto.prototype, "widgets", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DashboardLayoutDto.prototype, "columns", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DashboardLayoutDto.prototype, "rowHeight", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DashboardLayoutDto.prototype, "margin", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DashboardLayoutDto.prototype, "containerPadding", void 0);
//# sourceMappingURL=reports.dto.js.map