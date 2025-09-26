import { Vitals } from '../entities/vitals.entity';
import { VitalsRepository } from '../repositories/vitals.repository';
import { CreateVitalsDto } from '../dto/vitals/create-vitals.dto';
import { UpdateVitalsDto } from '../dto/vitals/update-vitals.dto';
import { PatientService } from '../../patient/patient.service';
import { VisitService } from './visit.service';
export declare class VitalsService {
    private readonly vitalsRepository;
    private readonly patientService;
    private readonly visitService;
    constructor(vitalsRepository: VitalsRepository, patientService: PatientService, visitService: VisitService);
    create(createVitalsDto: CreateVitalsDto, recordedById: string): Promise<Vitals>;
    findAll(filters?: {
        patientId?: string;
        visitId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Vitals[]>;
    findOne(id: string): Promise<Vitals>;
    update(id: string, updateVitalsDto: UpdateVitalsDto): Promise<Vitals>;
    remove(id: string): Promise<void>;
    getPatientVitalsTrends(patientId: string, metric: keyof Vitals, days?: number): Promise<{
        date: Date;
        value: any;
    }[]>;
    getAbnormalVitals(thresholds: {
        temperature?: {
            min: number;
            max: number;
        };
        heartRate?: {
            min: number;
            max: number;
        };
        bloodPressure?: {
            minSys: number;
            maxSys: number;
            minDia: number;
            maxDia: number;
        };
        oxygenSaturation?: {
            min: number;
        };
    }): Promise<Vitals[]>;
    getLastVitals(patientId: string): Promise<Partial<Vitals> | null>;
    getVitalsByVisit(visitId: string): Promise<Vitals[]>;
    getRecentVitals(patientId: string, limit?: number): Promise<Vitals[]>;
}
