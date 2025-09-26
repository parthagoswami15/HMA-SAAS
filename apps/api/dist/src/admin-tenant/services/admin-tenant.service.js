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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTenantService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const admin_tenant_dto_1 = require("../dto/admin-tenant.dto");
let AdminTenantService = class AdminTenantService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTenant(createDto, superAdminId) {
        const existingTenant = await this.prisma.tenant.findUnique({
            where: { slug: createDto.slug },
        });
        if (existingTenant) {
            throw new common_1.ConflictException('Tenant with this slug already exists');
        }
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
                storageQuota: createDto.storageQuota || 10,
                userSeats: createDto.userSeats || 10,
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
        if (createDto.adminUser) {
            await this.prisma.user.create({
                data: {
                    firstName: createDto.adminUser.firstName,
                    lastName: createDto.adminUser.lastName,
                    email: createDto.adminUser.email,
                    password: createDto.adminUser.password,
                    role: 'HOSPITAL_ADMIN',
                    tenantId: tenant.id,
                    isActive: true,
                },
            });
        }
        return tenant;
    }
    async provisionTenant(tenantId, provisioningDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const templateConfig = await this.getProvisioningTemplate(provisioningDto.template);
        const updatedTenant = await this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                ...templateConfig,
                ...provisioningDto.configOverrides,
            },
        });
        if (!provisioningDto.skipSeeding) {
            await this.seedTenantData(tenantId, provisioningDto.template);
        }
        return updatedTenant;
    }
    async updateTenant(id, updateDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
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
    async findAll(filterDto, listDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = false } = listDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (filterDto.billingMode)
            where.billingMode = filterDto.billingMode;
        if (filterDto.subscriptionPlan)
            where.subscriptionPlan = filterDto.subscriptionPlan;
        if (filterDto.isActive !== undefined)
            where.isActive = filterDto.isActive;
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Tenant not found');
        }
        return tenant;
    }
    async toggleModule(tenantId, moduleToggleDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const currentModules = tenant.enabledModules || [];
        let updatedModules;
        if (moduleToggleDto.enabled) {
            updatedModules = [...new Set([...currentModules, moduleToggleDto.moduleName])];
        }
        else {
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
    async updateSubscriptionPlan(tenantId, subscriptionDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const updateData = {
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
    async updateStorageQuota(tenantId, quotaDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const currentUsage = await this.calculateStorageUsage(tenantId);
        if (currentUsage > quotaDto.quotaGB) {
            throw new common_1.BadRequestException('Cannot set quota below current usage');
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
    async updateUserSeats(tenantId, seatsDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const currentUsers = await this.prisma.user.count({
            where: { tenantId },
        });
        if (currentUsers > seatsDto.seatsLimit) {
            throw new common_1.BadRequestException('Cannot set seats below current user count');
        }
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                userSeats: seatsDto.seatsLimit,
            },
        });
    }
    async getTenantStats(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const [userCount, patientCount, appointmentCount, storageUsage, monthlyRevenue,] = await Promise.all([
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
    async exportTenantData(tenantId, exportDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
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
                requestedBy: 'system',
            },
        });
        await this.performDataExport(exportJob.id);
        return exportJob;
    }
    async configureBackupSchedule(tenantId, scheduleDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
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
    async configureEnvironment(tenantId, configDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
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
    async recordMeteringData(meteringDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: meteringDto.tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
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
    async generateInvoice(invoiceDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: invoiceDto.tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const meteringData = await this.prisma.meteringData.findFirst({
            where: {
                tenantId: invoiceDto.tenantId,
                periodStart: { lte: new Date(invoiceDto.billingPeriod) },
                periodEnd: { gte: new Date(invoiceDto.billingPeriod) },
            },
        });
        if (!meteringData) {
            throw new common_1.NotFoundException('Metering data not found for billing period');
        }
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
    async getProvisioningTemplate(templateName) {
        const templates = {
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
    async seedTenantData(tenantId, template) {
        console.log(`Seeding data for tenant ${tenantId} with template ${template}`);
    }
    async calculateStorageUsage(tenantId) {
        const fileCount = await this.prisma.fileStorage.count({
            where: { tenantId },
        });
        return fileCount * 0.1;
    }
    async calculateMonthlyRevenue(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant)
            return 0;
        const basePrices = {
            [admin_tenant_dto_1.SubscriptionPlan.BASIC]: 99,
            [admin_tenant_dto_1.SubscriptionPlan.PROFESSIONAL]: 299,
            [admin_tenant_dto_1.SubscriptionPlan.ENTERPRISE]: 799,
            [admin_tenant_dto_1.SubscriptionPlan.CUSTOM]: tenant.customPrice || 0,
        };
        return basePrices[tenant.subscriptionPlan];
    }
    async performDataExport(exportJobId) {
        await this.prisma.dataExport.update({
            where: { id: exportJobId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
            },
        });
    }
    calculateInvoiceAmount(meteringData, tenant) {
        let amount = 0;
        if (meteringData.costs) {
            Object.values(meteringData.costs).forEach((cost) => {
                amount += cost.amount || 0;
            });
        }
        const basePrices = {
            [admin_tenant_dto_1.SubscriptionPlan.BASIC]: 99,
            [admin_tenant_dto_1.SubscriptionPlan.PROFESSIONAL]: 299,
            [admin_tenant_dto_1.SubscriptionPlan.ENTERPRISE]: 799,
            [admin_tenant_dto_1.SubscriptionPlan.CUSTOM]: tenant.customPrice || 0,
        };
        amount += basePrices[tenant.subscriptionPlan];
        return amount;
    }
};
exports.AdminTenantService = AdminTenantService;
exports.AdminTenantService = AdminTenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminTenantService);
//# sourceMappingURL=admin-tenant.service.js.map