import { Response } from 'express';
import { LabReportsService } from '../services/lab-reports.service';
import { LabReportDto, GeneratePatientReportDto, GenerateCumulativeReportDto, GenerateWorkloadReportDto, GenerateQCReportDto, ExportReportDto, WorkloadReportDto, QCReportDto } from '../dto/lab-reports.dto';
export declare class LabReportsController {
    private readonly labReportsService;
    constructor(labReportsService: LabReportsService);
    generatePatientReport(dto: GeneratePatientReportDto): Promise<LabReportDto>;
    generateCumulativeReport(dto: GenerateCumulativeReportDto): Promise<LabReportDto>;
    generateWorkloadReport(dto: GenerateWorkloadReportDto): Promise<WorkloadReportDto>;
    generateQCReport(dto: GenerateQCReportDto): Promise<QCReportDto>;
    exportReport(format: 'PDF' | 'CSV' | 'EXCEL', dto: ExportReportDto, res: Response): Promise<void>;
    getPatientReport(orderId: string): Promise<LabReportDto>;
    getCumulativeReport(patientId: string, startDate: string, endDate: string): Promise<LabReportDto>;
    getWorkloadReport(tenantId: string, startDate: string, endDate: string): Promise<WorkloadReportDto>;
    getQCReport(analyzerId: string, startDate: string, endDate: string): Promise<QCReportDto>;
    getReportTypes(): Promise<{
        types: string[];
    }>;
    private getContentType;
}
