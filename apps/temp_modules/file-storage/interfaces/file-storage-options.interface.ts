/**
 * Options for configuring the file storage module
 */
export interface FileStorageOptions {
  /**
   * The base directory where files will be stored
   * @default './uploads'
   */
  uploadPath?: string;

  /**
   * Maximum photo size in bytes
   * @default 5MB
   */
  maxPhotoSize?: number;

  /**
   * Maximum document size in bytes
   * @default 10MB
   */
  maxDocumentSize?: number;

  /**
   * Allowed MIME types for file uploads
   * @default ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
   */
  allowedMimeTypes?: string[];

  /**
   * Whether to generate unique filenames
   * @default true
   */
  generateUniqueFilenames?: boolean;

  /**
   * Whether to preserve the original filename
   * @default false
   */
  preserveOriginalFilename?: boolean;

  /**
   * File naming strategy
   * - 'uuid': Generate a UUID for the filename
   * - 'timestamp': Use a timestamp for the filename
   * - 'hash': Generate a hash of the file content
   * - 'original': Use the original filename (not recommended for production)
   * @default 'uuid'
   */
  filenameStrategy?: 'uuid' | 'timestamp' | 'hash' | 'original';

  /**
   * Whether to create subdirectories based on file type
   * @default true
   */
  useSubdirectories?: boolean;

  /**
   * Subdirectory structure template
   * Available placeholders: 
   * - :year - Current year (e.g., 2023)
   * - :month - Current month (01-12)
   * - :day - Current day (01-31)
   * - :type - File type (e.g., 'images', 'documents')
   * @default ':year/:month/:day'
   */
  subdirectoryTemplate?: string;

  /**
   * File type categories for subdirectories
   * @default {
   *   'image/': 'images',
   *   'application/pdf': 'documents',
   *   'application/msword': 'documents',
   *   'application/vnd.openxmlformats': 'documents',
   *   'default': 'others'
   * }
   */
  fileTypeCategories?: Record<string, string>;

  /**
   * Whether to use a CDN for file serving
   * @default false
   */
  useCdn?: boolean;

  /**
   * CDN base URL (if useCdn is true)
   */
  cdnBaseUrl?: string;

  /**
   * Whether to enable file compression
   * @default false
   */
  enableCompression?: boolean;

  /**
   * Compression quality (0-100)
   * @default 80
   */
  compressionQuality?: number;

  /**
   * Whether to generate thumbnails for images
   * @default false
   */
  generateThumbnails?: boolean;

  /**
   * Thumbnail dimensions
   * @default { width: 200, height: 200 }
   */
  thumbnailSize?: {
    width: number;
    height: number;
  };

  /**
   * Whether to enable file encryption at rest
   * @default false
   */
  enableEncryption?: boolean;

  /**
   * Encryption key (required if enableEncryption is true)
   */
  encryptionKey?: string;

  /**
   * Whether to enable file versioning
   * @default false
   */
  enableVersioning?: boolean;

  /**
   * Maximum number of versions to keep
   * @default 5
   */
  maxVersions?: number;

  /**
   * Custom storage provider
   * If provided, this will override the default file system storage
   */
  storageProvider?: {
    /**
     * Save file to storage
     * @param file File data
     * @param path Destination path
     * @param options Additional options
     */
    save: (
      file: Buffer | NodeJS.ReadableStream,
      path: string,
      options?: Record<string, any>
    ) => Promise<{ path: string; url: string }>;

    /**
     * Get file from storage
     * @param path File path
     */
    get: (path: string) => Promise<Buffer | NodeJS.ReadableStream>;

    /**
     * Delete file from storage
     * @param path File path
     */
    delete: (path: string) => Promise<void>;

    /**
     * Check if file exists
     * @param path File path
     */
    exists: (path: string) => Promise<boolean>;

    /**
     * Get file URL
     * @param path File path
     */
    getUrl: (path: string) => Promise<string>;
  };
}
