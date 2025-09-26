import { FileStorageOptions } from './file-storage-options.interface';
export interface FileStorageOptionsFactory {
    createFileStorageOptions(): Promise<FileStorageOptions> | FileStorageOptions;
}
