export declare class ReportConfig {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
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
    isActive: boolean;
    isPublic: boolean;
    accessLevel: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';
    createdBy?: string;
    updatedBy?: string;
    tags?: string;
    usageCount: number;
    lastUsedAt?: Date;
    schedules: ReportSchedule[];
    savedReports: SavedReport[];
}
export declare class ReportSchedule {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
    report: ReportConfig;
    reportId: string;
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
    isActive: boolean;
    nextRunAt?: Date;
    lastRunAt?: Date;
    lastError?: string;
    createdBy?: string;
}
export declare class SavedReport {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
    report: ReportConfig;
    reportId: string;
    name: string;
    description?: string;
    configuration: Record<string, any>;
    data: Record<string, any>;
    status: 'GENERATED' | 'PROCESSING' | 'ERROR' | 'EXPIRED';
    expiresAt?: Date;
    generatedBy?: string;
    userId?: string;
    exportFormat?: 'PDF' | 'CSV' | 'XLSX';
    viewCount: number;
    lastViewedAt?: Date;
}
export declare class DashboardConfig {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
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
    isActive: boolean;
    isDefault: boolean;
    accessLevel: 'PRIVATE' | 'DEPARTMENT' | 'TENANT' | 'PUBLIC';
    createdBy?: string;
    tags?: string;
    usageCount: number;
    lastUsedAt?: Date;
    accessRecords: DashboardAccess[];
}
export declare class DashboardAccess {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
    dashboard: DashboardConfig;
    dashboardId: string;
    userId: string;
    permission: 'VIEW' | 'EDIT' | 'DELETE' | 'SHARE';
    department?: string;
    role?: string;
}
