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
exports.PatientDocumentQueryDto = exports.UpdatePatientDocumentDto = exports.CreatePatientDocumentDto = exports.PatientDocumentDto = exports.ALLOWED_DOCUMENT_TYPES = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
exports.ALLOWED_DOCUMENT_TYPES = [
    'ID_PROOF',
    'ADDRESS_PROOF',
    'MEDICAL_REPORT',
    'PRESCRIPTION',
    'INSURANCE',
    'LETTER',
    'REFERRAL',
    'CONSENT_FORM',
    'OTHER'
];
class PatientDocumentDto {
    id;
    patientId;
    documentType;
    fileName;
    fileType;
    fileSize;
    filePath;
    fileUrl;
    notes;
    issueDate;
    expiryDate;
    uploadedBy;
    tenantId;
    createdAt;
    updatedAt;
}
exports.PatientDocumentDto = PatientDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document ID' }),
    __metadata("design:type", String)
], PatientDocumentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID' }),
    __metadata("design:type", String)
], PatientDocumentDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of document',
        enum: exports.ALLOWED_DOCUMENT_TYPES,
        example: 'ID_PROOF'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(exports.ALLOWED_DOCUMENT_TYPES),
    __metadata("design:type", String)
], PatientDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original file name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PatientDocumentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File MIME type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PatientDocumentDto.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PatientDocumentDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File storage path' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PatientDocumentDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Public URL to access the file' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PatientDocumentDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes about the document' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientDocumentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document issue date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], PatientDocumentDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document expiration date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], PatientDocumentDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the user who uploaded the document' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PatientDocumentDto.prototype, "uploadedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PatientDocumentDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], PatientDocumentDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], PatientDocumentDto.prototype, "updatedAt", void 0);
class CreatePatientDocumentDto {
    documentType;
    notes;
    issueDate;
    expiryDate;
}
exports.CreatePatientDocumentDto = CreatePatientDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of document',
        enum: exports.ALLOWED_DOCUMENT_TYPES,
        example: 'ID_PROOF'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(exports.ALLOWED_DOCUMENT_TYPES),
    __metadata("design:type", String)
], CreatePatientDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes about the document' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDocumentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document issue date (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreatePatientDocumentDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document expiration date (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreatePatientDocumentDto.prototype, "expiryDate", void 0);
class UpdatePatientDocumentDto {
    documentType;
    notes;
    issueDate;
    expiryDate;
}
exports.UpdatePatientDocumentDto = UpdatePatientDocumentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of document',
        enum: exports.ALLOWED_DOCUMENT_TYPES
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(exports.ALLOWED_DOCUMENT_TYPES),
    __metadata("design:type", String)
], UpdatePatientDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes about the document' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePatientDocumentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document issue date (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdatePatientDocumentDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document expiration date (ISO 8601 format)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdatePatientDocumentDto.prototype, "expiryDate", void 0);
class PatientDocumentQueryDto {
    documentType;
    startDate;
    endDate;
    search;
    page = 1;
    limit = 10;
}
exports.PatientDocumentQueryDto = PatientDocumentQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by document type',
        enum: exports.ALLOWED_DOCUMENT_TYPES
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(exports.ALLOWED_DOCUMENT_TYPES),
    __metadata("design:type", String)
], PatientDocumentQueryDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by upload date range (start date in ISO 8601 format)'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientDocumentQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by upload date range (end date in ISO 8601 format)'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientDocumentQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search term to filter by file name or notes',
        example: 'passport'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientDocumentQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        minimum: 1,
        default: 1
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PatientDocumentQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        minimum: 1,
        maximum: 100,
        default: 10
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PatientDocumentQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=patient-document.dto.js.map