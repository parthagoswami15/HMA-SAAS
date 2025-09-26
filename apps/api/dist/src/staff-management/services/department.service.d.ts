import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentResponseDto } from '../dto/department.dto';
import { DepartmentRepository } from '../repositories/department.repository';
import { StaffRepository } from '../repositories/staff.repository';
import { StaffService } from './staff.service';
export declare class DepartmentService {
    private readonly departmentRepository;
    private readonly staffRepository;
    private readonly staffService;
    constructor(departmentRepository: DepartmentRepository, staffRepository: StaffRepository, staffService: StaffService);
    create(tenantId: string, createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto>;
    findAll(tenantId: string, filterDto: {
        page?: number;
        limit?: number;
        search?: string;
        parentId?: string;
        isActive?: boolean | string;
    }): Promise<{
        data: DepartmentResponseDto[];
        meta: any;
    }>;
    getDepartmentHierarchy(tenantId: string): Promise<Array<{
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
    }>>;
    getStaffCountByDepartment(tenantId: string): Promise<Array<{
        departmentId: string | null;
        departmentName: string;
        count: number;
    }>>;
    findById(tenantId: string, id: string): Promise<DepartmentResponseDto>;
    findByCode(tenantId: string, code: string): Promise<DepartmentResponseDto | null>;
    update(tenantId: string, id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentResponseDto>;
    delete(tenantId: string, id: string): Promise<void>;
    assignDepartmentHead(tenantId: string, departmentId: string, staffId: string): Promise<{
        success: boolean;
    }>;
    removeDepartmentHead(tenantId: string, departmentId: string): Promise<{
        success: boolean;
    }>;
    getDepartmentStaff(tenantId: string, departmentId: string, includeSubDepartments?: boolean): Promise<Array<{
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
    }>>;
    private getSubDepartmentsRecursive;
    private checkForCircularReference;
    private getDepartmentIncludes;
    private mapToDto;
}
