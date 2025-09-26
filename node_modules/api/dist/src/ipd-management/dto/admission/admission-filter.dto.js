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
exports.AdmissionFilterDto = void 0;
const class_validator_1 = require("class-validator");
const admission_type_enum_1 = require("../../enums/admission-type.enum");
const admission_status_enum_1 = require("../../enums/admission-status.enum");
const class_transformer_1 = require("class-transformer");
class AdmissionFilterDto {
    patientId;
    doctorId;
    wardId;
    bedId;
    admissionType;
    status;
    admissionDateFrom;
    admissionDateTo;
    dischargeDateFrom;
    dischargeDateTo;
    activeOnly = true;
    searchTerm;
    page = 1;
    limit = 10;
    sortBy = 'admissionDate';
    sortOrder = 'DESC';
}
exports.AdmissionFilterDto = AdmissionFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "wardId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "bedId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(admission_type_enum_1.AdmissionType),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "admissionType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(admission_status_enum_1.AdmissionStatus),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], AdmissionFilterDto.prototype, "admissionDateFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], AdmissionFilterDto.prototype, "admissionDateTo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], AdmissionFilterDto.prototype, "dischargeDateFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], AdmissionFilterDto.prototype, "dischargeDateTo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], AdmissionFilterDto.prototype, "activeOnly", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    IsString(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "searchTerm", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], AdmissionFilterDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], AdmissionFilterDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    IsString(),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    IsString(),
    (0, class_transformer_1.Transform)(({ value }) => (value === 'asc' ? 'ASC' : 'DESC')),
    __metadata("design:type", String)
], AdmissionFilterDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=admission-filter.dto.js.map