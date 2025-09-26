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
exports.Order = exports.OrderItem = exports.OrderType = exports.OrderPriority = exports.OrderStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
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
var OrderPriority;
(function (OrderPriority) {
    OrderPriority["ROUTINE"] = "ROUTINE";
    OrderPriority["URGENT"] = "URGENT";
    OrderPriority["STAT"] = "STAT";
    OrderPriority["ASAP"] = "ASAP";
})(OrderPriority || (exports.OrderPriority = OrderPriority = {}));
var OrderType;
(function (OrderType) {
    OrderType["LAB_TEST"] = "LAB_TEST";
    OrderType["RADIOLOGY"] = "RADIOLOGY";
    OrderType["PROCEDURE"] = "PROCEDURE";
    OrderType["MEDICATION"] = "MEDICATION";
    OrderType["CONSULT"] = "CONSULT";
    OrderType["NURSING"] = "NURSING";
    OrderType["OTHER"] = "OTHER";
})(OrderType || (exports.OrderType = OrderType = {}));
class OrderItem {
    id;
    itemId;
    itemName;
    itemType;
    quantity;
    instructions;
    status;
    result;
    completedAt;
    completedById;
    notes;
}
exports.OrderItem = OrderItem;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the order item' }),
    __metadata("design:type", String)
], OrderItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the item being ordered' }),
    __metadata("design:type", String)
], OrderItem.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the item being ordered' }),
    __metadata("design:type", String)
], OrderItem.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrderType, description: 'Type of order item' }),
    __metadata("design:type", String)
], OrderItem.prototype, "itemType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity of the item', default: 1 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Instructions for this order item', required: false }),
    __metadata("design:type", String)
], OrderItem.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrderStatus, default: OrderStatus.REQUESTED }),
    __metadata("design:type", String)
], OrderItem.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Result or findings for this order item', required: false }),
    __metadata("design:type", String)
], OrderItem.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the item was completed', type: Date, required: false }),
    __metadata("design:type", Date)
], OrderItem.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID who completed this item', required: false }),
    __metadata("design:type", String)
], OrderItem.prototype, "completedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notes about this order item', required: false }),
    __metadata("design:type", String)
], OrderItem.prototype, "notes", void 0);
class Order {
    id;
    visitId;
    patientId;
    providerId;
    facilityId;
    departmentId;
    items;
    status;
    priority;
    clinicalNotes;
    diagnosisCode;
    diagnosisDescription;
    orderDate;
    completedAt;
    completedById;
    notes;
    createdAt;
    updatedAt;
}
exports.Order = Order;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier for the order' }),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit ID this order is associated with' }),
    __metadata("design:type", String)
], Order.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID this order is for' }),
    __metadata("design:type", String)
], Order.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider (staff) ID who created this order' }),
    __metadata("design:type", String)
], Order.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Facility ID where the order was created' }),
    __metadata("design:type", String)
], Order.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID where the order was created' }),
    __metadata("design:type", String)
], Order.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OrderItem], description: 'List of items in this order' }),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrderStatus, default: OrderStatus.REQUESTED }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrderPriority, default: OrderPriority.ROUTINE }),
    __metadata("design:type", String)
], Order.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Clinical notes related to this order', required: false }),
    __metadata("design:type", String)
], Order.prototype, "clinicalNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diagnosis code related to this order', required: false }),
    __metadata("design:type", String)
], Order.prototype, "diagnosisCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diagnosis description', required: false }),
    __metadata("design:type", String)
], Order.prototype, "diagnosisDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the order was created', type: Date }),
    __metadata("design:type", Date)
], Order.prototype, "orderDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the order was completed', type: Date, required: false }),
    __metadata("design:type", Date)
], Order.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID who completed the order', required: false }),
    __metadata("design:type", String)
], Order.prototype, "completedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes about the order', required: false }),
    __metadata("design:type", String)
], Order.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the record was created', type: Date }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the record was last updated', type: Date }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
//# sourceMappingURL=order.entity.js.map