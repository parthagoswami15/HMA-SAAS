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
exports.DeltaCheckHistoryDto = exports.DeltaCheckAlertDto = exports.UpdateDeltaCheckConfigDto = exports.CreateDeltaCheckConfigDto = exports.DeltaCheckDto = exports.DeltaCheckConfigDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class DeltaCheckConfigDto {
    analyte;
    threshold;
    timeWindowDays;
    enabled;
}
exports.DeltaCheckConfigDto = DeltaCheckConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DeltaCheckConfigDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DeltaCheckConfigDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DeltaCheckConfigDto.prototype, "timeWindowDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], DeltaCheckConfigDto.prototype, "enabled", void 0);
class DeltaCheckDto {
    analyte;
    currentValue;
    previousValue;
    delta;
    deltaPercentage;
    threshold;
    isSignificant;
    previousDate;
    currentDate;
}
exports.DeltaCheckDto = DeltaCheckDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DeltaCheckDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DeltaCheckDto.prototype, "currentValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DeltaCheckDto.prototype, "previousValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DeltaCheckDto.prototype, "delta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DeltaCheckDto.prototype, "deltaPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DeltaCheckDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], DeltaCheckDto.prototype, "isSignificant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DeltaCheckDto.prototype, "previousDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DeltaCheckDto.prototype, "currentDate", void 0);
class CreateDeltaCheckConfigDto {
    analyte;
    threshold;
    timeWindowDays;
    enabled;
}
exports.CreateDeltaCheckConfigDto = CreateDeltaCheckConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeltaCheckConfigDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeltaCheckConfigDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeltaCheckConfigDto.prototype, "timeWindowDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDeltaCheckConfigDto.prototype, "enabled", void 0);
class UpdateDeltaCheckConfigDto {
    threshold;
    timeWindowDays;
    enabled;
}
exports.UpdateDeltaCheckConfigDto = UpdateDeltaCheckConfigDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateDeltaCheckConfigDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateDeltaCheckConfigDto.prototype, "timeWindowDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDeltaCheckConfigDto.prototype, "enabled", void 0);
class DeltaCheckAlertDto {
    patientId;
    analyte;
    currentValue;
    previousValue;
    deltaPercentage;
    message;
    priority;
    orderId;
}
exports.DeltaCheckAlertDto = DeltaCheckAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeltaCheckAlertDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeltaCheckAlertDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DeltaCheckAlertDto.prototype, "currentValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DeltaCheckAlertDto.prototype, "previousValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DeltaCheckAlertDto.prototype, "deltaPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeltaCheckAlertDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], DeltaCheckAlertDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], DeltaCheckAlertDto.prototype, "orderId", void 0);
class DeltaCheckHistoryDto {
    patientId;
    analyte;
    results;
    significantChanges;
}
exports.DeltaCheckHistoryDto = DeltaCheckHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DeltaCheckHistoryDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DeltaCheckHistoryDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DeltaCheckHistoryDto.prototype, "results", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DeltaCheckHistoryDto.prototype, "significantChanges", void 0);
//# sourceMappingURL=lab-delta-check.dto.js.map