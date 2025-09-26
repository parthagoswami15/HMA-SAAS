import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Department, Prisma } from '@prisma/client';

type DepartmentWithRelations = Prisma.DepartmentGetPayload<{
  include: {
    headStaff: {
      select: {
        id: true;
        user: {
          select: {
            firstName: true;
            lastName: true;
            email: true;
          };
        };
      };
    };
    parent: {
      select: {
        id: true;
        name: true;
        code: true;
      };
    };
    children: {
      select: {
        id: true;
        name: true;
        code: true;
        isActive: true;
        _count: {
          select: {
            staff: true;
            children: true;
          };
        };
      };
    };
    _count: {
      select: {
        staff: true;
        children: true;
      };
    };
  };
}>;

@Injectable()
export class DepartmentRepository extends BaseRepository<'Department'> {
  protected readonly prismaDelegate: Prisma.DepartmentDelegate;
  protected readonly modelName = 'Department';

  constructor(prisma: PrismaService) {
    super(prisma);
    this.prismaDelegate = prisma.department;
  }

  async findByCode(tenantId: string, code: string): Promise<Department | null> {
    return this.prismaDelegate.findFirst({
      where: {
        tenantId,
        code,
        deletedAt: null,
      },
    });
  }

  async findDepartmentWithDetails(
    tenantId: string,
    departmentId: string,
  ): Promise<DepartmentWithRelations | null> {
    return this.prismaDelegate.findUnique({
      where: { id: departmentId, tenantId, deletedAt: null },
      include: this.getDefaultInclude(),
    });
  }

  async findManyWithDetails(
    tenantId: string,
    where: Prisma.DepartmentWhereInput = {},
    options: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.DepartmentOrderByWithRelationInput | Prisma.DepartmentOrderByWithRelationInput[];
    } = {},
  ): Promise<{ data: DepartmentWithRelations[]; total: number }> {
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

  async getDepartmentHierarchy(tenantId: string): Promise<DepartmentWithRelations[]> {
    return this.prismaDelegate.findMany({
      where: {
        tenantId,
        deletedAt: null,
        isActive: true,
        parentDepartmentId: null, // Only get top-level departments
      },
      include: {
        ...this.getDefaultInclude(),
        children: {
          include: {
            ...this.getDefaultInclude(),
            children: {
              include: this.getDefaultInclude(),
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getStaffCountByDepartment(tenantId: string): Promise<Array<{ departmentId: string | null; departmentName: string; count: number }>> {
    const result = await this.prisma.$queryRaw`
      SELECT 
        d.id as "departmentId",
        d.name as "departmentName",
        COUNT(s.id)::int as count
      FROM "Department" d
      LEFT JOIN "Staff" s ON s."departmentId" = d.id AND s."deletedAt" IS NULL
      WHERE d."tenantId" = ${tenantId} AND d."deletedAt" IS NULL
      GROUP BY d.id, d.name
      ORDER BY d.name
    `;

    // Add count for staff without department
    const noDeptCount = await this.prisma.staff.count({
      where: {
        tenantId,
        deletedAt: null,
        departmentId: null,
      },
    });

    if (noDeptCount > 0) {
      result.push({
        departmentId: null,
        departmentName: 'No Department',
        count: noDeptCount,
      });
    }

    return result as Array<{ departmentId: string | null; departmentName: string; count: number }>;
  }

  async updateDepartment(
    tenantId: string,
    departmentId: string,
    data: Prisma.DepartmentUpdateInput,
  ): Promise<DepartmentWithRelations> {
    return this.prismaDelegate.update({
      where: { id: departmentId, tenantId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: this.getDefaultInclude(),
    });
  }

  async assignDepartmentHead(
    tenantId: string,
    departmentId: string,
    staffId: string,
  ): Promise<DepartmentWithRelations> {
    // Check if staff exists and belongs to the same tenant
    const staff = await this.prisma.staff.findUnique({
      where: {
        id: staffId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!staff) {
      throw new Error('Staff not found');
    }

    return this.prismaDelegate.update({
      where: { id: departmentId, tenantId },
      data: {
        headStaffId: staffId,
        updatedAt: new Date(),
      },
      include: this.getDefaultInclude(),
    });
  }

  async removeDepartmentHead(
    tenantId: string,
    departmentId: string,
  ): Promise<DepartmentWithRelations> {
    return this.prismaDelegate.update({
      where: { id: departmentId, tenantId },
      data: {
        headStaffId: null,
        updatedAt: new Date(),
      },
      include: this.getDefaultInclude(),
    });
  }

  async getDepartmentStaff(
    tenantId: string,
    departmentId: string,
    includeSubDepartments = false,
  ): Promise<Array<{
    id: string;
    employeeId: string;
    designation: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
    };
    roles: Array<{
      id: string;
      name: string;
    }>;
  }>> {
    let departmentIds = [departmentId];

    if (includeSubDepartments) {
      // Get all child department IDs recursively
      const childDepartments = await this.getChildDepartmentIds(tenantId, departmentId);
      departmentIds = [...departmentIds, ...childDepartments];
    }

    // Get staff in the department(s)
    const staff = await this.prisma.staff.findMany({
      where: {
        tenantId,
        departmentId: { in: departmentIds },
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { user: { lastName: 'asc' } },
        { user: { firstName: 'asc' } },
      ],
    });

    return staff.map(s => ({
      id: s.id,
      employeeId: s.employeeId,
      designation: s.designation,
      user: s.user,
      roles: s.roles.map(r => r.role),
    }));
  }

  private async getChildDepartmentIds(tenantId: string, parentId: string): Promise<string[]> {
    const children = await this.prisma.department.findMany({
      where: { tenantId, parentDepartmentId: parentId, deletedAt: null },
      select: { id: true },
    });

    let result: string[] = [];
    
    for (const child of children) {
      result.push(child.id);
      const grandChildren = await this.getChildDepartmentIds(tenantId, child.id);
      result = [...result, ...grandChildren];
    }

    return result;
  }

  private getDefaultInclude() {
    return {
      headStaff: {
        select: {
          id: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      parent: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      children: {
        select: {
          id: true,
          name: true,
          code: true,
          isActive: true,
          _count: {
            select: {
              staff: true,
              children: true,
            },
          },
        },
      },
      _count: {
        select: {
          staff: true,
          children: true,
        },
      },
    };
  }
}
