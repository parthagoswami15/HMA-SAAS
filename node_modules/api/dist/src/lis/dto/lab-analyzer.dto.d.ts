export declare enum AnalyzerStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    MAINTENANCE = "MAINTENANCE",
    ERROR = "ERROR"
}
export declare enum AnalyzerType {
    CHEMISTRY = "CHEMISTRY",
    HEMATOLOGY = "HEMATOLOGY",
    IMMUNOASSAY = "IMMUNOASSAY",
    COAGULATION = "COAGULATION",
    URINALYSIS = "URINALYSIS",
    MICROBIOLOGY = "MICROBIOLOGY"
}
export declare enum Direction {
    UNIDIRECTIONAL = "UNIDIRECTIONAL",
    BIDIRECTIONAL = "BIDIRECTIONAL"
}
export declare class CreateAnalyzerDto {
    name: string;
    model: string;
    type: AnalyzerType;
    serialNumber: string;
    ipAddress: string;
    port?: number;
    location?: string;
    direction?: Direction;
    isActive?: boolean;
    configuration?: Record<string, any>;
    supportedTests?: Record<string, any>;
}
export declare class UpdateAnalyzerDto {
    name?: string;
    ipAddress?: string;
    port?: number;
    location?: string;
    status?: AnalyzerStatus;
    isActive?: boolean;
    configuration?: Record<string, any>;
    supportedTests?: Record<string, any>;
}
export declare class AnalyzerResponseDto {
    id: string;
    name: string;
    model: string;
    type: AnalyzerType;
    serialNumber: string;
    ipAddress: string;
    port?: number;
    location?: string;
    direction: Direction;
    status: AnalyzerStatus;
    isActive: boolean;
    configuration?: Record<string, any>;
    supportedTests?: Record<string, any>;
    lastCommunication?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class QcBatchDto {
    analyte: string;
    lotNumber: string;
    targetValue?: number;
    targetSd?: number;
    targetCv?: number;
    expiryDate?: Date;
    manufacturer?: string;
    statistics?: Record<string, any>;
}
export declare class CreateQcRunDto {
    analyzerId: string;
    qcBatches: QcBatchDto[];
    operator?: string;
    runDateTime?: Date;
    notes?: string;
}
export declare class QcResultDto {
    analyte: string;
    lotNumber: string;
    measuredValue: number;
    expectedValue?: number;
    deviation?: number;
    withinRange?: boolean;
    flag?: string;
}
export declare class QcRunResponseDto {
    id: string;
    analyzerId: string;
    qcBatches: QcBatchDto[];
    qcResults: QcResultDto[];
    operator?: string;
    runDateTime?: Date;
    notes?: string;
    isPassed: boolean;
    westgardRules?: string[];
    createdAt: Date;
    updatedAt: Date;
}
