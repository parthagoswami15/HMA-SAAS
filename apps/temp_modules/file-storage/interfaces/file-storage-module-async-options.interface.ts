import { Type } from '@nestjs/common';

export interface FileStorageOptionsFactory {
  createFileStorageOptions(): Promise<any> | any;
}

export interface FileStorageModuleAsyncOptions {
  imports?: any[];
  useExisting?: Type<FileStorageOptionsFactory>;
  useClass?: Type<FileStorageOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<any> | any;
  inject?: any[];
}