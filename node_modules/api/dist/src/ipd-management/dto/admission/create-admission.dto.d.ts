import { AdmissionType } from '../../enums/admission-type.enum';
export declare class CreateAdmissionDto {
    patientId: string;
    admittingDoctorId: string;
    bedId: string;
    admissionType: AdmissionType;
    admissionDate: Date;
    diagnosis?: string;
    admissionNotes?: string;
    insuranceInfo?: Record<string, any>;
    documents?: AdmissionDocumentDto[];
}
export declare class AdmissionDocumentDto {
    type: string;
    url: string;
    notes?: string;
}
