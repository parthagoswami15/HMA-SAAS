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
exports.CreateEncounterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SOAPNoteDto {
    subjective;
    objective;
    assessment;
    plan;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subjective information from the patient' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SOAPNoteDto.prototype, "subjective", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Objective findings from examination' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SOAPNoteDto.prototype, "objective", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assessment and diagnosis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SOAPNoteDto.prototype, "assessment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan for treatment and follow-up' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SOAPNoteDto.prototype, "plan", void 0);
class DiagnosisDto {
    code;
    description;
    isPrimary;
    notes;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ICD-10 code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DiagnosisDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the diagnosis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DiagnosisDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is the primary diagnosis', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DiagnosisDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the diagnosis', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DiagnosisDto.prototype, "notes", void 0);
class VitalsDto {
    bloodPressure;
    heartRate;
    temperature;
    respiratoryRate;
    oxygenSaturation;
    weight;
    height;
    painLevel;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Blood pressure (systolic/diastolic)', example: '120/80', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VitalsDto.prototype, "bloodPressure", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Heart rate (bpm)', example: 72, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalsDto.prototype, "heartRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Temperature in Celsius', example: 36.8, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalsDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Respiratory rate (breaths per minute)', example: 16, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalsDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Oxygen saturation percentage', example: 98, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalsDto.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Weight in kg', example: 70.5, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalsDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Height in cm', example: 170, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalsDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pain level (0-10)', example: 2, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalsDto.prototype, "painLevel", void 0);
class CreateEncounterDto {
    visitId;
    providerId;
    encounterType;
    startTime;
    soapNote;
    diagnoses;
    vitals;
    notes;
}
exports.CreateEncounterDto = CreateEncounterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit ID this encounter belongs to' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider (staff) ID who is handling this encounter' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of encounter (initial, follow-up, procedure, etc.)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "encounterType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date and time of the encounter',
        type: Date,
        default: () => new Date().toISOString()
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEncounterDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SOAPNoteDto, description: 'SOAP note for this encounter', required: false }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SOAPNoteDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", SOAPNoteDto)
], CreateEncounterDto.prototype, "soapNote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DiagnosisDto], description: 'List of diagnoses for this encounter', required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DiagnosisDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateEncounterDto.prototype, "diagnoses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: VitalsDto, description: 'Vital signs recorded during this encounter', required: false }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => VitalsDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", VitalsDto)
], CreateEncounterDto.prototype, "vitals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the encounter', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "notes", void 0);
//# sourceMappingURL=create-encounter.dto.js.map