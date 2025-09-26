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
exports.AdmissionDocumentDto = exports.CreateAdmissionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const admission_type_enum_1 = require("../../enums/admission-type.enum");
class CreateAdmissionDto {
    patientId;
    admittingDoctorId;
    bedId;
    admissionType;
    admissionDate;
    diagnosis;
    admissionNotes;
    insuranceInfo;
    documents;
}
exports.CreateAdmissionDto = CreateAdmissionDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "admittingDoctorId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "bedId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(admission_type_enum_1.AdmissionType),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "admissionType", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateAdmissionDto.prototype, "admissionDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "admissionNotes", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAdmissionDto.prototype, "insuranceInfo", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AdmissionDocumentDto),
    __metadata("design:type", Array)
], CreateAdmissionDto.prototype, "documents", void 0);
class AdmissionDocumentDto {
    type;
    url;
    notes;
}
exports.AdmissionDocumentDto = AdmissionDocumentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionDocumentDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionDocumentDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdmissionDocumentDto.prototype, "notes", void 0);
//# sourceMappingURL=create-admission.dto.js.map