import { IsString, IsOptional, IsEnum, IsDateString, IsArray, IsObject, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Base DTOs
export class BaseReportDto {
  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dimensions?: string[];

  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;

  @IsString()
  @IsOptional()
  groupBy?: string;

  @IsString()
  @IsOptional()
  orderBy?: string;

  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';

  @IsNumber()
  @Min(1)
  @Max(10000)
  @IsOptional()
  limit?: number = 1000;

  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}

export class CreateReportDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(['FINANCIAL', 'CLINICAL', 'OPERATIONAL', 'PATIENT', 'CUSTOM'])
  category: 'FINANCIAL' | 'CLINICAL' | 'OPERATIONAL' | 'PATIENT' | 'CUSTOM';

  @IsEnum(['TABULAR', 'CHART', 'DASHBOARD', 'KPI', 'TREND'])
  type: 'TABULAR' | 'CHART' | 'DASHBOARD' | 'KPI' | 'TREND';

  @IsObject()
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

  @IsObject()
  @IsOptional()
  parameters?: Record<string, any>;

  @IsEnum(['PRIVATE', 'DEPARTMENT', 'TENANT', 'PUBLIC'])
  accessLevel: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateReportDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  configuration?: Record<string, any>;

  @IsObject()
  @IsOptional()
  parameters?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(['PRIVATE', 'DEPARTMENT', 'TENANT', 'PUBLIC'])
  @IsOptional()
  accessLevel?: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class ReportScheduleDto {
  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'MANUAL'])
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'MANUAL';

  @IsString()
  @IsOptional()
  dayOfWeek?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

  @IsNumber()
  @Min(1)
  @Max(31)
  @IsOptional()
  dayOfMonth?: number;

  @IsString()
  scheduledTime: string; // HH:mm format

  @IsEnum(['PDF', 'CSV', 'XLSX', 'EMAIL'])
  format: 'PDF' | 'CSV' | 'XLSX' | 'EMAIL';

  @IsObject()
  recipients: {
    emails: string[];
    roles?: string[];
    departments?: string[];
  };

  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;
}

export class CreateDashboardDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsObject()
  layout: {
    widgets: {
      id: string;
      type: 'CHART' | 'KPI' | 'TABLE' | 'TEXT';
      reportId: string;
      position: { x: number; y: number; w: number; h: number };
      config: Record<string, any>;
    }[];
    columns: number;
    rowHeight: number;
  };

  @IsEnum(['PRIVATE', 'DEPARTMENT', 'TENANT', 'PUBLIC'])
  accessLevel: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateDashboardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  layout?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsEnum(['PRIVATE', 'DEPARTMENT', 'TENANT', 'PUBLIC'])
  @IsOptional()
  accessLevel?: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

// Financial Reports DTOs
export class FinancialReportDto extends BaseReportDto {
  @IsEnum(['DAILY_COLLECTIONS', 'REVENUE_BY_DEPARTMENT', 'GST_OUTPUT', 'AGING_ANALYSIS', 'PROFIT_LOSS'])
  @IsOptional()
  reportType?: 'DAILY_COLLECTIONS' | 'REVENUE_BY_DEPARTMENT' | 'GST_OUTPUT' | 'AGING_ANALYSIS' | 'PROFIT_LOSS';

  @IsEnum(['CASH', 'INSURANCE', 'CORPORATE', 'GOVERNMENT', 'OTHER'])
  @IsOptional()
  paymentMethod?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceCategories?: string[];

  @IsBoolean()
  @IsOptional()
  includeRefunds?: boolean;

  @IsNumber()
  @Min(0)
  @Max(365)
  @IsOptional()
  agingDays?: number;
}

export class DailyCollectionsDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  serviceCategory?: string;

  @IsEnum(['CASH', 'INSURANCE', 'CORPORATE', 'GOVERNMENT', 'OTHER'])
  @IsOptional()
  paymentMethod?: string;
}

export class RevenueAnalysisDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  providers?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceTypes?: string[];

  @IsBoolean()
  @IsOptional()
  includeBreakdown?: boolean;
}

export class GSTReportDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(['0', '5', '12', '18', '28'])
  @IsOptional()
  gstRate?: string;

  @IsBoolean()
  @IsOptional()
  includeExempted?: boolean;

  @IsBoolean()
  @IsOptional()
  includeZeroRated?: boolean;
}

export class AgingAnalysisDto {
  @IsDateString()
  asOfDate: string;

  @IsNumber()
  @Min(0)
  @Max(365)
  agingDays: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsEnum(['OUTSTANDING', 'OVERDUE', 'PARTIAL'])
  @IsOptional()
  status?: string;
}

