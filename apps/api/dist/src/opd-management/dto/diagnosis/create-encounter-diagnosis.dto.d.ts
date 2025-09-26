import { DiagnosisStatus, DiagnosisType } from '../../entities/diagnosis.entity';
export declare class CreateEncounterDiagnosisDto {
    encounterId: string;
    icd10Code: string;
    status?: DiagnosisStatus;
    type?: DiagnosisType;
    isPrimary?: boolean;
    isChronic?: boolean;
    isExternalCause?: boolean;
    diagnosisDate?: string;
    onsetDate?: string;
    notes?: string;
    severity?: string;
    bodySite?: string;
    metadata?: Record<string, any>;
}
