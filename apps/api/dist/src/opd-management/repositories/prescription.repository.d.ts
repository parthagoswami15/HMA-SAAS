import { Repository } from 'typeorm';
import { Prescription, PrescriptionStatus } from '../entities/prescription.entity';
export declare class PrescriptionRepository extends Repository<Prescription> {
    findByVisitId(visitId: string): Promise<Prescription[]>;
    findByPatientId(patientId: string, status?: PrescriptionStatus): Promise<Prescription[]>;
    findActivePrescriptions(patientId: string): Promise<Prescription[]>;
    findExpiringPrescriptions(days?: number): Promise<Prescription[]>;
    countPrescriptionsByStatus(providerId?: string): Promise<{
        status: string;
        count: number;
    }[]>;
    findPrescriptionsByMedication(medicationName: string): Promise<Prescription[]>;
}
