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
exports.DevOpsSreController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const devops_sre_service_1 = require("../services/devops-sre.service");
const devops_sre_dto_1 = require("../dto/devops-sre.dto");
let DevOpsSreController = class DevOpsSreController {
    devOpsSreService;
    constructor(devOpsSreService) {
        this.devOpsSreService = devOpsSreService;
    }
    async createDeployment(createDto, req) {
        return this.devOpsSreService.createDeployment(createDto, req.user.id);
    }
    async getDeployments(filterDto, listDto) {
        return this.devOpsSreService.getDeployments(filterDto, listDto);
    }
    async getDeployment(id) {
        return this.devOpsSreService.getDeployment(id);
    }
    async rollbackDeployment(deploymentId, req) {
        return this.devOpsSreService.rollbackDeployment(deploymentId, req.user.id);
    }
    async createIncident(createDto, req) {
        return this.devOpsSreService.createIncident(createDto, req.user.id);
    }
    async updateIncident(id, updateDto) {
        return this.devOpsSreService.updateIncident(id, updateDto);
    }
    async getIncidents(filterDto, listDto) {
        return this.devOpsSreService.getIncidents(filterDto, listDto);
    }
    async getIncident(id) {
        return this.devOpsSreService.getIncident(id);
    }
    async createBackup(createDto) {
        return this.devOpsSreService.createBackup(createDto);
    }
    async getBackups(filterDto, listDto) {
        return this.devOpsSreService.getBackups(filterDto, listDto);
    }
    async restoreFromBackup(restoreDto) {
        return this.devOpsSreService.restoreFromBackup(restoreDto);
    }
    async recordMetric(metricDto) {
        return this.devOpsSreService.recordMetric(metricDto);
    }
    async queryMetrics(queryDto) {
        return this.devOpsSreService.queryMetrics(queryDto);
    }
    async createAlertRule(ruleDto) {
        return this.devOpsSreService.createAlertRule(ruleDto);
    }
    async updateAlertRule(id, updateDto) {
        return this.devOpsSreService.updateAlertRule(id, updateDto);
    }
    async getAlertRules() {
        return this.devOpsSreService.getAlertRules();
    }
    async createSLO(sloDto) {
        return this.devOpsSreService.createSLO(sloDto);
    }
    async updateSLO(id, updateDto) {
        return this.devOpsSreService.updateSLO(id, updateDto);
    }
    async getSLOs() {
        return this.devOpsSreService.getSLOs();
    }
    async createFeatureFlag(flagDto) {
        return this.devOpsSreService.createFeatureFlag(flagDto);
    }
    async updateFeatureFlag(id, updateDto) {
        return this.devOpsSreService.updateFeatureFlag(id, updateDto);
    }
    async getFeatureFlags() {
        return this.devOpsSreService.getFeatureFlags();
    }
    async evaluateFeatureFlag(flagKey, context) {
        return this.devOpsSreService.evaluateFeatureFlag(flagKey, context);
    }
    async runMigration(migrationDto) {
        return this.devOpsSreService.runMigration(migrationDto);
    }
    async getLogs(queryDto) {
        return this.devOpsSreService.getLogs(queryDto);
    }
    async getTraces(queryDto) {
        return this.devOpsSreService.getTraces(queryDto);
    }
    async getSystemHealth() {
        return this.devOpsSreService.getSystemHealth();
    }
    async promoteCanary(promotionDto) {
        return { message: 'Canary promotion initiated', status: 'IN_PROGRESS' };
    }
    async getCanaryStatus(version) {
        return {
            version,
            status: 'ACTIVE',
            trafficPercentage: 10,
            metrics: {
                errorRate: 0.001,
                latency: 150,
                successRate: 99.9,
            },
        };
    }
    async getMigrationPlaybook(playbookName) {
        return {
            name: playbookName,
            steps: [],
            rollbackProcedure: '',
            verificationSteps: [],
        };
    }
    async executePlaybook(playbookName, executionDto) {
        return {
            playbook: playbookName,
            status: 'EXECUTING',
            currentStep: 1,
            totalSteps: 5,
        };
    }
};
exports.DevOpsSreController = DevOpsSreController;
__decorate([
    (0, common_1.Post)('deployments'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new deployment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Deployment created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.CreateDeploymentDto, Object]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "createDeployment", null);
__decorate([
    (0, common_1.Get)('deployments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deployments with filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deployments retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.DeploymentFilterDto,
        devops_sre_dto_1.DeploymentListDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getDeployments", null);
__decorate([
    (0, common_1.Get)('deployments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deployment by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deployment retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getDeployment", null);
__decorate([
    (0, common_1.Post)('deployments/:id/rollback'),
    (0, swagger_1.ApiOperation)({ summary: 'Rollback deployment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deployment rollback initiated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "rollbackDeployment", null);
__decorate([
    (0, common_1.Post)('incidents'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new incident' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Incident created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.CreateIncidentDto, Object]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "createIncident", null);
__decorate([
    (0, common_1.Put)('incidents/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update incident' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, devops_sre_dto_1.UpdateIncidentDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "updateIncident", null);
__decorate([
    (0, common_1.Get)('incidents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incidents with filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incidents retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.IncidentFilterDto,
        devops_sre_dto_1.DeploymentListDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getIncidents", null);
__decorate([
    (0, common_1.Get)('incidents/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getIncident", null);
__decorate([
    (0, common_1.Post)('backups'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new backup' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Backup created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.CreateBackupDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "createBackup", null);
__decorate([
    (0, common_1.Get)('backups'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backups with filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backups retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.BackupFilterDto,
        devops_sre_dto_1.DeploymentListDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getBackups", null);
__decorate([
    (0, common_1.Post)('restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore from backup' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Restore initiated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.RestoreRequestDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "restoreFromBackup", null);
__decorate([
    (0, common_1.Post)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Record a metric' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Metric recorded successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.CreateMetricDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "recordMetric", null);
__decorate([
    (0, common_1.Post)('metrics/query'),
    (0, swagger_1.ApiOperation)({ summary: 'Query metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Metrics retrieved successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.MetricQueryDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "queryMetrics", null);
__decorate([
    (0, common_1.Post)('alerts/rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create alert rule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alert rule created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.CreateAlertRuleDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "createAlertRule", null);
__decorate([
    (0, common_1.Put)('alerts/rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update alert rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, devops_sre_dto_1.UpdateAlertRuleDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "updateAlertRule", null);
__decorate([
    (0, common_1.Get)('alerts/rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all alert rules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rules retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getAlertRules", null);
__decorate([
    (0, common_1.Post)('slos'),
    (0, swagger_1.ApiOperation)({ summary: 'Create SLO' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'SLO created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.CreateSLODto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "createSLO", null);
__decorate([
    (0, common_1.Put)('slos/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update SLO' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SLO updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, devops_sre_dto_1.UpdateSLODto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "updateSLO", null);
__decorate([
    (0, common_1.Get)('slos'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SLOs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SLOs retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getSLOs", null);
__decorate([
    (0, common_1.Post)('feature-flags'),
    (0, swagger_1.ApiOperation)({ summary: 'Create feature flag' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Feature flag created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.CreateFeatureFlagDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "createFeatureFlag", null);
__decorate([
    (0, common_1.Put)('feature-flags/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update feature flag' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feature flag updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, devops_sre_dto_1.UpdateFeatureFlagDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "updateFeatureFlag", null);
__decorate([
    (0, common_1.Get)('feature-flags'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all feature flags' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feature flags retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getFeatureFlags", null);
__decorate([
    (0, common_1.Get)('feature-flags/:key/evaluate'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate feature flag' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feature flag evaluated successfully' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "evaluateFeatureFlag", null);
__decorate([
    (0, common_1.Post)('migrations/run'),
    (0, swagger_1.ApiOperation)({ summary: 'Run database migration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Migration executed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.MigrationRequestDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "runMigration", null);
__decorate([
    (0, common_1.Post)('logs/query'),
    (0, swagger_1.ApiOperation)({ summary: 'Query logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logs retrieved successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.LogQueryDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Post)('traces/query'),
    (0, swagger_1.ApiOperation)({ summary: 'Query traces' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Traces retrieved successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devops_sre_dto_1.TraceQueryDto]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getTraces", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system health status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System health retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Post)('canary/promote'),
    (0, swagger_1.ApiOperation)({ summary: 'Promote canary release' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Canary release promoted successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "promoteCanary", null);
__decorate([
    (0, common_1.Get)('canary/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get canary release status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Canary status retrieved successfully' }),
    __param(0, (0, common_1.Query)('version')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getCanaryStatus", null);
__decorate([
    (0, common_1.Get)('playbooks/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Get migration playbook' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Migration playbook retrieved successfully' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "getMigrationPlaybook", null);
__decorate([
    (0, common_1.Post)('playbooks/:name/execute'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute migration playbook' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Playbook execution initiated' }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevOpsSreController.prototype, "executePlaybook", null);
exports.DevOpsSreController = DevOpsSreController = __decorate([
    (0, swagger_1.ApiTags)('DevOps/SRE & Observability'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('devops-sre'),
    __metadata("design:paramtypes", [devops_sre_service_1.DevOpsSreService])
], DevOpsSreController);
//# sourceMappingURL=devops-sre.controller.js.map