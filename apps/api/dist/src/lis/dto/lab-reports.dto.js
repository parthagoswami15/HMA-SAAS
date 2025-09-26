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
exports.QCReportDto = exports.WorkloadReportDto = exports.ExportReportDto = exports.GenerateQCReportDto = exports.GenerateWorkloadReportDto = exports.GenerateCumulativeReportDto = exports.GeneratePatientReportDto = exports.LabReportDto = exports.ReportSummaryDto = exports.LabResultDataDto = exports.ExportFormat = exports.ReportType = exports.ReportStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PRELIMINARY"] = "PRELIMINARY";
    ReportStatus["FINAL"] = "FINAL";
    ReportStatus["CORRECTED"] = "CORRECTED";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
var ReportType;
(function (ReportType) {
    ReportType["PATIENT"] = "PATIENT";
    ReportType["PHYSICIAN"] = "PHYSICIAN";
    ReportType["BOTH"] = "BOTH";
})(ReportType || (exports.ReportType = ReportType = {}));
var ExportFormat;
(function (ExportFormat) {
    ExportFormat["PDF"] = "PDF";
    ExportFormat["CSV"] = "CSV";
    ExportFormat["EXCEL"] = "EXCEL";
})(ExportFormat || (exports.ExportFormat = ExportFormat = {}));
class LabResultDataDto {
    testId;
    testName;
    analyte;
    value;
    unit;
    flag;
    referenceRange;
    resultDateTime;
    validationStatus;
    performedBy;
}
exports.LabResultDataDto = LabResultDataDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultDataDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultDataDto.prototype, "testName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultDataDto.prototype, "analyte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], LabResultDataDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultDataDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultDataDto.prototype, "flag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultDataDto.prototype, "referenceRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LabResultDataDto.prototype, "resultDateTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabResultDataDto.prototype, "validationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabResultDataDto.prototype, "performedBy", void 0);
class ReportSummaryDto {
    totalTests;
    abnormalTests;
    criticalTests;
    pendingTests;
    tatHours;
}
exports.ReportSummaryDto = ReportSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReportSummaryDto.prototype, "totalTests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReportSummaryDto.prototype, "abnormalTests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReportSummaryDto.prototype, "criticalTests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReportSummaryDto.prototype, "pendingTests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReportSummaryDto.prototype, "tatHours", void 0);
class LabReportDto {
    id;
    orderId;
    patientId;
    patientName;
    patientDOB;
    physicianName;
    orderDate;
    collectionDate;
    results;
    summary;
    status;
    reportType;
    tenantId;
    generatedAt;
}
exports.LabReportDto = LabReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabReportDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabReportDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabReportDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabReportDto.prototype, "patientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LabReportDto.prototype, "patientDOB", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], LabReportDto.prototype, "physicianName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LabReportDto.prototype, "orderDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], LabReportDto.prototype, "collectionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [LabResultDataDto] }),
    __metadata("design:type", Array)
], LabReportDto.prototype, "results", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ReportSummaryDto)
], LabReportDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ReportStatus }),
    __metadata("design:type", String)
], LabReportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ReportType }),
    __metadata("design:type", String)
], LabReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LabReportDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LabReportDto.prototype, "generatedAt", void 0);
class GeneratePatientReportDto {
    orderId;
}
exports.GeneratePatientReportDto = GeneratePatientReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GeneratePatientReportDto.prototype, "orderId", void 0);
class GenerateCumulativeReportDto {
    patientId;
    startDate;
    endDate;
}
exports.GenerateCumulativeReportDto = GenerateCumulativeReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCumulativeReportDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GenerateCumulativeReportDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GenerateCumulativeReportDto.prototype, "endDate", void 0);
class GenerateWorkloadReportDto {
    tenantId;
    startDate;
    endDate;
}
exports.GenerateWorkloadReportDto = GenerateWorkloadReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateWorkloadReportDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GenerateWorkloadReportDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GenerateWorkloadReportDto.prototype, "endDate", void 0);
class GenerateQCReportDto {
    analyzerId;
    startDate;
    endDate;
}
exports.GenerateQCReportDto = GenerateQCReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQCReportDto.prototype, "analyzerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GenerateQCReportDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GenerateQCReportDto.prototype, "endDate", void 0);
class ExportReportDto {
    reportId;
    format;
}
exports.ExportReportDto = ExportReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportReportDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExportFormat }),
    (0, class_validator_1.IsEnum)(ExportFormat),
    __metadata("design:type", String)
], ExportReportDto.prototype, "format", void 0);
class WorkloadReportDto {
    summary;
    priorityBreakdown;
    dailyStats;
    period;
}
exports.WorkloadReportDto = WorkloadReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], WorkloadReportDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], WorkloadReportDto.prototype, "priorityBreakdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], WorkloadReportDto.prototype, "dailyStats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], WorkloadReportDto.prototype, "period", void 0);
class QCReportDto {
    analyzer;
    summary;
    analyteStats;
    period;
}
exports.QCReportDto = QCReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], QCReportDto.prototype, "analyzer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], QCReportDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], QCReportDto.prototype, "analyteStats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], QCReportDto.prototype, "period", void 0);
//# sourceMappingURL=lab-reports.dto.js.map