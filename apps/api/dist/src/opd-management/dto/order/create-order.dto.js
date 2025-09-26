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
exports.CreateOrderDto = exports.OrderItemDto = exports.OrderItemType = exports.OrderPriority = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var OrderPriority;
(function (OrderPriority) {
    OrderPriority["ROUTINE"] = "ROUTINE";
    OrderPriority["URGENT"] = "URGENT";
    OrderPriority["STAT"] = "STAT";
    OrderPriority["ASAP"] = "ASAP";
})(OrderPriority || (exports.OrderPriority = OrderPriority = {}));
var OrderItemType;
(function (OrderItemType) {
    OrderItemType["LAB_TEST"] = "LAB_TEST";
    OrderItemType["RADIOLOGY"] = "RADIOLOGY";
    OrderItemType["PROCEDURE"] = "PROCEDURE";
    OrderItemType["MEDICATION"] = "MEDICATION";
    OrderItemType["CONSULT"] = "CONSULT";
    OrderItemType["NURSING"] = "NURSING";
    OrderItemType["OTHER"] = "OTHER";
})(OrderItemType || (exports.OrderItemType = OrderItemType = {}));
class OrderItemDto {
    itemId;
    itemName;
    itemType;
    quantity;
    instructions;
    priority;
}
exports.OrderItemDto = OrderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the item being ordered' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the item being ordered' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: OrderItemType,
        description: 'Type of order item'
    }),
    (0, class_validator_1.IsEnum)(OrderItemType),
    __metadata("design:type", String)
], OrderItemDto.prototype, "itemType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantity of the item',
        default: 1,
        minimum: 1
    }),
    IsNumber(),
    Min(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Instructions for this order item',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority for this specific item',
        enum: OrderPriority,
        default: OrderPriority.ROUTINE,
        required: false
    }),
    (0, class_validator_1.IsEnum)(OrderPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "priority", void 0);
class CreateOrderDto {
    visitId;
    providerId;
    departmentId;
    items;
    priority;
    clinicalNotes;
    diagnosisCode;
    diagnosisDescription;
    dueDate;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit ID this order is associated with' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider (staff) ID who created this order' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID where the order was created' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [OrderItemDto],
        description: 'List of items in this order'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: OrderPriority,
        description: 'Overall priority for the order',
        default: OrderPriority.ROUTINE
    }),
    (0, class_validator_1.IsEnum)(OrderPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clinical notes related to this order',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "clinicalNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Diagnosis code related to this order',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "diagnosisCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Diagnosis description',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "diagnosisDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date and time when the order should be completed',
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateOrderDto.prototype, "dueDate", void 0);
//# sourceMappingURL=create-order.dto.js.map