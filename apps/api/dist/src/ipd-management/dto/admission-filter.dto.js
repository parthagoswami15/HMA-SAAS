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
exports.AdmissionFilterDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class AdmissionFilterDto {
    search;
    status;
    type;
    patientId;
    doctorId;
    wardId;
    bedId;
    admissionDateFrom;
    admissionDateTo;
    dischargeDateFrom;
    dischargeDateTo;
    isEmergency;
    insuranceProvider;
    diagnosis;
    minStayDays;
    maxStayDays;
    includeDischarged = true;
    includeActive = true;
    includeTransferred = false;
    sortBy = 'admissionDate';
    sortOrder = 'DESC';
    page = 1;
    limit = 10;
    include;
    ids;
}
exports.AdmissionFilterDto = AdmissionFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search term to filter admissions (searches in patient name, ID, admission number)',
        required: false,
        example: 'John Doe or ADM-2023-001'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by admission status',
        enum: enums_1.AdmissionStatus,
        required: false,
        example: enums_1.AdmissionStatus.ADMITTED
    }),
    (0, class_validator_1.IsEnum)(enums_1.AdmissionStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by admission type',
        enum: enums_1.AdmissionType,
        required: false,
        example: enums_1.AdmissionType.EMERGENCY
    }),
    (0, class_validator_1.IsEnum)(enums_1.AdmissionType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by patient ID',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by admitting doctor ID',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174001'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "doctorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by ward ID',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174002'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "wardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by bed ID',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174003'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "bedId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by admission date range (start date)',
        required: false,
        example: '2023-06-01T00:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "admissionDateFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by admission date range (end date)',
        required: false,
        example: '2023-06-30T23:59:59Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "admissionDateTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by discharge date range (start date)',
        required: false,
        example: '2023-06-15T00:00:00Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "dischargeDateFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by discharge date range (end date)',
        required: false,
        example: '2023-06-25T23:59:59Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "dischargeDateTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by emergency admissions only',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], AdmissionFilterDto.prototype, "isEmergency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by insurance provider',
        required: false,
        example: 'ABC Insurance'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "insuranceProvider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by diagnosis or ICD code',
        required: false,
        example: 'J18.9 or pneumonia'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by minimum length of stay (in days)',
        required: false,
        example: 3
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AdmissionFilterDto.prototype, "minStayDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by maximum length of stay (in days)',
        required: false,
        example: 14
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AdmissionFilterDto.prototype, "maxStayDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include discharged patients',
        required: false,
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], AdmissionFilterDto.prototype, "includeDischarged", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include active admissions',
        required: false,
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], AdmissionFilterDto.prototype, "includeActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include transferred patients',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], AdmissionFilterDto.prototype, "includeTransferred", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sort field',
        required: false,
        enum: ['admissionDate', 'dischargeDate', 'patientName', 'doctorName', 'wardName', 'bedNumber'],
        default: 'admissionDate'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sort order',
        required: false,
        enum: ['ASC', 'DESC'],
        default: 'DESC'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number for pagination',
        required: false,
        default: 1,
        minimum: 1
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AdmissionFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        required: false,
        default: 10,
        minimum: 1,
        maximum: 100
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AdmissionFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include related entities (comma-separated)',
        required: false,
        example: 'patient,doctor,bed.ward,diagnoses'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "include", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by specific admission IDs',
        required: false,
        type: [String],
        example: ['123e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174005']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], AdmissionFilterDto.prototype, "ids", void 0);
//# sourceMappingURL=admission-filter.dto.js.map