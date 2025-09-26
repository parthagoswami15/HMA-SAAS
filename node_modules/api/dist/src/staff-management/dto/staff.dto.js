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
exports.UpdateStaffSpecialtyDto = exports.CreateStaffSpecialtyDto = exports.StaffCountResponseDto = exports.RecentStaffResponseDto = exports.StaffListResponseDto = exports.StaffResponseDto = exports.StaffSpecialtyResponseDto = exports.SpecialtyResponseDto = exports.RoleResponseDto = exports.DepartmentResponseDto = exports.UserResponseDto = exports.StaffFilterDto = exports.UpdateStaffDto = exports.CreateStaffDto = exports.CreateStaffUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../enums");
class CreateStaffUserDto {
    firstName;
    lastName;
    email;
    phone;
    password;
    sendWelcomeEmail = true;
}
exports.CreateStaffUserDto = CreateStaffUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateStaffUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateStaffUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateStaffUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', required: false }),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Temporary password (will be hashed)', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether to send welcome email', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateStaffUserDto.prototype, "sendWelcomeEmail", void 0);
class CreateStaffDto {
    employeeId;
    type;
    status = enums_1.StaffStatus.ACTIVE;
    departmentId;
    designation;
    joiningDate;
    qualifications = [];
    bio;
    isActive = true;
    user;
    roleIds = [];
    specialties = [];
}
exports.CreateStaffDto = CreateStaffDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff type', enum: enums_1.StaffType }),
    (0, class_validator_1.IsEnum)(enums_1.StaffType),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff status', enum: enums_1.StaffStatus, default: enums_1.StaffStatus.ACTIVE }),
    (0, class_validator_1.IsEnum)(enums_1.StaffStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID', required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff designation/position' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of joining' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateStaffDto.prototype, "joiningDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of qualifications', type: [String], default: [] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "qualifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Biography or description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the staff is active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateStaffDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User account details' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateStaffUserDto),
    __metadata("design:type", CreateStaffUserDto)
], CreateStaffDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of role IDs to assign to the staff', type: [String], default: [] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "roleIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of specialties with details',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                specialtyId: { type: 'string', format: 'uuid' },
                isPrimary: { type: 'boolean', default: false },
                experience: { type: 'number', minimum: 0, required: false },
                notes: { type: 'string', required: false },
                startDate: { type: 'string', format: 'date-time', required: false },
                certificationNumber: { type: 'string', required: false },
                certificationExpiryDate: { type: 'string', format: 'date-time', required: false }
            }
        },
        default: []
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateStaffSpecialtyDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "specialties", void 0);
class UpdateStaffDto {
    employeeId;
    type;
    status;
    departmentId;
    designation;
    joiningDate;
    qualifications;
    bio;
    isActive;
    roleIds;
    specialties;
}
exports.UpdateStaffDto = UpdateStaffDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff type', enum: enums_1.StaffType, required: false }),
    (0, class_validator_1.IsEnum)(enums_1.StaffType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff status', enum: enums_1.StaffStatus, required: false }),
    (0, class_validator_1.IsEnum)(enums_1.StaffStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID', required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateStaffDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff designation/position', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of joining', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateStaffDto.prototype, "joiningDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of qualifications', type: [String], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStaffDto.prototype, "qualifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Biography or description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateStaffDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the staff is active', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateStaffDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of role IDs to assign to the staff', type: [String], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStaffDto.prototype, "roleIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of specialties with details',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                specialtyId: { type: 'string', format: 'uuid' },
                isPrimary: { type: 'boolean', default: false },
                experience: { type: 'number', minimum: 0, required: false },
                notes: { type: 'string', required: false },
                startDate: { type: 'string', format: 'date-time', required: false },
                certificationNumber: { type: 'string', required: false },
                certificationExpiryDate: { type: 'string', format: 'date-time', required: false },
                remove: { type: 'boolean', default: false }
            }
        },
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateStaffSpecialtyDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStaffDto.prototype, "specialties", void 0);
class StaffFilterDto {
    search;
    type;
    status;
    departmentId;
    specialtyId;
    isActive;
    page = 1;
    limit = 10;
    sortBy = 'createdAt';
    sortOrder = 'desc';
}
exports.StaffFilterDto = StaffFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search term (searches in name, email, employee ID)', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by staff type', enum: enums_1.StaffType, required: false }),
    (0, class_validator_1.IsEnum)(enums_1.StaffType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffFilterDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by staff status', enum: enums_1.StaffStatus, required: false }),
    (0, class_validator_1.IsEnum)(enums_1.StaffStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by department ID', required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffFilterDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by specialty ID', required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffFilterDto.prototype, "specialtyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by active status', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffFilterDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page number (1-based)', default: 1, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StaffFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page', default: 10, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StaffFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sort field',
        enum: ['firstName', 'lastName', 'email', 'employeeId', 'createdAt', 'updatedAt'],
        default: 'createdAt',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        default: 'desc',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffFilterDto.prototype, "sortOrder", void 0);
class UserResponseDto {
    id;
    firstName;
    lastName;
    email;
    phone;
    isActive;
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', required: false }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the user is active' }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
class DepartmentResponseDto {
    id;
    name;
    code;
}
exports.DepartmentResponseDto = DepartmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID' }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department name' }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department code', required: false }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "code", void 0);
class RoleResponseDto {
    id;
    name;
    isSystem;
}
exports.RoleResponseDto = RoleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role ID' }),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role name' }),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is a system role' }),
    __metadata("design:type", Boolean)
], RoleResponseDto.prototype, "isSystem", void 0);
class SpecialtyResponseDto {
    id;
    name;
    code;
}
exports.SpecialtyResponseDto = SpecialtyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty ID' }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty name' }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty code', required: false }),
    __metadata("design:type", String)
], SpecialtyResponseDto.prototype, "code", void 0);
class StaffSpecialtyResponseDto {
    id;
    isPrimary;
    experience;
    notes;
    startDate;
    certificationNumber;
    certificationExpiryDate;
    specialty;
}
exports.StaffSpecialtyResponseDto = StaffSpecialtyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff-specialty relationship ID' }),
    __metadata("design:type", String)
], StaffSpecialtyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is the primary specialty' }),
    __metadata("design:type", Boolean)
], StaffSpecialtyResponseDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Years of experience', required: false }),
    __metadata("design:type", Number)
], StaffSpecialtyResponseDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    __metadata("design:type", String)
], StaffSpecialtyResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date in this specialty', required: false }),
    __metadata("design:type", Date)
], StaffSpecialtyResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certification number', required: false }),
    __metadata("design:type", String)
], StaffSpecialtyResponseDto.prototype, "certificationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certification expiry date', required: false }),
    __metadata("design:type", Date)
], StaffSpecialtyResponseDto.prototype, "certificationExpiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty details' }),
    __metadata("design:type", SpecialtyResponseDto)
], StaffSpecialtyResponseDto.prototype, "specialty", void 0);
class StaffResponseDto {
    id;
    tenantId;
    employeeId;
    type;
    status;
    department;
    designation;
    joiningDate;
    qualifications;
    bio;
    isActive;
    createdAt;
    updatedAt;
    user;
    roles;
    specialties;
}
exports.StaffResponseDto = StaffResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant ID' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff type', enum: enums_1.StaffType }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff status', enum: enums_1.StaffStatus }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department details', required: false }),
    __metadata("design:type", DepartmentResponseDto)
], StaffResponseDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Designation/position' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of joining' }),
    __metadata("design:type", Date)
], StaffResponseDto.prototype, "joiningDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of qualifications', type: [String] }),
    __metadata("design:type", Array)
], StaffResponseDto.prototype, "qualifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Biography or description', required: false }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the staff is active' }),
    __metadata("design:type", Boolean)
], StaffResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created at timestamp' }),
    __metadata("design:type", Date)
], StaffResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated at timestamp' }),
    __metadata("design:type", Date)
], StaffResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User account details' }),
    __metadata("design:type", UserResponseDto)
], StaffResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assigned roles', type: [RoleResponseDto] }),
    __metadata("design:type", Array)
], StaffResponseDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff specialties', type: [StaffSpecialtyResponseDto] }),
    __metadata("design:type", Array)
], StaffResponseDto.prototype, "specialties", void 0);
class StaffListResponseDto {
    data;
    meta;
}
exports.StaffListResponseDto = StaffListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of staff members', type: [StaffResponseDto] }),
    __metadata("design:type", Array)
], StaffListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination metadata',
        type: 'object',
        properties: {
            total: { type: 'number', description: 'Total number of items' },
            page: { type: 'number', description: 'Current page number' },
            limit: { type: 'number', description: 'Number of items per page' },
            totalPages: { type: 'number', description: 'Total number of pages' }
        }
    }),
    __metadata("design:type", Object)
], StaffListResponseDto.prototype, "meta", void 0);
class RecentStaffResponseDto {
    id;
    employeeId;
    designation;
    joiningDate;
    user;
    department;
}
exports.RecentStaffResponseDto = RecentStaffResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID' }),
    __metadata("design:type", String)
], RecentStaffResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID' }),
    __metadata("design:type", String)
], RecentStaffResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Designation/position' }),
    __metadata("design:type", String)
], RecentStaffResponseDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of joining' }),
    __metadata("design:type", Date)
], RecentStaffResponseDto.prototype, "joiningDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User details' }),
    __metadata("design:type", Object)
], RecentStaffResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department details', required: false }),
    __metadata("design:type", Object)
], RecentStaffResponseDto.prototype, "department", void 0);
class StaffCountResponseDto {
    key;
    label;
    count;
    percentage;
}
exports.StaffCountResponseDto = StaffCountResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type or status of staff' }),
    __metadata("design:type", String)
], StaffCountResponseDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Display name for the type/status' }),
    __metadata("design:type", String)
], StaffCountResponseDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Count of staff in this category' }),
    __metadata("design:type", Number)
], StaffCountResponseDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Percentage of total staff', required: false }),
    __metadata("design:type", Number)
], StaffCountResponseDto.prototype, "percentage", void 0);
class CreateStaffSpecialtyDto {
    specialtyId;
    isPrimary = false;
    experience;
    notes;
    startDate;
    certificationNumber;
    certificationExpiryDate;
}
exports.CreateStaffSpecialtyDto = CreateStaffSpecialtyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStaffSpecialtyDto.prototype, "specialtyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is the primary specialty', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateStaffSpecialtyDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Years of experience in this specialty', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateStaffSpecialtyDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffSpecialtyDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date in this specialty', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateStaffSpecialtyDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certification number', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffSpecialtyDto.prototype, "certificationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certification expiry date', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateStaffSpecialtyDto.prototype, "certificationExpiryDate", void 0);
class UpdateStaffSpecialtyDto {
    isPrimary;
    experience;
    notes;
    startDate;
    certificationNumber;
    certificationExpiryDate;
    remove = false;
}
exports.UpdateStaffSpecialtyDto = UpdateStaffSpecialtyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is the primary specialty', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateStaffSpecialtyDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Years of experience in this specialty', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateStaffSpecialtyDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffSpecialtyDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date in this specialty', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateStaffSpecialtyDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certification number', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffSpecialtyDto.prototype, "certificationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certification expiry date', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateStaffSpecialtyDto.prototype, "certificationExpiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether to remove this specialty from the staff member', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateStaffSpecialtyDto.prototype, "remove", void 0);
//# sourceMappingURL=staff.dto.js.map