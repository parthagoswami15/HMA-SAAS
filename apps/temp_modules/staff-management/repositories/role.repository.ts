import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Role, Prisma } from '@prisma/client';

type RoleWithPermissions = Prisma.RoleGetPayload<{
  include: {
    permissions: {
      select: {
        permission: {
          select: {
            id: true;
            key: true;
            name: true;
            description: true;
            module: true;
            isActive: boolean;
          };
        };
      };
    };
    staff: {
      select: {
        staff: {
          select: {
            id: true;
            employeeId: true;
            user: {
              select: {
                firstName: true;
                lastName: true;
                email: true;
              };
            };
          };
        };
      };
    };
    _count: {
      select: {
        staff: true;
        permissions: true;
      };
    };
  };
}>;

@Injectable()
export class RoleRepository extends BaseRepository<'Role'> {
  protected readonly prismaDelegate: Prisma.RoleDelegate;
  protected readonly modelName = 'Role';

  constructor(prisma: PrismaService) {
    super(prisma);
    this.prismaDelegate = prisma.role;
  }

  async findByName(tenantId: string, name: string): Promise<Role | null> {
    return this.prismaDelegate.findFirst({
      where: {
        tenantId,
        name,
        deletedAt: null,
      },
    });
  }

  async findRoleWithDetails(
    tenantId: string,
    roleId: string,
  ): Promise<RoleWithPermissions | null> {
    return this.prismaDelegate.findUnique({
      where: { id: roleId, tenantId, deletedAt: null },
      include: this.getDefaultInclude(),
    });
  }

  async findManyWithDetails(
    tenantId: string,
    where: Prisma.RoleWhereInput = {},
    options: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.RoleOrderByWithRelationInput | Prisma.RoleOrderByWithRelationInput[];
    } = {},
  ): Promise<{ data: RoleWithPermissions[]; total: number }> {
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

  async assignPermissions(
    tenantId: string,
    roleId: string,
    permissionKeys: string[],
  ): Promise<void> {
    // First, verify the role exists and belongs to the tenant
    const role = await this.prismaDelegate.findUnique({
      where: { id: roleId, tenantId },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    // Get the permission IDs for the provided keys
    const permissions = await this.prisma.permission.findMany({
      where: {
        key: { in: permissionKeys },
        isActive: true,
      },
      select: { id: true },
    });

    const permissionIds = permissions.map((p) => p.id);

    await this.prisma.$transaction([
      // Remove existing permissions not in the new list
      this.prisma.rolePermission.deleteMany({
        where: {
          roleId,
          permissionId: { notIn: permissionIds },
        },
      }),
      
      // Add new permissions that don't exist
      ...permissionIds.map((permissionId) =>
        this.prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId,
              permissionId,
            },
          },
          create: {
            roleId,
            permissionId,
          },
          update: {},
        }),
      ),
    ]);
  }

  async getStaffWithRole(
    tenantId: string,
    roleId: string,
  ): Promise<
    Array<{
      id: string;
      employeeId: string;
      user: {
        firstName: string;
        lastName: string;
        email: string;
      };
    }>
  > {
    const role = await this.prismaDelegate.findUnique({
      where: { id: roleId, tenantId },
      include: {
        staff: {
          select: {
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
        },
      },
    });

    if (!role) {
      return [];
    }

    return role.staff.map((sr) => ({
      id: sr.staff.id,
      employeeId: sr.staff.employeeId,
      user: sr.staff.user,
    }));
  }

  async assignRoleToStaff(
    tenantId: string,
    roleId: string,
    staffId: string,
    assignedBy: string,
    isPrimary = false,
  ): Promise<void> {
    // Verify both role and staff exist and belong to the same tenant
    const [role, staff] = await Promise.all([
      this.prismaDelegate.findUnique({
        where: { id: roleId, tenantId },
      }),
      this.prisma.staff.findUnique({
        where: { id: staffId, tenantId },
      }),
    ]);

    if (!role) {
      throw new Error('Role not found');
    }

    if (!staff) {
      throw new Error('Staff not found');
    }

    // If setting as primary, unset any existing primary role for this staff
    if (isPrimary) {
      await this.prisma.staffRole.updateMany({
        where: {
          staffId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Assign the role
    await this.prisma.staffRole.upsert({
      where: {
        staffId_roleId: {
          staffId,
          roleId,
        },
      },
      create: {
        staffId,
        roleId,
        isPrimary,
        assignedBy,
      },
      update: {
        isPrimary,
      },
    });
  }

  async removeRoleFromStaff(tenantId: string, roleId: string, staffId: string): Promise<void> {
    // Verify both role and staff exist and belong to the same tenant
    const [role, staff] = await Promise.all([
      this.prismaDelegate.findUnique({
        where: { id: roleId, tenantId },
      }),
      this.prisma.staff.findUnique({
        where: { id: staffId, tenantId },
      }),
    ]);

    if (!role) {
      throw new Error('Role not found');
    }

    if (!staff) {
      throw new Error('Staff not found');
    }

    // Remove the role assignment
    await this.prisma.staffRole.delete({
      where: {
        staffId_roleId: {
          staffId,
          roleId,
        },
      },
    });
  }

  private getDefaultInclude() {
    return {
      permissions: {
        select: {
          permission: {
            select: {
              id: true,
              key: true,
              name: true,
              description: true,
              module: true,
              isActive: true,
            },
          },
        },
      },
      staff: {
        select: {
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
      },
      _count: {
        select: {
          staff: true,
          permissions: true,
        },
      },
    };
  }
}
