export declare enum PrescriptionStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
export declare enum PrescriptionType {
    MEDICATION = "MEDICATION",
    LAB_TEST = "LAB_TEST",
    IMAGING = "IMAGING",
    PROCEDURE = "PROCEDURE",
    DIET = "DIET",
    OTHER = "OTHER"
}
export declare enum FrequencyUnit {
    HOUR = "HOUR",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    AS_NEEDED = "AS_NEEDED"
}
export declare enum DurationUnit {
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    YEAR = "YEAR",
    INDEFINITE = "INDEFINITE"
}
export declare class DosageInstruction {
    dose: number;
    unit: string;
    frequency: FrequencyUnit;
    frequencyCount: number;
    n: any;
    route: string;
    timing?: string;
    instructions?: string;
}
export declare class PrescriptionItem {
    id: string;
    itemId: string;
    itemName: string;
    itemType: PrescriptionType;
    status: PrescriptionStatus;
    dosage: DosageInstruction;
    durationValue: number;
    durationUnit: DurationUnit;
    quantity?: number;
    quantityUnit?: string;
    datePrescribed: Date;
    startDate?: Date;
    endDate?: Date;
    notes?: string;
    allowGeneric: boolean;
    isRefill: boolean;
    refillsAllowed: number;
    refillsUsed: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Prescription {
    id: string;
    visitId: string;
    patientId: string;
    providerId: string;
    facilityId: string;
    items: PrescriptionItem[];
    status: PrescriptionStatus;
    datePrescribed: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
