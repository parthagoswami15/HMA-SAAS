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
exports.UpdateOrderDto = exports.UpdateOrderItemDto = exports.OrderStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_order_dto_1 = require("./create-order.dto");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DRAFT"] = "DRAFT";
    OrderStatus["REQUESTED"] = "REQUESTED";
    OrderStatus["IN_PROGRESS"] = "IN_PROGRESS";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["REJECTED"] = "REJECTED";
    OrderStatus["FAILED"] = "FAILED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
class UpdateOrderItemDto extends create_order_dto_1.OrderItemDto {
    id;
    status;
    result;
    completedAt;
    completedById;
    notes;
}
exports.UpdateOrderItemDto = UpdateOrderItemDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'ID of the order item (for updates)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        enum: OrderStatus,
        description: 'Status of the order item',
    }),
    (0, class_validator_1.IsEnum)(OrderStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Result or findings for this order item',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderItemDto.prototype, "result", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date and time when the item was completed',
        type: Date,
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateOrderItemDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Staff ID who completed this item',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderItemDto.prototype, "completedById", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Notes about this order item',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderItemDto.prototype, "notes", void 0);
class UpdateOrderDto extends (0, swagger_1.PartialType)(create_order_dto_1.CreateOrderDto) {
    status;
    items;
    completedAt;
    completedById;
    cancellationReason;
    cancelledAt;
    cancelledById;
}
exports.UpdateOrderDto = UpdateOrderDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        enum: OrderStatus,
        description: 'Status of the order',
    }),
    (0, class_validator_1.IsEnum)(OrderStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        type: [UpdateOrderItemDto],
        description: 'List of order items to update',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateOrderItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date and time when the order was completed',
        type: Date,
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateOrderDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Staff ID who completed the order',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "completedById", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Reason for cancellation if applicable',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "cancellationReason", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Date and time when the order was cancelled',
        type: Date,
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateOrderDto.prototype, "cancelledAt", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Staff ID who cancelled the order',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "cancelledById", void 0);
//# sourceMappingURL=update-order.dto.js.map