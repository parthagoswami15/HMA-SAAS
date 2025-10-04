import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DashboardConfig, DashboardAccess } from '../entities/reports.entity';
import { CreateDashboardDto, UpdateDashboardDto } from '../dto/reports.dto';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(DashboardConfig)
    private readonly dashboardConfigRepo: Repository<DashboardConfig>,
    @InjectRepository(DashboardAccess)
    private readonly dashboardAccessRepo: Repository<DashboardAccess>,
  ) {}

  async createDashboard(tenantId: string, userId: string, createDashboardDto: CreateDashboardDto): Promise<DashboardConfig> {
    try {
      // Check if user is trying to create a default dashboard
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

      // Grant access to the creator
      await this.grantDashboardAccess(tenantId, savedDashboard.id, userId, 'EDIT');

      this.logger.log(`Dashboard created: ${savedDashboard.id} for tenant: ${tenantId}`);
      return savedDashboard;
    } catch (error) {
      this.logger.error(`Failed to create dashboard: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create dashboard');
    }
  }

  async getDashboards(tenantId: string, options: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ dashboards: DashboardConfig[]; total: number; page: number; limit: number }> {
    const { search, page, limit } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.dashboardConfigRepo.createQueryBuilder('dashboard')
      .where('dashboard.tenantId = :tenantId', { tenantId })
      .andWhere('dashboard.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere('(dashboard.name ILIKE :search OR dashboard.description ILIKE :search)',
        { search: `%${search}%` });
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

  async getDashboard(tenantId: string, id: string): Promise<DashboardConfig> {
    const dashboard = await this.dashboardConfigRepo.findOne({
      where: { id, tenantId, isActive: true },
      relations: ['accessRecords'],
    });

    if (!dashboard) {
      throw new NotFoundException('Dashboard not found');
    }

    return dashboard;
  }

  async updateDashboard(
    tenantId: string,
    id: string,
    userId: string,
    updateDashboardDto: UpdateDashboardDto,
  ): Promise<DashboardConfig> {
    const dashboard = await this.getDashboard(tenantId, id);

    // Check if user has edit permission
    const hasAccess = await this.checkDashboardAccess(tenantId, id, userId, 'EDIT');
    if (!hasAccess) {
      throw new BadRequestException('Insufficient permissions to edit dashboard');
    }

    // Handle default dashboard logic
    if (updateDashboardDto.isDefault && !dashboard.isDefault) {
      await this.unsetDefaultDashboard(tenantId);
    }

    Object.assign(dashboard, updateDashboardDto);

    const updatedDashboard = await this.dashboardConfigRepo.save(dashboard);
    this.logger.log(`Dashboard updated: ${id} for tenant: ${tenantId}`);
    return updatedDashboard;
  }

  async deleteDashboard(tenantId: string, id: string): Promise<void> {
    const dashboard = await this.getDashboard(tenantId, id);

    dashboard.isActive = false;
    await this.dashboardConfigRepo.save(dashboard);

    this.logger.log(`Dashboard soft deleted: ${id} for tenant: ${tenantId}`);
  }

  async grantDashboardAccess(
    tenantId: string,
    dashboardId: string,
    userId: string,
    permission: 'VIEW' | 'EDIT' | 'DELETE' | 'SHARE',
  ): Promise<void> {
    const existingAccess = await this.dashboardAccessRepo.findOne({
      where: { tenantId, dashboardId, userId },
    });

    if (existingAccess) {
      existingAccess.permission = permission;
      await this.dashboardAccessRepo.save(existingAccess);
    } else {
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

  async revokeDashboardAccess(tenantId: string, dashboardId: string, userId: string): Promise<void> {
    const access = await this.dashboardAccessRepo.findOne({
      where: { tenantId, dashboardId, userId },
    });

    if (access) {
      await this.dashboardAccessRepo.remove(access);
      this.logger.log(`Dashboard access revoked: ${dashboardId} from user: ${userId}`);
    }
  }

  async checkDashboardAccess(
    tenantId: string,
    dashboardId: string,
    userId: string,
    requiredPermission: 'VIEW' | 'EDIT' | 'DELETE' | 'SHARE',
  ): Promise<boolean> {
    // Dashboard owners always have full access
    const dashboard = await this.getDashboard(tenantId, dashboardId);
    if (dashboard.createdBy === userId) {
      return true;
    }

    // Check explicit access
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

  async shareDashboard(
    tenantId: string,
    dashboardId: string,
    userId: string,
    targetUserIds: string[],
    permission: 'VIEW' | 'EDIT',
  ): Promise<void> {
    // Check if user has share permission
    const hasShareAccess = await this.checkDashboardAccess(tenantId, dashboardId, userId, 'SHARE');
    if (!hasShareAccess) {
      throw new BadRequestException('Insufficient permissions to share dashboard');
    }

    for (const targetUserId of targetUserIds) {
      await this.grantDashboardAccess(tenantId, dashboardId, targetUserId, permission);
    }

    this.logger.log(`Dashboard shared: ${dashboardId} with users: ${targetUserIds.join(', ')}`);
  }

  async getUserDashboards(tenantId: string, userId: string): Promise<DashboardConfig[]> {
    // Get dashboards owned by user
    const ownedDashboards = await this.dashboardConfigRepo.find({
      where: { tenantId, createdBy: userId, isActive: true },
    });

    // Get dashboards shared with user
    const sharedDashboardIds = await this.dashboardAccessRepo.find({
      where: { tenantId, userId },
      select: ['dashboardId'],
    }).then(access => access.map(a => a.dashboardId));

    const sharedDashboards = await this.dashboardConfigRepo.find({
      where: { tenantId, id: In(sharedDashboardIds), isActive: true },
    });

    return [...ownedDashboards, ...sharedDashboards];
  }

  async getDefaultDashboard(tenantId: string): Promise<DashboardConfig | null> {
    return this.dashboardConfigRepo.findOne({
      where: { tenantId, isDefault: true, isActive: true },
    });
  }

  async cloneDashboard(
    tenantId: string,
    dashboardId: string,
    userId: string,
    newName: string,
  ): Promise<DashboardConfig> {
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

    // Grant access to the creator
    await this.grantDashboardAccess(tenantId, savedDashboard.id, userId, 'EDIT');

    this.logger.log(`Dashboard cloned: ${savedDashboard.id} from ${dashboardId}`);
    return savedDashboard;
  }

  async updateDashboardUsage(tenantId: string, dashboardId: string): Promise<void> {
    await this.dashboardConfigRepo.update(
      { tenantId, id: dashboardId },
      {
        usageCount: () => 'usageCount + 1',
        lastUsedAt: new Date(),
      }
    );
  }

  private async unsetDefaultDashboard(tenantId: string): Promise<void> {
    await this.dashboardConfigRepo.update(
      { tenantId, isDefault: true },
      { isDefault: false }
    );
  }

  async getDashboardMetrics(tenantId: string): Promise<any> {
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
}
