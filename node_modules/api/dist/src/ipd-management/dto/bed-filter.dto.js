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
exports.BedFilterDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class BedFilterDto {
    search;
    status;
    bedClass;
    wardId;
    wardName;
    floor;
    features;
    minDailyRate;
    maxDailyRate;
    isAvailable;
    isActive = true;
    needsMaintenance = false;
    needsCleaning = false;
    includeWard = false;
    includeAdmission = false;
    sortBy = 'bedNumber';
    sortOrder = 'ASC';
    page = 1;
    limit = 10;
    statuses;
    bedClasses;
    wardIds;
}
exports.BedFilterDto = BedFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search term to filter beds (searches in bed number, name, ward name)',
        required: false,
        example: 'B-101 or Ward A'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BedFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by bed status',
        enum: enums_1.BedStatus,
        required: false,
        example: enums_1.BedStatus.AVAILABLE
    }),
    (0, class_validator_1.IsEnum)(enums_1.BedStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BedFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by bed class',
        enum: enums_1.BedClass,
        required: false,
        example: enums_1.BedClass.GENERAL
    }),
    (0, class_validator_1.IsEnum)(enums_1.BedClass),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BedFilterDto.prototype, "bedClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by ward ID',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BedFilterDto.prototype, "wardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by ward name',
        required: false,
        example: 'General Ward A'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BedFilterDto.prototype, "wardName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by floor number',
        required: false,
        example: 2
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BedFilterDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by bed features',
        required: false,
        example: ['Oxygen', 'Monitor'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BedFilterDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by minimum daily rate',
        required: false,
        example: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BedFilterDto.prototype, "minDailyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by maximum daily rate',
        required: false,
        example: 500
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BedFilterDto.prototype, "maxDailyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by bed availability',
        required: false,
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BedFilterDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by active status',
        required: false,
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BedFilterDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by maintenance status',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BedFilterDto.prototype, "needsMaintenance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by cleaning status',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BedFilterDto.prototype, "needsCleaning", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include related ward information',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BedFilterDto.prototype, "includeWard", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include current admission information',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BedFilterDto.prototype, "includeAdmission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sort field',
        required: false,
        enum: ['bedNumber', 'name', 'wardName', 'status', 'bedClass', 'dailyRate', 'lastCleanedAt'],
        default: 'bedNumber'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BedFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sort order',
        required: false,
        enum: ['ASC', 'DESC'],
        default: 'ASC'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BedFilterDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number for pagination',
        required: false,
        default: 1,
        minimum: 1
    }),
    IsInt(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BedFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        required: false,
        default: 10,
        minimum: 1,
        maximum: 100
    }),
    IsInt(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BedFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by multiple bed statuses',
        required: false,
        enum: enums_1.BedStatus,
        isArray: true,
        example: [enums_1.BedStatus.AVAILABLE, enums_1.BedStatus.OCCUPIED]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(enums_1.BedStatus, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BedFilterDto.prototype, "statuses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by multiple bed classes',
        required: false,
        enum: enums_1.BedClass,
        isArray: true,
        example: [enums_1.BedClass.GENERAL, enums_1.BedClass.PRIVATE]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(enums_1.BedClass, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BedFilterDto.prototype, "bedClasses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by multiple ward IDs',
        required: false,
        type: [String],
        example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BedFilterDto.prototype, "wardIds", void 0);
//# sourceMappingURL=bed-filter.dto.js.map