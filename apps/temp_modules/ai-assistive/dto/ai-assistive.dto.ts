import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsArray, IsObject, IsDateString } from 'class-validator';

export enum TriageLevel {
  EMERGENCY = 'EMERGENCY',
  URGENT = 'URGENT',
  ROUTINE = 'ROUTINE',
  NON_URGENT = 'NON_URGENT'
}

export enum PredictionConfidence {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  AUTO_APPROVED = 'AUTO_APPROVED'
}

export enum ForecastType {
  BED_DEMAND = 'BED_DEMAND',
  OT_DEMAND = 'OT_DEMAND',
  INVENTORY = 'INVENTORY',
  STAFFING = 'STAFFING'
}

export enum ExtractionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL'
}

export class TriageSuggestionDto {
  @ApiProperty({ description: 'Patient ID', required: true })
  @IsString()
  patientId: string;

  @ApiProperty({ description: 'Chief complaint', required: true })
  @IsString()
  chiefComplaint: string;

  @ApiPropertyOptional({ description: 'Symptoms description' })
  @IsOptional()
  @IsString()
  symptoms?: string;

  @ApiPropertyOptional({ description: 'Vital signs' })
  @IsOptional()
  @IsObject()
  vitals?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Patient age' })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ description: 'Patient gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Previous conditions' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  previousConditions?: string[];
}

export class TriageResultDto {
  @ApiProperty({ enum: TriageLevel, description: 'Suggested triage level' })
  @IsEnum(TriageLevel)
  triageLevel: TriageLevel;

  @ApiProperty({ enum: PredictionConfidence, description: 'Confidence level' })
  @IsEnum(PredictionConfidence)
  confidence: PredictionConfidence;

