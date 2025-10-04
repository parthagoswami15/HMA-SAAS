import { FileStorageOptions } from './file-storage-options.interface';

export interface FileStorageOptionsFactory {
  /**
   * Creates FileStorageOptions
   */
  createFileStorageOptions(): Promise<FileStorageOptions> | FileStorageOptions;
}
