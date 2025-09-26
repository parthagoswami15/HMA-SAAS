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
exports.SpecialtyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SpecialtyService = class SpecialtyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, createSpecialtyDto) {
        const { code, ...specialtyData } = createSpecialtyDto;
        if (code) {
            const existingSpecialty = await this.prisma.specialty.findFirst({
                where: {
                    tenantId,
                    code,
                    deletedAt: null,
                },
            });
            if (existingSpecialty) {
                throw new common_1.ConflictException(`Specialty with code '${code}' already exists`);
            }
        }
        return this.prisma.specialty.create({
            data: {
                ...specialtyData,
                code,
                tenantId,
                isActive: specialtyData.isActive !== false,
                displayOrder: specialtyData.displayOrder ?? 0,
                requiresCertification: specialtyData.requiresCertification ?? false,
                minYearsExperience: specialtyData.minYearsExperience ?? 0,
            },
        });
    }
    async findAll(tenantId, options = {}) {
        const { search, category, isActive = true, requiresCertification, page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', } = options;
        const skip = (page - 1) * limit;
        const where = {
            tenantId,
            deletedAt: null,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category)
            where.category = category;
        if (isActive !== undefined)
            where.isActive = isActive;
        if (requiresCertification !== undefined)
            where.requiresCertification = requiresCertification;
        const total = await this.prisma.specialty.count({ where });
        const data = await this.prisma.specialty.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        });
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
        const specialty = await this.prisma.specialty.findFirst({
            where: {
                id,
                tenantId,
                deletedAt: null,
            },
        });
        if (!specialty) {
            throw new common_1.NotFoundException(`Specialty with ID ${id} not found`);
        }
        return specialty;
    }
    async findByCode(tenantId, code) {
        return this.prisma.specialty.findFirst({
            where: {
                code,
                tenantId,
                deletedAt: null,
            },
        });
    }
    async update(tenantId, id, updateSpecialtyDto) {
        const { code, ...specialtyData } = updateSpecialtyDto;
        const existingSpecialty = await this.prisma.specialty.findFirst({
            where: {
                id,
                tenantId,
                deletedAt: null,
            },
        });
        if (!existingSpecialty) {
            throw new common_1.NotFoundException(`Specialty with ID ${id} not found`);
        }
        if (code && code !== existingSpecialty.code) {
            const existingWithCode = await this.prisma.specialty.findFirst({
                where: {
                    code,
                    tenantId,
                    deletedAt: null,
                    NOT: { id },
                },
            });
            if (existingWithCode) {
                throw new common_1.ConflictException(`Specialty with code '${code}' already exists`);
            }
        }
        return this.prisma.specialty.update({
            where: { id },
            data: {
                ...specialtyData,
                code,
                id: undefined,
                tenantId: undefined,
                createdAt: undefined,
                updatedAt: new Date(),
            },
        });
    }
    async delete(tenantId, id) {
        const specialty = await this.prisma.specialty.findFirst({
            where: {
                id,
                tenantId,
                deletedAt: null,
            },
        });
        if (!specialty) {
            throw new common_1.NotFoundException(`Specialty with ID ${id} not found`);
        }
        const staffCount = await this.prisma.staffSpecialty.count({
            where: {
                specialtyId: id,
                deletedAt: null,
            },
        });
        if (staffCount > 0) {
            throw new common_1.BadRequestException('Cannot delete specialty that is assigned to staff members');
        }
        await this.prisma.specialty.update({
            where: { id },
            data: {
                isActive: false,
                deletedAt: new Date(),
            },
        });
        return { success: true };
    }
    async assignSpecialtiesToStaff(tenantId, staffId, specialties) {
        if (!specialties || specialties.length === 0) {
            return { success: true };
        }
        const staff = await this.prisma.staff.findFirst({
            where: {
                id: staffId,
                tenantId,
                deletedAt: null,
            },
        });
        if (!staff) {
            throw new common_1.NotFoundException(`Staff member with ID ${staffId} not found`);
        }
        const specialtyIds = specialties.map(s => s.specialtyId);
        await this.validateSpecialtiesExist(tenantId, specialtyIds);
        const existingStaffSpecialties = await this.prisma.staffSpecialty.findMany({
            where: {
                staffId,
                deletedAt: null,
            },
            select: {
                specialtyId: true,
            },
        });
        const existingSpecialtyIds = existingStaffSpecialties.map(es => es.specialtyId);
        const newSpecialties = specialties.filter(s => !existingSpecialtyIds.includes(s.specialtyId));
        await this.prisma.$transaction(async (prisma) => {
            if (newSpecialties.length > 0) {
                await prisma.staffSpecialty.createMany({
                    data: newSpecialties.map(specialty => ({
                        staffId,
                        specialtyId: specialty.specialtyId,
                        isPrimary: specialty.isPrimary ?? false,
                        experience: specialty.experience,
                        notes: specialty.notes,
                        startDate: specialty.startDate,
                        certificationNumber: specialty.certificationNumber,
                        certificationExpiryDate: specialty.certificationExpiryDate,
                        tenantId,
                    })),
                    skipDuplicates: true,
                });
            }
        });
        return { success: true };
    }
    async updateStaffSpecialties(tenantId, staffId, specialties) {
        const staff = await this.prisma.staff.findFirst({
            where: {
                id: staffId,
                tenantId,
                deletedAt: null,
            },
        });
        if (!staff) {
            throw new common_1.NotFoundException(`Staff member with ID ${staffId} not found`);
        }
        if (!specialties || specialties.length === 0) {
            await this.prisma.staffSpecialty.updateMany({
                where: {
                    staffId,
                    deletedAt: null,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
            return { success: true };
        }
        const specialtyIds = specialties.map(s => s.specialtyId);
        await this.validateSpecialtiesExist(tenantId, specialtyIds);
        await this.prisma.$transaction(async (prisma) => {
            const existingStaffSpecialties = await prisma.staffSpecialty.findMany({
                where: {
                    staffId,
                    deletedAt: null,
                },
                select: {
                    id: true,
                    specialtyId: true,
                },
            });
            const existingSpecialtyIds = existingStaffSpecialties.map(es => es.specialtyId);
            const newSpecialtyIds = specialtyIds.filter(id => !existingSpecialtyIds.includes(id));
            const removedSpecialtyIds = existingSpecialtyIds.filter(id => !specialtyIds.includes(id));
            if (removedSpecialtyIds.length > 0) {
                await prisma.staffSpecialty.updateMany({
                    where: {
                        staffId,
                        specialtyId: { in: removedSpecialtyIds },
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });
            }
            if (newSpecialtyIds.length > 0) {
                const newSpecialties = specialties.filter(s => newSpecialtyIds.includes(s.specialtyId));
                await prisma.staffSpecialty.createMany({
                    data: newSpecialties.map(specialty => ({
                        staffId,
                        specialtyId: specialty.specialtyId,
                        isPrimary: specialty.isPrimary ?? false,
                        experience: specialty.experience,
                        notes: specialty.notes,
                        startDate: specialty.startDate,
                        certificationNumber: specialty.certificationNumber,
                        certificationExpiryDate: specialty.certificationExpiryDate,
                        tenantId,
                    })),
                    skipDuplicates: true,
                });
            }
            const updatedSpecialties = specialties.filter(s => existingSpecialtyIds.includes(s.specialtyId) &&
                !removedSpecialtyIds.includes(s.specialtyId));
            for (const specialty of updatedSpecialties) {
                const existing = existingStaffSpecialties.find(es => es.specialtyId === specialty.specialtyId);
                if (existing) {
                    await prisma.staffSpecialty.update({
                        where: { id: existing.id },
                        data: {
                            isPrimary: specialty.isPrimary,
                            experience: specialty.experience,
                            notes: specialty.notes,
                            startDate: specialty.startDate,
                            certificationNumber: specialty.certificationNumber,
                            certificationExpiryDate: specialty.certificationExpiryDate,
                            updatedAt: new Date(),
                        },
                    });
                }
            }
        });
        return { success: true };
    }
    async getStaffSpecialties(staffId) {
        return this.prisma.staffSpecialty.findMany({
            where: {
                staffId,
                deletedAt: null,
            },
            include: {
                specialty: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        description: true,
                    },
                },
            },
        });
    }
    async updateStaffSpecialty(tenantId, staffId, specialtyId, updateData) {
        const { remove, ...updateDto } = updateData;
        const existing = await this.prisma.staffSpecialty.findFirst({
            where: {
                staffId,
                specialtyId,
                deletedAt: null,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Specialty with ID ${specialtyId} not found for staff member ${staffId}`);
        }
        if (remove) {
            return this.prisma.staffSpecialty.update({
                where: { id: existing.id },
                data: {
                    deletedAt: new Date(),
                },
            });
        }
        return this.prisma.staffSpecialty.update({
            where: { id: existing.id },
            data: {
                ...updateDto,
                id: undefined,
                staffId: undefined,
                specialtyId: undefined,
                tenantId: undefined,
                createdAt: undefined,
                updatedAt: new Date(),
            },
        });
    }
    async validateSpecialtiesExist(tenantId, specialtyIds) {
        if (!specialtyIds || specialtyIds.length === 0)
            return;
        const uniqueSpecialtyIds = [...new Set(specialtyIds)];
        const count = await this.prisma.specialty.count({
            where: {
                id: { in: uniqueSpecialtyIds },
                tenantId,
                deletedAt: null,
            },
        });
        if (count !== uniqueSpecialtyIds.length) {
            throw new common_1.NotFoundException('One or more specialties not found');
        }
    }
    async getCountBySpecialty(tenantId) {
        const result = await this.prisma.staffSpecialty.groupBy({
            by: ['specialtyId'],
            where: {
                deletedAt: null,
                staff: {
                    tenantId,
                    isActive: true,
                    deletedAt: null,
                },
            },
            _count: {
                staffId: true,
            },
            orderBy: {
                _count: {
                    staffId: 'desc',
                },
            },
            include: {
                specialty: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return result.map((item) => ({
            specialtyId: item.specialtyId,
            specialtyName: item.specialty?.name || 'Unknown',
            count: item._count.staffId,
        }));
    }
};
exports.SpecialtyService = SpecialtyService;
exports.SpecialtyService = SpecialtyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpecialtyService);
//# sourceMappingURL=specialty.service.js.map