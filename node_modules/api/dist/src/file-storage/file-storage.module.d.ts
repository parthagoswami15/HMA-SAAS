import { DynamicModule } from '@nestjs/common';
import { FileStorageOptions, FileStorageModuleAsyncOptions } from './interfaces';
export declare class FileStorageModule {
    static forRoot(options: FileStorageOptions): DynamicModule;
    static forRootAsync(options: FileStorageModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
