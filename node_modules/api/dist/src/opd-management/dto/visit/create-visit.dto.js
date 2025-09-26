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
exports.CreateVisitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const visit_enum_1 = require("../../enums/visit.enum");
class CreateVisitDto {
    patientId;
    type;
    scheduledAt;
    chiefComplaint;
    referredById;
    referralNotes;
    notes;
    metadata;
}
exports.CreateVisitDto = CreateVisitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID for the visit' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of visit',
        enum: visit_enum_1.VisitType,
        default: visit_enum_1.VisitType.OPD
    }),
    (0, class_validator_1.IsEnum)(visit_enum_1.VisitType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scheduled date and time for the visit',
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateVisitDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chief complaint or reason for visit',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "chiefComplaint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the referring doctor',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "referredById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Referral notes',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "referralNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the visit',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom metadata for the visit',
        type: 'object',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateVisitDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-visit.dto.js.map