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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
let TenantResponseDto = class TenantResponseDto {
    id;
    name;
    slug;
    type;
    address;
    phone;
    email;
    logo;
    isActive;
    createdAt;
    updatedAt;
    deletedAt;
    constructor(partial) {
        Object.assign(this, partial);
        this.createdAt = partial.createdAt ? new Date(partial.createdAt) : new Date();
        this.updatedAt = partial.updatedAt ? new Date(partial.updatedAt) : new Date();
        this.deletedAt = partial.deletedAt ? new Date(partial.deletedAt) : null;
        this.address = partial.address ?? null;
        this.phone = partial.phone ?? null;
        this.email = partial.email ?? null;
        this.logo = partial.logo ?? null;
    }
};
exports.TenantResponseDto = TenantResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Unique identifier for the tenant',
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'City General Hospital',
        description: 'Name of the tenant',
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'city-general',
        description: 'URL-friendly identifier for the tenant',
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.TenantType,
        example: client_1.TenantType.HOSPITAL,
        description: 'Type of healthcare facility',
    }),
    __metadata("design:type", typeof (_a = typeof client_1.TenantType !== "undefined" && client_1.TenantType) === "function" ? _a : Object)
], TenantResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123 Main St, City',
        description: 'Physical address of the facility',
        nullable: true,
    }),
    __metadata("design:type", Object)
], TenantResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+1234567890',
        description: 'Contact phone number',
        nullable: true,
    }),
    __metadata("design:type", Object)
], TenantResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'contact@hospital.com',
        description: 'Contact email address',
        nullable: true,
    }),
    __metadata("design:type", Object)
], TenantResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://example.com/logo.png',
        description: 'URL to the tenant\'s logo',
        nullable: true,
    }),
    __metadata("design:type", Object)
], TenantResponseDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the tenant is active',
        default: true,
    }),
    __metadata("design:type", Boolean)
], TenantResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the tenant was created',
        type: 'string',
        format: 'date-time',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toISOString()),
    __metadata("design:type", Date)
], TenantResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the tenant was last updated',
        type: 'string',
        format: 'date-time',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toISOString()),
    __metadata("design:type", Date)
], TenantResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'When the tenant was soft deleted',
        type: 'string',
        format: 'date-time',
        nullable: true,
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toISOString()),
    __metadata("design:type", Object)
], TenantResponseDto.prototype, "deletedAt", void 0);
exports.TenantResponseDto = TenantResponseDto = __decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:paramtypes", [Object])
], TenantResponseDto);
//# sourceMappingURL=tenant-response.dto.js.map