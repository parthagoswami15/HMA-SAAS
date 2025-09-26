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
exports.StaffRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_repository_1 = require("../../common/repositories/base.repository");
let StaffRepository = class StaffRepository extends base_repository_1.BaseRepository {
    prismaDelegate;
    modelName = 'Staff';
    constructor(prisma) {
        super(prisma);
        this.prismaDelegate = prisma.staff;
    }
    async findByEmployeeId(tenantId, employeeId) {
        return this.prismaDelegate.findFirst({
            where: {
                tenantId,
                employeeId,
                deletedAt: null,
            },
        });
    }
    async findByUserId(tenantId, userId) {
        return this.prismaDelegate.findFirst({
            where: {
                tenantId,
                userId,
                deletedAt: null,
            },
            include: this.getDefaultInclude(),
        });
    }
    async findStaffWithDetails(tenantId, staffId) {
        return this.prismaDelegate.findFirst({
            where: {
                id: staffId,
                tenantId,
                deletedAt: null,
            },
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
    async updateStaff(tenantId, staffId, data) {
        return this.prismaDelegate.update({
            where: { id: staffId, tenantId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: this.getDefaultInclude(),
        });
    }
    async softDelete(tenantId, staffId) {
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
    async assignRoles(tenantId, staffId, roleIds, assignedBy) {
        await this.prisma.$transaction([
            this.prisma.staffRole.deleteMany({
                where: {
                    staffId,
                    roleId: { notIn: roleIds },
                },
            }),
            ...roleIds.map((roleId) => this.prisma.staffRole.upsert({
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
            })),
        ]);
    }
    async assignSpecialties(tenantId, staffId, specialties, assignedBy) {
        await this.prisma.$transaction([
            this.prisma.staffSpecialty.deleteMany({
                where: {
                    staffId,
                    specialtyId: { notIn: specialties.map((s) => s.specialtyId) },
                },
            }),
            ...specialties.map(({ specialtyId, isPrimary = false, experience, notes }) => this.prisma.staffSpecialty.upsert({
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
            })),
        ]);
    }
    async logAudit(tenantId, staffId, action, field, oldValue, newValue, performedBy, ipAddress, userAgent) {
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
    getDefaultInclude() {
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
};
exports.StaffRepository = StaffRepository;
exports.StaffRepository = StaffRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StaffRepository);
//# sourceMappingURL=staff.repository.js.map