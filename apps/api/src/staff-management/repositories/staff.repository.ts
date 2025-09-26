import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Staff, Prisma } from '@prisma/client';

type StaffWithRelations = Prisma.StaffGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        phone: true;
      };
    };
    department: {
      select: {
        id: true;
        name: true;
        code: true;
      };
    };
    roles: {
      select: {
        role: {
          select: {
            id: true;
            name: true;
            description: true;
          };
        };
      };
    };
    specialties: {
      select: {
        id: true;
        isPrimary: true;
        experience: true;
        notes: true;
        specialty: {
          select: {
            id: true;
            name: true;
            code: true;
            category: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class StaffRepository extends BaseRepository<'Staff'> {
  protected readonly prismaDelegate: Prisma.StaffDelegate;
  protected readonly modelName = 'Staff';

  constructor(prisma: PrismaService) {
    super(prisma);
    this.prismaDelegate = prisma.staff;
  }

  // Custom methods specific to Staff model
  async findByEmployeeId(tenantId: string, employeeId: string): Promise<Staff | null> {
    return this.prismaDelegate.findFirst({
      where: {
        tenantId,
        employeeId,
        deletedAt: null,
      },
    });
  }

  async findByUserId(tenantId: string, userId: string): Promise<StaffWithRelations | null> {
    return this.prismaDelegate.findFirst({
      where: {
        tenantId,
        userId,
        deletedAt: null,
      },
      include: this.getDefaultInclude(),
    });
  }

  async findStaffWithDetails(tenantId: string, staffId: string): Promise<StaffWithRelations | null> {
    return this.prismaDelegate.findFirst({
      where: {
        id: staffId,
        tenantId,
        deletedAt: null,
      },
      include: this.getDefaultInclude(),
    });
  }

  async findManyWithDetails(
    tenantId: string,
    where: Prisma.StaffWhereInput = {},
    options: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.StaffOrderByWithRelationInput | Prisma.StaffOrderByWithRelationInput[];
    } = {},
  ): Promise<{ data: StaffWithRelations[]; total: number }> {
    const { skip, take, orderBy } = options;
    
    const [data, total] = await Promise.all([
      this.prismaDelegate.findMany({
        where: {
          ...where,
          tenantId,
          deletedAt: null,
        },
        include: this.getDefaultInclude(),
        skip,
        take,
        orderBy,
      }),
      this.prismaDelegate.count({
        where: {
          ...where,
          tenantId,
          deletedAt: null,
        },
      }),
    ]);

    return { data, total };
  }

  async updateStaff(
    tenantId: string,
    staffId: string,
    data: Prisma.StaffUpdateInput,
  ): Promise<StaffWithRelations> {
    return this.prismaDelegate.update({
      where: { id: staffId, tenantId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: this.getDefaultInclude(),
    });
  }

  async softDelete(tenantId: string, staffId: string): Promise<Staff> {
    return this.prismaDelegate.update({
      where: { id: staffId, tenantId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        user: {
          update: {
            isActive: false,
          },
        },
      },
    });
  }

  async assignRoles(
    tenantId: string,
    staffId: string,
    roleIds: string[],
    assignedBy: string,
  ): Promise<void> {
    await this.prisma.$transaction([
      // Remove existing roles not in the new list
      this.prisma.staffRole.deleteMany({
        where: {
          staffId,
          roleId: { notIn: roleIds },
        },
      }),
      
      // Add new roles that don't exist
      ...roleIds.map((roleId) =>
        this.prisma.staffRole.upsert({
          where: {
            staffId_roleId: {
              staffId,
              roleId,
            },
          },
          create: {
            staffId,
            roleId,
            assignedBy,
          },
          update: {},
        }),
      ),
    ]);
  }

  async assignSpecialties(
    tenantId: string,
    staffId: string,
    specialties: Array<{
      specialtyId: string;
      isPrimary?: boolean;
      experience?: number;
      notes?: string;
    }>,
    assignedBy: string,
  ): Promise<void> {
    await this.prisma.$transaction([
      // Remove existing specialties not in the new list
      this.prisma.staffSpecialty.deleteMany({
        where: {
          staffId,
          specialtyId: { notIn: specialties.map((s) => s.specialtyId) },
        },
      }),
      
      // Add or update specialties
      ...specialties.map(({ specialtyId, isPrimary = false, experience, notes }) =>
        this.prisma.staffSpecialty.upsert({
          where: {
            staffId_specialtyId: {
              staffId,
              specialtyId,
            },
          },
          create: {
            staffId,
            specialtyId,
            isPrimary,
            experience,
            notes,
            assignedBy,
          },
          update: {
            isPrimary,
            experience,
            notes,
          },
        }),
      ),
    ]);
  }

  async logAudit(
    tenantId: string,
    staffId: string,
    action: string,
    field?: string,
    oldValue?: any,
    newValue?: any,
    performedBy?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.prisma.staffAuditLog.create({
      data: {
        tenantId,
        staffId,
        action,
        field,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
        performedBy,
        ipAddress,
        userAgent,
      },
    });
  }

  private getDefaultInclude() {
    return {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      department: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      roles: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
      specialties: {
        select: {
          id: true,
          isPrimary: true,
          experience: true,
          notes: true,
          specialty: {
            select: {
              id: true,
              name: true,
              code: true,
              category: true,
            },
          },
        },
      },
    };
  }
}
