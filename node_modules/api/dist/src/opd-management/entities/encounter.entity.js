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
exports.Encounter = exports.Vitals = exports.Diagnosis = exports.SOAPNote = void 0;
const swagger_1 = require("@nestjs/swagger");
class SOAPNote {
    subjective;
    objective;
    assessment;
    plan;
}
exports.SOAPNote = SOAPNote;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subjective information from the patient' }),
    __metadata("design:type", String)
], SOAPNote.prototype, "subjective", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Objective findings from examination' }),
    __metadata("design:type", String)
], SOAPNote.prototype, "objective", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assessment and diagnosis' }),
    __metadata("design:type", String)
], SOAPNote.prototype, "assessment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan for treatment and follow-up' }),
    __metadata("design:type", String)
], SOAPNote.prototype, "plan", void 0);
class Diagnosis {
    code;
    description;
    isPrimary;
    notes;
}
exports.Diagnosis = Diagnosis;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ICD-10 code' }),
    __metadata("design:type", String)
], Diagnosis.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the diagnosis' }),
    __metadata("design:type", String)
], Diagnosis.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is the primary diagnosis', default: false }),
    __metadata("design:type", Boolean)
], Diagnosis.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the diagnosis', required: false }),
    __metadata("design:type", String)
], Diagnosis.prototype, "notes", void 0);
class Vitals {
    bloodPressure;
    heartRate;
    temperature;
    respiratoryRate;
    oxygenSaturation;
    weight;
    height;
    bmi;
    painLevel;
}
exports.Vitals = Vitals;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Blood pressure (systolic/diastolic)', example: '120/80', required: false }),
    __metadata("design:type", String)
], Vitals.prototype, "bloodPressure", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Heart rate (bpm)', example: 72, required: false }),
    __metadata("design:type", Number)
], Vitals.prototype, "heartRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Temperature in Celsius', example: 36.8, required: false }),
    __metadata("design:type", Number)
], Vitals.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Respiratory rate (breaths per minute)', example: 16, required: false }),
    __metadata("design:type", Number)
], Vitals.prototype, "respiratoryRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Oxygen saturation percentage', example: 98, required: false }),
    __metadata("design:type", Number)
], Vitals.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Weight in kg', example: 70.5, required: false }),
    __metadata("design:type", Number)
], Vitals.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Height in cm', example: 170, required: false }),
    __metadata("design:type", Number)
], Vitals.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'BMI (Body Mass Index)', example: 24.2, required: false }),
    __metadata("design:type", Number)
], Vitals.prototype, "bmi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pain level (0-10)', example: 2, required: false }),
    __metadata("design:type", Number)
], Vitals.prototype, "painLevel", void 0);
class Encounter {
    id;
    visitId;
    providerId;
    startTime;
    endTime;
    encounterType;
    soapNote;
    diagnoses;
    vitals;
    notes;
    createdAt;
    updatedAt;
}
exports.Encounter = Encounter;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the encounter' }),
    __metadata("design:type", String)
], Encounter.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit ID this encounter belongs to' }),
    __metadata("design:type", String)
], Encounter.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider (staff) ID who is handling this encounter' }),
    __metadata("design:type", String)
], Encounter.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date and time of the encounter', type: Date }),
    __metadata("design:type", Date)
], Encounter.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date and time of the encounter', type: Date, required: false }),
    __metadata("design:type", Date)
], Encounter.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of encounter (initial, follow-up, procedure, etc.)' }),
    __metadata("design:type", String)
], Encounter.prototype, "encounterType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SOAPNote, description: 'SOAP note for this encounter' }),
    __metadata("design:type", SOAPNote)
], Encounter.prototype, "soapNote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Diagnosis], description: 'List of diagnoses for this encounter' }),
    __metadata("design:type", Array)
], Encounter.prototype, "diagnoses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Vitals, description: 'Vital signs recorded during this encounter', required: false }),
    __metadata("design:type", Vitals)
], Encounter.prototype, "vitals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the encounter', required: false }),
    __metadata("design:type", String)
], Encounter.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the record was created', type: Date }),
    __metadata("design:type", Date)
], Encounter.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the record was last updated', type: Date }),
    __metadata("design:type", Date)
], Encounter.prototype, "updatedAt", void 0);
//# sourceMappingURL=encounter.entity.js.map