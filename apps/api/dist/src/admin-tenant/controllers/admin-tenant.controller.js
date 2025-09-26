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
exports.AdminTenantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const admin_tenant_service_1 = require("../services/admin-tenant.service");
const admin_tenant_dto_1 = require("../dto/admin-tenant.dto");
let AdminTenantController = class AdminTenantController {
    adminTenantService;
    constructor(adminTenantService) {
        this.adminTenantService = adminTenantService;
    }
    async create(createDto, req) {
        return this.adminTenantService.createTenant(createDto, req.user.id);
    }
    async provision(tenantId, provisioningDto) {
        return this.adminTenantService.provisionTenant(tenantId, provisioningDto);
    }
    async findAll(filterDto, listDto) {
        return this.adminTenantService.findAll(filterDto, listDto);
    }
    async findOne(id) {
        return this.adminTenantService.findOne(id);
    }
    async update(id, updateDto) {
        return this.adminTenantService.updateTenant(id, updateDto);
    }
    async toggleModule(tenantId, moduleToggleDto) {
        return this.adminTenantService.toggleModule(tenantId, moduleToggleDto);
    }
    async updateSubscription(tenantId, subscriptionDto) {
        return this.adminTenantService.updateSubscriptionPlan(tenantId, subscriptionDto);
    }
    async updateStorageQuota(tenantId, quotaDto) {
        return this.adminTenantService.updateStorageQuota(tenantId, quotaDto);
    }
    async updateUserSeats(tenantId, seatsDto) {
        return this.adminTenantService.updateUserSeats(tenantId, seatsDto);
    }
    async getStats(tenantId) {
        return this.adminTenantService.getTenantStats(tenantId);
    }
    async exportData(tenantId, exportDto) {
        return this.adminTenantService.exportTenantData(tenantId, exportDto);
    }
    async configureBackupSchedule(tenantId, scheduleDto) {
        return this.adminTenantService.configureBackupSchedule(tenantId, scheduleDto);
    }
    async configureEnvironment(tenantId, configDto) {
        return this.adminTenantService.configureEnvironment(tenantId, configDto);
    }
    async recordMetering(meteringDto) {
        return this.adminTenantService.recordMeteringData(meteringDto);
    }
    async generateInvoice(invoiceDto) {
        return this.adminTenantService.generateInvoice(invoiceDto);
    }
    async activate(id) {
        return this.adminTenantService.updateTenant(id, { isActive: true });
    }
    async deactivate(id) {
        return this.adminTenantService.updateTenant(id, { isActive: false });
    }
    async remove(id) {
        await this.adminTenantService.updateTenant(id, { isActive: false });
    }
};
exports.AdminTenantController = AdminTenantController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tenant' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tenant created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Tenant slug already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_tenant_dto_1.CreateTenantDto, Object]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/provision'),
    (0, swagger_1.ApiOperation)({ summary: 'Provision tenant with template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant provisioned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_tenant_dto_1.TenantProvisioningDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "provision", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tenants with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenants retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_tenant_dto_1.TenantFilterDto,
        admin_tenant_dto_1.TenantListDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_tenant_dto_1.UpdateTenantDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/modules/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle module for tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Module toggled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_tenant_dto_1.ModuleToggleDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "toggleModule", null);
__decorate([
    (0, common_1.Put)(':id/subscription'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tenant subscription plan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_tenant_dto_1.SubscriptionPlanDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Put)(':id/storage-quota'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tenant storage quota' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage quota updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_tenant_dto_1.StorageQuotaDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "updateStorageQuota", null);
__decorate([
    (0, common_1.Put)(':id/user-seats'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tenant user seats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User seats updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_tenant_dto_1.UserSeatsDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "updateUserSeats", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(':id/export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export tenant data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data export initiated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_tenant_dto_1.DataExportDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "exportData", null);
__decorate([
    (0, common_1.Put)(':id/backup-schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Configure backup schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup schedule configured successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_tenant_dto_1.BackupScheduleDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "configureBackupSchedule", null);
__decorate([
    (0, common_1.Put)(':id/environment'),
    (0, swagger_1.ApiOperation)({ summary: 'Configure tenant environment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Environment configured successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_tenant_dto_1.EnvironmentConfigDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "configureEnvironment", null);
__decorate([
    (0, common_1.Post)('metering'),
    (0, swagger_1.ApiOperation)({ summary: 'Record metering data' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Metering data recorded successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_tenant_dto_1.MeteringDataDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "recordMetering", null);
__decorate([
    (0, common_1.Post)('invoice/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate invoice' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Invoice generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_tenant_dto_1.InvoiceGenerationDto]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "generateInvoice", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant activated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant deactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete tenant' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Tenant deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminTenantController.prototype, "remove", null);
exports.AdminTenantController = AdminTenantController = __decorate([
    (0, swagger_1.ApiTags)('Admin & Tenant Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('admin/tenants'),
    __metadata("design:paramtypes", [admin_tenant_service_1.AdminTenantService])
], AdminTenantController);
//# sourceMappingURL=admin-tenant.controller.js.map