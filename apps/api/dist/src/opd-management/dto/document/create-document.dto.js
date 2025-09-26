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
exports.CreateDocumentDto = exports.DocumentMetadataDto = exports.DocumentType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var DocumentType;
(function (DocumentType) {
    DocumentType["PRESCRIPTION"] = "PRESCRIPTION";
    DocumentType["LAB_REPORT"] = "LAB_REPORT";
    DocumentType["RADIOLOGY_REPORT"] = "RADIOLOGY_REPORT";
    DocumentType["DISCHARGE_SUMMARY"] = "DISCHARGE_SUMMARY";
    DocumentType["REFERRAL_LETTER"] = "REFERRAL_LETTER";
    DocumentType["MEDICAL_CERTIFICATE"] = "MEDICAL_CERTIFICATE";
    DocumentType["CONSENT_FORM"] = "CONSENT_FORM";
    DocumentType["ID_PROOF"] = "ID_PROOF";
    DocumentType["INSURANCE"] = "INSURANCE";
    DocumentType["OTHER"] = "OTHER";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
class DocumentMetadataDto {
    title;
    description;
    author;
    dateCreated;
    keywords;
    custom;
}
exports.DocumentMetadataDto = DocumentMetadataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DocumentMetadataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DocumentMetadataDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document author name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DocumentMetadataDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Document creation date', type: Date }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], DocumentMetadataDto.prototype, "dateCreated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Document keywords for search',
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DocumentMetadataDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom metadata fields',
        type: 'object'
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DocumentMetadataDto.prototype, "custom", void 0);
class CreateDocumentDto {
    type;
    patientId;
    filename;
    mimeType;
    size;
    checksum;
    metadata;
    visitId;
    encounterId;
    notes;
}
exports.CreateDocumentDto = CreateDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: DocumentType,
        description: 'Type of document'
    }),
    (0, class_validator_1.IsEnum)(DocumentType),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID this document belongs to' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original filename',
        example: 'lab-report-2023.pdf'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File MIME type',
        example: 'application/pdf'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File size in bytes',
        example: 1024
    }),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateDocumentDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Checksum/hash of the file content',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "checksum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: DocumentMetadataDto,
        description: 'Document metadata'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", DocumentMetadataDto)
], CreateDocumentDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Visit ID this document is associated with'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Encounter ID this document is associated with'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the document'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "notes", void 0);
//# sourceMappingURL=create-document.dto.js.map