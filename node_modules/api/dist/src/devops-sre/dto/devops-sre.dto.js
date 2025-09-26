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
exports.TraceQueryDto = exports.LogQueryDto = exports.MigrationRequestDto = exports.UpdateFeatureFlagDto = exports.CreateFeatureFlagDto = exports.UpdateSLODto = exports.CreateSLODto = exports.UpdateAlertRuleDto = exports.CreateAlertRuleDto = exports.MetricQueryDto = exports.CreateMetricDto = exports.RestoreRequestDto = exports.BackupFilterDto = exports.CreateBackupDto = exports.IncidentFilterDto = exports.UpdateIncidentDto = exports.CreateIncidentDto = exports.DeploymentListDto = exports.DeploymentFilterDto = exports.CreateDeploymentDto = exports.AlertSeverity = exports.MetricType = exports.BackupStatus = exports.IncidentStatus = exports.IncidentSeverity = exports.DeploymentStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var DeploymentStatus;
(function (DeploymentStatus) {
    DeploymentStatus["PENDING"] = "PENDING";
    DeploymentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DeploymentStatus["SUCCESS"] = "SUCCESS";
    DeploymentStatus["FAILED"] = "FAILED";
    DeploymentStatus["ROLLED_BACK"] = "ROLLED_BACK";
})(DeploymentStatus || (exports.DeploymentStatus = DeploymentStatus = {}));
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["LOW"] = "LOW";
    IncidentSeverity["MEDIUM"] = "MEDIUM";
    IncidentSeverity["HIGH"] = "HIGH";
    IncidentSeverity["CRITICAL"] = "CRITICAL";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["OPEN"] = "OPEN";
    IncidentStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    IncidentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    IncidentStatus["RESOLVED"] = "RESOLVED";
    IncidentStatus["CLOSED"] = "CLOSED";
})(IncidentStatus || (exports.IncidentStatus = IncidentStatus = {}));
var BackupStatus;
(function (BackupStatus) {
    BackupStatus["PENDING"] = "PENDING";
    BackupStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BackupStatus["COMPLETED"] = "COMPLETED";
    BackupStatus["FAILED"] = "FAILED";
    BackupStatus["PARTIAL"] = "PARTIAL";
})(BackupStatus || (exports.BackupStatus = BackupStatus = {}));
var MetricType;
(function (MetricType) {
    MetricType["COUNTER"] = "COUNTER";
    MetricType["GAUGE"] = "GAUGE";
    MetricType["HISTOGRAM"] = "HISTOGRAM";
    MetricType["SUMMARY"] = "SUMMARY";
})(MetricType || (exports.MetricType = MetricType = {}));
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["INFO"] = "INFO";
    AlertSeverity["WARNING"] = "WARNING";
    AlertSeverity["ERROR"] = "ERROR";
    AlertSeverity["CRITICAL"] = "CRITICAL";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
class CreateDeploymentDto {
    version;
    environment;
    description;
    features;
    configChanges;
    rollbackPlan;
}
exports.CreateDeploymentDto = CreateDeploymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deployment version', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeploymentDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Environment to deploy to', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeploymentDto.prototype, "environment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deployment description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeploymentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Features included in deployment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDeploymentDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Configuration changes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateDeploymentDto.prototype, "configChanges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rollback plan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeploymentDto.prototype, "rollbackPlan", void 0);
class DeploymentFilterDto {
    environment;
    status;
    version;
    dateFrom;
    dateTo;
}
exports.DeploymentFilterDto = DeploymentFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by environment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeploymentFilterDto.prototype, "environment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DeploymentStatus),
    __metadata("design:type", String)
], DeploymentFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by version' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeploymentFilterDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date from' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeploymentFilterDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeploymentFilterDto.prototype, "dateTo", void 0);
class DeploymentListDto {
    page;
    limit;
    sortBy;
    sortOrder;
}
exports.DeploymentListDto = DeploymentListDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DeploymentListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DeploymentListDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort by field' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeploymentListDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort order', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DeploymentListDto.prototype, "sortOrder", void 0);
class CreateIncidentDto {
    title;
    description;
    severity;
    affectedServices;
    environment;
    errorDetails;
    stepsToReproduce;
    workaround;
}
exports.CreateIncidentDto = CreateIncidentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Incident title', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Incident description', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: IncidentSeverity, description: 'Incident severity', required: true }),
    (0, class_validator_1.IsEnum)(IncidentSeverity),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Affected services' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateIncidentDto.prototype, "affectedServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Environment affected' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "environment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Error details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateIncidentDto.prototype, "errorDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Steps to reproduce' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "stepsToReproduce", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Workaround available' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIncidentDto.prototype, "workaround", void 0);
