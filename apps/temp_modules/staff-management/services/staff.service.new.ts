import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException, 
  Inject, 
  forwardRef,
  Logger,
  InternalServerErrorException
} from '@nestjs/common';
import { 
  ICreateStaff, 
  IUpdateStaff, 
  IStaffWithRelations, 
  IStaffFilterOptions,
  ICreateStaffUser
} from '../interfaces/staff.interface';
import { StaffType, StaffStatus } from '../enums';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';
import { Prisma, Role, User, Staff, StaffSpecialty } from '@prisma/client';
import { UserService } from '../../user/user.service';
import { RoleService } from './role.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Define the include type for staff relations
const staffWithRelations = {
  include: {
    user: {
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    },
    department: true,
    specialties: {
      include: {
        specialty: true,
      },
    },
  },
} as const;

type StaffWithRelations = Prisma.StaffGetPayload<typeof staffWithRelations> & {
  user: User & {
    roles: Array<{
      id: string;
      role: Role;
      assignedAt: Date;
      assignedBy: string;
    }>;
  };
  department?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  specialties: Array<{
    id: string;
    specialty: {
      id: string;
      name: string;
      code: string;
      description: string | null;
    };
    isPrimary: boolean;
    experience: number;
    notes: string | null;
    assignedAt: Date;
    assignedBy: string;
  }>;
};

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);
  
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    private readonly prisma: PrismaService
  ) {}
  
  /**
   * Handle Prisma errors and throw appropriate HTTP exceptions
   */
  private handlePrismaError(error: any, context: string): never {
    this.logger.error(`Database error in ${context}:`, error);
    
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException('Duplicate entry. This record already exists.');
        case 'P2025':
          throw new NotFoundException('The requested record was not found.');
        case 'P2003':
          throw new BadRequestException('Invalid reference. One or more related records do not exist.');
        default:
          throw new InternalServerErrorException('A database error occurred.');
      }
    }
    
    throw error;
  }

  /**
   * Map staff entity to IStaffWithRelations
   */
  private mapToStaffWithRelations(staff: StaffWithRelations | null): IStaffWithRelations | null {
    if (!staff) return null;
    
    try {
      // Map user roles
      const roles = (staff.user?.roles || []).map(userRole => ({
        id: userRole.role?.id || '',
        name: userRole.role?.name || '',
        isSystem: Boolean((userRole.role as any)?.isSystem),
      }));

      // Map specialties
      const specialties = (staff.specialties || []).map(staffSpecialty => ({
        id: staffSpecialty.id,
        specialty: {
          id: staffSpecialty.specialty?.id || '',
          name: staffSpecialty.specialty?.name || '',
          code: staffSpecialty.specialty?.code || '',
          description: staffSpecialty.specialty?.description || null,
        },
        isPrimary: Boolean(staffSpecialty.isPrimary),
        experience: Number(staffSpecialty.experience) || 0,
        notes: staffSpecialty.notes || null,
        assignedAt: staffSpecialty.assignedAt || new Date(),
        assignedBy: staffSpecialty.assignedBy || 'system',
      }));

      // Map department
      const department = staff.department ? {
        id: staff.department.id,
        name: staff.department.name,
        code: staff.department.code || '',
        description: staff.department.description || null,
      } : undefined;

      // Map user
      const user = {
        id: staff.user?.id || '',
        firstName: staff.user?.firstName || '',
        lastName: staff.user?.lastName || '',
        email: staff.user?.email || '',
        phone: staff.user?.phone || null,
      };

      return {
        id: staff.id,
        employeeId: staff.employeeId || '',
        type: staff.type || StaffType.SUPPORT_STAFF,
        status: staff.status || StaffStatus.ACTIVE,
        designation: staff.designation || '',
        joiningDate: staff.joiningDate || new Date(),
        qualifications: Array.isArray(staff.qualifications) 
          ? staff.qualifications 
          : [],
        bio: staff.bio || '',
        isActive: Boolean(staff.isActive),
        tenantId: staff.tenantId,
        userId: staff.userId,
        departmentId: staff.departmentId || undefined,
        createdAt: staff.createdAt || new Date(),
        updatedAt: staff.updatedAt || new Date(),
        deletedAt: staff.deletedAt || undefined,
        user,
        department,
        roles,
        specialties,
      };
    } catch (error) {
      this.logger.error('Error in mapToStaffWithRelations:', error);
      throw new InternalServerErrorException('Failed to map staff data');
    }
  }

  /**
   * Create a new staff member with user account and related data
   */
  async create(tenantId: string, createStaffDto: ICreateStaff): Promise<IStaffWithRelations> {
    const { user, roleIds = [], specialties = [], ...staffData } = createStaffDto;
    
    return this.prisma.$transaction(async (prisma) => {
      try {
        // Check if employee ID is already in use
        if (staffData.employeeId) {
          const existingStaff = await prisma.staff.findFirst({
            where: {
              employeeId: staffData.employeeId,
              tenantId,
              deletedAt: null,
            },
          });

          if (existingStaff) {
            throw new ConflictException('Employee ID is already in use');
          }
        }

        // Check if email is already in use
        const existingUser = await prisma.user.findFirst({
          where: { email: user.email, tenantId },
        });

        if (existingUser) {
          throw new ConflictException('Email is already in use');
        }

        // Create user
        const createdUser = await this.userService.create({
          ...user,
          tenantId,
          role: staffData.type || StaffType.SUPPORT_STAFF,
          createdBy: staffData.createdBy,
          updatedBy: staffData.updatedBy,
        });

        try {
          // Create staff record
          const staff = await prisma.staff.create({
            data: {
              ...staffData,
              userId: createdUser.id,
              tenantId,
              isActive: staffData.isActive ?? true,
              status: staffData.status || StaffStatus.ACTIVE,
              type: staffData.type || StaffType.SUPPORT_STAFF,
              createdBy: staffData.createdBy,
              updatedBy: staffData.updatedBy,
              departmentId: staffData.departmentId || null,
              bio: staffData.bio || null,
              qualifications: staffData.qualifications || [],
            },
            include: staffWithRelations.include,
          });

          // Assign roles if any
          if (roleIds.length > 0) {
            await this.roleService.assignRolesToUser(createdUser.id, roleIds, tenantId);
          }

          // Assign specialties if any
          if (specialties.length > 0) {
            await prisma.staffSpecialty.createMany({
              data: specialties.map(specialty => ({
                staffId: staff.id,
                specialtyId: specialty.specialtyId,
                isPrimary: specialty.isPrimary || false,
                experience: specialty.experience || 0,
                notes: specialty.notes || null,
                startDate: specialty.startDate ? new Date(specialty.startDate) : null,
                certificationNumber: specialty.certificationNumber || null,
                certificationExpiryDate: specialty.certificationExpiryDate 
                  ? new Date(specialty.certificationExpiryDate) 
                  : null,
                assignedBy: staffData.createdBy || 'system',
                assignedAt: new Date(),
              })),
            });
          }

          // Return the created staff with relations
          return this.mapToStaffWithRelations(staff);
        } catch (error) {
          // If staff creation fails, delete the user to maintain data consistency
          await prisma.user.delete({ where: { id: createdUser.id } }).catch(() => {
            this.logger.error(`Failed to clean up user after staff creation failed: ${createdUser.id}`);
          });
          throw error;
        }
      } catch (error) {
        this.handlePrismaError(error, 'createStaff');
      }
    });
  }

  /**
   * Update an existing staff member
   */
  async update(
    tenantId: string,
    id: string,
    updateStaffDto: IUpdateStaff,
  ): Promise<IStaffWithRelations> {
    const { user, roleIds, specialties, ...staffData } = updateStaffDto;

    return this.prisma.$transaction(async (prisma) => {
      try {
        // Get existing staff with user data
        const existingStaff = await prisma.staff.findFirst({
          where: { id, tenantId, deletedAt: null },
          include: { user: { select: { id: true, email: true } } },
        });

        if (!existingStaff) {
          throw new NotFoundException(`Staff member with ID ${id} not found`);
        }

        // Check if employee ID is being updated and already in use
        if (staffData.employeeId && staffData.employeeId !== existingStaff.employeeId) {
          const staffWithSameEmployeeId = await prisma.staff.findFirst({
            where: {
              employeeId: staffData.employeeId,
              tenantId,
              deletedAt: null,
              id: { not: id },
            },
          });

          if (staffWithSameEmployeeId) {
            throw new ConflictException('Employee ID is already in use');
          }
        }

        // Update user if provided
        if (user) {
          // Check if email is being updated and already in use
          if (user.email && user.email !== existingStaff.user.email) {
            const userWithEmail = await prisma.user.findFirst({
              where: {
                email: user.email,
                tenantId,
                id: { not: existingStaff.userId },
              },
            });

            if (userWithEmail) {
              throw new ConflictException('Email is already in use');
            }
          }

          await prisma.user.update({
            where: { id: existingStaff.userId },
            data: {
              ...(user.firstName !== undefined && { firstName: user.firstName }),
              ...(user.lastName !== undefined && { lastName: user.lastName }),
              ...(user.email !== undefined && { email: user.email }),
              ...(user.phone !== undefined && { phone: user.phone }),
              ...(user.isActive !== undefined && { isActive: user.isActive }),
              updatedAt: new Date(),
              ...(staffData.updatedBy && { updatedBy: staffData.updatedBy }),
            },
          });
        }

        // Update staff record
        const updatedStaff = await prisma.staff.update({
          where: { id },
          data: {
            ...staffData,
            updatedAt: new Date(),
            ...(staffData.updatedBy && { updatedBy: staffData.updatedBy }),
          },
          include: staffWithRelations.include,
        });

        // Update roles if provided
        if (roleIds) {
          // Remove all existing roles
          await prisma.userRole.deleteMany({
            where: { userId: existingStaff.userId }
          });
          
          // Add new roles if any
          if (roleIds.length > 0) {
            await prisma.userRole.createMany({
              data: roleIds.map(roleId => ({
                userId: existingStaff.userId,
                roleId,
                assignedBy: staffData.updatedBy || 'system',
                assignedAt: new Date(),
              })),
              skipDuplicates: true,
            });
          }
        }

        // Update specialties if provided
        if (specialties) {
          // First, remove all existing specialties
          await prisma.staffSpecialty.deleteMany({
            where: { staffId: id }
          });
          
          // Add new specialties if any
          if (specialties.length > 0) {
            await prisma.staffSpecialty.createMany({
              data: specialties.map(specialty => ({
                staffId: id,
                specialtyId: specialty.specialtyId,
                isPrimary: specialty.isPrimary || false,
                experience: specialty.experience || 0,
                notes: specialty.notes || null,
                startDate: specialty.startDate ? new Date(specialty.startDate) : null,
                certificationNumber: specialty.certificationNumber || null,
                certificationExpiryDate: specialty.certificationExpiryDate 
                  ? new Date(specialty.certificationExpiryDate) 
                  : null,
                assignedBy: staffData.updatedBy || 'system',
                assignedAt: new Date(),
              })),
            });
          }
        }

        // Return the updated staff with fresh data
        const staffWithRelations = await prisma.staff.findUnique({
          where: { id },
          include: staffWithRelations.include,
        });

        return this.mapToStaffWithRelations(staffWithRelations);
      } catch (error) {
        this.handlePrismaError(error, 'updateStaff');
      }
    });
  }

  /**
   * Find a staff member by ID
   */
  async findById(tenantId: string, id: string): Promise<IStaffWithRelations | null> {
    try {
      const staff = await this.prisma.staff.findFirst({
        where: { id, tenantId, deletedAt: null },
        include: staffWithRelations.include,
      });

      return this.mapToStaffWithRelations(staff);
    } catch (error) {
      this.handlePrismaError(error, 'findStaffById');
    }
  }

  /**
   * Find all staff members with pagination and filtering
   */
  async findAll(
    tenantId: string,
    filterOptions: IStaffFilterOptions = {},
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<IStaffWithRelations>> {
    try {
      const { search, status, type, departmentId, isActive } = filterOptions;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {
        tenantId,
        deletedAt: null,
        ...(status && { status }),
        ...(type && { type }),
        ...(departmentId && { departmentId }),
        ...(isActive !== undefined && { isActive }),
      };

      // Add search condition if provided
      if (search) {
        where.OR = [
          { employeeId: { contains: search, mode: 'insensitive' } },
          { designation: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
          {
            user: {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        ];
      }

      // Get total count
      const total = await this.prisma.staff.count({ where });

      // Get paginated results
      const staffList = await this.prisma.staff.findMany({
        where,
        skip,
        take: limit,
        include: staffWithRelations.include,
        orderBy: { createdAt: 'desc' },
      });

      // Map to DTO
      const data = staffList
        .map(staff => this.mapToStaffWithRelations(staff as StaffWithRelations))
        .filter((staff): staff is IStaffWithRelations => staff !== null);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handlePrismaError(error, 'findAllStaff');
    }
  }

  /**
   * Delete a staff member (soft delete)
   */
  async remove(tenantId: string, id: string, deletedBy: string): Promise<void> {
    try {
      // Check if staff exists
      const staff = await this.prisma.staff.findFirst({
        where: { id, tenantId, deletedAt: null },
      });

      if (!staff) {
        throw new NotFoundException(`Staff member with ID ${id} not found`);
      }

      // Soft delete the staff
      await this.prisma.staff.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy,
          isActive: false,
          // Also deactivate the associated user
          user: {
            update: {
              isActive: false,
              updatedAt: new Date(),
              updatedBy: deletedBy,
            },
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'deleteStaff');
    }
  }

  /**
   * Bulk update staff status
   */
  async bulkUpdateStatus(
    tenantId: string,
    ids: string[],
    status: StaffStatus,
    updatedBy: string,
  ): Promise<{ count: number }> {
    try {
      // Validate input
      if (!ids || ids.length === 0) {
        throw new BadRequestException('No staff IDs provided');
      }

      if (!Object.values(StaffStatus).includes(status)) {
        throw new BadRequestException('Invalid status value');
      }

      // Update status for all provided IDs
      const result = await this.prisma.staff.updateMany({
        where: {
          id: { in: ids },
          tenantId,
          deletedAt: null,
        },
        data: {
          status,
          updatedAt: new Date(),
          updatedBy,
          // If status is INACTIVE, also mark as inactive
          ...(status === StaffStatus.INACTIVE && { isActive: false }),
        },
      });

      // Update associated users if needed
      if (status === StaffStatus.INACTIVE) {
        await this.prisma.user.updateMany({
          where: {
            staff: {
              id: { in: ids },
              tenantId,
            },
          },
          data: {
            isActive: false,
            updatedAt: new Date(),
            updatedBy,
          },
        });
      }

      return { count: result.count };
    } catch (error) {
      this.handlePrismaError(error, 'bulkUpdateStaffStatus');
    }
  }

  /**
   * Check if a staff member exists and is active
   */
  async staffExists(tenantId: string, staffId: string): Promise<boolean> {
    try {
      const count = await this.prisma.staff.count({
        where: {
          id: staffId,
          tenantId,
          isActive: true,
          deletedAt: null,
        },
      });
      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking if staff exists: ${error.message}`, error.stack);
      return false;
    }
  }
}
