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
exports.UpdateBillDto = exports.UpdatePaymentDto = exports.UpdateBillItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_bill_dto_1 = require("./create-bill.dto");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateBillItemDto extends create_bill_dto_1.BillItemDto {
    id;
    isCancelled;
    cancellationReason;
}
exports.UpdateBillItemDto = UpdateBillItemDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the bill item (for updates)',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Whether this item is cancelled',
        default: false
    }),
    IsBoolean(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBillItemDto.prototype, "isCancelled", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Reason for cancellation if applicable',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillItemDto.prototype, "cancellationReason", void 0);
class UpdatePaymentDto extends create_bill_dto_1.PaymentDto {
    id;
    isRefunded;
    refundAmount;
    refundDate;
    refundReason;
}
exports.UpdatePaymentDto = UpdatePaymentDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the payment (for updates)',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Whether this payment is refunded',
        default: false
    }),
    IsBoolean(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePaymentDto.prototype, "isRefunded", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Refund amount if applicable',
        minimum: 0,
        required: false
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePaymentDto.prototype, "refundAmount", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Refund date and time',
        type: Date,
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdatePaymentDto.prototype, "refundDate", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Reason for refund if applicable',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "refundReason", void 0);
class UpdateBillDto extends (0, swagger_1.PartialType)(create_bill_dto_1.CreateBillDto) {
    status;
    items;
    payments;
    paidAt;
    paidById;
    cancellationReason;
    cancelledAt;
    cancelledById;
    writeOffReason;
    writtenOffAt;
    writtenOffById;
}
exports.UpdateBillDto = UpdateBillDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        enum: create_bill_dto_1.BillStatus,
        description: 'Updated status of the bill',
    }),
    IsEnum(create_bill_dto_1.BillStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        type: [UpdateBillItemDto],
        description: 'Updated list of bill items',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateBillItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateBillDto.prototype, "items", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        type: [UpdatePaymentDto],
        description: 'Updated list of payments',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdatePaymentDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateBillDto.prototype, "payments", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date and time when the bill was paid in full',
        type: Date,
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateBillDto.prototype, "paidAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the staff who marked the bill as paid',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillDto.prototype, "paidById", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Reason for cancellation if applicable',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillDto.prototype, "cancellationReason", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date and time when the bill was cancelled',
        type: Date,
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateBillDto.prototype, "cancelledAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the staff who cancelled the bill',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillDto.prototype, "cancelledById", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Reason for write-off if applicable',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillDto.prototype, "writeOffReason", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date and time when the bill was written off',
        type: Date,
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateBillDto.prototype, "writtenOffAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'ID of the staff who wrote off the bill',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBillDto.prototype, "writtenOffById", void 0);
//# sourceMappingURL=update-bill.dto.js.map