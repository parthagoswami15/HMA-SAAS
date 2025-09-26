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
exports.IPDController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ipd_service_1 = require("../services/ipd.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
let IPDController = class IPDController {
    ipdService;
    constructor(ipdService) {
        this.ipdService = ipdService;
    }
    async admitPatient(admissionData) {
        return this.ipdService.admitPatient(admissionData);
    }
    async getAdmission(admissionId) {
        return this.ipdService.getAdmissionDetails(admissionId);
    }
    async getAvailableBeds(wardId, bedClass) {
        return this.ipdService.getAvailableBeds(wardId, bedClass);
    }
    async transferBed(admissionId, newBedId, reason) {
        return this.ipdService.transferPatientBed(admissionId, newBedId, reason);
    }
    async recordNursingChart(patientId, chartData) {
        return this.ipdService.recordNursingChart(patientId, chartData);
    }
    async getNursingCharts(patientId, date) {
        return this.ipdService.getPatientNursingCharts(patientId, date);
    }
    async recordMedication(marData) {
        return this.ipdService.recordMedicationAdministration(marData);
    }
    async scheduleSurgery(surgeryData) {
        return this.ipdService.scheduleSurgery(surgeryData);
    }
    async updateSurgeryStatus(surgeryId, status, notes) {
        return this.ipdService.updateSurgeryStatus(surgeryId, status, notes);
    }
    async initiateDischarge(admissionId, dischargeData) {
        return this.ipdService.initiateDischarge(admissionId, dischargeData);
    }
    async completeDischarge(dischargeId) {
        return this.ipdService.completeDischarge(dischargeId);
    }
    async getBedOccupancyReport() {
        return this.ipdService.getBedOccupancyReport();
    }
    async getPatientSummary(patientId) {
        return this.ipdService.getPatientSummary(patientId);
    }
};
exports.IPDController = IPDController;
__decorate([
    (0, common_1.Post)('admissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Admit a patient to IPD' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient admitted successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "admitPatient", null);
__decorate([
    (0, common_1.Get)('admissions/:admissionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admission details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admission details retrieved' }),
    __param(0, (0, common_1.Param)('admissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "getAdmission", null);
__decorate([
    (0, common_1.Get)('beds/available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available beds' }),
    (0, swagger_1.ApiQuery)({ name: 'wardId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'bedClass', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available beds retrieved' }),
    __param(0, (0, common_1.Query)('wardId')),
    __param(1, (0, common_1.Query)('bedClass')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "getAvailableBeds", null);
__decorate([
    (0, common_1.Post)('beds/transfer'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer patient to another bed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient transferred successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Body)('admissionId')),
    __param(1, (0, common_1.Body)('newBedId')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "transferBed", null);
__decorate([
    (0, common_1.Post)('nursing/charts'),
    (0, swagger_1.ApiOperation)({ summary: 'Record nursing chart' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Nursing chart recorded' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Body)('patientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "recordNursingChart", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/nursing-charts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient nursing charts' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nursing charts retrieved' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "getNursingCharts", null);
__decorate([
    (0, common_1.Post)('medication/administration'),
    (0, swagger_1.ApiOperation)({ summary: 'Record medication administration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Medication administration recorded' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "recordMedication", null);
__decorate([
    (0, common_1.Post)('surgeries'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule a surgery' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Surgery scheduled' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "scheduleSurgery", null);
__decorate([
    (0, common_1.Put)('surgeries/:surgeryId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update surgery status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Surgery status updated' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('surgeryId')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "updateSurgeryStatus", null);
__decorate([
    (0, common_1.Post)('discharge/initiate'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate patient discharge' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Discharge initiated' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Body)('admissionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "initiateDischarge", null);
__decorate([
    (0, common_1.Post)('discharge/:dischargeId/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete patient discharge' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Discharge completed' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('dischargeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "completeDischarge", null);
__decorate([
    (0, common_1.Get)('reports/bed-occupancy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bed occupancy report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bed occupancy report' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "getBedOccupancyReport", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient summary retrieved' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IPDController.prototype, "getPatientSummary", null);
exports.IPDController = IPDController = __decorate([
    (0, common_1.Controller)('ipd'),
    (0, swagger_1.ApiTags)('IPD Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __metadata("design:paramtypes", [ipd_service_1.IPDService])
], IPDController);
//# sourceMappingURL=ipd.controller.js.map