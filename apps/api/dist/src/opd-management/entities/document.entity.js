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
exports.Document = exports.DocumentVersion = exports.DocumentMetadata = exports.DocumentStatus = exports.DocumentType = void 0;
const swagger_1 = require("@nestjs/swagger");
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
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["DRAFT"] = "DRAFT";
    DocumentStatus["FINAL"] = "FINAL";
    DocumentStatus["VERIFIED"] = "VERIFIED";
    DocumentStatus["AMENDED"] = "AMENDED";
    DocumentStatus["REJECTED"] = "REJECTED";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
class DocumentMetadata {
    title;
    description;
    author;
    dateCreated;
    keywords;
    custom;
}
exports.DocumentMetadata = DocumentMetadata;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document title', required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document description', required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document author name', required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document creation date', type: Date, required: false }),
    __metadata("design:type", Date)
], DocumentMetadata.prototype, "dateCreated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document keywords for search', type: [String], required: false }),
    __metadata("design:type", Array)
], DocumentMetadata.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Custom metadata fields', type: 'object', required: false }),
    __metadata("design:type", Object)
], DocumentMetadata.prototype, "custom", void 0);
class DocumentVersion {
    version;
    fileUrl;
    mimeType;
    size;
    createdAt;
    createdById;
    notes;
    checksum;
}
exports.DocumentVersion = DocumentVersion;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Version number' }),
    __metadata("design:type", Number)
], DocumentVersion.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File URL or path' }),
    __metadata("design:type", String)
], DocumentVersion.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File MIME type' }),
    __metadata("design:type", String)
], DocumentVersion.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    __metadata("design:type", Number)
], DocumentVersion.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Version creation date', type: Date }),
    __metadata("design:type", Date)
], DocumentVersion.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID who created this version' }),
    __metadata("design:type", String)
], DocumentVersion.prototype, "createdById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Version notes', required: false }),
    __metadata("design:type", String)
], DocumentVersion.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Checksum/hash of the file content', required: false }),
    __metadata("design:type", String)
], DocumentVersion.prototype, "checksum", void 0);
class Document {
    id;
    type;
    status;
    patientId;
    visitId;
    encounterId;
    filename;
    metadata;
    currentVersion;
    versions;
    createdAt;
    updatedAt;
    deletedAt;
    createdById;
    updatedById;
}
exports.Document = Document;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the document' }),
    __metadata("design:type", String)
], Document.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document type' }),
    __metadata("design:type", String)
], Document.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DocumentStatus, default: DocumentStatus.DRAFT }),
    __metadata("design:type", String)
], Document.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID this document belongs to' }),
    __metadata("design:type", String)
], Document.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit ID this document is associated with', required: false }),
    __metadata("design:type", String)
], Document.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Encounter ID this document is associated with', required: false }),
    __metadata("design:type", String)
], Document.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original filename' }),
    __metadata("design:type", String)
], Document.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Document metadata', type: DocumentMetadata }),
    __metadata("design:type", DocumentMetadata)
], Document.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current version of the document', type: DocumentVersion }),
    __metadata("design:type", DocumentVersion)
], Document.prototype, "currentVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DocumentVersion], description: 'Document version history', required: false }),
    __metadata("design:type", Array)
], Document.prototype, "versions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the document was created', type: Date }),
    __metadata("design:type", Date)
], Document.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the document was last updated', type: Date }),
    __metadata("design:type", Date)
], Document.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the document was deleted', type: Date, required: false }),
    __metadata("design:type", Date)
], Document.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID who created the document' }),
    __metadata("design:type", String)
], Document.prototype, "createdById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID who last updated the document', required: false }),
    __metadata("design:type", String)
], Document.prototype, "updatedById", void 0);
//# sourceMappingURL=document.entity.js.map