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
exports.RoleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_repository_1 = require("../../common/repositories/base.repository");
let RoleRepository = class RoleRepository extends base_repository_1.BaseRepository {
    prismaDelegate;
    modelName = 'Role';
    constructor(prisma) {
        super(prisma);
        this.prismaDelegate = prisma.role;
    }
    async findByName(tenantId, name) {
        return this.prismaDelegate.findFirst({
            where: {
                tenantId,
                name,
                deletedAt: null,
            },
        });
    }
    async findRoleWithDetails(tenantId, roleId) {
        return this.prismaDelegate.findUnique({
            where: { id: roleId, tenantId, deletedAt: null },
            include: this.getDefaultInclude(),
        });
    }
    async findManyWithDetails(tenantId, where = {}, options = {}) {
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
    async assignPermissions(tenantId, roleId, permissionKeys) {
        const role = await this.prismaDelegate.findUnique({
            where: { id: roleId, tenantId },
        });
        if (!role) {
            throw new Error('Role not found');
        }
        const permissions = await this.prisma.permission.findMany({
            where: {
                key: { in: permissionKeys },
                isActive: true,
            },
            select: { id: true },
        });
        const permissionIds = permissions.map((p) => p.id);
        await this.prisma.$transaction([
            this.prisma.rolePermission.deleteMany({
                where: {
                    roleId,
                    permissionId: { notIn: permissionIds },
                },
            }),
            ...permissionIds.map((permissionId) => this.prisma.rolePermission.upsert({
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
            })),
        ]);
    }
    async getStaffWithRole(tenantId, roleId) {
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
    async assignRoleToStaff(tenantId, roleId, staffId, assignedBy, isPrimary = false) {
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
    async removeRoleFromStaff(tenantId, roleId, staffId) {
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
        await this.prisma.staffRole.delete({
            where: {
                staffId_roleId: {
                    staffId,
                    roleId,
                },
            },
        });
    }
    getDefaultInclude() {
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
};
exports.RoleRepository = RoleRepository;
exports.RoleRepository = RoleRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoleRepository);
//# sourceMappingURL=role.repository.js.map