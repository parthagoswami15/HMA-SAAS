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
var TenantsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const tenant_type_enum_1 = require("../enums/tenant-type.enum");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_response_dto_1 = require("./dto/tenant-response.dto");
let TenantsService = TenantsService_1 = class TenantsService {
    prisma;
    logger = new common_1.Logger(TenantsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTenantDto) {
        try {
            const slug = createTenantDto.slug ||
                createTenantDto.name
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]+/g, '');
            const slugTaken = await this.isSlugTaken(slug);
            if (slugTaken) {
                throw new common_1.ConflictException('A tenant with this slug already exists');
            }
            const createData = {
                name: createTenantDto.name,
                slug,
                type: createTenantDto.type || tenant_type_enum_1.TenantType.HOSPITAL,
                isActive: createTenantDto.isActive ?? true,
            };
            if (createTenantDto.address !== undefined) {
                createData.address = createTenantDto.address;
            }
            if (createTenantDto.phone !== undefined) {
                createData.phone = createTenantDto.phone;
            }
            if (createTenantDto.email !== undefined) {
                createData.email = createTenantDto.email;
            }
            if (createTenantDto.logo !== undefined) {
                createData.logo = createTenantDto.logo;
            }
            const tenant = await this.prisma.tenant.create({
                data: createData,
            });
            return new tenant_response_dto_1.TenantResponseDto(tenant);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('A tenant with this email already exists');
                }
            }
            this.logger.error(`Error creating tenant: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to create tenant');
        }
    }
    async findAll(params = {}) {
        const { skip, take, cursor, where = {}, orderBy, includeDeleted = false } = params;
        try {
            const whereClause = includeDeleted
                ? where
                : {
                    ...where,
                    deletedAt: null
                };
            const query = {
                skip,
                take,
                cursor,
                where: whereClause,
                orderBy: orderBy || { createdAt: 'desc' },
            };
            const tenants = await this.prisma.tenant.findMany(query);
            return tenants.map(tenant => new tenant_response_dto_1.TenantResponseDto(tenant));
        }
        catch (error) {
            this.logger.error(`Error finding tenants: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to retrieve tenants');
        }
    }
    async findOne(id, includeDeleted = false) {
        try {
            const where = { id };
            const tenant = await this.prisma.tenant.findUnique({
                where,
                ...(!includeDeleted && {
                    where: {
                        ...where,
                        deletedAt: null,
                    },
                }),
            });
            if (!tenant) {
                throw new common_1.NotFoundException(`Tenant with ID ${id} not found`);
            }
            return new tenant_response_dto_1.TenantResponseDto(tenant);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error finding tenant: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to retrieve tenant');
        }
    }
    async update(id, updateTenantDto) {
        try {
            const existingTenant = await this.prisma.tenant.findFirst({
                where: {
                    id,
                    deletedAt: null
                },
            });
            if (!existingTenant) {
                throw new common_1.NotFoundException(`Tenant with ID ${id} not found`);
            }
            const updateData = {
                updatedAt: new Date(),
            };
            if (updateTenantDto.name !== undefined)
                updateData.name = updateTenantDto.name;
            if (updateTenantDto.type !== undefined)
                updateData.type = updateTenantDto.type;
            if (updateTenantDto.address !== undefined)
                updateData.address = updateTenantDto.address;
            if (updateTenantDto.phone !== undefined)
                updateData.phone = updateTenantDto.phone;
            if (updateTenantDto.email !== undefined)
                updateData.email = updateTenantDto.email;
            if (updateTenantDto.logo !== undefined)
                updateData.logo = updateTenantDto.logo;
            if (updateTenantDto.isActive !== undefined)
                updateData.isActive = updateTenantDto.isActive;
            if (updateTenantDto.slug && updateTenantDto.slug !== existingTenant.slug) {
                const isSlugTaken = await this.isSlugTaken(updateTenantDto.slug, id);
                if (isSlugTaken) {
                    throw new common_1.ConflictException('A tenant with this slug already exists');
                }
                updateData.slug = updateTenantDto.slug;
            }
            const updatedTenant = await this.prisma.tenant.update({
                where: { id },
                data: updateData,
            });
            return new tenant_response_dto_1.TenantResponseDto(updatedTenant);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error(`Error updating tenant ${id}: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to update tenant');
        }
    }
    async remove(id) {
        try {
            const tenant = await this.prisma.tenant.findFirst({
                where: {
                    id,
                    deletedAt: null
                },
            });
            if (!tenant) {
                throw new common_1.NotFoundException(`Tenant with ID ${id} not found or already deleted`);
            }
            await this.prisma.tenant.update({
                where: { id },
                data: {
                    isActive: false,
                    deletedAt: new Date(),
                    slug: `${tenant.slug}-deleted-${Date.now()}`,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error deleting tenant ${id}: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to delete tenant');
        }
    }
    async isSlugTaken(slug, excludeId) {
        try {
            const where = {
                slug,
                deletedAt: null,
            };
            if (excludeId) {
                where.NOT = { id: excludeId };
            }
            const count = await this.prisma.tenant.count({
                where: where
            });
            return count > 0;
        }
        catch (error) {
            this.logger.error(`Error checking slug availability: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to check slug availability');
        }
    }
    async count(where) {
        try {
            const whereClause = where || {};
            if (!whereClause.deletedAt) {
                whereClause.deletedAt = null;
            }
            return await this.prisma.tenant.count({
                where: whereClause,
            });
        }
        catch (error) {
            this.logger.error(`Error counting tenants: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to count tenants');
        }
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = TenantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map