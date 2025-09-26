import { StaffType, StaffStatus } from '../enums';
declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}
export declare class CreateStaffDto {
    employeeId: string;
    type: StaffType;
    status?: StaffStatus;
    joiningDate: Date;
    departmentId?: string;
    designation: string;
    qualifications?: string[];
    bio?: string;
    isActive?: boolean;
    user: CreateUserDto;
    roleIds?: string[];
    specialties?: StaffSpecialtyDto[];
}
export declare class StaffSpecialtyDto {
    specialtyId: string;
    isPrimary?: boolean;
    experience?: number;
    notes?: string;
}
export {};
