import { Diagnosis, DiagnosisStatus, DiagnosisType } from '../entities/diagnosis.entity';
import { Icd10Code } from '../entities/icd10-code.entity';
import { CreatePatientDiagnosisDto, CreateEncounterDiagnosisDto, UpdateDiagnosisDto, ResolveDiagnosisDto, ReactivateDiagnosisDto } from '../dto/diagnosis';
import { DiagnosisRepository } from '../repositories/diagnosis.repository';
import { Icd10Service } from './icd10.service';
import { PatientService } from '../../patient/patient.service';
import { StaffService } from '../../staff-management/services/staff.service';
import { EncounterService } from './encounter.service';
export declare class DiagnosisService {
    private readonly diagnosisRepository;
    private readonly icd10Service;
    private readonly patientService;
    private readonly staffService;
    private readonly encounterService;
    constructor(diagnosisRepository: DiagnosisRepository, icd10Service: Icd10Service, patientService: PatientService, staffService: StaffService, encounterService: EncounterService);
    createPatientDiagnosis(createDiagnosisDto: CreatePatientDiagnosisDto, recordedById: string): Promise<Diagnosis>;
    createEncounterDiagnosis(createDiagnosisDto: CreateEncounterDiagnosisDto, recordedById: string): Promise<Diagnosis>;
    updateDiagnosis(id: string, updateDiagnosisDto: UpdateDiagnosisDto, updatedById: string): Promise<Diagnosis>;
    resolveDiagnosis(id: string, resolveDto: ResolveDiagnosisDto, resolvedById: string): Promise<Diagnosis>;
    reactivateDiagnosis(id: string, reactivateDto: ReactivateDiagnosisDto, reactivatedById: string): Promise<Diagnosis>;
    getDiagnosisById(id: string): Promise<Diagnosis>;
    getPatientDiagnoses(patientId: string, filters?: {
        status?: DiagnosisStatus | DiagnosisStatus[];
        type?: DiagnosisType;
        isPrimary?: boolean;
        fromDate?: Date;
        toDate?: Date;
        searchTerm?: string;
    }, pagination?: {
        page: number;
        limit: number;
    }): Promise<PaginatedResult<Diagnosis>>;
    getEncounterDiagnoses(encounterId: string): Promise<Diagnosis[]>;
    getActiveDiagnoses(patientId: string): Promise<Diagnosis[]>;
    getChronicConditions(patientId: string): Promise<Diagnosis[]>;
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
    getDiagnosisTimeline(patientId: string): Promise<{
        date: Date;
        diagnoses: Diagnosis[];
    }[]>;
    private clearPrimaryDiagnosis;
    getCommonDiagnoses(limit?: number): Promise<{
        icd10Code: Icd10Code;
        count: number;
    }[]>;
    deleteDiagnosis(id: string): Promise<void>;
}
