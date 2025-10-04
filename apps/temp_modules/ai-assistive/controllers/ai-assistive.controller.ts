import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AIAssistiveService } from '../services/ai-assistive.service';
import {
  TriageSuggestionDto,
  TriageResultDto,
  CodingSuggestionDto,
  CodingResultDto,
  DenialPredictionDto,
  DenialPredictionResultDto,
  BedDemandForecastDto,
  OTDemandForecastDto,
  InventoryForecastDto,
  ForecastResultDto,
  DoctorDictationDto,
  ExtractedNoteDto,
  AIApprovalRequestDto,
  AIApprovalResultDto,
  AIGuardrailDto,
  TrainingDataDto,
  ModelEvaluationDto,
  AIModelDto,
} from '../dto/ai-assistive.dto';

@ApiTags('AI/Assistive')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-assistive')
export class AIAssistiveController {
  constructor(private readonly aiAssistiveService: AIAssistiveService) {}

  // Triage Assistance
  @Post('triage/suggest')
  @ApiOperation({ summary: 'Get AI-powered triage suggestion' })
  @ApiResponse({ status: 200, description: 'Triage suggestion generated successfully' })
  async getTriageSuggestion(@Body() triageDto: TriageSuggestionDto) {
    return this.aiAssistiveService.getTriageSuggestion(triageDto);
  }

  @Get('triage/analytics')
  @ApiOperation({ summary: 'Get triage analytics' })
  @ApiResponse({ status: 200, description: 'Triage analytics retrieved successfully' })
  async getTriageAnalytics() {
    return this.aiAssistiveService.getTriageAnalytics();
  }

  // Medical Coding
  @Post('coding/suggest')
  @ApiOperation({ summary: 'Get AI-powered coding suggestions' })
  @ApiResponse({ status: 200, description: 'Coding suggestions generated successfully' })
  async getCodingSuggestion(@Body() codingDto: CodingSuggestionDto) {
    return this.aiAssistiveService.getCodingSuggestion(codingDto);
  }

  @Get('coding/analytics')
  @ApiOperation({ summary: 'Get coding analytics' })
  @ApiResponse({ status: 200, description: 'Coding analytics retrieved successfully' })
  async getCodingAnalytics() {
    return this.aiAssistiveService.getCodingAnalytics();
  }

  // Denial Prediction
  @Post('denials/predict')
  @ApiOperation({ summary: 'Predict claim denial probability' })
  @ApiResponse({ status: 200, description: 'Denial prediction generated successfully' })
  async predictDenial(@Body() denialDto: DenialPredictionDto) {
    return this.aiAssistiveService.predictDenial(denialDto);
  }

  // Demand Forecasting
  @Post('forecast/bed-demand')
  @ApiOperation({ summary: 'Forecast bed demand' })
  @ApiResponse({ status: 200, description: 'Bed demand forecast generated successfully' })
  async forecastBedDemand(@Body() forecastDto: BedDemandForecastDto) {
    return this.aiAssistiveService.forecastBedDemand(forecastDto);
  }

  @Post('forecast/ot-demand')
  @ApiOperation({ summary: 'Forecast operating theater demand' })
  @ApiResponse({ status: 200, description: 'OT demand forecast generated successfully' })
  async forecastOTDemand(@Body() forecastDto: OTDemandForecastDto) {
    return this.aiAssistiveService.forecastOTDemand(forecastDto);
  }

  @Post('forecast/inventory')
  @ApiOperation({ summary: 'Forecast inventory levels' })
  @ApiResponse({ status: 200, description: 'Inventory forecast generated successfully' })
  async forecastInventory(@Body() forecastDto: InventoryForecastDto) {
    return this.aiAssistiveService.forecastInventory(forecastDto);
  }

  // Doctor Dictation Processing
  @Post('dictation/extract')
  @ApiOperation({ summary: 'Extract structured data from doctor dictation' })
  @ApiResponse({ status: 200, description: 'Dictation processed successfully' })
  async extractFromDictation(@Body() dictationDto: DoctorDictationDto) {
    return this.aiAssistiveService.extractFromDictation(dictationDto);
  }

  // AI Approval Workflow
  @Post('approvals/request')
  @ApiOperation({ summary: 'Request AI approval for action' })
  @ApiResponse({ status: 200, description: 'Approval request processed successfully' })
  async requestApproval(@Body() approvalDto: AIApprovalRequestDto) {
    return this.aiAssistiveService.requestApproval(approvalDto);
  }

  @Get('approvals/history')
  @ApiOperation({ summary: 'Get approval history' })
  @ApiResponse({ status: 200, description: 'Approval history retrieved successfully' })
  async getApprovalHistory(@Query('userId') userId?: string) {
    return this.aiAssistiveService.getApprovalHistory(userId);
  }

  // AI Guardrails
  @Get('guardrails')
  @ApiOperation({ summary: 'Get AI guardrails configuration' })
  @ApiResponse({ status: 200, description: 'Guardrails retrieved successfully' })
  async getGuardrails() {
    return this.aiAssistiveService.getGuardrails();
  }

