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
exports.UpdateTenantDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_tenant_dto_1 = require("./create-tenant.dto");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class UpdateTenantDto extends (0, mapped_types_1.PartialType)(create_tenant_dto_1.CreateTenantDto) {
    deletedAt;
    name;
    slug;
    type;
    address;
    phone;
    logo;
    isActive;
}
exports.UpdateTenantDto = UpdateTenantDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The timestamp when the tenant was soft deleted',
        required: false,
        readOnly: true
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateTenantDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Updated Hospital Name',
        description: 'The updated name of the tenant',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'updated-hospital-name',
        description: 'The updated URL-friendly identifier',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.TenantType,
        example: client_1.TenantType.HOSPITAL,
        description: 'The updated type of healthcare facility',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TenantType),
    __metadata("design:type", typeof (_a = typeof client_1.TenantType !== "undefined" && client_1.TenantType) === "function" ? _a : Object)
], UpdateTenantDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '456 Updated St, City',
        description: 'Updated physical address',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+1987654321',
        description: 'Updated contact phone number',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'updated@hospital.com',
        description: 'Updated contact email',
        required: false
    }),
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/updated-logo.png',
        description: 'Updated URL to the tenant\'s logo',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the tenant is active',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-tenant.dto.js.map