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
exports.Surgery = exports.SurgeryType = exports.SurgeryStatus = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
const admission_entity_1 = require("./admission.entity");
var SurgeryStatus;
(function (SurgeryStatus) {
    SurgeryStatus["SCHEDULED"] = "SCHEDULED";
    SurgeryStatus["IN_PROGRESS"] = "IN_PROGRESS";
    SurgeryStatus["COMPLETED"] = "COMPLETED";
    SurgeryStatus["CANCELLED"] = "CANCELLED";
    SurgeryStatus["POSTPONED"] = "POSTPONED";
})(SurgeryStatus || (exports.SurgeryStatus = SurgeryStatus = {}));
var SurgeryType;
(function (SurgeryType) {
    SurgeryType["MAJOR"] = "MAJOR";
    SurgeryType["MINOR"] = "MINOR";
    SurgeryType["INTERVENTIONAL"] = "INTERVENTIONAL";
    SurgeryType["DIAGNOSTIC"] = "DIAGNOSTIC";
})(SurgeryType || (exports.SurgeryType = SurgeryType = {}));
let Surgery = class Surgery {
    id;
    patientId;
    patient;
    admissionId;
    admission;
    procedureName;
    description;
    type;
    status;
    scheduledDate;
    estimatedDuration;
    surgeonId;
    surgeon;
    anesthetistId;
    anesthetist;
    assistantSurgeonId;
    assistantSurgeon;
    theaterRoom;
    preOpDiagnosis;
    postOpDiagnosis;
    procedureNotes;
    anesthesiaNotes;
    complications;
    implants;
    consumables;
    startTime;
    endTime;
    outcome;
    createdAt;
    updatedAt;
    auditLog;
};
exports.Surgery = Surgery;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Surgery.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Surgery.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patientId' }),
    __metadata("design:type", typeof (_a = typeof patient_entity_1.Patient !== "undefined" && patient_entity_1.Patient) === "function" ? _a : Object)
], Surgery.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Surgery.prototype, "admissionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => admission_entity_1.Admission),
    (0, typeorm_1.JoinColumn)({ name: 'admissionId' }),
    __metadata("design:type", admission_entity_1.Admission)
], Surgery.prototype, "admission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Surgery.prototype, "procedureName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SurgeryType }),
    __metadata("design:type", String)
], Surgery.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SurgeryStatus, default: SurgeryStatus.SCHEDULED }),
    __metadata("design:type", String)
], Surgery.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Surgery.prototype, "scheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Surgery.prototype, "estimatedDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Surgery.prototype, "surgeonId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff),
    (0, typeorm_1.JoinColumn)({ name: 'surgeonId' }),
    __metadata("design:type", typeof (_b = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _b : Object)
], Surgery.prototype, "surgeon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "anesthetistId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'anesthetistId' }),
    __metadata("design:type", typeof (_c = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _c : Object)
], Surgery.prototype, "anesthetist", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "assistantSurgeonId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assistantSurgeonId' }),
    __metadata("design:type", typeof (_d = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _d : Object)
], Surgery.prototype, "assistantSurgeon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "theaterRoom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Surgery.prototype, "preOpDiagnosis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Surgery.prototype, "postOpDiagnosis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "procedureNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "anesthesiaNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Surgery.prototype, "complications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Surgery.prototype, "implants", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Surgery.prototype, "consumables", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Surgery.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Surgery.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Surgery.prototype, "outcome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Surgery.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Surgery.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Surgery.prototype, "auditLog", void 0);
exports.Surgery = Surgery = __decorate([
    (0, typeorm_1.Entity)('surgeries')
], Surgery);
//# sourceMappingURL=surgery.entity.js.map