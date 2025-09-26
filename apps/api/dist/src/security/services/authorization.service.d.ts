import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthorizationService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getUserPermissions(user: any): Promise<{
        userId: any;
        permissions: {
            id: any;
            name: any;
            resource: any;
            action: any;
            conditions: any;
        }[];
    }>;
    getUserRoles(user: any): Promise<{
        userId: any;
        roles: any;
    }>;
    checkPermission(permissionDto: any, user: any): Promise<{
        userId: any;
        permission: any;
        resource: any;
        granted: boolean;
        conditions: any;
    }>;
    grantPermission(userId: string, permissionDto: any, grantedBy: any): Promise<any>;
    revokePermission(userId: string, permissionId: string, revokedBy: any): Promise<{
        success: boolean;
    }>;
    assignRole(userId: string, roleId: string, assignedBy: any): Promise<any>;
    revokeRole(userId: string, roleId: string, revokedBy: any): Promise<{
        success: boolean;
    }>;
    createRole(roleDto: any, createdBy: any): Promise<any>;
    updateRole(roleId: string, roleDto: any, updatedBy: any): Promise<any>;
    deleteRole(roleId: string, deletedBy: any): Promise<{
        success: boolean;
    }>;
    getAllRoles(): Promise<any>;
    getRolePermissions(roleId: string): Promise<any>;
    updateRolePermissions(roleId: string, permissionIds: string[], updatedBy: any): Promise<any[]>;
    checkResourceAccess(user: any, resource: string, action: string, resourceId?: string): Promise<{
        granted: boolean;
        resource: string;
        action: string;
        resourceId: string | undefined;
    }>;
    private checkResourceOwnership;
    getPermissionHierarchy(): Promise<any>;
}
