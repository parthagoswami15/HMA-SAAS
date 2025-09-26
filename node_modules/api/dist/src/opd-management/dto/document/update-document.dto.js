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
exports.UpdateDocumentDto = exports.DocumentStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_document_dto_1 = require("./create-document.dto");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["DRAFT"] = "DRAFT";
    DocumentStatus["FINAL"] = "FINAL";
    DocumentStatus["VERIFIED"] = "VERIFIED";
    DocumentStatus["AMENDED"] = "AMENDED";
    DocumentStatus["REJECTED"] = "REJECTED";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
class UpdateDocumentDto extends (0, swagger_1.PartialType)(create_document_dto_1.CreateDocumentDto) {
    status;
    verifiedAt;
    verifiedById;
    rejectionReason;
    rejectedAt;
    rejectedById;
    version;
    parentDocumentId;
    versionReason;
}
exports.UpdateDocumentDto = UpdateDocumentDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        enum: DocumentStatus,
        description: 'Status of the document',
    }),
    (0, class_validator_1.IsEnum)(DocumentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date and time when the document was verified',
        type: Date,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateDocumentDto.prototype, "verifiedAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the staff who verified the document',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "verifiedById", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Reason for rejection if applicable',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date and time when the document was rejected',
        type: Date,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateDocumentDto.prototype, "rejectedAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the staff who rejected the document',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "rejectedById", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Version number of the document',
        minimum: 1,
    }),
    IsNumber(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDocumentDto.prototype, "version", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the parent document if this is a new version',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "parentDocumentId", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Reason for creating a new version',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "versionReason", void 0);
//# sourceMappingURL=update-document.dto.js.map