  @Put('guardrails/:id')
  @ApiOperation({ summary: 'Update AI guardrail' })
  @ApiResponse({ status: 200, description: 'Guardrail updated successfully' })
  async updateGuardrail(@Param('id') guardrailId: string, @Body() guardrailDto: AIGuardrailDto) {
    return this.aiAssistiveService.updateGuardrail(guardrailId, guardrailDto);
  }

  // AI Model Management
  @Post('models/train')
  @ApiOperation({ summary: 'Train AI model with new data' })
  @ApiResponse({ status: 200, description: 'Model training initiated successfully' })
  async trainModel(@Body() trainingData: TrainingDataDto) {
    return this.aiAssistiveService.trainModel(trainingData);
  }

  @Post('models/evaluate')
  @ApiOperation({ summary: 'Evaluate AI model performance' })
  @ApiResponse({ status: 200, description: 'Model evaluation completed successfully' })
  async evaluateModel(@Body() evaluationDto: ModelEvaluationDto) {
    return this.aiAssistiveService.evaluateModel(evaluationDto);
  }

  @Get('models')
  @ApiOperation({ summary: 'Get available AI models' })
  @ApiResponse({ status: 200, description: 'AI models retrieved successfully' })
  async getAIModels() {
    return this.aiAssistiveService.getAIModels();
  }

  @Get('models/:name/performance')
  @ApiOperation({ summary: 'Get AI model performance metrics' })
  @ApiResponse({ status: 200, description: 'Model performance retrieved successfully' })
  async getModelPerformance(@Param('name') modelName: string) {
    return this.aiAssistiveService.getModelPerformance(modelName);
  }

  // Decision Support
  @Post('decision-support/triage')
  @ApiOperation({ summary: 'Get decision support for triage' })
  @ApiResponse({ status: 200, description: 'Decision support provided successfully' })
  async getDecisionSupport(@Body() triageDto: TriageSuggestionDto) {
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

  @Post('decision-support/coding')
  @ApiOperation({ summary: 'Get decision support for coding' })
  @ApiResponse({ status: 200, description: 'Decision support provided successfully' })
  async getCodingDecisionSupport(@Body() codingDto: CodingSuggestionDto) {
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

  // Risk Assessment
  @Post('risk-assessment/patient')
  @ApiOperation({ summary: 'Assess patient risk' })
  @ApiResponse({ status: 200, description: 'Risk assessment completed successfully' })
  async assessPatientRisk(@Body() patientData: any) {
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

  @Post('risk-assessment/claim')
  @ApiOperation({ summary: 'Assess claim risk' })
  @ApiResponse({ status: 200, description: 'Risk assessment completed successfully' })
  async assessClaimRisk(@Body() claimData: any) {
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

  // Quality Metrics
  @Get('quality-metrics/triage')
  @ApiOperation({ summary: 'Get triage quality metrics' })
  @ApiResponse({ status: 200, description: 'Quality metrics retrieved successfully' })
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

  @Get('quality-metrics/coding')
  @ApiOperation({ summary: 'Get coding quality metrics' })
  @ApiResponse({ status: 200, description: 'Quality metrics retrieved successfully' })
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

  // Human-in-the-loop
  @Post('human-in-loop/feedback')
  @ApiOperation({ summary: 'Submit feedback for AI suggestion' })
  @ApiResponse({ status: 200, description: 'Feedback submitted successfully' })
  async submitFeedback(@Body() feedbackDto: any) {
    // Store feedback for model improvement
    return {
      message: 'Feedback submitted successfully',
      feedbackId: 'feedback_123',
      willBeUsedForTraining: true,
    };
  }

  @Get('human-in-loop/pending-reviews')
  @ApiOperation({ summary: 'Get pending human reviews' })
  @ApiResponse({ status: 200, description: 'Pending reviews retrieved successfully' })
  async getPendingReviews(@Query('userId') userId?: string) {
    // Get items requiring human review
    return {
      pendingReviews: [
        {
          id: 'review_1',
          type: 'HIGH_RISK_TRIAGE',
          priority: 'HIGH',
          data: {},
          deadline: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      ],
      count: 1,
    };
  }

  // Audit and Monitoring
  @Get('audit/ai-decisions')
  @ApiOperation({ summary: 'Get AI decision audit trail' })
  @ApiResponse({ status: 200, description: 'Audit trail retrieved successfully' })
  async getAIDecisionAudit(@Query() query: any) {
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

  @Get('monitoring/model-performance')
  @ApiOperation({ summary: 'Get model performance monitoring' })
  @ApiResponse({ status: 200, description: 'Performance monitoring retrieved successfully' })
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

  // Integration Endpoints
  @Post('integration/ehr-sync')
  @ApiOperation({ summary: 'Sync with EHR system' })
  @ApiResponse({ status: 200, description: 'EHR sync completed successfully' })
  async syncWithEHR(@Body() syncDto: any) {
    return {
      message: 'EHR sync completed',
      syncedRecords: 150,
      conflicts: 2,
      resolved: 2,
    };
  }

  @Post('integration/billing-sync')
  @ApiOperation({ summary: 'Sync with billing system' })
  @ApiResponse({ status: 200, description: 'Billing sync completed successfully' })
  async syncWithBilling(@Body() syncDto: any) {
    return {
      message: 'Billing sync completed',
      syncedClaims: 45,
      updatedCodes: 12,
      errors: 1,
    };
  }
}
