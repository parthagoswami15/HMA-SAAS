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
exports.CreateBillDto = exports.PaymentDto = exports.BillItemDto = exports.BillItemType = exports.BillStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var BillStatus;
(function (BillStatus) {
    BillStatus["DRAFT"] = "DRAFT";
    BillStatus["PENDING"] = "PENDING";
    BillStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    BillStatus["PAID"] = "PAID";
    BillStatus["CANCELLED"] = "CANCELLED";
    BillStatus["REFUNDED"] = "REFUNDED";
    BillStatus["WRITTEN_OFF"] = "WRITTEN_OFF";
})(BillStatus || (exports.BillStatus = BillStatus = {}));
var BillItemType;
(function (BillItemType) {
    BillItemType["CONSULTATION"] = "CONSULTATION";
    BillItemType["PROCEDURE"] = "PROCEDURE";
    BillItemType["LAB_TEST"] = "LAB_TEST";
    BillItemType["RADIOLOGY"] = "RADIOLOGY";
    BillItemType["MEDICATION"] = "MEDICATION";
    BillItemType["SUPPLY"] = "SUPPLY";
    BillItemType["ROOM"] = "ROOM";
    BillItemType["OTHER"] = "OTHER";
})(BillItemType || (exports.BillItemType = BillItemType = {}));
class BillItemDto {
    itemId;
    name;
    type;
    description;
    quantity;
    unitPrice;
    discount;
    tax;
    total;
    notes;
}
exports.BillItemDto = BillItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the item being billed (e.g., procedure ID, test ID)'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BillItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the item' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BillItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: BillItemType,
        description: 'Type of the billable item'
    }),
    (0, class_validator_1.IsEnum)(BillItemType),
    __metadata("design:type", String)
], BillItemDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the item',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BillItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity of the item',
        minimum: 0.01,
        default: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BillItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unit price of the item',
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], BillItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Discount amount for this item',
        minimum: 0,
        default: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BillItemDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax amount for this item',
        minimum: 0,
        default: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BillItemDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount for this item (quantity * unitPrice - discount + tax)',
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], BillItemDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about this item',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BillItemDto.prototype, "notes", void 0);
class PaymentDto {
    amount;
    paymentMethod;
    transactionId;
    paymentDate;
    notes;
}
exports.PaymentDto = PaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment amount',
        minimum: 0.01
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], PaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method (e.g., CASH, CARD, INSURANCE, BANK_TRANSFER)',
        example: 'CASH'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction reference number',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment date and time',
        type: Date,
        default: () => new Date().toISOString()
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], PaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the payment',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "notes", void 0);
class CreateBillDto {
    visitId;
    patientId;
    items;
    subtotal;
    discount;
    tax;
    total;
    amountPaid;
    balance;
    status;
    dueDate;
    payments;
    notes;
    insurance;
}
exports.CreateBillDto = CreateBillDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit ID this bill is associated with' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID this bill is for' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBillDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [BillItemDto],
        description: 'List of items being billed'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BillItemDto),
    __metadata("design:type", Array)
], CreateBillDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subtotal amount before discounts and taxes',
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBillDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total discount amount',
        minimum: 0,
        default: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBillDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total tax amount',
        minimum: 0,
        default: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBillDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total bill amount (subtotal - discount + tax)',
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBillDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount paid so far',
        minimum: 0,
        default: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBillDto.prototype, "amountPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Outstanding balance',
        minimum: 0,
        default: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBillDto.prototype, "balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: BillStatus,
        description: 'Status of the bill',
        default: BillStatus.PENDING
    }),
    (0, class_validator_1.IsEnum)(BillStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBillDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Due date for payment',
        type: Date,
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateBillDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [PaymentDto],
        description: 'List of payments made towards this bill',
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateBillDto.prototype, "payments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the bill',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBillDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Insurance information',
        type: 'object',
        required: false
    }),
    IsObject(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBillDto.prototype, "insurance", void 0);
//# sourceMappingURL=create-bill.dto.js.map