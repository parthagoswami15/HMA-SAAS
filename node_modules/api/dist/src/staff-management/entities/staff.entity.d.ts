import { BaseEntity } from '@app/common/entities/base.entity';
import { Visit } from '@app/opd-management/entities/visit.entity';
export declare enum StaffRole {
    DOCTOR = "DOCTOR",
    NURSE = "NURSE",
    ADMIN = "ADMIN",
    RECEPTIONIST = "RECEPTIONIST",
    PHARMACIST = "PHARMACIST",
    LAB_TECHNICIAN = "LAB_TECHNICIAN",
    ACCOUNTANT = "ACCOUNTANT",
    OTHER = "OTHER"
}
export declare class Staff extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    gender: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    role: StaffRole;
    department: string;
    specialization?: string;
    qualification: string;
    joiningDate: Date;
    salary?: number;
    emergencyContact?: {
        name: string;
        relationship: string;
        phoneNumber: string;
    };
    documents?: Array<{
        type: string;
        url: string;
        name: string;
        uploadedAt: Date;
    }>;
    isAdmin: boolean;
    visits: Visit[];
}
