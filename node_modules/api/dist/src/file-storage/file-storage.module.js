"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FileStorageModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const file_storage_service_1 = require("./file-storage.service");
const file_storage_constants_1 = require("./file-storage.constants");
let FileStorageModule = FileStorageModule_1 = class FileStorageModule {
    static forRoot(options) {
        return {
            module: FileStorageModule_1,
            imports: [
                config_1.ConfigModule,
            ],
            providers: [
                {
                    provide: file_storage_constants_1.FILE_STORAGE_OPTIONS,
                    useValue: options,
                },
                file_storage_service_1.FileStorageService,
            ],
            exports: [file_storage_service_1.FileStorageService],
        };
    }
    static forRootAsync(options) {
        return {
            module: FileStorageModule_1,
            imports: [
                config_1.ConfigModule,
                ...(options.imports || []),
            ],
            providers: [
                ...this.createAsyncProviders(options),
                file_storage_service_1.FileStorageService,
            ],
            exports: [file_storage_service_1.FileStorageService],
        };
    }
    static createAsyncProviders(options) {
        if (options.useFactory || options.useExisting) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: file_storage_constants_1.FILE_STORAGE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: file_storage_constants_1.FILE_STORAGE_OPTIONS,
            useFactory: async (optionsFactory) => await optionsFactory.createFileStorageOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
};
exports.FileStorageModule = FileStorageModule;
exports.FileStorageModule = FileStorageModule = FileStorageModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], FileStorageModule);
//# sourceMappingURL=file-storage.module.js.map