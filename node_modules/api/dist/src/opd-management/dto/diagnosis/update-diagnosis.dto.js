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
exports.ReactivateDiagnosisDto = exports.ResolveDiagnosisDto = exports.UpdateDiagnosisDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_diagnosis_dto_1 = require("./create-diagnosis.dto");
const diagnosis_entity_1 = require("../../entities/diagnosis.entity");
class UpdateDiagnosisDto extends (0, swagger_1.PartialType)(create_diagnosis_dto_1.CreateDiagnosisDto) {
    status;
    resolvedDate;
    isPrimary;
    notes;
    metadata;
    encounterId;
}
exports.UpdateDiagnosisDto = UpdateDiagnosisDto;
__decorate([
    (0, class_validator_1.IsEnum)(diagnosis_entity_1.DiagnosisStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDiagnosisDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDiagnosisDto.prototype, "resolvedDate", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDiagnosisDto.prototype, "isPrimary", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDiagnosisDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], UpdateDiagnosisDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDiagnosisDto.prototype, "encounterId", void 0);
class ResolveDiagnosisDto {
    resolvedDate = new Date().toISOString();
    notes;
}
exports.ResolveDiagnosisDto = ResolveDiagnosisDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResolveDiagnosisDto.prototype, "resolvedDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResolveDiagnosisDto.prototype, "notes", void 0);
class ReactivateDiagnosisDto {
    notes;
}
exports.ReactivateDiagnosisDto = ReactivateDiagnosisDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReactivateDiagnosisDto.prototype, "notes", void 0);
//# sourceMappingURL=update-diagnosis.dto.js.map