import { Permission } from '@prisma/client';
export interface IRole {
    id: string;
    tenantId: string;
    name: string;
    description?: string;
    isSystem: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface ICreateRole {
    name: string;
    description?: string;
    isSystem?: boolean;
    isActive?: boolean;
    permissionKeys?: string[];
}
export interface IUpdateRole {
    name?: string;
    description?: string;
    isActive?: boolean;
    permissionKeys?: string[];
}
export interface IRoleWithPermissions extends IRole {
    permissions: Permission[];
}
export interface IRoleFilterOptions {
    search?: string;
    isSystem?: boolean;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
