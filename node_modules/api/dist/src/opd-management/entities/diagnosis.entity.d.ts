import { Icd10Code } from './icd10-code.entity';
import { Encounter } from './encounter.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Staff } from '../../staff-management/entities/staff.entity';
export declare enum DiagnosisStatus {
    ACTIVE = "active",
    RESOLVED = "resolved",
    RULED_OUT = "ruled_out",
    CHRONIC = "chronic",
    RECURRED = "recurred"
}
export declare enum DiagnosisType {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    ADMISSION = "admission",
    DISCHARGE = "discharge",
    CHRONIC = "chronic",
    PROCEDURAL = "procedural"
}
export declare class Diagnosis {
    id: string;
    patientId: string;
    icd10Code: string;
    encounterId: string | null;
    recordedById: string | null;
    status: DiagnosisStatus;
    type: DiagnosisType;
    isPrimary: boolean;
    onsetDate: Date | null;
    resolvedDate: Date | null;
    notes: string | null;
    metadata: Record<string, any> | null;
    createdAt: Date;
    updatedAt: Date;
    updatedById: string | null;
    icd10: Icd10Code;
    patient: Patient;
    encounter: Encounter | null;
    recordedBy: Staff | null;
    updatedBy: Staff | null;
    isActive(): boolean;
    resolve(resolvedDate?: Date): void;
    reactivate(): void;
}
