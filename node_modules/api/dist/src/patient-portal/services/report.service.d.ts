import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class ReportService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getReports(query: any, user: any): Promise<{
        reports: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    getReport(reportId: string, user: any): Promise<any>;
    downloadReport(reportId: string, user: any): Promise<{
        reportId: string;
        fileName: any;
        fileType: any;
        content: Buffer<ArrayBuffer>;
    }>;
    getPrescriptions(query: any, user: any): Promise<{
        prescriptions: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    getPrescription(prescriptionId: string, user: any): Promise<any>;
    downloadPrescription(prescriptionId: string, user: any): Promise<{
        prescriptionId: string;
        fileName: string;
        content: Buffer<ArrayBuffer>;
    }>;
    shareDocument(shareDto: any, user: any): Promise<{
        shareId: any;
        shareToken: any;
        expiresAt: any;
    }>;
    requestDocumentAccess(accessDto: any, user: any): Promise<{
        requestId: any;
        status: string;
        message: string;
    }>;
    getReportStats(user: any): Promise<{
        userId: any;
        totalReports: any;
        reportsByType: any;
        reportsByStatus: any;
        totalPrescriptions: any;
    }>;
    private getReportFile;
    private generatePrescriptionPdf;
    private generateShareToken;
    private sendShareNotification;
    private notifyDocumentOwner;
}
