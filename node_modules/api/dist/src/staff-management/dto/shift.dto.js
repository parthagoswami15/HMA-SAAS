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
exports.FindShiftsQueryDto = exports.BulkCreateShiftsDto = exports.UpdateShiftDto = exports.CreateShiftDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../enums");
class RecurrenceRuleDto {
    freq;
    interval = 1;
    byWeekDay;
    until;
    count;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recurrence frequency',
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        example: 'WEEKLY'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RecurrenceRuleDto.prototype, "freq", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Interval between occurrences',
        minimum: 1,
        default: 1
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecurrenceRuleDto.prototype, "interval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Days of the week (0-6 where 0 is Sunday)',
        type: [Number],
        example: [1, 3, 5]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    (0, class_validator_1.Max)(6, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RecurrenceRuleDto.prototype, "byWeekDay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for the recurrence',
        example: '2023-12-31T23:59:59.999Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecurrenceRuleDto.prototype, "until", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of occurrences',
        minimum: 1
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RecurrenceRuleDto.prototype, "count", void 0);
class CreateShiftDto {
    staffId;
    locationId;
    type;
    startTime;
    endTime;
    isRecurring = false;
    recurrence;
    notes;
}
exports.CreateShiftDto = CreateShiftDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff member ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location ID where the shift takes place',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "locationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of shift',
        enum: enums_1.ShiftType,
        example: enums_1.ShiftType.MORNING
    }),
    (0, class_validator_1.IsEnum)(enums_1.ShiftType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shift start time (ISO 8601 format)',
        example: '2023-06-01T09:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Shift end time (ISO 8601 format)',
        example: '2023-06-01T17:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is a recurring shift',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateShiftDto.prototype, "isRecurring", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Recurrence rule (required if isRecurring is true)',
        type: RecurrenceRuleDto
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RecurrenceRuleDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", RecurrenceRuleDto)
], CreateShiftDto.prototype, "recurrence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the shift',
        example: 'Covering for Dr. Smith'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "notes", void 0);
class UpdateShiftDto {
    locationId;
    type;
    startTime;
    endTime;
    isActive;
    notes;
}
exports.UpdateShiftDto = UpdateShiftDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New location ID for the shift',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "locationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New shift type',
        enum: enums_1.ShiftType
    }),
    (0, class_validator_1.IsEnum)(enums_1.ShiftType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New start time (ISO 8601 format)',
        example: '2023-06-01T10:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New end time (ISO 8601 format)',
        example: '2023-06-01T18:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the shift is active',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateShiftDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the shift'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "notes", void 0);
class BulkCreateShiftsDto {
    shifts;
}
exports.BulkCreateShiftsDto = BulkCreateShiftsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of shifts to create',
        type: [CreateShiftDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateShiftDto),
    __metadata("design:type", Array)
], BulkCreateShiftsDto.prototype, "shifts", void 0);
class FindShiftsQueryDto {
    staffId;
    locationId;
    type;
    startDate;
    endDate;
    includeInactive = false;
    page = 1;
    limit = 10;
}
exports.FindShiftsQueryDto = FindShiftsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by staff member ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindShiftsQueryDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by location ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindShiftsQueryDto.prototype, "locationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by shift type',
        enum: enums_1.ShiftType
    }),
    (0, class_validator_1.IsEnum)(enums_1.ShiftType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindShiftsQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date to filter shifts (inclusive)',
        example: '2023-06-01T00:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindShiftsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date to filter shifts (inclusive)',
        example: '2023-06-30T23:59:59.999Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindShiftsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to include inactive shifts',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindShiftsQueryDto.prototype, "includeInactive", void 0);
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
], FindShiftsQueryDto.prototype, "page", void 0);
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
], FindShiftsQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=shift.dto.js.map