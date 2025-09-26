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
exports.WardFilterDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class WardFilterDto {
    search;
    type;
    floor;
    isActive = true;
    hasAvailableBeds = false;
    bedClass;
    specialty;
    minAvailableBeds;
    maxAvailableBeds;
    minOccupancyPercent;
    maxOccupancyPercent;
    includeBeds = false;
    onlyAvailableBeds = false;
    sortBy = 'name';
    sortOrder = 'ASC';
    page = 1;
    limit = 10;
    types;
    floors;
    specialties;
    bedFeatures;
    genderSpecific;
    patientTypes;
}
exports.WardFilterDto = WardFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search term to filter wards (searches in name, code, description)',
        required: false,
        example: 'General or GW'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WardFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by ward type',
        required: false,
        example: 'GENERAL',
        enum: ['GENERAL', 'ICU', 'CCU', 'PEDIATRICS', 'MATERNITY', 'SURGICAL', 'ONCOLOGY', 'PSYCHIATRIC', 'ISOLATION', 'OTHER']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WardFilterDto.prototype, "type", void 0);
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
], WardFilterDto.prototype, "floor", void 0);
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
], WardFilterDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by bed availability',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WardFilterDto.prototype, "hasAvailableBeds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by bed class',
        required: false,
        example: 'GENERAL',
        enum: ['GENERAL', 'PRIVATE', 'DELUXE', 'ICU', 'ISOLATION', 'HDU', 'PEDIATRIC', 'MATERNITY', 'OTHER']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WardFilterDto.prototype, "bedClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by specialty',
        required: false,
        example: 'Cardiology'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WardFilterDto.prototype, "specialty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by minimum number of available beds',
        required: false,
        example: 5
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WardFilterDto.prototype, "minAvailableBeds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by maximum number of available beds',
        required: false,
        example: 20
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WardFilterDto.prototype, "maxAvailableBeds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by minimum occupancy percentage',
        required: false,
        example: 50,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WardFilterDto.prototype, "minOccupancyPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by maximum occupancy percentage',
        required: false,
        example: 90,
        minimum: 0,
        maximum: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WardFilterDto.prototype, "maxOccupancyPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include bed details in the response',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WardFilterDto.prototype, "includeBeds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include only available beds',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WardFilterDto.prototype, "onlyAvailableBeds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sort field',
        required: false,
        enum: ['name', 'code', 'floor', 'type', 'availableBeds', 'occupancyRate'],
        default: 'name'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WardFilterDto.prototype, "sortBy", void 0);
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
], WardFilterDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number for pagination',
        required: false,
        default: 1,
        minimum: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WardFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        required: false,
        default: 10,
        minimum: 1,
        maximum: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WardFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by multiple ward types',
        required: false,
        type: [String],
        example: ['GENERAL', 'ICU', 'CCU']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WardFilterDto.prototype, "types", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by multiple floors',
        required: false,
        type: [Number],
        example: [1, 2, 3]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WardFilterDto.prototype, "floors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by multiple specialties',
        required: false,
        type: [String],
        example: ['Cardiology', 'Neurology', 'Orthopedics']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WardFilterDto.prototype, "specialties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by bed features',
        required: false,
        type: [String],
        example: ['Oxygen', 'Monitor', 'Ventilator']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WardFilterDto.prototype, "bedFeatures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by gender-specific wards',
        required: false,
        enum: ['MALE', 'FEMALE', 'MIXED'],
        example: 'FEMALE'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WardFilterDto.prototype, "genderSpecific", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by wards that allow specific patient types',
        required: false,
        type: [String],
        example: ['ADULT', 'PEDIATRIC', 'GERIATRIC']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WardFilterDto.prototype, "patientTypes", void 0);
//# sourceMappingURL=ward-filter.dto.js.map