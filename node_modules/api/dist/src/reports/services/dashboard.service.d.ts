import { Repository } from 'typeorm';
import { DashboardConfig, DashboardAccess } from '../entities/reports.entity';
import { CreateDashboardDto, UpdateDashboardDto } from '../dto/reports.dto';
export declare class DashboardService {
    private readonly dashboardConfigRepo;
    private readonly dashboardAccessRepo;
    private readonly logger;
    constructor(dashboardConfigRepo: Repository<DashboardConfig>, dashboardAccessRepo: Repository<DashboardAccess>);
    createDashboard(tenantId: string, userId: string, createDashboardDto: CreateDashboardDto): Promise<DashboardConfig>;
    getDashboards(tenantId: string, options: {
        search?: string;
        page: number;
        limit: number;
    }): Promise<{
        dashboards: DashboardConfig[];
        total: number;
        page: number;
        limit: number;
    }>;
    getDashboard(tenantId: string, id: string): Promise<DashboardConfig>;
    updateDashboard(tenantId: string, id: string, userId: string, updateDashboardDto: UpdateDashboardDto): Promise<DashboardConfig>;
    deleteDashboard(tenantId: string, id: string): Promise<void>;
    grantDashboardAccess(tenantId: string, dashboardId: string, userId: string, permission: 'VIEW' | 'EDIT' | 'DELETE' | 'SHARE'): Promise<void>;
    revokeDashboardAccess(tenantId: string, dashboardId: string, userId: string): Promise<void>;
    checkDashboardAccess(tenantId: string, dashboardId: string, userId: string, requiredPermission: 'VIEW' | 'EDIT' | 'DELETE' | 'SHARE'): Promise<boolean>;
    shareDashboard(tenantId: string, dashboardId: string, userId: string, targetUserIds: string[], permission: 'VIEW' | 'EDIT'): Promise<void>;
    getUserDashboards(tenantId: string, userId: string): Promise<DashboardConfig[]>;
    getDefaultDashboard(tenantId: string): Promise<DashboardConfig | null>;
    cloneDashboard(tenantId: string, dashboardId: string, userId: string, newName: string): Promise<DashboardConfig>;
    updateDashboardUsage(tenantId: string, dashboardId: string): Promise<void>;
    private unsetDefaultDashboard;
    getDashboardMetrics(tenantId: string): Promise<any>;
}
