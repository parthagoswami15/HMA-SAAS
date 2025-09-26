export declare enum ReportStatus {
    PRELIMINARY = "PRELIMINARY",
    FINAL = "FINAL",
    CORRECTED = "CORRECTED"
}
export declare enum ReportType {
    PATIENT = "PATIENT",
    PHYSICIAN = "PHYSICIAN",
    BOTH = "BOTH"
}
export declare enum ExportFormat {
    PDF = "PDF",
    CSV = "CSV",
    EXCEL = "EXCEL"
}
export declare class LabResultDataDto {
    testId: string;
    testName: string;
    analyte: string;
    value: number | string;
    unit: string;
    flag: string;
    referenceRange: string;
    resultDateTime: Date;
    validationStatus: string;
    performedBy?: string;
}
export declare class ReportSummaryDto {
    totalTests: number;
    abnormalTests: number;
    criticalTests: number;
    pendingTests: number;
    tatHours: number;
}
export declare class LabReportDto {
    id: string;
    orderId: string;
    patientId: string;
    patientName: string;
    patientDOB: Date;
    physicianName?: string;
    orderDate: Date;
    collectionDate?: Date;
    results: LabResultDataDto[];
    summary: ReportSummaryDto;
    status: ReportStatus;
    reportType: ReportType;
    tenantId: string;
    generatedAt: Date;
}
export declare class GeneratePatientReportDto {
    orderId: string;
}
export declare class GenerateCumulativeReportDto {
    patientId: string;
    startDate: Date;
    endDate: Date;
}
export declare class GenerateWorkloadReportDto {
    tenantId: string;
    startDate: Date;
    endDate: Date;
}
export declare class GenerateQCReportDto {
    analyzerId: string;
    startDate: Date;
    endDate: Date;
}
export declare class ExportReportDto {
    reportId: string;
    format: ExportFormat;
}
export declare class WorkloadReportDto {
    summary: {
        totalOrders: number;
        completedOrders: number;
        statOrders: number;
        totalTests: number;
        totalSamples: number;
        averageTAT: number;
    };
    priorityBreakdown: {
        STAT: number;
        URGENT: number;
        ROUTINE: number;
    };
    dailyStats: any[];
    period: {
        startDate: Date;
        endDate: Date;
    };
}
export declare class QCReportDto {
    analyzer: any;
    summary: {
        totalRuns: number;
        passedRuns: number;
        failedRuns: number;
        passRate: number;
    };
    analyteStats: any[];
    period: {
        startDate: Date;
        endDate: Date;
    };
}
