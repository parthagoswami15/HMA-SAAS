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
exports.EmergencyController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const client_1 = require("@prisma/client");
const emergency_service_1 = require("./emergency.service");
const emergency_dto_1 = require("./dto/emergency.dto");
let EmergencyController = class EmergencyController {
    emergencyService;
    constructor(emergencyService) {
        this.emergencyService = emergencyService;
    }
    async createEmergencyCase(tenant, createEmergencyCaseDto) {
        return this.emergencyService.createEmergencyCase(tenant.id, createEmergencyCaseDto);
    }
    async getEmergencyCases(tenant, status) {
        return this.emergencyService.getEmergencyCases(tenant.id, status);
    }
    async getEmergencyCaseById(tenant, id) {
        return this.emergencyService.getEmergencyCaseById(tenant.id, id);
    }
    async updateEmergencyCase(tenant, id, updateEmergencyCaseDto) {
        return this.emergencyService.updateEmergencyCase(tenant.id, id, updateEmergencyCaseDto);
    }
    async dischargeEmergencyCase(tenant, id, notes) {
        return this.emergencyService.dischargeEmergencyCase(tenant.id, id, notes);
    }
    async admitEmergencyCase(tenant, id, roomId) {
        return this.emergencyService.admitEmergencyCase(tenant.id, id, roomId);
    }
    async getTriageStats(tenant) {
        return this.emergencyService.getTriageStats(tenant.id);
    }
};
exports.EmergencyController = EmergencyController;
__decorate([
    (0, common_1.Post)('cases'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.NURSE, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, emergency_dto_1.CreateEmergencyCaseDto]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "createEmergencyCase", null);
__decorate([
    (0, common_1.Get)('cases'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.NURSE, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "getEmergencyCases", null);
__decorate([
    (0, common_1.Get)('cases/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.NURSE, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "getEmergencyCaseById", null);
__decorate([
    (0, common_1.Put)('cases/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.NURSE, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, emergency_dto_1.UpdateEmergencyCaseDto]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "updateEmergencyCase", null);
__decorate([
    (0, common_1.Put)('cases/:id/discharge'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "dischargeEmergencyCase", null);
__decorate([
    (0, common_1.Put)('cases/:id/admit'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "admitEmergencyCase", null);
__decorate([
    (0, common_1.Get)('stats/triage'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.NURSE, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "getTriageStats", null);
exports.EmergencyController = EmergencyController = __decorate([
    (0, common_1.Controller)('emergency'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [emergency_service_1.EmergencyService])
], EmergencyController);
//# sourceMappingURL=emergency.controller.js.map