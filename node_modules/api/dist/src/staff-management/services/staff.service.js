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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StaffService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../enums");
const user_service_1 = require("../../user/user.service");
const role_service_1 = require("./role.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
const staffWithRelations = {
    include: {
        user: {
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        },
        department: true,
        specialties: {
            include: {
                specialty: true,
            },
        },
    },
};
let StaffService = StaffService_1 = class StaffService {
    userService;
    roleService;
    prisma;
    logger = new common_1.Logger(StaffService_1.name);
    constructor(userService, roleService, prisma) {
        this.userService = userService;
        this.roleService = roleService;
        this.prisma = prisma;
    }
    handlePrismaError(error, context) {
        this.logger.error(`Database error in ${context}:`, error);
        if (error instanceof library_1.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    throw new common_1.ConflictException('Duplicate entry. This record already exists.');
                case 'P2025':
                    throw new common_1.NotFoundException('The requested record was not found.');
                case 'P2003':
                    throw new common_1.BadRequestException('Invalid reference. One or more related records do not exist.');
                default:
                    throw new common_1.InternalServerErrorException('A database error occurred.');
            }
        }
        throw error;
    }
    mapToStaffWithRelations(staff) {
        if (!staff)
            return null;
        try {
            const roles = (staff.user?.roles || []).map(userRole => ({
                id: userRole.role?.id || '',
                name: userRole.role?.name || '',
                isSystem: Boolean(userRole.role?.isSystem),
            }));
            const specialties = (staff.specialties || []).map((staffSpecialty) => ({
                id: staffSpecialty.id || '',
                specialty: {
                    id: staffSpecialty.specialty?.id || '',
                    name: staffSpecialty.specialty?.name || '',
                    code: staffSpecialty.specialty?.code || '',
                    description: staffSpecialty.specialty?.description || null,
                },
                isPrimary: Boolean(staffSpecialty.isPrimary),
                experience: Number(staffSpecialty.experience) || 0,
                notes: staffSpecialty.notes || null,
                assignedAt: staffSpecialty.assignedAt || new Date(),
                assignedBy: staffSpecialty.assignedBy || 'system',
            }));
            const department = staff.department ? {
                id: staff.department.id,
                name: staff.department.name,
                code: staff.department.code || '',
                description: staff.department.description || null,
            } : undefined;
            const user = {
                id: staff.user?.id || '',
                firstName: staff.user?.firstName || '',
                lastName: staff.user?.lastName || '',
                email: staff.user?.email || '',
                phone: staff.user?.phone || null,
            };
            return {
                id: staff.id,
                employeeId: staff.employeeId || '',
                type: staff.type || enums_1.StaffType.SUPPORT_STAFF,
                status: staff.status || enums_1.StaffStatus.ACTIVE,
                designation: staff.designation || '',
                joiningDate: staff.joiningDate || new Date(),
                qualifications: Array.isArray(staff.qualifications)
                    ? staff.qualifications
                    : [],
                bio: staff.bio || '',
                isActive: Boolean(staff.isActive),
                tenantId: staff.tenantId,
                userId: staff.userId,
                departmentId: staff.departmentId || undefined,
                createdAt: staff.createdAt || new Date(),
                updatedAt: staff.updatedAt || new Date(),
                deletedAt: staff.deletedAt || undefined,
                user,
                department,
                roles,
                specialties,
            };
        }
        catch (error) {
            console.error('Error in mapToStaffWithRelations:', error);
            throw new Error('Failed to map staff with relations');
        }
    }
    async create(tenantId, createStaffDto) {
        const { user, roleIds = [], specialties = [], ...staffData } = createStaffDto;
        return this.prisma.$transaction(async (prisma) => {
            try {
                if (staffData.employeeId) {
                    const existingStaff = await prisma.staff.findFirst({
                        where: {
                            employeeId: staffData.employeeId,
                            tenantId,
                            deletedAt: null,
                        },
                        select: { id: true },
                    });
                    if (existingStaff) {
                        throw new common_1.ConflictException('Employee ID is already in use');
                    }
                }
                const existingUser = await prisma.user.findFirst({
                    where: {
                        email: user.email,
                        tenantId,
                    },
                    select: { id: true },
                });
                if (existingUser) {
                    throw new common_1.ConflictException('Email is already in use');
                }
                const createdUser = await this.userService.create({
                    ...user,
                    tenantId,
                    role: staffData.type || enums_1.StaffType.SUPPORT_STAFF,
                    createdBy: staffData.createdBy,
                    updatedBy: staffData.updatedBy,
                });
                try {
                    const staff = await prisma.staff.create({
                        data: {
                            ...staffData,
                            userId: createdUser.id,
                            tenantId,
                            isActive: staffData.isActive ?? true,
                            status: staffData.status || enums_1.StaffStatus.ACTIVE,
                            type: staffData.type || enums_1.StaffType.SUPPORT_STAFF,
                            createdBy: staffData.createdBy,
                            updatedBy: staffData.updatedBy,
                            departmentId: staffData.departmentId || null,
                            bio: staffData.bio || null,
                            qualifications: staffData.qualifications || [],
                        },
                        include: staffWithRelations.include,
                    });
                    if (roleIds.length > 0) {
                        await this.roleService.assignRolesToUser(createdUser.id, roleIds, tenantId);
                    }
                    if (specialties && specialties.length > 0) {
                        await prisma.staffSpecialty.createMany({
                            data: specialties.map(specialty => ({
                                staffId: staff.id,
                                specialtyId: specialty.specialtyId,
                                isPrimary: specialty.isPrimary || false,
                                experience: specialty.experience || 0,
                                notes: specialty.notes || null,
                                startDate: specialty.startDate ? new Date(specialty.startDate) : null,
                                certificationNumber: specialty.certificationNumber || null,
                                certificationExpiryDate: specialty.certificationExpiryDate
                                    ? new Date(specialty.certificationExpiryDate)
                                    : null,
                                assignedBy: staffData.createdBy || 'system',
                                assignedAt: new Date(),
                            })),
                        });
                    }
                    return this.mapToStaffWithRelations(staff);
                }
                catch (error) {
                    await prisma.user.delete({ where: { id: createdUser.id } }).catch(() => {
                        this.logger.error(`Failed to clean up user after staff creation failed: ${createdUser.id}`);
                    });
                    throw error;
                }
            }
            catch (error) {
                this.handlePrismaError(error, 'createStaff');
            }
        });
    }
    async update(tenantId, id, updateStaffDto) {
        const { user, roleIds, specialties, ...staffData } = updateStaffDto;
        return this.prisma.$transaction(async (prisma) => {
            const existingStaff = await prisma.staff.findFirst({
                where: {
                    id,
                    tenantId,
                    deletedAt: null
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            });
            if (!existingStaff) {
                throw new common_1.NotFoundException(`Staff member with ID ${id} not found`);
            }
            if (staffData.employeeId && staffData.employeeId !== existingStaff.employeeId) {
                const staffWithSameEmployeeId = await prisma.staff.findFirst({
                    where: {
                        employeeId: staffData.employeeId,
                        tenantId,
                        deletedAt: null,
                        id: { not: id },
                    },
                    select: { id: true },
                });
                if (staffWithSameEmployeeId) {
                    throw new common_1.ConflictException('Employee ID is already in use');
                }
            }
            if (user) {
                if (user.email && user.email !== existingStaff.user.email) {
                    const userWithEmail = await prisma.user.findFirst({
                        where: {
                            email: user.email,
                            tenantId,
                            id: { not: existingStaff.userId },
                        },
                        select: { id: true },
                    });
                    if (userWithEmail) {
                        throw new common_1.ConflictException('Email is already in use');
                    }
                }
                await prisma.user.update({
                    where: { id: existingStaff.userId },
                    data: {
                        ...(user.firstName !== undefined && { firstName: user.firstName }),
                        ...(user.lastName !== undefined && { lastName: user.lastName }),
                        ...(user.email !== undefined && { email: user.email }),
                        ...(user.phone !== undefined && { phone: user.phone }),
                        ...(user.isActive !== undefined && { isActive: user.isActive }),
                        updatedAt: new Date(),
                        ...(staffData.updatedBy && { updatedBy: staffData.updatedBy }),
                    },
                });
            }
            if (roleIds) {
                await prisma.userRole.deleteMany({
                    where: { userId: existingStaff.userId }
                });
                if (roleIds.length > 0) {
                    await prisma.userRole.createMany({
                        data: roleIds.map(roleId => ({
                            userId: existingStaff.userId,
                            roleId,
                            assignedBy: staffData.updatedBy || 'system',
                            assignedAt: new Date(),
                        })),
                        skipDuplicates: true,
                        where: { userId: existingStaff.userId }
                    });
                    if (roleIds.length > 0) {
                        await prisma.userRole.createMany({
                            data: roleIds.map(roleId => ({
                                userId: existingStaff.userId,
                                roleId,
                                assignedBy: staffData.updatedBy || 'system',
                                assignedAt: new Date(),
                            })),
                            skipDuplicates: true,
                        });
                    }
                }
                if (specialties) {
                    for (const specialty of specialties) {
                        if (specialty.remove) {
                            await prisma.staffSpecialty.deleteMany({
                                where: {
                                    staffId: id,
                                    specialtyId: specialty.specialtyId,
                                },
                            });
                        }
                        else {
                            await prisma.staffSpecialty.upsert({
                                where: {
                                    staffId_specialtyId: {
                                        staffId: id,
                                        specialtyId: specialty.specialtyId,
                                    },
                                },
                                update: {
                                    isPrimary: specialty.isPrimary,
                                    experience: specialty.experience,
                                    notes: specialty.notes,
                                    startDate: specialty.startDate ? new Date(specialty.startDate) : null,
                                    certificationNumber: specialty.certificationNumber,
                                    certificationExpiryDate: specialty.certificationExpiryDate
                                        ? new Date(specialty.certificationExpiryDate)
                                        : null,
                                    updatedAt: new Date(),
                                    ...(staffData.updatedBy && { updatedBy: staffData.updatedBy }),
                                },
                                create: {
                                    staffId: id,
                                    specialtyId: specialty.specialtyId,
                                    isPrimary: specialty.isPrimary || false,
                                    experience: specialty.experience || 0,
                                    notes: specialty.notes || null,
                                    startDate: specialty.startDate ? new Date(specialty.startDate) : null,
                                    certificationNumber: specialty.certificationNumber || null,
                                    certificationExpiryDate: specialty.certificationExpiryDate
                                        ? new Date(specialty.certificationExpiryDate)
                                        : null,
                                    assignedBy: staffData.updatedBy || 'system',
                                    assignedAt: new Date(),
                                },
                            });
                        }
                    }
                }
                const staffUpdateData = {
                    ...(staffData.employeeId !== undefined && { employeeId: staffData.employeeId }),
                    ...(staffData.type !== undefined && { type: staffData.type }),
                    ...(staffData.status !== undefined && { status: staffData.status }),
                    ...(staffData.designation !== undefined && { designation: staffData.designation }),
                    ...(staffData.departmentId !== undefined
                        ? staffData.departmentId
                            ? { department: { connect: { id: staffData.departmentId } } }
                            : { department: { disconnect: true } }
                        : {}),
                    ...(staffData.joiningDate !== undefined && { joiningDate: staffData.joiningDate }),
                    ...(staffData.leavingDate !== undefined && { leavingDate: staffData.leavingDate }),
                    ...(staffData.qualifications !== undefined && {
                        qualifications: Array.isArray(staffData.qualifications)
                            ? staffData.qualifications
                            : []
                    }),
                    ...(staffData.bio !== undefined && { bio: staffData.bio }),
                    ...(staffData.isActive !== undefined && { isActive: staffData.isActive }),
                    updatedAt: new Date(),
                    ...(staffData.updatedBy && { updatedBy: staffData.updatedBy }),
                };
                const updatedStaff = await prisma.staff.update({
                    where: { id },
                    data: staffUpdateData,
                    include: staffWithRelations.include,
                });
                const staffWithRelations = await prisma.staff.findUnique({
                    where: { id },
                    include: {
                        user: {
                            include: {
                                roles: {
                                    include: {
                                        role: true,
                                    },
                                    where: {
                                        role: {
                                            isActive: true,
                                        },
                                    },
                                },
                            },
                        },
                        department: true,
                        specialties: {
                            include: {
                                specialty: true,
                            },
                            where: {
                                specialty: {
                                    isActive: true,
                                },
                            },
                        },
                    },
                });
                if (!staffWithRelations) {
                    throw new common_1.NotFoundException(`Failed to retrieve updated staff with ID ${id}`);
                }
                return this.mapToStaffWithRelations(staffWithRelations);
            }
        });
    }
    async bulkUpdateStatus(tenantId, ids, status) {
        if (!tenantId || !ids || !Array.isArray(ids) || ids.length === 0) {
            throw new common_1.BadRequestException('Invalid input parameters');
        }
        if (!Object.values(enums_1.StaffStatus).includes(status)) {
            throw new common_1.BadRequestException(`Invalid status value. Must be one of: ${Object.values(enums_1.StaffStatus).join(', ')}`);
        }
        const uniqueIds = [...new Set(ids)];
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const existingStaff = await prisma.staff.findMany({
                    where: {
                        id: { in: uniqueIds },
                        tenantId,
                        deletedAt: null,
                    },
                    select: { id: true, userId: true },
                });
                const foundIds = existingStaff.map(staff => staff.id);
                const missingIds = uniqueIds.filter(id => !foundIds.includes(id));
                if (missingIds.length > 0) {
                    throw new common_1.NotFoundException(`Staff members not found: ${missingIds.join(', ')}`);
                }
                const updateResult = await prisma.staff.updateMany({
                    where: {
                        id: { in: uniqueIds },
                        tenantId,
                        deletedAt: null,
                    },
                    data: {
                        status,
                        updatedAt: new Date(),
                        ...(status !== enums_1.StaffStatus.ACTIVE && { isActive: false }),
                    },
                });
                if (status !== enums_1.StaffStatus.ACTIVE) {
                    const userIds = existingStaff.map(staff => staff.userId).filter(Boolean);
                    if (userIds.length > 0) {
                        await prisma.user.updateMany({
                            where: {
                                id: { in: userIds },
                                tenantId,
                            },
                            data: {
                                isActive: false,
                                updatedAt: new Date(),
                            },
                        });
                        await prisma.session.deleteMany({
                            where: {
                                userId: { in: userIds },
                            },
                        });
                    }
                }
                return updateResult;
            });
            return { count: result.count };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('Error in bulkUpdateStatus:', error);
            throw new Error('Failed to update staff status');
        }
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = StaffService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => role_service_1.RoleService))),
    __metadata("design:paramtypes", [user_service_1.UserService,
        role_service_1.RoleService,
        prisma_service_1.PrismaService])
], StaffService);
//# sourceMappingURL=staff.service.js.map