// Clinical Reports DTOs
export class ClinicalReportDto extends BaseReportDto {
  @IsEnum(['CASE_MIX', 'INFECTION_RATES', 'READMISSIONS', 'TURNAROUND_TIME', 'OUTCOME_ANALYSIS'])
  @IsOptional()
  reportType?: 'CASE_MIX' | 'INFECTION_RATES' | 'READMISSIONS' | 'TURNAROUND_TIME' | 'OUTCOME_ANALYSIS';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  providers?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  diagnosisCodes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  procedureCodes?: string[];

  @IsEnum(['OPD', 'IPD', 'EMERGENCY', 'SURGERY'])
  @IsOptional()
  visitType?: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  severityLevel?: number;
}

export class CaseMixDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(['DIAGNOSIS', 'PROCEDURE', 'DRG'])
  @IsOptional()
  classification?: string;

  @IsBoolean()
  @IsOptional()
  includeSeverity?: boolean;

  @IsBoolean()
  @IsOptional()
  includeComorbidities?: boolean;
}

export class InfectionRateDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  infectionTypes: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsBoolean()
  @IsOptional()
  includeHAI?: boolean; // Healthcare Associated Infections

  @IsBoolean()
  @IsOptional()
  includeCAI?: boolean; // Community Acquired Infections
}

export class ReadmissionDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Min(1)
  @Max(365)
  readmissionWindow: number; // days

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  diagnosisCodes?: string[];

  @IsBoolean()
  @IsOptional()
  includePlanned?: boolean;

  @IsBoolean()
  @IsOptional()
  includeUnplanned?: boolean;
}

export class TATDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(['LAB', 'RADIOLOGY', 'PHARMACY', 'SURGERY', 'DISCHARGE'])
  @IsOptional()
  serviceType?: string;

  @IsBoolean()
  @IsOptional()
  includeBenchmarks?: boolean;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  targetTAT?: number; // hours
}

// Operational Reports DTOs
export class OperationalReportDto extends BaseReportDto {
  @IsEnum(['OCCUPANCY', 'LOS', 'BED_TURNS', 'PHARMACY_EXPIRY', 'RESOURCE_UTILIZATION'])
  @IsOptional()
  reportType?: 'OCCUPANCY' | 'LOS' | 'BED_TURNS' | 'PHARMACY_EXPIRY' | 'RESOURCE_UTILIZATION';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bedTypes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roomTypes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  equipment?: string[];

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  threshold?: number;
}

export class OccupancyDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bedTypes?: string[];

  @IsEnum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'])
  @IsOptional()
  granularity?: string;

  @IsBoolean()
  @IsOptional()
  includeForecasting?: boolean;
}

export class LOSDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  diagnosisCodes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  admissionTypes?: string[];

  @IsBoolean()
  @IsOptional()
  includeALOS?: boolean; // Average Length of Stay

  @IsBoolean()
  @IsOptional()
  includeVariances?: boolean;
}

export class BedTurnoverDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bedTypes?: string[];

  @IsBoolean()
  @IsOptional()
  includeTurnoverRate?: boolean;

  @IsBoolean()
  @IsOptional()
  includeUtilizationRate?: boolean;
}

export class PharmacyExpiryDto {
  @IsDateString()
  @IsOptional()
  expiryBefore?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  drugCategories?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  manufacturers?: string[];

  @IsNumber()
  @Min(1)
  @Max(365)
  @IsOptional()
  alertDays?: number;

  @IsBoolean()
  @IsOptional()
  includeExpired?: boolean;

  @IsBoolean()
  @IsOptional()
  includeValue?: boolean;
}

// Patient Reports DTOs
export class PatientReportDto extends BaseReportDto {
  @IsEnum(['ACQUISITION', 'RETENTION', 'NPS', 'REFERRAL_SOURCES', 'DEMOGRAPHICS'])
  @IsOptional()
  reportType?: 'ACQUISITION' | 'RETENTION' | 'NPS' | 'REFERRAL_SOURCES' | 'DEMOGRAPHICS';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ageGroups?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genders?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  locations?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  referralSources?: string[];

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  npsScore?: number;
}

export class PatientAcquisitionDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(['NEW', 'RETURNING', 'REFERRAL'])
  @IsOptional()
  acquisitionType?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  channels?: string[];

  @IsBoolean()
  @IsOptional()
  includeConversionRates?: boolean;

  @IsBoolean()
  @IsOptional()
  includeDemographics?: boolean;
}

export class PatientRetentionDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Min(1)
  @Max(365)
  retentionPeriod: number; // days

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  segments?: string[];

  @IsBoolean()
  @IsOptional()
  includeCohortAnalysis?: boolean;

  @IsBoolean()
  @IsOptional()
  includeChurnRate?: boolean;
}

