export declare class CreateDepartmentDto {
    name: string;
    code?: string;
    description?: string;
    headStaffId?: string;
    parentDepartmentId?: string;
    isActive?: boolean;
    colorCode?: string;
    contactEmail?: string;
    contactPhone?: string;
    location?: string;
}
export declare class UpdateDepartmentDto {
    name?: string;
    code?: string;
    description?: string;
    headStaffId?: string | null;
    parentDepartmentId?: string | null;
    isActive?: boolean;
    colorCode?: string;
    contactEmail?: string;
    contactPhone?: string;
    location?: string;
}
export declare class DepartmentQueryDto {
    search?: string;
    isActive?: boolean;
    parentDepartmentId?: string;
    includeChildren?: boolean;
    includeStaffCount?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'code' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export declare class DepartmentResponseDto {
    id: string;
    tenantId: string;
    name: string;
    code?: string;
    description?: string;
    headStaffId?: string | null;
    headStaffName?: string | null;
    parentDepartmentId?: string | null;
    parentDepartmentName?: string | null;
    isActive: boolean;
    colorCode?: string;
    contactEmail?: string;
    contactPhone?: string;
    location?: string;
    staffCount?: number;
    children?: DepartmentResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
