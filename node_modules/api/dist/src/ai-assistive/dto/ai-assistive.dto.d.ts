export declare enum TriageLevel {
    EMERGENCY = "EMERGENCY",
    URGENT = "URGENT",
    ROUTINE = "ROUTINE",
    NON_URGENT = "NON_URGENT"
}
export declare enum PredictionConfidence {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
export declare enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    AUTO_APPROVED = "AUTO_APPROVED"
}
export declare enum ForecastType {
    BED_DEMAND = "BED_DEMAND",
    OT_DEMAND = "OT_DEMAND",
    INVENTORY = "INVENTORY",
    STAFFING = "STAFFING"
}
export declare enum ExtractionStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PARTIAL = "PARTIAL"
}
export declare class TriageSuggestionDto {
    patientId: string;
    chiefComplaint: string;
    symptoms?: string;
    vitals?: Record<string, any>;
    age?: number;
    gender?: string;
    previousConditions?: string[];
}
export declare class TriageResultDto {
    triageLevel: TriageLevel;
    confidence: PredictionConfidence;
    recommendedActions?: string[];
    suggestedDepartment?: string;
    estimatedWaitTime?: number;
    riskFactors?: string[];
    explanation?: string;
}
export declare class CodingSuggestionDto {
    diagnosis: string;
    procedure?: string;
    service?: string;
    patientContext?: Record<string, any>;
    insuranceContext?: Record<string, any>;
}
export declare class CodingResultDto {
    icdCodes?: Array<{
        code: string;
        description: string;
        confidence: number;
    }>;
    cptCodes?: Array<{
        code: string;
        description: string;
        confidence: number;
    }>;
    hcpcsCodes?: Array<{
        code: string;
        description: string;
        confidence: number;
    }>;
    charges?: Array<{
        code: string;
        amount: number;
        description: string;
    }>;
    overallConfidence?: number;
    warnings?: string[];
}
export declare class DenialPredictionDto {
    claimData: Record<string, any>;
    patientContext?: Record<string, any>;
    providerContext?: Record<string, any>;
    historicalClaims?: Record<string, any>[];
}
export declare class DenialPredictionResultDto {
    denialProbability: number;
    confidence: PredictionConfidence;
    predictedReasons?: string[];
    suggestedCorrections?: string[];
    riskFactors?: string[];
    expectedApprovalAfterCorrections?: number;
}
export declare class BedDemandForecastDto {
    unit: string;
    horizonDays: number;
    historicalPeriod?: number;
    includeSeasonal?: boolean;
    specialEvents?: string[];
}
export declare class OTDemandForecastDto {
    operatingTheater: string;
    horizonDays: number;
    surgeryTypes?: string[];
    includeEmergency?: boolean;
}
export declare class InventoryForecastDto {
    itemId: string;
    horizonDays: number;
    reorderPoint?: number;
    safetyStock?: number;
}
export declare class ForecastResultDto {
    forecastType: string;
    targetResource: string;
    forecastData: Array<{
        date: string;
        predictedValue: number;
        confidenceInterval?: {
            lower: number;
            upper: number;
        };
        factors?: Record<string, any>;
    }>;
    accuracyMetrics?: Record<string, number>;
    recommendations?: string[];
}
export declare class DoctorDictationDto {
    audioData: string;
    audioFormat?: string;
    patientId?: string;
    visitId?: string;
    doctorPreferences?: Record<string, any>;
}
export declare class ExtractedNoteDto {
    status: ExtractionStatus;
    extractedText?: string;
    structuredData?: Record<string, any>;
    confidenceScores?: Record<string, number>;
    suggestedFields?: Record<string, any>;
    validationErrors?: string[];
}
export declare class AIApprovalRequestDto {
    requestType: string;
    requestData: Record<string, any>;
    userId?: string;
    urgency?: string;
    autoApprove?: boolean;
    confidenceThreshold?: number;
}
export declare class AIApprovalResultDto {
    status: ApprovalStatus;
    confidence?: number;
    approvedBy?: string;
    approvedAt?: string;
    comments?: string;
    suggestedModifications?: Record<string, any>;
}
export declare class AIGuardrailDto {
    name: string;
    type: string;
    config?: Record<string, any>;
    enabled?: boolean;
    severity?: string;
}
export declare class TrainingDataDto {
    dataType: string;
    data: Record<string, any>[];
    labels?: Record<string, any>[];
    metadata?: Record<string, any>;
}
export declare class ModelEvaluationDto {
    modelName: string;
    dataset?: string;
    metrics?: Record<string, number>;
    results?: Record<string, any>[];
}
export declare class AIModelDto {
    name: string;
    version: string;
    description?: string;
    modelType?: string;
    status?: string;
    performance?: Record<string, number>;
}
