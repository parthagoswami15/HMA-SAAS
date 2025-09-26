import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Admission } from './admission.entity';
export declare enum MedicationStatus {
    PENDING = "PENDING",
    ADMINISTERED = "ADMINISTERED",
    REFUSED = "REFUSED",
    MISSED = "MISSED",
    HOLD = "HOLD",
    CANCELLED = "CANCELLED"
}
export declare class MedicationAdministration {
    id: string;
    patientId: string;
    patient: Patient;
    admissionId: string;
    admission: Admission;
    medicationOrderId: string;
    medicationName: string;
    dosage: string;
    route: string;
    frequency: string;
    scheduledTime: Date;
    status: MedicationStatus;
    administeredAt: Date;
    administeredById: string;
    administeredBy: Staff;
    notes: string;
    vitalSigns: {
        bloodPressure?: string;
        pulse?: number;
        temperature?: number;
        respiration?: number;
    };
    isPRN: boolean;
    prnReason: string;
    isStat: boolean;
    createdAt: Date;
    updatedAt: Date;
    auditLog: Array<{
        timestamp: Date;
        action: string;
        performedById: string;
        performedBy: string;
        changes: Record<string, any>;
    }>;
}
