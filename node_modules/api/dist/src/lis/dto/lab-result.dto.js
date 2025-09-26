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
exports.LabResultResponseDto = exports.UpdateLabResultDto = exports.CreateLabResultDto = exports.ValidationStatus = exports.ResultFlag = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ResultFlag;
(function (ResultFlag) {
    ResultFlag["NORMAL"] = "NORMAL";
    ResultFlag["LOW"] = "LOW";
    ResultFlag["HIGH"] = "HIGH";
    ResultFlag["CRITICAL"] = "CRITICAL";
    ResultFlag["ABNORMAL"] = "ABNORMAL";
    ResultFlag["PENDING"] = "PENDING";
    ResultFlag["INVALID"] = "INVALID";
})(ResultFlag || (exports.ResultFlag = ResultFlag = {}));
var ValidationStatus;
(function (ValidationStatus) {
    ValidationStatus["PENDING"] = "PENDING";
    ValidationStatus["TECH_REVIEWED"] = "TECH_REVIEWED";
    ValidationStatus["PATH_REVIEWED"] = "PATH_REVIEWED";
    ValidationStatus["FINAL"] = "FINAL";
    ValidationStatus["AMENDED"] = "AMENDED";
})(ValidationStatus || (exports.ValidationStatus = ValidationStatus = {}));
class CreateLabResultDto {
    orderId;
    testId;
    analyte;
    value;
    textValue;
    unit;
    flag;
    referenceLow;
    referenceHigh;
    instrument;
    resultDateTime;
    notes;
    method;
}
exports.CreateLabResultDto = CreateLabResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLabResultDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "textValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ResultFlag }),
    (0, class_validator_1.IsEnum)(ResultFlag),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "flag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLabResultDto.prototype, "referenceLow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLabResultDto.prototype, "referenceHigh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "instrument", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateLabResultDto.prototype, "resultDateTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabResultDto.prototype, "method", void 0);
class UpdateLabResultDto {
    value;
    textValue;
    unit;
    flag;
    referenceLow;
    referenceHigh;
    instrument;
    resultDateTime;
    notes;
    method;
}
exports.UpdateLabResultDto = UpdateLabResultDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLabResultDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLabResultDto.prototype, "textValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLabResultDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ResultFlag),
    __metadata("design:type", String)
], UpdateLabResultDto.prototype, "flag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLabResultDto.prototype, "referenceLow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLabResultDto.prototype, "referenceHigh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLabResultDto.prototype, "instrument", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateLabResultDto.prototype, "resultDateTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLabResultDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLabResultDto.prototype, "method", void 0);
class LabResultResponseDto {
    id;
    orderId;
    testId;
    analyte;
    value;
    textValue;
    unit;
    flag;
    referenceLow;
    referenceHigh;
    instrument;
    resultDateTime;
    notes;
    method;
    validationStatus;
    validatedBy;
    validatedAt;
    reviewedBy;
    reviewedAt;
    createdAt;
    updatedAt;
}
exports.LabResultResponseDto = LabResultResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], LabResultResponseDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "textValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ResultFlag }),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "flag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], LabResultResponseDto.prototype, "referenceLow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], LabResultResponseDto.prototype, "referenceHigh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "instrument", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], LabResultResponseDto.prototype, "resultDateTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ValidationStatus }),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "validationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "validatedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], LabResultResponseDto.prototype, "validatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabResultResponseDto.prototype, "reviewedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], LabResultResponseDto.prototype, "reviewedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LabResultResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LabResultResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=lab-result.dto.js.map