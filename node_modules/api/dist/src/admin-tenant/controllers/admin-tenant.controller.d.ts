import { AdminTenantService } from '../services/admin-tenant.service';
import { CreateTenantDto, UpdateTenantDto, TenantProvisioningDto, ModuleToggleDto, SubscriptionPlanDto, TenantFilterDto, TenantListDto, StorageQuotaDto, UserSeatsDto, DataExportDto, BackupScheduleDto, EnvironmentConfigDto, MeteringDataDto, InvoiceGenerationDto } from '../dto/admin-tenant.dto';
export declare class AdminTenantController {
    private readonly adminTenantService;
    constructor(adminTenantService: AdminTenantService);
    create(createDto: CreateTenantDto, req: any): Promise<any>;
    provision(tenantId: string, provisioningDto: TenantProvisioningDto): Promise<any>;
    findAll(filterDto: TenantFilterDto, listDto: TenantListDto): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDto: UpdateTenantDto): Promise<any>;
    toggleModule(tenantId: string, moduleToggleDto: ModuleToggleDto): Promise<any>;
    updateSubscription(tenantId: string, subscriptionDto: SubscriptionPlanDto): Promise<any>;
    updateStorageQuota(tenantId: string, quotaDto: StorageQuotaDto): Promise<any>;
    updateUserSeats(tenantId: string, seatsDto: UserSeatsDto): Promise<any>;
    getStats(tenantId: string): Promise<any>;
    exportData(tenantId: string, exportDto: DataExportDto): Promise<any>;
    configureBackupSchedule(tenantId: string, scheduleDto: BackupScheduleDto): Promise<any>;
    configureEnvironment(tenantId: string, configDto: EnvironmentConfigDto): Promise<any>;
    recordMetering(meteringDto: MeteringDataDto): Promise<any>;
    generateInvoice(invoiceDto: InvoiceGenerationDto): Promise<any>;
    activate(id: string): Promise<any>;
    deactivate(id: string): Promise<any>;
    remove(id: string): Promise<void>;
}
