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
exports.UpdatePrescriptionDto = exports.UpdatePrescriptionItemDto = exports.PrescriptionStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_prescription_dto_1 = require("./create-prescription.dto");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var PrescriptionStatus;
(function (PrescriptionStatus) {
    PrescriptionStatus["DRAFT"] = "DRAFT";
    PrescriptionStatus["ACTIVE"] = "ACTIVE";
    PrescriptionStatus["COMPLETED"] = "COMPLETED";
    PrescriptionStatus["CANCELLED"] = "CANCELLED";
    PrescriptionStatus["EXPIRED"] = "EXPIRED";
})(PrescriptionStatus || (exports.PrescriptionStatus = PrescriptionStatus = {}));
class UpdatePrescriptionItemDto extends create_prescription_dto_1.PrescriptionItemDto {
    id;
}
exports.UpdatePrescriptionItemDto = UpdatePrescriptionItemDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'ID of the prescription item (for updates)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePrescriptionItemDto.prototype, "id", void 0);
class UpdatePrescriptionDto extends (0, swagger_1.PartialType)(create_prescription_dto_1.CreatePrescriptionDto) {
    status;
    items;
    filledAt;
    filledById;
    verifiedAt;
    verifiedById;
    cancellationReason;
    cancelledAt;
    cancelledById;
}
exports.UpdatePrescriptionDto = UpdatePrescriptionDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        enum: PrescriptionStatus,
        description: 'Status of the prescription',
    }),
    (0, class_validator_1.IsEnum)(PrescriptionStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        type: [UpdatePrescriptionItemDto],
        description: 'List of prescribed items to update',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdatePrescriptionItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdatePrescriptionDto.prototype, "items", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date when the prescription was filled',
        type: Date,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdatePrescriptionDto.prototype, "filledAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the pharmacist who filled the prescription',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "filledById", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date when the prescription was verified',
        type: Date,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdatePrescriptionDto.prototype, "verifiedAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the staff who verified the prescription',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "verifiedById", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Reason for cancellation if applicable',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "cancellationReason", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date when the prescription was cancelled',
        type: Date,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdatePrescriptionDto.prototype, "cancelledAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the staff who cancelled the prescription',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "cancelledById", void 0);
//# sourceMappingURL=update-prescription.dto.js.map