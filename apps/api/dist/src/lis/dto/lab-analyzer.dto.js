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
exports.QcRunResponseDto = exports.QcResultDto = exports.CreateQcRunDto = exports.QcBatchDto = exports.AnalyzerResponseDto = exports.UpdateAnalyzerDto = exports.CreateAnalyzerDto = exports.Direction = exports.AnalyzerType = exports.AnalyzerStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var AnalyzerStatus;
(function (AnalyzerStatus) {
    AnalyzerStatus["ONLINE"] = "ONLINE";
    AnalyzerStatus["OFFLINE"] = "OFFLINE";
    AnalyzerStatus["MAINTENANCE"] = "MAINTENANCE";
    AnalyzerStatus["ERROR"] = "ERROR";
})(AnalyzerStatus || (exports.AnalyzerStatus = AnalyzerStatus = {}));
var AnalyzerType;
(function (AnalyzerType) {
    AnalyzerType["CHEMISTRY"] = "CHEMISTRY";
    AnalyzerType["HEMATOLOGY"] = "HEMATOLOGY";
    AnalyzerType["IMMUNOASSAY"] = "IMMUNOASSAY";
    AnalyzerType["COAGULATION"] = "COAGULATION";
    AnalyzerType["URINALYSIS"] = "URINALYSIS";
    AnalyzerType["MICROBIOLOGY"] = "MICROBIOLOGY";
})(AnalyzerType || (exports.AnalyzerType = AnalyzerType = {}));
var Direction;
(function (Direction) {
    Direction["UNIDIRECTIONAL"] = "UNIDIRECTIONAL";
    Direction["BIDIRECTIONAL"] = "BIDIRECTIONAL";
})(Direction || (exports.Direction = Direction = {}));
class CreateAnalyzerDto {
    name;
    model;
    type;
    serialNumber;
    ipAddress;
    port;
    location;
    direction;
    isActive;
    configuration;
    supportedTests;
}
exports.CreateAnalyzerDto = CreateAnalyzerDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyzerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyzerDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AnalyzerType }),
    (0, class_validator_1.IsEnum)(AnalyzerType),
    __metadata("design:type", String)
], CreateAnalyzerDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyzerDto.prototype, "serialNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyzerDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAnalyzerDto.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyzerDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: Direction }),
    (0, class_validator_1.IsEnum)(Direction),
    __metadata("design:type", String)
], CreateAnalyzerDto.prototype, "direction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAnalyzerDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAnalyzerDto.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAnalyzerDto.prototype, "supportedTests", void 0);
class UpdateAnalyzerDto {
    name;
    ipAddress;
    port;
    location;
    status;
    isActive;
    configuration;
    supportedTests;
}
exports.UpdateAnalyzerDto = UpdateAnalyzerDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAnalyzerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAnalyzerDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateAnalyzerDto.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAnalyzerDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AnalyzerStatus),
    __metadata("design:type", String)
], UpdateAnalyzerDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAnalyzerDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateAnalyzerDto.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateAnalyzerDto.prototype, "supportedTests", void 0);
class AnalyzerResponseDto {
    id;
    name;
    model;
    type;
    serialNumber;
    ipAddress;
    port;
    location;
    direction;
    status;
    isActive;
    configuration;
    supportedTests;
    lastCommunication;
    createdAt;
    updatedAt;
}
exports.AnalyzerResponseDto = AnalyzerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AnalyzerResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AnalyzerResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AnalyzerResponseDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AnalyzerType }),
    __metadata("design:type", String)
], AnalyzerResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AnalyzerResponseDto.prototype, "serialNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AnalyzerResponseDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], AnalyzerResponseDto.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AnalyzerResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Direction }),
    __metadata("design:type", String)
], AnalyzerResponseDto.prototype, "direction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AnalyzerStatus }),
    __metadata("design:type", String)
], AnalyzerResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AnalyzerResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], AnalyzerResponseDto.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], AnalyzerResponseDto.prototype, "supportedTests", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], AnalyzerResponseDto.prototype, "lastCommunication", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AnalyzerResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AnalyzerResponseDto.prototype, "updatedAt", void 0);
class QcBatchDto {
    analyte;
    lotNumber;
    targetValue;
    targetSd;
    targetCv;
    expiryDate;
    manufacturer;
    statistics;
}
exports.QcBatchDto = QcBatchDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QcBatchDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QcBatchDto.prototype, "lotNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QcBatchDto.prototype, "targetValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QcBatchDto.prototype, "targetSd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QcBatchDto.prototype, "targetCv", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    IsDate(),
    __metadata("design:type", Date)
], QcBatchDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QcBatchDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], QcBatchDto.prototype, "statistics", void 0);
class CreateQcRunDto {
    analyzerId;
    qcBatches;
    operator;
    runDateTime;
    notes;
}
exports.CreateQcRunDto = CreateQcRunDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQcRunDto.prototype, "analyzerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    IsArray(),
    __metadata("design:type", Array)
], CreateQcRunDto.prototype, "qcBatches", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQcRunDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    IsDate(),
    __metadata("design:type", Date)
], CreateQcRunDto.prototype, "runDateTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQcRunDto.prototype, "notes", void 0);
class QcResultDto {
    analyte;
    lotNumber;
    measuredValue;
    expectedValue;
    deviation;
    withinRange;
    flag;
}
exports.QcResultDto = QcResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QcResultDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QcResultDto.prototype, "lotNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QcResultDto.prototype, "measuredValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QcResultDto.prototype, "expectedValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QcResultDto.prototype, "deviation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QcResultDto.prototype, "withinRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QcResultDto.prototype, "flag", void 0);
class QcRunResponseDto {
    id;
    analyzerId;
    qcBatches;
    qcResults;
    operator;
    runDateTime;
    notes;
    isPassed;
    westgardRules;
    createdAt;
    updatedAt;
}
exports.QcRunResponseDto = QcRunResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QcRunResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QcRunResponseDto.prototype, "analyzerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], QcRunResponseDto.prototype, "qcBatches", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], QcRunResponseDto.prototype, "qcResults", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QcRunResponseDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], QcRunResponseDto.prototype, "runDateTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QcRunResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], QcRunResponseDto.prototype, "isPassed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], QcRunResponseDto.prototype, "westgardRules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], QcRunResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], QcRunResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=lab-analyzer.dto.js.map