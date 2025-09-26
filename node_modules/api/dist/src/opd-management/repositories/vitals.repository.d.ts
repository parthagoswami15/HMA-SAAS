import { Repository } from 'typeorm';
import { Vitals } from '../entities/vitals.entity';
export declare class VitalsRepository extends Repository<Vitals> {
    findByPatientId(patientId: string, limit?: number): Promise<Vitals[]>;
    findByVisitId(visitId: string): Promise<Vitals[]>;
    findRecentByPatient(patientId: string, days?: number): Promise<Vitals[]>;
    getVitalsTrends(patientId: string, metric: keyof Vitals, days?: number): Promise<{
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
}
