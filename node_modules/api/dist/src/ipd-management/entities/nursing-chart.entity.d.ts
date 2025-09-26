import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
export declare enum VitalSigns {
    TEMPERATURE = "TEMPERATURE",
    PULSE = "PULSE",
    RESPIRATION = "RESPIRATION",
    BLOOD_PRESSURE = "BLOOD_PRESSURE",
    OXYGEN_SATURATION = "OXYGEN_SATURATION",
    PAIN_SCORE = "PAIN_SCORE",
    GLUCOSE_LEVEL = "GLUCOSE_LEVEL",
    GCS = "GCS",
    HEIGHT = "HEIGHT",
    WEIGHT = "WEIGHT",
    BMI = "BMI"
}
export declare class NursingChart {
    id: string;
    patientId: string;
    patient: Patient;
    recordedById: string;
    recordedBy: Staff;
    vitalSign: VitalSigns;
    value: string;
    unit: string;
    notes: string;
    additionalData: any;
    recordedAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
