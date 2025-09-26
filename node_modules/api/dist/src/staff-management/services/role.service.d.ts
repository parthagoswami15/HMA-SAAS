import { PrismaService } from '../../prisma/prisma.service';
import { ICreateRole, IUpdateRole, IRoleWithPermissions, IRoleFilterOptions } from '../interfaces/role.interface';
import { PaginatedResponse } from '../../common/interfaces';
export declare class RoleService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, createRoleDto: ICreateRole): Promise<IRoleWithPermissions>;
    findAll(tenantId: string, options?: IRoleFilterOptions): Promise<PaginatedResponse<IRoleWithPermissions>>;
    findById(tenantId: string, id: string): Promise<IRoleWithPermissions>;
    findByName(tenantId: string, name: string): Promise<IRoleWithPermissions | null>;
    update(tenantId: string, id: string, updateRoleDto: IUpdateRole): Promise<IRoleWithPermissions>;
    delete(tenantId: string, id: string): Promise<{
        success: boolean;
    }>;
    assignRolesToUser(tenantId: string, userId: string, roleIds: string[]): Promise<{
        success: boolean;
    }>;
    updateUserRoles(tenantId: string, userId: string, roleIds: string[]): Promise<{
        success: boolean;
    }>;
    getUserPermissions(userId: string): Promise<string[]>;
    hasPermission(userId: string, permissionKey: string): Promise<boolean>;
    validateRolesExist(tenantId: string, roleIds: string[]): Promise<void>;
    private validatePermissionsExist;
    private assignPermissionsToRole;
    private updateRolePermissions;
}
