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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const role_service_1 = require("../services/role.service");
const dto_1 = require("../dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const enums_1 = require("../../user/enums");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const interfaces_1 = require("../../user/interfaces");
let RoleController = class RoleController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    async create(user, createRoleDto) {
        return this.roleService.create(user.tenantId, createRoleDto);
    }
    async findAll(user, filterDto) {
        return this.roleService.findAll(user.tenantId, filterDto);
    }
    async getPermissions() {
        return this.roleService.getAllPermissions();
    }
    async findOne(user, id) {
        return this.roleService.findById(user.tenantId, id);
    }
    async update(user, id, updateRoleDto) {
        return this.roleService.update(user.tenantId, id, updateRoleDto);
    }
    async remove(user, id) {
        await this.roleService.delete(user.tenantId, id);
    }
    async assignRoles(user, assignRoleDto) {
        return this.roleService.assignRolesToUser(user.tenantId, assignRoleDto.userId, assignRoleDto.roleIds);
    }
    async getUserRoles(user, userId) {
        return this.roleService.getUserRoles(user.tenantId, userId);
    }
    async getMyPermissions(user) {
        return this.roleService.getUserPermissions(user.id);
    }
    async checkPermission(user, permission) {
        if (!permission) {
            return { hasPermission: false };
        }
        const hasPermission = await this.roleService.hasPermission(user.id, permission);
        return { hasPermission };
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new role' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role created successfully', type: dto_1.RoleResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Role with this name already exists' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _a : Object, typeof (_b = typeof dto_1.CreateRoleDto !== "undefined" && dto_1.CreateRoleDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles with pagination and filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of roles', type: dto_1.RoleListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _c : Object, typeof (_d = typeof dto_1.RoleFilterDto !== "undefined" && dto_1.RoleFilterDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available permissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of permissions', type: [dto_1.PermissionResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get a role by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role details', type: dto_1.RoleResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _e : Object, String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role updated', type: dto_1.RoleResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Role with this name already exists' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _f : Object, String, typeof (_g = typeof dto_1.UpdateRoleDto !== "undefined" && dto_1.UpdateRoleDto) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a role (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Role deleted' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete system role or role assigned to users' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _h : Object, String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('assign'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Assign roles to a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Roles assigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or role not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _j : Object, typeof (_k = typeof dto_1.AssignRoleDto !== "undefined" && dto_1.AssignRoleDto) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "assignRoles", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user roles', type: [dto_1.RoleResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _l : Object, String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getUserRoles", null);
__decorate([
    (0, common_1.Get)('me/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user permissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of permissions', type: [String] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _m : Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getMyPermissions", null);
__decorate([
    (0, common_1.Post)('check-permission'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if current user has a specific permission' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission check result', type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('permission')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _o : Object, String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "checkPermission", null);
exports.RoleController = RoleController = __decorate([
    (0, swagger_1.ApiTags)('Role Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
//# sourceMappingURL=role.controller.js.map