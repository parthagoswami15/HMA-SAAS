"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAssistiveController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const ai_assistive_service_1 = require("../services/ai-assistive.service");
const ai_assistive_dto_1 = require("../dto/ai-assistive.dto");
let AIAssistiveController = class AIAssistiveController {
    aiAssistiveService;
    constructor(aiAssistiveService) {
        this.aiAssistiveService = aiAssistiveService;
    }
    async getTriageSuggestion(triageDto) {
        return this.aiAssistiveService.getTriageSuggestion(triageDto);
    }
    async getTriageAnalytics() {
        return this.aiAssistiveService.getTriageAnalytics();
    }
    async getCodingSuggestion(codingDto) {
        return this.aiAssistiveService.getCodingSuggestion(codingDto);
    }
    async getCodingAnalytics() {
        return this.aiAssistiveService.getCodingAnalytics();
    }
    async predictDenial(denialDto) {
        return this.aiAssistiveService.predictDenial(denialDto);
    }
    async forecastBedDemand(forecastDto) {
        return this.aiAssistiveService.forecastBedDemand(forecastDto);
    }
    async forecastOTDemand(forecastDto) {
        return this.aiAssistiveService.forecastOTDemand(forecastDto);
    }
    async forecastInventory(forecastDto) {
        return this.aiAssistiveService.forecastInventory(forecastDto);
    }
    async extractFromDictation(dictationDto) {
        return this.aiAssistiveService.extractFromDictation(dictationDto);
    }
    async requestApproval(approvalDto) {
        return this.aiAssistiveService.requestApproval(approvalDto);
    }
    async getApprovalHistory(userId) {
        return this.aiAssistiveService.getApprovalHistory(userId);
    }
    async getGuardrails() {
        return this.aiAssistiveService.getGuardrails();
    }
    async updateGuardrail(guardrailId, guardrailDto) {
        return this.aiAssistiveService.updateGuardrail(guardrailId, guardrailDto);
    }
    async trainModel(trainingData) {
        return this.aiAssistiveService.trainModel(trainingData);
    }
    async evaluateModel(evaluationDto) {
        return this.aiAssistiveService.evaluateModel(evaluationDto);
    }
    async getAIModels() {
        return this.aiAssistiveService.getAIModels();
    }
    async getModelPerformance(modelName) {
        return this.aiAssistiveService.getModelPerformance(modelName);
    }
    async getDecisionSupport(triageDto) {
        const triageResult = await this.aiAssistiveService.getTriageSuggestion(triageDto);
        return {
            recommendation: triageResult,
            alternatives: [
                'Consider alternative department',
                'Review patient history',
                'Consult with specialist',
            ],
            confidence: triageResult.confidence,
        };
    }
    async getCodingDecisionSupport(codingDto) {
        const codingResult = await this.aiAssistiveService.getCodingSuggestion(codingDto);
        return {
            recommendation: codingResult,
            alternatives: [
                'Consider alternative coding',
                'Review documentation requirements',
                'Check payer-specific rules',
            ],
            confidence: codingResult.overallConfidence,
        };
    }
    async assessPatientRisk(patientData) {
        return {
            overallRisk: 'MEDIUM',
            riskFactors: [
                'Age > 65',
                'Multiple comorbidities',
                'Medication interactions',
            ],
            recommendations: [
                'Close monitoring required',
                'Consider specialist consultation',
                'Review medication list',
            ],
            confidence: 0.85,
        };
    }
    async assessClaimRisk(claimData) {
        return {
            overallRisk: 'LOW',
            riskFactors: [
                'Missing documentation',
                'Coding complexity',
            ],
            recommendations: [
                'Add supporting documentation',
                'Double-check coding accuracy',
            ],
            confidence: 0.78,
        };
    }
    async getTriageQualityMetrics() {
        return {
            accuracy: 0.89,
            sensitivity: 0.92,
            specificity: 0.85,
            positivePredictiveValue: 0.88,
            negativePredictiveValue: 0.90,
            averageProcessingTime: 2.3,
            userSatisfaction: 4.2,
        };
    }
    async getCodingQualityMetrics() {
        return {
            accuracy: 0.87,
            precision: 0.91,
            recall: 0.83,
            f1Score: 0.87,
            averageProcessingTime: 3.1,
            userSatisfaction: 4.0,
        };
    }
    async submitFeedback(feedbackDto) {
        return {
            message: 'Feedback submitted successfully',
            feedbackId: 'feedback_123',
            willBeUsedForTraining: true,
        };
    }
    async getPendingReviews(userId) {
        return {
            pendingReviews: [
                {
                    id: 'review_1',
                    type: 'HIGH_RISK_TRIAGE',
                    priority: 'HIGH',
                    data: {},
                    deadline: new Date(Date.now() + 60 * 60 * 1000),
                },
            ],
            count: 1,
        };
    }
    async getAIDecisionAudit(query) {
        return {
            decisions: [
                {
                    id: 'decision_1',
                    type: 'TRIAGE_SUGGESTION',
                    timestamp: new Date(),
                    input: {},
                    output: {},
                    confidence: 0.85,
                    reviewed: true,
                    reviewer: 'DR_SMITH',
                },
            ],
            total: 1,
        };
    }
    async getModelPerformanceMonitoring() {
        return {
            models: [
                {
                    name: 'Triage Assistant',
                    status: 'HEALTHY',
                    accuracy: 0.89,
                    drift: 0.02,
                    lastUpdated: new Date(),
                    alerts: [],
                },
                {
                    name: 'Medical Coder',
                    status: 'WARNING',
                    accuracy: 0.87,
                    drift: 0.05,
                    lastUpdated: new Date(),
                    alerts: ['Accuracy degradation detected'],
                },
            ],
        };
    }
    async syncWithEHR(syncDto) {
        return {
            message: 'EHR sync completed',
            syncedRecords: 150,
            conflicts: 2,
            resolved: 2,
        };
    }
    async syncWithBilling(syncDto) {
        return {
            message: 'Billing sync completed',
            syncedClaims: 45,
            updatedCodes: 12,
            errors: 1,
        };
    }
};
exports.AIAssistiveController = AIAssistiveController;
__decorate([
    (0, common_1.Post)('triage/suggest'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI-powered triage suggestion' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage suggestion generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.TriageSuggestionDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getTriageSuggestion", null);
__decorate([
    (0, common_1.Get)('triage/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get triage analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage analytics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getTriageAnalytics", null);
__decorate([
    (0, common_1.Post)('coding/suggest'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI-powered coding suggestions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coding suggestions generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.CodingSuggestionDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getCodingSuggestion", null);
__decorate([
    (0, common_1.Get)('coding/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coding analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coding analytics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getCodingAnalytics", null);
__decorate([
    (0, common_1.Post)('denials/predict'),
    (0, swagger_1.ApiOperation)({ summary: 'Predict claim denial probability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Denial prediction generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.DenialPredictionDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "predictDenial", null);
__decorate([
    (0, common_1.Post)('forecast/bed-demand'),
    (0, swagger_1.ApiOperation)({ summary: 'Forecast bed demand' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bed demand forecast generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.BedDemandForecastDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "forecastBedDemand", null);
__decorate([
    (0, common_1.Post)('forecast/ot-demand'),
    (0, swagger_1.ApiOperation)({ summary: 'Forecast operating theater demand' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OT demand forecast generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.OTDemandForecastDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "forecastOTDemand", null);
__decorate([
    (0, common_1.Post)('forecast/inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Forecast inventory levels' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory forecast generated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.InventoryForecastDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "forecastInventory", null);
__decorate([
    (0, common_1.Post)('dictation/extract'),
    (0, swagger_1.ApiOperation)({ summary: 'Extract structured data from doctor dictation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dictation processed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.DoctorDictationDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "extractFromDictation", null);
__decorate([
    (0, common_1.Post)('approvals/request'),
    (0, swagger_1.ApiOperation)({ summary: 'Request AI approval for action' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Approval request processed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.AIApprovalRequestDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "requestApproval", null);
__decorate([
    (0, common_1.Get)('approvals/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get approval history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Approval history retrieved successfully' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getApprovalHistory", null);
__decorate([
    (0, common_1.Get)('guardrails'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI guardrails configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Guardrails retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getGuardrails", null);
__decorate([
    (0, common_1.Put)('guardrails/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update AI guardrail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Guardrail updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ai_assistive_dto_1.AIGuardrailDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "updateGuardrail", null);
__decorate([
    (0, common_1.Post)('models/train'),
    (0, swagger_1.ApiOperation)({ summary: 'Train AI model with new data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Model training initiated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.TrainingDataDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "trainModel", null);
__decorate([
    (0, common_1.Post)('models/evaluate'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate AI model performance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Model evaluation completed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.ModelEvaluationDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "evaluateModel", null);
__decorate([
    (0, common_1.Get)('models'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available AI models' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI models retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getAIModels", null);
__decorate([
    (0, common_1.Get)('models/:name/performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI model performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Model performance retrieved successfully' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getModelPerformance", null);
__decorate([
    (0, common_1.Post)('decision-support/triage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get decision support for triage' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Decision support provided successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.TriageSuggestionDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getDecisionSupport", null);
__decorate([
    (0, common_1.Post)('decision-support/coding'),
    (0, swagger_1.ApiOperation)({ summary: 'Get decision support for coding' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Decision support provided successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_assistive_dto_1.CodingSuggestionDto]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getCodingDecisionSupport", null);
__decorate([
    (0, common_1.Post)('risk-assessment/patient'),
    (0, swagger_1.ApiOperation)({ summary: 'Assess patient risk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk assessment completed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "assessPatientRisk", null);
__decorate([
    (0, common_1.Post)('risk-assessment/claim'),
    (0, swagger_1.ApiOperation)({ summary: 'Assess claim risk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk assessment completed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "assessClaimRisk", null);
__decorate([
    (0, common_1.Get)('quality-metrics/triage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get triage quality metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quality metrics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getTriageQualityMetrics", null);
__decorate([
    (0, common_1.Get)('quality-metrics/coding'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coding quality metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quality metrics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getCodingQualityMetrics", null);
__decorate([
    (0, common_1.Post)('human-in-loop/feedback'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit feedback for AI suggestion' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback submitted successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "submitFeedback", null);
__decorate([
    (0, common_1.Get)('human-in-loop/pending-reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending human reviews' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending reviews retrieved successfully' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getPendingReviews", null);
__decorate([
    (0, common_1.Get)('audit/ai-decisions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI decision audit trail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit trail retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getAIDecisionAudit", null);
__decorate([
    (0, common_1.Get)('monitoring/model-performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get model performance monitoring' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance monitoring retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "getModelPerformanceMonitoring", null);
__decorate([
    (0, common_1.Post)('integration/ehr-sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync with EHR system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'EHR sync completed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "syncWithEHR", null);
__decorate([
    (0, common_1.Post)('integration/billing-sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync with billing system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Billing sync completed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIAssistiveController.prototype, "syncWithBilling", null);
exports.AIAssistiveController = AIAssistiveController = __decorate([
    (0, swagger_1.ApiTags)('AI/Assistive'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('ai-assistive'),
    __metadata("design:paramtypes", [ai_assistive_service_1.AIAssistiveService])
], AIAssistiveController);
//# sourceMappingURL=ai-assistive.controller.js.map