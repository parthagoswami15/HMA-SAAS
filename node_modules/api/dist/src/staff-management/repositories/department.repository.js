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
exports.DepartmentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_repository_1 = require("../../common/repositories/base.repository");
let DepartmentRepository = class DepartmentRepository extends base_repository_1.BaseRepository {
    prismaDelegate;
    modelName = 'Department';
    constructor(prisma) {
        super(prisma);
        this.prismaDelegate = prisma.department;
    }
    async findByCode(tenantId, code) {
        return this.prismaDelegate.findFirst({
            where: {
                tenantId,
                code,
                deletedAt: null,
            },
        });
    }
    async findDepartmentWithDetails(tenantId, departmentId) {
        return this.prismaDelegate.findUnique({
            where: { id: departmentId, tenantId, deletedAt: null },
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
    async getDepartmentHierarchy(tenantId) {
        return this.prismaDelegate.findMany({
            where: {
                tenantId,
                deletedAt: null,
                isActive: true,
                parentDepartmentId: null,
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
    async getStaffCountByDepartment(tenantId) {
        const result = await this.prisma.$queryRaw `
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
        return result;
    }
    async updateDepartment(tenantId, departmentId, data) {
        return this.prismaDelegate.update({
            where: { id: departmentId, tenantId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: this.getDefaultInclude(),
        });
    }
    async assignDepartmentHead(tenantId, departmentId, staffId) {
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
    async removeDepartmentHead(tenantId, departmentId) {
        return this.prismaDelegate.update({
            where: { id: departmentId, tenantId },
            data: {
                headStaffId: null,
                updatedAt: new Date(),
            },
            include: this.getDefaultInclude(),
        });
    }
    async getDepartmentStaff(tenantId, departmentId, includeSubDepartments = false) {
        let departmentIds = [departmentId];
        if (includeSubDepartments) {
            const childDepartments = await this.getChildDepartmentIds(tenantId, departmentId);
            departmentIds = [...departmentIds, ...childDepartments];
        }
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
    async getChildDepartmentIds(tenantId, parentId) {
        const children = await this.prisma.department.findMany({
            where: { tenantId, parentDepartmentId: parentId, deletedAt: null },
            select: { id: true },
        });
        let result = [];
        for (const child of children) {
            result.push(child.id);
            const grandChildren = await this.getChildDepartmentIds(tenantId, child.id);
            result = [...result, ...grandChildren];
        }
        return result;
    }
    getDefaultInclude() {
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
};
exports.DepartmentRepository = DepartmentRepository;
exports.DepartmentRepository = DepartmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentRepository);
//# sourceMappingURL=department.repository.js.map