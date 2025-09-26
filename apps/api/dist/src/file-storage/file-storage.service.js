"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FileStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const uuid_1 = require("uuid");
const stream_1 = require("stream");
const sharp = __importStar(require("sharp"));
const promises_1 = require("stream/promises");
const mime = __importStar(require("mime-types"));
const file_storage_constants_1 = require("./file-storage.constants");
let FileStorageService = FileStorageService_1 = class FileStorageService {
    fileStorageOptions;
    configService;
    logger = new common_1.Logger(FileStorageService_1.name);
    options;
    encryptionKey = Buffer.alloc(0);
    encryptionIV = Buffer.alloc(0);
    algorithm = 'aes-256-cbc';
    constructor(fileStorageOptions, configService) {
        this.fileStorageOptions = fileStorageOptions;
        this.configService = configService;
        this.options = {
            ...this.getDefaultOptions(),
            ...fileStorageOptions,
        };
        this.initializeEncryption();
    }
    async onModuleInit() {
        await this.ensureUploadDirectoryExists();
    }
    getDefaultOptions() {
        return {
            uploadPath: this.configService.get('UPLOAD_PATH', './uploads'),
            maxPhotoSize: 5 * 1024 * 1024,
            maxDocumentSize: 10 * 1024 * 1024,
            allowedMimeTypes: [
                'image/jpeg',
                'image/png',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],
            generateUniqueFilenames: true,
            preserveOriginalFilename: false,
            filenameStrategy: 'uuid',
            useSubdirectories: true,
            subdirectoryTemplate: ':year/:month/:day',
            fileTypeCategories: {
                'image/': 'images',
                'application/pdf': 'documents',
                'application/msword': 'documents',
                'application/vnd.openxmlformats': 'documents',
                'default': 'others',
            },
            useCdn: false,
            cdnBaseUrl: '',
            enableCompression: false,
            compressionQuality: 80,
            generateThumbnails: false,
            thumbnailSize: { width: 200, height: 200 },
            enableEncryption: false,
            encryptionKey: '',
            enableVersioning: false,
            maxVersions: 5,
            storageProvider: undefined,
        };
    }
    initializeEncryption() {
        if (this.options.enableEncryption) {
            if (!this.options.encryptionKey) {
                throw new Error('Encryption key is required when encryption is enabled');
            }
            const keyHash = (0, crypto_1.createHash)('sha256')
                .update(this.options.encryptionKey)
                .digest();
            this.encryptionKey = keyHash.slice(0, 32);
            this.encryptionIV = keyHash.slice(32, 48);
            if (this.encryptionIV.length < 16) {
                this.encryptionIV = Buffer.concat([
                    this.encryptionIV,
                    Buffer.alloc(16 - this.encryptionIV.length, 0)
                ]);
            }
        }
    }
    getPatientUploadPath(patientId, type) {
        return (0, path_1.join)(this.options.uploadPath, 'patients', patientId, type);
    }
    async ensureUploadDirectoryExists() {
        try {
            await (0, fs_1.access)(this.options.uploadPath, fs_1.constants.F_OK | fs_1.constants.W_OK);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                this.logger.log(`Creating upload directory: ${this.options.uploadPath}`);
                await (0, fs_1.mkdir)(this.options.uploadPath, { recursive: true, mode: 0o755 });
            }
            else {
                throw new Error(`Cannot access upload directory: ${error.message}`);
            }
        }
    }
    async saveFile(file, destinationPath, options = {}) {
        await this.ensureDirectoryExists(destinationPath);
        const fileInfo = await this.processFileInput(file, options);
        const filename = this.generateFilename(fileInfo.originalname, options);
        const filePath = (0, path_1.join)(destinationPath, filename);
        try {
            await this.writeFileToDisk(fileInfo, filePath);
            const publicUrl = this.generatePublicUrl(filePath);
            let thumbnail;
            if (options.generateThumbnail && this.isImage(fileInfo.mimetype)) {
                thumbnail = await this.generateThumbnail(filePath, destinationPath);
            }
            if (this.options.enableEncryption) {
                await this.encryptFile(filePath);
            }
            const result = {
                filename,
                path: filePath,
                url: publicUrl,
                size: fileInfo.size,
                mimetype: fileInfo.mimetype,
                metadata: options.metadata,
                thumbnail
            };
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to save file: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to save file: ${error.message}`);
        }
    }
    async uploadPatientPhotoFromUrl({ photoUrl, patientId, }) {
        try {
            if (!photoUrl || !patientId) {
                throw new common_1.BadRequestException('Photo URL and patient ID are required');
            }
            const uploadPath = this.getPatientUploadPath(patientId, 'photos');
            const options = {
                generateThumbnail: this.options.generateThumbnails,
                metadata: {
                    patientId,
                    type: 'photo',
                    uploadedAt: new Date().toISOString(),
                    source: 'url',
                },
            };
            if (photoUrl.startsWith('data:')) {
                const [mimeInfo, base64Data] = photoUrl.split(',');
                const mimetype = mimeInfo.split(':')[1].split(';')[0];
                if (!this.isAllowedMimeType(mimetype, ['image/jpeg', 'image/png', 'image/gif'])) {
                    throw new common_1.BadRequestException('Invalid image type. Only JPEG, PNG, and GIF are allowed.');
                }
                const buffer = Buffer.from(base64Data, 'base64');
                const fileInfo = {
                    buffer,
                    originalname: `photo-${Date.now()}.${mimetype.split('/')[1]}`,
                    mimetype,
                    size: buffer.length,
                };
                const filename = this.generateFilename(fileInfo.originalname, options);
                const filePath = (0, path_1.join)(uploadPath, filename);
                await this.writeFileToDisk(fileInfo, filePath);
                const publicUrl = this.generatePublicUrl(filePath);
                let thumbnail;
                if (options.generateThumbnail && this.isImage(mimetype)) {
                    thumbnail = await this.generateThumbnail(filePath, uploadPath);
                }
                if (this.options.enableEncryption) {
                    await this.encryptFile(filePath);
                }
                return {
                    filename,
                    path: filePath,
                    url: publicUrl,
                    size: fileInfo.size,
                    mimetype,
                    metadata: options.metadata,
                    thumbnail,
                };
            }
            const filename = `photo-${Date.now()}.jpg`;
            const filePath = (0, path_1.join)(uploadPath, filename);
            return {
                filename,
                path: filePath,
                url: photoUrl,
                size: 0,
                mimetype: 'image/jpeg',
                metadata: {
                    ...options.metadata,
                    source: 'url',
                },
            };
        }
        catch (error) {
            this.logger.error(`Error uploading patient photo from URL: ${error.message}`, error.stack);
            throw error;
        }
    }
    async uploadPatientDocument({ file, patientId, documentType, }) {
        try {
            if (!this.isAllowedMimeType(file.mimetype, this.options.allowedMimeTypes)) {
                throw new common_1.BadRequestException('Invalid file type. Only PDF, DOC, DOCX, JPEG, and PNG are allowed.');
            }
            if (file.size > this.options.maxFileSize) {
                throw new common_1.BadRequestException(`File size exceeds the maximum limit of ${this.options.maxFileSize / (1024 * 1024)}MB`);
            }
            const uploadPath = this.getPatientUploadPath(patientId, 'documents');
            const options = {
                metadata: {
                    patientId,
                    documentType,
                    uploadedAt: new Date().toISOString(),
                },
            };
            return await this.saveFile(file, uploadPath, options);
        }
        catch (error) {
            this.logger.error(`Error uploading patient document: ${error.message}`, error.stack);
            throw error;
        }
    }
    async deleteFile(filePath) {
        try {
            await (0, fs_1.unlink)(filePath);
            const thumbnailPath = this.getThumbnailPath(filePath);
            if (await this.fileExists(thumbnailPath)) {
                await (0, fs_1.unlink)(thumbnailPath);
            }
            return true;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                throw new common_1.NotFoundException('File not found');
            }
            this.logger.error(`Error deleting file: ${error.message}`, error.stack);
            throw new Error('Failed to delete file');
        }
    }
    async getFileStream(filePath) {
        try {
            if (!(await this.fileExists(filePath))) {
                throw new common_1.NotFoundException('File not found');
            }
            let readStream = (0, fs_1.createReadStream)(filePath);
            if (this.options.enableEncryption) {
                readStream = this.decryptStream(readStream);
            }
            return readStream;
        }
        catch (error) {
            this.logger.error(`Error getting file stream: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to read file');
        }
    }
    async processFileInput(file, options) {
        if (Buffer.isBuffer(file)) {
            return {
                buffer: file,
                originalname: options.filename || `file-${Date.now()}`,
                mimetype: options.contentType || 'application/octet-stream',
                size: file.length,
            };
        }
        if (file instanceof stream_1.Readable) {
            const chunks = [];
            let size = 0;
            for await (const chunk of file) {
                const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
                chunks.push(bufferChunk);
                size += bufferChunk.length;
                if (size > this.options.maxFileSize) {
                    throw new common_1.BadRequestException(`File size exceeds the maximum limit of ${this.options.maxFileSize / (1024 * 1024)}MB`);
                }
            }
            const buffer = Buffer.concat(chunks);
            return {
                buffer,
                originalname: options.filename || `file-${Date.now()}`,
                mimetype: options.contentType || 'application/octet-stream',
                size,
            };
        }
        if ('buffer' in file) {
            return {
                buffer: file.buffer,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
            };
        }
        throw new common_1.BadRequestException('Invalid file type');
    }
    generateFilename(originalname, options) {
        if (options.filename) {
            return options.filename;
        }
        const ext = (0, path_1.extname)(originalname).toLowerCase();
        const name = (0, path_1.parse)(originalname).name;
        switch (this.options.filenameStrategy) {
            case 'uuid':
                return `${(0, uuid_1.v4)()}${ext}`;
            case 'timestamp':
                return `${Date.now()}-${name}${ext}`;
            case 'hash':
                const hash = (0, crypto_1.createHash)('md5')
                    .update(`${name}-${Date.now()}`)
                    .digest('hex');
                return `${hash}${ext}`;
            case 'original':
            default:
                return originalname;
        }
    }
    async writeFileToDisk(fileInfo, filePath) {
        const dir = (0, path_1.dirname)(filePath);
        await this.ensureDirectoryExists(dir);
        if (fileInfo.buffer) {
            await (0, fs_1.writeFile)(filePath, fileInfo.buffer);
        }
        else if (fileInfo.stream) {
            const writeStream = (0, fs_1.createWriteStream)(filePath);
            await (0, promises_1.pipeline)(fileInfo.stream, writeStream);
        }
        else {
            throw new Error('No file content provided');
        }
    }
    async ensureDirectoryExists(dirPath) {
        try {
            await (0, fs_1.access)(dirPath, fs_1.constants.F_OK | fs_1.constants.W_OK);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                await (0, fs_1.mkdir)(dirPath, { recursive: true, mode: 0o755 });
            }
            else {
                throw new Error(`Cannot access directory: ${error.message}`);
            }
        }
    }
    generatePublicUrl(filePath) {
        if (this.options.useCdn && this.options.cdnBaseUrl) {
            const relativePath = filePath.replace(this.options.uploadPath, '').replace(/\\/g, '/');
            return `${this.options.cdnBaseUrl}${relativePath}`;
        }
        return `/uploads${filePath.replace(this.options.uploadPath, '').replace(/\\/g, '/')}`;
    }
    async generateThumbnail(filePath, destinationPath) {
        try {
            const ext = (0, path_1.extname)(filePath);
            const filename = `${(0, path_1.parse)(filePath).name}-thumb${ext}`;
            const thumbPath = (0, path_1.join)(destinationPath, filename);
            await sharp(filePath)
                .resize({
                width: this.options.thumbnailSize.width,
                height: this.options.thumbnailSize.height,
                fit: 'inside',
                withoutEnlargement: true,
            })
                .toFile(thumbPath);
            const stats = await (0, fs_1.stat)(thumbPath);
            const dimensions = await sharp(thumbPath).metadata();
            return {
                filename,
                path: thumbPath,
                url: this.generatePublicUrl(thumbPath),
                size: stats.size,
                width: dimensions.width || 0,
                height: dimensions.height || 0,
            };
        }
        catch (error) {
            this.logger.error(`Error generating thumbnail: ${error.message}`, error.stack);
            throw error;
        }
    }
    getThumbnailPath(filePath) {
        const parsed = (0, path_1.parse)(filePath);
        return (0, path_1.join)(parsed.dir, `${parsed.name}-thumb${parsed.ext}`);
    }
    async fileExists(filePath) {
        try {
            await (0, fs_1.access)(filePath, fs_1.constants.F_OK);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    isAllowedMimeType(mimetype, allowedTypes) {
        return allowedTypes.some(type => {
            if (type.endsWith('/*')) {
                const prefix = type.slice(0, -1);
                return mimetype.startsWith(prefix);
            }
            return mimetype === type;
        });
    }
    isImage(mimetype) {
        return mimetype.startsWith('image/');
    }
    async encryptFile(filePath) {
        if (!this.options.enableEncryption)
            return;
        try {
            const content = await (0, fs_1.readFile)(filePath);
            const cipher = (0, crypto_1.createCipheriv)(this.algorithm, this.encryptionKey, this.encryptionIV);
            const encrypted = Buffer.concat([cipher.update(content), cipher.final()]);
            await (0, fs_1.writeFile)(filePath, encrypted);
        }
        catch (error) {
            this.logger.error(`Error encrypting file: ${error.message}`, error.stack);
            throw new Error('Failed to encrypt file');
        }
    }
    decryptStream(stream) {
        if (!this.options.enableEncryption)
            return stream;
        const decipher = (0, crypto_1.createDecipheriv)(this.algorithm, this.encryptionKey, this.encryptionIV);
        const output = new stream_1.PassThrough();
        stream.pipe(decipher)
            .on('error', (error) => {
            this.logger.error(`Decryption error: ${error.message}`, error.stack);
            output.emit('error', new common_1.BadRequestException('Failed to decrypt file'));
        })
            .pipe(output);
        return output;
    }
    async calculateFileHash(filePath) {
        try {
            const hash = (0, crypto_1.createHash)('md5');
            const stream = (0, fs_1.createReadStream)(filePath);
            return new Promise((resolve, reject) => {
                stream.on('data', (chunk) => hash.update(chunk));
                stream.on('end', () => resolve(hash.digest('hex')));
                stream.on('error', (error) => reject(error));
            });
        }
        catch (error) {
            this.logger.error(`Error calculating file hash: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to calculate file hash');
        }
    }
    async getFileMetadata(filePath) {
        try {
            const stats = await (0, fs_1.stat)(filePath);
            const ext = (0, path_1.extname)(filePath).toLowerCase().substring(1);
            const mimeType = mime.lookup(ext) || 'application/octet-stream';
            return {
                size: stats.size,
                mtime: stats.mtime,
                ctime: stats.ctime,
                mimetype: mimeType,
                extension: ext,
            };
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                throw new common_1.NotFoundException('File not found');
            }
            this.logger.error(`Error getting file metadata: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to get file metadata');
        }
    }
    async deleteDirectory(directoryPath) {
        try {
            const files = await (0, fs_1.readdir)(directoryPath, { withFileTypes: true });
            await Promise.all(files.map(async (file) => {
                const fullPath = (0, path_1.join)(directoryPath, file.name);
                if (file.isDirectory()) {
                    await this.deleteDirectory(fullPath);
                }
                else {
                    await (0, fs_1.unlink)(fullPath);
                }
            }));
            await (0, fs_1.rmdir)(directoryPath);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                this.logger.error(`Error deleting directory: ${error.message}`, error.stack);
                throw new common_1.BadRequestException('Failed to delete directory');
            }
        }
    }
    generateFileHash(buffer) {
        return (0, crypto_1.createHash)('sha256').update(buffer).digest('hex');
    }
    validateFileSize(size, type = 'document') {
        const maxSize = type === 'photo'
            ? this.options.maxPhotoSize
            : this.options.maxDocumentSize;
        if (size > maxSize) {
            throw new common_1.BadRequestException(`File size exceeds the maximum allowed size of ${maxSize / (1024 * 1024)}MB`);
        }
    }
    validateMimeType(mimetype, allowedTypes) {
        if (!this.isAllowedMimeType(mimetype, allowedTypes)) {
            throw new common_1.BadRequestException(`File type '${mimetype}' is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        }
    }
    getMimeType(filename) {
        return mime.lookup(filename) || 'application/octet-stream';
    }
    sanitizeFilename(filename) {
        const baseName = (0, path_1.basename)(filename);
        return baseName.replace(/[^\w\-_.]/g, '_');
    }
    getFileExtension(filename) {
        return (0, path_1.extname)(filename).toLowerCase().substring(1);
    }
    async getFileSize(filePath) {
        try {
            const stats = await (0, fs_1.stat)(filePath);
            return stats.size;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                throw new common_1.NotFoundException('File not found');
            }
            throw new common_1.BadRequestException('Failed to get file size');
        }
    }
    async createTempFile(content, options = {}) {
        const { prefix = 'temp-', postfix = '' } = options;
        const tempDir = (0, path_1.join)(this.options.uploadPath, 'temp');
        await this.ensureDirectoryExists(tempDir);
        const tempPath = (0, path_1.join)(tempDir, `${prefix}${Date.now()}${postfix}`);
        await (0, fs_1.writeFile)(tempPath, content);
        return tempPath;
    }
    async cleanupTempFiles(maxAge = 24 * 60 * 60 * 1000) {
        const tempDir = (0, path_1.join)(this.options.uploadPath, 'temp');
        try {
            const files = await (0, fs_1.readdir)(tempDir);
            const now = Date.now();
            await Promise.all(files.map(async (file) => {
                const filePath = (0, path_1.join)(tempDir, file);
                const stats = await (0, fs_1.stat)(filePath);
                if (now - stats.mtimeMs > maxAge) {
                    await (0, fs_1.unlink)(filePath);
                }
            }));
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                this.logger.error(`Error cleaning up temp files: ${error.message}`, error.stack);
            }
        }
    }
};
exports.FileStorageService = FileStorageService;
exports.FileStorageService = FileStorageService = FileStorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(file_storage_constants_1.FILE_STORAGE_OPTIONS)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], FileStorageService);
//# sourceMappingURL=file-storage.service.js.map