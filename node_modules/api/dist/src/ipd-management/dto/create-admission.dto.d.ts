import { AdmissionType } from '../enums';
export declare class CreateAdmissionDto {
    patientId: string;
    admittingDoctorId: string;
    bedId: string;
    admissionType: AdmissionType;
    admissionDate: Date;
    diagnosis: string;
    icdCode?: string;
    notes?: string;
    details?: Record<string, any>;
    estimatedStayDays?: number;
    isEmergency?: boolean;
    insuranceInfo?: Record<string, any>;
    emergencyContacts?: Array<{
        name: string;
        relationship: string;
        phone: string;
        email?: string;
        address?: string;
        isPrimary?: boolean;
    }>;
    consentForms?: Array<{
        formId: string;
        formName: string;
        signed: boolean;
        signedAt: Date;
        signedById: string;
        notes?: string;
    }>;
    initialAssessment?: Record<string, any>;
    customFields?: Record<string, any>;
}
