import { DepartmentService } from '../services/department.service';
import { DepartmentResponseDto, CreateDepartmentDto, UpdateDepartmentDto, DepartmentFilterDto } from '../dto';
import { IUser } from '../../user/interfaces';
import { PaginatedResponse } from '../../common/interfaces';
export declare class DepartmentController {
    private readonly departmentService;
    constructor(departmentService: DepartmentService);
    create(user: IUser, createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto>;
    findAll(user: IUser, filterDto: DepartmentFilterDto): Promise<PaginatedResponse<DepartmentResponseDto>>;
    getHierarchy(user: IUser): Promise<DepartmentResponseDto[]>;
    countByDepartment(user: IUser): Promise<Array<{
        departmentId: string;
        departmentName: string;
        count: number;
    }>>;
    findOne(user: IUser, id: string): Promise<DepartmentResponseDto>;
    findByCode(user: IUser, code: string): Promise<DepartmentResponseDto>;
    update(user: IUser, id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentResponseDto>;
    remove(user: IUser, id: string): Promise<void>;
    assignDepartmentHead(user: IUser, id: string, staffId: string): Promise<{
        success: boolean;
    }>;
    removeDepartmentHead(user: IUser, id: string): Promise<{
        success: boolean;
    }>;
    getDepartmentStaff(user: IUser, id: string, includeSubDepartments?: boolean): Promise<any>;
}
