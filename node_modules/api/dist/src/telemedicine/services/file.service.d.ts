import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class FileService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    uploadFile(file: Express.Multer.File, fileUploadDto: any, user: any): Promise<any>;
    getConsultationFiles(consultationId: string, user: any): Promise<any>;
    downloadFile(fileId: string, user: any): Promise<Buffer<ArrayBufferLike>>;
    deleteFile(fileId: string, user: any): Promise<{
        success: boolean;
    }>;
    shareFile(fileId: string, shareDto: any, user: any): Promise<{
        fileId: string;
        shareLink: string;
        expiresAt: Date | null;
    }>;
    getFileMetadata(fileId: string, user: any): Promise<{
        id: any;
        fileName: any;
        fileType: any;
        mimeType: any;
        fileSize: any;
        description: any;
        isPrivate: any;
        uploadedAt: any;
        uploadedBy: any;
    }>;
    searchFiles(query: string, user: any): Promise<any>;
    private uploadToStorage;
    private downloadFromStorage;
    private deleteFromStorage;
    private generateShareableLink;
    getStorageUsage(user: any): Promise<{
        totalFiles: any;
        totalSize: any;
        totalSizeFormatted: string;
    }>;
    private formatBytes;
    compressFile(fileId: string, user: any): Promise<any>;
    private compressFileInStorage;
}
