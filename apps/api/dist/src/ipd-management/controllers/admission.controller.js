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
exports.AdmissionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const admission_service_1 = require("../services/admission.service");
const create_admission_dto_1 = require("../dto/create-admission.dto");
const update_admission_dto_1 = require("../dto/update-admission.dto");
const admission_filter_dto_1 = require("../dto/admission-filter.dto");
let AdmissionController = class AdmissionController {
    admissionService;
    constructor(admissionService) {
        this.admissionService = admissionService;
    }
    async createAdmission(createAdmissionDto) {
        return this.admissionService.createAdmission(createAdmissionDto);
    }
    async getAdmissions(filterDto) {
        return this.admissionService.getAdmissions(filterDto);
    }
    async getAdmissionById(id) {
        const admission = await this.admissionService.getAdmissionById(id);
        if (!admission) {
            throw new common_1.BadRequestException('Admission not found');
        }
        return admission;
    }
    async updateAdmission(id, updateAdmissionDto) {
        return this.admissionService.updateAdmission(id, updateAdmissionDto);
    }
    async cancelAdmission(id, cancellationReason, cancelledById) {
        if (!cancellationReason) {
            throw new common_1.BadRequestException('Cancellation reason is required');
        }
        return this.admissionService.cancelAdmission(id, cancellationReason, cancelledById);
    }
    async transferBed(admissionId, newBedId, transferredById, reason) {
        return this.admissionService.transferBed(admissionId, newBedId, transferredById, reason);
    }
    async getPatientAdmissions(patientId, status, limit) {
        return this.admissionService.getPatientAdmissions(patientId, { status, limit });
    }
    async getOccupancyStats() {
        return this.admissionService.getOccupancyStats();
    }
    async getAdmissionStats(startDate, endDate) {
        return this.admissionService.getAdmissionStats(startDate, endDate);
    }
};
exports.AdmissionController = AdmissionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Admit a patient to IPD' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient admitted successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admission_dto_1.CreateAdmissionDto]),
    __metadata("design:returntype", Promise)
], AdmissionController.prototype, "createAdmission", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all admissions with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of admissions' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admission_filter_dto_1.AdmissionFilterDto]),
    __metadata("design:returntype", Promise)
], AdmissionController.prototype, "getAdmissions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admission details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admission details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Admission not found' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdmissionController.prototype, "getAdmissionById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update admission details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admission updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Admission not found' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admission_dto_1.UpdateAdmissionDto]),
    __metadata("design:returntype", Promise)
], AdmissionController.prototype, "updateAdmission", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an admission' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admission cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Admission not found' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('cancellationReason')),
    __param(2, (0, common_1.Body)('cancelledById')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdmissionController.prototype, "cancelAdmission", null);
__decorate([
    (0, common_1.Post)(':id/transfer-bed'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer patient to a different bed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bed transfer successful' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('newBedId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)('transferredById')),
    __param(3, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdmissionController.prototype, "transferBed", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admission history for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of patient admissions' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], AdmissionController.prototype, "getPatientAdmissions", null);
__decorate([
    (0, common_1.Get)('stats/occupancy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bed occupancy statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Occupancy statistics' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmissionController.prototype, "getOccupancyStats", null);
__decorate([
    (0, common_1.Get)('stats/admissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admission statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admission statistics' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdmissionController.prototype, "getAdmissionStats", null);
exports.AdmissionController = AdmissionController = __decorate([
    (0, common_1.Controller)('ipd/admissions'),
    (0, swagger_1.ApiTags)('IPD - Admissions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [admission_service_1.AdmissionService])
], AdmissionController);
//# sourceMappingURL=admission.controller.js.map