class UpdateIncidentDto {
    title;
    description;
    severity;
    status;
    affectedServices;
    errorDetails;
    stepsToReproduce;
    workaround;
    resolution;
    rootCause;
    preventionMeasures;
}
exports.UpdateIncidentDto = UpdateIncidentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: IncidentSeverity }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(IncidentSeverity),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: IncidentStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(IncidentStatus),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateIncidentDto.prototype, "affectedServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateIncidentDto.prototype, "errorDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "stepsToReproduce", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "workaround", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "resolution", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "rootCause", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentDto.prototype, "preventionMeasures", void 0);
class IncidentFilterDto {
    severity;
    status;
    environment;
    service;
    assignedTo;
    dateFrom;
    dateTo;
}
exports.IncidentFilterDto = IncidentFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: IncidentSeverity }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(IncidentSeverity),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: IncidentStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(IncidentStatus),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "environment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "dateTo", void 0);
class CreateBackupDto {
    name;
    description;
    backupType;
    tenantIds;
    dataTypes;
    compression;
    encryption;
}
exports.CreateBackupDto = CreateBackupDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Backup name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBackupDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Backup description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBackupDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Backup type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBackupDto.prototype, "backupType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include specific tenants' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBackupDto.prototype, "tenantIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include specific data types' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBackupDto.prototype, "dataTypes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Compression enabled' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBackupDto.prototype, "compression", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Encryption enabled' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBackupDto.prototype, "encryption", void 0);
class BackupFilterDto {
    status;
    backupType;
    tenantId;
    dateFrom;
    dateTo;
}
exports.BackupFilterDto = BackupFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BackupStatus),
    __metadata("design:type", String)
], BackupFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BackupFilterDto.prototype, "backupType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BackupFilterDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BackupFilterDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BackupFilterDto.prototype, "dateTo", void 0);
class RestoreRequestDto {
    backupId;
    targetEnvironment;
    pointInTime;
    tenantIds;
    testRestore;
}
exports.RestoreRequestDto = RestoreRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Backup ID to restore from', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RestoreRequestDto.prototype, "backupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target environment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RestoreRequestDto.prototype, "targetEnvironment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Point in time to restore to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RestoreRequestDto.prototype, "pointInTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specific tenants to restore' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RestoreRequestDto.prototype, "tenantIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Test restore only' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RestoreRequestDto.prototype, "testRestore", void 0);
class CreateMetricDto {
    name;
    type;
    description;
    labels;
    value;
    timestamp;
}
exports.CreateMetricDto = CreateMetricDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: MetricType, description: 'Metric type', required: true }),
    (0, class_validator_1.IsEnum)(MetricType),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric labels' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateMetricDto.prototype, "labels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric value' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMetricDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMetricDto.prototype, "timestamp", void 0);
class MetricQueryDto {
    metricName;
    labelFilters;
    startTime;
    endTime;
    step;
}
exports.MetricQueryDto = MetricQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MetricQueryDto.prototype, "metricName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Label filters' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MetricQueryDto.prototype, "labelFilters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Time range start' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MetricQueryDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Time range end' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MetricQueryDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Step interval' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MetricQueryDto.prototype, "step", void 0);
class CreateAlertRuleDto {
    name;
    query;
    severity;
    description;
    threshold;
    operator;
    evaluationInterval;
    forDuration;
    notificationChannels;
    labels;
}
exports.CreateAlertRuleDto = CreateAlertRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert query', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AlertSeverity, description: 'Alert severity', required: true }),
    (0, class_validator_1.IsEnum)(AlertSeverity),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Alert description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Threshold value' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAlertRuleDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Threshold operator' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Evaluation interval in seconds' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAlertRuleDto.prototype, "evaluationInterval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'For duration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertRuleDto.prototype, "forDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notification channels' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateAlertRuleDto.prototype, "notificationChannels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Alert labels' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAlertRuleDto.prototype, "labels", void 0);
