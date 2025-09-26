import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Specialty, Prisma } from '@prisma/client';

type SpecialtyWithRelations = Prisma.SpecialtyGetPayload<{
  include: {
    staffSpecialties: {
      select: {
        id: true;
        isPrimary: boolean;
        experience: number | null;
        notes: string | null;
        staff: {
          select: {
            id: true;
            employeeId: string;
            user: {
              select: {
                firstName: string;
                lastName: string;
                email: string;
              };
            };
          };
        };
      };
    };
    _count: {
      select: {
        staffSpecialties: number;
      };
    };
  };
}>;

@Injectable()
export class SpecialtyRepository extends BaseRepository<'Specialty'> {
  protected readonly prismaDelegate: Prisma.SpecialtyDelegate;
  protected readonly modelName = 'Specialty';

  constructor(prisma: PrismaService) {
    super(prisma);
    this.prismaDelegate = prisma.specialty;
  }

  async findByCode(tenantId: string, code: string): Promise<Specialty | null> {
    return this.prismaDelegate.findFirst({
      where: {
        tenantId,
        code,
        deletedAt: null,
      },
    });
  }

  async findSpecialtyWithDetails(
    tenantId: string,
    specialtyId: string,
  ): Promise<SpecialtyWithRelations | null> {
    return this.prismaDelegate.findUnique({
      where: { id: specialtyId, tenantId, deletedAt: null },
      include: this.getDefaultInclude(),
    });
  }

  async findManyWithDetails(
    tenantId: string,
    where: Prisma.SpecialtyWhereInput = {},
    options: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.SpecialtyOrderByWithRelationInput | Prisma.SpecialtyOrderByWithRelationInput[];
    } = {},
  ): Promise<{ data: SpecialtyWithRelations[]; total: number }> {
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

  async assignSpecialtyToStaff(
    tenantId: string,
    specialtyId: string,
    staffId: string,
    assignedBy: string,
    isPrimary = false,
    experience?: number,
    notes?: string,
  ): Promise<void> {
    // Verify both specialty and staff exist and belong to the same tenant
    const [specialty, staff] = await Promise.all([
      this.prismaDelegate.findUnique({
        where: { id: specialtyId, tenantId },
      }),
      this.prisma.staff.findUnique({
        where: { id: staffId, tenantId },
      }),
    ]);

    if (!specialty) {
      throw new Error('Specialty not found');
    }

    if (!staff) {
      throw new Error('Staff not found');
    }

    // If setting as primary, unset any existing primary specialty for this staff
    if (isPrimary) {
      await this.prisma.staffSpecialty.updateMany({
        where: {
          staffId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Assign the specialty
    await this.prisma.staffSpecialty.upsert({
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
    });
  }

  async removeSpecialtyFromStaff(
    tenantId: string,
    specialtyId: string,
    staffId: string,
  ): Promise<void> {
    // Verify both specialty and staff exist and belong to the same tenant
    const [specialty, staff] = await Promise.all([
      this.prismaDelegate.findUnique({
        where: { id: specialtyId, tenantId },
      }),
      this.prisma.staff.findUnique({
        where: { id: staffId, tenantId },
      }),
    ]);

    if (!specialty) {
      throw new Error('Specialty not found');
    }

    if (!staff) {
      throw new Error('Staff not found');
    }

    // Remove the specialty assignment
    await this.prisma.staffSpecialty.delete({
      where: {
        staffId_specialtyId: {
          staffId,
          specialtyId,
        },
      },
    });
  }

  async getStaffWithSpecialty(
    tenantId: string,
    specialtyId: string,
  ): Promise<
    Array<{
      id: string;
      staffId: string;
      isPrimary: boolean;
      experience: number | null;
      notes: string | null;
      assignedAt: Date;
      assignedBy: string | null;
      staff: {
        id: string;
        employeeId: string;
        user: {
          firstName: string;
          lastName: string;
          email: string;
        };
      };
    }>
  > {
    const specialty = await this.prismaDelegate.findUnique({
      where: { id: specialtyId, tenantId },
      include: {
        staffSpecialties: {
          where: {
            staff: {
              deletedAt: null,
            },
          },
          include: {
            staff: {
              select: {
                id: true,
                employeeId: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: [
            { isPrimary: 'desc' },
            { staff: { user: { lastName: 'asc' } } },
            { staff: { user: { firstName: 'asc' } } },
          ],
        },
      },
    });

    if (!specialty) {
      return [];
    }

    return specialty.staffSpecialties.map((ss) => ({
      id: ss.id,
      staffId: ss.staffId,
      isPrimary: ss.isPrimary,
      experience: ss.experience,
      notes: ss.notes,
      assignedAt: ss.assignedAt,
      assignedBy: ss.assignedBy,
      staff: {
        id: ss.staff.id,
        employeeId: ss.staff.employeeId,
        user: ss.staff.user,
      },
    }));
  }

  async getStaffSpecialties(
    tenantId: string,
    staffId: string,
  ): Promise<
    Array<{
      id: string;
      specialtyId: string;
      isPrimary: boolean;
      experience: number | null;
      notes: string | null;
      assignedAt: Date;
      assignedBy: string | null;
      specialty: {
        id: string;
        name: string;
        code: string | null;
        category: string | null;
      };
    }>
  > {
    const staff = await this.prisma.staff.findUnique({
      where: { id: staffId, tenantId },
      include: {
        specialties: {
          where: {
            specialty: {
              deletedAt: null,
            },
          },
          select: {
            id: true,
            specialtyId: true,
            isPrimary: true,
            experience: true,
            notes: true,
            assignedAt: true,
            assignedBy: true,
            specialty: {
              select: {
                id: true,
                name: true,
                code: true,
                category: true,
              },
            },
          },
          orderBy: [
            { isPrimary: 'desc' },
            { specialty: { name: 'asc' } },
          ],
        },
      },
    });

    if (!staff) {
      return [];
    }

    return staff.specialties.map((ss) => ({
      id: ss.id,
      specialtyId: ss.specialtyId,
      isPrimary: ss.isPrimary,
      experience: ss.experience,
      notes: ss.notes,
      assignedAt: ss.assignedAt,
      assignedBy: ss.assignedBy,
      specialty: {
        id: ss.specialty.id,
        name: ss.specialty.name,
        code: ss.specialty.code,
        category: ss.specialty.category,
      },
    }));
  }

  private getDefaultInclude() {
    return {
      staffSpecialties: {
        where: {
          staff: {
            deletedAt: null,
          },
        },
        select: {
          id: true,
          isPrimary: true,
          experience: true,
          notes: true,
          staff: {
            select: {
              id: true,
              employeeId: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: [
          { isPrimary: 'desc' },
          { staff: { user: { lastName: 'asc' } } },
          { staff: { user: { firstName: 'asc' } } },
        ],
      },
      _count: {
        select: {
          staffSpecialties: true,
        },
      },
    };
  }
}
