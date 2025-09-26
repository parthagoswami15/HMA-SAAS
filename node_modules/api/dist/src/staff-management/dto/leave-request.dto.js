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
exports.LeaveBalanceDto = exports.LeaveRequestQueryDto = exports.ProcessLeaveRequestDto = exports.UpdateLeaveRequestDto = exports.CreateLeaveRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../enums");
class LeaveDayDto {
    date;
    isFullDay = true;
    startTime;
    endTime;
    days = 1;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of the leave day (YYYY-MM-DD format)',
        example: '2023-07-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LeaveDayDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is a full day leave',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], LeaveDayDto.prototype, "isFullDay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start time (HH:mm format) for partial day leave',
        example: '09:00',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveDayDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End time (HH:mm format) for partial day leave',
        example: '13:00',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveDayDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of leave days (0.5 for half day, 1 for full day)',
        minimum: 0.5,
        default: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.5),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], LeaveDayDto.prototype, "days", void 0);
class CreateLeaveRequestDto {
    type;
    startDate;
    endDate;
    reason;
    contactNumber;
    addressDuringLeave;
    leaveDays;
    replacementStaffId;
}
exports.CreateLeaveRequestDto = CreateLeaveRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of leave',
        enum: enums_1.LeaveType,
        example: enums_1.LeaveType.ANNUAL
    }),
    (0, class_validator_1.IsEnum)(enums_1.LeaveType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date of leave (YYYY-MM-DD format)',
        example: '2023-07-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date of leave (YYYY-MM-DD format)',
        example: '2023-07-20'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for leave',
        example: 'Family vacation'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact number during leave',
        example: '+1234567890'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "contactNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address during leave',
        example: '123 Vacation St, Beach City'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "addressDuringLeave", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of specific leave days (optional, will be calculated if not provided)',
        type: [LeaveDayDto],
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => LeaveDayDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateLeaveRequestDto.prototype, "leaveDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the staff member to assign as replacement (if applicable)',
        required: false
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "replacementStaffId", void 0);
class UpdateLeaveRequestDto {
    type;
    startDate;
    endDate;
    reason;
    contactNumber;
    addressDuringLeave;
    replacementStaffId;
}
exports.UpdateLeaveRequestDto = UpdateLeaveRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of leave',
        enum: enums_1.LeaveType
    }),
    (0, class_validator_1.IsEnum)(enums_1.LeaveType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLeaveRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date of leave (YYYY-MM-DD format)',
        example: '2023-07-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLeaveRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date of leave (YYYY-MM-DD format)',
        example: '2023-07-20'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLeaveRequestDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for leave',
        example: 'Family vacation'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateLeaveRequestDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact number during leave',
        example: '+1234567890'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLeaveRequestDto.prototype, "contactNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address during leave',
        example: '123 Vacation St, Beach City'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLeaveRequestDto.prototype, "addressDuringLeave", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the staff member to assign as replacement (if applicable)'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLeaveRequestDto.prototype, "replacementStaffId", void 0);
class ProcessLeaveRequestDto {
    status;
    comments;
}
exports.ProcessLeaveRequestDto = ProcessLeaveRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action to take on the leave request',
        enum: [enums_1.LeaveRequestStatus.APPROVED, enums_1.LeaveRequestStatus.REJECTED, enums_1.LeaveRequestStatus.CANCELLED],
        example: enums_1.LeaveRequestStatus.APPROVED
    }),
    (0, class_validator_1.IsEnum)([enums_1.LeaveRequestStatus.APPROVED, enums_1.LeaveRequestStatus.REJECTED, enums_1.LeaveRequestStatus.CANCELLED]),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessLeaveRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Comments regarding the approval/rejection',
        example: 'Approved as per HR policy.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProcessLeaveRequestDto.prototype, "comments", void 0);
class LeaveRequestQueryDto {
    staffId;
    type;
    status;
    startDateFrom;
    endDateTo;
    page = 1;
    limit = 10;
    sortBy = 'startDate';
    sortOrder = 'asc';
}
exports.LeaveRequestQueryDto = LeaveRequestQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by staff member ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveRequestQueryDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by leave type',
        enum: enums_1.LeaveType
    }),
    (0, class_validator_1.IsEnum)(enums_1.LeaveType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveRequestQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by status',
        enum: enums_1.LeaveRequestStatus
    }),
    (0, class_validator_1.IsEnum)(enums_1.LeaveRequestStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveRequestQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by start date (inclusive)',
        example: '2023-01-01'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveRequestQueryDto.prototype, "startDateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by end date (inclusive)',
        example: '2023-12-31'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveRequestQueryDto.prototype, "endDateTo", void 0);
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
], LeaveRequestQueryDto.prototype, "page", void 0);
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
], LeaveRequestQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        enum: ['startDate', 'endDate', 'createdAt', 'updatedAt'],
        default: 'startDate'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveRequestQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        default: 'asc'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveRequestQueryDto.prototype, "sortOrder", void 0);
class LeaveBalanceDto {
    type;
    allocated;
    taken;
    remaining;
    pending = 0;
}
exports.LeaveBalanceDto = LeaveBalanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of leave',
        enum: enums_1.LeaveType
    }),
    (0, class_validator_1.IsEnum)(enums_1.LeaveType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LeaveBalanceDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total allocated leave days for this type',
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LeaveBalanceDto.prototype, "allocated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of leave days taken',
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LeaveBalanceDto.prototype, "taken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of leave days remaining',
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LeaveBalanceDto.prototype, "remaining", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of leave days pending approval',
        minimum: 0,
        default: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], LeaveBalanceDto.prototype, "pending", void 0);
//# sourceMappingURL=leave-request.dto.js.map