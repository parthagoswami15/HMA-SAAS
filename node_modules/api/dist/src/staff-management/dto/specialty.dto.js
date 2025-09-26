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
exports.SpecialtyResponseDto = exports.UpdateStaffSpecialtyDto = exports.StaffSpecialtyDto = exports.SpecialtyQueryDto = exports.UpdateSpecialtyDto = exports.CreateSpecialtyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSpecialtyDto {
    name;
    code;
    description;
    category;
    isActive = true;
    colorCode;
    icon;
    displayOrder = 0;
    requiresCertification = false;
    minYearsExperience;
}
exports.CreateSpecialtyDto = CreateSpecialtyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specialty name',
        example: 'Cardiology'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSpecialtyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specialty code (must be unique within tenant)',
        example: 'CARD'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpecialtyDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the specialty',
        example: 'Specializes in the diagnosis and treatment of heart conditions.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpecialtyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category of the specialty',
        example: 'Medical'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpecialtyDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the specialty is active',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateSpecialtyDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Color code for the specialty (e.g., #FF5733)',
        example: '#FF5733'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpecialtyDto.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Icon name or class for the specialty',
        example: 'heart-pulse'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpecialtyDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Order in which the specialty should be displayed',
        example: 1
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSpecialtyDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this specialty requires board certification',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateSpecialtyDto.prototype, "requiresCertification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum years of experience required for this specialty',
        example: 3
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSpecialtyDto.prototype, "minYearsExperience", void 0);
class UpdateSpecialtyDto {
    name;
    code;
    description;
    category;
    isActive;
    colorCode;
    icon;
    displayOrder;
    requiresCertification;
    minYearsExperience;
}
exports.UpdateSpecialtyDto = UpdateSpecialtyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specialty name',
        example: 'Cardiology'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSpecialtyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specialty code (must be unique within tenant)',
        example: 'CARD'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSpecialtyDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the specialty',
        example: 'Specializes in the diagnosis and treatment of heart conditions.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSpecialtyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category of the specialty',
        example: 'Medical'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSpecialtyDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the specialty is active',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSpecialtyDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Color code for the specialty (e.g., #FF5733)',
        example: '#FF5733'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSpecialtyDto.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Icon name or class for the specialty',
        example: 'heart-pulse'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSpecialtyDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Order in which the specialty should be displayed',
        example: 1
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSpecialtyDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this specialty requires board certification',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSpecialtyDto.prototype, "requiresCertification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum years of experience required for this specialty',
        example: 3
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSpecialtyDto.prototype, "minYearsExperience", void 0);
class SpecialtyQueryDto {
    search;
    category;
    isActive = true;
    includeStaffCount = false;
    page = 1;
    limit = 10;
    sortBy = 'name';
    sortOrder = 'asc';
}
exports.SpecialtyQueryDto = SpecialtyQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search term for specialty name or code',
        example: 'cardio'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SpecialtyQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by category',
        example: 'Medical'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SpecialtyQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active status',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SpecialtyQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include staff count for each specialty',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SpecialtyQueryDto.prototype, "includeStaffCount", void 0);
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
], SpecialtyQueryDto.prototype, "page", void 0);
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
], SpecialtyQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        enum: ['name', 'code', 'category', 'displayOrder'],
        default: 'name'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SpecialtyQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        default: 'asc'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SpecialtyQueryDto.prototype, "sortOrder", void 0);
class StaffSpecialtyDto {
    specialtyId;
    isPrimary = false;
    yearsExperience;
    startDate;
    certificationNumber;
    certificationExpiryDate;
    notes;
}
exports.StaffSpecialtyDto = StaffSpecialtyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specialty ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StaffSpecialtyDto.prototype, "specialtyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is the primary specialty',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffSpecialtyDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Years of experience in this specialty',
        example: 5
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StaffSpecialtyDto.prototype, "yearsExperience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when the staff member started practicing this specialty',
        example: '2018-01-01'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffSpecialtyDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Board certification number',
        example: 'BC123456'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffSpecialtyDto.prototype, "certificationNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Board certification expiry date',
        example: '2025-12-31'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffSpecialtyDto.prototype, "certificationExpiryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about this specialty assignment'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffSpecialtyDto.prototype, "notes", void 0);
class UpdateStaffSpecialtyDto extends StaffSpecialtyDto {
    remove = false;
}
exports.UpdateStaffSpecialtyDto = UpdateStaffSpecialtyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to remove this specialty from the staff member',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateStaffSpecialtyDto.prototype, "remove", void 0);
class SpecialtyResponseDto {
    id;
    tenantId;
    name;
    code;
    description;
    category;
    isActive;
    colorCode;
    icon;
    displayOrder;
    requiresCertification;
    minYearsExperience;
    staffCount;
    createdAt;
    updatedAt;
}
exports.SpecialtyResponseDto = SpecialtyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty ID' }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant ID' }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty name' }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specialty code' }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specialty description' }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specialty category' }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the specialty is active',
        default: true
    }),
    __metadata("design:type", Boolean)
], SpecialtyResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Color code for the specialty',
        example: '#FF5733'
    }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Icon name or class for the specialty',
        example: 'heart-pulse'
    }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display order',
        default: 0
    }),
    __metadata("design:type", Number)
], SpecialtyResponseDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this specialty requires board certification',
        default: false
    }),
    __metadata("design:type", Boolean)
], SpecialtyResponseDto.prototype, "requiresCertification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum years of experience required',
        default: 0
    }),
    __metadata("design:type", Number)
], SpecialtyResponseDto.prototype, "minYearsExperience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of staff members with this specialty',
        default: 0
    }),
    __metadata("design:type", Number)
], SpecialtyResponseDto.prototype, "staffCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        type: 'string',
        format: 'date-time'
    }),
    __metadata("design:type", Date)
], SpecialtyResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        type: 'string',
        format: 'date-time'
    }),
    __metadata("design:type", Date)
], SpecialtyResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=specialty.dto.js.map