import { Repository } from 'typeorm';
import { Diagnosis, DiagnosisStatus, DiagnosisType } from '../entities/diagnosis.entity';
import { Icd10Code } from '../entities/icd10-code.entity';
import { PaginationParams } from '../../common/dto/pagination-params.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class DiagnosisRepository extends Repository<Diagnosis> {
    findPatientDiagnoses(patientId: string, { page, limit }?: PaginationParams, filters?: {
        status?: DiagnosisStatus | DiagnosisStatus[];
        type?: DiagnosisType;
        isPrimary?: boolean;
        fromDate?: Date;
        toDate?: Date;
        searchTerm?: string;
    }): Promise<PaginatedResult<Diagnosis>>;
    findEncounterDiagnoses(encounterId: string): Promise<Diagnosis[]>;
    findActiveDiagnoses(patientId: string): Promise<Diagnosis[]>;
    findChronicConditions(patientId: string): Promise<Diagnosis[]>;
    resolveDiagnosis(id: string, resolvedDate?: Date): Promise<Diagnosis | undefined>;
    reactivateDiagnosis(id: string): Promise<Diagnosis | undefined>;
    getDiagnosisStats(patientId: string): Promise<{
        total: number;
        active: number;
        chronic: number;
        resolved: number;
        byCategory: Array<{
            category: string;
            count: number;
        }>;
    }>;
    getCommonDiagnoses(limit?: number): Promise<Array<{
        icd10Code: Icd10Code;
        count: number;
    }>>;
    getDiagnosisTimeline(patientId: string): Promise<Array<{
        date: Date;
        diagnoses: Diagnosis[];
    }>>;
}
