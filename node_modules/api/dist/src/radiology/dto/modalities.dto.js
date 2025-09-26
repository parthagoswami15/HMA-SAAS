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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModalityConnectionDto = exports.ModalityWorklistDto = exports.UpdateModalityDto = exports.CreateModalityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateModalityDto {
    name;
    modalityType;
    aeTitle;
    hostname;
    port;
    location;
    manufacturer;
    model;
    description;
    isActive;
}
exports.CreateModalityDto = CreateModalityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Modality name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateModalityDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ModalityType, description: 'Modality type', required: true }),
    (0, class_validator_1.IsEnum)(client_1.ModalityType),
    __metadata("design:type", typeof (_a = typeof client_1.ModalityType !== "undefined" && client_1.ModalityType) === "function" ? _a : Object)
], CreateModalityDto.prototype, "modalityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'DICOM Application Entity Title', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateModalityDto.prototype, "aeTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Modality hostname/IP', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateModalityDto.prototype, "hostname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'DICOM port', default: 104 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateModalityDto.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Room/location' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateModalityDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Manufacturer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateModalityDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Model' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateModalityDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateModalityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is active', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateModalityDto.prototype, "isActive", void 0);
class UpdateModalityDto {
    name;
    modalityType;
    aeTitle;
    hostname;
    port;
    location;
    manufacturer;
    model;
    description;
    isActive;
}
exports.UpdateModalityDto = UpdateModalityDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateModalityDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ModalityType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ModalityType),
    __metadata("design:type", typeof (_b = typeof client_1.ModalityType !== "undefined" && client_1.ModalityType) === "function" ? _b : Object)
], UpdateModalityDto.prototype, "modalityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateModalityDto.prototype, "aeTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateModalityDto.prototype, "hostname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateModalityDto.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateModalityDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateModalityDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateModalityDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateModalityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateModalityDto.prototype, "isActive", void 0);
class ModalityWorklistDto {
    studyId;
    patientName;
    patientId;
    accessionNumber;
    studyInstanceUID;
    worklistData;
}
exports.ModalityWorklistDto = ModalityWorklistDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study ID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModalityWorklistDto.prototype, "studyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient name for MWL', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModalityWorklistDto.prototype, "patientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID for MWL', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModalityWorklistDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accession number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModalityWorklistDto.prototype, "accessionNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study Instance UID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModalityWorklistDto.prototype, "studyInstanceUID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Full MWL entry as JSON' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ModalityWorklistDto.prototype, "worklistData", void 0);
class TestModalityConnectionDto {
    modalityId;
    testMessage;
}
exports.TestModalityConnectionDto = TestModalityConnectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Modality ID to test', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestModalityConnectionDto.prototype, "modalityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Test message' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestModalityConnectionDto.prototype, "testMessage", void 0);
//# sourceMappingURL=modalities.dto.js.map