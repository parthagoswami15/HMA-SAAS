export declare class FileUploadDto {
    file: any;
}
export declare class FileUploadResponseDto {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string;
    documentType?: string;
    uploadedAt: Date;
    metadata?: Record<string, any>;
}
export declare class FileUploadOptions {
    fieldName: string;
    destination: string;
    allowedMimeTypes: string;
    maxFileSize: string;
    fileFilter: string;
}
