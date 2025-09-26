import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { DiagnosisService } from '../services/diagnosis.service';
import { Diagnosis, DiagnosisStatus, DiagnosisType } from '../entities/diagnosis.entity';
import { CreatePatientDiagnosisDto, CreateEncounterDiagnosisDto, UpdateDiagnosisDto, ResolveDiagnosisDto, ReactivateDiagnosisDto } from '../dto/diagnosis';
import { PaginationParams } from '../../common/dto/pagination-params.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class DiagnosisController {
    private readonly diagnosisService;
    constructor(diagnosisService: DiagnosisService);
    createPatientDiagnosis(createDiagnosisDto: CreatePatientDiagnosisDto, req: RequestWithUser): Promise<Diagnosis>;
    createEncounterDiagnosis(createDiagnosisDto: CreateEncounterDiagnosisDto, req: RequestWithUser): Promise<Diagnosis>;
    getPatientDiagnoses(patientId: string, status?: DiagnosisStatus | DiagnosisStatus[], type?: DiagnosisType, isPrimary?: boolean, fromDate?: Date, toDate?: Date, searchTerm?: string, pagination?: PaginationParams): Promise<PaginatedResult<Diagnosis>>;
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
    getDiagnosis(id: string): Promise<Diagnosis>;
    updateDiagnosis(id: string, updateDiagnosisDto: UpdateDiagnosisDto, req: RequestWithUser): Promise<Diagnosis>;
    resolveDiagnosis(id: string, resolveDto: ResolveDiagnosisDto, req: RequestWithUser): Promise<Diagnosis>;
    reactivateDiagnosis(id: string, reactivateDto: ReactivateDiagnosisDto, req: RequestWithUser): Promise<Diagnosis>;
    deleteDiagnosis(id: string): Promise<void>;
    getCommonDiagnoses(limit?: number): Promise<{
        icd10Code: import("../entities/icd10-code.entity").Icd10Code;
        count: number;
    }[]>;
}
