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
exports.NursingChart = exports.VitalSigns = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
var VitalSigns;
(function (VitalSigns) {
    VitalSigns["TEMPERATURE"] = "TEMPERATURE";
    VitalSigns["PULSE"] = "PULSE";
    VitalSigns["RESPIRATION"] = "RESPIRATION";
    VitalSigns["BLOOD_PRESSURE"] = "BLOOD_PRESSURE";
    VitalSigns["OXYGEN_SATURATION"] = "OXYGEN_SATURATION";
    VitalSigns["PAIN_SCORE"] = "PAIN_SCORE";
    VitalSigns["GLUCOSE_LEVEL"] = "GLUCOSE_LEVEL";
    VitalSigns["GCS"] = "GCS";
    VitalSigns["HEIGHT"] = "HEIGHT";
    VitalSigns["WEIGHT"] = "WEIGHT";
    VitalSigns["BMI"] = "BMI";
})(VitalSigns || (exports.VitalSigns = VitalSigns = {}));
let NursingChart = class NursingChart {
    id;
    patientId;
    patient;
    recordedById;
    recordedBy;
    vitalSign;
    value;
    unit;
    notes;
    additionalData;
    recordedAt;
    updatedAt;
    isDeleted;
};
exports.NursingChart = NursingChart;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NursingChart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], NursingChart.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patientId' }),
    __metadata("design:type", typeof (_a = typeof patient_entity_1.Patient !== "undefined" && patient_entity_1.Patient) === "function" ? _a : Object)
], NursingChart.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], NursingChart.prototype, "recordedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff),
    (0, typeorm_1.JoinColumn)({ name: 'recordedById' }),
    __metadata("design:type", typeof (_b = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _b : Object)
], NursingChart.prototype, "recordedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: VitalSigns }),
    __metadata("design:type", String)
], NursingChart.prototype, "vitalSign", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], NursingChart.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], NursingChart.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NursingChart.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], NursingChart.prototype, "additionalData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], NursingChart.prototype, "recordedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], NursingChart.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NursingChart.prototype, "isDeleted", void 0);
exports.NursingChart = NursingChart = __decorate([
    (0, typeorm_1.Entity)('nursing_charts')
], NursingChart);
//# sourceMappingURL=nursing-chart.entity.js.map