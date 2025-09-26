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
exports.DepartmentResponseDto = exports.DepartmentQueryDto = exports.UpdateDepartmentDto = exports.CreateDepartmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDepartmentDto {
    name;
    code;
    description;
    headStaffId;
    parentDepartmentId;
    isActive = true;
    colorCode;
    contactEmail;
    contactPhone;
    location;
}
exports.CreateDepartmentDto = CreateDepartmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Department name',
        example: 'Cardiology'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department code (must be unique within tenant)',
        example: 'CARD'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the department',
        example: 'Cardiology department handles heart-related conditions and treatments.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the department head (staff member)',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "headStaffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the parent department (for hierarchical structures)',
        example: '550e8400-e29b-41d4-a716-446655440001'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "parentDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the department is active',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDepartmentDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Color code for the department (e.g., #FF5733)',
        example: '#FF5733'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department contact email',
        example: 'cardiology@hospital.com'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department contact phone number',
        example: '+1234567890'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Physical location of the department',
        example: 'Building A, 2nd Floor, Wing C'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "location", void 0);
class UpdateDepartmentDto {
    name;
    code;
    description;
    headStaffId;
    parentDepartmentId;
    isActive;
    colorCode;
    contactEmail;
    contactPhone;
    location;
}
exports.UpdateDepartmentDto = UpdateDepartmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department name',
        example: 'Cardiology'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department code (must be unique within tenant)',
        example: 'CARD'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the department',
        example: 'Cardiology department handles heart-related conditions and treatments.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the department head (staff member)',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDepartmentDto.prototype, "headStaffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the parent department (for hierarchical structures)',
        example: '550e8400-e29b-41d4-a716-446655440001'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDepartmentDto.prototype, "parentDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the department is active',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDepartmentDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Color code for the department (e.g., #FF5733)',
        example: '#FF5733'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department contact email',
        example: 'cardiology@hospital.com'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department contact phone number',
        example: '+1234567890'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Physical location of the department',
        example: 'Building A, 2nd Floor, Wing C'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "location", void 0);
class DepartmentQueryDto {
    search;
    isActive = true;
    parentDepartmentId;
    includeChildren = false;
    includeStaffCount = false;
    page = 1;
    limit = 10;
    sortBy = 'name';
    sortOrder = 'asc';
}
exports.DepartmentQueryDto = DepartmentQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search term for department name or code',
        example: 'cardio'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active status',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DepartmentQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by parent department ID',
        example: '550e8400-e29b-41d4-a716-446655440001'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentQueryDto.prototype, "parentDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include child departments in the results',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DepartmentQueryDto.prototype, "includeChildren", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include staff count for each department',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DepartmentQueryDto.prototype, "includeStaffCount", void 0);
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
], DepartmentQueryDto.prototype, "page", void 0);
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
], DepartmentQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        enum: ['name', 'code', 'createdAt'],
        default: 'name'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        default: 'asc'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentQueryDto.prototype, "sortOrder", void 0);
class DepartmentResponseDto {
    id;
    tenantId;
    name;
    code;
    description;
    headStaffId;
    headStaffName;
    parentDepartmentId;
    parentDepartmentName;
    isActive;
    colorCode;
    contactEmail;
    contactPhone;
    location;
    staffCount;
    children;
    createdAt;
    updatedAt;
}
exports.DepartmentResponseDto = DepartmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID' }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tenant ID' }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department name' }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department code' }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department description' }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the department head',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    __metadata("design:type", Object)
], DepartmentResponseDto.prototype, "headStaffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of the department head',
        example: 'Dr. John Smith'
    }),
    __metadata("design:type", Object)
], DepartmentResponseDto.prototype, "headStaffName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the parent department',
        example: '550e8400-e29b-41d4-a716-446655440001'
    }),
    __metadata("design:type", Object)
], DepartmentResponseDto.prototype, "parentDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of the parent department',
        example: 'Medical Services'
    }),
    __metadata("design:type", Object)
], DepartmentResponseDto.prototype, "parentDepartmentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the department is active',
        default: true
    }),
    __metadata("design:type", Boolean)
], DepartmentResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Color code for the department',
        example: '#FF5733'
    }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department contact email',
        example: 'cardiology@hospital.com'
    }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Department contact phone number',
        example: '+1234567890'
    }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "contactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Physical location of the department',
        example: 'Building A, 2nd Floor, Wing C'
    }),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of staff members in the department',
        default: 0
    }),
    __metadata("design:type", Number)
], DepartmentResponseDto.prototype, "staffCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Child departments',
        type: [DepartmentResponseDto]
    }),
    __metadata("design:type", Array)
], DepartmentResponseDto.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        type: 'string',
        format: 'date-time'
    }),
    __metadata("design:type", Date)
], DepartmentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        type: 'string',
        format: 'date-time'
    }),
    __metadata("design:type", Date)
], DepartmentResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=department.dto.js.map