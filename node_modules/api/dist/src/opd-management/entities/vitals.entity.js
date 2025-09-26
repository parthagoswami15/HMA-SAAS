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
exports.Vitals = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const visit_entity_1 = require("./visit.entity");
const patient_entity_1 = require("../../../patient/entities/patient.entity");
const staff_entity_1 = require("../../../staff-management/entities/staff.entity");
let Vitals = class Vitals extends base_entity_1.BaseEntity {
    visitId;
    patientId;
    recordedById;
    recordedAt;
    temperature;
    heartRate;
    bloodPressure;
    respiratoryRate;
    oxygenSaturation;
    height;
    weight;
    bmi;
    painScore;
    additionalMetrics;
    notes;
    visit;
    patient;
    recordedBy;
    calculateBMI() {
        if (this.height && this.weight) {
            const heightInMeters = this.height / 100;
            this.bmi = this.weight / (heightInMeters * heightInMeters);
        }
    }
    getBloodPressure() {
        if (!this.bloodPressure)
            return { systolic: null, diastolic: null };
        const [systolic, diastolic] = this.bloodPressure.split('/').map(Number);
        return { systolic, diastolic };
    }
};
exports.Vitals = Vitals;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Vitals.prototype, "visitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Vitals.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Vitals.prototype, "recordedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Vitals.prototype, "recordedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Vitals.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Vitals.prototype, "heartRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Vitals.prototype, "bloodPressure", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Vitals.prototype, "respiratoryRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Vitals.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Vitals.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Vitals.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Vitals.prototype, "bmi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Vitals.prototype, "painScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Vitals.prototype, "additionalMetrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vitals.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => visit_entity_1.Visit, (visit) => visit.vitals, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'visitId' }),
    __metadata("design:type", visit_entity_1.Visit)
], Vitals.prototype, "visit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'patientId' }),
    __metadata("design:type", typeof (_a = typeof patient_entity_1.Patient !== "undefined" && patient_entity_1.Patient) === "function" ? _a : Object)
], Vitals.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'recordedById' }),
    __metadata("design:type", typeof (_b = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _b : Object)
], Vitals.prototype, "recordedBy", void 0);
exports.Vitals = Vitals = __decorate([
    (0, typeorm_1.Entity)('vitals')
], Vitals);
//# sourceMappingURL=vitals.entity.js.map