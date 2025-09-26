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
exports.STATOrderAlertDto = exports.SLAViolationDto = exports.TATPerformanceDto = exports.UpdateTATConfigDto = exports.CreateTATConfigDto = exports.TATMetricsDto = exports.TATConfigDto = exports.TATStatus = exports.TestPriority = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var TestPriority;
(function (TestPriority) {
    TestPriority["STAT"] = "STAT";
    TestPriority["URGENT"] = "URGENT";
    TestPriority["ROUTINE"] = "ROUTINE";
})(TestPriority || (exports.TestPriority = TestPriority = {}));
var TATStatus;
(function (TATStatus) {
    TATStatus["ON_TIME"] = "ON_TIME";
    TATStatus["WARNING"] = "WARNING";
    TATStatus["OVERDUE"] = "OVERDUE";
})(TATStatus || (exports.TATStatus = TATStatus = {}));
class TATConfigDto {
    id;
    testId;
    priority;
    targetMinutes;
    warningMinutes;
    isActive;
    tenantId;
    createdAt;
    updatedAt;
}
exports.TATConfigDto = TATConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TATConfigDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TATConfigDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TestPriority }),
    __metadata("design:type", String)
], TATConfigDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TATConfigDto.prototype, "targetMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TATConfigDto.prototype, "warningMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], TATConfigDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TATConfigDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TATConfigDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TATConfigDto.prototype, "updatedAt", void 0);
class TATMetricsDto {
    orderId;
    testId;
    testName;
    priority;
    orderedAt;
    collectedAt;
    receivedAt;
    resultedAt;
    verifiedAt;
    publishedAt;
    tatMinutes;
    isWithinTarget;
    isOverdue;
    status;
}
exports.TATMetricsDto = TATMetricsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TATMetricsDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TATMetricsDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TATMetricsDto.prototype, "testName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TATMetricsDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TATMetricsDto.prototype, "orderedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TATMetricsDto.prototype, "collectedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TATMetricsDto.prototype, "receivedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TATMetricsDto.prototype, "resultedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TATMetricsDto.prototype, "verifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], TATMetricsDto.prototype, "publishedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TATMetricsDto.prototype, "tatMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], TATMetricsDto.prototype, "isWithinTarget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], TATMetricsDto.prototype, "isOverdue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TATStatus }),
    __metadata("design:type", String)
], TATMetricsDto.prototype, "status", void 0);
class CreateTATConfigDto {
    testId;
    priority;
    targetMinutes;
    warningMinutes;
    isActive;
}
exports.CreateTATConfigDto = CreateTATConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTATConfigDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TestPriority }),
    (0, class_validator_1.IsEnum)(TestPriority),
    __metadata("design:type", String)
], CreateTATConfigDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTATConfigDto.prototype, "targetMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTATConfigDto.prototype, "warningMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTATConfigDto.prototype, "isActive", void 0);
class UpdateTATConfigDto {
    targetMinutes;
    warningMinutes;
    isActive;
}
exports.UpdateTATConfigDto = UpdateTATConfigDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTATConfigDto.prototype, "targetMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTATConfigDto.prototype, "warningMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTATConfigDto.prototype, "isActive", void 0);
class TATPerformanceDto {
    summary;
    priorityBreakdown;
}
exports.TATPerformanceDto = TATPerformanceDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], TATPerformanceDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], TATPerformanceDto.prototype, "priorityBreakdown", void 0);
class SLAViolationDto {
    orderId;
    testId;
    testName;
    priority;
    targetMinutes;
    actualMinutes;
    minutesOverdue;
    orderedAt;
    resultedAt;
}
exports.SLAViolationDto = SLAViolationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SLAViolationDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SLAViolationDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SLAViolationDto.prototype, "testName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SLAViolationDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SLAViolationDto.prototype, "targetMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SLAViolationDto.prototype, "actualMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SLAViolationDto.prototype, "minutesOverdue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SLAViolationDto.prototype, "orderedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SLAViolationDto.prototype, "resultedAt", void 0);
class STATOrderAlertDto {
    orderId;
    patientName;
    testName;
    minutesOverdue;
    priority;
    orderedAt;
}
exports.STATOrderAlertDto = STATOrderAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], STATOrderAlertDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], STATOrderAlertDto.prototype, "patientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], STATOrderAlertDto.prototype, "testName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], STATOrderAlertDto.prototype, "minutesOverdue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], STATOrderAlertDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], STATOrderAlertDto.prototype, "orderedAt", void 0);
//# sourceMappingURL=lab-tat.dto.js.map