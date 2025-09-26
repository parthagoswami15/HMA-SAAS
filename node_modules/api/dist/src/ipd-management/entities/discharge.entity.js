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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discharge = exports.DischargeType = exports.DischargeStatus = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
const admission_entity_1 = require("./admission.entity");
var DischargeStatus;
(function (DischargeStatus) {
    DischargeStatus["INITIATED"] = "INITIATED";
    DischargeStatus["BILLING_PENDING"] = "BILLING_PENDING";
    DischargeStatus["BILLING_COMPLETED"] = "BILLING_COMPLETED";
    DischargeStatus["MEDICATION_PENDING"] = "MEDICATION_PENDING";
    DischargeStatus["COMPLETED"] = "COMPLETED";
    DischargeStatus["CANCELLED"] = "CANCELLED";
})(DischargeStatus || (exports.DischargeStatus = DischargeStatus = {}));
var DischargeType;
(function (DischargeType) {
    DischargeType["ROUTINE"] = "ROUTINE";
    DischargeType["REFERRAL"] = "REFERRAL";
    DischargeType["LAMA"] = "LAMA";
    DischargeType["DAMA"] = "DAMA";
    DischargeType["ABSCONDED"] = "ABSCONDED";
    DischargeType["DECEASED"] = "DECEASED";
})(DischargeType || (exports.DischargeType = DischargeType = {}));
let Discharge = class Discharge {
    id;
    admissionId;
    admission;
    patientId;
    patient;
    dischargedById;
    dischargedBy;
    dischargeType;
    status;
    dischargeDate;
    actualDischargeDate;
    diagnosisAtDischarge;
    proceduresPerformed;
    hospitalCourse;
    conditionAtDischarge;
    followUpPlan;
    patientEducation;
    dischargeMedications;
    followUpAppointments;
    isBillSettled;
    totalBillAmount;
    amountPaid;
    pendingAmount;
    billingNotes;
    cancellationReason;
    cancelledById;
    cancelledBy;
    cancelledAt;
    isDeathCase;
    deathDetails;
    createdAt;
    updatedAt;
    auditLog;
};
exports.Discharge = Discharge;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Discharge.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Discharge.prototype, "admissionId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => admission_entity_1.Admission, admission => admission.discharge, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'admissionId' }),
    __metadata("design:type", admission_entity_1.Admission)
], Discharge.prototype, "admission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Discharge.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patientId' }),
    __metadata("design:type", typeof (_a = typeof patient_entity_1.Patient !== "undefined" && patient_entity_1.Patient) === "function" ? _a : Object)
], Discharge.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Discharge.prototype, "dischargedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff),
    (0, typeorm_1.JoinColumn)({ name: 'dischargedById' }),
    __metadata("design:type", typeof (_b = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _b : Object)
], Discharge.prototype, "dischargedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DischargeType }),
    __metadata("design:type", String)
], Discharge.prototype, "dischargeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DischargeStatus, default: DischargeStatus.INITIATED }),
    __metadata("design:type", String)
], Discharge.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Discharge.prototype, "dischargeDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Discharge.prototype, "actualDischargeDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Discharge.prototype, "diagnosisAtDischarge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Discharge.prototype, "proceduresPerformed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Discharge.prototype, "hospitalCourse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Discharge.prototype, "conditionAtDischarge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Discharge.prototype, "followUpPlan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Discharge.prototype, "patientEducation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Discharge.prototype, "dischargeMedications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Discharge.prototype, "followUpAppointments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Discharge.prototype, "isBillSettled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Discharge.prototype, "totalBillAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Discharge.prototype, "amountPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Discharge.prototype, "pendingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Discharge.prototype, "billingNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Discharge.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Discharge.prototype, "cancelledById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'cancelledById' }),
    __metadata("design:type", typeof (_c = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _c : Object)
], Discharge.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Discharge.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Discharge.prototype, "isDeathCase", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Discharge.prototype, "deathDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Discharge.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Discharge.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Discharge.prototype, "auditLog", void 0);
exports.Discharge = Discharge = __decorate([
    (0, typeorm_1.Entity)('discharges')
], Discharge);
//# sourceMappingURL=discharge.entity.js.map