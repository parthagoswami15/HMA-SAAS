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
exports.Prescription = exports.PrescriptionItem = exports.DosageInstruction = exports.DurationUnit = exports.FrequencyUnit = exports.PrescriptionType = exports.PrescriptionStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
var PrescriptionStatus;
(function (PrescriptionStatus) {
    PrescriptionStatus["DRAFT"] = "DRAFT";
    PrescriptionStatus["ACTIVE"] = "ACTIVE";
    PrescriptionStatus["COMPLETED"] = "COMPLETED";
    PrescriptionStatus["CANCELLED"] = "CANCELLED";
    PrescriptionStatus["EXPIRED"] = "EXPIRED";
})(PrescriptionStatus || (exports.PrescriptionStatus = PrescriptionStatus = {}));
var PrescriptionType;
(function (PrescriptionType) {
    PrescriptionType["MEDICATION"] = "MEDICATION";
    PrescriptionType["LAB_TEST"] = "LAB_TEST";
    PrescriptionType["IMAGING"] = "IMAGING";
    PrescriptionType["PROCEDURE"] = "PROCEDURE";
    PrescriptionType["DIET"] = "DIET";
    PrescriptionType["OTHER"] = "OTHER";
})(PrescriptionType || (exports.PrescriptionType = PrescriptionType = {}));
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
class DosageInstruction {
    dose;
    unit;
    frequency;
    frequencyCount;
    n;
    route;
    timing;
    instructions;
}
exports.DosageInstruction = DosageInstruction;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dose quantity (e.g., 1, 2.5)' }),
    __metadata("design:type", Number)
], DosageInstruction.prototype, "dose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dose unit (e.g., mg, ml, tablet)' }),
    __metadata("design:type", String)
], DosageInstruction.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: FrequencyUnit, description: 'Frequency unit for administration' }),
    __metadata("design:type", String)
], DosageInstruction.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of times per frequency unit (e.g., 3 times per day)' }),
    __metadata("design:type", Number)
], DosageInstruction.prototype, "frequencyCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Route of administration (e.g., oral, IV, topical)' }),
    __metadata("design:type", String)
], DosageInstruction.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specific timing instructions (e.g., before meals, at bedtime)' }),
    __metadata("design:type", String)
], DosageInstruction.prototype, "timing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional instructions for administration' }),
    __metadata("design:type", String)
], DosageInstruction.prototype, "instructions", void 0);
class PrescriptionItem {
    id;
    itemId;
    itemName;
    itemType;
    status;
    dosage;
    durationValue;
    durationUnit;
    quantity;
    quantityUnit;
    datePrescribed;
    startDate;
    endDate;
    notes;
    allowGeneric;
    isRefill;
    refillsAllowed;
    refillsUsed;
    createdAt;
    updatedAt;
}
exports.PrescriptionItem = PrescriptionItem;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the prescription item' }),
    __metadata("design:type", String)
], PrescriptionItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the medication, test, or procedure' }),
    __metadata("design:type", String)
], PrescriptionItem.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the medication, test, or procedure' }),
    __metadata("design:type", String)
], PrescriptionItem.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PrescriptionType, description: 'Type of prescription item' }),
    __metadata("design:type", String)
], PrescriptionItem.prototype, "itemType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PrescriptionStatus, default: PrescriptionStatus.ACTIVE }),
    __metadata("design:type", String)
], PrescriptionItem.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DosageInstruction, description: 'Dosage instructions' }),
    __metadata("design:type", DosageInstruction)
], PrescriptionItem.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration value (e.g., 7 for 7 days)' }),
    __metadata("design:type", Number)
], PrescriptionItem.prototype, "durationValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DurationUnit, description: 'Duration unit' }),
    __metadata("design:type", String)
], PrescriptionItem.prototype, "durationUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total quantity to dispense', required: false }),
    __metadata("design:type", Number)
], PrescriptionItem.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit of the quantity (e.g., tablets, ml, mg)', required: false }),
    __metadata("design:type", String)
], PrescriptionItem.prototype, "quantityUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the prescription was issued', type: Date }),
    __metadata("design:type", Date)
], PrescriptionItem.prototype, "datePrescribed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the prescription becomes active', type: Date, required: false }),
    __metadata("design:type", Date)
], PrescriptionItem.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the prescription expires', type: Date, required: false }),
    __metadata("design:type", Date)
], PrescriptionItem.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the prescription', required: false }),
    __metadata("design:type", String)
], PrescriptionItem.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether to use generic substitution if available', default: true }),
    __metadata("design:type", Boolean)
], PrescriptionItem.prototype, "allowGeneric", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is a refill of a previous prescription', default: false }),
    __metadata("design:type", Boolean)
], PrescriptionItem.prototype, "isRefill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of refills allowed', default: 0 }),
    __metadata("design:type", Number)
], PrescriptionItem.prototype, "refillsAllowed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of refills already used', default: 0 }),
    __metadata("design:type", Number)
], PrescriptionItem.prototype, "refillsUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the record was created', type: Date }),
    __metadata("design:type", Date)
], PrescriptionItem.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the record was last updated', type: Date }),
    __metadata("design:type", Date)
], PrescriptionItem.prototype, "updatedAt", void 0);
class Prescription {
    id;
    visitId;
    patientId;
    providerId;
    facilityId;
    items;
    status;
    datePrescribed;
    notes;
    createdAt;
    updatedAt;
}
exports.Prescription = Prescription;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the prescription' }),
    __metadata("design:type", String)
], Prescription.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit ID this prescription is associated with' }),
    __metadata("design:type", String)
], Prescription.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID this prescription is for' }),
    __metadata("design:type", String)
], Prescription.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider (staff) ID who prescribed this' }),
    __metadata("design:type", String)
], Prescription.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Facility ID where the prescription was issued' }),
    __metadata("design:type", String)
], Prescription.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PrescriptionItem], description: 'List of prescribed items' }),
    __metadata("design:type", Array)
], Prescription.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PrescriptionStatus, default: PrescriptionStatus.ACTIVE }),
    __metadata("design:type", String)
], Prescription.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the prescription was issued', type: Date }),
    __metadata("design:type", Date)
], Prescription.prototype, "datePrescribed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the prescription', required: false }),
    __metadata("design:type", String)
], Prescription.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the record was created', type: Date }),
    __metadata("design:type", Date)
], Prescription.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the record was last updated', type: Date }),
    __metadata("design:type", Date)
], Prescription.prototype, "updatedAt", void 0);
//# sourceMappingURL=prescription.entity.js.map