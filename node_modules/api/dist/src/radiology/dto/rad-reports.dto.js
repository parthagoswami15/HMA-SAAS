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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadReportListDto = exports.RadReportFilterDto = exports.SignRadReportDto = exports.UpdateRadReportDto = exports.CreateRadReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateRadReportDto {
    studyId;
    orderId;
    reportType;
    clinicalHistory;
    comparison;
    technique;
    findingsText;
    impression;
    recommendations;
    conclusion;
    findings;
    biRadsScore;
    lungRadsScore;
    otherScores;
    dictatedBy;
    primaryReadBy;
    secondReadBy;
    signedBy;
    sharedWithPatient;
    sharedWithDoctor;
    requiresSecondRead;
    peerReviewRequired;
}
exports.CreateRadReportDto = CreateRadReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study ID', required: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "studyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Imaging order ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinical history' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "clinicalHistory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Comparison with previous studies' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "comparison", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Imaging technique used' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "technique", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Narrative findings' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "findingsText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinical impression' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "impression", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recommendations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conclusion' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "conclusion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Structured findings as JSON' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateRadReportDto.prototype, "findings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.BIRADS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.BIRADS),
    __metadata("design:type", typeof (_a = typeof client_1.BIRADS !== "undefined" && client_1.BIRADS) === "function" ? _a : Object)
], CreateRadReportDto.prototype, "biRadsScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.LungRADS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.LungRADS),
    __metadata("design:type", typeof (_b = typeof client_1.LungRADS !== "undefined" && client_1.LungRADS) === "function" ? _b : Object)
], CreateRadReportDto.prototype, "lungRadsScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Other structured scores as JSON' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateRadReportDto.prototype, "otherScores", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User who dictated the report' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "dictatedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Primary radiologist' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "primaryReadBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Second opinion radiologist' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "secondReadBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Final signing radiologist' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRadReportDto.prototype, "signedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Share with patient' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRadReportDto.prototype, "sharedWithPatient", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Share with doctor' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRadReportDto.prototype, "sharedWithDoctor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Requires second read' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRadReportDto.prototype, "requiresSecondRead", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Peer review required' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRadReportDto.prototype, "peerReviewRequired", void 0);
class UpdateRadReportDto {
    status;
    clinicalHistory;
    comparison;
    technique;
    findingsText;
    impression;
    recommendations;
    conclusion;
    findings;
    biRadsScore;
    lungRadsScore;
    otherScores;
    dictatedBy;
    primaryReadBy;
    secondReadBy;
    signedBy;
    sharedWithPatient;
    sharedWithDoctor;
    requiresSecondRead;
    peerReviewRequired;
    peerReviewedBy;
}
exports.UpdateRadReportDto = UpdateRadReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ReportStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ReportStatus),
    __metadata("design:type", typeof (_c = typeof client_1.ReportStatus !== "undefined" && client_1.ReportStatus) === "function" ? _c : Object)
], UpdateRadReportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "clinicalHistory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "comparison", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "technique", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "findingsText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "impression", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "conclusion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Structured findings as JSON' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateRadReportDto.prototype, "findings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.BIRADS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.BIRADS),
    __metadata("design:type", typeof (_d = typeof client_1.BIRADS !== "undefined" && client_1.BIRADS) === "function" ? _d : Object)
], UpdateRadReportDto.prototype, "biRadsScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.LungRADS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.LungRADS),
    __metadata("design:type", typeof (_e = typeof client_1.LungRADS !== "undefined" && client_1.LungRADS) === "function" ? _e : Object)
], UpdateRadReportDto.prototype, "lungRadsScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Other structured scores as JSON' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateRadReportDto.prototype, "otherScores", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "dictatedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "primaryReadBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "secondReadBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "signedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRadReportDto.prototype, "sharedWithPatient", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRadReportDto.prototype, "sharedWithDoctor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRadReportDto.prototype, "requiresSecondRead", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRadReportDto.prototype, "peerReviewRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateRadReportDto.prototype, "peerReviewedBy", void 0);
class SignRadReportDto {
    signedBy;
    finalImpression;
    finalRecommendations;
}
exports.SignRadReportDto = SignRadReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Radiologist signing the report', required: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SignRadReportDto.prototype, "signedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Final impression' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignRadReportDto.prototype, "finalImpression", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Final recommendations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignRadReportDto.prototype, "finalRecommendations", void 0);
class RadReportFilterDto {
    status;
    biRadsScore;
    lungRadsScore;
    studyId;
    dictatedBy;
    primaryReadBy;
    signedBy;
    dateFrom;
    dateTo;
    requiresSecondRead;
    peerReviewRequired;
}
exports.RadReportFilterDto = RadReportFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ReportStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ReportStatus),
    __metadata("design:type", typeof (_f = typeof client_1.ReportStatus !== "undefined" && client_1.ReportStatus) === "function" ? _f : Object)
], RadReportFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.BIRADS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.BIRADS),
    __metadata("design:type", typeof (_g = typeof client_1.BIRADS !== "undefined" && client_1.BIRADS) === "function" ? _g : Object)
], RadReportFilterDto.prototype, "biRadsScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.LungRADS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.LungRADS),
    __metadata("design:type", typeof (_h = typeof client_1.LungRADS !== "undefined" && client_1.LungRADS) === "function" ? _h : Object)
], RadReportFilterDto.prototype, "lungRadsScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RadReportFilterDto.prototype, "studyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RadReportFilterDto.prototype, "dictatedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RadReportFilterDto.prototype, "primaryReadBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RadReportFilterDto.prototype, "signedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RadReportFilterDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RadReportFilterDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RadReportFilterDto.prototype, "requiresSecondRead", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RadReportFilterDto.prototype, "peerReviewRequired", void 0);
class RadReportListDto {
    page = 1;
    limit = 10;
    sortBy = 'createdAt';
    sortOrder = false;
}
exports.RadReportListDto = RadReportListDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    IsNumber(),
    __metadata("design:type", Number)
], RadReportListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    IsNumber(),
    __metadata("design:type", Number)
], RadReportListDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RadReportListDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RadReportListDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=rad-reports.dto.js.map