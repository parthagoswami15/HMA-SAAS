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
exports.UpdatePatientDocumentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const document_type_enum_1 = require("../enums/document-type.enum");
class UpdatePatientDocumentDto {
    documentType;
    description;
    issueDate;
    expiryDate;
}
exports.UpdatePatientDocumentDto = UpdatePatientDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of the document',
        enum: document_type_enum_1.DocumentType,
        example: document_type_enum_1.DocumentType.REPORT,
        required: false
    }),
    (0, class_validator_1.IsEnum)(document_type_enum_1.DocumentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePatientDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional description for the document',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePatientDocumentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the document was issued',
        required: false,
        example: '2023-01-01'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePatientDocumentDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expiration date of the document if applicable',
        required: false,
        example: '2024-01-01'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePatientDocumentDto.prototype, "expiryDate", void 0);
//# sourceMappingURL=update-patient-document.dto.js.map