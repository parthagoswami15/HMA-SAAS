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
exports.CreateEncounterDiagnosisDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const diagnosis_entity_1 = require("../../entities/diagnosis.entity");
class CreateEncounterDiagnosisDto {
    encounterId;
    icd10Code;
    status = diagnosis_entity_1.DiagnosisStatus.ACTIVE;
    type = diagnosis_entity_1.DiagnosisType.PROVISIONAL;
    isPrimary = false;
    isChronic = false;
    isExternalCause = false;
    diagnosisDate = new Date().toISOString();
    onsetDate;
    notes;
    severity;
    bodySite;
    metadata;
}
exports.CreateEncounterDiagnosisDto = CreateEncounterDiagnosisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Encounter ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEncounterDiagnosisDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ICD-10 code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEncounterDiagnosisDto.prototype, "icd10Code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Diagnosis status',
        enum: diagnosis_entity_1.DiagnosisStatus,
        default: diagnosis_entity_1.DiagnosisStatus.ACTIVE
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(diagnosis_entity_1.DiagnosisStatus),
    __metadata("design:type", String)
], CreateEncounterDiagnosisDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Diagnosis type',
        enum: diagnosis_entity_1.DiagnosisType,
        default: diagnosis_entity_1.DiagnosisType.PROVISIONAL
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(diagnosis_entity_1.DiagnosisType),
    __metadata("design:type", String)
], CreateEncounterDiagnosisDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is the primary diagnosis for the encounter',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEncounterDiagnosisDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is a chronic condition',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEncounterDiagnosisDto.prototype, "isChronic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is an external cause of injury',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEncounterDiagnosisDto.prototype, "isExternalCause", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date of diagnosis',
        default: () => new Date().toISOString()
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEncounterDiagnosisDto.prototype, "diagnosisDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Onset date of the condition' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEncounterDiagnosisDto.prototype, "onsetDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinical notes about the diagnosis' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDiagnosisDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Severity of the condition',
        example: 'mild',
        enum: ['mild', 'moderate', 'severe']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDiagnosisDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Body site affected',
        example: 'left arm',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDiagnosisDto.prototype, "bodySite", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata as key-value pairs',
        example: { priority: 'high', followUpRequired: true },
        type: 'object',
        additionalProperties: true
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateEncounterDiagnosisDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-encounter-diagnosis.dto.js.map