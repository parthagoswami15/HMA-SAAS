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
exports.LabPanicAlertController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lab_panic_alert_service_1 = require("../services/lab-panic-alert.service");
const lab_panic_alert_dto_1 = require("../dto/lab-panic-alert.dto");
const lab_auth_guard_1 = require("../guards/lab-auth.guard");
let LabPanicAlertController = class LabPanicAlertController {
    labPanicAlertService;
    constructor(labPanicAlertService) {
        this.labPanicAlertService = labPanicAlertService;
    }
    async checkForPanicAlerts(orderId, results) {
        const alerts = await this.labPanicAlertService.checkForPanicAlerts(orderId, results);
        return {
            message: `Checked ${results.length} results. Found ${alerts.length} panic alerts.`,
            alerts,
        };
    }
    async getActivePanicAlerts(tenantId) {
        return this.labPanicAlertService.getActivePanicAlerts(tenantId);
    }
    async acknowledgePanicAlert(alertId, ackDto) {
        await this.labPanicAlertService.acknowledgePanicAlert(alertId, ackDto.acknowledgedBy);
        return { message: 'Panic alert acknowledged successfully' };
    }
    async getPanicAlertsByPatient(patientId) {
        return this.labPanicAlertService.getPanicAlertsByPatient(patientId);
    }
    async getPanicAlertStatistics(tenantId, days) {
        return this.labPanicAlertService.getPanicAlertStatistics(tenantId, days);
    }
    async getPanicThresholds() {
        return this.labPanicAlertService.getPanicThresholds();
    }
    async updatePanicThreshold(analyte, thresholdDto) {
        return this.labPanicAlertService.updatePanicThreshold(analyte, thresholdDto);
    }
    async evaluatePanicAlerts(orderId, results) {
        const alerts = await this.labPanicAlertService.checkForPanicAlerts(orderId, results);
        return {
            message: `Panic alert evaluation completed. Created ${alerts.length} alerts.`,
            alertsCreated: alerts.length,
        };
    }
    async getPendingPanicAlertsCount(tenantId) {
        const alerts = await this.labPanicAlertService.getActivePanicAlerts(tenantId);
        return { count: alerts.length };
    }
};
exports.LabPanicAlertController = LabPanicAlertController;
__decorate([
    (0, common_1.Post)('check/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check for panic alerts in order results' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panic alerts checked successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)('results')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], LabPanicAlertController.prototype, "checkForPanicAlerts", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active panic alerts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active panic alerts retrieved successfully' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabPanicAlertController.prototype, "getActivePanicAlerts", null);
__decorate([
    (0, common_1.Put)(':id/acknowledge'),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge a panic alert' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panic alert acknowledged successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_panic_alert_dto_1.AcknowledgePanicAlertDto]),
    __metadata("design:returntype", Promise)
], LabPanicAlertController.prototype, "acknowledgePanicAlert", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get panic alerts for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient panic alerts retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabPanicAlertController.prototype, "getPanicAlertsByPatient", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get panic alert statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panic alert statistics retrieved successfully' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], LabPanicAlertController.prototype, "getPanicAlertStatistics", null);
__decorate([
    (0, common_1.Get)('thresholds'),
    (0, swagger_1.ApiOperation)({ summary: 'Get panic thresholds' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panic thresholds retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabPanicAlertController.prototype, "getPanicThresholds", null);
__decorate([
    (0, common_1.Put)('thresholds/:analyte'),
    (0, swagger_1.ApiOperation)({ summary: 'Update panic threshold' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panic threshold updated successfully' }),
    __param(0, (0, common_1.Param)('analyte')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lab_panic_alert_dto_1.UpdatePanicThresholdDto]),
    __metadata("design:returntype", Promise)
], LabPanicAlertController.prototype, "updatePanicThreshold", null);
__decorate([
    (0, common_1.Post)('evaluate/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate order for panic alerts and send notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Panic alert evaluation completed successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)('results')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], LabPanicAlertController.prototype, "evaluatePanicAlerts", null);
__decorate([
    (0, common_1.Get)('pending/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get count of pending panic alerts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending panic alerts count retrieved successfully' }),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabPanicAlertController.prototype, "getPendingPanicAlertsCount", null);
exports.LabPanicAlertController = LabPanicAlertController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory Panic Alerts'),
    (0, common_1.Controller)('lab/panic-alerts'),
    (0, common_1.UseGuards)(lab_auth_guard_1.LabAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lab_panic_alert_service_1.LabPanicAlertService])
], LabPanicAlertController);
//# sourceMappingURL=lab-panic-alert.controller.js.map