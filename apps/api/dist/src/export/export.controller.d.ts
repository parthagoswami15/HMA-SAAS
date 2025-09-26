import { Request as ExpressRequest, Response } from 'express';
import { ExportService } from './export.service';
import type { BackupOptions } from './export.service';
import { Role } from '@prisma/client';
interface AuthenticatedRequest extends ExpressRequest {
    user: {
        userId: string;
        tenantId: string;
        role: Role;
    };
}
export declare class ExportController {
    private readonly exportService;
    constructor(exportService: ExportService);
    exportPatients(req: AuthenticatedRequest, format: "excel" | "csv" | "json" | undefined, startDate?: string, endDate?: string, res: Response): Promise<void>;
    exportLabResults(req: AuthenticatedRequest, format: "excel" | "csv" | "json" | undefined, startDate?: string, endDate?: string, res: Response): Promise<void>;
    exportFinancialData(req: AuthenticatedRequest, format: "excel" | "json" | undefined, startDate?: string, endDate?: string, res: Response): Promise<void>;
    createBackup(req: AuthenticatedRequest, options: BackupOptions): Promise<{
        message: string;
        fileName: string;
        filePath: string;
    }>;
    downloadBackup(req: AuthenticatedRequest, fileName: string, res: Response): Promise<void>;
    restoreBackup(req: AuthenticatedRequest, body: {
        backupFilePath: string;
    }): Promise<{
        message: string;
    }>;
    private getContentType;
}
export {};
