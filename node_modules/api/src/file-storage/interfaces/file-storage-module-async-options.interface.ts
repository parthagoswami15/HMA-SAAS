import { ModuleMetadata, Type } from '@nestjs/common';
import { FileStorageOptions } from './file-storage-options.interface';

export interface FileStorageModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Existing Provider to be used for FileStorage
   */
  useExisting?: Type<FileStorageOptionsFactory>;

  /**
   * Type of the factory that creates the FileStorageOptions
   */
  useClass?: Type<FileStorageOptionsFactory>;

  /**
   * Factory function that returns an instance of FileStorageOptions
   */
  useFactory?: (...args: any[]) => Promise<FileStorageOptions> | FileStorageOptions;

  /**
   * Dependencies to be injected into the factory function
   */
  inject?: any[];
}
