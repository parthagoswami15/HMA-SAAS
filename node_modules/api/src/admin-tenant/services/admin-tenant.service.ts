import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTenantDto,
  UpdateTenantDto,
  TenantProvisioningDto,
  ModuleToggleDto,
  SubscriptionPlanDto,
  TenantFilterDto,
  TenantListDto,
  StorageQuotaDto,
  UserSeatsDto,
  DataExportDto,
  BackupScheduleDto,
  EnvironmentConfigDto,
  MeteringDataDto,
  InvoiceGenerationDto,
  BillingMode,
  SubscriptionPlan,
  EnvironmentType
} from '../dto/admin-tenant.dto';

@Injectable()
export class AdminTenantService {
  constructor(private prisma: PrismaService) {}

  async createTenant(createDto: CreateTenantDto, superAdminId: string): Promise<any> {
    // Check if slug already exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: createDto.slug },
    });

    if (existingTenant) {
      throw new ConflictException('Tenant with this slug already exists');
    }

    // Create tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: createDto.name,
        slug: createDto.slug,
        description: createDto.description,
        domain: createDto.domain,
        contactEmail: createDto.contactEmail,
        contactPhone: createDto.contactPhone,
        billingMode: createDto.billingMode,
        subscriptionPlan: createDto.subscriptionPlan,
        storageQuota: createDto.storageQuota || 10, // Default 10GB
        userSeats: createDto.userSeats || 10, // Default 10 seats
        enabledModules: createDto.enabledModules || ['patients', 'appointments'],
        themeConfig: createDto.themeConfig || {},
        taxProfile: createDto.taxProfile || {},
        tariffs: createDto.tariffs || [],
        isActive: true,
        createdBy: superAdminId,
      },
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
          },
        },
      },
    });

    // Create default admin user
    if (createDto.adminUser) {
      await this.prisma.user.create({
        data: {
          firstName: createDto.adminUser.firstName,
          lastName: createDto.adminUser.lastName,
          email: createDto.adminUser.email,
          password: createDto.adminUser.password, // This should be hashed
          role: 'HOSPITAL_ADMIN',
          tenantId: tenant.id,
          isActive: true,
        },
      });
    }

    return tenant;
  }

  async provisionTenant(tenantId: string, provisioningDto: TenantProvisioningDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Apply provisioning template
    const templateConfig = await this.getProvisioningTemplate(provisioningDto.template);

    // Update tenant with template configuration
    const updatedTenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ...templateConfig,
        ...provisioningDto.configOverrides,
      },
    });

    // Seed initial data if not skipped
    if (!provisioningDto.skipSeeding) {
      await this.seedTenantData(tenantId, provisioningDto.template);
    }

    return updatedTenant;
  }

  async updateTenant(id: string, updateDto: UpdateTenantDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.tenant.update({
      where: { id },
      data: updateDto,
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
          },
        },
      },
    });
  }

  async findAll(filterDto: TenantFilterDto, listDto: TenantListDto): Promise<any> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = false } = listDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filterDto.billingMode) where.billingMode = filterDto.billingMode;
    if (filterDto.subscriptionPlan) where.subscriptionPlan = filterDto.subscriptionPlan;
    if (filterDto.isActive !== undefined) where.isActive = filterDto.isActive;
    if (filterDto.search) {
      where.OR = [
        { name: { contains: filterDto.search } },
        { slug: { contains: filterDto.search } },
        { description: { contains: filterDto.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder ? 'desc' : 'asc' },
        include: {
          _count: {
            select: {
              users: true,
              patients: true,
            },
          },
        },
      }),
      this.prisma.tenant.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
            appointments: true,
            billingRecords: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async toggleModule(tenantId: string, moduleToggleDto: ModuleToggleDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const currentModules = tenant.enabledModules || [];
    let updatedModules;

    if (moduleToggleDto.enabled) {
      updatedModules = [...new Set([...currentModules, moduleToggleDto.moduleName])];
    } else {
      updatedModules = currentModules.filter(module => module !== moduleToggleDto.moduleName);
    }

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        enabledModules: updatedModules,
        moduleConfig: {
          ...tenant.moduleConfig,
          [moduleToggleDto.moduleName]: moduleToggleDto.config || {},
        },
      },
    });
  }

  async updateSubscriptionPlan(tenantId: string, subscriptionDto: SubscriptionPlanDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const updateData: any = {
      subscriptionPlan: subscriptionDto.plan,
    };

    if (subscriptionDto.customPrice) {
      updateData.customPrice = subscriptionDto.customPrice;
    }

    if (subscriptionDto.billingCycle) {
      updateData.billingCycle = subscriptionDto.billingCycle;
    }

    if (subscriptionDto.additionalFeatures) {
      updateData.additionalFeatures = subscriptionDto.additionalFeatures;
    }

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
    });
  }

  async updateStorageQuota(tenantId: string, quotaDto: StorageQuotaDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Check current usage
    const currentUsage = await this.calculateStorageUsage(tenantId);

    if (currentUsage > quotaDto.quotaGB) {
      throw new BadRequestException('Cannot set quota below current usage');
    }

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        storageQuota: quotaDto.quotaGB,
        storageWarningThreshold: quotaDto.warningThreshold || 80,
        storageCriticalThreshold: quotaDto.criticalThreshold || 95,
      },
    });
  }

  async updateUserSeats(tenantId: string, seatsDto: UserSeatsDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const currentUsers = await this.prisma.user.count({
      where: { tenantId },
    });

    if (currentUsers > seatsDto.seatsLimit) {
      throw new BadRequestException('Cannot set seats below current user count');
    }

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        userSeats: seatsDto.seatsLimit,
      },
    });
  }

  async getTenantStats(tenantId: string): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const [
      userCount,
      patientCount,
      appointmentCount,
      storageUsage,
      monthlyRevenue,
    ] = await Promise.all([
      this.prisma.user.count({ where: { tenantId } }),
      this.prisma.patient.count({ where: { tenantId } }),
      this.prisma.appointment.count({ where: { tenantId } }),
      this.calculateStorageUsage(tenantId),
      this.calculateMonthlyRevenue(tenantId),
    ]);

    return {
      tenantId,
      userCount,
      patientCount,
      appointmentCount,
      storageUsage,
      storageQuota: tenant.storageQuota,
      storageUtilization: (storageUsage / tenant.storageQuota) * 100,
      userSeats: tenant.userSeats,
      userUtilization: (userCount / tenant.userSeats) * 100,
      monthlyRevenue,
      subscriptionPlan: tenant.subscriptionPlan,
      billingMode: tenant.billingMode,
      isActive: tenant.isActive,
    };
  }

  async exportTenantData(tenantId: string, exportDto: DataExportDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Create export job
    const exportJob = await this.prisma.dataExport.create({
      data: {
        tenantId,
        exportType: exportDto.exportType,
        dateFrom: exportDto.dateFrom ? new Date(exportDto.dateFrom) : undefined,
        dateTo: exportDto.dateTo ? new Date(exportDto.dateTo) : undefined,
        modules: exportDto.modules,
        format: exportDto.format || 'JSON',
        includeAuditLogs: exportDto.includeAuditLogs || false,
        status: 'PENDING',
        requestedBy: 'system', // This should be the user ID
      },
    });

    // Start export process (this would typically be handled by a queue)
    // For now, we'll simulate the export
    await this.performDataExport(exportJob.id);

    return exportJob;
  }

  async configureBackupSchedule(tenantId: string, scheduleDto: BackupScheduleDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.backupSchedule.upsert({
      where: { tenantId },
      update: scheduleDto,
      create: {
        tenantId,
        ...scheduleDto,
      },
    });
  }

  async configureEnvironment(tenantId: string, configDto: EnvironmentConfigDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        environmentType: configDto.environmentType,
        environmentConfig: configDto.config || {},
        featureFlags: configDto.featureFlags || {},
      },
    });
  }

  async recordMeteringData(meteringDto: MeteringDataDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: meteringDto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.meteringData.create({
      data: {
        tenantId: meteringDto.tenantId,
        periodStart: new Date(meteringDto.periodStart),
        periodEnd: new Date(meteringDto.periodEnd),
        metrics: meteringDto.metrics || {},
        costs: meteringDto.costs || {},
      },
    });
  }

  async generateInvoice(invoiceDto: InvoiceGenerationDto): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: invoiceDto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Get metering data for the billing period
    const meteringData = await this.prisma.meteringData.findFirst({
      where: {
        tenantId: invoiceDto.tenantId,
        periodStart: { lte: new Date(invoiceDto.billingPeriod) },
        periodEnd: { gte: new Date(invoiceDto.billingPeriod) },
      },
    });

    if (!meteringData) {
      throw new NotFoundException('Metering data not found for billing period');
    }

    // Generate invoice (this would integrate with billing system)
    const invoice = await this.prisma.invoice.create({
      data: {
        tenantId: invoiceDto.tenantId,
        billingPeriod: invoiceDto.billingPeriod,
        amount: this.calculateInvoiceAmount(meteringData, tenant),
        status: invoiceDto.previewOnly ? 'DRAFT' : 'PENDING',
        items: meteringData.costs,
        generatedAt: new Date(),
      },
    });

    return invoice;
  }

  private async getProvisioningTemplate(templateName: string): Promise<any> {
    // This would return template configurations
    const templates: Record<string, any> = {
      'basic': {
        enabledModules: ['patients', 'appointments'],
        storageQuota: 10,
        userSeats: 10,
      },
      'professional': {
        enabledModules: ['patients', 'appointments', 'billing', 'reports'],
        storageQuota: 50,
        userSeats: 50,
      },
      'enterprise': {
        enabledModules: ['patients', 'appointments', 'billing', 'reports', 'telemedicine', 'ai'],
        storageQuota: 200,
        userSeats: 200,
      },
    };

    return templates[templateName] || templates['basic'];
  }

  private async seedTenantData(tenantId: string, template: string): Promise<void> {
    // Seed initial data based on template
    // This would create default users, settings, etc.
    console.log(`Seeding data for tenant ${tenantId} with template ${template}`);
  }

  private async calculateStorageUsage(tenantId: string): Promise<number> {
    // Calculate actual storage usage
    // This is a simplified calculation
    const fileCount = await this.prisma.fileStorage.count({
      where: { tenantId },
    });

    return fileCount * 0.1; // Assume 0.1GB per file on average
  }

  private async calculateMonthlyRevenue(tenantId: string): Promise<number> {
    // Calculate monthly revenue
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) return 0;

    const basePrices: Record<SubscriptionPlan, number> = {
      [SubscriptionPlan.BASIC]: 99,
      [SubscriptionPlan.PROFESSIONAL]: 299,
      [SubscriptionPlan.ENTERPRISE]: 799,
      [SubscriptionPlan.CUSTOM]: tenant.customPrice || 0,
    };

    return basePrices[tenant.subscriptionPlan];
  }

  private async performDataExport(exportJobId: string): Promise<void> {
    // Simulate data export process
    await this.prisma.dataExport.update({
      where: { id: exportJobId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  private calculateInvoiceAmount(meteringData: any, tenant: any): number {
    // Calculate invoice amount based on usage
    let amount = 0;

    if (meteringData.costs) {
      Object.values(meteringData.costs).forEach((cost: any) => {
        amount += cost.amount || 0;
      });
    }

    // Add base subscription fee
    const basePrices: Record<SubscriptionPlan, number> = {
      [SubscriptionPlan.BASIC]: 99,
      [SubscriptionPlan.PROFESSIONAL]: 299,
      [SubscriptionPlan.ENTERPRISE]: 799,
      [SubscriptionPlan.CUSTOM]: tenant.customPrice || 0,
    };

    amount += basePrices[tenant.subscriptionPlan];

    return amount;
  }
}