export class NPSDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  minScore?: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxScore?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  providers?: string[];

  @IsBoolean()
  @IsOptional()
  includeComments?: boolean;

  @IsBoolean()
  @IsOptional()
  includeTrends?: boolean;
}

export class ReferralAnalysisDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sourceTypes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  referringEntities?: string[];

  @IsBoolean()
  @IsOptional()
  includeConversionRates?: boolean;

  @IsBoolean()
  @IsOptional()
  includeRevenueImpact?: boolean;
}

// Export DTOs
export class ExportRequestDto {
  @IsString()
  reportId: string;

  @IsEnum(['CSV', 'XLSX', 'PDF', 'JSON'])
  format: 'CSV' | 'XLSX' | 'PDF' | 'JSON';

  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  columns?: string[];

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsBoolean()
  @IsOptional()
  includeHeaders?: boolean;

  @IsBoolean()
  @IsOptional()
  compress?: boolean;
}

export class ExportStatusDto {
  @IsString()
  exportId: string;

  @IsEnum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'])
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @IsString()
  @IsOptional()
  downloadUrl?: string;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

// Report Builder DTOs
export class ReportBuilderDto {
  @IsEnum(['FactBilling', 'FactVisits', 'FactLabs'])
  factTable: 'FactBilling' | 'FactVisits' | 'FactLabs';

  @IsArray()
  @IsString({ each: true })
  dimensions: string[];

  @IsArray()
  @IsString({ each: true })
  metrics: string[];

  @IsArray()
  @Type(() => ReportFilter)
  filters: ReportFilter[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  groupBy?: string[];

  @IsArray()
  @Type(() => ReportSort)
  @IsOptional()
  sortBy?: ReportSort[];

  @IsNumber()
  @Min(1)
  @Max(100000)
  @IsOptional()
  limit?: number;

  @IsObject()
  @IsOptional()
  options?: Record<string, any>;
}

export class ReportFilter {
  @IsString()
  field: string;

  @IsEnum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'between', 'isnull', 'notnull'])
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between' | 'isnull' | 'notnull';

  @IsOptional()
  value: any;

  @IsString()
  @IsOptional()
  condition?: 'AND' | 'OR';
}

export class ReportSort {
  @IsString()
  field: string;

  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  direction?: 'ASC' | 'DESC';
}

export class ReportQuery {
  @IsString()
  query: string;

  @IsObject()
  @IsOptional()
  parameters?: Record<string, any>;

  @IsEnum(['SQL', 'JSON'])
  @IsOptional()
  format?: 'SQL' | 'JSON';
}

export class ReportDimension {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsEnum(['STRING', 'NUMBER', 'DATE', 'BOOLEAN'])
  dataType: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN';

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  filterable?: boolean;

  @IsBoolean()
  @IsOptional()
  sortable?: boolean;
}

export class ReportMetric {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsEnum(['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', 'COUNT_DISTINCT'])
  aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX' | 'COUNT_DISTINCT';

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  filterable?: boolean;
}

export class ReportTemplateDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(['FINANCIAL', 'CLINICAL', 'OPERATIONAL', 'PATIENT', 'CUSTOM'])
  category: 'FINANCIAL' | 'CLINICAL' | 'OPERATIONAL' | 'PATIENT' | 'CUSTOM';

  @IsObject()
  template: {
    factTable: string;
    dimensions: string[];
    metrics: string[];
    filters: ReportFilter[];
    groupBy: string[];
    sortBy?: ReportSort[];
  };
}

export class ReportPreviewDto {
  @IsString()
  reportId: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;
}

export class ReportExecutionDto {
  @IsString()
  reportId: string;

  @IsObject()
  @IsOptional()
  parameters?: Record<string, any>;

  @IsEnum(['JSON', 'CSV', 'XLSX', 'PDF'])
  @IsOptional()
  format?: 'JSON' | 'CSV' | 'XLSX' | 'PDF';

  @IsBoolean()
  @IsOptional()
  async?: boolean;
}

export class DashboardWidgetDto {
  @IsString()
  id: string;

  @IsEnum(['CHART', 'KPI', 'TABLE', 'TEXT'])
  type: 'CHART' | 'KPI' | 'TABLE' | 'TEXT';

  @IsString()
  reportId: string;

  @IsObject()
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}

export class DashboardLayoutDto {
  @IsArray()
  @Type(() => DashboardWidgetDto)
  widgets: DashboardWidgetDto[];

  @IsNumber()
  @Min(1)
  columns: number;

  @IsNumber()
  @Min(1)
  rowHeight: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  margin?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  containerPadding?: number;
}
