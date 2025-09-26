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
exports.Admission = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
const bed_entity_1 = require("./bed.entity");
const discharge_entity_1 = require("./discharge.entity");
const admission_type_enum_1 = require("../enums/admission-type.enum");
const admission_status_enum_1 = require("../enums/admission-status.enum");
const base_entity_1 = require("../../common/entities/base.entity");
let Admission = class Admission extends base_entity_1.BaseEntity {
    patientId;
    patient;
    admittingDoctorId;
    admittingDoctor;
    bedId;
    bed;
    admissionType;
    status;
    admissionDate;
    dischargeDate;
    admissionNotes;
    diagnosis;
    insuranceInfo;
    isSelfDischarge;
    selfDischargeReason;
    discharge;
    createdAt;
    updatedAt;
};
exports.Admission = Admission;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Admission.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patientId' }),
    __metadata("design:type", typeof (_a = typeof patient_entity_1.Patient !== "undefined" && patient_entity_1.Patient) === "function" ? _a : Object)
], Admission.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Admission.prototype, "admittingDoctorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff),
    (0, typeorm_1.JoinColumn)({ name: 'admittingDoctorId' }),
    __metadata("design:type", typeof (_b = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _b : Object)
], Admission.prototype, "admittingDoctor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Admission.prototype, "bedId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bed_entity_1.Bed, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'bedId' }),
    __metadata("design:type", bed_entity_1.Bed)
], Admission.prototype, "bed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: admission_type_enum_1.AdmissionType }),
    __metadata("design:type", String)
], Admission.prototype, "admissionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: admission_status_enum_1.AdmissionStatus, default: admission_status_enum_1.AdmissionStatus.ADMITTED }),
    __metadata("design:type", String)
], Admission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Admission.prototype, "admissionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Admission.prototype, "dischargeDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "admissionNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "diagnosis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Admission.prototype, "insuranceInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Admission.prototype, "isSelfDischarge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Admission.prototype, "selfDischargeReason", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => discharge_entity_1.Discharge, discharge => discharge.admission, { cascade: true }),
    __metadata("design:type", discharge_entity_1.Discharge)
], Admission.prototype, "discharge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Admission.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Admission.prototype, "updatedAt", void 0);
exports.Admission = Admission = __decorate([
    (0, typeorm_1.Entity)('admissions'),
    (0, typeorm_1.Index)(['patientId', 'status']),
    (0, typeorm_1.Index)(['bedId', 'status']),
    (0, typeorm_1.Index)(['admittingDoctorId', 'admissionDate'])
], Admission);
//# sourceMappingURL=admission.entity.js.map