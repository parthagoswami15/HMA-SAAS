export declare class BaseReportDto {
    tenantId?: string;
    startDate?: string;
    endDate?: string;
    dimensions?: string[];
    filters?: Record<string, any>;
    groupBy?: string;
    orderBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
}
export declare class CreateReportDto {
    name: string;
    description: string;
    category: 'FINANCIAL' | 'CLINICAL' | 'OPERATIONAL' | 'PATIENT' | 'CUSTOM';
    type: 'TABULAR' | 'CHART' | 'DASHBOARD' | 'KPI' | 'TREND';
    configuration: {
        dataSource: 'BILLING' | 'VISITS' | 'LABS' | 'PATIENTS' | 'STAFF' | 'INVENTORY';
        dimensions: string[];
        measures: string[];
        filters: Record<string, any>;
        groupBy: string[];
        orderBy: Record<string, 'ASC' | 'DESC'>;
        aggregations: Record<string, 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'>;
        chartType?: 'BAR' | 'LINE' | 'PIE' | 'AREA' | 'SCATTER' | 'GAUGE';
        chartConfig?: Record<string, any>;
    };
    parameters?: Record<string, any>;
    accessLevel: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';
    tags?: string[];
}
export declare class UpdateReportDto {
    name?: string;
    description?: string;
    configuration?: Record<string, any>;
    parameters?: Record<string, any>;
    isActive?: boolean;
    accessLevel?: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';
    tags?: string[];
}
export declare class ReportScheduleDto {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'MANUAL';
    dayOfWeek?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    dayOfMonth?: number;
    scheduledTime: string;
    format: 'PDF' | 'CSV' | 'XLSX' | 'EMAIL';
    recipients: {
        emails: string[];
        roles?: string[];
        departments?: string[];
    };
    filters?: Record<string, any>;
}
export declare class CreateDashboardDto {
    name: string;
    description: string;
    layout: {
        widgets: {
            id: string;
            type: 'CHART' | 'KPI' | 'TABLE' | 'TEXT';
            reportId: string;
            position: {
                x: number;
                y: number;
                w: number;
                h: number;
            };
            config: Record<string, any>;
        }[];
        columns: number;
        rowHeight: number;
    };
    accessLevel: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';
    tags?: string[];
}
export declare class UpdateDashboardDto {
    name?: string;
    description?: string;
    layout?: Record<string, any>;
    isDefault?: boolean;
    accessLevel?: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';
    tags?: string[];
}
export declare class FinancialReportDto extends BaseReportDto {
    reportType?: 'DAILY_COLLECTIONS' | 'REVENUE_BY_DEPARTMENT' | 'GST_OUTPUT' | 'AGING_ANALYSIS' | 'PROFIT_LOSS';
    paymentMethod?: string;
    departments?: string[];
    serviceCategories?: string[];
    includeRefunds?: boolean;
    agingDays?: number;
}
export declare class DailyCollectionsDto {
    date: string;
    department?: string;
    serviceCategory?: string;
    paymentMethod?: string;
}
export declare class RevenueAnalysisDto {
    startDate: string;
    endDate: string;
    departments?: string[];
    providers?: string[];
    serviceTypes?: string[];
    includeBreakdown?: boolean;
}
export declare class GSTReportDto {
    startDate: string;
    endDate: string;
    gstRate?: string;
    includeExempted?: boolean;
    includeZeroRated?: boolean;
}
export declare class AgingAnalysisDto {
    asOfDate: string;
    agingDays: number;
    departments?: string[];
    status?: string;
}
export declare class ClinicalReportDto extends BaseReportDto {
    reportType?: 'CASE_MIX' | 'INFECTION_RATES' | 'READMISSIONS' | 'TURNAROUND_TIME' | 'OUTCOME_ANALYSIS';
    departments?: string[];
    providers?: string[];
    diagnosisCodes?: string[];
    procedureCodes?: string[];
    visitType?: string;
    severityLevel?: number;
}
export declare class CaseMixDto {
    startDate: string;
    endDate: string;
    classification?: string;
    includeSeverity?: boolean;
    includeComorbidities?: boolean;
}
export declare class InfectionRateDto {
    startDate: string;
    endDate: string;
    infectionTypes: string[];
    departments?: string[];
    includeHAI?: boolean;
    includeCAI?: boolean;
}
export declare class ReadmissionDto {
    startDate: string;
    endDate: string;
    readmissionWindow: number;
    departments?: string[];
    diagnosisCodes?: string[];
    includePlanned?: boolean;
    includeUnplanned?: boolean;
}
export declare class TATDto {
    startDate: string;
    endDate: string;
    serviceType?: string;
    includeBenchmarks?: boolean;
    targetTAT?: number;
}
export declare class OperationalReportDto extends BaseReportDto {
    reportType?: 'OCCUPANCY' | 'LOS' | 'BED_TURNS' | 'PHARMACY_EXPIRY' | 'RESOURCE_UTILIZATION';
    departments?: string[];
    bedTypes?: string[];
    roomTypes?: string[];
    equipment?: string[];
    threshold?: number;
}
export declare class OccupancyDto {
    startDate: string;
    endDate: string;
    departments?: string[];
    bedTypes?: string[];
    granularity?: string;
    includeForecasting?: boolean;
}
export declare class LOSDto {
    startDate: string;
    endDate: string;
    departments?: string[];
    diagnosisCodes?: string[];
    admissionTypes?: string[];
    includeALOS?: boolean;
    includeVariances?: boolean;
}
export declare class BedTurnoverDto {
    startDate: string;
    endDate: string;
    departments?: string[];
    bedTypes?: string[];
    includeTurnoverRate?: boolean;
    includeUtilizationRate?: boolean;
}
export declare class PharmacyExpiryDto {
    expiryBefore?: string;
    drugCategories?: string[];
    manufacturers?: string[];
    alertDays?: number;
    includeExpired?: boolean;
    includeValue?: boolean;
}
export declare class PatientReportDto extends BaseReportDto {
    reportType?: 'ACQUISITION' | 'RETENTION' | 'NPS' | 'REFERRAL_SOURCES' | 'DEMOGRAPHICS';
    ageGroups?: string[];
    genders?: string[];
    locations?: string[];
    referralSources?: string[];
    npsScore?: number;
}
export declare class PatientAcquisitionDto {
    startDate: string;
    endDate: string;
    acquisitionType?: string;
    channels?: string[];
    includeConversionRates?: boolean;
    includeDemographics?: boolean;
}
export declare class PatientRetentionDto {
    startDate: string;
    endDate: string;
    retentionPeriod: number;
    segments?: string[];
    includeCohortAnalysis?: boolean;
    includeChurnRate?: boolean;
}
export declare class NPSDto {
    startDate: string;
    endDate: string;
    minScore?: number;
    maxScore?: number;
    departments?: string[];
    providers?: string[];
    includeComments?: boolean;
    includeTrends?: boolean;
}
export declare class ReferralAnalysisDto {
    startDate: string;
    endDate: string;
    sourceTypes?: string[];
    referringEntities?: string[];
    includeConversionRates?: boolean;
    includeRevenueImpact?: boolean;
}
export declare class ExportRequestDto {
    reportId: string;
    format: 'CSV' | 'XLSX' | 'PDF' | 'JSON';
    filters?: Record<string, any>;
    columns?: string[];
    fileName?: string;
    includeHeaders?: boolean;
    compress?: boolean;
}
export declare class ExportStatusDto {
    exportId: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    progress?: number;
    downloadUrl?: string;
    errorMessage?: string;
    expiresAt?: string;
}
export declare class ReportBuilderDto {
    factTable: 'FactBilling' | 'FactVisits' | 'FactLabs';
    dimensions: string[];
    metrics: string[];
    filters: ReportFilter[];
    groupBy?: string[];
    sortBy?: ReportSort[];
    limit?: number;
    options?: Record<string, any>;
}
export declare class ReportFilter {
    field: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between' | 'isnull' | 'notnull';
    value: any;
    condition?: 'AND' | 'OR';
}
export declare class ReportSort {
    field: string;
    direction?: 'ASC' | 'DESC';
}
export declare class ReportQuery {
    query: string;
    parameters?: Record<string, any>;
    format?: 'SQL' | 'JSON';
}
export declare class ReportDimension {
    name: string;
    displayName: string;
    dataType: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN';
    description?: string;
    filterable?: boolean;
    sortable?: boolean;
}
export declare class ReportMetric {
    name: string;
    displayName: string;
    aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX' | 'COUNT_DISTINCT';
    description?: string;
    filterable?: boolean;
}
export declare class ReportTemplateDto {
    id: string;
    name: string;
    description: string;
    category: 'FINANCIAL' | 'CLINICAL' | 'OPERATIONAL' | 'PATIENT' | 'CUSTOM';
    template: {
        factTable: string;
        dimensions: string[];
        metrics: string[];
        filters: ReportFilter[];
        groupBy: string[];
        sortBy?: ReportSort[];
    };
}
export declare class ReportPreviewDto {
    reportId: string;
    limit?: number;
    filters?: Record<string, any>;
}
export declare class ReportExecutionDto {
    reportId: string;
    parameters?: Record<string, any>;
    format?: 'JSON' | 'CSV' | 'XLSX' | 'PDF';
    async?: boolean;
}
export declare class DashboardWidgetDto {
    id: string;
    type: 'CHART' | 'KPI' | 'TABLE' | 'TEXT';
    reportId: string;
    position: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    config?: Record<string, any>;
}
export declare class DashboardLayoutDto {
    widgets: DashboardWidgetDto[];
    columns: number;
    rowHeight: number;
    margin?: number;
    containerPadding?: number;
}
