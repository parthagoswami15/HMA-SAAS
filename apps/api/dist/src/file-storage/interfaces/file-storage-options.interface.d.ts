export interface FileStorageOptions {
    uploadPath?: string;
    maxPhotoSize?: number;
    maxDocumentSize?: number;
    allowedMimeTypes?: string[];
    generateUniqueFilenames?: boolean;
    preserveOriginalFilename?: boolean;
    filenameStrategy?: 'uuid' | 'timestamp' | 'hash' | 'original';
    useSubdirectories?: boolean;
    subdirectoryTemplate?: string;
    fileTypeCategories?: Record<string, string>;
    useCdn?: boolean;
    cdnBaseUrl?: string;
    enableCompression?: boolean;
    compressionQuality?: number;
    generateThumbnails?: boolean;
    thumbnailSize?: {
        width: number;
        height: number;
    };
    enableEncryption?: boolean;
    encryptionKey?: string;
    enableVersioning?: boolean;
    maxVersions?: number;
    storageProvider?: {
        save: (file: Buffer | NodeJS.ReadableStream, path: string, options?: Record<string, any>) => Promise<{
            path: string;
            url: string;
        }>;
        get: (path: string) => Promise<Buffer | NodeJS.ReadableStream>;
        delete: (path: string) => Promise<void>;
        exists: (path: string) => Promise<boolean>;
        getUrl: (path: string) => Promise<string>;
    };
}
