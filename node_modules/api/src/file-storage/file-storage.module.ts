import { Module, Global, DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileStorageService } from './file-storage.service';
import { FILE_STORAGE_OPTIONS } from './file-storage.constants';
import { FileStorageOptions, FileStorageModuleAsyncOptions, FileStorageOptionsFactory } from './interfaces';

@Global()
@Module({})
export class FileStorageModule {
  /**
   * Register module with synchronous options
   */
  static forRoot(options: FileStorageOptions): DynamicModule {
    return {
      module: FileStorageModule,
      imports: [
        ConfigModule, // For accessing environment variables
      ],
      providers: [
        {
          provide: FILE_STORAGE_OPTIONS,
          useValue: options,
        },
        FileStorageService,
      ],
      exports: [FileStorageService],
    };
  }

  /**
   * Register module with asynchronous options
   */
  static forRootAsync(options: FileStorageModuleAsyncOptions): DynamicModule {
    return {
      module: FileStorageModule,
      imports: [
        ConfigModule, // For accessing environment variables
        ...(options.imports || []),
      ],
      providers: [
        ...this.createAsyncProviders(options),
        FileStorageService,
      ],
      exports: [FileStorageService],
    };
  }

  private static createAsyncProviders(options: FileStorageModuleAsyncOptions): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProvider(options)];
    }

    // For useClass
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: FileStorageModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FILE_STORAGE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // For useExisting or useClass
    return {
      provide: FILE_STORAGE_OPTIONS,
      useFactory: async (optionsFactory: FileStorageOptionsFactory) =>
        await optionsFactory.createFileStorageOptions(),
      inject: [options.useExisting || options.useClass!],
    };
  }
}
