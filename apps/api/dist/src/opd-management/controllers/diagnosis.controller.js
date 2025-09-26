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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const request_with_user_interface_1 = require("../../common/interfaces/request-with-user.interface");
const diagnosis_service_1 = require("../services/diagnosis.service");
const diagnosis_entity_1 = require("../entities/diagnosis.entity");
const diagnosis_1 = require("../dto/diagnosis");
const pagination_params_dto_1 = require("../../common/dto/pagination-params.dto");
const paginated_result_interface_1 = require("../../common/interfaces/paginated-result.interface");
let DiagnosisController = class DiagnosisController {
    diagnosisService;
    constructor(diagnosisService) {
        this.diagnosisService = diagnosisService;
    }
    async createPatientDiagnosis(createDiagnosisDto, req) {
        return this.diagnosisService.createPatientDiagnosis(createDiagnosisDto, req.user.id);
    }
    async createEncounterDiagnosis(createDiagnosisDto, req) {
        return this.diagnosisService.createEncounterDiagnosis(createDiagnosisDto, req.user.id);
    }
    async getPatientDiagnoses(patientId, status, type, isPrimary, fromDate, toDate, searchTerm, pagination = { page: 1, limit: 20 }) {
        return this.diagnosisService.getPatientDiagnoses(patientId, {
            status,
            type,
            isPrimary: isPrimary !== undefined ? isPrimary === true : undefined,
            fromDate: fromDate ? new Date(fromDate) : undefined,
            toDate: toDate ? new Date(toDate) : undefined,
            searchTerm,
        }, pagination);
    }
    async getEncounterDiagnoses(encounterId) {
        return this.diagnosisService.getEncounterDiagnoses(encounterId);
    }
    async getActiveDiagnoses(patientId) {
        return this.diagnosisService.getActiveDiagnoses(patientId);
    }
    async getChronicConditions(patientId) {
        return this.diagnosisService.getChronicConditions(patientId);
    }
    async getDiagnosisStats(patientId) {
        return this.diagnosisService.getDiagnosisStats(patientId);
    }
    async getDiagnosisTimeline(patientId) {
        return this.diagnosisService.getDiagnosisTimeline(patientId);
    }
    async getDiagnosis(id) {
        return this.diagnosisService.getDiagnosisById(id);
    }
    async updateDiagnosis(id, updateDiagnosisDto, req) {
        return this.diagnosisService.updateDiagnosis(id, updateDiagnosisDto, req.user.id);
    }
    async resolveDiagnosis(id, resolveDto, req) {
        return this.diagnosisService.resolveDiagnosis(id, resolveDto, req.user.id);
    }
    async reactivateDiagnosis(id, reactivateDto, req) {
        return this.diagnosisService.reactivateDiagnosis(id, reactivateDto, req.user.id);
    }
    async deleteDiagnosis(id) {
        return this.diagnosisService.deleteDiagnosis(id);
    }
    async getCommonDiagnoses(limit = 10) {
        return this.diagnosisService.getCommonDiagnoses(Number(limit) || 10);
    }
};
exports.DiagnosisController = DiagnosisController;
__decorate([
    (0, common_1.Post)('patient'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new patient diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Diagnosis created successfully', type: diagnosis_entity_1.Diagnosis }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient or ICD-10 code not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [diagnosis_1.CreatePatientDiagnosisDto, typeof (_a = typeof request_with_user_interface_1.RequestWithUser !== "undefined" && request_with_user_interface_1.RequestWithUser) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "createPatientDiagnosis", null);
__decorate([
    (0, common_1.Post)('encounter'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new diagnosis for an encounter' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Diagnosis created successfully', type: diagnosis_entity_1.Diagnosis }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Encounter or ICD-10 code not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [diagnosis_1.CreateEncounterDiagnosisDto, typeof (_b = typeof request_with_user_interface_1.RequestWithUser !== "undefined" && request_with_user_interface_1.RequestWithUser) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "createEncounterDiagnosis", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get all diagnoses for a patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: diagnosis_entity_1.DiagnosisStatus, isArray: true }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: diagnosis_entity_1.DiagnosisType }),
    (0, swagger_1.ApiQuery)({ name: 'isPrimary', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'fromDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'toDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'searchTerm', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of patient diagnoses', type: (paginated_result_interface_1.PaginatedResult) }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('isPrimary')),
    __param(4, (0, common_1.Query)('fromDate')),
    __param(5, (0, common_1.Query)('toDate')),
    __param(6, (0, common_1.Query)('searchTerm')),
    __param(7, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, Boolean, Date,
        Date, String, typeof (_c = typeof pagination_params_dto_1.PaginationParams !== "undefined" && pagination_params_dto_1.PaginationParams) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getPatientDiagnoses", null);
__decorate([
    (0, common_1.Get)('encounter/:encounterId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get all diagnoses for an encounter' }),
    (0, swagger_1.ApiParam)({ name: 'encounterId', description: 'Encounter ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of encounter diagnoses', type: [diagnosis_entity_1.Diagnosis] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Encounter not found' }),
    __param(0, (0, common_1.Param)('encounterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getEncounterDiagnoses", null);
__decorate([
    (0, common_1.Get)('active/patient/:patientId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get active diagnoses for a patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active diagnoses', type: [diagnosis_entity_1.Diagnosis] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getActiveDiagnoses", null);
__decorate([
    (0, common_1.Get)('chronic/patient/:patientId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get chronic conditions for a patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of chronic conditions', type: [diagnosis_entity_1.Diagnosis] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getChronicConditions", null);
__decorate([
    (0, common_1.Get)('stats/patient/:patientId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get diagnosis statistics for a patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis statistics' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getDiagnosisStats", null);
__decorate([
    (0, common_1.Get)('timeline/patient/:patientId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get diagnosis timeline for a patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis timeline' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getDiagnosisTimeline", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get diagnosis by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Diagnosis ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis details', type: diagnosis_entity_1.Diagnosis }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Diagnosis not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getDiagnosis", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a diagnosis' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Diagnosis ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis updated successfully', type: diagnosis_entity_1.Diagnosis }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Diagnosis not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, diagnosis_1.UpdateDiagnosisDto, typeof (_d = typeof request_with_user_interface_1.RequestWithUser !== "undefined" && request_with_user_interface_1.RequestWithUser) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "updateDiagnosis", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a diagnosis as resolved' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Diagnosis ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis resolved successfully', type: diagnosis_entity_1.Diagnosis }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Diagnosis already resolved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Diagnosis not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, diagnosis_1.ResolveDiagnosisDto, typeof (_e = typeof request_with_user_interface_1.RequestWithUser !== "undefined" && request_with_user_interface_1.RequestWithUser) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "resolveDiagnosis", null);
__decorate([
    (0, common_1.Post)(':id/reactivate'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate a resolved diagnosis' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Diagnosis ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis reactivated successfully', type: diagnosis_entity_1.Diagnosis }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Diagnosis is not resolved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Diagnosis not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, diagnosis_1.ReactivateDiagnosisDto, typeof (_f = typeof request_with_user_interface_1.RequestWithUser !== "undefined" && request_with_user_interface_1.RequestWithUser) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "reactivateDiagnosis", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a diagnosis' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Diagnosis ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Diagnosis not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "deleteDiagnosis", null);
__decorate([
    (0, common_1.Get)('common'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get most common diagnoses' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of common diagnoses' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getCommonDiagnoses", null);
exports.DiagnosisController = DiagnosisController = __decorate([
    (0, swagger_1.ApiTags)('OPD - Diagnoses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('opd/diagnoses'),
    __metadata("design:paramtypes", [diagnosis_service_1.DiagnosisService])
], DiagnosisController);
//# sourceMappingURL=diagnosis.controller.js.map