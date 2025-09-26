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
exports.MedicationAdministration = exports.MedicationStatus = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
const admission_entity_1 = require("./admission.entity");
var MedicationStatus;
(function (MedicationStatus) {
    MedicationStatus["PENDING"] = "PENDING";
    MedicationStatus["ADMINISTERED"] = "ADMINISTERED";
    MedicationStatus["REFUSED"] = "REFUSED";
    MedicationStatus["MISSED"] = "MISSED";
    MedicationStatus["HOLD"] = "HOLD";
    MedicationStatus["CANCELLED"] = "CANCELLED";
})(MedicationStatus || (exports.MedicationStatus = MedicationStatus = {}));
let MedicationAdministration = class MedicationAdministration {
    id;
    patientId;
    patient;
    admissionId;
    admission;
    medicationOrderId;
    medicationName;
    dosage;
    route;
    frequency;
    scheduledTime;
    status;
    administeredAt;
    administeredById;
    administeredBy;
    notes;
    vitalSigns;
    isPRN;
    prnReason;
    isStat;
    createdAt;
    updatedAt;
    auditLog;
};
exports.MedicationAdministration = MedicationAdministration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patientId' }),
    __metadata("design:type", typeof (_a = typeof patient_entity_1.Patient !== "undefined" && patient_entity_1.Patient) === "function" ? _a : Object)
], MedicationAdministration.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "admissionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => admission_entity_1.Admission),
    (0, typeorm_1.JoinColumn)({ name: 'admissionId' }),
    __metadata("design:type", admission_entity_1.Admission)
], MedicationAdministration.prototype, "admission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "medicationOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "medicationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "dosage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], MedicationAdministration.prototype, "scheduledTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MedicationStatus, default: MedicationStatus.PENDING }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MedicationAdministration.prototype, "administeredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "administeredById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'administeredById' }),
    __metadata("design:type", typeof (_b = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _b : Object)
], MedicationAdministration.prototype, "administeredBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], MedicationAdministration.prototype, "vitalSigns", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MedicationAdministration.prototype, "isPRN", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], MedicationAdministration.prototype, "prnReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MedicationAdministration.prototype, "isStat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], MedicationAdministration.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], MedicationAdministration.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], MedicationAdministration.prototype, "auditLog", void 0);
exports.MedicationAdministration = MedicationAdministration = __decorate([
    (0, typeorm_1.Entity)('medication_administrations')
], MedicationAdministration);
//# sourceMappingURL=medication-administration.entity.js.map