import { StaffType, StaffStatus } from '../enums';
export declare class BaseDto {
    id: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export declare class BaseStaffDto {
    employeeId: string;
    type: StaffType;
    status: StaffStatus;
    departmentId?: string;
    designation: string;
    joiningDate: Date;
    qualifications: string[];
    bio?: string;
    isActive?: boolean;
}
export declare class BaseUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}
export declare class BaseRoleDto {
    name: string;
    description?: string;
    isSystem?: boolean;
    isActive?: boolean;
}
export declare class BaseSpecialtyDto {
    name: string;
    code?: string;
    description?: string;
    category?: string;
    isActive?: boolean;
    colorCode?: string;
    icon?: string;
    displayOrder?: number;
    requiresCertification?: boolean;
    minYearsExperience?: number;
}
export declare class BaseStaffSpecialtyDto {
    specialtyId: string;
    isPrimary?: boolean;
    experience?: number;
    notes?: string;
    startDate?: Date;
    certificationNumber?: string;
    certificationExpiryDate?: Date;
}
export declare class BasePermissionDto {
    key: string;
    name: string;
    description?: string;
    module: string;
    isActive?: boolean;
}
