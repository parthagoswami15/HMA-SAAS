import { ICreateStaff, IUpdateStaff, IStaffWithRelations, IStaffFilterOptions } from '../interfaces/staff.interface';
import { StaffStatus } from '../enums';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';
import { UserService } from '../../user/user.service';
import { RoleService } from './role.service';
import { PrismaService } from '../../prisma/prisma.service';
export declare class StaffService {
    private readonly userService;
    private readonly roleService;
    private readonly prisma;
    private readonly logger;
    constructor(userService: UserService, roleService: RoleService, prisma: PrismaService);
    private handlePrismaError;
    private mapToStaffWithRelations;
    create(tenantId: string, createStaffDto: ICreateStaff): Promise<IStaffWithRelations>;
    update(tenantId: string, id: string, updateStaffDto: IUpdateStaff): Promise<IStaffWithRelations>;
    findById(tenantId: string, id: string): Promise<IStaffWithRelations | null>;
    findAll(tenantId: string, filterOptions?: IStaffFilterOptions, page?: number, limit?: number): Promise<PaginatedResponse<IStaffWithRelations>>;
    remove(tenantId: string, id: string, deletedBy: string): Promise<void>;
    bulkUpdateStatus(tenantId: string, ids: string[], status: StaffStatus, updatedBy: string): Promise<{
        count: number;
    }>;
    staffExists(tenantId: string, staffId: string): Promise<boolean>;
}
