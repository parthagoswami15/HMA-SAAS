/**
 * Token for injecting file storage options
 */
export const FILE_STORAGE_OPTIONS = 'FILE_STORAGE_OPTIONS';

/**
 * Default file storage options
 */
export const DEFAULT_FILE_STORAGE_OPTIONS = {
  uploadPath: './uploads',
  maxFileSize: 10 * 1024 * 1024, // 10MB
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
  enableCompression: false,
  compressionQuality: 80,
  generateThumbnails: false,
  thumbnailSize: {
    width: 200,
    height: 200,
  },
  enableEncryption: false,
  enableVersioning: false,
  maxVersions: 5,
} as const;
