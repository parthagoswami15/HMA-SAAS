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
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const tenants_service_1 = require("./tenants.service");
const create_tenant_dto_1 = require("./dto/create-tenant.dto");
const update_tenant_dto_1 = require("./dto/update-tenant.dto");
const tenant_response_dto_1 = require("./dto/tenant-response.dto");
const api_paginated_response_decorator_1 = require("../common/decorators/api-paginated-response.decorator");
let TenantsController = class TenantsController {
    tenantsService;
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    async create(createTenantDto) {
        return this.tenantsService.create(createTenantDto);
    }
    async findAll(page = 1, limit = 10, search, isActive, includeDeleted = false) {
        const take = Math.min(100, limit);
        const skip = (page - 1) * take;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ];
        }
        const baseWhere = includeDeleted ? where : {
            ...where,
            deletedAt: null
        };
        const [items, total] = await Promise.all([
            this.tenantsService.findAll({
                skip,
                take,
                where: baseWhere,
                includeDeleted: includeDeleted === true,
            }),
            this.tenantsService.count(baseWhere),
        ]);
        return {
            data: items,
            meta: {
                total,
                page,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }
    async findOne(id, includeDeleted = false) {
        return this.tenantsService.findOne(id, includeDeleted === true);
    }
    async update(id, updateTenantDto) {
        return this.tenantsService.update(id, updateTenantDto);
    }
    async remove(id) {
        return this.tenantsService.remove(id);
    }
    async checkSlug(slug, excludeId) {
        const isTaken = await this.tenantsService.isSlugTaken(slug, excludeId);
        return {
            available: !isTaken,
            message: isTaken ? 'Slug is already taken' : 'Slug is available',
        };
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tenant (hospital/clinic/lab)' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The tenant has been successfully created',
        type: tenant_response_dto_1.TenantResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation failed' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Insufficient permissions' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'A tenant with this slug already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tenant_dto_1.CreateTenantDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.HOSPITAL_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all tenants with pagination',
        description: 'Retrieves a paginated list of tenants. By default, only active tenants are returned.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number (1-based)',
        type: Number,
        example: 1
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of items per page',
        type: Number,
        example: 10
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search term for filtering tenants by name or slug',
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        description: 'Filter by active status',
        type: Boolean,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeDeleted',
        required: false,
        description: 'Include soft-deleted tenants in the results',
        type: Boolean,
        default: false
    }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(tenant_response_dto_1.TenantResponseDto),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid pagination parameters' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Insufficient permissions' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('isActive')),
    __param(4, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.HOSPITAL_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a tenant by ID',
        description: 'Retrieves a tenant by ID. By default, only returns non-deleted tenants.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Tenant ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'includeDeleted',
        required: false,
        description: 'Include soft-deleted tenant in the result',
        type: Boolean,
        default: false
    }),
    (0, swagger_1.ApiOkResponse)({ type: tenant_response_dto_1.TenantResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Tenant not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Insufficient permissions' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a tenant' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Tenant ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Tenant updated', type: tenant_response_dto_1.TenantResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Tenant not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Insufficient permissions' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'A tenant with this slug already exists' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tenant_dto_1.UpdateTenantDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a tenant (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Tenant ID' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Tenant deleted successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Tenant not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Insufficient permissions' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('check-slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if a slug is available' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Slug to check' }),
    (0, swagger_1.ApiQuery)({
        name: 'excludeId',
        required: false,
        description: 'Exclude a tenant ID from the check (useful for updates)',
        type: String,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Slug availability check result',
        schema: {
            type: 'object',
            properties: {
                available: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)('excludeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "checkSlug", null);
exports.TenantsController = TenantsController = __decorate([
    (0, swagger_1.ApiTags)('Tenants'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tenants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - Tenant with this slug already exists' }),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map