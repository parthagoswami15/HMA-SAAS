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
exports.StaffSpecialtyDto = exports.CreateStaffDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../enums");
class CreateUserDto {
    firstName;
    lastName;
    email;
    phone;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name of the staff member' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name of the staff member' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address (must be unique)' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
class CreateStaffDto {
    employeeId;
    type;
    status = enums_1.StaffStatus.ACTIVE;
    joiningDate;
    departmentId;
    designation;
    qualifications = [];
    bio;
    isActive = true;
    user;
    roleIds = [];
    specialties = [];
}
exports.CreateStaffDto = CreateStaffDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID (must be unique within tenant)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of staff member',
        enum: enums_1.StaffType,
        example: enums_1.StaffType.DOCTOR
    }),
    (0, class_validator_1.IsEnum)(enums_1.StaffType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff status',
        enum: enums_1.StaffStatus,
        default: enums_1.StaffStatus.ACTIVE
    }),
    (0, class_validator_1.IsEnum)(enums_1.StaffStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of joining the organization' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateStaffDto.prototype, "joiningDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job title/designation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of qualifications',
        example: ['MBBS', 'MD']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "qualifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Professional biography' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the staff member is active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateStaffDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User account details' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateUserDto),
    __metadata("design:type", CreateUserDto)
], CreateStaffDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of role IDs to assign to the staff member',
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "roleIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of specialty IDs with additional details',
        required: false,
        type: 'array',
        items: {
            type: 'object',
            properties: {
                specialtyId: { type: 'string' },
                isPrimary: { type: 'boolean', default: false },
                experience: { type: 'number', nullable: true },
                notes: { type: 'string', nullable: true }
            }
        }
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StaffSpecialtyDto),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "specialties", void 0);
class StaffSpecialtyDto {
    specialtyId;
    isPrimary = false;
    experience;
    notes;
}
exports.StaffSpecialtyDto = StaffSpecialtyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specialty ID' }),
    (0, class_validator_1.IsString)(),
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
    (0, swagger_1.ApiProperty)({
        description: 'Years of experience in this specialty',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StaffSpecialtyDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about this specialty',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffSpecialtyDto.prototype, "notes", void 0);
//# sourceMappingURL=create-staff.dto.js.map