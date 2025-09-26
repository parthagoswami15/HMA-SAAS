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
exports.DischargeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const discharge_service_1 = require("../services/discharge.service");
const discharge_status_enum_1 = require("../enums/discharge-status.enum");
const discharge_type_enum_1 = require("../enums/discharge-type.enum");
let DischargeController = class DischargeController {
    dischargeService;
    constructor(dischargeService) {
        this.dischargeService = dischargeService;
    }
    async initiateDischarge(admissionId, dischargedById, dischargeType) {
        return this.dischargeService.initiateDischarge(admissionId, dischargedById, dischargeType);
    }
    async updateDischargeStatus(dischargeId, status, updatedById) {
        return this.dischargeService.updateDischargeStatus(dischargeId, status, updatedById);
    }
    async updateDischargeSummary(dischargeId, summaryData, updatedById) {
        return this.dischargeService.updateDischargeSummary(dischargeId, summaryData, updatedById);
    }
    async getDischargeById(dischargeId) {
        return this.dischargeService.getDischargeById(dischargeId);
    }
    async getDischarges(patientId, doctorId, wardId, status, dischargeType, startDate, endDate, page = 1, limit = 10) {
        return this.dischargeService.getDischarges({
            patientId,
            doctorId,
            wardId,
            status,
            dischargeType,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            page: Number(page),
            limit: Number(limit),
        });
    }
    async getDischargeSummary(dischargeId) {
        return this.dischargeService.getDischargeSummary(dischargeId);
    }
    async printDischargeSummary(dischargeId, printedById) {
        await this.dischargeService.recordDischargePrint(dischargeId, printedById);
        return { message: 'Discharge summary marked as printed' };
    }
    async getDailyDischargeStats(date = new Date().toISOString().split('T')[0]) {
        return this.dischargeService.getDailyDischargeStats(new Date(date));
    }
    async getMonthlyDischargeStats(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
        return this.dischargeService.getMonthlyDischargeStats(Number(year), Number(month));
    }
    async getReadmissionRateStats(days = 30) {
        return this.dischargeService.getReadmissionRateStats(Number(days));
    }
    async cancelDischarge(dischargeId, cancelledById, reason) {
        if (!reason) {
            throw new common_1.BadRequestException('Cancellation reason is required');
        }
        return this.dischargeService.cancelDischarge(dischargeId, cancelledById, reason);
    }
    async getPatientDischargeHistory(patientId, limit = 10) {
        return this.dischargeService.getPatientDischargeHistory(patientId, Number(limit));
    }
};
exports.DischargeController = DischargeController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate patient discharge process' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Discharge process initiated successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE_IN_CHARGE),
    __param(0, (0, common_1.Body)('admissionId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('dischargedById')),
    __param(2, (0, common_1.Body)('dischargeType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "initiateDischarge", null);
__decorate([
    (0, common_1.Put)(':dischargeId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update discharge status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Discharge status updated successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.BILLING_STAFF),
    __param(0, (0, common_1.Param)('dischargeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('updatedById')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "updateDischargeStatus", null);
__decorate([
    (0, common_1.Put)(':dischargeId/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Update discharge summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Discharge summary updated successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Param)('dischargeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)('updatedById')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "updateDischargeSummary", null);
__decorate([
    (0, common_1.Get)(':dischargeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get discharge details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Discharge details' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.BILLING_STAFF, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('dischargeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "getDischargeById", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all discharges with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of discharges' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'doctorId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'wardId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: discharge_status_enum_1.DischargeStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dischargeType', required: false, enum: discharge_type_enum_1.DischargeType }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.BILLING_STAFF, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Query)('patientId')),
    __param(1, (0, common_1.Query)('doctorId')),
    __param(2, (0, common_1.Query)('wardId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('dischargeType')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __param(7, (0, common_1.Query)('page')),
    __param(8, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "getDischarges", null);
__decorate([
    (0, common_1.Get)(':dischargeId/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get discharge summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Discharge summary' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.PATIENT),
    __param(0, (0, common_1.Param)('dischargeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "getDischargeSummary", null);
__decorate([
    (0, common_1.Post)(':dischargeId/print'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate discharge summary PDF' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Discharge summary PDF generated' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('dischargeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('printedById')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "printDischargeSummary", null);
__decorate([
    (0, common_1.Get)('stats/daily'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily discharge statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daily discharge statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false, type: Date }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN, user_role_enum_1.UserRole.DOCTOR_IN_CHARGE),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "getDailyDischargeStats", null);
__decorate([
    (0, common_1.Get)('stats/monthly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly discharge statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Monthly discharge statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: false, type: Number }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN, user_role_enum_1.UserRole.DOCTOR_IN_CHARGE),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "getMonthlyDischargeStats", null);
__decorate([
    (0, common_1.Get)('stats/readmission-rate'),
    (0, swagger_1.ApiOperation)({ summary: 'Get readmission rate statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Readmission rate statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number, description: 'Number of days to consider for readmission (default: 30)' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HOSPITAL_ADMIN, user_role_enum_1.UserRole.DOCTOR_IN_CHARGE),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "getReadmissionRateStats", null);
__decorate([
    (0, common_1.Post)(':dischargeId/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a discharge' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Discharge cancelled successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR_IN_CHARGE),
    __param(0, (0, common_1.Param)('dischargeId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('cancelledById')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "cancelDischarge", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient discharge history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of patient discharges' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.PATIENT),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DischargeController.prototype, "getPatientDischargeHistory", null);
exports.DischargeController = DischargeController = __decorate([
    (0, common_1.Controller)('ipd/discharges'),
    (0, swagger_1.ApiTags)('IPD - Discharge Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [discharge_service_1.DischargeService])
], DischargeController);
//# sourceMappingURL=discharge.controller.js.map