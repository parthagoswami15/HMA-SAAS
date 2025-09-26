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
exports.CredentialQueryDto = exports.CredentialResponseDto = exports.VerifyCredentialDto = exports.UpdateCredentialDto = exports.CreateCredentialDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../enums");
class CreateCredentialDto {
    type;
    title;
    number;
    issuingAuthority;
    issueDate;
    expiryDate;
    documentUrl;
    notes;
}
exports.CreateCredentialDto = CreateCredentialDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of credential',
        enum: enums_1.CredentialType,
        example: enums_1.CredentialType.MEDICAL_LICENSE
    }),
    (0, class_validator_1.IsEnum)(enums_1.CredentialType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCredentialDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the credential (e.g., "Medical License", "Board Certification")',
        example: 'Medical License'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCredentialDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Credential/license number if applicable',
        example: 'MD123456'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCredentialDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the issuing authority',
        example: 'Medical Board of California'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCredentialDto.prototype, "issuingAuthority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the credential was issued',
        example: '2020-01-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCredentialDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expiration date of the credential if applicable',
        example: '2025-01-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCredentialDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL to the uploaded document',
        example: 'https://example.com/documents/license.pdf'
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCredentialDto.prototype, "documentUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the credential'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCredentialDto.prototype, "notes", void 0);
class UpdateCredentialDto {
    type;
    title;
    number;
    issuingAuthority;
    issueDate;
    expiryDate;
    documentUrl;
    status;
    notes;
}
exports.UpdateCredentialDto = UpdateCredentialDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of credential',
        enum: enums_1.CredentialType
    }),
    (0, class_validator_1.IsEnum)(enums_1.CredentialType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCredentialDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Title of the credential',
        example: 'Medical License'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCredentialDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Credential/license number',
        example: 'MD123456'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCredentialDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of the issuing authority',
        example: 'Medical Board of California'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCredentialDto.prototype, "issuingAuthority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when the credential was issued',
        example: '2020-01-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCredentialDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expiration date of the credential',
        example: '2025-01-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCredentialDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL to the uploaded document',
        example: 'https://example.com/documents/license.pdf'
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCredentialDto.prototype, "documentUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Status of the credential verification',
        enum: enums_1.CredentialStatus
    }),
    (0, class_validator_1.IsEnum)(enums_1.CredentialStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCredentialDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the credential'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCredentialDto.prototype, "notes", void 0);
class VerifyCredentialDto {
    status;
    notes;
}
exports.VerifyCredentialDto = VerifyCredentialDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Verification status',
        enum: [enums_1.CredentialStatus.VERIFIED, enums_1.CredentialStatus.REJECTED, enums_1.CredentialStatus.SUSPENDED]
    }),
    (0, class_validator_1.IsEnum)([enums_1.CredentialStatus.VERIFIED, enums_1.CredentialStatus.REJECTED, enums_1.CredentialStatus.SUSPENDED]),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyCredentialDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notes about the verification'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyCredentialDto.prototype, "notes", void 0);
class CredentialResponseDto {
    id;
    staffId;
    type;
    title;
    number;
    issuingAuthority;
    issueDate;
    expiryDate;
    status;
    documentUrl;
    verifiedBy;
    verifiedAt;
    notes;
    createdAt;
    updatedAt;
}
exports.CredentialResponseDto = CredentialResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Credential ID' }),
    __metadata("design:type", String)
], CredentialResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff member ID' }),
    __metadata("design:type", String)
], CredentialResponseDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of credential',
        enum: enums_1.CredentialType
    }),
    __metadata("design:type", String)
], CredentialResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the credential' }),
    __metadata("design:type", String)
], CredentialResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Credential/license number' }),
    __metadata("design:type", String)
], CredentialResponseDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Issuing authority' }),
    __metadata("design:type", String)
], CredentialResponseDto.prototype, "issuingAuthority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Issue date',
        type: 'string',
        format: 'date-time'
    }),
    __metadata("design:type", Date)
], CredentialResponseDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expiry date',
        type: 'string',
        format: 'date-time'
    }),
    __metadata("design:type", Date)
], CredentialResponseDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Verification status',
        enum: enums_1.CredentialStatus
    }),
    __metadata("design:type", String)
], CredentialResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL to the uploaded document',
        format: 'uri'
    }),
    __metadata("design:type", String)
], CredentialResponseDto.prototype, "documentUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the user who verified the credential'
    }),
    __metadata("design:type", String)
], CredentialResponseDto.prototype, "verifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Verification timestamp',
        type: 'string',
        format: 'date-time'
    }),
    __metadata("design:type", Date)
], CredentialResponseDto.prototype, "verifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    __metadata("design:type", String)
], CredentialResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        type: 'string',
        format: 'date-time'
    }),
    __metadata("design:type", Date)
], CredentialResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        type: 'string',
        format: 'date-time'
    }),
    __metadata("design:type", Date)
], CredentialResponseDto.prototype, "updatedAt", void 0);
class CredentialQueryDto {
    type;
    status;
    expirationStatus;
    expiresInDays = 30;
    page = 1;
    limit = 10;
}
exports.CredentialQueryDto = CredentialQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by credential type',
        enum: enums_1.CredentialType
    }),
    (0, class_validator_1.IsEnum)(enums_1.CredentialType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CredentialQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by verification status',
        enum: enums_1.CredentialStatus
    }),
    (0, class_validator_1.IsEnum)(enums_1.CredentialStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CredentialQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by expiration status',
        enum: ['expired', 'expiring_soon', 'valid'],
        example: 'expiring_soon'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CredentialQueryDto.prototype, "expirationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of days to consider as "expiring soon"',
        default: 30
    }),
    IsInt(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CredentialQueryDto.prototype, "expiresInDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        minimum: 1,
        default: 1
    }),
    IsInt(),
    Min(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CredentialQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        minimum: 1,
        maximum: 100,
        default: 10
    }),
    IsInt(),
    Min(1),
    Max(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CredentialQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=credential.dto.js.map