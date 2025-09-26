import { Repository } from 'typeorm';
import { SavedReport } from '../entities/reports.entity';
import { ExportRequestDto } from '../dto/reports.dto';
export declare class ExportService {
    private readonly savedReportRepo;
    private readonly logger;
    constructor(savedReportRepo: Repository<SavedReport>);
    exportReport(tenantId: string, userId: string, exportRequest: ExportRequestDto): Promise<any>;
    downloadExport(tenantId: string, exportId: string): Promise<{
        buffer: Buffer;
        fileName: string;
        mimeType: string;
    }>;
    getExportStatus(tenantId: string, exportId: string): Promise<any>;
    private getReportData;
    private generateCSV;
    private generateExcel;
    private generatePDF;
    private generateJSON;
    generateScheduledReport(tenantId: string, reportId: string, scheduleId: string, format: string): Promise<{
        buffer: Buffer;
        fileName: string;
        mimeType: string;
    }>;
    cleanupExpiredExports(): Promise<void>;
}
