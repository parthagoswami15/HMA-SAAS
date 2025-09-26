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
exports.Diagnosis = exports.DiagnosisType = exports.DiagnosisStatus = void 0;
const typeorm_1 = require("typeorm");
const icd10_code_entity_1 = require("./icd10-code.entity");
const encounter_entity_1 = require("./encounter.entity");
const patient_entity_1 = require("../../patient/entities/patient.entity");
const staff_entity_1 = require("../../staff-management/entities/staff.entity");
var DiagnosisStatus;
(function (DiagnosisStatus) {
    DiagnosisStatus["ACTIVE"] = "active";
    DiagnosisStatus["RESOLVED"] = "resolved";
    DiagnosisStatus["RULED_OUT"] = "ruled_out";
    DiagnosisStatus["CHRONIC"] = "chronic";
    DiagnosisStatus["RECURRED"] = "recurred";
})(DiagnosisStatus || (exports.DiagnosisStatus = DiagnosisStatus = {}));
var DiagnosisType;
(function (DiagnosisType) {
    DiagnosisType["PRIMARY"] = "primary";
    DiagnosisType["SECONDARY"] = "secondary";
    DiagnosisType["ADMISSION"] = "admission";
    DiagnosisType["DISCHARGE"] = "discharge";
    DiagnosisType["CHRONIC"] = "chronic";
    DiagnosisType["PROCEDURAL"] = "procedural";
})(DiagnosisType || (exports.DiagnosisType = DiagnosisType = {}));
let Diagnosis = class Diagnosis {
    id;
    patientId;
    icd10Code;
    encounterId;
    recordedById;
    status;
    type;
    isPrimary;
    onsetDate;
    resolvedDate;
    notes;
    metadata;
    createdAt;
    updatedAt;
    updatedById;
    icd10;
    patient;
    encounter;
    recordedBy;
    updatedBy;
    isActive() {
        return this.status === DiagnosisStatus.ACTIVE || this.status === DiagnosisStatus.CHRONIC;
    }
    resolve(resolvedDate = new Date()) {
        this.status = DiagnosisStatus.RESOLVED;
        this.resolvedDate = resolvedDate;
    }
    reactivate() {
        if (this.status === DiagnosisStatus.RESOLVED || this.status === DiagnosisStatus.RULED_OUT) {
            this.status = DiagnosisStatus.RECURRED;
            this.resolvedDate = null;
        }
    }
};
exports.Diagnosis = Diagnosis;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Diagnosis.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Diagnosis.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Diagnosis.prototype, "icd10Code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Diagnosis.prototype, "encounterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Diagnosis.prototype, "recordedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DiagnosisStatus, default: DiagnosisStatus.ACTIVE }),
    __metadata("design:type", String)
], Diagnosis.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DiagnosisType, default: DiagnosisType.SECONDARY }),
    __metadata("design:type", String)
], Diagnosis.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Diagnosis.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Diagnosis.prototype, "onsetDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Diagnosis.prototype, "resolvedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Diagnosis.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Diagnosis.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Diagnosis.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Diagnosis.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Diagnosis.prototype, "updatedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => icd10_code_entity_1.Icd10Code, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'icd10Code', referencedColumnName: 'code' }),
    __metadata("design:type", icd10_code_entity_1.Icd10Code)
], Diagnosis.prototype, "icd10", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patientId' }),
    __metadata("design:type", patient_entity_1.Patient)
], Diagnosis.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => encounter_entity_1.Encounter, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'encounterId' }),
    __metadata("design:type", Object)
], Diagnosis.prototype, "encounter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'recordedById' }),
    __metadata("design:type", Object)
], Diagnosis.prototype, "recordedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'updatedById' }),
    __metadata("design:type", Object)
], Diagnosis.prototype, "updatedBy", void 0);
exports.Diagnosis = Diagnosis = __decorate([
    (0, typeorm_1.Entity)('diagnoses')
], Diagnosis);
//# sourceMappingURL=diagnosis.entity.js.map