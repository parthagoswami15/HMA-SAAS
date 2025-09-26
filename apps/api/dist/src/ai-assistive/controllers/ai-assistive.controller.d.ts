import { AIAssistiveService } from '../services/ai-assistive.service';
import { TriageSuggestionDto, TriageResultDto, CodingSuggestionDto, CodingResultDto, DenialPredictionDto, DenialPredictionResultDto, BedDemandForecastDto, OTDemandForecastDto, InventoryForecastDto, ForecastResultDto, DoctorDictationDto, ExtractedNoteDto, AIApprovalRequestDto, AIApprovalResultDto, AIGuardrailDto, TrainingDataDto, ModelEvaluationDto, AIModelDto } from '../dto/ai-assistive.dto';
export declare class AIAssistiveController {
    private readonly aiAssistiveService;
    constructor(aiAssistiveService: AIAssistiveService);
    getTriageSuggestion(triageDto: TriageSuggestionDto): Promise<TriageResultDto>;
    getTriageAnalytics(): Promise<any>;
    getCodingSuggestion(codingDto: CodingSuggestionDto): Promise<CodingResultDto>;
    getCodingAnalytics(): Promise<any>;
    predictDenial(denialDto: DenialPredictionDto): Promise<DenialPredictionResultDto>;
    forecastBedDemand(forecastDto: BedDemandForecastDto): Promise<ForecastResultDto>;
    forecastOTDemand(forecastDto: OTDemandForecastDto): Promise<ForecastResultDto>;
    forecastInventory(forecastDto: InventoryForecastDto): Promise<ForecastResultDto>;
    extractFromDictation(dictationDto: DoctorDictationDto): Promise<ExtractedNoteDto>;
    requestApproval(approvalDto: AIApprovalRequestDto): Promise<AIApprovalResultDto>;
    getApprovalHistory(userId?: string): Promise<any[]>;
    getGuardrails(): Promise<AIGuardrailDto[]>;
    updateGuardrail(guardrailId: string, guardrailDto: AIGuardrailDto): Promise<any>;
    trainModel(trainingData: TrainingDataDto): Promise<any>;
    evaluateModel(evaluationDto: ModelEvaluationDto): Promise<any>;
    getAIModels(): Promise<AIModelDto[]>;
    getModelPerformance(modelName: string): Promise<any>;
    getDecisionSupport(triageDto: TriageSuggestionDto): Promise<{
        recommendation: TriageResultDto;
        alternatives: string[];
        confidence: import("../dto/ai-assistive.dto").PredictionConfidence;
    }>;
    getCodingDecisionSupport(codingDto: CodingSuggestionDto): Promise<{
        recommendation: CodingResultDto;
        alternatives: string[];
        confidence: number | undefined;
    }>;
    assessPatientRisk(patientData: any): Promise<{
        overallRisk: string;
        riskFactors: string[];
        recommendations: string[];
        confidence: number;
    }>;
    assessClaimRisk(claimData: any): Promise<{
        overallRisk: string;
        riskFactors: string[];
        recommendations: string[];
        confidence: number;
    }>;
    getTriageQualityMetrics(): Promise<{
        accuracy: number;
        sensitivity: number;
        specificity: number;
        positivePredictiveValue: number;
        negativePredictiveValue: number;
        averageProcessingTime: number;
        userSatisfaction: number;
    }>;
    getCodingQualityMetrics(): Promise<{
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
        averageProcessingTime: number;
        userSatisfaction: number;
    }>;
    submitFeedback(feedbackDto: any): Promise<{
        message: string;
        feedbackId: string;
        willBeUsedForTraining: boolean;
    }>;
    getPendingReviews(userId?: string): Promise<{
        pendingReviews: {
            id: string;
            type: string;
            priority: string;
            data: {};
            deadline: Date;
        }[];
        count: number;
    }>;
    getAIDecisionAudit(query: any): Promise<{
        decisions: {
            id: string;
            type: string;
            timestamp: Date;
            input: {};
            output: {};
            confidence: number;
            reviewed: boolean;
            reviewer: string;
        }[];
        total: number;
    }>;
    getModelPerformanceMonitoring(): Promise<{
        models: {
            name: string;
            status: string;
            accuracy: number;
            drift: number;
            lastUpdated: Date;
            alerts: string[];
        }[];
    }>;
    syncWithEHR(syncDto: any): Promise<{
        message: string;
        syncedRecords: number;
        conflicts: number;
        resolved: number;
    }>;
    syncWithBilling(syncDto: any): Promise<{
        message: string;
        syncedClaims: number;
        updatedCodes: number;
        errors: number;
    }>;
}
