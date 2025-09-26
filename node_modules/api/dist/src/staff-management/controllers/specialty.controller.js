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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const specialty_service_1 = require("../services/specialty.service");
const dto_1 = require("../dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const enums_1 = require("../../user/enums");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const interfaces_1 = require("../../user/interfaces");
let SpecialtyController = class SpecialtyController {
    specialtyService;
    constructor(specialtyService) {
        this.specialtyService = specialtyService;
    }
    async create(user, createSpecialtyDto) {
        return this.specialtyService.create(user.tenantId, createSpecialtyDto);
    }
    async findAll(user, filterDto) {
        return this.specialtyService.findAll(user.tenantId, filterDto);
    }
    async countBySpecialty(user) {
        return this.specialtyService.getCountBySpecialty(user.tenantId);
    }
    async findOne(user, id) {
        return this.specialtyService.findById(user.tenantId, id);
    }
    async findByCode(user, code) {
        const specialty = await this.specialtyService.findByCode(user.tenantId, code);
        if (!specialty) {
            throw new Error(`Specialty with code '${code}' not found`);
        }
        return specialty;
    }
    async update(user, id, updateSpecialtyDto) {
        return this.specialtyService.update(user.tenantId, id, updateSpecialtyDto);
    }
    async remove(user, id) {
        await this.specialtyService.delete(user.tenantId, id);
    }
    async assignSpecialties(user, staffId, specialties) {
        return this.specialtyService.assignSpecialtiesToStaff(user.tenantId, staffId, specialties);
    }
    async updateStaffSpecialties(user, staffId, specialties) {
        return this.specialtyService.updateStaffSpecialties(user.tenantId, staffId, specialties);
    }
    async getStaffSpecialties(staffId) {
        return this.specialtyService.getStaffSpecialties(staffId);
    }
    async updateStaffSpecialty(user, staffId, specialtyId, updateData) {
        return this.specialtyService.updateStaffSpecialty(user.tenantId, staffId, specialtyId, updateData);
    }
    async removeStaffSpecialty(staffId, specialtyId) {
        await this.specialtyService.updateStaffSpecialty('', staffId, specialtyId, { remove: true });
    }
};
exports.SpecialtyController = SpecialtyController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new specialty' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Specialty created successfully', type: dto_1.SpecialtyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Specialty with this code already exists' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _a : Object, typeof (_b = typeof dto_1.CreateSpecialtyDto !== "undefined" && dto_1.CreateSpecialtyDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD, enums_1.UserRole.DOCTOR, enums_1.UserRole.NURSE),
    (0, swagger_1.ApiOperation)({ summary: 'Get all specialties with pagination and filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of specialties', type: dto_1.SpecialtyListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _c : Object, typeof (_d = typeof dto_1.SpecialtyFilterDto !== "undefined" && dto_1.SpecialtyFilterDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count-by-specialty'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff count by specialty' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff count by specialty', type: [dto_1.SpecialtyCountResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "countBySpecialty", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD, enums_1.UserRole.DOCTOR, enums_1.UserRole.NURSE),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specialty by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialty details', type: dto_1.SpecialtyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Specialty not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _f : Object, String]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD, enums_1.UserRole.DOCTOR, enums_1.UserRole.NURSE),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specialty by code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialty details', type: dto_1.SpecialtyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Specialty not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _g : Object, String]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a specialty' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialty updated', type: dto_1.SpecialtyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Specialty not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Specialty with this code already exists' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _h : Object, String, typeof (_j = typeof dto_1.UpdateSpecialtyDto !== "undefined" && dto_1.UpdateSpecialtyDto) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specialty (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Specialty deleted' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete specialty assigned to staff' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Specialty not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _k : Object, String]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('staff/:staffId'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Assign specialties to a staff member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialties assigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member or specialty not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('staffId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _l : Object, String, Array]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "assignSpecialties", null);
__decorate([
    (0, common_1.Put)('staff/:staffId'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Update staff specialties (replaces all existing)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Specialties updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member or specialty not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('staffId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _m : Object, String, Array]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "updateStaffSpecialties", null);
__decorate([
    (0, common_1.Get)('staff/:staffId'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD, enums_1.UserRole.DOCTOR, enums_1.UserRole.NURSE),
    (0, swagger_1.ApiOperation)({ summary: 'Get all specialties for a staff member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of staff specialties', type: [dto_1.StaffSpecialtyResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member not found' }),
    __param(0, (0, common_1.Param)('staffId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "getStaffSpecialties", null);
__decorate([
    (0, common_1.Put)('staff/:staffId/specialty/:specialtyId'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Update a staff member\'s specialty' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff specialty updated', type: dto_1.StaffSpecialtyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member or specialty not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('staffId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('specialtyId', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _o : Object, String, String, typeof (_p = typeof dto_1.UpdateStaffSpecialtyDto !== "undefined" && dto_1.UpdateStaffSpecialtyDto) === "function" ? _p : Object]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "updateStaffSpecialty", null);
__decorate([
    (0, common_1.Delete)('staff/:staffId/specialty/:specialtyId'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a specialty from a staff member' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Specialty removed from staff' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member or specialty not found' }),
    __param(0, (0, common_1.Param)('staffId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('specialtyId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpecialtyController.prototype, "removeStaffSpecialty", null);
exports.SpecialtyController = SpecialtyController = __decorate([
    (0, swagger_1.ApiTags)('Specialty Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('specialties'),
    __metadata("design:paramtypes", [specialty_service_1.SpecialtyService])
], SpecialtyController);
//# sourceMappingURL=specialty.controller.js.map