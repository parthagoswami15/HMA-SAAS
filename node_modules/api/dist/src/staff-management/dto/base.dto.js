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
exports.BasePermissionDto = exports.BaseStaffSpecialtyDto = exports.BaseSpecialtyDto = exports.BaseRoleDto = exports.BaseUserDto = exports.BaseStaffDto = exports.BaseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../enums");
class BaseDto {
    id;
    tenantId;
    createdAt;
    updatedAt;
    deletedAt;
}
exports.BaseDto = BaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the record' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BaseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BaseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created at timestamp' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], BaseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated at timestamp' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], BaseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deleted at timestamp', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], BaseDto.prototype, "deletedAt", void 0);
class BaseStaffDto {
    employeeId;
    type;
    status;
    departmentId;
    designation;
    joiningDate;
    qualifications;
    bio;
    isActive;
}
exports.BaseStaffDto = BaseStaffDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff type', enum: enums_1.StaffType }),
    (0, class_validator_1.IsEnum)(enums_1.StaffType),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff status', enum: enums_1.StaffStatus }),
    (0, class_validator_1.IsEnum)(enums_1.StaffStatus),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID', required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff designation/position' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of joining' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], BaseStaffDto.prototype, "joiningDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of qualifications', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BaseStaffDto.prototype, "qualifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Biography or description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseStaffDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the staff is active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BaseStaffDto.prototype, "isActive", void 0);
class BaseUserDto {
    firstName;
    lastName;
    email;
    phone;
}
exports.BaseUserDto = BaseUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "phone", void 0);
class BaseRoleDto {
    name;
    description;
    isSystem;
    isActive;
}
exports.BaseRoleDto = BaseRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseRoleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is a system role', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BaseRoleDto.prototype, "isSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the role is active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BaseRoleDto.prototype, "isActive", void 0);
class BaseSpecialtyDto {
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
exports.BaseSpecialtyDto = BaseSpecialtyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseSpecialtyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty code', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseSpecialtyDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseSpecialtyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty category', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseSpecialtyDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the specialty is active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BaseSpecialtyDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Color code for UI display', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseSpecialtyDto.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Icon name or URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseSpecialtyDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Display order', default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BaseSpecialtyDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether certification is required', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BaseSpecialtyDto.prototype, "requiresCertification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum years of experience required', default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BaseSpecialtyDto.prototype, "minYearsExperience", void 0);
class BaseStaffSpecialtyDto {
    specialtyId;
    isPrimary;
    experience;
    notes;
    startDate;
    certificationNumber;
    certificationExpiryDate;
}
exports.BaseStaffSpecialtyDto = BaseStaffSpecialtyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BaseStaffSpecialtyDto.prototype, "specialtyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is the primary specialty', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BaseStaffSpecialtyDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Years of experience in this specialty', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BaseStaffSpecialtyDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseStaffSpecialtyDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date in this specialty', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], BaseStaffSpecialtyDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certification number', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseStaffSpecialtyDto.prototype, "certificationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certification expiry date', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], BaseStaffSpecialtyDto.prototype, "certificationExpiryDate", void 0);
class BasePermissionDto {
    key;
    name;
    description;
    module;
    isActive;
}
exports.BasePermissionDto = BasePermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Permission key (e.g., user:create)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BasePermissionDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Permission name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BasePermissionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Permission description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BasePermissionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Module this permission belongs to' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BasePermissionDto.prototype, "module", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the permission is active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BasePermissionDto.prototype, "isActive", void 0);
//# sourceMappingURL=base.dto.js.map