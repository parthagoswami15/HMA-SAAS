import { 
  Injectable, 
  Logger, 
  NotFoundException, 
  BadRequestException, 
  Inject, 
  OnModuleInit 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  createHash, 
  createCipheriv, 
  createDecipheriv, 
  randomBytes, 
  createHmac 
} from 'crypto';
import { 
  writeFile, 
  mkdir, 
  unlink, 
  access, 
  constants, 
  readFile, 
  stat, 
  readdir, 
  rmdir,
  createReadStream,
  createWriteStream,
  promises as fs 
} from 'fs';
import { join, extname, dirname, basename, parse as parsePath } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Readable, PassThrough } from 'stream';
import { promisify } from 'util';
import * as sharp from 'sharp';
import { pipeline } from 'stream/promises';
import * as mime from 'mime-types';
import { FILE_STORAGE_OPTIONS } from './file-storage.constants';
import { FileStorageOptions } from './interfaces';
import { UploadPatientPhotoOptions, UploadPatientDocumentOptions, UploadPatientPhotoFromUrlOptions, FileUpload } from './interfaces/file-upload.interface';

type FileInfo = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
  stream?: NodeJS.ReadableStream;
};

type FileMetadata = {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  encoding?: string;
  destination?: string;
  fieldname?: string;
  checksum?: string;
  metadata?: Record<string, any>;
};

type UploadOptions = {
  path?: string;
  filename?: string;
  generateThumbnail?: boolean;
  metadata?: Record<string, any>;
  acl?: string;
  contentType?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  expires?: Date;
  tags?: Record<string, string>;
};

type UploadResult = {
  filename: string;
  path: string;
  url: string;
  size: number;
  mimetype: string;
  metadata?: Record<string, any>;
  thumbnail?: {
    filename: string;
    path: string;
    url: string;
    size: number;
    width: number;
    height: number;
  };
};

@Injectable()
export class FileStorageService implements OnModuleInit {
  private readonly logger = new Logger(FileStorageService.name);
  private options: Required<FileStorageOptions>;
  private encryptionKey: Buffer = Buffer.alloc(0);
  private encryptionIV: Buffer = Buffer.alloc(0);
  private readonly algorithm = 'aes-256-cbc';

  constructor(
    @Inject(FILE_STORAGE_OPTIONS) private readonly fileStorageOptions: FileStorageOptions,
    private readonly configService: ConfigService,
  ) {
    this.options = {
      ...this.getDefaultOptions(),
      ...fileStorageOptions,
    };
    this.initializeEncryption();
  }

  async onModuleInit() {
    await this.ensureUploadDirectoryExists();
  }

  private getDefaultOptions(): Required<FileStorageOptions> {
    return {
      uploadPath: this.configService.get<string>('UPLOAD_PATH', './uploads'),
      maxPhotoSize: 5 * 1024 * 1024, // 5MB
      maxDocumentSize: 10 * 1024 * 1024, // 10MB
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
      storageProvider: undefined as any,
    };
  }

  private initializeEncryption(): void {
    if (this.options.enableEncryption) {
      if (!this.options.encryptionKey) {
        throw new Error('Encryption key is required when encryption is enabled');
      }
      
      // Create a hash of the encryption key to ensure it's the correct length
      const keyHash = createHash('sha256')
        .update(this.options.encryptionKey)
        .digest();
      
      // Use the first 32 bytes for the key and the next 16 for the IV
      this.encryptionKey = keyHash.slice(0, 32);
      this.encryptionIV = keyHash.slice(32, 48);
      
      if (this.encryptionIV.length < 16) {
        // Pad the IV if it's too short
        this.encryptionIV = Buffer.concat([
          this.encryptionIV,
          Buffer.alloc(16 - this.encryptionIV.length, 0)
        ]);
      }
    }
  }

  /**
   * Generates a file path for patient uploads based on the provided type
   * @param patientId - The ID of the patient
   * @param type - The type of upload ('photos' or 'documents')
   * @returns The full path for the upload
   */
  private getPatientUploadPath(patientId: string, type: 'photos' | 'documents'): string {
    return join(this.options.uploadPath, 'patients', patientId, type);
  }

