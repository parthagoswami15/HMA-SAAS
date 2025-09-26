import { PrismaService } from '../prisma/prisma.service';
export interface ExportOptions {
    format: 'excel' | 'csv' | 'json';
    dateRange?: {
        startDate: Date;
        endDate: Date;
    };
    includeDeleted?: boolean;
}
export interface BackupOptions {
    includeAuditLogs?: boolean;
    includeNotifications?: boolean;
    compress?: boolean;
}
export declare class ExportService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    exportPatients(tenantId: string, options: ExportOptions): Promise<{
        filePath: string;
        fileName: string;
    }>;
    exportLabResults(tenantId: string, options: ExportOptions): Promise<{
        filePath: string;
        fileName: string;
    }>;
    exportFinancialData(tenantId: string, options: ExportOptions): Promise<{
        filePath: string;
        fileName: string;
    }>;
    createFullBackup(tenantId: string, options?: BackupOptions): Promise<{
        filePath: string;
        fileName: string;
    }>;
    restoreFromBackup(tenantId: string, backupFilePath: string): Promise<void>;
    private createExcelFile;
    private createCSVFile;
    private createJSONFile;
    private createFinancialExcelFile;
    private flattenObject;
    private writeFile;
    private writeJSONFile;
    private readFile;
}
