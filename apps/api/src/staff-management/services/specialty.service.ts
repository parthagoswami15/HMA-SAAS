import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { 
  ISpecialty, 
  ICreateSpecialty, 
  IUpdateSpecialty, 
  ISpecialtyFilterOptions, 
  IStaffSpecialty,
  ICreateStaffSpecialty,
  IUpdateStaffSpecialty
} from '../interfaces/specialty.interface';
import { PaginatedResponse } from '../../common/interfaces';
import { Prisma } from '@prisma/client';

@Injectable()
export class SpecialtyService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Create a new specialty
   */
  async create(tenantId: string, createSpecialtyDto: ICreateSpecialty): Promise<ISpecialty> {
    const { code, ...specialtyData } = createSpecialtyDto;

    // Check if code is already in use (if provided)
    if (code) {
      const existingSpecialty = await this.prisma.specialty.findFirst({
        where: {
          tenantId,
          code,
          deletedAt: null,
        },
      });

      if (existingSpecialty) {
        throw new ConflictException(`Specialty with code '${code}' already exists`);
      }
    }

    // Create specialty
    return this.prisma.specialty.create({
      data: {
        ...specialtyData,
        code,
        tenantId,
        isActive: specialtyData.isActive !== false, // Default to true if not specified
        displayOrder: specialtyData.displayOrder ?? 0,
        requiresCertification: specialtyData.requiresCertification ?? false,
        minYearsExperience: specialtyData.minYearsExperience ?? 0,
      },
    });
  }

  /**
   * Find all specialties with pagination and filtering
   */
  async findAll(
    tenantId: string,
    options: ISpecialtyFilterOptions = {},
  ): Promise<PaginatedResponse<ISpecialty>> {
    const {
      search,
      category,
      isActive = true,
      requiresCertification,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
    } = options;

    const skip = (page - 1) * limit;
    const where: Prisma.SpecialtyWhereInput = {
      tenantId,
      deletedAt: null,
    };

    // Apply filters
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;
    if (requiresCertification !== undefined) where.requiresCertification = requiresCertification;

    // Get total count for pagination
    const total = await this.prisma.specialty.count({ where });

    // Get paginated results
    const data = await this.prisma.specialty.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find a specialty by ID
   */
  async findById(tenantId: string, id: string): Promise<ISpecialty> {
    const specialty = await this.prisma.specialty.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!specialty) {
      throw new NotFoundException(`Specialty with ID ${id} not found`);
    }

    return specialty;
  }

  /**
   * Find a specialty by code
   */
  async findByCode(tenantId: string, code: string): Promise<ISpecialty | null> {
    return this.prisma.specialty.findFirst({
      where: {
        code,
        tenantId,
        deletedAt: null,
      },
    });
  }

  /**
   * Update a specialty
   */
  async update(
    tenantId: string,
    id: string,
    updateSpecialtyDto: IUpdateSpecialty,
  ): Promise<ISpecialty> {
    const { code, ...specialtyData } = updateSpecialtyDto;

    // Check if specialty exists
    const existingSpecialty = await this.prisma.specialty.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!existingSpecialty) {
      throw new NotFoundException(`Specialty with ID ${id} not found`);
    }

    // Check if code is being changed and if it's already in use
    if (code && code !== existingSpecialty.code) {
      const existingWithCode = await this.prisma.specialty.findFirst({
        where: {
          code,
          tenantId,
          deletedAt: null,
          NOT: { id },
        },
      });

      if (existingWithCode) {
        throw new ConflictException(`Specialty with code '${code}' already exists`);
      }
    }

    // Update specialty
    return this.prisma.specialty.update({
      where: { id },
      data: {
        ...specialtyData,
        code,
        // Ensure we don't update these fields
        id: undefined,
        tenantId: undefined,
        createdAt: undefined,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete a specialty (soft delete)
   */
  async delete(tenantId: string, id: string): Promise<{ success: boolean }> {
    // Check if specialty exists
    const specialty = await this.prisma.specialty.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!specialty) {
      throw new NotFoundException(`Specialty with ID ${id} not found`);
    }

    // Check if specialty is assigned to any staff
    const staffCount = await this.prisma.staffSpecialty.count({
      where: {
        specialtyId: id,
        deletedAt: null,
      },
    });

    if (staffCount > 0) {
      throw new BadRequestException('Cannot delete specialty that is assigned to staff members');
    }

    // Soft delete the specialty
    await this.prisma.specialty.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    return { success: true };
  }

  /**
   * Assign specialties to a staff member
   */
  async assignSpecialtiesToStaff(
    tenantId: string,
    staffId: string,
    specialties: ICreateStaffSpecialty[],
  ): Promise<{ success: boolean }> {
    if (!specialties || specialties.length === 0) {
      return { success: true };
    }

    // Validate staff exists
    const staff = await this.prisma.staff.findFirst({
      where: {
        id: staffId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${staffId} not found`);
    }

    // Validate specialties exist
    const specialtyIds = specialties.map(s => s.specialtyId);
    await this.validateSpecialtiesExist(tenantId, specialtyIds);

    // Get existing staff specialties
    const existingStaffSpecialties = await this.prisma.staffSpecialty.findMany({
      where: {
        staffId,
        deletedAt: null,
      },
      select: {
        specialtyId: true,
      },
    });

    const existingSpecialtyIds = existingStaffSpecialties.map(es => es.specialtyId);
    const newSpecialties = specialties.filter(s => !existingSpecialtyIds.includes(s.specialtyId));

    // Start transaction
    await this.prisma.$transaction(async (prisma) => {
      // Add new specialties
      if (newSpecialties.length > 0) {
        await prisma.staffSpecialty.createMany({
          data: newSpecialties.map(specialty => ({
            staffId,
            specialtyId: specialty.specialtyId,
            isPrimary: specialty.isPrimary ?? false,
            experience: specialty.experience,
            notes: specialty.notes,
            startDate: specialty.startDate,
            certificationNumber: specialty.certificationNumber,
            certificationExpiryDate: specialty.certificationExpiryDate,
            tenantId,
          })),
          skipDuplicates: true,
        });
      }
    });

    return { success: true };
  }

  /**
   * Update staff specialties (replaces all existing specialties)
   */
  async updateStaffSpecialties(
    tenantId: string,
    staffId: string,
    specialties: ICreateStaffSpecialty[],
  ): Promise<{ success: boolean }> {
    // Validate staff exists
    const staff = await this.prisma.staff.findFirst({
      where: {
        id: staffId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${staffId} not found`);
    }

    // If empty array, remove all specialties
    if (!specialties || specialties.length === 0) {
      await this.prisma.staffSpecialty.updateMany({
        where: {
          staffId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      return { success: true };
    }

    // Validate specialties exist
    const specialtyIds = specialties.map(s => s.specialtyId);
    await this.validateSpecialtiesExist(tenantId, specialtyIds);

    // Start transaction
    await this.prisma.$transaction(async (prisma) => {
      // Get existing staff specialties
      const existingStaffSpecialties = await prisma.staffSpecialty.findMany({
        where: {
          staffId,
          deletedAt: null,
        },
        select: {
          id: true,
          specialtyId: true,
        },
      });

      const existingSpecialtyIds = existingStaffSpecialties.map(es => es.specialtyId);
      const newSpecialtyIds = specialtyIds.filter(id => !existingSpecialtyIds.includes(id));
      const removedSpecialtyIds = existingSpecialtyIds.filter(id => !specialtyIds.includes(id));

      // Remove specialties that are no longer assigned
      if (removedSpecialtyIds.length > 0) {
        await prisma.staffSpecialty.updateMany({
          where: {
            staffId,
            specialtyId: { in: removedSpecialtyIds },
          },
          data: {
            deletedAt: new Date(),
          },
        });
      }

      // Add new specialties
      if (newSpecialtyIds.length > 0) {
        const newSpecialties = specialties.filter(s => newSpecialtyIds.includes(s.specialtyId));
        
        await prisma.staffSpecialty.createMany({
          data: newSpecialties.map(specialty => ({
            staffId,
            specialtyId: specialty.specialtyId,
            isPrimary: specialty.isPrimary ?? false,
            experience: specialty.experience,
            notes: specialty.notes,
            startDate: specialty.startDate,
            certificationNumber: specialty.certificationNumber,
            certificationExpiryDate: specialty.certificationExpiryDate,
            tenantId,
          })),
          skipDuplicates: true,
        });
      }

      // Update existing specialties
      const updatedSpecialties = specialties.filter(s => 
        existingSpecialtyIds.includes(s.specialtyId) && 
        !removedSpecialtyIds.includes(s.specialtyId)
      );

      for (const specialty of updatedSpecialties) {
        const existing = existingStaffSpecialties.find(es => es.specialtyId === specialty.specialtyId);
        if (existing) {
          await prisma.staffSpecialty.update({
            where: { id: existing.id },
            data: {
              isPrimary: specialty.isPrimary,
              experience: specialty.experience,
              notes: specialty.notes,
              startDate: specialty.startDate,
              certificationNumber: specialty.certificationNumber,
              certificationExpiryDate: specialty.certificationExpiryDate,
              updatedAt: new Date(),
            },
          });
        }
      }
    });

    return { success: true };
  }

  /**
   * Get all specialties for a staff member
   */
  async getStaffSpecialties(staffId: string): Promise<IStaffSpecialty[]> {
    return this.prisma.staffSpecialty.findMany({
      where: {
        staffId,
        deletedAt: null,
      },
      include: {
        specialty: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
          },
        },
      },
    });
  }

  /**
   * Update a staff member's specialty
   */
  async updateStaffSpecialty(
    tenantId: string,
    staffId: string,
    specialtyId: string,
    updateData: IUpdateStaffSpecialty,
  ): Promise<IStaffSpecialty> {
    const { remove, ...updateDto } = updateData;

    // Check if staff specialty exists
    const existing = await this.prisma.staffSpecialty.findFirst({
      where: {
        staffId,
        specialtyId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Specialty with ID ${specialtyId} not found for staff member ${staffId}`,
      );
    }

    // If remove flag is true, soft delete the record
    if (remove) {
      return this.prisma.staffSpecialty.update({
        where: { id: existing.id },
        data: {
          deletedAt: new Date(),
        },
      });
    }

    // Otherwise, update the record
    return this.prisma.staffSpecialty.update({
      where: { id: existing.id },
      data: {
        ...updateDto,
        // Ensure we don't update these fields
        id: undefined,
        staffId: undefined,
        specialtyId: undefined,
        tenantId: undefined,
        createdAt: undefined,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Validate that all specialty IDs exist
   */
  async validateSpecialtiesExist(tenantId: string, specialtyIds: string[]): Promise<void> {
    if (!specialtyIds || specialtyIds.length === 0) return;

    const uniqueSpecialtyIds = [...new Set(specialtyIds)];
    const count = await this.prisma.specialty.count({
      where: {
        id: { in: uniqueSpecialtyIds },
        tenantId,
        deletedAt: null,
      },
    });

    if (count !== uniqueSpecialtyIds.length) {
      throw new NotFoundException('One or more specialties not found');
    }
  }

  /**
   * Get staff count by specialty
   */
  async getCountBySpecialty(tenantId: string): Promise<{ specialtyId: string; specialtyName: string; count: number }[]> {
    const result = await this.prisma.staffSpecialty.groupBy({
      by: ['specialtyId'],
      where: {
        deletedAt: null,
        staff: {
          tenantId,
          isActive: true,
          deletedAt: null,
        },
      },
      _count: {
        staffId: true,
      },
      orderBy: {
        _count: {
          staffId: 'desc',
        },
      },
      include: {
        specialty: {
          select: {
            name: true,
          },
        },
      },
    });

    return result.map((item) => ({
      specialtyId: item.specialtyId,
      specialtyName: item.specialty?.name || 'Unknown',
      count: item._count.staffId,
    }));
  }
}
