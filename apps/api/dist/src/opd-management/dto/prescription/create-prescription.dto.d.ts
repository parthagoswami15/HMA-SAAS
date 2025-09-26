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
export declare enum PrescriptionItemType {
    MEDICATION = "MEDICATION",
    LAB_TEST = "LAB_TEST",
    IMAGING = "IMAGING",
    PROCEDURE = "PROCEDURE",
    DIET = "DIET",
    OTHER = "OTHER"
}
declare class DosageInstructionDto {
    dose: number;
    unit: string;
    frequency: FrequencyUnit;
    frequencyCount: number;
    route: string;
    timing?: string;
    instructions?: string;
}
export declare class PrescriptionItemDto {
    itemId: string;
    itemName: string;
    itemType: PrescriptionItemType;
    dosage: DosageInstructionDto;
    durationValue: number;
    durationUnit: DurationUnit;
    quantity?: number;
    quantityUnit?: string;
    startDate?: Date;
    notes?: string;
    allowGeneric?: boolean;
    isRefill?: boolean;
    refillsAllowed?: number;
}
export declare class CreatePrescriptionDto {
    visitId: string;
    providerId: string;
    items: PrescriptionItemDto[];
    notes?: string;
    datePrescribed?: Date;
}
export {};
