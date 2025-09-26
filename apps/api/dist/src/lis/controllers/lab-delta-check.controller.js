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
exports.LabDeltaCheckController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_delta_check_service_1 = require("../services/lab-delta-check.service");
const lab_delta_check_dto_1 = require("../dto/lab-delta-check.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabDeltaCheckController = class LabDeltaCheckController {
    labDeltaCheckService;
    constructor(labDeltaCheckService) {
        this.labDeltaCheckService = labDeltaCheckService;
    }
    async performDeltaChecks(patientId, results) {
        return this.labDeltaCheckService.performDeltaChecks(patientId, results);
    }
    async getDeltaCheckHistory(patientId, analyte, limit) {
        return this.labDeltaCheckService.getDeltaCheckHistory(patientId, analyte, limit);
    }
    async createDeltaCheckAlert(alertDto) {
        await this.labDeltaCheckService.createDeltaCheckAlert(alertDto.patientId, {
            analyte: alertDto.analyte,
            currentValue: alertDto.currentValue,
            previousValue: alertDto.previousValue,
            delta: alertDto.currentValue - alertDto.previousValue,
            deltaPercentage: alertDto.deltaPercentage,
            threshold: 20,
            isSignificant: alertDto.deltaPercentage > 20,
            previousDate: new Date(),
            currentDate: new Date(),
        });
        return { message: 'Delta check alert created successfully' };
    }
    async getDeltaCheckConfigs() {
        return this.labDeltaCheckService.getDeltaCheckConfigs();
    }
    async updateDeltaCheckConfig(analyte, configDto) {
        return this.labDeltaCheckService.updateDeltaCheckConfig(analyte, configDto);
    }
    async getSignificantDeltaChecks(patientId, days) {
        return this.labDeltaCheckService.getSignificantDeltaChecks(patientId, days);
    }
    async performDeltaChecksForOrder(orderId) {
        const order = await this.labDeltaCheckService['prisma'].labOrder.findUnique({
            where: { id: orderId },
            include: { patient: true, results: true },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        const currentResults = await this.labDeltaCheckService['prisma'].labResult.findMany({
            where: { orderId },
        });
        const deltaChecks = await this.labDeltaCheckService.performDeltaChecks(order.patientId, currentResults);
        for (const deltaCheck of deltaChecks) {
            await this.labDeltaCheckService.createDeltaCheckAlert(order.patientId, deltaCheck);
        }
        return {
            message: `Delta checks completed. Found ${deltaChecks.length} significant changes.`,
            deltaChecks,
        };
    }
};
exports.LabDeltaCheckController = LabDeltaCheckController;
__decorate([
    (0, common_1.Post)('evaluate/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform delta checks for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delta checks performed successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Body)('results')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], LabDeltaCheckController.prototype, "performDeltaChecks", null);
__decorate([
    (0, common_1.Get)('history/:patientId/:analyte'),
    (0, swagger_1.ApiOperation)({ summary: 'Get delta check history for an analyte' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delta check history retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Param)('analyte')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], LabDeltaCheckController.prototype, "getDeltaCheckHistory", null);
__decorate([
    (0, common_1.Post)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a delta check alert' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Delta check alert created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lab_delta_check_dto_1.DeltaCheckAlertDto]),
    __metadata("design:returntype", Promise)
], LabDeltaCheckController.prototype, "createDeltaCheckAlert", null);
__decorate([
    (0, common_1.Get)('configs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all delta check configurations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delta check configurations retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabDeltaCheckController.prototype, "getDeltaCheckConfigs", null);
__decorate([
    (0, common_1.Put)('configs/:analyte'),
    (0, swagger_1.ApiOperation)({ summary: 'Update delta check configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delta check configuration updated successfully' }),
    __param(0, (0, common_1.Param)('analyte')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_delta_check_dto_1.UpdateDeltaCheckConfigDto]),
    __metadata("design:returntype", Promise)
], LabDeltaCheckController.prototype, "updateDeltaCheckConfig", null);
__decorate([
    (0, common_1.Get)('significant/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get significant delta checks for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Significant delta checks retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], LabDeltaCheckController.prototype, "getSignificantDeltaChecks", null);
__decorate([
    (0, common_1.Post)('evaluate-order/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform delta checks for an order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delta checks for order completed successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabDeltaCheckController.prototype, "performDeltaChecksForOrder", null);
exports.LabDeltaCheckController = LabDeltaCheckController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Delta Checks'),
    (0, common_1.Controller)('lab/delta-checks'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_delta_check_service_1.LabDeltaCheckService])
], LabDeltaCheckController);
//# sourceMappingURL=lab-delta-check.controller.js.map