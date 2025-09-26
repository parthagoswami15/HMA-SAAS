export declare enum ResultFlag {
    NORMAL = "NORMAL",
    LOW = "LOW",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL",
    ABNORMAL = "ABNORMAL",
    PENDING = "PENDING",
    INVALID = "INVALID"
}
export declare enum ValidationStatus {
    PENDING = "PENDING",
    TECH_REVIEWED = "TECH_REVIEWED",
    PATH_REVIEWED = "PATH_REVIEWED",
    FINAL = "FINAL",
    AMENDED = "AMENDED"
}
export declare class CreateLabResultDto {
    orderId: string;
    testId: string;
    analyte: string;
    value?: number;
    textValue?: string;
    unit?: string;
    flag?: ResultFlag;
    referenceLow?: number;
    referenceHigh?: number;
    instrument?: string;
    resultDateTime?: Date;
    notes?: string;
    method?: string;
}
export declare class UpdateLabResultDto {
    value?: number;
    textValue?: string;
    unit?: string;
    flag?: ResultFlag;
    referenceLow?: number;
    referenceHigh?: number;
    instrument?: string;
    resultDateTime?: Date;
    notes?: string;
    method?: string;
}
export declare class LabResultResponseDto {
    id: string;
    orderId: string;
    testId: string;
    analyte: string;
    value?: number;
    textValue?: string;
    unit?: string;
    flag: ResultFlag;
    referenceLow?: number;
    referenceHigh?: number;
    instrument?: string;
    resultDateTime?: Date;
    notes?: string;
    method?: string;
    validationStatus: ValidationStatus;
    validatedBy?: string;
    validatedAt?: Date;
    reviewedBy?: string;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
