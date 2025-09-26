import { StaffType, StaffStatus } from '../enums';
export declare class CreateStaffUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password?: string;
    sendWelcomeEmail?: boolean;
}
export declare class CreateStaffDto {
    employeeId: string;
    type: StaffType;
    status?: StaffStatus;
    departmentId?: string;
    designation: string;
    joiningDate: Date;
    qualifications: string[];
    bio?: string;
    isActive?: boolean;
    user: CreateStaffUserDto;
    roleIds?: string[];
    specialties?: CreateStaffSpecialtyDto[];
}
export declare class UpdateStaffDto {
    employeeId?: string;
    type?: StaffType;
    status?: StaffStatus;
    departmentId?: string | null;
    designation?: string;
    joiningDate?: Date;
    qualifications?: string[];
    bio?: string | null;
    isActive?: boolean;
    roleIds?: string[];
    specialties?: UpdateStaffSpecialtyDto[];
}
export declare class StaffFilterDto {
    search?: string;
    type?: StaffType;
    status?: StaffStatus;
    departmentId?: string;
    specialtyId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class UserResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    isActive: boolean;
}
export declare class DepartmentResponseDto {
    id: string;
    name: string;
    code?: string;
}
export declare class RoleResponseDto {
    id: string;
    name: string;
    isSystem: boolean;
}
export declare class SpecialtyResponseDto {
    id: string;
    name: string;
    code?: string;
}
export declare class StaffSpecialtyResponseDto {
    id: string;
    isPrimary: boolean;
    experience?: number;
    notes?: string;
    startDate?: Date;
    certificationNumber?: string;
    certificationExpiryDate?: Date;
    specialty: SpecialtyResponseDto;
}
export declare class StaffResponseDto {
    id: string;
    tenantId: string;
    employeeId: string;
    type: StaffType;
    status: StaffStatus;
    department?: DepartmentResponseDto;
    designation: string;
    joiningDate: Date;
    qualifications: string[];
    bio?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: UserResponseDto;
    roles: RoleResponseDto[];
    specialties: StaffSpecialtyResponseDto[];
}
export declare class StaffListResponseDto {
    data: StaffResponseDto[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export declare class RecentStaffResponseDto {
    id: string;
    employeeId: string;
    designation: string;
    joiningDate: Date;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    };
    department?: {
        id: string;
        name: string;
        code?: string;
    };
}
export declare class StaffCountResponseDto {
    key: string;
    label: string;
    count: number;
    percentage?: number;
}
export declare class CreateStaffSpecialtyDto {
    specialtyId: string;
    isPrimary?: boolean;
    experience?: number;
    notes?: string;
    startDate?: Date;
    certificationNumber?: string;
    certificationExpiryDate?: Date;
}
export declare class UpdateStaffSpecialtyDto {
    isPrimary?: boolean;
    experience?: number;
    notes?: string;
    startDate?: Date;
    certificationNumber?: string;
    certificationExpiryDate?: Date;
    remove?: boolean;
}
