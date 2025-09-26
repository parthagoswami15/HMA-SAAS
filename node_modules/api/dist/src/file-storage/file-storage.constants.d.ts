export declare const FILE_STORAGE_OPTIONS = "FILE_STORAGE_OPTIONS";
export declare const DEFAULT_FILE_STORAGE_OPTIONS: {
    readonly uploadPath: "./uploads";
    readonly maxFileSize: number;
    readonly allowedMimeTypes: readonly ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    readonly generateUniqueFilenames: true;
    readonly preserveOriginalFilename: false;
    readonly filenameStrategy: "uuid";
    readonly useSubdirectories: true;
    readonly subdirectoryTemplate: ":year/:month/:day";
    readonly fileTypeCategories: {
        readonly 'image/': "images";
        readonly 'application/pdf': "documents";
        readonly 'application/msword': "documents";
        readonly 'application/vnd.openxmlformats': "documents";
        readonly default: "others";
    };
    readonly useCdn: false;
    readonly enableCompression: false;
    readonly compressionQuality: 80;
    readonly generateThumbnails: false;
    readonly thumbnailSize: {
        readonly width: 200;
        readonly height: 200;
    };
    readonly enableEncryption: false;
    readonly enableVersioning: false;
    readonly maxVersions: 5;
};
