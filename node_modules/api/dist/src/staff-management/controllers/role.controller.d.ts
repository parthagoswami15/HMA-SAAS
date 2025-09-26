import { RoleService } from '../services/role.service';
import { RoleResponseDto, CreateRoleDto, UpdateRoleDto, RoleFilterDto, AssignRoleDto, PermissionResponseDto } from '../dto';
import { IUser } from '../../user/interfaces';
import { PaginatedResponse } from '../../common/interfaces';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    create(user: IUser, createRoleDto: CreateRoleDto): Promise<RoleResponseDto>;
    findAll(user: IUser, filterDto: RoleFilterDto): Promise<PaginatedResponse<RoleResponseDto>>;
    getPermissions(): Promise<PermissionResponseDto[]>;
    findOne(user: IUser, id: string): Promise<RoleResponseDto>;
    update(user: IUser, id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto>;
    remove(user: IUser, id: string): Promise<void>;
    assignRoles(user: IUser, assignRoleDto: AssignRoleDto): Promise<{
        success: boolean;
    }>;
    getUserRoles(user: IUser, userId: string): Promise<RoleResponseDto[]>;
    getMyPermissions(user: IUser): Promise<string[]>;
    checkPermission(user: IUser, permission: string): Promise<{
        hasPermission: boolean;
    }>;
}
