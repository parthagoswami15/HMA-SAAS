import { 
  BadRequestException, 
  Injectable, 
  NotFoundException, 
  ConflictException,
  Logger,
  InternalServerErrorException
} from '@nestjs/common';
import { Prisma, Tenant } from '@prisma/client';
import { TenantType } from '../enums/tenant-type.enum';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';

interface FindAllParams {
  skip?: number;
  take?: number;
  cursor?: Prisma.TenantWhereUniqueInput;
  where?: Prisma.TenantWhereInput;
  orderBy?: Prisma.TenantOrderByWithRelationInput;
  includeDeleted?: boolean;
}

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new tenant (hospital/clinic/lab)
   */
  async create(createTenantDto: CreateTenantDto): Promise<TenantResponseDto> {
    try {
      // Generate a URL-friendly slug if not provided
      const slug = createTenantDto.slug || 
        createTenantDto.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '');

      // Check if slug is already taken
      const slugTaken = await this.isSlugTaken(slug);
      if (slugTaken) {
        throw new ConflictException('A tenant with this slug already exists');
      }

      // Map DTO to Prisma create input
      const createData: Prisma.TenantCreateInput = {
        name: createTenantDto.name,
        slug,
        type: createTenantDto.type || TenantType.HOSPITAL,
        isActive: createTenantDto.isActive ?? true,
      };

      // Add optional fields if provided
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

      return new TenantResponseDto(tenant);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('A tenant with this email already exists');
        }
      }
      this.logger.error(`Error creating tenant: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create tenant');
    }
  }

  /**
   * Find all tenants with optional pagination and filtering
   */
  async findAll(params: FindAllParams = {}): Promise<TenantResponseDto[]> {
    const { skip, take, cursor, where = {}, orderBy, includeDeleted = false } = params;
    
    try {
      const whereClause: Prisma.TenantWhereInput = includeDeleted 
        ? where 
        : { 
            ...where, 
            deletedAt: null 
          };

      const query: Prisma.TenantFindManyArgs = {
        skip,
        take,
        cursor,
        where: whereClause,
        orderBy: orderBy || { createdAt: 'desc' },
      };

      const tenants = await this.prisma.tenant.findMany(query);
      return tenants.map(tenant => new TenantResponseDto(tenant));
    } catch (error) {
      this.logger.error(`Error finding tenants: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve tenants');
    }
  }

  /**
   * Find a single tenant by ID
   */
  async findOne(id: string, includeDeleted = false): Promise<TenantResponseDto> {
    try {
      const where: Prisma.TenantWhereUniqueInput = { id };
      
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
        throw new NotFoundException(`Tenant with ID ${id} not found`);
      }

      return new TenantResponseDto(tenant);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding tenant: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve tenant');
    }
  }

  /**
   * Update a tenant
   */
  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<TenantResponseDto> {
    try {
      // Check if tenant exists and is not deleted
      const existingTenant = await this.prisma.tenant.findFirst({
        where: { 
          id,
          deletedAt: null 
        },
      });

      if (!existingTenant) {
        throw new NotFoundException(`Tenant with ID ${id} not found`);
      }

      // Prepare update data
      const updateData: Prisma.TenantUpdateInput = {
        updatedAt: new Date(),
      };

      // Only update fields that are provided in the DTO
      if (updateTenantDto.name !== undefined) updateData.name = updateTenantDto.name;
      if (updateTenantDto.type !== undefined) updateData.type = updateTenantDto.type as any; // Cast to any to bypass type checking
      if (updateTenantDto.address !== undefined) (updateData as any).address = updateTenantDto.address;
      if (updateTenantDto.phone !== undefined) (updateData as any).phone = updateTenantDto.phone;
      if (updateTenantDto.email !== undefined) (updateData as any).email = updateTenantDto.email;
      if (updateTenantDto.logo !== undefined) (updateData as any).logo = updateTenantDto.logo;
      if (updateTenantDto.isActive !== undefined) updateData.isActive = updateTenantDto.isActive;

      // Handle slug update separately to check for conflicts
      if (updateTenantDto.slug && updateTenantDto.slug !== existingTenant.slug) {
        const isSlugTaken = await this.isSlugTaken(updateTenantDto.slug, id);
        if (isSlugTaken) {
          throw new ConflictException('A tenant with this slug already exists');
        }
        (updateData as any).slug = updateTenantDto.slug;
      }

      const updatedTenant = await this.prisma.tenant.update({
        where: { id },
        data: updateData,
      });

      return new TenantResponseDto(updatedTenant);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error updating tenant ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update tenant');
    }
  }

  /**
   * Soft delete a tenant
   */
  async remove(id: string): Promise<void> {
    try {
      // Check if tenant exists and is not already deleted
      const tenant = await this.prisma.tenant.findFirst({
        where: { 
          id,
          deletedAt: null 
        },
      });

      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${id} not found or already deleted`);
      }

      // Soft delete the tenant
      await this.prisma.tenant.update({
        where: { id },
        data: {
          isActive: false,
          deletedAt: new Date(),
          // Also update the slug to prevent conflicts if a new tenant with the same slug is created
          slug: `${tenant.slug}-deleted-${Date.now()}`,
        } as any, // Cast to any to bypass type checking
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting tenant ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete tenant');
    }
  }

  /**
   * Check if a tenant with the given slug exists
   */
  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const where: Prisma.TenantWhereInput = { 
        slug,
        deletedAt: null, // Only check non-deleted tenants
      };

      if (excludeId) {
        where.NOT = { id: excludeId };
      }

      const count = await this.prisma.tenant.count({ 
        where: where as Prisma.TenantWhereInput 
      });
      
      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking slug availability: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to check slug availability');
    }
  }

  /**
   * Count tenants based on filter conditions
   */
  async count(where?: Prisma.TenantWhereInput): Promise<number> {
    try {
      const whereClause: Prisma.TenantWhereInput = where || {};
      
      // Ensure we only count non-deleted tenants
      if (!whereClause.deletedAt) {
        whereClause.deletedAt = null;
      }
      
      return await this.prisma.tenant.count({
        where: whereClause,
      });
    } catch (error) {
      this.logger.error(`Error counting tenants: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to count tenants');
    }
  }
}
