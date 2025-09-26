export declare class CreateRoleDto {
    name: string;
    description?: string;
    isSystem?: boolean;
    isActive?: boolean;
    permissions?: string[];
}
export declare class UpdateRoleDto {
    name?: string;
    description?: string;
    isActive?: boolean;
    permissions?: string[];
}
export declare class AssignRoleDto {
    staffId: string;
    roleId: string;
    isPrimary?: boolean;
}
export declare class RoleResponseDto {
    id: string;
    tenantId: string;
    name: string;
    description?: string;
    isSystem: boolean;
    isActive: boolean;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class RoleWithPermissionsDto extends RoleResponseDto {
    permissionDetails: Array<{
        id: string;
        key: string;
        name: string;
        description?: string;
        module: string;
        isActive: boolean;
    }>;
}
