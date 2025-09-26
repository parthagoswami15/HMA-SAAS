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
exports.UpdatePanicThresholdDto = exports.PanicAlertStatisticsDto = exports.AcknowledgePanicAlertDto = exports.CreatePanicAlertDto = exports.PanicAlertDto = exports.PanicThresholdDto = exports.AlertLevel = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var AlertLevel;
(function (AlertLevel) {
    AlertLevel["CRITICAL"] = "CRITICAL";
    AlertLevel["PANIC"] = "PANIC";
})(AlertLevel || (exports.AlertLevel = AlertLevel = {}));
class PanicThresholdDto {
    analyte;
    criticalLow;
    criticalHigh;
    panicLow;
    panicHigh;
    unit;
}
exports.PanicThresholdDto = PanicThresholdDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PanicThresholdDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PanicThresholdDto.prototype, "criticalLow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PanicThresholdDto.prototype, "criticalHigh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PanicThresholdDto.prototype, "panicLow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PanicThresholdDto.prototype, "panicHigh", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PanicThresholdDto.prototype, "unit", void 0);
class PanicAlertDto {
    id;
    orderId;
    patientId;
    analyte;
    value;
    unit;
    flag;
    referenceLow;
    referenceHigh;
    alertLevel;
    message;
    acknowledged;
    acknowledgedBy;
    acknowledgedAt;
    notifiedUsers;
    createdAt;
    updatedAt;
}
exports.PanicAlertDto = PanicAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PanicAlertDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PanicAlertDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PanicAlertDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PanicAlertDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PanicAlertDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PanicAlertDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PanicAlertDto.prototype, "flag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PanicAlertDto.prototype, "referenceLow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PanicAlertDto.prototype, "referenceHigh", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AlertLevel }),
    __metadata("design:type", String)
], PanicAlertDto.prototype, "alertLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PanicAlertDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PanicAlertDto.prototype, "acknowledged", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PanicAlertDto.prototype, "acknowledgedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PanicAlertDto.prototype, "acknowledgedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], PanicAlertDto.prototype, "notifiedUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PanicAlertDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PanicAlertDto.prototype, "updatedAt", void 0);
class CreatePanicAlertDto {
    orderId;
    patientId;
    analyte;
    value;
    unit;
    flag;
    referenceLow;
    referenceHigh;
    alertLevel;
    message;
}
exports.CreatePanicAlertDto = CreatePanicAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePanicAlertDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePanicAlertDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePanicAlertDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePanicAlertDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePanicAlertDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePanicAlertDto.prototype, "flag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePanicAlertDto.prototype, "referenceLow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePanicAlertDto.prototype, "referenceHigh", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AlertLevel }),
    (0, class_validator_1.IsEnum)(AlertLevel),
    __metadata("design:type", String)
], CreatePanicAlertDto.prototype, "alertLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePanicAlertDto.prototype, "message", void 0);
class AcknowledgePanicAlertDto {
    acknowledgedBy;
}
exports.AcknowledgePanicAlertDto = AcknowledgePanicAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcknowledgePanicAlertDto.prototype, "acknowledgedBy", void 0);
class PanicAlertStatisticsDto {
    totalAlerts;
    acknowledgedAlerts;
    pendingAlerts;
    panicLevelAlerts;
    acknowledgmentRate;
}
exports.PanicAlertStatisticsDto = PanicAlertStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PanicAlertStatisticsDto.prototype, "totalAlerts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PanicAlertStatisticsDto.prototype, "acknowledgedAlerts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PanicAlertStatisticsDto.prototype, "pendingAlerts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PanicAlertStatisticsDto.prototype, "panicLevelAlerts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PanicAlertStatisticsDto.prototype, "acknowledgmentRate", void 0);
class UpdatePanicThresholdDto {
    criticalLow;
    criticalHigh;
    panicLow;
    panicHigh;
    unit;
}
exports.UpdatePanicThresholdDto = UpdatePanicThresholdDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePanicThresholdDto.prototype, "criticalLow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePanicThresholdDto.prototype, "criticalHigh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePanicThresholdDto.prototype, "panicLow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePanicThresholdDto.prototype, "panicHigh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePanicThresholdDto.prototype, "unit", void 0);
//# sourceMappingURL=lab-panic-alert.dto.js.map