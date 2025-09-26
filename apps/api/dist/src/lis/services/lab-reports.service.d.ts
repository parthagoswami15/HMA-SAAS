import { PrismaService } from '../../prisma/prisma.service';
export interface LabReport {
    id: string;
    orderId: string;
    patientId: string;
    patientName: string;
    patientDOB: Date;
    physicianName?: string;
    orderDate: Date;
    collectionDate?: Date;
    results: LabResultData[];
    summary: ReportSummary;
    status: 'PRELIMINARY' | 'FINAL' | 'CORRECTED';
    reportType: 'PATIENT' | 'PHYSICIAN' | 'BOTH';
    tenantId: string;
}
export interface LabResultData {
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
export interface ReportSummary {
    totalTests: number;
    abnormalTests: number;
    criticalTests: number;
    pendingTests: number;
    tatHours: number;
}
export declare class LabReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    generatePatientReport(orderId: string): Promise<LabReport>;
    generateCumulativeReport(patientId: string, startDate: Date, endDate: Date): Promise<LabReport>;
    generateWorkloadReport(tenantId: string, startDate: Date, endDate: Date): Promise<any>;
    generateQCReport(analyzerId: string, startDate: Date, endDate: Date): Promise<any>;
    exportReportToPDF(reportId: string, format?: 'PDF' | 'CSV' | 'EXCEL'): Promise<Buffer>;
    private formatReferenceRange;
    private isRangeApplicable;
    private calculateReportSummary;
    private determineReportStatus;
    private calculateDailyStats;
    private calculateQCStatsByAnalyte;
    private generatePDFReport;
    private generateCSVReport;
    private generateExcelReport;
}
