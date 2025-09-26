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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const staff_service_1 = require("../services/staff.service");
const dto_1 = require("../dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const enums_1 = require("../../user/enums");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const interfaces_1 = require("../../user/interfaces");
let StaffController = class StaffController {
    staffService;
    constructor(staffService) {
        this.staffService = staffService;
    }
    async create(user, createStaffDto) {
        return this.staffService.create(user.tenantId, createStaffDto);
    }
    async findAll(user, filterDto) {
        return this.staffService.findAll(user.tenantId, filterDto);
    }
    async findRecent(user, limit = 5) {
        return this.staffService.getRecent(user.tenantId, Number(limit));
    }
    async countByType(user) {
        return this.staffService.getCountByType(user.tenantId);
    }
    async countByDepartment(user) {
        return this.staffService.getCountByDepartment(user.tenantId);
    }
    async getMyProfile(user) {
        return this.staffService.findByUserId(user.tenantId, user.id);
    }
    async findOne(user, id) {
        return this.staffService.findById(user.tenantId, id);
    }
    async update(user, id, updateStaffDto) {
        return this.staffService.update(user.tenantId, id, updateStaffDto);
    }
    async remove(user, id) {
        await this.staffService.delete(user.tenantId, id);
    }
    async bulkUpdateStatus(user, ids, status) {
        if (!ids || !ids.length) {
            throw new Error('No staff IDs provided');
        }
        if (!status) {
            throw new Error('Status is required');
        }
        return this.staffService.bulkUpdateStatus(user.tenantId, ids, status);
    }
    async checkEmployeeIdAvailable(user, employeeId) {
        const exists = await this.staffService.employeeIdExists(user.tenantId, employeeId);
        return { available: !exists };
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new staff member' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Staff member created successfully', type: dto_1.StaffResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - Employee ID or email already in use' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _a : Object, typeof (_b = typeof dto_1.CreateStaffDto !== "undefined" && dto_1.CreateStaffDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Get all staff members with pagination and filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of staff members', type: dto_1.StaffListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _c : Object, typeof (_d = typeof dto_1.StaffFilterDto !== "undefined" && dto_1.StaffFilterDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Get recently added staff members' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of recent staff members', type: [dto_1.RecentStaffResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findRecent", null);
__decorate([
    (0, common_1.Get)('count-by-type'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff count by type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff count by type', type: [dto_1.StaffCountResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "countByType", null);
__decorate([
    (0, common_1.Get)('count-by-department'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff count by department' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff count by department', type: [dto_1.StaffCountResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "countByDepartment", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current staff profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff profile', type: dto_1.StaffResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Get a staff member by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff member details', type: dto_1.StaffResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _j : Object, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a staff member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff member updated', type: dto_1.StaffResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - Employee ID already in use' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _k : Object, String, typeof (_l = typeof dto_1.UpdateStaffDto !== "undefined" && dto_1.UpdateStaffDto) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a staff member (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Staff member deleted' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _m : Object, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk/status'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update staff status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff status updated', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('ids')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _o : Object, Array, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "bulkUpdateStatus", null);
__decorate([
    (0, common_1.Get)('check/employee-id/:employeeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if an employee ID is available' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee ID availability', type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _p : Object, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "checkEmployeeIdAvailable", null);
exports.StaffController = StaffController = __decorate([
    (0, swagger_1.ApiTags)('Staff Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map