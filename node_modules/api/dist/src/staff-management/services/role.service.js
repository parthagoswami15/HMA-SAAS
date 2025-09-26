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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RoleService = class RoleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, createRoleDto) {
        const { name, permissionKeys = [], ...roleData } = createRoleDto;
        const existingRole = await this.prisma.role.findFirst({
            where: {
                tenantId,
                name,
                deletedAt: null,
            },
        });
        if (existingRole) {
            throw new common_1.ConflictException(`Role with name '${name}' already exists`);
        }
        if (permissionKeys && permissionKeys.length > 0) {
            await this.validatePermissionsExist(permissionKeys);
        }
        return this.prisma.$transaction(async (prisma) => {
            const role = await prisma.role.create({
                data: {
                    ...roleData,
                    name,
                    tenantId,
                    isSystem: roleData.isSystem || false,
                    isActive: roleData.isActive !== false,
                },
            });
            if (permissionKeys.length > 0) {
                await this.assignPermissionsToRole(prisma, tenantId, role.id, permissionKeys);
            }
            return this.findById(tenantId, role.id);
        });
    }
    async findAll(tenantId, options = {}) {
        const { search, isSystem, isActive = true, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', } = options;
        const skip = (page - 1) * limit;
        const where = {
            tenantId,
            deletedAt: null,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (isSystem !== undefined)
            where.isSystem = isSystem;
        if (isActive !== undefined)
            where.isActive = isActive;
        const total = await this.prisma.role.count({ where });
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
    async findById(tenantId, id) {
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
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return {
            ...role,
            permissions: role.permissions.map((rp) => rp.permission),
        };
    }
    async findByName(tenantId, name) {
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
        return {
            ...role,
            permissions: role.permissions.map((rp) => rp.permission),
        };
    }
    async update(tenantId, id, updateRoleDto) {
        const { permissionKeys, ...roleData } = updateRoleDto;
        const existingRole = await this.prisma.role.findFirst({
            where: {
                id,
                tenantId,
                deletedAt: null,
            },
        });
        if (!existingRole) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        if (existingRole.isSystem) {
            throw new common_1.BadRequestException('Cannot update system roles');
        }
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
                throw new common_1.ConflictException(`Role with name '${roleData.name}' already exists`);
            }
        }
        if (permissionKeys) {
            await this.validatePermissionsExist(permissionKeys);
        }
        return this.prisma.$transaction(async (prisma) => {
            const updatedRole = await prisma.role.update({
                where: { id },
                data: {
                    ...roleData,
                    id: undefined,
                    tenantId: undefined,
                    isSystem: undefined,
                    createdAt: undefined,
                    updatedAt: new Date(),
                },
            });
            if (permissionKeys) {
                await this.updateRolePermissions(prisma, tenantId, id, permissionKeys);
            }
            return this.findById(tenantId, id);
        });
    }
    async delete(tenantId, id) {
        const role = await this.prisma.role.findFirst({
            where: {
                id,
                tenantId,
                deletedAt: null,
            },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        if (role.isSystem) {
            throw new common_1.BadRequestException('Cannot delete system roles');
        }
        const userCount = await this.prisma.userRole.count({
            where: {
                roleId: id,
                deletedAt: null,
            },
        });
        if (userCount > 0) {
            throw new common_1.BadRequestException('Cannot delete role that is assigned to users');
        }
        await this.prisma.role.update({
            where: { id },
            data: {
                isActive: false,
                deletedAt: new Date(),
            },
        });
        return { success: true };
    }
    async assignRolesToUser(tenantId, userId, roleIds) {
        if (!roleIds || roleIds.length === 0) {
            return { success: true };
        }
        await this.validateRolesExist(tenantId, roleIds);
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
        await this.prisma.$transaction(async (prisma) => {
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
    async updateUserRoles(tenantId, userId, roleIds) {
        if (!roleIds) {
            return { success: true };
        }
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
        await this.validateRolesExist(tenantId, roleIds);
        await this.prisma.$transaction(async (prisma) => {
            await prisma.userRole.updateMany({
                where: {
                    userId,
                    deletedAt: null,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
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
    async getUserPermissions(userId) {
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
        const permissionSet = new Set();
        userRoles.forEach((userRole) => {
            userRole.role.permissions.forEach((rolePermission) => {
                if (rolePermission.permission) {
                    permissionSet.add(rolePermission.permission.key);
                }
            });
        });
        return Array.from(permissionSet);
    }
    async hasPermission(userId, permissionKey) {
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
    async validateRolesExist(tenantId, roleIds) {
        if (!roleIds || roleIds.length === 0)
            return;
        const uniqueRoleIds = [...new Set(roleIds)];
        const count = await this.prisma.role.count({
            where: {
                id: { in: uniqueRoleIds },
                tenantId,
                deletedAt: null,
            },
        });
        if (count !== uniqueRoleIds.length) {
            throw new common_1.NotFoundException('One or more roles not found');
        }
    }
    async validatePermissionsExist(permissionKeys) {
        if (!permissionKeys || permissionKeys.length === 0)
            return;
        const uniqueKeys = [...new Set(permissionKeys)];
        const count = await this.prisma.permission.count({
            where: {
                key: { in: uniqueKeys },
                isActive: true,
            },
        });
        if (count !== uniqueKeys.length) {
            throw new common_1.NotFoundException('One or more permissions not found');
        }
    }
    async assignPermissionsToRole(prisma, tenantId, roleId, permissionKeys) {
        if (!permissionKeys || permissionKeys.length === 0)
            return;
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
        if (newPermissionKeys.length > 0) {
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
    async updateRolePermissions(prisma, tenantId, roleId, permissionKeys) {
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
        const permissions = await prisma.permission.findMany({
            where: {
                key: { in: permissionKeys },
                isActive: true,
            },
            select: {
                id: true,
            },
        });
        if (permissions.length === 0)
            return;
        const permissionIds = permissions.map((p) => p.id);
        await prisma.$transaction([
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
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoleService);
//# sourceMappingURL=role.service.js.map