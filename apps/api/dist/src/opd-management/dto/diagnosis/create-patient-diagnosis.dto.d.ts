import { DiagnosisStatus, DiagnosisType } from '../../entities/diagnosis.entity';
export declare class CreatePatientDiagnosisDto {
    patientId: string;
    icd10Code: string;
    encounterId?: string;
    status?: DiagnosisStatus;
    type?: DiagnosisType;
    isPrimary?: boolean;
    isChronic?: boolean;
    isExternalCause?: boolean;
    diagnosisDate?: string;
    onsetDate?: string;
    abatementDate?: string;
    notes?: string;
    severity?: string;
    bodySite?: string;
    laterality?: string;
    verificationStatus?: string;
    clinicalStatus?: string;
    metadata?: Record<string, any>;
}
