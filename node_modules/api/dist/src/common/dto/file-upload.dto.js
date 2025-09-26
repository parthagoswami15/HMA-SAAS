"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadOptions = exports.FileUploadResponseDto = exports.FileUploadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FileUploadDto {
    file;
}
exports.FileUploadDto = FileUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], FileUploadDto.prototype, "file", void 0);
class FileUploadResponseDto {
    id;
    fileName;
    fileType;
    fileSize;
    url;
    documentType;
    uploadedAt;
    metadata;
}
exports.FileUploadResponseDto = FileUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the uploaded file' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original file name' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File MIME type' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    __metadata("design:type", Number)
], FileUploadResponseDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to access the uploaded file' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document type (if applicable)' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Upload timestamp' }),
    __metadata("design:type", Date)
], FileUploadResponseDto.prototype, "uploadedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File metadata' }),
    __metadata("design:type", Object)
], FileUploadResponseDto.prototype, "metadata", void 0);
class FileUploadOptions {
    fieldName;
    destination;
    allowedMimeTypes;
    maxFileSize;
    fileFilter;
}
exports.FileUploadOptions = FileUploadOptions;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FileUploadOptions.prototype, "fieldName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FileUploadOptions.prototype, "destination", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FileUploadOptions.prototype, "allowedMimeTypes", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FileUploadOptions.prototype, "maxFileSize", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FileUploadOptions.prototype, "fileFilter", void 0);
//# sourceMappingURL=file-upload.dto.js.map