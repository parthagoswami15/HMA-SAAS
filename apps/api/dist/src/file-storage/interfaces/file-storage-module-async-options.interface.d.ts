import { ModuleMetadata, Type } from '@nestjs/common';
import { FileStorageOptions } from './file-storage-options.interface';
export interface FileStorageModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<FileStorageOptionsFactory>;
    useClass?: Type<FileStorageOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<FileStorageOptions> | FileStorageOptions;
    inject?: any[];
}
