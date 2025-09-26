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
exports.CreateEncounterDiagnosisDto = exports.CreatePatientDiagnosisDto = exports.CreateDiagnosisDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const diagnosis_entity_1 = require("../../entities/diagnosis.entity");
class CreateDiagnosisDto {
    icd10Code;
    type = diagnosis_entity_1.DiagnosisType.SECONDARY;
    isPrimary = false;
    onsetDate;
    status = diagnosis_entity_1.DiagnosisStatus.ACTIVE;
    notes;
    metadata;
}
exports.CreateDiagnosisDto = CreateDiagnosisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ICD-10 code for the diagnosis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "icd10Code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: diagnosis_entity_1.DiagnosisType, default: 'secondary' }),
    (0, class_validator_1.IsEnum)(diagnosis_entity_1.DiagnosisType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether this is the primary diagnosis', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDiagnosisDto.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date when the condition was first observed', format: 'date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "onsetDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: diagnosis_entity_1.DiagnosisStatus, default: 'active' }),
    (0, class_validator_1.IsEnum)(diagnosis_entity_1.DiagnosisStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes about the diagnosis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDiagnosisDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom metadata for the diagnosis' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], CreateDiagnosisDto.prototype, "metadata", void 0);
class CreatePatientDiagnosisDto extends CreateDiagnosisDto {
    patientId;
    encounterId;
}
exports.CreatePatientDiagnosisDto = CreatePatientDiagnosisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the patient' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDiagnosisDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the encounter this diagnosis is associated with' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePatientDiagnosisDto.prototype, "encounterId", void 0);
class CreateEncounterDiagnosisDto extends CreateDiagnosisDto {
    encounterId;
}
exports.CreateEncounterDiagnosisDto = CreateEncounterDiagnosisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the encounter' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEncounterDiagnosisDto.prototype, "encounterId", void 0);
//# sourceMappingURL=create-diagnosis.dto.js.map