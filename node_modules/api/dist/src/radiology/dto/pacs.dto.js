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
exports.DicomImageDto = exports.DicomSeriesDto = exports.DicomStudyDto = exports.RetrieveDicomDto = exports.QueryDicomDto = exports.StoreDicomDto = exports.DicomQueryLevel = exports.DicomStorageClass = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var DicomStorageClass;
(function (DicomStorageClass) {
    DicomStorageClass["CT_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.2";
    DicomStorageClass["MR_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.4";
    DicomStorageClass["US_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.6.1";
    DicomStorageClass["CR_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.1";
    DicomStorageClass["DX_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.1.1";
    DicomStorageClass["MG_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.1.2";
    DicomStorageClass["NM_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.20";
    DicomStorageClass["PT_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.128";
    DicomStorageClass["XA_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.12.1";
    DicomStorageClass["RF_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.12.2";
    DicomStorageClass["US_MULTIFRAME_IMAGE_STORAGE"] = "1.2.840.10008.5.1.4.1.1.3.1";
})(DicomStorageClass || (exports.DicomStorageClass = DicomStorageClass = {}));
var DicomQueryLevel;
(function (DicomQueryLevel) {
    DicomQueryLevel["PATIENT"] = "PATIENT";
    DicomQueryLevel["STUDY"] = "STUDY";
    DicomQueryLevel["SERIES"] = "SERIES";
    DicomQueryLevel["IMAGE"] = "IMAGE";
})(DicomQueryLevel || (exports.DicomQueryLevel = DicomQueryLevel = {}));
class StoreDicomDto {
    studyInstanceUID;
    seriesInstanceUID;
    sopInstanceUID;
    sopClassUID;
    dicomData;
    patientId;
    accessionNumber;
    metadata;
}
exports.StoreDicomDto = StoreDicomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study Instance UID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreDicomDto.prototype, "studyInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Series Instance UID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreDicomDto.prototype, "seriesInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SOP Instance UID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreDicomDto.prototype, "sopInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SOP Class UID (DICOM storage class)', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreDicomDto.prototype, "sopClassUID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'DICOM file content as base64', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreDicomDto.prototype, "dicomData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreDicomDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accession number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreDicomDto.prototype, "accessionNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StoreDicomDto.prototype, "metadata", void 0);
class QueryDicomDto {
    queryLevel;
    patientId;
    patientName;
    studyInstanceUID;
    accessionNumber;
    studyDate;
    modality;
    seriesInstanceUID;
    sopInstanceUID;
    queryParams;
}
exports.QueryDicomDto = QueryDicomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DicomQueryLevel, description: 'Query level', required: true }),
    (0, class_validator_1.IsEnum)(DicomQueryLevel),
    __metadata("design:type", String)
], QueryDicomDto.prototype, "queryLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryDicomDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryDicomDto.prototype, "patientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Study Instance UID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryDicomDto.prototype, "studyInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accession number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryDicomDto.prototype, "accessionNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Study date (YYYYMMDD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryDicomDto.prototype, "studyDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Modality' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryDicomDto.prototype, "modality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Series Instance UID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryDicomDto.prototype, "seriesInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'SOP Instance UID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryDicomDto.prototype, "sopInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional query parameters' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], QueryDicomDto.prototype, "queryParams", void 0);
class RetrieveDicomDto {
    studyInstanceUID;
    seriesInstanceUID;
    sopInstanceUID;
    includeBulkData;
}
exports.RetrieveDicomDto = RetrieveDicomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study Instance UID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RetrieveDicomDto.prototype, "studyInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Series Instance UID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RetrieveDicomDto.prototype, "seriesInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'SOP Instance UID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RetrieveDicomDto.prototype, "sopInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include bulk data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RetrieveDicomDto.prototype, "includeBulkData", void 0);
class DicomStudyDto {
    studyInstanceUID;
    accessionNumber;
    studyDate;
    studyTime;
    studyDescription;
    patientName;
    patientId;
    modalitiesInStudy;
    numberOfStudyRelatedSeries;
    numberOfStudyRelatedInstances;
}
exports.DicomStudyDto = DicomStudyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study Instance UID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomStudyDto.prototype, "studyInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accession number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomStudyDto.prototype, "accessionNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Study date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomStudyDto.prototype, "studyDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Study time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomStudyDto.prototype, "studyTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Study description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomStudyDto.prototype, "studyDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomStudyDto.prototype, "patientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomStudyDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Modalities in study' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomStudyDto.prototype, "modalitiesInStudy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of study related series' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomStudyDto.prototype, "numberOfStudyRelatedSeries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of study related instances' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomStudyDto.prototype, "numberOfStudyRelatedInstances", void 0);
class DicomSeriesDto {
    seriesInstanceUID;
    seriesNumber;
    modality;
    seriesDate;
    seriesTime;
    seriesDescription;
    bodyPartExamined;
    numberOfSeriesRelatedInstances;
}
exports.DicomSeriesDto = DicomSeriesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Series Instance UID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomSeriesDto.prototype, "seriesInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Series number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomSeriesDto.prototype, "seriesNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Modality' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomSeriesDto.prototype, "modality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Series date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomSeriesDto.prototype, "seriesDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Series time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomSeriesDto.prototype, "seriesTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Series description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomSeriesDto.prototype, "seriesDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Body part examined' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomSeriesDto.prototype, "bodyPartExamined", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of series related instances' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomSeriesDto.prototype, "numberOfSeriesRelatedInstances", void 0);
class DicomImageDto {
    sopInstanceUID;
    instanceNumber;
    sopClassUID;
    rows;
    columns;
}
exports.DicomImageDto = DicomImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SOP Instance UID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomImageDto.prototype, "sopInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Instance number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomImageDto.prototype, "instanceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'SOP Class UID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomImageDto.prototype, "sopClassUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rows' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomImageDto.prototype, "rows", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Columns' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DicomImageDto.prototype, "columns", void 0);
//# sourceMappingURL=pacs.dto.js.map