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
exports.ChambersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const client_1 = require("@prisma/client");
const chambers_service_1 = require("./chambers.service");
const chamber_dto_1 = require("./dto/chamber.dto");
let ChambersController = class ChambersController {
    chambersService;
    constructor(chambersService) {
        this.chambersService = chambersService;
    }
    async createChamber(tenant, user, createChamberDto) {
        return this.chambersService.createChamber(tenant.id, user.id, createChamberDto);
    }
    async getChambers(tenant, doctorId) {
        return this.chambersService.getChambers(tenant.id, doctorId);
    }
    async getChamberById(tenant, id) {
        return this.chambersService.getChamberById(tenant.id, id);
    }
    async updateChamber(tenant, id, updateChamberDto) {
        return this.chambersService.updateChamber(tenant.id, id, updateChamberDto);
    }
    async deleteChamber(tenant, id) {
        return this.chambersService.deleteChamber(tenant.id, id);
    }
    async bookAppointment(tenant, chamberId, appointmentData) {
        return this.chambersService.bookAppointment(tenant.id, chamberId, appointmentData);
    }
};
exports.ChambersController = ChambersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, chamber_dto_1.CreateChamberDto]),
    __metadata("design:returntype", Promise)
], ChambersController.prototype, "createChamber", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER, client_1.Role.RECEPTIONIST),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChambersController.prototype, "getChambers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER, client_1.Role.RECEPTIONIST),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChambersController.prototype, "getChamberById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, chamber_dto_1.UpdateChamberDto]),
    __metadata("design:returntype", Promise)
], ChambersController.prototype, "updateChamber", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChambersController.prototype, "deleteChamber", null);
__decorate([
    (0, common_1.Post)(':id/appointments'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.HOSPITAL_ADMIN, client_1.Role.OWNER, client_1.Role.RECEPTIONIST),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ChambersController.prototype, "bookAppointment", null);
exports.ChambersController = ChambersController = __decorate([
    (0, common_1.Controller)('chambers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [chambers_service_1.ChambersService])
], ChambersController);
//# sourceMappingURL=chambers.controller.js.map