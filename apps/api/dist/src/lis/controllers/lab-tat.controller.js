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
exports.LabTatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_tat_service_1 = require("../services/lab-tat.service");
const lab_tat_dto_1 = require("../dto/lab-tat.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabTatController = class LabTatController {
    labTatService;
    constructor(labTatService) {
        this.labTatService = labTatService;
    }
    async calculateTAT(orderId) {
        return this.labTatService.calculateTAT(orderId);
    }
    async getTATPerformance(tenantId, startDate, endDate) {
        return this.labTatService.getTATPerformance(tenantId, new Date(startDate), new Date(endDate));
    }
    async checkSLAViolations(tenantId) {
        return this.labTatService.checkSLAViolations(tenantId);
    }
    async getTATConfigs(tenantId) {
        return this.labTatService.getTATConfigs(tenantId);
    }
    async updateTATConfig(id, configDto) {
        return this.labTatService.updateTATConfig(id, configDto);
    }
    async getSTATOrdersRequiringAttention() {
        const orders = await this.labTatService.getSTATOrdersRequiringAttention();
        return orders.map(order => ({
            orderId: order.order.id,
            patientName: order.order.patient?.name || 'Unknown',
            testName: order.violation.testName,
            minutesOverdue: order.minutesOverdue,
            priority: order.order.priority,
            orderedAt: order.order.createdAt,
        }));
    }
    async getSLAViolationsCount(tenantId) {
        const violations = await this.labTatService.checkSLAViolations(tenantId);
        return { count: violations.length };
    }
    async getTATPerformanceSummary(tenantId, days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const performance = await this.labTatService.getTATPerformance(tenantId, startDate, endDate);
        return {
            period: `${days} days`,
            summary: performance.summary,
            topPerformers: this.getTopPerformers(performance),
            areasForImprovement: this.getAreasForImprovement(performance),
        };
    }
    getTopPerformers(performance) {
        const performers = [];
        for (const [priority, metrics] of Object.entries(performance.priorityBreakdown)) {
            if (metrics.count > 0) {
                performers.push({
                    priority,
                    onTimePercentage: metrics.onTimePercentage,
                    averageTAT: metrics.averageTAT,
                });
            }
        }
        return performers.sort((a, b) => b.onTimePercentage - a.onTimePercentage);
    }
    getAreasForImprovement(performance) {
        const areas = [];
        for (const [priority, metrics] of Object.entries(performance.priorityBreakdown)) {
            if (metrics.onTimePercentage < 80) {
                areas.push({
                    priority,
                    onTimePercentage: metrics.onTimePercentage,
                    averageTAT: metrics.averageTAT,
                    improvementNeeded: 80 - metrics.onTimePercentage,
                });
            }
        }
        return areas.sort((a, b) => a.onTimePercentage - b.onTimePercentage);
    }
};
exports.LabTatController = LabTatController;
__decorate([
    (0, common_1.Get)('calculate/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate TAT for an order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'TAT calculated successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabTatController.prototype, "calculateTAT", null);
__decorate([
    (0, common_1.Get)('performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get TAT performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'TAT performance retrieved successfully' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LabTatController.prototype, "getTATPerformance", null);
__decorate([
    (0, common_1.Get)('violations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get SLA violations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SLA violations retrieved successfully' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabTatController.prototype, "checkSLAViolations", null);
__decorate([
    (0, common_1.Get)('configs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get TAT configurations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'TAT configurations retrieved successfully' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabTatController.prototype, "getTATConfigs", null);
__decorate([
    (0, common_1.Put)('configs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update TAT configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'TAT configuration updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_tat_dto_1.UpdateTATConfigDto]),
    __metadata("design:returntype", Promise)
], LabTatController.prototype, "updateTATConfig", null);
__decorate([
    (0, common_1.Get)('stat/alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get STAT orders requiring attention' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'STAT orders retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabTatController.prototype, "getSTATOrdersRequiringAttention", null);
__decorate([
    (0, common_1.Get)('violations/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get count of SLA violations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SLA violations count retrieved successfully' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabTatController.prototype, "getSLAViolationsCount", null);
__decorate([
    (0, common_1.Get)('performance/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get TAT performance summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'TAT performance summary retrieved successfully' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], LabTatController.prototype, "getTATPerformanceSummary", null);
exports.LabTatController = LabTatController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory TAT Management'),
    (0, common_1.Controller)('lab/tat'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_tat_service_1.LabTatService])
], LabTatController);
//# sourceMappingURL=lab-tat.controller.js.map