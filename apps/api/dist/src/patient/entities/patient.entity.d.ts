import { BaseEntity } from '@app/common/entities/base.entity';
import { Visit } from '@app/opd-management/entities/visit.entity';
export declare class Patient extends BaseEntity {
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
    medicalHistory?: Array<{
        condition: string;
        diagnosisDate: Date;
        status: 'ACTIVE' | 'INACTIVE' | 'RESOLVED';
        notes?: string;
    }>;
    allergies?: Array<{
        name: string;
        severity: 'MILD' | 'MODERATE' | 'SEVERE';
        reaction: string;
    }>;
    medications?: Array<{
        name: string;
        dosage: string;
        frequency: string;
        startDate: Date;
        endDate?: Date;
        prescribedBy: string;
        notes?: string;
    }>;
    emergencyContacts?: Array<{
        name: string;
        relationship: string;
        phoneNumber: string;
        email?: string;
        address?: string;
        isPrimary: boolean;
    }>;
    documents?: Array<{
        type: string;
        url: string;
        name: string;
        uploadedAt: Date;
    }>;
    isActive: boolean;
    visits: Visit[];
}
