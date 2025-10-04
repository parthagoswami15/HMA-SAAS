import { Inject, Injectable, NotFoundException, ConflictException, BadRequestException, forwardRef } from '@nestjs/common';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentResponseDto } from '../dto/department.dto';
import { plainToClass } from 'class-transformer';
import { DepartmentRepository } from '../repositories/department.repository';
import { StaffRepository } from '../repositories/staff.repository';
import { StaffService } from './staff.service';
import { Prisma } from '@prisma/client';

interface DepartmentWithRelations extends Prisma.DepartmentGetPayload<{
  include: {
    headStaff: { select: { id: true; user: { select: { firstName: true; lastName: true; email: true } } } };
    parent: { select: { id: true; name: true; code: true } };
    children: { select: { id: true; name: true; code: true; staffCount: true } };
    _count: { select: { staff: boolean; children: boolean } };
  };
}> {}

@Injectable()
export class DepartmentService {
  constructor(
    private readonly departmentRepository: DepartmentRepository,
    private readonly staffRepository: StaffRepository,
    @Inject(forwardRef(() => StaffService))
    private readonly staffService: StaffService,
  ) {}

  async create(tenantId: string, createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    const { code, ...rest } = createDepartmentDto;
    
    // Check if department with the same code already exists
    if (code) {
      const existing = await this.departmentRepository.findByCode(tenantId, code);
      if (existing) {
        throw new ConflictException(`Department with code '${code}' already exists`);
      }
    }

    // Check if parent department exists
    if (rest.parentDepartmentId) {
      const parentExists = await this.departmentRepository.findById(tenantId, rest.parentDepartmentId);
      if (!parentExists) {
        throw new BadRequestException('Parent department not found');
      }
    }

    // Create the department
    const department = await this.departmentRepository.create(tenantId, {
      ...rest,
      code,
    });

    return plainToClass(DepartmentResponseDto, department);
  }

