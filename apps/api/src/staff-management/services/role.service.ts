import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IRole, ICreateRole, IUpdateRole, IRoleWithPermissions, IRoleFilterOptions } from '../interfaces/role.interface';
import { PaginatedResponse } from '../../common/interfaces';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Create a new role
   */
  async create(tenantId: string, createRoleDto: ICreateRole): Promise<IRoleWithPermissions> {
    const { name, permissionKeys = [], ...roleData } = createRoleDto;

    // Check if role with this name already exists
    const existingRole = await this.prisma.role.findFirst({
      where: {
        tenantId,
        name,
        deletedAt: null,
      },
    });

    if (existingRole) {
      throw new ConflictException(`Role with name '${name}' already exists`);
    }

    // Validate permissions if provided
    if (permissionKeys && permissionKeys.length > 0) {
      await this.validatePermissionsExist(permissionKeys);
    }

    // Start transaction
    return this.prisma.$transaction(async (prisma) => {
      // Create role
      const role = await prisma.role.create({
        data: {
          ...roleData,
          name,
          tenantId,
          isSystem: roleData.isSystem || false,
          isActive: roleData.isActive !== false, // Default to true if not specified
        },
      });

      // Assign permissions if provided
      if (permissionKeys.length > 0) {
        await this.assignPermissionsToRole(prisma, tenantId, role.id, permissionKeys);
      }

      // Return the created role with permissions
      return this.findById(tenantId, role.id);
    });
  }

  /**
   * Find all roles with pagination and filtering
   */
  async findAll(
    tenantId: string,
    options: IRoleFilterOptions = {},
  ): Promise<PaginatedResponse<IRoleWithPermissions>> {
    const {
      search,
      isSystem,
      isActive = true,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;
    const where: Prisma.RoleWhereInput = {
      tenantId,
      deletedAt: null,
    };

    // Apply filters
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isSystem !== undefined) where.isSystem = isSystem;
    if (isActive !== undefined) where.isActive = isActive;

    // Get total count for pagination
    const total = await this.prisma.role.count({ where });

    // Get paginated results
    const roles = await this.prisma.role.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        permissions: {
          where: { deletedAt: null },
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
      },
    });

    // Transform the data to match the IRoleWithPermissions interface
    const data = roles.map((role) => ({
      ...role,
      permissions: role.permissions.map((rp) => rp.permission),
    }));

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
   * Find a role by ID with its permissions
   */
  async findById(tenantId: string, id: string): Promise<IRoleWithPermissions> {
    const role = await this.prisma.role.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: { deletedAt: null },
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
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Transform the data to match the IRoleWithPermissions interface
    return {
      ...role,
      permissions: role.permissions.map((rp) => rp.permission),
    };
  }

  /**
   * Find a role by name
   */
  async findByName(tenantId: string, name: string): Promise<IRoleWithPermissions | null> {
    const role = await this.prisma.role.findFirst({
      where: {
        name,
        tenantId,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: { deletedAt: null },
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
      },
    });

    if (!role) {
      return null;
    }

    // Transform the data to match the IRoleWithPermissions interface
    return {
      ...role,
      permissions: role.permissions.map((rp) => rp.permission),
    };
  }

  /**
   * Update a role
   */
  async update(
    tenantId: string,
    id: string,
    updateRoleDto: IUpdateRole,
  ): Promise<IRoleWithPermissions> {
    const { permissionKeys, ...roleData } = updateRoleDto;

    // Check if role exists
    const existingRole = await this.prisma.role.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Prevent updating system roles
    if (existingRole.isSystem) {
      throw new BadRequestException('Cannot update system roles');
    }

    // Check if name is being changed and if it's already in use
    if (roleData.name && roleData.name !== existingRole.name) {
      const existingWithName = await this.prisma.role.findFirst({
        where: {
          name: roleData.name,
          tenantId,
          deletedAt: null,
          NOT: { id },
        },
      });

      if (existingWithName) {
        throw new ConflictException(`Role with name '${roleData.name}' already exists`);
      }
    }

    // Validate permissions if provided
    if (permissionKeys) {
      await this.validatePermissionsExist(permissionKeys);
    }

    // Start transaction
    return this.prisma.$transaction(async (prisma) => {
      // Update role
      const updatedRole = await prisma.role.update({
        where: { id },
        data: {
          ...roleData,
          // Ensure we don't update these fields
          id: undefined,
          tenantId: undefined,
          isSystem: undefined, // Prevent updating isSystem flag
          createdAt: undefined,
          updatedAt: new Date(),
        },
      });

      // Update permissions if provided
      if (permissionKeys) {
        await this.updateRolePermissions(prisma, tenantId, id, permissionKeys);
      }

      // Return the updated role with permissions
      return this.findById(tenantId, id);
    });
  }

  /**
   * Delete a role (soft delete)
   */
  async delete(tenantId: string, id: string): Promise<{ success: boolean }> {
    // Check if role exists
    const role = await this.prisma.role.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Prevent deleting system roles
    if (role.isSystem) {
      throw new BadRequestException('Cannot delete system roles');
    }

    // Check if role is assigned to any users
    const userCount = await this.prisma.userRole.count({
      where: {
        roleId: id,
        deletedAt: null,
      },
    });

    if (userCount > 0) {
      throw new BadRequestException('Cannot delete role that is assigned to users');
    }

    // Soft delete the role
    await this.prisma.role.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    return { success: true };
  }

  /**
   * Assign roles to a user
   */
  async assignRolesToUser(
    tenantId: string,
    userId: string,
    roleIds: string[],
  ): Promise<{ success: boolean }> {
    if (!roleIds || roleIds.length === 0) {
      return { success: true };
    }

    // Validate roles exist
    await this.validateRolesExist(tenantId, roleIds);

    // Get existing user roles
    const existingUserRoles = await this.prisma.userRole.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        roleId: true,
      },
    });

    const existingRoleIds = existingUserRoles.map((ur) => ur.roleId);
    const newRoleIds = roleIds.filter((id) => !existingRoleIds.includes(id));
    const removedRoleIds = existingRoleIds.filter((id) => !roleIds.includes(id));

    // Start transaction
    await this.prisma.$transaction(async (prisma) => {
      // Add new roles
      if (newRoleIds.length > 0) {
        await prisma.userRole.createMany({
          data: newRoleIds.map((roleId) => ({
            userId,
            roleId,
            tenantId,
          })),
          skipDuplicates: true,
        });
      }

      // Remove roles that are no longer assigned
      if (removedRoleIds.length > 0) {
        await prisma.userRole.updateMany({
          where: {
            userId,
            roleId: { in: removedRoleIds },
          },
          data: {
            deletedAt: new Date(),
          },
        });
      }
    });

    return { success: true };
  }

  /**
   * Update user roles (replaces all existing roles)
   */
  async updateUserRoles(
    tenantId: string,
    userId: string,
    roleIds: string[],
  ): Promise<{ success: boolean }> {
    if (!roleIds) {
      return { success: true };
    }

    // If empty array, remove all roles
    if (roleIds.length === 0) {
      await this.prisma.userRole.updateMany({
        where: {
          userId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      return { success: true };
    }

    // Validate roles exist
    await this.validateRolesExist(tenantId, roleIds);

    // Start transaction
    await this.prisma.$transaction(async (prisma) => {
      // Soft delete all existing roles
      await prisma.userRole.updateMany({
        where: {
          userId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      // Add new roles
      await prisma.userRole.createMany({
        data: roleIds.map((roleId) => ({
          userId,
          roleId,
          tenantId,
        })),
        skipDuplicates: true,
      });
    });

    return { success: true };
  }

  /**
   * Get all permissions for a user (combining all role permissions)
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId,
        deletedAt: null,
        role: {
          isActive: true,
          deletedAt: null,
        },
      },
      include: {
        role: {
          include: {
            permissions: {
              where: { deletedAt: null },
              include: {
                permission: {
                  where: { isActive: true },
                  select: { key: true },
                },
              },
            },
          },
        },
      },
    });

    // Extract unique permission keys
    const permissionSet = new Set<string>();
    
    userRoles.forEach((userRole) => {
      userRole.role.permissions.forEach((rolePermission) => {
        if (rolePermission.permission) {
          permissionSet.add(rolePermission.permission.key);
        }
      });
    });

    return Array.from(permissionSet);
  }

  /**
   * Check if a user has a specific permission
   */
  async hasPermission(userId: string, permissionKey: string): Promise<boolean> {
    const count = await this.prisma.userRole.count({
      where: {
        userId,
        deletedAt: null,
        role: {
          isActive: true,
          deletedAt: null,
          permissions: {
            some: {
              deletedAt: null,
              permission: {
                key: permissionKey,
                isActive: true,
              },
            },
          },
        },
      },
    });

    return count > 0;
  }

  /**
   * Validate that all role IDs exist
   */
  async validateRolesExist(tenantId: string, roleIds: string[]): Promise<void> {
    if (!roleIds || roleIds.length === 0) return;

    const uniqueRoleIds = [...new Set(roleIds)];
    const count = await this.prisma.role.count({
      where: {
        id: { in: uniqueRoleIds },
        tenantId,
        deletedAt: null,
      },
    });

    if (count !== uniqueRoleIds.length) {
      throw new NotFoundException('One or more roles not found');
    }
  }

  /**
   * Validate that all permission keys exist
   */
  private async validatePermissionsExist(permissionKeys: string[]): Promise<void> {
    if (!permissionKeys || permissionKeys.length === 0) return;

    const uniqueKeys = [...new Set(permissionKeys)];
    const count = await this.prisma.permission.count({
      where: {
        key: { in: uniqueKeys },
        isActive: true,
      },
    });

    if (count !== uniqueKeys.length) {
      throw new NotFoundException('One or more permissions not found');
    }
  }

  /**
   * Assign permissions to a role
   */
  private async assignPermissionsToRole(
    prisma: Prisma.TransactionClient,
    tenantId: string,
    roleId: string,
    permissionKeys: string[],
  ): Promise<void> {
    if (!permissionKeys || permissionKeys.length === 0) return;

    // Get existing role permissions
    const existingPermissions = await prisma.rolePermission.findMany({
      where: {
        roleId,
        deletedAt: null,
      },
      select: {
        permission: {
          select: {
            key: true,
          },
        },
      },
    });

    const existingPermissionKeys = existingPermissions.map((ep) => ep.permission.key);
    const newPermissionKeys = permissionKeys.filter((key) => !existingPermissionKeys.includes(key));

    // Add new permissions
    if (newPermissionKeys.length > 0) {
      // Get permission IDs for the keys
      const permissions = await prisma.permission.findMany({
        where: {
          key: { in: newPermissionKeys },
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      if (permissions.length > 0) {
        await prisma.rolePermission.createMany({
          data: permissions.map((permission) => ({
            roleId,
            permissionId: permission.id,
            tenantId,
          })),
          skipDuplicates: true,
        });
      }
    }
  }

  /**
   * Update role permissions (replaces all existing permissions)
   */
  private async updateRolePermissions(
    prisma: Prisma.TransactionClient,
    tenantId: string,
    roleId: string,
    permissionKeys: string[],
  ): Promise<void> {
    // If empty array, remove all permissions
    if (permissionKeys.length === 0) {
      await prisma.rolePermission.updateMany({
        where: {
          roleId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      return;
    }

    // Get permission IDs for the keys
    const permissions = await prisma.permission.findMany({
      where: {
        key: { in: permissionKeys },
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (permissions.length === 0) return;

    const permissionIds = permissions.map((p) => p.id);

    // Start transaction
    await prisma.$transaction([
      // Soft delete existing permissions not in the new list
      prisma.rolePermission.updateMany({
        where: {
          roleId,
          permissionId: { notIn: permissionIds },
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      }),
      
      // Create new permissions that don't exist
      prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
          tenantId,
        })),
        skipDuplicates: true,
      }),
    ]);
  }
}
