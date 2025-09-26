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
exports.BulkAttendanceItemDto = exports.BulkAttendanceUpdateDto = exports.AttendanceQueryDto = exports.UpdateAttendanceDto = exports.CheckInOutDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../enums");
class CheckInOutDto {
    staffId;
    timestamp;
    location;
    deviceInfo;
    notes;
}
exports.CheckInOutDto = CheckInOutDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff member ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CheckInOutDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Check-in/out timestamp (defaults to current time if not provided)',
        example: '2023-06-15T09:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckInOutDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Location coordinates',
        example: { latitude: 12.9716, longitude: 77.5946 }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CheckInOutDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device information',
        example: {
            deviceId: 'device-123',
            deviceName: 'iPhone 13',
            os: 'iOS 15.0',
            ipAddress: '192.168.1.1'
        }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CheckInOutDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes',
        example: 'Remote work from home'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckInOutDto.prototype, "notes", void 0);
class UpdateAttendanceDto {
    checkIn;
    checkOut;
    status;
    totalHours;
    notes;
    requiresApproval = false;
}
exports.UpdateAttendanceDto = UpdateAttendanceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Check-in time',
        example: '2023-06-15T09:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAttendanceDto.prototype, "checkIn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Check-out time',
        example: '2023-06-15T18:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAttendanceDto.prototype, "checkOut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attendance status',
        enum: enums_1.AttendanceStatus
    }),
    (0, class_validator_1.IsEnum)(enums_1.AttendanceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAttendanceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total working hours',
        minimum: 0,
        maximum: 24
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(24),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAttendanceDto.prototype, "totalHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes',
        example: 'Late due to traffic'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAttendanceDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this attendance record requires approval',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateAttendanceDto.prototype, "requiresApproval", void 0);
class AttendanceQueryDto {
    staffId;
    departmentId;
    status;
    date;
    startDate;
    endDate;
    lateOnly = false;
    earlyDepartureOnly = false;
    requiresApproval = false;
    page = 1;
    limit = 10;
    sortBy = 'date';
    sortOrder = 'desc';
}
exports.AttendanceQueryDto = AttendanceQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by staff member ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendanceQueryDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by department ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendanceQueryDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by attendance status',
        enum: enums_1.AttendanceStatus
    }),
    (0, class_validator_1.IsEnum)(enums_1.AttendanceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendanceQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by date (YYYY-MM-DD format)',
        example: '2023-06-15'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendanceQueryDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by start date (inclusive)',
        example: '2023-06-01'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendanceQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by end date (inclusive)',
        example: '2023-06-30'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendanceQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by late arrivals only',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AttendanceQueryDto.prototype, "lateOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by early departures only',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AttendanceQueryDto.prototype, "earlyDepartureOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by attendance records requiring approval',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AttendanceQueryDto.prototype, "requiresApproval", void 0);
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
], AttendanceQueryDto.prototype, "page", void 0);
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
], AttendanceQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        enum: ['date', 'checkIn', 'checkOut', 'totalHours'],
        default: 'date'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendanceQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        default: 'desc'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendanceQueryDto.prototype, "sortOrder", void 0);
class BulkAttendanceUpdateDto {
    records;
}
exports.BulkAttendanceUpdateDto = BulkAttendanceUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of attendance records to update',
        type: [BulkAttendanceItemDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BulkAttendanceItemDto),
    __metadata("design:type", Array)
], BulkAttendanceUpdateDto.prototype, "records", void 0);
class BulkAttendanceItemDto {
    id;
    checkIn;
    checkOut;
    status;
    totalHours;
    notes;
}
exports.BulkAttendanceItemDto = BulkAttendanceItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attendance record ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BulkAttendanceItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Check-in time',
        example: '2023-06-15T09:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BulkAttendanceItemDto.prototype, "checkIn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Check-out time',
        example: '2023-06-15T18:00:00.000Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BulkAttendanceItemDto.prototype, "checkOut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attendance status',
        enum: enums_1.AttendanceStatus
    }),
    (0, class_validator_1.IsEnum)(enums_1.AttendanceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BulkAttendanceItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total working hours',
        minimum: 0,
        maximum: 24
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(24),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BulkAttendanceItemDto.prototype, "totalHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BulkAttendanceItemDto.prototype, "notes", void 0);
//# sourceMappingURL=attendance.dto.js.map