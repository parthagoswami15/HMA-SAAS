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
exports.LabSamplesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_samples_service_1 = require("../services/lab-samples.service");
const lab_order_dto_1 = require("../dto/lab-order.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabSamplesController = class LabSamplesController {
    labSamplesService;
    constructor(labSamplesService) {
        this.labSamplesService = labSamplesService;
    }
    async createSample(createSampleDto) {
        return this.labSamplesService.createSample(createSampleDto);
    }
    async getAllSamples(orderId, sampleType, status, barcode, dateFrom, dateTo) {
        return this.labSamplesService.getAllSamples({
            orderId,
            sampleType,
            status,
            barcode,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
        });
    }
    async getSampleById(id) {
        return this.labSamplesService.getSampleById(id);
    }
    async updateSample(id, updateData) {
        return this.labSamplesService.updateSample(id, updateData);
    }
    async deleteSample(id) {
        return this.labSamplesService.deleteSample(id);
    }
    async collectSample(id, collectedAt) {
        return this.labSamplesService.collectSample(id, collectedAt);
    }
    async receiveSample(id) {
        return this.labSamplesService.receiveSample(id);
    }
    async processSample(id) {
        return this.labSamplesService.processSample(id);
    }
    async storeSample(id) {
        return this.labSamplesService.storeSample(id);
    }
    async disposeSample(id) {
        return this.labSamplesService.disposeSample(id);
    }
    async getSamplesByOrder(orderId) {
        return this.labSamplesService.getSamplesByOrder(orderId);
    }
    async getSamplesByStatus(status) {
        return this.labSamplesService.getSamplesByStatus(status);
    }
    async getSamplesByType(sampleType) {
        return this.labSamplesService.getSamplesByType(sampleType);
    }
    async getExpiredSamples() {
        return this.labSamplesService.getExpiredSamples();
    }
    async generateBarcode(id) {
        return this.labSamplesService.generateBarcode(id);
    }
};
exports.LabSamplesController = LabSamplesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new sample' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sample created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_order_dto_1.CreateSampleDto]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "createSample", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all samples' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Samples retrieved successfully' }),
    __param(0, (0, common_1.Query)('orderId')),
    __param(1, (0, common_1.Query)('sampleType')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('barcode')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "getAllSamples", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sample by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "getSampleById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update sample' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "updateSample", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete sample' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "deleteSample", null);
__decorate([
    (0, common_1.Post)(':id/collect'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark sample as collected' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample marked as collected' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('collectedAt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "collectSample", null);
__decorate([
    (0, common_1.Post)(':id/receive'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark sample as received' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample marked as received' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "receiveSample", null);
__decorate([
    (0, common_1.Post)(':id/process'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark sample as processed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample marked as processed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "processSample", null);
__decorate([
    (0, common_1.Post)(':id/store'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark sample as stored' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample marked as stored' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "storeSample", null);
__decorate([
    (0, common_1.Post)(':id/dispose'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark sample as disposed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample marked as disposed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "disposeSample", null);
__decorate([
    (0, common_1.Get)('order/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get samples by order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Samples retrieved successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "getSamplesByOrder", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get samples by status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Samples retrieved successfully' }),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "getSamplesByStatus", null);
__decorate([
    (0, common_1.Get)('type/:sampleType'),
    (0, swagger_1.ApiOperation)({ summary: 'Get samples by type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Samples retrieved successfully' }),
    __param(0, (0, common_1.Param)('sampleType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "getSamplesByType", null);
__decorate([
    (0, common_1.Get)('expired/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all expired samples' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expired samples retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "getExpiredSamples", null);
__decorate([
    (0, common_1.Get)(':id/barcode'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate barcode for sample' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Barcode generated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabSamplesController.prototype, "generateBarcode", null);
exports.LabSamplesController = LabSamplesController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Samples'),
    (0, common_1.Controller)('lab/samples'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_samples_service_1.LabSamplesService])
], LabSamplesController);
//# sourceMappingURL=lab-samples.controller.js.map