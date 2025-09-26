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
exports.ImagingOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const imaging_orders_service_1 = require("../services/imaging-orders.service");
const imaging_orders_dto_1 = require("../dto/imaging-orders.dto");
let ImagingOrdersController = class ImagingOrdersController {
    imagingOrdersService;
    constructor(imagingOrdersService) {
        this.imagingOrdersService = imagingOrdersService;
    }
    async create(createDto, req) {
        return this.imagingOrdersService.create(createDto, req.user.id);
    }
    async findAll(filterDto, listDto) {
        return this.imagingOrdersService.findAll(filterDto, listDto);
    }
    async findOne(id) {
        return this.imagingOrdersService.findOne(id);
    }
    async update(id, updateDto) {
        return this.imagingOrdersService.update(id, updateDto);
    }
    async schedule(id, scheduleDto) {
        return this.imagingOrdersService.schedule(id, scheduleDto);
    }
    async complete(id) {
        return this.imagingOrdersService.complete(id);
    }
    async cancel(id, reason) {
        return this.imagingOrdersService.cancel(id, reason);
    }
    async getPatientHistory(patientId) {
        return this.imagingOrdersService.getPatientHistory(patientId);
    }
    async getStats(req) {
        return this.imagingOrdersService.getStats(req.user.tenantId);
    }
    async remove(id) {
        throw new Error('Delete functionality not implemented');
    }
};
exports.ImagingOrdersController = ImagingOrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new imaging order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Imaging order created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient or modality not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [imaging_orders_dto_1.CreateImagingOrderDto, Object]),
    __metadata("design:returntype", Promise)
], ImagingOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all imaging orders with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging orders retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [imaging_orders_dto_1.ImagingOrderFilterDto,
        imaging_orders_dto_1.ImagingOrderListDto]),
    __metadata("design:returntype", Promise)
], ImagingOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging order retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imaging order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagingOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update imaging order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging order updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imaging order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, imaging_orders_dto_1.UpdateImagingOrderDto]),
    __metadata("design:returntype", Promise)
], ImagingOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule imaging order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging order scheduled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid scheduling request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imaging order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, imaging_orders_dto_1.ScheduleImagingOrderDto]),
    __metadata("design:returntype", Promise)
], ImagingOrdersController.prototype, "schedule", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark imaging order as completed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging order completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Order cannot be completed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imaging order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagingOrdersController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel imaging order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging order cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Order cannot be cancelled' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imaging order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ImagingOrdersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient imaging history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient imaging history retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagingOrdersController.prototype, "getPatientHistory", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging orders statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImagingOrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete imaging order' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Imaging order deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imaging order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagingOrdersController.prototype, "remove", null);
exports.ImagingOrdersController = ImagingOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Radiology - Imaging Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('radiology/imaging-orders'),
    __metadata("design:paramtypes", [imaging_orders_service_1.ImagingOrdersService])
], ImagingOrdersController);
//# sourceMappingURL=imaging-orders.controller.js.map