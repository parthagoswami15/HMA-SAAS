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
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reports_entity_1 = require("../entities/reports.entity");
let DashboardService = DashboardService_1 = class DashboardService {
    dashboardConfigRepo;
    dashboardAccessRepo;
    logger = new common_1.Logger(DashboardService_1.name);
    constructor(dashboardConfigRepo, dashboardAccessRepo) {
        this.dashboardConfigRepo = dashboardConfigRepo;
        this.dashboardAccessRepo = dashboardAccessRepo;
    }
    async createDashboard(tenantId, userId, createDashboardDto) {
        try {
            if (createDashboardDto.isDefault) {
                await this.unsetDefaultDashboard(tenantId);
            }
            const dashboard = this.dashboardConfigRepo.create({
                tenantId,
                ...createDashboardDto,
                createdBy: userId,
                usageCount: 0,
                lastUsedAt: null,
            });
            const savedDashboard = await this.dashboardConfigRepo.save(dashboard);
            await this.grantDashboardAccess(tenantId, savedDashboard.id, userId, 'EDIT');
            this.logger.log(`Dashboard created: ${savedDashboard.id} for tenant: ${tenantId}`);
            return savedDashboard;
        }
        catch (error) {
            this.logger.error(`Failed to create dashboard: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to create dashboard');
        }
    }
    async getDashboards(tenantId, options) {
        const { search, page, limit } = options;
        const skip = (page - 1) * limit;
        const queryBuilder = this.dashboardConfigRepo.createQueryBuilder('dashboard')
            .where('dashboard.tenantId = :tenantId', { tenantId })
            .andWhere('dashboard.isActive = :isActive', { isActive: true });
        if (search) {
            queryBuilder.andWhere('(dashboard.name ILIKE :search OR dashboard.description ILIKE :search)', { search: `%${search}%` });
        }
        queryBuilder.orderBy('dashboard.isDefault', 'DESC');
        queryBuilder.addOrderBy('dashboard.createdAt', 'DESC');
        queryBuilder.skip(skip).take(limit);
        const [dashboards, total] = await queryBuilder.getManyAndCount();
        return {
            dashboards,
            total,
            page,
            limit,
        };
    }
    async getDashboard(tenantId, id) {
        const dashboard = await this.dashboardConfigRepo.findOne({
            where: { id, tenantId, isActive: true },
            relations: ['accessRecords'],
        });
        if (!dashboard) {
            throw new common_1.NotFoundException('Dashboard not found');
        }
        return dashboard;
    }
    async updateDashboard(tenantId, id, userId, updateDashboardDto) {
        const dashboard = await this.getDashboard(tenantId, id);
        const hasAccess = await this.checkDashboardAccess(tenantId, id, userId, 'EDIT');
        if (!hasAccess) {
            throw new common_1.BadRequestException('Insufficient permissions to edit dashboard');
        }
        if (updateDashboardDto.isDefault && !dashboard.isDefault) {
            await this.unsetDefaultDashboard(tenantId);
        }
        Object.assign(dashboard, updateDashboardDto);
        const updatedDashboard = await this.dashboardConfigRepo.save(dashboard);
        this.logger.log(`Dashboard updated: ${id} for tenant: ${tenantId}`);
        return updatedDashboard;
    }
    async deleteDashboard(tenantId, id) {
        const dashboard = await this.getDashboard(tenantId, id);
        dashboard.isActive = false;
        await this.dashboardConfigRepo.save(dashboard);
        this.logger.log(`Dashboard soft deleted: ${id} for tenant: ${tenantId}`);
    }
    async grantDashboardAccess(tenantId, dashboardId, userId, permission) {
        const existingAccess = await this.dashboardAccessRepo.findOne({
            where: { tenantId, dashboardId, userId },
        });
        if (existingAccess) {
            existingAccess.permission = permission;
            await this.dashboardAccessRepo.save(existingAccess);
        }
        else {
            const access = this.dashboardAccessRepo.create({
                tenantId,
                dashboardId,
                userId,
                permission,
            });
            await this.dashboardAccessRepo.save(access);
        }
        this.logger.log(`Dashboard access granted: ${dashboardId} to user: ${userId} with permission: ${permission}`);
    }
    async revokeDashboardAccess(tenantId, dashboardId, userId) {
        const access = await this.dashboardAccessRepo.findOne({
            where: { tenantId, dashboardId, userId },
        });
        if (access) {
            await this.dashboardAccessRepo.remove(access);
            this.logger.log(`Dashboard access revoked: ${dashboardId} from user: ${userId}`);
        }
    }
    async checkDashboardAccess(tenantId, dashboardId, userId, requiredPermission) {
        const dashboard = await this.getDashboard(tenantId, dashboardId);
        if (dashboard.createdBy === userId) {
            return true;
        }
        const access = await this.dashboardAccessRepo.findOne({
            where: { tenantId, dashboardId, userId },
        });
        if (!access) {
            return false;
        }
        const permissions = ['VIEW', 'EDIT', 'DELETE', 'SHARE'];
        const requiredLevel = permissions.indexOf(requiredPermission);
        const userLevel = permissions.indexOf(access.permission);
        return userLevel >= requiredLevel;
    }
    async shareDashboard(tenantId, dashboardId, userId, targetUserIds, permission) {
        const hasShareAccess = await this.checkDashboardAccess(tenantId, dashboardId, userId, 'SHARE');
        if (!hasShareAccess) {
            throw new common_1.BadRequestException('Insufficient permissions to share dashboard');
        }
        for (const targetUserId of targetUserIds) {
            await this.grantDashboardAccess(tenantId, dashboardId, targetUserId, permission);
        }
        this.logger.log(`Dashboard shared: ${dashboardId} with users: ${targetUserIds.join(', ')}`);
    }
    async getUserDashboards(tenantId, userId) {
        const ownedDashboards = await this.dashboardConfigRepo.find({
            where: { tenantId, createdBy: userId, isActive: true },
        });
        const sharedDashboardIds = await this.dashboardAccessRepo.find({
            where: { tenantId, userId },
            select: ['dashboardId'],
        }).then(access => access.map(a => a.dashboardId));
        const sharedDashboards = await this.dashboardConfigRepo.find({
            where: { tenantId, id: (0, typeorm_2.In)(sharedDashboardIds), isActive: true },
        });
        return [...ownedDashboards, ...sharedDashboards];
    }
    async getDefaultDashboard(tenantId) {
        return this.dashboardConfigRepo.findOne({
            where: { tenantId, isDefault: true, isActive: true },
        });
    }
    async cloneDashboard(tenantId, dashboardId, userId, newName) {
        const originalDashboard = await this.getDashboard(tenantId, dashboardId);
        const clonedDashboard = this.dashboardConfigRepo.create({
            tenantId,
            name: newName,
            description: `Clone of: ${originalDashboard.description}`,
            layout: originalDashboard.layout,
            isDefault: false,
            isActive: true,
            createdBy: userId,
            accessLevel: 'PRIVATE',
        });
        const savedDashboard = await this.dashboardConfigRepo.save(clonedDashboard);
        await this.grantDashboardAccess(tenantId, savedDashboard.id, userId, 'EDIT');
        this.logger.log(`Dashboard cloned: ${savedDashboard.id} from ${dashboardId}`);
        return savedDashboard;
    }
    async updateDashboardUsage(tenantId, dashboardId) {
        await this.dashboardConfigRepo.update({ tenantId, id: dashboardId }, {
            usageCount: () => 'usageCount + 1',
            lastUsedAt: new Date(),
        });
    }
    async unsetDefaultDashboard(tenantId) {
        await this.dashboardConfigRepo.update({ tenantId, isDefault: true }, { isDefault: false });
    }
    async getDashboardMetrics(tenantId) {
        const totalDashboards = await this.dashboardConfigRepo.count({
            where: { tenantId, isActive: true },
        });
        const defaultDashboards = await this.dashboardConfigRepo.count({
            where: { tenantId, isDefault: true, isActive: true },
        });
        const sharedDashboards = await this.dashboardAccessRepo.count({
            where: { tenantId },
        });
        const totalAccessGrants = await this.dashboardAccessRepo.count({
            where: { tenantId },
        });
        return {
            totalDashboards,
            defaultDashboards,
            sharedDashboards,
            totalAccessGrants,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reports_entity_1.DashboardConfig)),
    __param(1, (0, typeorm_1.InjectRepository)(reports_entity_1.DashboardAccess)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map