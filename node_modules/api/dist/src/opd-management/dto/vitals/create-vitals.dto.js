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
exports.CreateVitalsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateVitalsDto {
    visitId;
    patientId;
    temperature;
    heartRate;
    bloodPressure;
    respiratoryRate;
    oxygenSaturation;
    height;
    weight;
    painScore;
    additionalMetrics;
    notes;
}
exports.CreateVitalsDto = CreateVitalsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the visit', required: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVitalsDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the patient', required: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVitalsDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Body temperature in °C', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(45),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalsDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Heart rate in bpm', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(250),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalsDto.prototype, "heartRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '120/80', description: 'Blood pressure in mmHg', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVitalsDto.prototype, "bloodPressure", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Respiratory rate in breaths per minute', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(60),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalsDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Oxygen saturation in %', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(70),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalsDto.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Height in cm', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(250),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalsDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Weight in kg', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(300),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalsDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pain score (0-10)', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalsDto.prototype, "painScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional vitals metrics', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateVitalsDto.prototype, "additionalMetrics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Clinical notes', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVitalsDto.prototype, "notes", void 0);
//# sourceMappingURL=create-vitals.dto.js.map