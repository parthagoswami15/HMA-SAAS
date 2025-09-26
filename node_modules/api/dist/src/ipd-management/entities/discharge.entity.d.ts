import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Admission } from './admission.entity';
export declare enum DischargeStatus {
    INITIATED = "INITIATED",
    BILLING_PENDING = "BILLING_PENDING",
    BILLING_COMPLETED = "BILLING_COMPLETED",
    MEDICATION_PENDING = "MEDICATION_PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum DischargeType {
    ROUTINE = "ROUTINE",
    REFERRAL = "REFERRAL",
    LAMA = "LAMA",
    DAMA = "DAMA",
    ABSCONDED = "ABSCONDED",
    DECEASED = "DECEASED"
}
export declare class Discharge {
    id: string;
    admissionId: string;
    admission: Admission;
    patientId: string;
    patient: Patient;
    dischargedById: string;
    dischargedBy: Staff;
    dischargeType: DischargeType;
    status: DischargeStatus;
    dischargeDate: Date;
    actualDischargeDate: Date;
    diagnosisAtDischarge: string;
    proceduresPerformed: string;
    hospitalCourse: string;
    conditionAtDischarge: string;
    followUpPlan: string;
    patientEducation: string;
    dischargeMedications: Array<{
        medicationId: string;
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions: string;
    }>;
    followUpAppointments: Array<{
        date: Date;
        department: string;
        doctorId: string;
        notes: string;
    }>;
    isBillSettled: boolean;
    totalBillAmount: number;
    amountPaid: number;
    pendingAmount: number;
    billingNotes: string;
    cancellationReason: string;
    cancelledById: string;
    cancelledBy: Staff;
    cancelledAt: Date;
    isDeathCase: boolean;
    deathDetails: {
        timeOfDeath: Date;
        causeOfDeath: string;
        deathCertificateNumber: string;
        reportedBy: string;
        reportedById: string;
        notes: string;
    };
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
