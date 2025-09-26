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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NursingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const nursing_service_1 = require("../services/nursing.service");
const create_nursing_chart_dto_1 = require("../dto/create-nursing-chart.dto");
const create_medication_administration_dto_1 = require("../dto/create-medication-administration.dto");
const medication_status_enum_1 = require("../enums/medication-status.enum");
let NursingController = class NursingController {
    nursingService;
    constructor(nursingService) {
        this.nursingService = nursingService;
    }
    async recordNursingChart(createNursingChartDto) {
        return this.nursingService.recordNursingChart(createNursingChartDto);
    }
    async getNursingCharts(patientId, admissionId, startDate, endDate, limit = 100) {
        return this.nursingService.getNursingCharts({
            patientId,
            admissionId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit,
        });
    }
    async getNursingChartById(chartId) {
        return this.nursingService.getNursingChartById(chartId);
    }
    async recordMedicationAdministration(createMedicationDto) {
        return this.nursingService.recordMedicationAdministration(createMedicationDto);
    }
    async getMedicationAdministrations(patientId, admissionId, status, startDate, endDate) {
        return this.nursingService.getMedicationAdministrations({
            patientId,
            admissionId,
            status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }
    async getMedicationAdministrationById(medicationId) {
        return this.nursingService.getMedicationAdministrationById(medicationId);
    }
    async updateMedicationStatus(medicationId, status, administeredById, administeredAt, notes) {
        if (!Object.values(medication_status_enum_1.MedicationStatus).includes(status)) {
            throw new common_1.BadRequestException('Invalid medication status');
        }
        return this.nursingService.updateMedicationStatus(medicationId, status, administeredById, administeredAt ? new Date(administeredAt) : new Date(), notes);
    }
    async getPatientMedicationSchedule(patientId, admissionId, date) {
        return this.nursingService.getPatientMedicationSchedule({
            patientId,
            admissionId,
            date: date ? new Date(date) : new Date(),
        });
    }
    async getPatientVitalSigns(patientId, admissionId, startDate, endDate, limit = 100) {
        return this.nursingService.getPatientVitalSigns({
            patientId,
            admissionId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit,
        });
    }
    async getPatientIOChart(patientId, admissionId, date = new Date().toISOString().split('T')[0]) {
        return this.nursingService.getPatientIOChart(patientId, admissionId, new Date(date));
    }
};
exports.NursingController = NursingController;
__decorate([
    (0, common_1.Post)('charts'),
    (0, swagger_1.ApiOperation)({ summary: 'Record nursing chart/vital signs' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Nursing chart recorded successfully' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_nursing_chart_dto_1.CreateNursingChartDto !== "undefined" && create_nursing_chart_dto_1.CreateNursingChartDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], NursingController.prototype, "recordNursingChart", null);
__decorate([
    (0, common_1.Get)('charts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nursing charts for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of nursing charts' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'admissionId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Query)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('admissionId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], NursingController.prototype, "getNursingCharts", null);
__decorate([
    (0, common_1.Get)('charts/:chartId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nursing chart by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nursing chart details' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('chartId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NursingController.prototype, "getNursingChartById", null);
__decorate([
    (0, common_1.Post)('medications'),
    (0, swagger_1.ApiOperation)({ summary: 'Record medication administration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Medication administration recorded' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_medication_administration_dto_1.CreateMedicationAdministrationDto !== "undefined" && create_medication_administration_dto_1.CreateMedicationAdministrationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], NursingController.prototype, "recordMedicationAdministration", null);
__decorate([
    (0, common_1.Get)('medications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medication administration records' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of medication records' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'admissionId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: medication_status_enum_1.MedicationStatus }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.PHARMACIST),
    __param(0, (0, common_1.Query)('patientId')),
    __param(1, (0, common_1.Query)('admissionId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], NursingController.prototype, "getMedicationAdministrations", null);
__decorate([
    (0, common_1.Get)('medications/:medicationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medication administration by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication administration details' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.PHARMACIST),
    __param(0, (0, common_1.Param)('medicationId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NursingController.prototype, "getMedicationAdministrationById", null);
__decorate([
    (0, common_1.Put)('medications/:medicationId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update medication administration status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication status updated' }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('medicationId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('administeredById')),
    __param(3, (0, common_1.Body)('administeredAt')),
    __param(4, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], NursingController.prototype, "updateMedicationStatus", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/medication-schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient\'s medication schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication schedule' }),
    (0, swagger_1.ApiQuery)({ name: 'admissionId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false, type: Date }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.PHARMACIST),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('admissionId')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], NursingController.prototype, "getPatientMedicationSchedule", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/vitals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient\'s vital signs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital signs data' }),
    (0, swagger_1.ApiQuery)({ name: 'admissionId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('admissionId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], NursingController.prototype, "getPatientVitalSigns", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/io-chart'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient\'s intake/output chart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'I/O chart data' }),
    (0, swagger_1.ApiQuery)({ name: 'admissionId', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false, type: Date }),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('admissionId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], NursingController.prototype, "getPatientIOChart", null);
exports.NursingController = NursingController = __decorate([
    (0, common_1.Controller)('ipd/nursing'),
    (0, swagger_1.ApiTags)('IPD - Nursing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [nursing_service_1.NursingService])
], NursingController);
//# sourceMappingURL=nursing.controller.js.map