import { DiagnosisStatus, DiagnosisType } from '../../entities/diagnosis.entity';
export declare class CreateDiagnosisDto {
    icd10Code: string;
    type?: DiagnosisType;
    isPrimary?: boolean;
    onsetDate?: string;
    status?: DiagnosisStatus;
    notes?: string;
    metadata?: Record<string, any>;
}
export declare class CreatePatientDiagnosisDto extends CreateDiagnosisDto {
    patientId: string;
    encounterId?: string;
}
export declare class CreateEncounterDiagnosisDto extends CreateDiagnosisDto {
    encounterId: string;
}
