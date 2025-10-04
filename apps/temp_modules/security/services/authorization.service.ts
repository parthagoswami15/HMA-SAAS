import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getUserPermissions(user: any) {
    this.logger.log(`Getting permissions for user: ${user.id}`);

    const userPermissions = await this.prisma.userPermission.findMany({
      where: { userId: user.id },
      include: {
        permission: true,
      },
    });

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role: {
          users: { some: { id: user.id } },
        },
      },
      include: {
        permission: true,
      },
    });

    const permissions = [...userPermissions, ...rolePermissions].map(p => p.permission);

    return {
      userId: user.id,
      permissions: permissions.map(p => ({
        id: p.id,
        name: p.name,
        resource: p.resource,
        action: p.action,
        conditions: p.conditions,
      })),
    };
  }

  async getUserRoles(user: any) {
    this.logger.log(`Getting roles for user: ${user.id}`);

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: {
        role: true,
      },
    });

    return {
      userId: user.id,
      roles: userRoles.map(ur => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
        permissions: ur.role.permissions?.length || 0,
      })),
    };
  }

  async checkPermission(permissionDto: any, user: any) {
    this.logger.log(`Checking permission: ${permissionDto.permission} for user: ${user.id}`);

    const { permission: permissionName, resource, conditions } = permissionDto;

    // Get user's direct permissions
    const userPermissions = await this.prisma.userPermission.findMany({
      where: { userId: user.id },
      include: { permission: true },
    });

    // Get user's role permissions
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role: {
          users: { some: { id: user.id } },
        },
      },
      include: { permission: true },
    });

    const allPermissions = [...userPermissions, ...rolePermissions];

    // Check if user has the required permission
    const hasPermission = allPermissions.some(p => {
      const perm = p.permission;
      return perm.name === permissionName ||
             (perm.resource === resource && perm.action === permissionName);
    });

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Check conditions if specified
    if (conditions) {
      const permissionWithConditions = allPermissions.find(p => {
        const perm = p.permission;
        return perm.name === permissionName &&
               JSON.stringify(perm.conditions) === JSON.stringify(conditions);
      });

      if (!permissionWithConditions) {
        throw new ForbiddenException('Permission conditions not met');
      }
    }

    return {
      userId: user.id,
      permission: permissionName,
      resource,
      granted: true,
      conditions,
    };
  }

  async grantPermission(userId: string, permissionDto: any, grantedBy: any) {
    this.logger.log(`Granting permission to user: ${userId}`);

    const { permissionId, conditions } = permissionDto;

    const permission = await this.prisma.permission.findUnique({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new Error('Permission not found');
    }

    const userPermission = await this.prisma.userPermission.create({
      data: {
        userId,
        permissionId,
        conditions: conditions || {},
        grantedBy: grantedBy.id,
        grantedAt: new Date(),
      },
    });

    return userPermission;
  }

  async revokePermission(userId: string, permissionId: string, revokedBy: any) {
    this.logger.log(`Revoking permission from user: ${userId}`);

    const userPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        permissionId,
      },
    });

    if (!userPermission) {
      throw new Error('User permission not found');
    }

    await this.prisma.userPermission.delete({
      where: { id: userPermission.id },
    });

    return { success: true };
  }

  async assignRole(userId: string, roleId: string, assignedBy: any) {
    this.logger.log(`Assigning role ${roleId} to user: ${userId}`);

    const userRole = await this.prisma.userRole.create({
      data: {
        userId,
        roleId,
        assignedBy: assignedBy.id,
        assignedAt: new Date(),
      },
    });

    return userRole;
  }

  async revokeRole(userId: string, roleId: string, revokedBy: any) {
    this.logger.log(`Revoking role ${roleId} from user: ${userId}`);

    const userRole = await this.prisma.userRole.findFirst({
      where: {
        userId,
        roleId,
      },
    });

    if (!userRole) {
      throw new Error('User role not found');
    }

    await this.prisma.userRole.delete({
      where: { id: userRole.id },
    });

    return { success: true };
  }

  async createRole(roleDto: any, createdBy: any) {
    this.logger.log(`Creating role: ${roleDto.name}`);

    const role = await this.prisma.role.create({
      data: {
        name: roleDto.name,
        description: roleDto.description,
        permissions: roleDto.permissions || [],
        conditions: roleDto.conditions || {},
        createdBy: createdBy.id,
      },
    });

    return role;
  }

  async updateRole(roleId: string, roleDto: any, updatedBy: any) {
    this.logger.log(`Updating role: ${roleId}`);

    const role = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        name: roleDto.name,
        description: roleDto.description,
        permissions: roleDto.permissions,
        conditions: roleDto.conditions,
        updatedBy: updatedBy.id,
        updatedAt: new Date(),
      },
    });

    return role;
  }

  async deleteRole(roleId: string, deletedBy: any) {
    this.logger.log(`Deleting role: ${roleId}`);

    // Check if role is assigned to users
    const usersWithRole = await this.prisma.userRole.count({
      where: { roleId },
    });

    if (usersWithRole > 0) {
      throw new Error('Cannot delete role that is assigned to users');
    }

    await this.prisma.role.delete({
      where: { id: roleId },
    });

    return { success: true };
  }

  async getAllRoles() {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return roles;
  }

  async getRolePermissions(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: true,
      },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    return role.permissions;
  }

  async updateRolePermissions(roleId: string, permissionIds: string[], updatedBy: any) {
    this.logger.log(`Updating permissions for role: ${roleId}`);

    // Remove existing permissions
    await this.prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Add new permissions
    const rolePermissions = [];
    for (const permissionId of permissionIds) {
      const rolePermission = await this.prisma.rolePermission.create({
        data: {
          roleId,
          permissionId,
        },
      });
      rolePermissions.push(rolePermission);
    }

    return rolePermissions;
  }

  async checkResourceAccess(user: any, resource: string, action: string, resourceId?: string) {
    this.logger.log(`Checking resource access for user: ${user.id}, resource: ${resource}, action: ${action}`);

    // Get user's permissions
    const userPermissions = await this.prisma.userPermission.findMany({
      where: { userId: user.id },
      include: { permission: true },
    });

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role: {
          users: { some: { id: user.id } },
        },
      },
      include: { permission: true },
    });

    const allPermissions = [...userPermissions, ...rolePermissions];

    // Check if user has permission for this resource and action
    const hasPermission = allPermissions.some(p => {
      const perm = p.permission;
      return (perm.resource === resource && perm.action === action) ||
             perm.name === `${resource}:${action}`;
    });

    if (!hasPermission) {
      throw new ForbiddenException(`Access denied: ${action} on ${resource}`);
    }

    // Additional checks for specific resources
    if (resourceId) {
      await this.checkResourceOwnership(user, resource, resourceId);
    }

    return { granted: true, resource, action, resourceId };
  }

  private async checkResourceOwnership(user: any, resource: string, resourceId: string) {
    // Implement resource-specific ownership checks
    switch (resource) {
      case 'patient':
        const patient = await this.prisma.patient.findUnique({
          where: { id: resourceId },
        });
        if (!patient) {
          throw new Error('Patient not found');
        }
        // Check if user is the patient's doctor or has access
        break;

      case 'consultation':
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
          where: { id: resourceId },
        });
        if (!consultation) {
          throw new Error('Consultation not found');
        }
        // Check if user is the doctor or patient for this consultation
        break;

      default:
        // For other resources, assume ownership check is handled by ABAC
        break;
    }
  }

  async getPermissionHierarchy() {
    const permissions = await this.prisma.permission.findMany({
      orderBy: { resource: 'asc', action: 'asc' },
    });

    const hierarchy = permissions.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push({
        id: permission.id,
        action: permission.action,
        description: permission.description,
      });
      return acc;
    }, {});

    return hierarchy;
  }
}
