"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthorizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthorizationService = AuthorizationService_1 = class AuthorizationService {
    prisma;
    logger = new common_1.Logger(AuthorizationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserPermissions(user) {
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
    async getUserRoles(user) {
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
    async checkPermission(permissionDto, user) {
        this.logger.log(`Checking permission: ${permissionDto.permission} for user: ${user.id}`);
        const { permission: permissionName, resource, conditions } = permissionDto;
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
        const hasPermission = allPermissions.some(p => {
            const perm = p.permission;
            return perm.name === permissionName ||
                (perm.resource === resource && perm.action === permissionName);
        });
        if (!hasPermission) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        if (conditions) {
            const permissionWithConditions = allPermissions.find(p => {
                const perm = p.permission;
                return perm.name === permissionName &&
                    JSON.stringify(perm.conditions) === JSON.stringify(conditions);
            });
            if (!permissionWithConditions) {
                throw new common_1.ForbiddenException('Permission conditions not met');
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
    async grantPermission(userId, permissionDto, grantedBy) {
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
    async revokePermission(userId, permissionId, revokedBy) {
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
    async assignRole(userId, roleId, assignedBy) {
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
    async revokeRole(userId, roleId, revokedBy) {
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
    async createRole(roleDto, createdBy) {
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
    async updateRole(roleId, roleDto, updatedBy) {
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
    async deleteRole(roleId, deletedBy) {
        this.logger.log(`Deleting role: ${roleId}`);
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
    async getRolePermissions(roleId) {
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
    async updateRolePermissions(roleId, permissionIds, updatedBy) {
        this.logger.log(`Updating permissions for role: ${roleId}`);
        await this.prisma.rolePermission.deleteMany({
            where: { roleId },
        });
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
    async checkResourceAccess(user, resource, action, resourceId) {
        this.logger.log(`Checking resource access for user: ${user.id}, resource: ${resource}, action: ${action}`);
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
        const hasPermission = allPermissions.some(p => {
            const perm = p.permission;
            return (perm.resource === resource && perm.action === action) ||
                perm.name === `${resource}:${action}`;
        });
        if (!hasPermission) {
            throw new common_1.ForbiddenException(`Access denied: ${action} on ${resource}`);
        }
        if (resourceId) {
            await this.checkResourceOwnership(user, resource, resourceId);
        }
        return { granted: true, resource, action, resourceId };
    }
    async checkResourceOwnership(user, resource, resourceId) {
        switch (resource) {
            case 'patient':
                const patient = await this.prisma.patient.findUnique({
                    where: { id: resourceId },
                });
                if (!patient) {
                    throw new Error('Patient not found');
                }
                break;
            case 'consultation':
                const consultation = await this.prisma.telemedicineConsultation.findUnique({
                    where: { id: resourceId },
                });
                if (!consultation) {
                    throw new Error('Consultation not found');
                }
                break;
            default:
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
};
exports.AuthorizationService = AuthorizationService;
exports.AuthorizationService = AuthorizationService = AuthorizationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthorizationService);
//# sourceMappingURL=authorization.service.js.map