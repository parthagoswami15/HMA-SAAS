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
exports.CreatePrescriptionDto = exports.PrescriptionItemDto = exports.PrescriptionItemType = exports.DurationUnit = exports.FrequencyUnit = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var FrequencyUnit;
(function (FrequencyUnit) {
    FrequencyUnit["HOUR"] = "HOUR";
    FrequencyUnit["DAY"] = "DAY";
    FrequencyUnit["WEEK"] = "WEEK";
    FrequencyUnit["MONTH"] = "MONTH";
    FrequencyUnit["AS_NEEDED"] = "AS_NEEDED";
})(FrequencyUnit || (exports.FrequencyUnit = FrequencyUnit = {}));
var DurationUnit;
(function (DurationUnit) {
    DurationUnit["DAY"] = "DAY";
    DurationUnit["WEEK"] = "WEEK";
    DurationUnit["MONTH"] = "MONTH";
    DurationUnit["YEAR"] = "YEAR";
    DurationUnit["INDEFINITE"] = "INDEFINITE";
})(DurationUnit || (exports.DurationUnit = DurationUnit = {}));
var PrescriptionItemType;
(function (PrescriptionItemType) {
    PrescriptionItemType["MEDICATION"] = "MEDICATION";
    PrescriptionItemType["LAB_TEST"] = "LAB_TEST";
    PrescriptionItemType["IMAGING"] = "IMAGING";
    PrescriptionItemType["PROCEDURE"] = "PROCEDURE";
    PrescriptionItemType["DIET"] = "DIET";
    PrescriptionItemType["OTHER"] = "OTHER";
})(PrescriptionItemType || (exports.PrescriptionItemType = PrescriptionItemType = {}));
class DosageInstructionDto {
    dose;
    unit;
    frequency;
    frequencyCount;
    route;
    timing;
    instructions;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dose quantity (e.g., 1, 2.5)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    __metadata("design:type", Number)
], DosageInstructionDto.prototype, "dose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dose unit (e.g., mg, ml, tablet)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DosageInstructionDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: FrequencyUnit,
        description: 'Frequency unit for administration'
    }),
    (0, class_validator_1.IsEnum)(FrequencyUnit),
    __metadata("design:type", String)
], DosageInstructionDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of times per frequency unit (e.g., 3 times per day)',
        minimum: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DosageInstructionDto.prototype, "frequencyCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Route of administration (e.g., oral, IV, topical)'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DosageInstructionDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specific timing instructions (e.g., before meals, at bedtime)',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DosageInstructionDto.prototype, "timing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional instructions for administration',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DosageInstructionDto.prototype, "instructions", void 0);
class PrescriptionItemDto {
    itemId;
    itemName;
    itemType;
    dosage;
    durationValue;
    durationUnit;
    quantity;
    quantityUnit;
    startDate;
    notes;
    allowGeneric;
    isRefill;
    refillsAllowed;
}
exports.PrescriptionItemDto = PrescriptionItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the medication, test, or procedure' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the medication, test, or procedure' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: PrescriptionItemType,
        description: 'Type of prescription item'
    }),
    (0, class_validator_1.IsEnum)(PrescriptionItemType),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "itemType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DosageInstructionDto, description: 'Dosage instructions' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DosageInstructionDto),
    __metadata("design:type", DosageInstructionDto)
], PrescriptionItemDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Duration value (e.g., 7 for 7 days)',
        minimum: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PrescriptionItemDto.prototype, "durationValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: DurationUnit,
        description: 'Duration unit'
    }),
    (0, class_validator_1.IsEnum)(DurationUnit),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "durationUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total quantity to dispense',
        minimum: 1,
        required: false
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PrescriptionItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unit of the quantity (e.g., tablets, ml, mg)',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "quantityUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the prescription becomes active',
        type: Date,
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], PrescriptionItemDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the prescription',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to use generic substitution if available',
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PrescriptionItemDto.prototype, "allowGeneric", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is a refill of a previous prescription',
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PrescriptionItemDto.prototype, "isRefill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of refills allowed',
        minimum: 0,
        default: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PrescriptionItemDto.prototype, "refillsAllowed", void 0);
class CreatePrescriptionDto {
    visitId;
    providerId;
    items;
    notes;
    datePrescribed;
}
exports.CreatePrescriptionDto = CreatePrescriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit ID this prescription is associated with' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider (staff) ID who prescribed this' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [PrescriptionItemDto],
        description: 'List of prescribed items'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PrescriptionItemDto),
    __metadata("design:type", Array)
], CreatePrescriptionDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the prescription',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the prescription was issued',
        type: Date,
        default: () => new Date().toISOString()
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreatePrescriptionDto.prototype, "datePrescribed", void 0);
//# sourceMappingURL=create-prescription.dto.js.map