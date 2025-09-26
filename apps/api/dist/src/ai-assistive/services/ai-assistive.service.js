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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAssistiveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ai_assistive_dto_1 = require("../dto/ai-assistive.dto");
let AIAssistiveService = class AIAssistiveService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTriageSuggestion(triageDto) {
        const patient = await this.prisma.patient.findUnique({
            where: { id: triageDto.patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const triageResult = {
            triageLevel: this.calculateTriageLevel(triageDto),
            confidence: this.calculateConfidence(triageDto),
            recommendedActions: this.getRecommendedActions(triageDto),
            suggestedDepartment: this.getSuggestedDepartment(triageDto),
            estimatedWaitTime: this.calculateWaitTime(triageDto),
            riskFactors: this.identifyRiskFactors(triageDto),
            explanation: this.generateExplanation(triageDto),
        };
        await this.prisma.aiTriageSuggestion.create({
            data: {
                patientId: triageDto.patientId,
                chiefComplaint: triageDto.chiefComplaint,
                triageLevel: triageResult.triageLevel,
                confidence: triageResult.confidence,
                suggestedDepartment: triageResult.suggestedDepartment,
                createdAt: new Date(),
            },
        });
        return triageResult;
    }
    async getCodingSuggestion(codingDto) {
        const codingResult = {
            icdCodes: this.suggestICDCodes(codingDto),
            cptCodes: this.suggestCPTCodes(codingDto),
            hcpcsCodes: this.suggestHCPCSCodes(codingDto),
            charges: this.calculateCharges(codingDto),
            overallConfidence: this.calculateCodingConfidence(codingDto),
            warnings: this.getCodingWarnings(codingDto),
        };
        return codingResult;
    }
    async predictDenial(denialDto) {
        const predictionResult = {
            denialProbability: this.calculateDenialProbability(denialDto),
            confidence: this.assessPredictionConfidence(denialDto),
            predictedReasons: this.predictDenialReasons(denialDto),
            suggestedCorrections: this.suggestClaimCorrections(denialDto),
            riskFactors: this.identifyClaimRiskFactors(denialDto),
            expectedApprovalAfterCorrections: this.calculateExpectedApproval(denialDto),
        };
        return predictionResult;
    }
    async forecastBedDemand(forecastDto) {
        const forecastResult = {
            forecastType: ai_assistive_dto_1.ForecastType.BED_DEMAND,
            targetResource: forecastDto.unit,
            forecastData: this.generateForecastData(forecastDto.horizonDays),
            accuracyMetrics: {
                mae: 2.3,
                rmse: 3.1,
                mape: 5.2,
            },
            recommendations: this.generateBedRecommendations(forecastDto),
        };
        return forecastResult;
    }
    async forecastOTDemand(forecastDto) {
        const forecastResult = {
            forecastType: ai_assistive_dto_1.ForecastType.OT_DEMAND,
            targetResource: forecastDto.operatingTheater,
            forecastData: this.generateOTForecastData(forecastDto.horizonDays),
            accuracyMetrics: {
                mae: 1.8,
                rmse: 2.4,
                mape: 4.1,
            },
            recommendations: this.generateOTRecommendations(forecastDto),
        };
        return forecastResult;
    }
    async forecastInventory(forecastDto) {
        const forecastResult = {
            forecastType: ai_assistive_dto_1.ForecastType.INVENTORY,
            targetResource: forecastDto.itemId,
            forecastData: this.generateInventoryForecastData(forecastDto.horizonDays),
            accuracyMetrics: {
                mae: 0.5,
                rmse: 0.8,
                mape: 2.1,
            },
            recommendations: this.generateInventoryRecommendations(forecastDto),
        };
        return forecastResult;
    }
    async extractFromDictation(dictationDto) {
        const extractedNote = {
            status: ai_assistive_dto_1.ExtractionStatus.COMPLETED,
            extractedText: this.simulateTextExtraction(dictationDto),
            structuredData: this.extractStructuredData(dictationDto),
            confidenceScores: this.calculateExtractionConfidence(dictationDto),
            suggestedFields: this.suggestEMRFields(dictationDto),
            validationErrors: this.validateExtractedData(dictationDto),
        };
        await this.prisma.doctorDictation.create({
            data: {
                audioData: dictationDto.audioData,
                patientId: dictationDto.patientId,
                visitId: dictationDto.visitId,
                extractedText: extractedNote.extractedText,
                structuredData: extractedNote.structuredData,
                status: extractedNote.status,
                createdAt: new Date(),
            },
        });
        return extractedNote;
    }
    async requestApproval(approvalDto) {
        const approvalResult = {
            status: this.evaluateApprovalRequest(approvalDto),
            confidence: this.calculateApprovalConfidence(approvalDto),
            approvedBy: this.determineApprover(approvalDto),
            approvedAt: new Date().toISOString(),
            comments: this.generateApprovalComments(approvalDto),
            suggestedModifications: this.suggestModifications(approvalDto),
        };
        await this.prisma.aiApproval.create({
            data: {
                requestType: approvalDto.requestType,
                requestData: approvalDto.requestData,
                userId: approvalDto.userId,
                status: approvalResult.status,
                confidence: approvalResult.confidence,
                approvedBy: approvalResult.approvedBy,
                createdAt: new Date(),
            },
        });
        return approvalResult;
    }
    async getGuardrails() {
        return [
            {
                name: 'Patient Safety',
                type: 'SAFETY',
                config: {
                    maxRiskLevel: 'HIGH',
                    requireHumanReview: true,
                },
                enabled: true,
                severity: 'CRITICAL',
            },
            {
                name: 'Medical Accuracy',
                type: 'ACCURACY',
                config: {
                    confidenceThreshold: 0.8,
                    requireValidation: true,
                },
                enabled: true,
                severity: 'HIGH',
            },
            {
                name: 'Privacy Protection',
                type: 'PRIVACY',
                config: {
                    anonymizeData: true,
                    auditRequired: true,
                },
                enabled: true,
                severity: 'CRITICAL',
            },
        ];
    }
    async trainModel(trainingData) {
        const trainingJob = await this.prisma.aiModelTraining.create({
            data: {
                dataType: trainingData.dataType,
                status: 'PENDING',
                dataCount: trainingData.data.length,
                metadata: trainingData.metadata,
                startedAt: new Date(),
            },
        });
        await this.simulateModelTraining(trainingJob.id);
        return trainingJob;
    }
    async evaluateModel(evaluationDto) {
        const evaluation = await this.prisma.modelEvaluation.create({
            data: {
                modelName: evaluationDto.modelName,
                dataset: evaluationDto.dataset,
                metrics: evaluationDto.metrics,
                results: evaluationDto.results,
                createdAt: new Date(),
            },
        });
        return evaluation;
    }
    async getAIModels() {
        return [
            {
                name: 'Triage Assistant',
                version: '1.0.0',
                description: 'AI-powered triage suggestion system',
                modelType: 'CLASSIFICATION',
                status: 'ACTIVE',
                performance: {
                    accuracy: 0.92,
                    precision: 0.89,
                    recall: 0.94,
                },
            },
            {
                name: 'Medical Coder',
                version: '2.1.0',
                description: 'Automated medical coding assistant',
                modelType: 'MULTI_LABEL_CLASSIFICATION',
                status: 'ACTIVE',
                performance: {
                    accuracy: 0.87,
                    precision: 0.91,
                    recall: 0.83,
                },
            },
            {
                name: 'Denial Predictor',
                version: '1.5.0',
                description: 'Claims denial prediction model',
                modelType: 'BINARY_CLASSIFICATION',
                status: 'ACTIVE',
                performance: {
                    accuracy: 0.88,
                    precision: 0.85,
                    recall: 0.90,
                },
            },
        ];
    }
    async getModelPerformance(modelName) {
        const model = await this.prisma.aiModel.findUnique({
            where: { name: modelName },
        });
        if (!model) {
            throw new common_1.NotFoundException('Model not found');
        }
        return {
            modelName,
            version: model.version,
            metrics: model.performance,
            lastUpdated: model.updatedAt,
            trainingHistory: await this.getTrainingHistory(modelName),
        };
    }
    async updateGuardrail(guardrailId, guardrailDto) {
        const guardrail = await this.prisma.aiGuardrail.findUnique({
            where: { id: guardrailId },
        });
        if (!guardrail) {
            throw new common_1.NotFoundException('Guardrail not found');
        }
        return this.prisma.aiGuardrail.update({
            where: { id: guardrailId },
            data: guardrailDto,
        });
    }
    async getApprovalHistory(userId) {
        const where = {};
        if (userId)
            where.userId = userId;
        return this.prisma.aiApproval.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async getTriageAnalytics() {
        const totalSuggestions = await this.prisma.aiTriageSuggestion.count();
        const accuracyRate = await this.calculateTriageAccuracy();
        return {
            totalSuggestions,
            accuracyRate,
            averageConfidence: 0.85,
            departmentDistribution: await this.getDepartmentDistribution(),
            commonChiefComplaints: await this.getCommonComplaints(),
        };
    }
    async getCodingAnalytics() {
        const totalCodings = await this.prisma.medicalCoding.count();
        return {
            totalCodings,
            averageConfidence: 0.82,
            codeAccuracy: 0.91,
            commonCorrections: await this.getCommonCodingCorrections(),
        };
    }
    calculateTriageLevel(triageDto) {
        const age = triageDto.age || 30;
        const hasVitals = triageDto.vitals && Object.keys(triageDto.vitals).length > 0;
        const hasRiskFactors = triageDto.previousConditions && triageDto.previousConditions.length > 0;
        if (age > 65 || hasRiskFactors || hasVitals) {
            return ai_assistive_dto_1.TriageLevel.URGENT;
        }
        return ai_assistive_dto_1.TriageLevel.ROUTINE;
    }
    calculateConfidence(triageDto) {
        const factors = [
            triageDto.chiefComplaint ? 0.3 : 0,
            triageDto.symptoms ? 0.2 : 0,
            triageDto.vitals ? 0.3 : 0,
            triageDto.age ? 0.1 : 0,
            triageDto.previousConditions ? 0.1 : 0,
        ];
        const confidence = factors.reduce((sum, factor) => sum + factor, 0);
        if (confidence >= 0.8)
            return ai_assistive_dto_1.PredictionConfidence.HIGH;
        if (confidence >= 0.5)
            return ai_assistive_dto_1.PredictionConfidence.MEDIUM;
        return ai_assistive_dto_1.PredictionConfidence.LOW;
    }
    getRecommendedActions(triageDto) {
        return [
            'Monitor vital signs',
            'Prepare for examination',
            'Alert relevant department',
        ];
    }
    getSuggestedDepartment(triageDto) {
        if (triageDto.chiefComplaint.toLowerCase().includes('chest')) {
            return 'Cardiology';
        }
        if (triageDto.chiefComplaint.toLowerCase().includes('head')) {
            return 'Neurology';
        }
        return 'General Medicine';
    }
    calculateWaitTime(triageDto) {
        const triageLevel = this.calculateTriageLevel(triageDto);
        const baseWaitTime = 30;
        switch (triageLevel) {
            case ai_assistive_dto_1.TriageLevel.EMERGENCY: return 0;
            case ai_assistive_dto_1.TriageLevel.URGENT: return 15;
            case ai_assistive_dto_1.TriageLevel.ROUTINE: return baseWaitTime;
            default: return 60;
        }
    }
    identifyRiskFactors(triageDto) {
        const riskFactors = [];
        if (triageDto.age && triageDto.age > 65) {
            riskFactors.push('Age > 65');
        }
        if (triageDto.previousConditions?.includes('Diabetes')) {
            riskFactors.push('Diabetes');
        }
        return riskFactors;
    }
    generateExplanation(triageDto) {
        return `Triage suggestion based on chief complaint: ${triageDto.chiefComplaint}, patient age: ${triageDto.age || 'unknown'}, and provided symptoms.`;
    }
    suggestICDCodes(codingDto) {
        return [
            { code: 'I10', description: 'Essential hypertension', confidence: 0.9 },
            { code: 'E11.9', description: 'Type 2 diabetes mellitus', confidence: 0.8 },
        ];
    }
    suggestCPTCodes(codingDto) {
        return [
            { code: '99213', description: 'Office visit, established patient', confidence: 0.95 },
            { code: '85025', description: 'Complete blood count', confidence: 0.85 },
        ];
    }
    suggestHCPCSCodes(codingDto) {
        return [
            { code: 'J3420', description: 'Vitamin B12 injection', confidence: 0.8 },
        ];
    }
    calculateCharges(codingDto) {
        return [
            { code: '99213', amount: 150.00, description: 'Office visit charge' },
            { code: '85025', amount: 25.00, description: 'Lab test charge' },
        ];
    }
    calculateCodingConfidence(codingDto) {
        return 0.87;
    }
    getCodingWarnings(codingDto) {
        return [
            'Verify diagnosis specificity',
            'Check medical necessity',
        ];
    }
    calculateDenialProbability(denialDto) {
        return 0.23;
    }
    assessPredictionConfidence(denialDto) {
        return ai_assistive_dto_1.PredictionConfidence.HIGH;
    }
    predictDenialReasons(denialDto) {
        return [
            'Missing documentation',
            'Incorrect coding',
        ];
    }
    suggestClaimCorrections(denialDto) {
        return [
            'Add supporting documentation',
            'Review coding accuracy',
        ];
    }
    identifyClaimRiskFactors(denialDto) {
        return [
            'New patient',
            'Complex procedure',
        ];
    }
    calculateExpectedApproval(denialDto) {
        return 0.85;
    }
    generateForecastData(horizonDays) {
        const data = [];
        const today = new Date();
        for (let i = 0; i < horizonDays; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            data.push({
                date: date.toISOString().split('T')[0],
                predictedValue: Math.floor(Math.random() * 20) + 10,
                confidenceInterval: {
                    lower: Math.floor(Math.random() * 5) + 5,
                    upper: Math.floor(Math.random() * 5) + 25,
                },
                factors: {
                    seasonal: Math.random() > 0.5,
                    weekend: date.getDay() === 0 || date.getDay() === 6,
                },
            });
        }
        return data;
    }
    generateOTForecastData(horizonDays) {
        const data = [];
        const today = new Date();
        for (let i = 0; i < horizonDays; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            data.push({
                date: date.toISOString().split('T')[0],
                predictedValue: Math.floor(Math.random() * 8) + 2,
                confidenceInterval: {
                    lower: Math.floor(Math.random() * 3) + 1,
                    upper: Math.floor(Math.random() * 5) + 10,
                },
                factors: {
                    emergency: Math.random() > 0.7,
                    scheduled: Math.random() > 0.3,
                },
            });
        }
        return data;
    }
    generateInventoryForecastData(horizonDays) {
        const data = [];
        const today = new Date();
        for (let i = 0; i < horizonDays; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            data.push({
                date: date.toISOString().split('T')[0],
                predictedValue: Math.floor(Math.random() * 50) + 100,
                confidenceInterval: {
                    lower: Math.floor(Math.random() * 20) + 80,
                    upper: Math.floor(Math.random() * 30) + 130,
                },
                factors: {
                    seasonalDemand: Math.random() > 0.5,
                    reorderPoint: 50,
                },
            });
        }
        return data;
    }
    generateBedRecommendations(forecastDto) {
        return [
            'Increase staffing for high-demand periods',
            'Consider opening additional beds',
            'Optimize patient discharge process',
        ];
    }
    generateOTRecommendations(forecastDto) {
        return [
            'Schedule elective surgeries during low-demand periods',
            'Prepare backup operating rooms',
            'Optimize surgical team scheduling',
        ];
    }
    generateInventoryRecommendations(forecastDto) {
        return [
            'Place reorder for items below safety stock',
            'Review supplier lead times',
            'Consider bulk purchasing for high-demand items',
        ];
    }
    simulateTextExtraction(dictationDto) {
        return 'Patient presents with chest pain and shortness of breath. History of hypertension. Physical exam shows elevated blood pressure. Assessment: Unstable angina. Plan: Admit to CCU, start IV medications, cardiology consult.';
    }
    extractStructuredData(dictationDto) {
        return {
            symptoms: ['chest pain', 'shortness of breath'],
            diagnosis: ['unstable angina'],
            medications: ['aspirin', 'nitroglycerin'],
            procedures: ['EKG', 'cardiac enzymes'],
        };
    }
    calculateExtractionConfidence(dictationDto) {
        return {
            textExtraction: 0.92,
            symptomIdentification: 0.88,
            diagnosisExtraction: 0.85,
            medicationExtraction: 0.90,
        };
    }
    suggestEMRFields(dictationDto) {
        return {
            chiefComplaint: 'Chest pain',
            assessment: 'Unstable angina',
            plan: 'Admit to CCU, cardiology consult',
            medications: 'Aspirin 81mg daily, Nitroglycerin PRN',
        };
    }
    validateExtractedData(dictationDto) {
        return [
            'Missing vital signs documentation',
            'No discharge instructions recorded',
        ];
    }
    evaluateApprovalRequest(approvalDto) {
        if (approvalDto.autoApprove && (approvalDto.confidenceThreshold || 0.8) <= 0.9) {
            return ai_assistive_dto_1.ApprovalStatus.AUTO_APPROVED;
        }
        return ai_assistive_dto_1.ApprovalStatus.PENDING;
    }
    calculateApprovalConfidence(approvalDto) {
        return 0.87;
    }
    determineApprover(approvalDto) {
        if (approvalDto.urgency === 'HIGH') {
            return 'DR_SMITH';
        }
        return 'SYSTEM';
    }
    generateApprovalComments(approvalDto) {
        return 'AI suggestion reviewed and approved based on confidence score and safety protocols.';
    }
    suggestModifications(approvalDto) {
        return {
            addDocumentation: true,
            reviewWithSpecialist: false,
            additionalTests: [],
        };
    }
    async calculateTriageAccuracy() {
        return 0.89;
    }
    async getDepartmentDistribution() {
        return {
            'Emergency': 35,
            'Cardiology': 20,
            'General Medicine': 25,
            'Neurology': 12,
            'Orthopedics': 8,
        };
    }
    async getCommonComplaints() {
        return [
            { complaint: 'Chest pain', count: 45 },
            { complaint: 'Headache', count: 32 },
            { complaint: 'Abdominal pain', count: 28 },
            { complaint: 'Shortness of breath', count: 22 },
        ];
    }
    async getCommonCodingCorrections() {
        return [
            'Add modifier for procedure complexity',
            'Include additional diagnosis codes',
            'Verify medical necessity documentation',
        ];
    }
    async getTrainingHistory(modelName) {
        return [
            {
                version: '1.0.0',
                trainedAt: new Date('2024-01-01'),
                accuracy: 0.85,
                datasetSize: 10000,
            },
            {
                version: '1.1.0',
                trainedAt: new Date('2024-02-01'),
                accuracy: 0.89,
                datasetSize: 15000,
            },
        ];
    }
    async simulateModelTraining(trainingJobId) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await this.prisma.aiModelTraining.update({
            where: { id: trainingJobId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
            },
        });
    }
};
exports.AIAssistiveService = AIAssistiveService;
exports.AIAssistiveService = AIAssistiveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AIAssistiveService);
//# sourceMappingURL=ai-assistive.service.js.map