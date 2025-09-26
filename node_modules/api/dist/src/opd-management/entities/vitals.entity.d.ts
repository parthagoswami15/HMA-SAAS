import { BaseEntity } from '@app/common/entities/base.entity';
import { Visit } from './visit.entity';
import { Patient } from '../../../patient/entities/patient.entity';
import { Staff } from '../../../staff-management/entities/staff.entity';
export declare class Vitals extends BaseEntity {
    visitId: string;
    patientId: string;
    recordedById: string;
    recordedAt: Date;
    temperature: number;
    heartRate: number;
    bloodPressure: string;
    respiratoryRate: number;
    oxygenSaturation: number;
    height: number;
    weight: number;
    bmi: number;
    painScore: number;
    additionalMetrics: Record<string, any>;
    notes: string;
    visit: Visit;
    patient: Patient;
    recordedBy: Staff;
    calculateBMI(): void;
    getBloodPressure(): {
        systolic: null;
        diastolic: null;
    } | {
        systolic: number;
        diastolic: number;
    };
}
