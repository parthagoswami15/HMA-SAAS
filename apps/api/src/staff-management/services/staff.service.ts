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

// Type for the staff with relations
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

type StaffUser = StaffWithRelations;

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
      // Handle specific Prisma errors
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
    
    // Re-throw the error if it's not a Prisma error
    throw error;
  }

  /**
   * Map staff entity to IStaffWithRelations
   */
  private mapToStaffWithRelations(staff: StaffWithRelations | null): IStaffWithRelations | null {
    if (!staff) return null;
    
    try {
      // Map user roles to the expected format with null checks
      const roles = (staff.user?.roles || []).map(userRole => ({
        id: userRole.role?.id || '',
        name: userRole.role?.name || '',
        isSystem: Boolean((userRole.role as any)?.isSystem),
      }));

      // Map specialties to the expected format with null checks
      const specialties = ((staff as any).specialties || []).map((staffSpecialty: any) => ({
        id: staffSpecialty.id || '',
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

      // Map department if it exists
      const department = staff.department ? {
        id: staff.department.id,
        name: staff.department.name,
        code: staff.department.code || '',
        description: staff.department.description || null,
      } : undefined;

      // Map user details with null checks
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
        qualifications: Array.isArray((staff as any).qualifications) 
          ? (staff as any).qualifications 
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
      console.error('Error in mapToStaffWithRelations:', error);
      throw new Error('Failed to map staff with relations');
    }
  }

  /**
   * Create a new staff member
   */
  /**
   * Create a new staff member with user account and related data
   */
  async create(tenantId: string, createStaffDto: ICreateStaff): Promise<IStaffWithRelations> {
    const { user, roleIds = [], specialties = [], ...staffData } = createStaffDto;
    
    // Start a transaction to ensure data consistency
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
            select: { id: true },
          });

          if (existingStaff) {
            throw new ConflictException('Employee ID is already in use');
          }
        }

        // Check if email is already in use
        const existingUser = await prisma.user.findFirst({
          where: {
            email: user.email,
            tenantId,
          },
          select: { id: true },
        });

        if (existingUser) {
          throw new ConflictException('Email is already in use');
        }

        // Create user first
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
          if (specialties && specialties.length > 0) {
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
      // Get existing staff with user data
      const existingStaff = await prisma.staff.findFirst({
        where: { 
          id, 
          tenantId,
          deletedAt: null 
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
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
          select: { id: true },
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
            select: { id: true },
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

      // Update roles if provided
      if (roleIds) {
        // First remove all existing roles
        await prisma.userRole.deleteMany({
          where: { userId: existingStaff.userId }
        });
        
        // Add new roles
        if (roleIds.length > 0) {
          await prisma.userRole.createMany({
            data: roleIds.map(roleId => ({
              userId: existingStaff.userId,
              roleId,
              assignedBy: staffData.updatedBy || 'system',
              assignedAt: new Date(),
            })),
            skipDuplicates: true,
            where: { userId: existingStaff.userId }
          });
          
          // Add new roles
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
          // Handle specialty updates
          for (const specialty of specialties) {
            if (specialty.remove) {
              // Remove the specialty
              await prisma.staffSpecialty.deleteMany({
                where: {
                  staffId: id,
                  specialtyId: specialty.specialtyId,
                },
              });
            } else {
              // Upsert the specialty
              await prisma.staffSpecialty.upsert({
                where: {
                  staffId_specialtyId: {
                    staffId: id,
                    specialtyId: specialty.specialtyId,
                  },
                },
                update: {
                  isPrimary: specialty.isPrimary,
                  experience: specialty.experience,
                  notes: specialty.notes,
                  startDate: specialty.startDate ? new Date(specialty.startDate) : null,
                  certificationNumber: specialty.certificationNumber,
                  certificationExpiryDate: specialty.certificationExpiryDate 
                    ? new Date(specialty.certificationExpiryDate) 
                    : null,
                  updatedAt: new Date(),
                  ...(staffData.updatedBy && { updatedBy: staffData.updatedBy }),
                },
                create: {
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
                },
              });
            }
          }
        }

        // Prepare staff update data
        const staffUpdateData: Prisma.StaffUpdateInput = {
          ...(staffData.employeeId !== undefined && { employeeId: staffData.employeeId }),
          ...(staffData.type !== undefined && { type: staffData.type }),
          ...(staffData.status !== undefined && { status: staffData.status }),
          ...(staffData.designation !== undefined && { designation: staffData.designation }),
          ...(staffData.departmentId !== undefined 
            ? staffData.departmentId 
              ? { department: { connect: { id: staffData.departmentId } } }
              : { department: { disconnect: true } }
            : {}
          ),
          ...(staffData.joiningDate !== undefined && { joiningDate: staffData.joiningDate }),
          ...(staffData.leavingDate !== undefined && { leavingDate: staffData.leavingDate }),
          ...(staffData.qualifications !== undefined && { 
            qualifications: Array.isArray(staffData.qualifications) 
              ? staffData.qualifications 
              : [] 
          }),
          ...(staffData.bio !== undefined && { bio: staffData.bio }),
          ...(staffData.isActive !== undefined && { isActive: staffData.isActive }),
          updatedAt: new Date(),
          ...(staffData.updatedBy && { updatedBy: staffData.updatedBy }),
        };

        // Update staff details
        const updatedStaff = await prisma.staff.update({
          where: { id },
          data: staffUpdateData,
          include: staffWithRelations.include,
        });

        // Fetch the updated staff with all relations
        const staffWithRelations = await prisma.staff.findUnique({
          where: { id },
          include: {
            user: {
              include: {
                roles: {
                include: {
                  role: true,
                },
                where: {
                  role: {
                    isActive: true,
                  },
                },
              },
            },
          },
          department: true,
          specialties: {
            include: {
              specialty: true,
            },
            where: {
              specialty: {
                isActive: true,
              },
            },
          },
        },
      });

      if (!staffWithRelations) {
        throw new NotFoundException(`Failed to retrieve updated staff with ID ${id}`);
      }

      return this.mapToStaffWithRelations(staffWithRelations as StaffUser);
    });
  }

  /**
   * Bulk update staff status
   */
  async bulkUpdateStatus(
    tenantId: string,
    ids: string[],
    status: StaffStatus,
  ): Promise<{ count: number }> {
    // Validate input
    if (!tenantId || !ids || !Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid input parameters');
    }

    // Validate status
    if (!Object.values(StaffStatus).includes(status)) {
      throw new BadRequestException(`Invalid status value. Must be one of: ${Object.values(StaffStatus).join(', ')}`);
    }

    // Remove duplicate IDs
    const uniqueIds = [...new Set(ids)];

    try {
      // Update status for all specified staff members in a transaction
      const result = await this.prisma.$transaction(async (prisma) => {
        // First, verify all staff members exist and belong to the tenant
        const existingStaff = await prisma.staff.findMany({
          where: {
            id: { in: uniqueIds },
            tenantId,
            deletedAt: null,
          },
          select: { id: true, userId: true },
        });

        const foundIds = existingStaff.map(staff => staff.id);
        const missingIds = uniqueIds.filter(id => !foundIds.includes(id));

        if (missingIds.length > 0) {
          throw new NotFoundException(`Staff members not found: ${missingIds.join(', ')}`);
        }

        // Update the staff records
        const updateResult = await prisma.staff.updateMany({
          where: {
            id: { in: uniqueIds },
            tenantId,
            deletedAt: null,
          },
          data: {
            status,
            updatedAt: new Date(),
            // If status is not ACTIVE, also update isActive flag
            ...(status !== StaffStatus.ACTIVE && { isActive: false }),
          },
        });

        // If status is not ACTIVE, also update related user records and sessions
        if (status !== StaffStatus.ACTIVE) {
          const userIds = existingStaff.map(staff => staff.userId).filter(Boolean) as string[];

          if (userIds.length > 0) {
            // Update user records to mark as inactive
            await prisma.user.updateMany({
              where: {
                id: { in: userIds },
                tenantId,
              },
              data: {
                isActive: false,
                updatedAt: new Date(),
              },
            });

            // Delete all active sessions for these users
            await prisma.session.deleteMany({
              where: {
                userId: { in: userIds },
              },
            });
          }
        }

        return updateResult;
      });

      return { count: result.count };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error in bulkUpdateStatus:', error);
      throw new Error('Failed to update staff status');
    }
  }
}
