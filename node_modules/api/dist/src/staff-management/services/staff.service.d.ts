import { ICreateStaff, IUpdateStaff, IStaffWithRelations } from '../interfaces/staff.interface';
import { StaffStatus } from '../enums';
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
    bulkUpdateStatus(tenantId: string, ids: string[], status: StaffStatus): Promise<{
        count: number;
    }>;
}
