import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto, UpdateTenantDto, TenantProvisioningDto, ModuleToggleDto, SubscriptionPlanDto, TenantFilterDto, TenantListDto, StorageQuotaDto, UserSeatsDto, DataExportDto, BackupScheduleDto, EnvironmentConfigDto, MeteringDataDto, InvoiceGenerationDto } from '../dto/admin-tenant.dto';
export declare class AdminTenantService {
    private prisma;
    constructor(prisma: PrismaService);
    createTenant(createDto: CreateTenantDto, superAdminId: string): Promise<any>;
    provisionTenant(tenantId: string, provisioningDto: TenantProvisioningDto): Promise<any>;
    updateTenant(id: string, updateDto: UpdateTenantDto): Promise<any>;
    findAll(filterDto: TenantFilterDto, listDto: TenantListDto): Promise<any>;
    findOne(id: string): Promise<any>;
    toggleModule(tenantId: string, moduleToggleDto: ModuleToggleDto): Promise<any>;
    updateSubscriptionPlan(tenantId: string, subscriptionDto: SubscriptionPlanDto): Promise<any>;
    updateStorageQuota(tenantId: string, quotaDto: StorageQuotaDto): Promise<any>;
    updateUserSeats(tenantId: string, seatsDto: UserSeatsDto): Promise<any>;
    getTenantStats(tenantId: string): Promise<any>;
    exportTenantData(tenantId: string, exportDto: DataExportDto): Promise<any>;
    configureBackupSchedule(tenantId: string, scheduleDto: BackupScheduleDto): Promise<any>;
    configureEnvironment(tenantId: string, configDto: EnvironmentConfigDto): Promise<any>;
    recordMeteringData(meteringDto: MeteringDataDto): Promise<any>;
    generateInvoice(invoiceDto: InvoiceGenerationDto): Promise<any>;
    private getProvisioningTemplate;
    private seedTenantData;
    private calculateStorageUsage;
    private calculateMonthlyRevenue;
    private performDataExport;
    private calculateInvoiceAmount;
}
