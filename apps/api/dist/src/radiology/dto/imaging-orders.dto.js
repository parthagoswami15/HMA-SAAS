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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagingOrderListDto = exports.ImagingOrderFilterDto = exports.ScheduleImagingOrderDto = exports.UpdateImagingOrderDto = exports.CreateImagingOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateImagingOrderDto {
    visitId;
    patientId;
    modalityType;
    modalityId;
    protocol;
    bodyPart;
    clinicalHistory;
    priority;
    contrastType;
    contrastAgent;
    contrastVolume;
    contrastAllergy;
    allergyDetails;
    isPregnant;
    pregnancyDetails;
    isInpatient;
    isolationRequired;
    specialInstructions;
    previousStudies;
    cumulativeDose;
}
exports.CreateImagingOrderDto = CreateImagingOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient visit ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID', required: true }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ModalityType, description: 'Imaging modality type' }),
    (0, class_validator_1.IsEnum)(client_1.ModalityType),
    __metadata("design:type", typeof (_a = typeof client_1.ModalityType !== "undefined" && client_1.ModalityType) === "function" ? _a : Object)
], CreateImagingOrderDto.prototype, "modalityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specific modality ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "modalityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Imaging protocol' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "protocol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Body part being imaged' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "bodyPart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinical indication' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "clinicalHistory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ImagingPriority, default: client_1.ImagingPriority.ROUTINE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ImagingPriority),
    __metadata("design:type", typeof (_b = typeof client_1.ImagingPriority !== "undefined" && client_1.ImagingPriority) === "function" ? _b : Object)
], CreateImagingOrderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contrast type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ContrastType),
    __metadata("design:type", typeof (_c = typeof client_1.ContrastType !== "undefined" && client_1.ContrastType) === "function" ? _c : Object)
], CreateImagingOrderDto.prototype, "contrastType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contrast agent name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "contrastAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contrast volume' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "contrastVolume", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Has contrast allergy' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateImagingOrderDto.prototype, "contrastAllergy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Allergy details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "allergyDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is patient pregnant' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateImagingOrderDto.prototype, "isPregnant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pregnancy details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "pregnancyDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is inpatient' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateImagingOrderDto.prototype, "isInpatient", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Requires isolation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateImagingOrderDto.prototype, "isolationRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Special instructions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "specialInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Previous relevant studies' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImagingOrderDto.prototype, "previousStudies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cumulative radiation dose (mSv)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateImagingOrderDto.prototype, "cumulativeDose", void 0);
class UpdateImagingOrderDto {
    modalityType;
    modalityId;
    protocol;
    bodyPart;
    clinicalHistory;
    priority;
    status;
    scheduledFor;
    contrastType;
    contrastAgent;
    contrastVolume;
    contrastAllergy;
    allergyDetails;
    isPregnant;
    pregnancyDetails;
    isInpatient;
    isolationRequired;
    specialInstructions;
    previousStudies;
    cumulativeDose;
}
exports.UpdateImagingOrderDto = UpdateImagingOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ModalityType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ModalityType),
    __metadata("design:type", typeof (_d = typeof client_1.ModalityType !== "undefined" && client_1.ModalityType) === "function" ? _d : Object)
], UpdateImagingOrderDto.prototype, "modalityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "modalityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "protocol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "bodyPart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "clinicalHistory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ImagingPriority }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ImagingPriority),
    __metadata("design:type", typeof (_e = typeof client_1.ImagingPriority !== "undefined" && client_1.ImagingPriority) === "function" ? _e : Object)
], UpdateImagingOrderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ImagingOrderStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ImagingOrderStatus),
    __metadata("design:type", typeof (_f = typeof client_1.ImagingOrderStatus !== "undefined" && client_1.ImagingOrderStatus) === "function" ? _f : Object)
], UpdateImagingOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled date/time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "scheduledFor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ContrastType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ContrastType),
    __metadata("design:type", typeof (_g = typeof client_1.ContrastType !== "undefined" && client_1.ContrastType) === "function" ? _g : Object)
], UpdateImagingOrderDto.prototype, "contrastType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "contrastAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "contrastVolume", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateImagingOrderDto.prototype, "contrastAllergy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "allergyDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateImagingOrderDto.prototype, "isPregnant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "pregnancyDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateImagingOrderDto.prototype, "isInpatient", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateImagingOrderDto.prototype, "isolationRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "specialInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImagingOrderDto.prototype, "previousStudies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateImagingOrderDto.prototype, "cumulativeDose", void 0);
class ScheduleImagingOrderDto {
    scheduledFor;
    modalityId;
    scheduledBy;
}
exports.ScheduleImagingOrderDto = ScheduleImagingOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Scheduled date/time', required: true }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScheduleImagingOrderDto.prototype, "scheduledFor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specific modality ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ScheduleImagingOrderDto.prototype, "modalityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User scheduling the appointment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ScheduleImagingOrderDto.prototype, "scheduledBy", void 0);
class ImagingOrderFilterDto {
    status;
    modalityType;
    priority;
    patientId;
    dateFrom;
    dateTo;
    contrastAllergy;
    isPregnant;
}
exports.ImagingOrderFilterDto = ImagingOrderFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ImagingOrderStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ImagingOrderStatus),
    __metadata("design:type", typeof (_h = typeof client_1.ImagingOrderStatus !== "undefined" && client_1.ImagingOrderStatus) === "function" ? _h : Object)
], ImagingOrderFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ModalityType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ModalityType),
    __metadata("design:type", typeof (_j = typeof client_1.ModalityType !== "undefined" && client_1.ModalityType) === "function" ? _j : Object)
], ImagingOrderFilterDto.prototype, "modalityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ImagingPriority }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ImagingPriority),
    __metadata("design:type", typeof (_k = typeof client_1.ImagingPriority !== "undefined" && client_1.ImagingPriority) === "function" ? _k : Object)
], ImagingOrderFilterDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ImagingOrderFilterDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ImagingOrderFilterDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ImagingOrderFilterDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ImagingOrderFilterDto.prototype, "contrastAllergy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ImagingOrderFilterDto.prototype, "isPregnant", void 0);
class ImagingOrderListDto {
    page = 1;
    limit = 10;
    sortBy = 'orderedAt';
    sortOrder = false;
}
exports.ImagingOrderListDto = ImagingOrderListDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ImagingOrderListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ImagingOrderListDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImagingOrderListDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ImagingOrderListDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=imaging-orders.dto.js.map