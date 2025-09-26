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
exports.UpdateBedDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_bed_dto_1 = require("./create-bed.dto");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class UpdateBedDto extends (0, swagger_1.PartialType)(create_bed_dto_1.CreateBedDto) {
    status;
    markAsCleaned = false;
    markAsAvailable = false;
    markForMaintenance = false;
    maintenanceReason;
    maintenanceScheduledAt;
    transferToWardId;
    updateReason;
    updatedById;
    updateBedClass = false;
    updateFeatures = false;
    updateRate = false;
    updateStatus = false;
    updateMaintenance = false;
    transferBed = false;
    updateNotes = false;
    updateCustomFields = false;
}
exports.UpdateBedDto = UpdateBedDto;
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'New status of the bed',
        enum: enums_1.BedStatus,
        required: false,
        example: enums_1.BedStatus.MAINTENANCE
    }),
    (0, class_validator_1.IsEnum)(enums_1.BedStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBedDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to mark the bed as cleaned',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "markAsCleaned", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to mark the bed as available',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "markAsAvailable", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to mark the bed as under maintenance',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "markForMaintenance", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Reason for maintenance',
        required: false,
        example: 'Routine maintenance and equipment check'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBedDto.prototype, "maintenanceReason", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Scheduled date for maintenance',
        required: false,
        type: Date,
        example: '2023-12-01T00:00:00Z'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateBedDto.prototype, "maintenanceScheduledAt", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'ID of the ward to transfer this bed to',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174002'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBedDto.prototype, "transferToWardId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Reason for the update',
        required: false,
        example: 'Routine status update after patient discharge'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBedDto.prototype, "updateReason", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'ID of the staff member performing the update',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174003'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBedDto.prototype, "updatedById", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to update the bed class and related properties',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "updateBedClass", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to update the bed features',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "updateFeatures", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to update the bed rate',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "updateRate", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to update the bed status',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "updateStatus", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to update the bed maintenance information',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "updateMaintenance", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to transfer the bed to another ward',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "transferBed", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to update the bed notes',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "updateNotes", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({
        description: 'Whether to update the bed custom fields',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBedDto.prototype, "updateCustomFields", void 0);
//# sourceMappingURL=update-bed.dto.js.map