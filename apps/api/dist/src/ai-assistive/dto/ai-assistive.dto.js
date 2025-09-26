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
exports.AIModelDto = exports.ModelEvaluationDto = exports.TrainingDataDto = exports.AIGuardrailDto = exports.AIApprovalResultDto = exports.AIApprovalRequestDto = exports.ExtractedNoteDto = exports.DoctorDictationDto = exports.ForecastResultDto = exports.InventoryForecastDto = exports.OTDemandForecastDto = exports.BedDemandForecastDto = exports.DenialPredictionResultDto = exports.DenialPredictionDto = exports.CodingResultDto = exports.CodingSuggestionDto = exports.TriageResultDto = exports.TriageSuggestionDto = exports.ExtractionStatus = exports.ForecastType = exports.ApprovalStatus = exports.PredictionConfidence = exports.TriageLevel = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TriageLevel;
(function (TriageLevel) {
    TriageLevel["EMERGENCY"] = "EMERGENCY";
    TriageLevel["URGENT"] = "URGENT";
    TriageLevel["ROUTINE"] = "ROUTINE";
    TriageLevel["NON_URGENT"] = "NON_URGENT";
})(TriageLevel || (exports.TriageLevel = TriageLevel = {}));
var PredictionConfidence;
(function (PredictionConfidence) {
    PredictionConfidence["HIGH"] = "HIGH";
    PredictionConfidence["MEDIUM"] = "MEDIUM";
    PredictionConfidence["LOW"] = "LOW";
})(PredictionConfidence || (exports.PredictionConfidence = PredictionConfidence = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
    ApprovalStatus["AUTO_APPROVED"] = "AUTO_APPROVED";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
var ForecastType;
(function (ForecastType) {
    ForecastType["BED_DEMAND"] = "BED_DEMAND";
    ForecastType["OT_DEMAND"] = "OT_DEMAND";
    ForecastType["INVENTORY"] = "INVENTORY";
    ForecastType["STAFFING"] = "STAFFING";
})(ForecastType || (exports.ForecastType = ForecastType = {}));
var ExtractionStatus;
(function (ExtractionStatus) {
    ExtractionStatus["PENDING"] = "PENDING";
    ExtractionStatus["PROCESSING"] = "PROCESSING";
    ExtractionStatus["COMPLETED"] = "COMPLETED";
    ExtractionStatus["FAILED"] = "FAILED";
    ExtractionStatus["PARTIAL"] = "PARTIAL";
})(ExtractionStatus || (exports.ExtractionStatus = ExtractionStatus = {}));
class TriageSuggestionDto {
    patientId;
    chiefComplaint;
    symptoms;
    vitals;
    age;
    gender;
    previousConditions;
}
exports.TriageSuggestionDto = TriageSuggestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriageSuggestionDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Chief complaint', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriageSuggestionDto.prototype, "chiefComplaint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Symptoms description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriageSuggestionDto.prototype, "symptoms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Vital signs' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TriageSuggestionDto.prototype, "vitals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient age' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TriageSuggestionDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient gender' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriageSuggestionDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Previous conditions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], TriageSuggestionDto.prototype, "previousConditions", void 0);
class TriageResultDto {
    triageLevel;
    confidence;
    recommendedActions;
    suggestedDepartment;
    estimatedWaitTime;
    riskFactors;
    explanation;
}
exports.TriageResultDto = TriageResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TriageLevel, description: 'Suggested triage level' }),
    (0, class_validator_1.IsEnum)(TriageLevel),
    __metadata("design:type", String)
], TriageResultDto.prototype, "triageLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PredictionConfidence, description: 'Confidence level' }),
    (0, class_validator_1.IsEnum)(PredictionConfidence),
    __metadata("design:type", String)
], TriageResultDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recommended actions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], TriageResultDto.prototype, "recommendedActions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Suggested department' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriageResultDto.prototype, "suggestedDepartment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estimated wait time in minutes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TriageResultDto.prototype, "estimatedWaitTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Risk factors identified' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], TriageResultDto.prototype, "riskFactors", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Explanation for triage decision' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriageResultDto.prototype, "explanation", void 0);
class CodingSuggestionDto {
    diagnosis;
    procedure;
    service;
    patientContext;
    insuranceContext;
}
exports.CodingSuggestionDto = CodingSuggestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diagnosis description', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CodingSuggestionDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Procedure description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CodingSuggestionDto.prototype, "procedure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CodingSuggestionDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient demographics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CodingSuggestionDto.prototype, "patientContext", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Insurance information' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CodingSuggestionDto.prototype, "insuranceContext", void 0);
class CodingResultDto {
    icdCodes;
    cptCodes;
    hcpcsCodes;
    charges;
    overallConfidence;
    warnings;
}
exports.CodingResultDto = CodingResultDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ICD-10 codes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], CodingResultDto.prototype, "icdCodes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'CPT codes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], CodingResultDto.prototype, "cptCodes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'HCPCS codes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], CodingResultDto.prototype, "hcpcsCodes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Charge amounts' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], CodingResultDto.prototype, "charges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Confidence score' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CodingResultDto.prototype, "overallConfidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Validation warnings' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CodingResultDto.prototype, "warnings", void 0);
class DenialPredictionDto {
    claimData;
    patientContext;
    providerContext;
    historicalClaims;
}
exports.DenialPredictionDto = DenialPredictionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Claim details', required: true }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], DenialPredictionDto.prototype, "claimData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient demographics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], DenialPredictionDto.prototype, "patientContext", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provider information' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], DenialPredictionDto.prototype, "providerContext", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Historical claims data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], DenialPredictionDto.prototype, "historicalClaims", void 0);
class DenialPredictionResultDto {
    denialProbability;
    confidence;
    predictedReasons;
    suggestedCorrections;
    riskFactors;
    expectedApprovalAfterCorrections;
}
exports.DenialPredictionResultDto = DenialPredictionResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Denial probability (0-1)' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DenialPredictionResultDto.prototype, "denialProbability", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PredictionConfidence, description: 'Confidence level' }),
    (0, class_validator_1.IsEnum)(PredictionConfidence),
    __metadata("design:type", String)
], DenialPredictionResultDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Predicted denial reasons' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], DenialPredictionResultDto.prototype, "predictedReasons", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Suggested corrections' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], DenialPredictionResultDto.prototype, "suggestedCorrections", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Risk factors' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], DenialPredictionResultDto.prototype, "riskFactors", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expected approval probability after corrections' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DenialPredictionResultDto.prototype, "expectedApprovalAfterCorrections", void 0);
class BedDemandForecastDto {
    unit;
    horizonDays;
    historicalPeriod;
    includeSeasonal;
    specialEvents;
}
exports.BedDemandForecastDto = BedDemandForecastDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hospital unit/department', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BedDemandForecastDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Forecast horizon in days', required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BedDemandForecastDto.prototype, "horizonDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Historical data period in days' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BedDemandForecastDto.prototype, "historicalPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include seasonal factors' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BedDemandForecastDto.prototype, "includeSeasonal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include special events' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BedDemandForecastDto.prototype, "specialEvents", void 0);
class OTDemandForecastDto {
    operatingTheater;
    horizonDays;
    surgeryTypes;
    includeEmergency;
}
exports.OTDemandForecastDto = OTDemandForecastDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Operating theater/room', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OTDemandForecastDto.prototype, "operatingTheater", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Forecast horizon in days', required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OTDemandForecastDto.prototype, "horizonDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Surgery types to forecast' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], OTDemandForecastDto.prototype, "surgeryTypes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include emergency cases' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], OTDemandForecastDto.prototype, "includeEmergency", void 0);
class InventoryForecastDto {
    itemId;
    horizonDays;
    reorderPoint;
    safetyStock;
}
exports.InventoryForecastDto = InventoryForecastDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item/medication ID', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InventoryForecastDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Forecast horizon in days', required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InventoryForecastDto.prototype, "horizonDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reorder point' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InventoryForecastDto.prototype, "reorderPoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Safety stock level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InventoryForecastDto.prototype, "safetyStock", void 0);
class ForecastResultDto {
    forecastType;
    targetResource;
    forecastData;
    accuracyMetrics;
    recommendations;
}
exports.ForecastResultDto = ForecastResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Forecast type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ForecastResultDto.prototype, "forecastType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target resource' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ForecastResultDto.prototype, "targetResource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Forecast data points' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], ForecastResultDto.prototype, "forecastData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accuracy metrics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ForecastResultDto.prototype, "accuracyMetrics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recommendations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ForecastResultDto.prototype, "recommendations", void 0);
class DoctorDictationDto {
    audioData;
    audioFormat;
    patientId;
    visitId;
    doctorPreferences;
}
exports.DoctorDictationDto = DoctorDictationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Audio file URL or base64', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DoctorDictationDto.prototype, "audioData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Audio format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DoctorDictationDto.prototype, "audioFormat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient context' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DoctorDictationDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Visit context' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DoctorDictationDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Doctor preferences' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], DoctorDictationDto.prototype, "doctorPreferences", void 0);
class ExtractedNoteDto {
    status;
    extractedText;
    structuredData;
    confidenceScores;
    suggestedFields;
    validationErrors;
}
exports.ExtractedNoteDto = ExtractedNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Extraction status' }),
    (0, class_validator_1.IsEnum)(ExtractionStatus),
    __metadata("design:type", String)
], ExtractedNoteDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Extracted text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExtractedNoteDto.prototype, "extractedText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Structured data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ExtractedNoteDto.prototype, "structuredData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Confidence scores' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ExtractedNoteDto.prototype, "confidenceScores", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Suggested EMR fields' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ExtractedNoteDto.prototype, "suggestedFields", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Validation errors' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ExtractedNoteDto.prototype, "validationErrors", void 0);
class AIApprovalRequestDto {
    requestType;
    requestData;
    userId;
    urgency;
    autoApprove;
    confidenceThreshold;
}
exports.AIApprovalRequestDto = AIApprovalRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Request type', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIApprovalRequestDto.prototype, "requestType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Request data', required: true }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AIApprovalRequestDto.prototype, "requestData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID requesting approval' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIApprovalRequestDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Urgency level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIApprovalRequestDto.prototype, "urgency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto-approve if confidence > threshold' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AIApprovalRequestDto.prototype, "autoApprove", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Confidence threshold for auto-approval' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AIApprovalRequestDto.prototype, "confidenceThreshold", void 0);
class AIApprovalResultDto {
    status;
    confidence;
    approvedBy;
    approvedAt;
    comments;
    suggestedModifications;
}
exports.AIApprovalResultDto = AIApprovalResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ApprovalStatus, description: 'Approval status' }),
    (0, class_validator_1.IsEnum)(ApprovalStatus),
    __metadata("design:type", String)
], AIApprovalResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Confidence score' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AIApprovalResultDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approved by (user or system)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIApprovalResultDto.prototype, "approvedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approval timestamp' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIApprovalResultDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Comments from approver' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIApprovalResultDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Suggested modifications' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AIApprovalResultDto.prototype, "suggestedModifications", void 0);
class AIGuardrailDto {
    name;
    type;
    config;
    enabled;
    severity;
}
exports.AIGuardrailDto = AIGuardrailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Guardrail name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIGuardrailDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Guardrail type', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIGuardrailDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Guardrail configuration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AIGuardrailDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enabled by default' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AIGuardrailDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Severity level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIGuardrailDto.prototype, "severity", void 0);
class TrainingDataDto {
    dataType;
    data;
    labels;
    metadata;
}
exports.TrainingDataDto = TrainingDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data type', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrainingDataDto.prototype, "dataType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Training data', required: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], TrainingDataDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Labels for supervised learning' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], TrainingDataDto.prototype, "labels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TrainingDataDto.prototype, "metadata", void 0);
class ModelEvaluationDto {
    modelName;
    dataset;
    metrics;
    results;
}
exports.ModelEvaluationDto = ModelEvaluationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Model name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModelEvaluationDto.prototype, "modelName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Evaluation dataset' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModelEvaluationDto.prototype, "dataset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Evaluation metrics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ModelEvaluationDto.prototype, "metrics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Evaluation results' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], ModelEvaluationDto.prototype, "results", void 0);
class AIModelDto {
    name;
    version;
    description;
    modelType;
    status;
    performance;
}
exports.AIModelDto = AIModelDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Model name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIModelDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Model version', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIModelDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Model description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIModelDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Model type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIModelDto.prototype, "modelType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Model status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AIModelDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Performance metrics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AIModelDto.prototype, "performance", void 0);
//# sourceMappingURL=ai-assistive.dto.js.map