  /**
   * Ensures the upload directory exists and is writable
   */
  private async ensureUploadDirectoryExists(): Promise<void> {
    try {
      await access(this.options.uploadPath, constants.F_OK | constants.W_OK);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.log(`Creating upload directory: ${this.options.uploadPath}`);
        await mkdir(this.options.uploadPath, { recursive: true, mode: 0o755 });
      } else {
        throw new Error(`Cannot access upload directory: ${error.message}`);
      }
    }
  }

  /**
   * Saves a file to the specified destination
   * @param file - The file to save (Buffer, Readable, or Multer file)
   * @param destinationPath - The destination directory
   * @param options - Additional options for saving the file
   * @returns The saved file's metadata
   */
  async saveFile(
    file: FileUpload,
    destinationPath: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    // Ensure the destination directory exists
    await this.ensureDirectoryExists(destinationPath);

    // Process the file based on its type
    const fileInfo = await this.processFileInput(file, options);
    
    // Generate a unique filename if needed
    const filename = this.generateFilename(fileInfo.originalname, options);
    const filePath = join(destinationPath, filename);
    
    try {
      // Save the file
      await this.writeFileToDisk(fileInfo, filePath);
      
      // Generate the public URL
      const publicUrl = this.generatePublicUrl(filePath);
      
      // Generate thumbnail if needed
      let thumbnail;
      if (options.generateThumbnail && this.isImage(fileInfo.mimetype)) {
        thumbnail = await this.generateThumbnail(filePath, destinationPath);
      }
      
      // Encrypt the file if encryption is enabled
      if (this.options.enableEncryption) {
        await this.encryptFile(filePath);
      }
      
      // Create the result object
      const result: UploadResult = {
        filename,
        path: filePath,
        url: publicUrl,
        size: fileInfo.size,
        mimetype: fileInfo.mimetype,
        metadata: options.metadata,
        thumbnail
      };
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to save file: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to save file: ${error.message}`);
    }
  }

  /**
   * Uploads a patient photo from URL or base64 data
   * @param options - The upload options
   * @returns The uploaded file's metadata
   */
  async uploadPatientPhotoFromUrl({
    photoUrl,
    patientId,
  }: UploadPatientPhotoFromUrlOptions): Promise<UploadResult> {
    try {
      // Validate input
      if (!photoUrl || !patientId) {
        throw new BadRequestException('Photo URL and patient ID are required');
      }

      const uploadPath = this.getPatientUploadPath(patientId, 'photos');
      const options: UploadOptions = {
        generateThumbnail: this.options.generateThumbnails,
        metadata: {
          patientId,
          type: 'photo',
          uploadedAt: new Date().toISOString(),
          source: 'url',
        },
      };

      // Handle base64 data
      if (photoUrl.startsWith('data:')) {
        const [mimeInfo, base64Data] = photoUrl.split(',');
        const mimetype = mimeInfo.split(':')[1].split(';')[0];

        if (!this.isAllowedMimeType(mimetype, ['image/jpeg', 'image/png', 'image/gif'])) {
          throw new BadRequestException('Invalid image type. Only JPEG, PNG, and GIF are allowed.');
        }

        const buffer = Buffer.from(base64Data, 'base64');
        const fileInfo: FileInfo = {
          buffer,
          originalname: `photo-${Date.now()}.${mimetype.split('/')[1]}`,
          mimetype,
          size: buffer.length,
        };

        const filename = this.generateFilename(fileInfo.originalname, options);
        const filePath = join(uploadPath, filename);

        await this.writeFileToDisk(fileInfo, filePath);

        // Generate the public URL
        const publicUrl = this.generatePublicUrl(filePath);

        // Generate thumbnail if needed
        let thumbnail;
        if (options.generateThumbnail && this.isImage(mimetype)) {
          thumbnail = await this.generateThumbnail(filePath, uploadPath);
        }

        // Encrypt the file if encryption is enabled
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

      // For now, just return a placeholder result for URL handling
      // In a real implementation, you would download the file from the URL
      const filename = `photo-${Date.now()}.jpg`;
      const filePath = join(uploadPath, filename);

      return {
        filename,
        path: filePath,
        url: photoUrl, // Use the provided URL directly
        size: 0,
        mimetype: 'image/jpeg',
        metadata: {
          ...options.metadata,
          source: 'url',
        },
      };
    } catch (error) {
      this.logger.error(`Error uploading patient photo from URL: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Uploads a patient document with validation and processing
   * @param options - The upload options
   * @returns The uploaded file's metadata
   */
  async uploadPatientDocument({
    file,
    patientId,
    documentType,
  }: UploadPatientDocumentOptions): Promise<UploadResult> {
    try {
      // Validate file type
      if (!this.isAllowedMimeType(file.mimetype, this.options.allowedMimeTypes)) {
        throw new BadRequestException(
          'Invalid file type. Only PDF, DOC, DOCX, JPEG, and PNG are allowed.'
        );
      }

      // Validate file size
      if (file.size > this.options.maxFileSize) {
        throw new BadRequestException(
          `File size exceeds the maximum limit of ${this.options.maxFileSize / (1024 * 1024)}MB`
        );
      }

      const uploadPath = this.getPatientUploadPath(patientId, 'documents');
      const options: UploadOptions = {
        metadata: {
          patientId,
          documentType,
          uploadedAt: new Date().toISOString(),
        },
      };
      
      return await this.saveFile(file, uploadPath, options);
    } catch (error) {
      this.logger.error(`Error uploading patient document: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Deletes a file from the filesystem
   * @param filePath - The path to the file to delete
   * @returns True if the file was deleted, false otherwise
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      await unlink(filePath);
      
      // Also delete thumbnail if it exists
      const thumbnailPath = this.getThumbnailPath(filePath);
      if (await this.fileExists(thumbnailPath)) {
        await unlink(thumbnailPath);
      }
      
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException('File not found');
      }
      this.logger.error(`Error deleting file: ${error.message}`, error.stack);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Gets a readable stream for a file
   * @param filePath - The path to the file
   * @returns A readable stream of the file content
   */
  async getFileStream(filePath: string): Promise<NodeJS.ReadableStream> {
    try {
      if (!(await this.fileExists(filePath))) {
        throw new NotFoundException('File not found');
      }
      
      let readStream: NodeJS.ReadableStream = createReadStream(filePath);
      
      // Decrypt the stream if encryption is enabled
      if (this.options.enableEncryption) {
        readStream = this.decryptStream(readStream);
      }
      
      return readStream;
    } catch (error) {
      this.logger.error(`Error getting file stream: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to read file');
    }
  }

  /**
   * Processes different types of file inputs (Buffer, Readable, or Multer file)
   * and returns a standardized file info object
   */
  private async processFileInput(
    file: FileUpload,
    options: UploadOptions
  ): Promise<FileInfo> {
    // Handle Buffer input
    if (Buffer.isBuffer(file)) {
      return {
        buffer: file,
        originalname: options.filename || `file-${Date.now()}`,
        mimetype: options.contentType || 'application/octet-stream',
        size: file.length,
      };
    }
    
    // Handle Readable stream input
    if (file instanceof Readable) {
      const chunks: Buffer[] = [];
      let size = 0;
      
      for await (const chunk of file) {
        const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        chunks.push(bufferChunk);
        size += bufferChunk.length;
        
        // Check file size limit
        if (size > this.options.maxFileSize) {
          throw new BadRequestException(
            `File size exceeds the maximum limit of ${this.options.maxFileSize / (1024 * 1024)}MB`
          );
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
    
    // Handle Multer file
    if ('buffer' in file) {
      return {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      };
    }
    
    throw new BadRequestException('Invalid file type');
  }

  /**
   * Generates a unique filename based on the original filename and options
   */
  private generateFilename(originalname: string, options: UploadOptions): string {
    if (options.filename) {
      return options.filename;
    }
    
    const ext = extname(originalname).toLowerCase();
    const name = parsePath(originalname).name;
    
    switch (this.options.filenameStrategy) {
      case 'uuid':
        return `${uuidv4()}${ext}`;
      case 'timestamp':
        return `${Date.now()}-${name}${ext}`;
      case 'hash':
        const hash = createHash('md5')
          .update(`${name}-${Date.now()}`)
          .digest('hex');
        return `${hash}${ext}`;
      case 'original':
      default:
        return originalname;
    }
  }

  /**
   * Writes a file to disk with the given file info
   */
  private async writeFileToDisk(
    fileInfo: FileInfo,
    filePath: string
  ): Promise<void> {
    const dir = dirname(filePath);
    await this.ensureDirectoryExists(dir);
    
    if (fileInfo.buffer) {
      await writeFile(filePath, fileInfo.buffer);
    } else if (fileInfo.stream) {
      const writeStream = createWriteStream(filePath);
      await pipeline(fileInfo.stream, writeStream);
    } else {
      throw new Error('No file content provided');
    }
  }

  /**
   * Ensures that a directory exists and is writable
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await access(dirPath, constants.F_OK | constants.W_OK);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await mkdir(dirPath, { recursive: true, mode: 0o755 });
      } else {
        throw new Error(`Cannot access directory: ${error.message}`);
      }
    }
  }

  /**
   * Generates a public URL for a file
   */
  private generatePublicUrl(filePath: string): string {
    if (this.options.useCdn && this.options.cdnBaseUrl) {
      const relativePath = filePath.replace(this.options.uploadPath, '').replace(/\\/g, '/');
      return `${this.options.cdnBaseUrl}${relativePath}`;
    }
    
    // For local development, return a path relative to the API
    return `/uploads${filePath.replace(this.options.uploadPath, '').replace(/\\/g, '/')}`;
  }

  /**
   * Generates a thumbnail for an image file
   */
  private async generateThumbnail(
    filePath: string,
    destinationPath: string
  ): Promise<UploadResult['thumbnail']> {
    try {
      const ext = extname(filePath);
      const filename = `${parsePath(filePath).name}-thumb${ext}`;
      const thumbPath = join(destinationPath, filename);
      
      await sharp(filePath)
        .resize({
          width: this.options.thumbnailSize.width,
          height: this.options.thumbnailSize.height,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFile(thumbPath);
      
      const stats = await stat(thumbPath);
      const dimensions = await sharp(thumbPath).metadata();
      
      return {
        filename,
        path: thumbPath,
        url: this.generatePublicUrl(thumbPath),
        size: stats.size,
        width: dimensions.width || 0,
        height: dimensions.height || 0,
      };
    } catch (error) {
      this.logger.error(`Error generating thumbnail: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets the path for a thumbnail file
   */
  private getThumbnailPath(filePath: string): string {
    const parsed = parsePath(filePath);
    return join(parsed.dir, `${parsed.name}-thumb${parsed.ext}`);
  }

  /**
   * Checks if a file exists and is accessible
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath, constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Checks if a MIME type is in the list of allowed types
   */
  private isAllowedMimeType(mimetype: string, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => {
      // Handle wildcard types like 'image/*'
      if (type.endsWith('/*')) {
        const prefix = type.slice(0, -1); // Remove the '*' from the end
        return mimetype.startsWith(prefix);
      }
      return mimetype === type;
    });
  }

  /**
   * Checks if a MIME type is an image
   */
  private isImage(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  /**
   * Encrypts a file in place
   */
  private async encryptFile(filePath: string): Promise<void> {
    if (!this.options.enableEncryption) return;
    
    try {
      const content = await readFile(filePath);
      const cipher = createCipheriv(this.algorithm, this.encryptionKey, this.encryptionIV);
      const encrypted = Buffer.concat([cipher.update(content), cipher.final()]);
      
      // Write the encrypted content back to the file
      await writeFile(filePath, encrypted);
    } catch (error) {
      this.logger.error(`Error encrypting file: ${error.message}`, error.stack);
      throw new Error('Failed to encrypt file');
    }
  }

  /**
   * Creates a decrypting stream
   */
  /**
   * Creates a decrypting stream
   */
  private decryptStream(stream: NodeJS.Readable): NodeJS.Readable {
    if (!this.options.enableEncryption) return stream;
    
    const decipher = createDecipheriv(this.algorithm, this.encryptionKey, this.encryptionIV);
    
    // Handle stream errors
    const output = new PassThrough();
    
    // Pipe through the decipher and handle errors
    stream.pipe(decipher)
      .on('error', (error) => {
        this.logger.error(`Decryption error: ${error.message}`, error.stack);
        output.emit('error', new BadRequestException('Failed to decrypt file'));
      })
      .pipe(output);
      
    return output;
  }

  /**
   * Calculates the MD5 hash of a file
   * @param filePath Path to the file
   * @returns MD5 hash of the file
   */
  public async calculateFileHash(filePath: string): Promise<string> {
    try {
      const hash = createHash('md5');
      const stream = createReadStream(filePath);
      
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', (error) => reject(error));
      });
    } catch (error) {
      this.logger.error(`Error calculating file hash: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to calculate file hash');
    }
  }

  /**
   * Gets file metadata without reading the entire file
   */
  public async getFileMetadata(filePath: string): Promise<{
    size: number;
    mtime: Date;
    ctime: Date;
    mimetype: string;
    extension: string;
  }> {
    try {
      const stats = await stat(filePath);
      const ext = extname(filePath).toLowerCase().substring(1);
      const mimeType = mime.lookup(ext) || 'application/octet-stream';
      
      return {
        size: stats.size,
        mtime: stats.mtime,
        ctime: stats.ctime,
        mimetype: mimeType,
        extension: ext,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException('File not found');
      }
      this.logger.error(`Error getting file metadata: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to get file metadata');
    }
  }

  /**
   * Deletes a directory and all its contents recursively
   */
  public async deleteDirectory(directoryPath: string): Promise<void> {
    try {
      const files = await readdir(directoryPath, { withFileTypes: true });
      
      await Promise.all(files.map(async (file) => {
        const fullPath = join(directoryPath, file.name);
        
        if (file.isDirectory()) {
          await this.deleteDirectory(fullPath);
        } else {
          await unlink(fullPath);
        }
      }));
      
      await rmdir(directoryPath);
    } catch (error) {
      if (error.code !== 'ENOENT') { // Ignore if directory doesn't exist
        this.logger.error(`Error deleting directory: ${error.message}`, error.stack);
        throw new BadRequestException('Failed to delete directory');
      }
    }
  }

  /**
   * Generates a hash for the given buffer
   * @param buffer The buffer to hash
   * @returns A hexadecimal string representation of the hash
   */
  generateFileHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Validates file size against configured limits
   * @param size File size in bytes
   * @param type Type of file for custom limits (e.g., 'photo', 'document')
   * @throws BadRequestException if file size exceeds the limit
   */
  private validateFileSize(size: number, type: 'photo' | 'document' = 'document'): void {
    const maxSize = type === 'photo' 
      ? this.options.maxPhotoSize 
      : this.options.maxDocumentSize;
    
    if (size > maxSize) {
      throw new BadRequestException(
        `File size exceeds the maximum allowed size of ${maxSize / (1024 * 1024)}MB`
      );
    }
  }

  /**
   * Validates file MIME type against allowed types
   * @param mimetype The MIME type to validate
   * @param allowedTypes Array of allowed MIME types or type patterns (e.g., 'image/*')
   * @throws BadRequestException if MIME type is not allowed
   */
  private validateMimeType(mimetype: string, allowedTypes: string[]): void {
    if (!this.isAllowedMimeType(mimetype, allowedTypes)) {
      throw new BadRequestException(
        `File type '${mimetype}' is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      );
    }
  }

  /**
   * Gets the MIME type from a file extension
   * @param filename The filename or extension to check
   * @returns The MIME type or 'application/octet-stream' if unknown
   */
  private getMimeType(filename: string): string {
    return mime.lookup(filename) || 'application/octet-stream';
  }

  /**
   * Sanitizes a filename to remove potentially dangerous characters
   * @param filename The original filename
   * @returns A sanitized filename
   */
  private sanitizeFilename(filename: string): string {
    // Remove any path information
    const baseName = basename(filename);
    // Replace any non-alphanumeric characters (except ._-) with underscore
    return baseName.replace(/[^\w\-_.]/g, '_');
  }

  /**
   * Gets the file extension from a filename
   * @param filename The filename to check
   * @returns The file extension in lowercase (without the dot)
   */
  private getFileExtension(filename: string): string {
    return extname(filename).toLowerCase().substring(1);
  }

  /**
   * Gets the size of a file
   * @param filePath Path to the file
   * @returns The size of the file in bytes
   */
  public async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await stat(filePath);
      return stats.size;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException('File not found');
      }
      throw new BadRequestException('Failed to get file size');
    }
  }

  /**
   * Creates a temporary file with the given content
   * @param content The file content
   * @param options Options for the temporary file
   * @returns The path to the temporary file
   */
  public async createTempFile(
    content: Buffer | string,
    options: { prefix?: string; postfix?: string } = {}
  ): Promise<string> {
    const { prefix = 'temp-', postfix = '' } = options;
    const tempDir = join(this.options.uploadPath, 'temp');
    await this.ensureDirectoryExists(tempDir);
    
    const tempPath = join(tempDir, `${prefix}${Date.now()}${postfix}`);
    await writeFile(tempPath, content);
    
    return tempPath;
  }

  /**
   * Cleans up temporary files older than the specified age
   * @param maxAge Maximum age of temporary files in milliseconds
   */
  public async cleanupTempFiles(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    const tempDir = join(this.options.uploadPath, 'temp');
    
    try {
      const files = await readdir(tempDir);
      const now = Date.now();
      
      await Promise.all(
        files.map(async (file) => {
          const filePath = join(tempDir, file);
          const stats = await stat(filePath);
          
          if (now - stats.mtimeMs > maxAge) {
            await unlink(filePath);
          }
        })
      );
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.error(`Error cleaning up temp files: ${error.message}`, error.stack);
      }
    }
  }
}
