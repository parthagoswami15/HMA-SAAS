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
exports.CreateBedDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class CreateBedDto {
    bedNumber;
    name;
    wardId;
    bedClass;
    status = enums_1.BedStatus.AVAILABLE;
    features;
    dailyRate;
    notes;
    isActive = true;
    lastCleanedAt;
    maintenanceScheduledAt;
    maintenanceReason;
    customFields;
    createdById;
}
exports.CreateBedDto = CreateBedDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bed number/identifier',
        example: 'B-101',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBedDto.prototype, "bedNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the bed',
        example: 'Bed 1',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBedDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the ward this bed belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBedDto.prototype, "wardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Class/type of the bed',
        enum: enums_1.BedClass,
        example: enums_1.BedClass.GENERAL,
        required: true
    }),
    (0, class_validator_1.IsEnum)(enums_1.BedClass),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBedDto.prototype, "bedClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Initial status of the bed',
        enum: enums_1.BedStatus,
        example: enums_1.BedStatus.AVAILABLE,
        default: enums_1.BedStatus.AVAILABLE,
        required: false
    }),
    (0, class_validator_1.IsEnum)(enums_1.BedStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBedDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Features and equipment available with the bed',
        required: false,
        example: ['Oxygen', 'Suction', 'Monitor'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateBedDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Daily tariff for the bed',
        required: false,
        example: 150.50,
        type: Number
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBedDto.prototype, "dailyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the bed',
        required: false,
        example: 'Near nursing station, has window view'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBedDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the bed is currently active',
        required: false,
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBedDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the bed was last cleaned',
        required: false,
        type: Date,
        example: '2023-06-15T08:30:00Z'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateBedDto.prototype, "lastCleanedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the bed is scheduled for maintenance',
        required: false,
        type: Date,
        example: '2023-12-01T00:00:00Z'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateBedDto.prototype, "maintenanceScheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for bed maintenance',
        required: false,
        example: 'Routine maintenance and equipment check'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBedDto.prototype, "maintenanceReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom fields for additional bed information',
        required: false,
        example: {
            isWheelchairAccessible: true,
            hasTv: false,
            view: 'Garden view',
            lastDeepCleaned: '2023-05-01T00:00:00Z'
        }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBedDto.prototype, "customFields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the staff member creating this bed record',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174001'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBedDto.prototype, "createdById", void 0);
//# sourceMappingURL=create-bed.dto.js.map