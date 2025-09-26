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
exports.Visit = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const patient_entity_1 = require("../../../patient/entities/patient.entity");
const staff_entity_1 = require("../../../staff-management/entities/staff.entity");
const enums_1 = require("../enums");
const vitals_entity_1 = require("./vitals.entity");
let Visit = class Visit extends base_entity_1.BaseEntity {
    id;
    patient;
    patientId;
    doctor;
    doctorId;
    type;
    status;
    registeredAt;
    scheduledAt;
    startedAt;
    completedAt;
    chiefComplaint;
    registeredBy;
    registeredById;
    notes;
    metadata;
    vitals;
};
exports.Visit = Visit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the visit' }),
    __metadata("design:type", String)
], Visit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient, (patient) => patient.visits),
    (0, swagger_1.ApiProperty)({ description: 'Patient this visit belongs to' }),
    __metadata("design:type", typeof (_a = typeof patient_entity_1.Patient !== "undefined" && patient_entity_1.Patient) === "function" ? _a : Object)
], Visit.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Visit.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, (staff) => staff.visits),
    (0, swagger_1.ApiProperty)({ description: 'Doctor assigned to this visit' }),
    __metadata("design:type", typeof (_b = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _b : Object)
], Visit.prototype, "doctor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Visit.prototype, "doctorId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.VisitType,
        default: enums_1.VisitType.OPD
    }),
    (0, swagger_1.ApiProperty)({ enum: enums_1.VisitType, default: enums_1.VisitType.OPD }),
    __metadata("design:type", String)
], Visit.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.VisitStatus,
        default: enums_1.VisitStatus.REGISTERED
    }),
    (0, swagger_1.ApiProperty)({ enum: enums_1.VisitStatus, default: enums_1.VisitStatus.REGISTERED }),
    __metadata("design:type", String)
], Visit.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the visit was registered', type: Date }),
    __metadata("design:type", Date)
], Visit.prototype, "registeredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Scheduled date and time for the visit', type: Date, required: false }),
    __metadata("design:type", Date)
], Visit.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the visit started', type: Date, required: false }),
    __metadata("design:type", Date)
], Visit.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the visit was completed', type: Date, required: false }),
    __metadata("design:type", Date)
], Visit.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Reason for the visit', required: false }),
    __metadata("design:type", String)
], Visit.prototype, "chiefComplaint", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff),
    (0, swagger_1.ApiProperty)({ description: 'Staff who registered the visit', required: false }),
    __metadata("design:type", typeof (_c = typeof staff_entity_1.Staff !== "undefined" && staff_entity_1.Staff) === "function" ? _c : Object)
], Visit.prototype, "registeredBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "registeredById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the visit', required: false }),
    __metadata("design:type", String)
], Visit.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    (0, swagger_1.ApiProperty)({ description: 'Metadata for the visit', type: Object, required: false }),
    __metadata("design:type", Object)
], Visit.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vitals_entity_1.Vitals, (vitals) => vitals.visit, { cascade: true }),
    __metadata("design:type", Array)
], Visit.prototype, "vitals", void 0);
exports.Visit = Visit = __decorate([
    (0, typeorm_1.Entity)('visits')
], Visit);
//# sourceMappingURL=visit.entity.js.map