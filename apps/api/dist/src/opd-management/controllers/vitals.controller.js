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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VitalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const vitals_service_1 = require("../services/vitals.service");
const create_vitals_dto_1 = require("../dto/vitals/create-vitals.dto");
const update_vitals_dto_1 = require("../dto/vitals/update-vitals.dto");
const vitals_entity_1 = require("../entities/vitals.entity");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
let VitalsController = class VitalsController {
    vitalsService;
    constructor(vitalsService) {
        this.vitalsService = vitalsService;
    }
    create(createVitalsDto, user) {
        return this.vitalsService.create(createVitalsDto, user.id);
    }
    findAll(patientId, visitId) {
        return this.vitalsService.findAll({ patientId, visitId });
    }
    findOne(id) {
        return this.vitalsService.findOne(id);
    }
    getLastVitals(patientId) {
        return this.vitalsService.getLastVitals(patientId);
    }
    getVitalsTrends(patientId, metric, days = 30) {
        return this.vitalsService.getPatientVitalsTrends(patientId, metric, Number(days));
    }
    update(id, updateVitalsDto) {
        return this.vitalsService.update(id, updateVitalsDto);
    }
    remove(id) {
        return this.vitalsService.remove(id);
    }
    getVitalsByVisit(visitId) {
        return this.vitalsService.getVitalsByVisit(visitId);
    }
};
exports.VitalsController = VitalsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.DOCTOR),
    (0, swagger_1.ApiOperation)({ summary: 'Record new vitals' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vitals recorded successfully', type: vitals_entity_1.Vitals }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient or visit not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vitals_dto_1.CreateVitalsDto, typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all vitals with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'visitId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of vitals', type: [vitals_entity_1.Vitals] }),
    __param(0, (0, common_1.Query)('patientId')),
    __param(1, (0, common_1.Query)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get vitals by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vitals details', type: vitals_entity_1.Vitals }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vitals not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/latest'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get the most recent vitals for a patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Latest vitals', type: vitals_entity_1.Vitals }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No vitals found for patient' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "getLastVitals", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/trends'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get vitals trends for a patient' }),
    (0, swagger_1.ApiQuery)({ name: 'metric', required: true, enum: ['temperature', 'heartRate', 'bloodPressure', 'oxygenSaturation', 'weight', 'bmi'] }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number, description: 'Number of days to look back (default: 30)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vitals trends data' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('metric')),
    __param(2, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], VitalsController.prototype, "getVitalsTrends", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update vitals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vitals updated successfully', type: vitals_entity_1.Vitals }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vitals not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vitals_dto_1.UpdateVitalsDto]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.DOCTOR),
    (0, swagger_1.ApiOperation)({ summary: 'Delete vitals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vitals deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vitals not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('visit/:visitId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.NURSE, user_role_enum_1.UserRole.DOCTOR, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all vitals for a specific visit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of vitals for the visit', type: [vitals_entity_1.Vitals] }),
    __param(0, (0, common_1.Param)('visitId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalsController.prototype, "getVitalsByVisit", null);
exports.VitalsController = VitalsController = __decorate([
    (0, swagger_1.ApiTags)('OPD - Vitals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('opd/vitals'),
    __metadata("design:paramtypes", [vitals_service_1.VitalsService])
], VitalsController);
//# sourceMappingURL=vitals.controller.js.map