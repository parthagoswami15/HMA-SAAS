export declare enum TestCategory {
    HEMATOLOGY = "HEMATOLOGY",
    CHEMISTRY = "CHEMISTRY",
    MICROBIOLOGY = "MICROBIOLOGY",
    IMMUNOLOGY = "IMMUNOLOGY",
    SEROLOGY = "SEROLOGY",
    TOXICOLOGY = "TOXICOLOGY",
    URINALYSIS = "URINALYSIS",
    COAGULATION = "COAGULATION",
    ENDOCRINOLOGY = "ENDOCRINOLOGY",
    GENETICS = "GENETICS"
}
export declare enum TestPriority {
    STAT = "STAT",
    URGENT = "URGENT",
    ROUTINE = "ROUTINE"
}
export declare enum SampleType {
    BLOOD = "BLOOD",
    URINE = "URINE",
    SPUTUM = "SPUTUM",
    STOOL = "STOOL",
    CSF = "CSF",
    TISSUE = "TISSUE",
    SWAB = "SWAB",
    FLUID = "FLUID"
}
export declare enum ContainerType {
    RED_TOP = "RED_TOP",
    PURPLE_TOP = "PURPLE_TOP",
    BLUE_TOP = "BLUE_TOP",
    GREEN_TOP = "GREEN_TOP",
    GREY_TOP = "GREY_TOP",
    YELLOW_TOP = "YELLOW_TOP",
    VACUTAINER = "VACUTAINER",
    TUBE = "TUBE",
    BOTTLE = "BOTTLE"
}
export declare enum TestStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DEPRECATED = "DEPRECATED"
}
export declare class ReferenceRangeDto {
    ageGroup: string;
    gender: string;
    low: number;
    high: number;
    unit?: string;
    condition?: string;
}
export declare class CreateLabTestDto {
    name: string;
    code: string;
    description: string;
    category: TestCategory;
    department?: string;
    section?: string;
    price?: number;
    tatHours?: number;
    isActive?: boolean;
    requiresValidation?: boolean;
    method?: string;
    unit?: string;
    sampleTypes?: SampleType[];
    containerTypes?: ContainerType[];
    referenceRanges?: ReferenceRangeDto[];
    analyzerSettings?: Record<string, any>;
    qcSettings?: Record<string, any>;
}
export declare class UpdateLabTestDto extends CreateLabTestDto {
    status?: TestStatus;
}
export declare class LabTestResponseDto {
    id: string;
    name: string;
    code: string;
    description: string;
    category: TestCategory;
    department?: string;
    section?: string;
    price?: number;
    tatHours?: number;
    isActive: boolean;
    requiresValidation?: boolean;
    method?: string;
    unit?: string;
    sampleTypes?: SampleType[];
    containerTypes?: ContainerType[];
    referenceRanges?: ReferenceRangeDto[];
    analyzerSettings?: Record<string, any>;
    qcSettings?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
