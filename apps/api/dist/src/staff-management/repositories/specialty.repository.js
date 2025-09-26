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
exports.SpecialtyRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_repository_1 = require("../../common/repositories/base.repository");
let SpecialtyRepository = class SpecialtyRepository extends base_repository_1.BaseRepository {
    prismaDelegate;
    modelName = 'Specialty';
    constructor(prisma) {
        super(prisma);
        this.prismaDelegate = prisma.specialty;
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
    async findSpecialtyWithDetails(tenantId, specialtyId) {
        return this.prismaDelegate.findUnique({
            where: { id: specialtyId, tenantId, deletedAt: null },
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
    async assignSpecialtyToStaff(tenantId, specialtyId, staffId, assignedBy, isPrimary = false, experience, notes) {
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
    async removeSpecialtyFromStaff(tenantId, specialtyId, staffId) {
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
        await this.prisma.staffSpecialty.delete({
            where: {
                staffId_specialtyId: {
                    staffId,
                    specialtyId,
                },
            },
        });
    }
    async getStaffWithSpecialty(tenantId, specialtyId) {
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
    async getStaffSpecialties(tenantId, staffId) {
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
    getDefaultInclude() {
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
};
exports.SpecialtyRepository = SpecialtyRepository;
exports.SpecialtyRepository = SpecialtyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpecialtyRepository);
//# sourceMappingURL=specialty.repository.js.map