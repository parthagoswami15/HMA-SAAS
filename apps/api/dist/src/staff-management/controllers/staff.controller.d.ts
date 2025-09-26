import { StaffService } from '../services/staff.service';
import { StaffResponseDto, CreateStaffDto, UpdateStaffDto, StaffFilterDto, RecentStaffResponseDto } from '../dto';
import { IUser } from '../../user/interfaces';
import { PaginatedResponse } from '../../common/interfaces';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(user: IUser, createStaffDto: CreateStaffDto): Promise<StaffResponseDto>;
    findAll(user: IUser, filterDto: StaffFilterDto): Promise<PaginatedResponse<StaffResponseDto>>;
    findRecent(user: IUser, limit?: number): Promise<RecentStaffResponseDto[]>;
    countByType(user: IUser): Promise<{
        type: string;
        count: number;
    }[]>;
    countByDepartment(user: IUser): Promise<{
        departmentId: string | null;
        departmentName: string;
        count: number;
    }[]>;
    getMyProfile(user: IUser): Promise<StaffResponseDto>;
    findOne(user: IUser, id: string): Promise<StaffResponseDto>;
    update(user: IUser, id: string, updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto>;
    remove(user: IUser, id: string): Promise<void>;
    bulkUpdateStatus(user: IUser, ids: string[], status: string): Promise<{
        count: number;
    }>;
    checkEmployeeIdAvailable(user: IUser, employeeId: string): Promise<{
        available: boolean;
    }>;
}
