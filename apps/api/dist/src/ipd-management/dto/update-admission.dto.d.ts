import { CreateAdmissionDto } from './create-admission.dto';
import { AdmissionStatus } from '../enums';
declare const UpdateAdmissionDto_base: import("@nestjs/common").Type<Partial<CreateAdmissionDto>>;
export declare class UpdateAdmissionDto extends UpdateAdmissionDto_base {
    status?: AdmissionStatus;
    dischargeDate?: Date;
    dischargeNotes?: string;
    dischargedById?: string;
    updatedDiagnosis?: string;
    icdCodes?: string[];
    isTransferred?: boolean;
    transferDetails?: Record<string, any>;
    insuranceAuthorization?: Record<string, any>;
    followUpDetails?: Record<string, any>;
    actualStayDays?: number;
    patientInstructions?: string;
    updatedConsentForms?: Array<{
        formId: string;
        formName: string;
        signed: boolean;
        signedAt: Date;
        signedById: string;
        notes?: string;
    }>;
    customFields?: Record<string, any>;
}
export {};
