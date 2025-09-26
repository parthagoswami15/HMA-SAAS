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
exports.DepartmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const department_service_1 = require("../services/department.service");
const dto_1 = require("../dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const enums_1 = require("../../user/enums");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const interfaces_1 = require("../../user/interfaces");
let DepartmentController = class DepartmentController {
    departmentService;
    constructor(departmentService) {
        this.departmentService = departmentService;
    }
    async create(user, createDepartmentDto) {
        return this.departmentService.create(user.tenantId, createDepartmentDto);
    }
    async findAll(user, filterDto) {
        return this.departmentService.findAll(user.tenantId, filterDto);
    }
    async getHierarchy(user) {
        return this.departmentService.getDepartmentHierarchy(user.tenantId);
    }
    async countByDepartment(user) {
        return this.departmentService.getStaffCountByDepartment(user.tenantId);
    }
    async findOne(user, id) {
        return this.departmentService.findById(user.tenantId, id);
    }
    async findByCode(user, code) {
        const department = await this.departmentService.findByCode(user.tenantId, code);
        if (!department) {
            throw new Error(`Department with code '${code}' not found`);
        }
        return department;
    }
    async update(user, id, updateDepartmentDto) {
        return this.departmentService.update(user.tenantId, id, updateDepartmentDto);
    }
    async remove(user, id) {
        await this.departmentService.delete(user.tenantId, id);
    }
    async assignDepartmentHead(user, id, staffId) {
        return this.departmentService.assignDepartmentHead(user.tenantId, id, staffId);
    }
    async removeDepartmentHead(user, id) {
        return this.departmentService.removeDepartmentHead(user.tenantId, id);
    }
    async getDepartmentStaff(user, id, includeSubDepartments = false) {
        return this.departmentService.getDepartmentStaff(user.tenantId, id, includeSubDepartments);
    }
};
exports.DepartmentController = DepartmentController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new department' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Department created successfully', type: dto_1.DepartmentResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Department with this code already exists' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _a : Object, typeof (_b = typeof dto_1.CreateDepartmentDto !== "undefined" && dto_1.CreateDepartmentDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD, enums_1.UserRole.DOCTOR, enums_1.UserRole.NURSE),
    (0, swagger_1.ApiOperation)({ summary: 'Get all departments with pagination and filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of departments', type: dto_1.DepartmentListResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _c : Object, typeof (_d = typeof dto_1.DepartmentFilterDto !== "undefined" && dto_1.DepartmentFilterDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('hierarchy'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Get department hierarchy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Department hierarchy', type: [dto_1.DepartmentResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "getHierarchy", null);
__decorate([
    (0, common_1.Get)('count-by-department'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff count by department' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff count by department', type: [dto_1.DepartmentCountResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "countByDepartment", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD, enums_1.UserRole.DOCTOR, enums_1.UserRole.NURSE),
    (0, swagger_1.ApiOperation)({ summary: 'Get a department by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Department details', type: dto_1.DepartmentResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Department not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _g : Object, String]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD, enums_1.UserRole.DOCTOR, enums_1.UserRole.NURSE),
    (0, swagger_1.ApiOperation)({ summary: 'Get a department by code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Department details', type: dto_1.DepartmentResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Department not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _h : Object, String]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a department' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Department updated', type: dto_1.DepartmentResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Department not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Department with this code already exists' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _j : Object, String, typeof (_k = typeof dto_1.UpdateDepartmentDto !== "undefined" && dto_1.UpdateDepartmentDto) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a department (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Department deleted' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete department with staff or child departments' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Department not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _l : Object, String]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/assign-head'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a department head' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Department head assigned' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Department or staff member not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)('staffId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _m : Object, String, String]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "assignDepartmentHead", null);
__decorate([
    (0, common_1.Post)(':id/remove-head'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove department head' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Department head removed' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Department not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _o : Object, String]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "removeDepartmentHead", null);
__decorate([
    (0, common_1.Get)(':id/staff'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_HEAD),
    (0, swagger_1.ApiOperation)({ summary: 'Get all staff in a department' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of staff in department' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Department not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Query)('includeSubDepartments')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof interfaces_1.IUser !== "undefined" && interfaces_1.IUser) === "function" ? _p : Object, String, Boolean]),
    __metadata("design:returntype", Promise)
], DepartmentController.prototype, "getDepartmentStaff", null);
exports.DepartmentController = DepartmentController = __decorate([
    (0, swagger_1.ApiTags)('Department Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('departments'),
    __metadata("design:paramtypes", [department_service_1.DepartmentService])
], DepartmentController);
//# sourceMappingURL=department.controller.js.map