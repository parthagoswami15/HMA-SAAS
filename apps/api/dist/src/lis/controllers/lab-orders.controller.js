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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_orders_service_1 = require("../services/lab-orders.service");
const lab_order_dto_1 = require("../dto/lab-order.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabOrdersController = class LabOrdersController {
    labOrdersService;
    constructor(labOrdersService) {
        this.labOrdersService = labOrdersService;
    }
    async createOrder(createOrderDto) {
        return this.labOrdersService.createOrder(createOrderDto);
    }
    async getAllOrders(patientId, status, priority, dateFrom, dateTo) {
        return this.labOrdersService.getAllOrders({
            patientId,
            status,
            priority,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
        });
    }
    async getOrderById(id) {
        return this.labOrdersService.getOrderById(id);
    }
    async updateOrder(id, updateOrderDto) {
        return this.labOrdersService.updateOrder(id, updateOrderDto);
    }
    async cancelOrder(id) {
        return this.labOrdersService.cancelOrder(id);
    }
    async collectOrder(id) {
        return this.labOrdersService.collectOrder(id);
    }
    async accessionOrder(id) {
        return this.labOrdersService.accessionOrder(id);
    }
    async generateBarcode(id) {
        return this.labOrdersService.generateBarcode(id);
    }
};
exports.LabOrdersController = LabOrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new lab order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_order_dto_1.CreateLabOrderDto]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lab orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    __param(0, (0, common_1.Query)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('priority')),
    __param(3, (0, common_1.Query)('dateFrom')),
    __param(4, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lab order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_order_dto_1.UpdateLabOrderDto]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel lab order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order cancelled successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Post)(':id/collect'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark order as collected' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order marked as collected' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "collectOrder", null);
__decorate([
    (0, common_1.Post)(':id/accession'),
    (0, swagger_1.ApiOperation)({ summary: 'Accession the order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order accessioned successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "accessionOrder", null);
__decorate([
    (0, common_1.Get)(':id/barcode'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate barcode for order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Barcode generated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabOrdersController.prototype, "generateBarcode", null);
exports.LabOrdersController = LabOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Orders'),
    (0, common_1.Controller)('lab/orders'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_orders_service_1.LabOrdersService])
], LabOrdersController);
//# sourceMappingURL=lab-orders.controller.js.map