  async findAll(
    tenantId: string,
    filterDto: {
      page?: number;
      limit?: number;
      search?: string;
      parentId?: string;
      isActive?: boolean | string;
    },
  ): Promise<{ data: DepartmentResponseDto[]; meta: any }> {
    const { page = 1, limit = 10, search, parentId, isActive } = filterDto;
    const skip = (page - 1) * limit;
    
    const where: Prisma.DepartmentWhereInput = {
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

    const { data: departments, total } = await this.departmentRepository.findManyWithDetails(
      tenantId,
      where,
      { 
        skip, 
        take: limit, 
        orderBy: { name: 'asc' } 
      },
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: departments.map((dept) => plainToClass(DepartmentResponseDto, dept)),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getDepartmentHierarchy(tenantId: string): Promise<Array<{
    id: string;
    name: string;
    code: string | null;
    description: string | null;
    category: string | null;
    isActive: boolean;
    parentDepartmentId: string | null;
    headStaffId: string | null;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    headStaff?: {
      id: string;
      user: {
        firstName: string;
        lastName: string;
        email: string;
      };
    } | null;
    parent?: {
      id: string;
      name: string;
      code: string | null;
    } | null;
    children?: Array<{
      id: string;
      name: string;
      code: string | null;
      staffCount: number;
    }>;
    _count?: {
      staff: number;
      children: number;
    };
  }>> {
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

  async getStaffCountByDepartment(tenantId: string): Promise<Array<{ 
    departmentId: string | null; 
    departmentName: string; 
    count: number 
  }>> {
    // Get staff count by department
    const departmentCounts = await this.departmentRepository.getStaffCounts(tenantId);
    
    // Get count of staff without a department
    const noDeptCount = await this.staffRepository.countByDepartment(tenantId, null);

    // Format the results
    const result = departmentCounts.map(dept => ({
      departmentId: dept.id,
      departmentName: dept.name,
      count: dept._count?.staff || 0,
    }));

    // Add count for staff without department
    if (noDeptCount > 0) {
      result.push({
        departmentId: null,
        departmentName: 'No Department',
        count: noDeptCount,
      });
    }

    return result;
  }

  async findById(tenantId: string, id: string): Promise<DepartmentResponseDto> {
    const department = await this.departmentRepository.findDepartmentWithDetails(tenantId, id);

    if (!department) {
      throw new NotFoundException(`Department with ID '${id}' not found`);
    }

    return plainToClass(DepartmentResponseDto, department);
  }

  async findByCode(tenantId: string, code: string): Promise<DepartmentResponseDto | null> {
    const department = await this.departmentRepository.findByCode(tenantId, code);
    return department ? plainToClass(DepartmentResponseDto, department) : null;
  }

  async update(
    tenantId: string,
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    // Check if department exists
    const existing = await this.departmentRepository.findById(tenantId, id);

    if (!existing) {
      throw new NotFoundException(`Department with ID '${id}' not found`);
    }

    // Check if code is being updated and if it's already in use
    if (updateDepartmentDto.code && updateDepartmentDto.code !== existing.code) {
      const codeExists = await this.departmentRepository.findByCode(tenantId, updateDepartmentDto.code);
      if (codeExists) {
        throw new ConflictException(
          `Department with code '${updateDepartmentDto.code}' already exists`,
        );
      }
    }

    // Check if parent department is being updated
    if (
      updateDepartmentDto.parentDepartmentId !== undefined &&
      updateDepartmentDto.parentDepartmentId !== existing.parentDepartmentId
    ) {
      // Prevent setting a department as its own parent
      if (updateDepartmentDto.parentDepartmentId === id) {
        throw new BadRequestException('A department cannot be its own parent');
      }

      // Check if the parent department exists
      if (updateDepartmentDto.parentDepartmentId) {
        const parentExists = await this.departmentRepository.findById(
          tenantId,
          updateDepartmentDto.parentDepartmentId,
        );

        if (!parentExists) {
          throw new BadRequestException('Parent department not found');
        }

        // Check for circular references
        const isCircular = await this.checkForCircularReference(
          id,
          updateDepartmentDto.parentDepartmentId,
          tenantId,
        );

        if (isCircular) {
          throw new BadRequestException(
            'Circular reference detected in department hierarchy',
          );
        }
      }
    }

    // Update the department
    const updatedDepartment = await this.departmentRepository.update(
      tenantId,
      id,
      updateDepartmentDto,
    );

    return plainToClass(DepartmentResponseDto, updatedDepartment);
  }

  async delete(tenantId: string, id: string): Promise<void> {
    // Check if department exists
    const department = await this.departmentRepository.findById(tenantId, id, {
      include: {
        _count: {
          select: { staff: true, children: true },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID '${id}' not found`);
    }

    // Check if department has staff
    if (department._count?.staff > 0) {
      throw new BadRequestException(
        'Cannot delete department with assigned staff members',
      );
    }

    // Check if department has children
    if (department._count?.children > 0) {
      throw new BadRequestException(
        'Cannot delete department with child departments',
      );
    }

    // Soft delete the department
    await this.departmentRepository.delete(tenantId, id);
  }

  async assignDepartmentHead(
    tenantId: string,
    departmentId: string,
    staffId: string,
  ): Promise<{ success: boolean }> {
    // Check if department exists
    const department = await this.departmentRepository.findById(tenantId, departmentId);
    if (!department) {
      throw new NotFoundException(`Department with ID '${departmentId}' not found`);
    }

    // Check if staff exists and belongs to the same tenant
    const staff = await this.staffRepository.findById(tenantId, staffId);
    if (!staff) {
      throw new NotFoundException(`Staff with ID '${staffId}' not found`);
    }

    // Update department with new head
    await this.departmentRepository.update(tenantId, departmentId, {
      headStaffId: staffId,
    });

    return { success: true };
  }

  async removeDepartmentHead(tenantId: string, departmentId: string): Promise<{ success: boolean }> {
    // Check if department exists
    const department = await this.departmentRepository.findById(tenantId, departmentId);
    if (!department) {
      throw new NotFoundException(`Department with ID '${departmentId}' not found`);
    }

    // Check if department has a head
    if (!department.headStaffId) {
      throw new BadRequestException('Department does not have a head assigned');
    }

    // Remove department head
    await this.departmentRepository.update(tenantId, departmentId, {
      headStaffId: null,
    });

    return { success: true };
  }

  async getDepartmentStaff(
    tenantId: string,
    departmentId: string,
    includeSubDepartments: boolean = false,
  ): Promise<Array<{
    id: string;
    userId: string;
    employeeId: string | null;
    title: string | null;
    hireDate: Date | null;
    isActive: boolean;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string | null;
      isActive: boolean;
    };
    department: {
      id: string;
      name: string;
      code: string | null;
    } | null;
    roles: Array<{
      id: string;
      name: string;
      code: string;
    }>;
    specialties: Array<{
      id: string;
      name: string;
      code: string;
    }>;
  }>> {
    // Check if department exists
    const department = await this.departmentRepository.findById(tenantId, departmentId);
    if (!department) {
      throw new NotFoundException(`Department with ID '${departmentId}' not found`);
    }

    // Get department IDs to query
    let departmentIds = [departmentId];

    if (includeSubDepartments) {
      const subDepartments = await this.getSubDepartmentsRecursive(tenantId, departmentId);
      departmentIds = [...departmentIds, ...subDepartments];
    }

    // Get staff members with their details
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

  private async getSubDepartmentsRecursive(tenantId: string, parentId: string): Promise<string[]> {
    const children = await this.departmentRepository.findByParentId(tenantId, parentId);
    let result: string[] = [];

    for (const child of children) {
      result.push(child.id);
      const grandChildren = await this.getSubDepartmentsRecursive(tenantId, child.id);
      result = [...result, ...grandChildren];
    }

    return result;
  }

  private async checkForCircularReference(
    departmentId: string,
    newParentId: string,
    tenantId: string,
  ): Promise<boolean> {
    let currentId = newParentId;
    const visited = new Set<string>([departmentId]);

    while (currentId) {
      if (visited.has(currentId)) {
        return true; // Circular reference detected
      }

      visited.add(currentId);
      const parent = await this.departmentRepository.findById(tenantId, currentId, {
        select: { parentDepartmentId: true },
      });

      currentId = parent?.parentDepartmentId || '';
    }

    return false; // No circular reference
  }

  /**
   * This method is no longer needed as we're using the repository pattern
   * and the includes are now defined in the repository layer.
   * Keeping it as a placeholder in case it's referenced elsewhere.
   * @deprecated Use repository methods with built-in includes instead
   */
  private getDepartmentIncludes(): {} {
    return {};
  }

  /**
   * Maps a department entity to a DTO
   * @param department The department entity to map
   * @returns The mapped DepartmentResponseDto
   */
  private mapToDto(department: DepartmentWithRelations): DepartmentResponseDto {
    return plainToClass(DepartmentResponseDto, {
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
}
