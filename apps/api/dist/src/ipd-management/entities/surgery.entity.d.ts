import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Admission } from './admission.entity';
export declare enum SurgeryStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    POSTPONED = "POSTPONED"
}
export declare enum SurgeryType {
    MAJOR = "MAJOR",
    MINOR = "MINOR",
    INTERVENTIONAL = "INTERVENTIONAL",
    DIAGNOSTIC = "DIAGNOSTIC"
}
export declare class Surgery {
    id: string;
    patientId: string;
    patient: Patient;
    admissionId: string;
    admission: Admission;
    procedureName: string;
    description: string;
    type: SurgeryType;
    status: SurgeryStatus;
    scheduledDate: Date;
    estimatedDuration: number;
    surgeonId: string;
    surgeon: Staff;
    anesthetistId: string;
    anesthetist: Staff;
    assistantSurgeonId: string;
    assistantSurgeon: Staff;
    theaterRoom: string;
    preOpDiagnosis: any;
    postOpDiagnosis: any;
    procedureNotes: string;
    anesthesiaNotes: string;
    complications: string[];
    implants: Array<{
        name: string;
        model: string;
        serialNumber: string;
        manufacturer: string;
        lotNumber: string;
        expiryDate: Date;
    }>;
    consumables: Array<{
        itemId: string;
        name: string;
        quantity: number;
        unit: string;
        batchNumber?: string;
    }>;
    startTime: Date;
    endTime: Date;
    outcome: string;
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
