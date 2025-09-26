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
exports.PerformanceGoalDto = exports.PerformanceQueryDto = exports.StaffPerformanceDto = exports.PerformanceMetricDto = exports.PerformanceTimeframe = exports.PerformanceMetricType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var PerformanceMetricType;
(function (PerformanceMetricType) {
    PerformanceMetricType["PATIENT_VISITS"] = "PATIENT_VISITS";
    PerformanceMetricType["PROCEDURES"] = "PROCEDURES";
    PerformanceMetricType["REVENUE"] = "REVENUE";
    PerformanceMetricType["PATIENT_SATISFACTION"] = "PATIENT_SATISFACTION";
    PerformanceMetricType["DOCUMENTATION_COMPLETENESS"] = "DOCUMENTATION_COMPLETENESS";
    PerformanceMetricType["ON_TIME_ARRIVAL"] = "ON_TIME_ARRIVAL";
    PerformanceMetricType["PRODUCTIVITY"] = "PRODUCTIVITY";
    PerformanceMetricType["QUALITY"] = "QUALITY";
    PerformanceMetricType["EFFICIENCY"] = "EFFICIENCY";
    PerformanceMetricType["CUSTOM"] = "CUSTOM";
})(PerformanceMetricType || (exports.PerformanceMetricType = PerformanceMetricType = {}));
var PerformanceTimeframe;
(function (PerformanceTimeframe) {
    PerformanceTimeframe["DAILY"] = "DAILY";
    PerformanceTimeframe["WEEKLY"] = "WEEKLY";
    PerformanceTimeframe["MONTHLY"] = "MONTHLY";
    PerformanceTimeframe["QUARTERLY"] = "QUARTERLY";
    PerformanceTimeframe["YEARLY"] = "YEARLY";
    PerformanceTimeframe["CUSTOM"] = "CUSTOM";
})(PerformanceTimeframe || (exports.PerformanceTimeframe = PerformanceTimeframe = {}));
class PerformanceMetricDto {
    type;
    name;
    value;
    target;
    unit = '%';
    isPositive = true;
    metadata;
}
exports.PerformanceMetricDto = PerformanceMetricDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of performance metric',
        enum: PerformanceMetricType
    }),
    (0, class_validator_1.IsEnum)(PerformanceMetricType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PerformanceMetricDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the metric',
        example: 'Patient Satisfaction Score'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PerformanceMetricDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Value of the metric',
        example: 95.5
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PerformanceMetricDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Target value for this metric',
        example: 90
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PerformanceMetricDto.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit of measurement',
        example: '%',
        default: '%'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PerformanceMetricDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is a positive metric (higher is better)',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PerformanceMetricDto.prototype, "isPositive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata about the metric'
    }),
    IsObject(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PerformanceMetricDto.prototype, "metadata", void 0);
class StaffPerformanceDto {
    staffId;
    staffName;
    department;
    designation;
    metrics;
    overallScore;
    rating;
    periodStart;
    periodEnd;
    evaluatedAt;
    evaluatedById;
    evaluatedByName;
    comments;
}
exports.StaffPerformanceDto = StaffPerformanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff member ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StaffPerformanceDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff member name',
        example: 'Dr. John Doe'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StaffPerformanceDto.prototype, "staffName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Department name',
        example: 'Cardiology'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffPerformanceDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Job title/designation',
        example: 'Senior Cardiologist'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffPerformanceDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Performance metrics',
        type: [PerformanceMetricDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PerformanceMetricDto),
    __metadata("design:type", Array)
], StaffPerformanceDto.prototype, "metrics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Overall performance score (0-100)',
        example: 88.5
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], StaffPerformanceDto.prototype, "overallScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Performance rating (1-5)',
        example: 4.5
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], StaffPerformanceDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date of the evaluation period',
        example: '2023-01-01'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StaffPerformanceDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date of the evaluation period',
        example: '2023-12-31'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StaffPerformanceDto.prototype, "periodEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when the evaluation was performed',
        default: 'Current date'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffPerformanceDto.prototype, "evaluatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the evaluator',
        example: '550e8400-e29b-41d4-a716-446655440001'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffPerformanceDto.prototype, "evaluatedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of the evaluator',
        example: 'Dr. Sarah Johnson'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffPerformanceDto.prototype, "evaluatedByName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional comments about the performance evaluation'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffPerformanceDto.prototype, "comments", void 0);
class PerformanceQueryDto {
    staffId;
    departmentId;
    metricType;
    minRating;
    maxRating;
    startDate;
    endDate;
    timeframe = PerformanceTimeframe.MONTHLY;
    includeDetails = false;
    page = 1;
    limit = 10;
}
exports.PerformanceQueryDto = PerformanceQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by staff member ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PerformanceQueryDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by department ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PerformanceQueryDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by performance metric type',
        enum: PerformanceMetricType
    }),
    (0, class_validator_1.IsEnum)(PerformanceMetricType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PerformanceQueryDto.prototype, "metricType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by minimum rating (1-5)',
        minimum: 1,
        maximum: 5,
        example: 4
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PerformanceQueryDto.prototype, "minRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by maximum rating (1-5)',
        minimum: 1,
        maximum: 5,
        example: 5
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PerformanceQueryDto.prototype, "maxRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by start date (inclusive)',
        example: '2023-01-01'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PerformanceQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by end date (inclusive)',
        example: '2023-12-31'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PerformanceQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timeframe for grouping results',
        enum: PerformanceTimeframe,
        default: PerformanceTimeframe.MONTHLY
    }),
    (0, class_validator_1.IsEnum)(PerformanceTimeframe),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PerformanceQueryDto.prototype, "timeframe", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to include detailed metrics',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PerformanceQueryDto.prototype, "includeDetails", void 0);
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
], PerformanceQueryDto.prototype, "page", void 0);
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
], PerformanceQueryDto.prototype, "limit", void 0);
class PerformanceGoalDto {
    title;
    description;
    metricType;
    targetValue;
    currentValue;
    startDate;
    targetDate;
    completedDate;
    progress = 0;
    priority = 3;
    isActive = true;
    notes;
    tags = [];
}
exports.PerformanceGoalDto = PerformanceGoalDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the performance goal',
        example: 'Increase patient satisfaction score'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PerformanceGoalDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the goal',
        example: 'Achieve a patient satisfaction score of 95% or higher'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PerformanceGoalDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target metric type',
        enum: PerformanceMetricType
    }),
    (0, class_validator_1.IsEnum)(PerformanceMetricType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PerformanceGoalDto.prototype, "metricType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target value to achieve',
        example: 95
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PerformanceGoalDto.prototype, "targetValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current value of the metric',
        example: 88
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PerformanceGoalDto.prototype, "currentValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date of the goal period',
        example: '2023-01-01'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PerformanceGoalDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target completion date',
        example: '2023-12-31'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PerformanceGoalDto.prototype, "targetDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Actual completion date',
        example: '2023-12-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PerformanceGoalDto.prototype, "completedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Progress percentage (0-100)',
        example: 75.5,
        default: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PerformanceGoalDto.prototype, "progress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority level (1-5, with 5 being highest)',
        example: 3,
        minimum: 1,
        maximum: 5
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PerformanceGoalDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the goal is currently active',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PerformanceGoalDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the goal'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PerformanceGoalDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags for categorization',
        example: ['patient-satisfaction', 'quality-care']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PerformanceGoalDto.prototype, "tags", void 0);
//# sourceMappingURL=performance.dto.js.map