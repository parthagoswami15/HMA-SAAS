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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const department_dto_1 = require("../dto/department.dto");
const class_transformer_1 = require("class-transformer");
const department_repository_1 = require("../repositories/department.repository");
const staff_repository_1 = require("../repositories/staff.repository");
const staff_service_1 = require("./staff.service");
let DepartmentService = class DepartmentService {
    departmentRepository;
    staffRepository;
    staffService;
    constructor(departmentRepository, staffRepository, staffService) {
        this.departmentRepository = departmentRepository;
        this.staffRepository = staffRepository;
        this.staffService = staffService;
    }
    async create(tenantId, createDepartmentDto) {
        const { code, ...rest } = createDepartmentDto;
        if (code) {
            const existing = await this.departmentRepository.findByCode(tenantId, code);
            if (existing) {
                throw new common_1.ConflictException(`Department with code '${code}' already exists`);
            }
        }
        if (rest.parentDepartmentId) {
            const parentExists = await this.departmentRepository.findById(tenantId, rest.parentDepartmentId);
            if (!parentExists) {
                throw new common_1.BadRequestException('Parent department not found');
            }
        }
        const department = await this.departmentRepository.create(tenantId, {
            ...rest,
            code,
        });
        return (0, class_transformer_1.plainToClass)(department_dto_1.DepartmentResponseDto, department);
    }
    async findAll(tenantId, filterDto) {
        const { page = 1, limit = 10, search, parentId, isActive } = filterDto;
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
        if (parentId !== undefined) {
            where.parentDepartmentId = parentId;
        }
        if (isActive !== undefined) {
            where.isActive = typeof isActive === 'string' ? isActive === 'true' : isActive;
        }
        const { data: departments, total } = await this.departmentRepository.findManyWithDetails(tenantId, where, {
            skip,
            take: limit,
            orderBy: { name: 'asc' }
        });
        const totalPages = Math.ceil(total / limit);
        return {
            data: departments.map((dept) => (0, class_transformer_1.plainToClass)(department_dto_1.DepartmentResponseDto, dept)),
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }
    async getDepartmentHierarchy(tenantId) {
        const departments = await this.departmentRepository.findHierarchy(tenantId);
        return departments.map(dept => ({
            ...dept,
            headStaff: dept.headStaff ? {
                id: dept.headStaff.id,
                user: dept.headStaff.user
            } : null,
            parent: dept.parent ? {
                id: dept.parent.id,
                name: dept.parent.name,
                code: dept.parent.code
            } : null,
            children: dept.children?.map(child => ({
                id: child.id,
                name: child.name,
                code: child.code,
                staffCount: child._count?.staff || 0
            })),
            _count: dept._count
        }));
    }
    async getStaffCountByDepartment(tenantId) {
        const departmentCounts = await this.departmentRepository.getStaffCounts(tenantId);
        const noDeptCount = await this.staffRepository.countByDepartment(tenantId, null);
        const result = departmentCounts.map(dept => ({
            departmentId: dept.id,
            departmentName: dept.name,
            count: dept._count?.staff || 0,
        }));
        if (noDeptCount > 0) {
            result.push({
                departmentId: null,
                departmentName: 'No Department',
                count: noDeptCount,
            });
        }
        return result;
    }
    async findById(tenantId, id) {
        const department = await this.departmentRepository.findDepartmentWithDetails(tenantId, id);
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID '${id}' not found`);
        }
        return (0, class_transformer_1.plainToClass)(department_dto_1.DepartmentResponseDto, department);
    }
    async findByCode(tenantId, code) {
        const department = await this.departmentRepository.findByCode(tenantId, code);
        return department ? (0, class_transformer_1.plainToClass)(department_dto_1.DepartmentResponseDto, department) : null;
    }
    async update(tenantId, id, updateDepartmentDto) {
        const existing = await this.departmentRepository.findById(tenantId, id);
        if (!existing) {
            throw new common_1.NotFoundException(`Department with ID '${id}' not found`);
        }
        if (updateDepartmentDto.code && updateDepartmentDto.code !== existing.code) {
            const codeExists = await this.departmentRepository.findByCode(tenantId, updateDepartmentDto.code);
            if (codeExists) {
                throw new common_1.ConflictException(`Department with code '${updateDepartmentDto.code}' already exists`);
            }
        }
        if (updateDepartmentDto.parentDepartmentId !== undefined &&
            updateDepartmentDto.parentDepartmentId !== existing.parentDepartmentId) {
            if (updateDepartmentDto.parentDepartmentId === id) {
                throw new common_1.BadRequestException('A department cannot be its own parent');
            }
            if (updateDepartmentDto.parentDepartmentId) {
                const parentExists = await this.departmentRepository.findById(tenantId, updateDepartmentDto.parentDepartmentId);
                if (!parentExists) {
                    throw new common_1.BadRequestException('Parent department not found');
                }
                const isCircular = await this.checkForCircularReference(id, updateDepartmentDto.parentDepartmentId, tenantId);
                if (isCircular) {
                    throw new common_1.BadRequestException('Circular reference detected in department hierarchy');
                }
            }
        }
        const updatedDepartment = await this.departmentRepository.update(tenantId, id, updateDepartmentDto);
        return (0, class_transformer_1.plainToClass)(department_dto_1.DepartmentResponseDto, updatedDepartment);
    }
    async delete(tenantId, id) {
        const department = await this.departmentRepository.findById(tenantId, id, {
            include: {
                _count: {
                    select: { staff: true, children: true },
                },
            },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID '${id}' not found`);
        }
        if (department._count?.staff > 0) {
            throw new common_1.BadRequestException('Cannot delete department with assigned staff members');
        }
        if (department._count?.children > 0) {
            throw new common_1.BadRequestException('Cannot delete department with child departments');
        }
        await this.departmentRepository.delete(tenantId, id);
    }
    async assignDepartmentHead(tenantId, departmentId, staffId) {
        const department = await this.departmentRepository.findById(tenantId, departmentId);
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID '${departmentId}' not found`);
        }
        const staff = await this.staffRepository.findById(tenantId, staffId);
        if (!staff) {
            throw new common_1.NotFoundException(`Staff with ID '${staffId}' not found`);
        }
        await this.departmentRepository.update(tenantId, departmentId, {
            headStaffId: staffId,
        });
        return { success: true };
    }
    async removeDepartmentHead(tenantId, departmentId) {
        const department = await this.departmentRepository.findById(tenantId, departmentId);
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID '${departmentId}' not found`);
        }
        if (!department.headStaffId) {
            throw new common_1.BadRequestException('Department does not have a head assigned');
        }
        await this.departmentRepository.update(tenantId, departmentId, {
            headStaffId: null,
        });
        return { success: true };
    }
    async getDepartmentStaff(tenantId, departmentId, includeSubDepartments = false) {
        const department = await this.departmentRepository.findById(tenantId, departmentId);
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID '${departmentId}' not found`);
        }
        let departmentIds = [departmentId];
        if (includeSubDepartments) {
            const subDepartments = await this.getSubDepartmentsRecursive(tenantId, departmentId);
            departmentIds = [...departmentIds, ...subDepartments];
        }
        const staff = await this.staffRepository.findByDepartmentIds(tenantId, departmentIds, {
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        isActive: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
                staffRoles: {
                    include: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
                staffSpecialties: {
                    include: {
                        specialty: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
            },
            orderBy: [
                {
                    user: {
                        lastName: 'asc',
                    },
                },
                {
                    user: {
                        firstName: 'asc',
                    },
                },
            ],
        });
        return staff.map((s) => ({
            id: s.id,
            userId: s.user.id,
            employeeId: s.employeeId,
            title: s.title,
            hireDate: s.hireDate,
            isActive: s.isActive,
            user: s.user,
            department: s.department,
            roles: s.staffRoles?.map((r) => r.role) || [],
            specialties: s.staffSpecialties?.map((s) => s.specialty) || [],
        }));
    }
    async getSubDepartmentsRecursive(tenantId, parentId) {
        const children = await this.departmentRepository.findByParentId(tenantId, parentId);
        let result = [];
        for (const child of children) {
            result.push(child.id);
            const grandChildren = await this.getSubDepartmentsRecursive(tenantId, child.id);
            result = [...result, ...grandChildren];
        }
        return result;
    }
    async checkForCircularReference(departmentId, newParentId, tenantId) {
        let currentId = newParentId;
        const visited = new Set([departmentId]);
        while (currentId) {
            if (visited.has(currentId)) {
                return true;
            }
            visited.add(currentId);
            const parent = await this.departmentRepository.findById(tenantId, currentId, {
                select: { parentDepartmentId: true },
            });
            currentId = parent?.parentDepartmentId || '';
        }
        return false;
    }
    getDepartmentIncludes() {
        return {};
    }
    mapToDto(department) {
        return (0, class_transformer_1.plainToClass)(department_dto_1.DepartmentResponseDto, {
            id: department.id,
            tenantId: department.tenantId,
            name: department.name,
            code: department.code,
            description: department.description,
            category: department.category,
            isActive: department.isActive,
            parentDepartmentId: department.parentDepartmentId,
            headStaffId: department.headStaffId,
            headStaff: department.headStaff,
            parent: department.parent,
            children: department.children,
            staffCount: department._count?.staff,
            childrenCount: department._count?.children,
            createdAt: department.createdAt,
            updatedAt: department.updatedAt,
            deletedAt: department.deletedAt,
        });
    }
};
exports.DepartmentService = DepartmentService;
exports.DepartmentService = DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => staff_service_1.StaffService))),
    __metadata("design:paramtypes", [department_repository_1.DepartmentRepository,
        staff_repository_1.StaffRepository,
        staff_service_1.StaffService])
], DepartmentService);
//# sourceMappingURL=department.service.js.map