  @ApiPropertyOptional({ description: 'Recommended actions' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendedActions?: string[];

  @ApiPropertyOptional({ description: 'Suggested department' })
  @IsOptional()
  @IsString()
  suggestedDepartment?: string;

  @ApiPropertyOptional({ description: 'Estimated wait time in minutes' })
  @IsOptional()
  @IsNumber()
  estimatedWaitTime?: number;

  @ApiPropertyOptional({ description: 'Risk factors identified' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  riskFactors?: string[];

  @ApiPropertyOptional({ description: 'Explanation for triage decision' })
  @IsOptional()
  @IsString()
  explanation?: string;
}

export class CodingSuggestionDto {
  @ApiProperty({ description: 'Diagnosis description', required: true })
  @IsString()
  diagnosis: string;

  @ApiPropertyOptional({ description: 'Procedure description' })
  @IsOptional()
  @IsString()
  procedure?: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiPropertyOptional({ description: 'Patient demographics' })
  @IsOptional()
  @IsObject()
  patientContext?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Insurance information' })
  @IsOptional()
  @IsObject()
  insuranceContext?: Record<string, any>;
}

export class CodingResultDto {
  @ApiPropertyOptional({ description: 'ICD-10 codes' })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  icdCodes?: Array<{
    code: string;
    description: string;
    confidence: number;
  }>;

  @ApiPropertyOptional({ description: 'CPT codes' })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  cptCodes?: Array<{
    code: string;
    description: string;
    confidence: number;
  }>;

  @ApiPropertyOptional({ description: 'HCPCS codes' })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  hcpcsCodes?: Array<{
    code: string;
    description: string;
    confidence: number;
  }>;

  @ApiPropertyOptional({ description: 'Charge amounts' })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  charges?: Array<{
    code: string;
    amount: number;
    description: string;
  }>;

  @ApiPropertyOptional({ description: 'Confidence score' })
  @IsOptional()
  @IsNumber()
  overallConfidence?: number;

  @ApiPropertyOptional({ description: 'Validation warnings' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  warnings?: string[];
}

export class DenialPredictionDto {
  @ApiProperty({ description: 'Claim details', required: true })
  @IsObject()
  claimData: Record<string, any>;

  @ApiPropertyOptional({ description: 'Patient demographics' })
  @IsOptional()
  @IsObject()
  patientContext?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Provider information' })
  @IsOptional()
  @IsObject()
  providerContext?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Historical claims data' })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  historicalClaims?: Record<string, any>[];
}

export class DenialPredictionResultDto {
  @ApiProperty({ description: 'Denial probability (0-1)' })
  @IsNumber()
  denialProbability: number;

  @ApiProperty({ enum: PredictionConfidence, description: 'Confidence level' })
  @IsEnum(PredictionConfidence)
  confidence: PredictionConfidence;

  @ApiPropertyOptional({ description: 'Predicted denial reasons' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  predictedReasons?: string[];

  @ApiPropertyOptional({ description: 'Suggested corrections' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestedCorrections?: string[];

  @ApiPropertyOptional({ description: 'Risk factors' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  riskFactors?: string[];

  @ApiPropertyOptional({ description: 'Expected approval probability after corrections' })
  @IsOptional()
  @IsNumber()
  expectedApprovalAfterCorrections?: number;
}

export class BedDemandForecastDto {
  @ApiProperty({ description: 'Hospital unit/department', required: true })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Forecast horizon in days', required: true })
  @IsNumber()
  horizonDays: number;

  @ApiPropertyOptional({ description: 'Historical data period in days' })
  @IsOptional()
  @IsNumber()
  historicalPeriod?: number;

  @ApiPropertyOptional({ description: 'Include seasonal factors' })
  @IsOptional()
  @IsBoolean()
  includeSeasonal?: boolean;

  @ApiPropertyOptional({ description: 'Include special events' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialEvents?: string[];
}

export class OTDemandForecastDto {
  @ApiProperty({ description: 'Operating theater/room', required: true })
  @IsString()
  operatingTheater: string;

  @ApiProperty({ description: 'Forecast horizon in days', required: true })
  @IsNumber()
  horizonDays: number;

  @ApiPropertyOptional({ description: 'Surgery types to forecast' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  surgeryTypes?: string[];

  @ApiPropertyOptional({ description: 'Include emergency cases' })
  @IsOptional()
  @IsBoolean()
  includeEmergency?: boolean;
}

export class InventoryForecastDto {
  @ApiProperty({ description: 'Item/medication ID', required: true })
  @IsString()
  itemId: string;

  @ApiProperty({ description: 'Forecast horizon in days', required: true })
  @IsNumber()
  horizonDays: number;

  @ApiPropertyOptional({ description: 'Reorder point' })
  @IsOptional()
  @IsNumber()
  reorderPoint?: number;

  @ApiPropertyOptional({ description: 'Safety stock level' })
  @IsOptional()
  @IsNumber()
  safetyStock?: number;
}

export class ForecastResultDto {
  @ApiProperty({ description: 'Forecast type' })
  @IsString()
  forecastType: string;

  @ApiProperty({ description: 'Target resource' })
  @IsString()
  targetResource: string;

  @ApiProperty({ description: 'Forecast data points' })
  @IsArray()
  @IsObject({ each: true })
  forecastData: Array<{
    date: string;
    predictedValue: number;
    confidenceInterval?: {
      lower: number;
      upper: number;
    };
    factors?: Record<string, any>;
  }>;

  @ApiPropertyOptional({ description: 'Accuracy metrics' })
  @IsOptional()
  @IsObject()
  accuracyMetrics?: Record<string, number>;

  @ApiPropertyOptional({ description: 'Recommendations' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendations?: string[];
}

export class DoctorDictationDto {
  @ApiProperty({ description: 'Audio file URL or base64', required: true })
  @IsString()
  audioData: string;

  @ApiPropertyOptional({ description: 'Audio format' })
  @IsOptional()
  @IsString()
  audioFormat?: string;

  @ApiPropertyOptional({ description: 'Patient context' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Visit context' })
  @IsOptional()
  @IsString()
  visitId?: string;

  @ApiPropertyOptional({ description: 'Doctor preferences' })
  @IsOptional()
  @IsObject()
  doctorPreferences?: Record<string, any>;
}

export class ExtractedNoteDto {
  @ApiProperty({ description: 'Extraction status' })
  @IsEnum(ExtractionStatus)
  status: ExtractionStatus;

  @ApiPropertyOptional({ description: 'Extracted text' })
  @IsOptional()
  @IsString()
  extractedText?: string;

  @ApiPropertyOptional({ description: 'Structured data' })
  @IsOptional()
  @IsObject()
  structuredData?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Confidence scores' })
  @IsOptional()
  @IsObject()
  confidenceScores?: Record<string, number>;

  @ApiPropertyOptional({ description: 'Suggested EMR fields' })
  @IsOptional()
  @IsObject()
  suggestedFields?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Validation errors' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  validationErrors?: string[];
}

export class AIApprovalRequestDto {
  @ApiProperty({ description: 'Request type', required: true })
  @IsString()
  requestType: string;

  @ApiProperty({ description: 'Request data', required: true })
  @IsObject()
  requestData: Record<string, any>;

  @ApiPropertyOptional({ description: 'User ID requesting approval' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Urgency level' })
  @IsOptional()
  @IsString()
  urgency?: string;

  @ApiPropertyOptional({ description: 'Auto-approve if confidence > threshold' })
  @IsOptional()
  @IsBoolean()
  autoApprove?: boolean;

  @ApiPropertyOptional({ description: 'Confidence threshold for auto-approval' })
  @IsOptional()
  @IsNumber()
  confidenceThreshold?: number;
}

export class AIApprovalResultDto {
  @ApiProperty({ enum: ApprovalStatus, description: 'Approval status' })
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @ApiPropertyOptional({ description: 'Confidence score' })
  @IsOptional()
  @IsNumber()
  confidence?: number;

  @ApiPropertyOptional({ description: 'Approved by (user or system)' })
  @IsOptional()
  @IsString()
  approvedBy?: string;

  @ApiPropertyOptional({ description: 'Approval timestamp' })
  @IsOptional()
  @IsString()
  approvedAt?: string;

  @ApiPropertyOptional({ description: 'Comments from approver' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ description: 'Suggested modifications' })
  @IsOptional()
  @IsObject()
  suggestedModifications?: Record<string, any>;
}

export class AIGuardrailDto {
  @ApiProperty({ description: 'Guardrail name', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Guardrail type', required: true })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Guardrail configuration' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Enabled by default' })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({ description: 'Severity level' })
  @IsOptional()
  @IsString()
  severity?: string;
}

export class TrainingDataDto {
  @ApiProperty({ description: 'Data type', required: true })
  @IsString()
  dataType: string;

  @ApiProperty({ description: 'Training data', required: true })
  @IsArray()
  @IsObject({ each: true })
  data: Record<string, any>[];

  @ApiPropertyOptional({ description: 'Labels for supervised learning' })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  labels?: Record<string, any>[];

  @ApiPropertyOptional({ description: 'Metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ModelEvaluationDto {
  @ApiProperty({ description: 'Model name', required: true })
  @IsString()
  modelName: string;

  @ApiPropertyOptional({ description: 'Evaluation dataset' })
  @IsOptional()
  @IsString()
  dataset?: string;

  @ApiPropertyOptional({ description: 'Evaluation metrics' })
  @IsOptional()
  @IsObject()
  metrics?: Record<string, number>;

  @ApiPropertyOptional({ description: 'Evaluation results' })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  results?: Record<string, any>[];
}

export class AIModelDto {
  @ApiProperty({ description: 'Model name', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Model version', required: true })
  @IsString()
  version: string;

  @ApiPropertyOptional({ description: 'Model description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Model type' })
  @IsOptional()
  @IsString()
  modelType?: string;

  @ApiPropertyOptional({ description: 'Model status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Performance metrics' })
  @IsOptional()
  @IsObject()
  performance?: Record<string, number>;
}