class UpdateAlertRuleDto {
    name;
    query;
    severity;
    description;
    threshold;
    operator;
    evaluationInterval;
    forDuration;
    notificationChannels;
    labels;
    enabled;
}
exports.UpdateAlertRuleDto = UpdateAlertRuleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: AlertSeverity }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AlertSeverity),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateAlertRuleDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateAlertRuleDto.prototype, "evaluationInterval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAlertRuleDto.prototype, "forDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateAlertRuleDto.prototype, "notificationChannels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateAlertRuleDto.prototype, "labels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAlertRuleDto.prototype, "enabled", void 0);
class CreateSLODto {
    name;
    description;
    serviceName;
    targetPercentage;
    timeWindow;
    query;
    alertThresholds;
}
exports.CreateSLODto = CreateSLODto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SLO name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSLODto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SLO description', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSLODto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Service name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSLODto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SLO target percentage (99.9)', required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSLODto.prototype, "targetPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Time window (30d)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSLODto.prototype, "timeWindow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'SLO query' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSLODto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Alert thresholds' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSLODto.prototype, "alertThresholds", void 0);
class UpdateSLODto {
    name;
    description;
    targetPercentage;
    timeWindow;
    query;
    alertThresholds;
    enabled;
}
exports.UpdateSLODto = UpdateSLODto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSLODto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSLODto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSLODto.prototype, "targetPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSLODto.prototype, "timeWindow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSLODto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateSLODto.prototype, "alertThresholds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSLODto.prototype, "enabled", void 0);
class CreateFeatureFlagDto {
    key;
    name;
    description;
    defaultValue;
    targetingRules;
    prerequisites;
}
exports.CreateFeatureFlagDto = CreateFeatureFlagDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feature flag key', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feature flag name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Feature flag description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeatureFlagDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default value' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFeatureFlagDto.prototype, "defaultValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Targeting rules' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateFeatureFlagDto.prototype, "targetingRules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Prerequisites' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateFeatureFlagDto.prototype, "prerequisites", void 0);
class UpdateFeatureFlagDto {
    name;
    description;
    defaultValue;
    targetingRules;
    prerequisites;
    enabled;
}
exports.UpdateFeatureFlagDto = UpdateFeatureFlagDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFeatureFlagDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFeatureFlagDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFeatureFlagDto.prototype, "defaultValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateFeatureFlagDto.prototype, "targetingRules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateFeatureFlagDto.prototype, "prerequisites", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFeatureFlagDto.prototype, "enabled", void 0);
class MigrationRequestDto {
    migrationName;
    targetVersion;
    options;
    dryRun;
    force;
}
exports.MigrationRequestDto = MigrationRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Migration name', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MigrationRequestDto.prototype, "migrationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target version' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MigrationRequestDto.prototype, "targetVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Migration options' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MigrationRequestDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dry run only' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MigrationRequestDto.prototype, "dryRun", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Force migration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MigrationRequestDto.prototype, "force", void 0);
class LogQueryDto {
    level;
    service;
    startTime;
    endTime;
    query;
    limit;
}
exports.LogQueryDto = LogQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Log level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LogQueryDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LogQueryDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LogQueryDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LogQueryDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search query' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LogQueryDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Limit results' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LogQueryDto.prototype, "limit", void 0);
class TraceQueryDto {
    service;
    operation;
    traceId;
    startTime;
    endTime;
    minDuration;
}
exports.TraceQueryDto = TraceQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TraceQueryDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Operation name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TraceQueryDto.prototype, "operation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Trace ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TraceQueryDto.prototype, "traceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TraceQueryDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TraceQueryDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum duration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TraceQueryDto.prototype, "minDuration", void 0);
//# sourceMappingURL=devops-sre.dto.js.map