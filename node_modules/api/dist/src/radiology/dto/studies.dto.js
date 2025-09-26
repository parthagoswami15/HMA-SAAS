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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyListDto = exports.StudyFilterDto = exports.UpdateStudyDto = exports.CreateStudyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateStudyDto {
    orderId;
    studyInstanceUID;
    accessionNumber;
    studyDate;
    studyTime;
    studyDescription;
    procedureCode;
    modalityType;
    performingPhysician;
    readingPhysician;
    dicomMetadata;
}
exports.CreateStudyDto = CreateStudyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Imaging order ID', required: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStudyDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'DICOM Study Instance UID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudyDto.prototype, "studyInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'DICOM Accession Number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudyDto.prototype, "accessionNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study date', required: true }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateStudyDto.prototype, "studyDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Study time (HHMMSS)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudyDto.prototype, "studyTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Study description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudyDto.prototype, "studyDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'CPT/Procedure code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStudyDto.prototype, "procedureCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ModalityType, description: 'Study modality type' }),
    (0, class_validator_1.IsEnum)(client_1.ModalityType),
    __metadata("design:type", typeof (_a = typeof client_1.ModalityType !== "undefined" && client_1.ModalityType) === "function" ? _a : Object)
], CreateStudyDto.prototype, "modalityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Performing physician user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStudyDto.prototype, "performingPhysician", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reading radiologist user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStudyDto.prototype, "readingPhysician", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'DICOM metadata as JSON' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateStudyDto.prototype, "dicomMetadata", void 0);
class UpdateStudyDto {
    accessionNumber;
    studyDescription;
    procedureCode;
    status;
    performingPhysician;
    readingPhysician;
    dicomMetadata;
}
exports.UpdateStudyDto = UpdateStudyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'DICOM Accession Number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudyDto.prototype, "accessionNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Study description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudyDto.prototype, "studyDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'CPT/Procedure code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStudyDto.prototype, "procedureCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.StudyStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StudyStatus),
    __metadata("design:type", typeof (_b = typeof client_1.StudyStatus !== "undefined" && client_1.StudyStatus) === "function" ? _b : Object)
], UpdateStudyDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Performing physician user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateStudyDto.prototype, "performingPhysician", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reading radiologist user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateStudyDto.prototype, "readingPhysician", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'DICOM metadata as JSON' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateStudyDto.prototype, "dicomMetadata", void 0);
class StudyFilterDto {
    status;
    modalityType;
    orderId;
    performingPhysician;
    readingPhysician;
    dateFrom;
    dateTo;
}
exports.StudyFilterDto = StudyFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.StudyStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StudyStatus),
    __metadata("design:type", typeof (_c = typeof client_1.StudyStatus !== "undefined" && client_1.StudyStatus) === "function" ? _c : Object)
], StudyFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ModalityType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ModalityType),
    __metadata("design:type", typeof (_d = typeof client_1.ModalityType !== "undefined" && client_1.ModalityType) === "function" ? _d : Object)
], StudyFilterDto.prototype, "modalityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StudyFilterDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StudyFilterDto.prototype, "performingPhysician", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StudyFilterDto.prototype, "readingPhysician", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StudyFilterDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StudyFilterDto.prototype, "dateTo", void 0);
class StudyListDto {
    page = 1;
    limit = 10;
    sortBy = 'studyDate';
    sortOrder = false;
}
exports.StudyListDto = StudyListDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    IsNumber(),
    __metadata("design:type", Number)
], StudyListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    IsNumber(),
    __metadata("design:type", Number)
], StudyListDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StudyListDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], StudyListDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=studies.dto.js.map