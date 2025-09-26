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
exports.AdmissionResponseDto = void 0;
const class_transformer_1 = require("class-transformer");
const bed_response_dto_1 = require("../../bed-ward/dto/bed-response.dto");
const patient_response_dto_1 = require("../../../patients/dto/patient-response.dto");
const staff_response_dto_1 = require("../../../staff/dto/staff-response.dto");
class AdmissionResponseDto {
    id;
    admissionNumber;
    patient;
    admittingDoctor;
    bed;
    admissionType;
    status;
    admissionDate;
    dischargeDate;
    diagnosis;
    admissionNotes;
    dischargeNotes;
    isSelfDischarge;
    selfDischargeReason;
    insuranceInfo;
    documents;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, {
            id: partial.id,
            admissionNumber: partial.admissionNumber,
            patient: partial.patient ? new patient_response_dto_1.PatientResponseDto(partial.patient) : undefined,
            admittingDoctor: partial.admittingDoctor ? new staff_response_dto_1.StaffResponseDto(partial.admittingDoctor) : undefined,
            bed: partial.bed ? new bed_response_dto_1.BedResponseDto(partial.bed) : undefined,
            admissionType: partial.admissionType,
            status: partial.status,
            admissionDate: partial.admissionDate,
            dischargeDate: partial.dischargeDate,
            diagnosis: partial.diagnosis,
            admissionNotes: partial.admissionNotes,
            dischargeNotes: partial.dischargeNotes,
            isSelfDischarge: partial.isSelfDischarge,
            selfDischargeReason: partial.selfDischargeReason,
            insuranceInfo: partial.insuranceInfo,
            documents: partial.documents,
            createdAt: partial.createdAt,
            updatedAt: partial.updatedAt,
        });
    }
}
exports.AdmissionResponseDto = AdmissionResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "admissionNumber", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => patient_response_dto_1.PatientResponseDto),
    __metadata("design:type", patient_response_dto_1.PatientResponseDto)
], AdmissionResponseDto.prototype, "patient", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => staff_response_dto_1.StaffResponseDto),
    __metadata("design:type", typeof (_a = typeof staff_response_dto_1.StaffResponseDto !== "undefined" && staff_response_dto_1.StaffResponseDto) === "function" ? _a : Object)
], AdmissionResponseDto.prototype, "admittingDoctor", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => bed_response_dto_1.BedResponseDto),
    __metadata("design:type", typeof (_b = typeof bed_response_dto_1.BedResponseDto !== "undefined" && bed_response_dto_1.BedResponseDto) === "function" ? _b : Object)
], AdmissionResponseDto.prototype, "bed", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "admissionType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], AdmissionResponseDto.prototype, "admissionDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], AdmissionResponseDto.prototype, "dischargeDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "admissionNotes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "dischargeNotes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], AdmissionResponseDto.prototype, "isSelfDischarge", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AdmissionResponseDto.prototype, "selfDischargeReason", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], AdmissionResponseDto.prototype, "insuranceInfo", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], AdmissionResponseDto.prototype, "documents", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], AdmissionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], AdmissionResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=admission-response.dto.js.map