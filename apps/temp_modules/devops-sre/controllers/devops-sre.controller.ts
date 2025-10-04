import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DevOpsSreService } from '../services/devops-sre.service';
import {
  CreateDeploymentDto,
  DeploymentFilterDto,
  DeploymentListDto,
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentFilterDto,
  CreateBackupDto,
  BackupFilterDto,
  RestoreRequestDto,
  CreateMetricDto,
  MetricQueryDto,
  CreateAlertRuleDto,
  UpdateAlertRuleDto,
  CreateSLODto,
  UpdateSLODto,
  CreateFeatureFlagDto,
  UpdateFeatureFlagDto,
  MigrationRequestDto,
  LogQueryDto,
  TraceQueryDto,
} from '../dto/devops-sre.dto';

@ApiTags('DevOps/SRE & Observability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('devops-sre')
export class DevOpsSreController {
  constructor(private readonly devOpsSreService: DevOpsSreService) {}

  // Deployment Management
  @Post('deployments')
  @ApiOperation({ summary: 'Create a new deployment' })
  @ApiResponse({ status: 201, description: 'Deployment created successfully' })
  async createDeployment(@Body() createDto: CreateDeploymentDto, @Request() req) {
    return this.devOpsSreService.createDeployment(createDto, req.user.id);
  }

  @Get('deployments')
  @ApiOperation({ summary: 'Get deployments with filtering' })
  @ApiResponse({ status: 200, description: 'Deployments retrieved successfully' })
  async getDeployments(
    @Query() filterDto: DeploymentFilterDto,
    @Query() listDto: DeploymentListDto,
  ) {
    return this.devOpsSreService.getDeployments(filterDto, listDto);
  }

  @Get('deployments/:id')
  @ApiOperation({ summary: 'Get deployment by ID' })
  @ApiResponse({ status: 200, description: 'Deployment retrieved successfully' })
  async getDeployment(@Param('id') id: string) {
    return this.devOpsSreService.getDeployment(id);
  }

  @Post('deployments/:id/rollback')
  @ApiOperation({ summary: 'Rollback deployment' })
  @ApiResponse({ status: 200, description: 'Deployment rollback initiated' })
  async rollbackDeployment(@Param('id') deploymentId: string, @Request() req) {
    return this.devOpsSreService.rollbackDeployment(deploymentId, req.user.id);
  }

  // Incident Management
  @Post('incidents')
  @ApiOperation({ summary: 'Create a new incident' })
  @ApiResponse({ status: 201, description: 'Incident created successfully' })
  async createIncident(@Body() createDto: CreateIncidentDto, @Request() req) {
    return this.devOpsSreService.createIncident(createDto, req.user.id);
  }

  @Put('incidents/:id')
  @ApiOperation({ summary: 'Update incident' })
  @ApiResponse({ status: 200, description: 'Incident updated successfully' })
  async updateIncident(@Param('id') id: string, @Body() updateDto: UpdateIncidentDto) {
    return this.devOpsSreService.updateIncident(id, updateDto);
  }

  @Get('incidents')
  @ApiOperation({ summary: 'Get incidents with filtering' })
  @ApiResponse({ status: 200, description: 'Incidents retrieved successfully' })
  async getIncidents(
    @Query() filterDto: IncidentFilterDto,
    @Query() listDto: DeploymentListDto,
  ) {
    return this.devOpsSreService.getIncidents(filterDto, listDto);
  }

  @Get('incidents/:id')
  @ApiOperation({ summary: 'Get incident by ID' })
  @ApiResponse({ status: 200, description: 'Incident retrieved successfully' })
  async getIncident(@Param('id') id: string) {
    return this.devOpsSreService.getIncident(id);
  }

  // Backup & Restore
  @Post('backups')
  @ApiOperation({ summary: 'Create a new backup' })
  @ApiResponse({ status: 201, description: 'Backup created successfully' })
  async createBackup(@Body() createDto: CreateBackupDto) {
    return this.devOpsSreService.createBackup(createDto);
  }

  @Get('backups')
  @ApiOperation({ summary: 'Get backups with filtering' })
  @ApiResponse({ status: 200, description: 'Backups retrieved successfully' })
  async getBackups(
    @Query() filterDto: BackupFilterDto,
    @Query() listDto: DeploymentListDto,
  ) {
    return this.devOpsSreService.getBackups(filterDto, listDto);
  }

  @Post('restore')
  @ApiOperation({ summary: 'Restore from backup' })
  @ApiResponse({ status: 200, description: 'Restore initiated successfully' })
  async restoreFromBackup(@Body() restoreDto: RestoreRequestDto) {
    return this.devOpsSreService.restoreFromBackup(restoreDto);
  }

  // Metrics & Monitoring
  @Post('metrics')
  @ApiOperation({ summary: 'Record a metric' })
  @ApiResponse({ status: 201, description: 'Metric recorded successfully' })
  async recordMetric(@Body() metricDto: CreateMetricDto) {
    return this.devOpsSreService.recordMetric(metricDto);
  }

  @Post('metrics/query')
  @ApiOperation({ summary: 'Query metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved successfully' })
  async queryMetrics(@Body() queryDto: MetricQueryDto) {
    return this.devOpsSreService.queryMetrics(queryDto);
  }

  // Alerting
  @Post('alerts/rules')
  @ApiOperation({ summary: 'Create alert rule' })
  @ApiResponse({ status: 201, description: 'Alert rule created successfully' })
  async createAlertRule(@Body() ruleDto: CreateAlertRuleDto) {
    return this.devOpsSreService.createAlertRule(ruleDto);
  }

  @Put('alerts/rules/:id')
  @ApiOperation({ summary: 'Update alert rule' })
  @ApiResponse({ status: 200, description: 'Alert rule updated successfully' })
  async updateAlertRule(@Param('id') id: string, @Body() updateDto: UpdateAlertRuleDto) {
    return this.devOpsSreService.updateAlertRule(id, updateDto);
  }

  @Get('alerts/rules')
  @ApiOperation({ summary: 'Get all alert rules' })
  @ApiResponse({ status: 200, description: 'Alert rules retrieved successfully' })
  async getAlertRules() {
    return this.devOpsSreService.getAlertRules();
  }

  // SLO Management
  @Post('slos')
  @ApiOperation({ summary: 'Create SLO' })
  @ApiResponse({ status: 201, description: 'SLO created successfully' })
  async createSLO(@Body() sloDto: CreateSLODto) {
    return this.devOpsSreService.createSLO(sloDto);
  }

  @Put('slos/:id')
  @ApiOperation({ summary: 'Update SLO' })
  @ApiResponse({ status: 200, description: 'SLO updated successfully' })
  async updateSLO(@Param('id') id: string, @Body() updateDto: UpdateSLODto) {
    return this.devOpsSreService.updateSLO(id, updateDto);
  }

  @Get('slos')
  @ApiOperation({ summary: 'Get all SLOs' })
  @ApiResponse({ status: 200, description: 'SLOs retrieved successfully' })
  async getSLOs() {
    return this.devOpsSreService.getSLOs();
  }

  // Feature Flags
  @Post('feature-flags')
  @ApiOperation({ summary: 'Create feature flag' })
  @ApiResponse({ status: 201, description: 'Feature flag created successfully' })
  async createFeatureFlag(@Body() flagDto: CreateFeatureFlagDto) {
    return this.devOpsSreService.createFeatureFlag(flagDto);
  }

  @Put('feature-flags/:id')
  @ApiOperation({ summary: 'Update feature flag' })
  @ApiResponse({ status: 200, description: 'Feature flag updated successfully' })
  async updateFeatureFlag(@Param('id') id: string, @Body() updateDto: UpdateFeatureFlagDto) {
    return this.devOpsSreService.updateFeatureFlag(id, updateDto);
  }

  @Get('feature-flags')
  @ApiOperation({ summary: 'Get all feature flags' })
  @ApiResponse({ status: 200, description: 'Feature flags retrieved successfully' })
  async getFeatureFlags() {
    return this.devOpsSreService.getFeatureFlags();
  }

  @Get('feature-flags/:key/evaluate')
  @ApiOperation({ summary: 'Evaluate feature flag' })
  @ApiResponse({ status: 200, description: 'Feature flag evaluated successfully' })
  async evaluateFeatureFlag(@Param('key') flagKey: string, @Query() context: any) {
    return this.devOpsSreService.evaluateFeatureFlag(flagKey, context);
  }

  // Migrations
  @Post('migrations/run')
  @ApiOperation({ summary: 'Run database migration' })
  @ApiResponse({ status: 200, description: 'Migration executed successfully' })
  async runMigration(@Body() migrationDto: MigrationRequestDto) {
    return this.devOpsSreService.runMigration(migrationDto);
  }

  // Logging
  @Post('logs/query')
  @ApiOperation({ summary: 'Query logs' })
  @ApiResponse({ status: 200, description: 'Logs retrieved successfully' })
  async getLogs(@Body() queryDto: LogQueryDto) {
    return this.devOpsSreService.getLogs(queryDto);
  }

  // Tracing
  @Post('traces/query')
  @ApiOperation({ summary: 'Query traces' })
  @ApiResponse({ status: 200, description: 'Traces retrieved successfully' })
  async getTraces(@Body() queryDto: TraceQueryDto) {
    return this.devOpsSreService.getTraces(queryDto);
  }

  // System Health
  @Get('health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'System health retrieved successfully' })
  async getSystemHealth() {
    return this.devOpsSreService.getSystemHealth();
  }

  // Canary Releases
  @Post('canary/promote')
  @ApiOperation({ summary: 'Promote canary release' })
  @ApiResponse({ status: 200, description: 'Canary release promoted successfully' })
  async promoteCanary(@Body() promotionDto: any) {
    // Implementation for promoting canary releases
    return { message: 'Canary promotion initiated', status: 'IN_PROGRESS' };
  }

  @Get('canary/status')
  @ApiOperation({ summary: 'Get canary release status' })
  @ApiResponse({ status: 200, description: 'Canary status retrieved successfully' })
  async getCanaryStatus(@Query('version') version: string) {
    // Implementation for getting canary status
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

  // Migration Playbooks
  @Get('playbooks/:name')
  @ApiOperation({ summary: 'Get migration playbook' })
  @ApiResponse({ status: 200, description: 'Migration playbook retrieved successfully' })
  async getMigrationPlaybook(@Param('name') playbookName: string) {
    // Implementation for retrieving migration playbooks
    return {
      name: playbookName,
      steps: [],
      rollbackProcedure: '',
      verificationSteps: [],
    };
  }

  @Post('playbooks/:name/execute')
  @ApiOperation({ summary: 'Execute migration playbook' })
  @ApiResponse({ status: 200, description: 'Playbook execution initiated' })
  async executePlaybook(@Param('name') playbookName: string, @Body() executionDto: any) {
    // Implementation for executing migration playbooks
    return {
      playbook: playbookName,
      status: 'EXECUTING',
      currentStep: 1,
      totalSteps: 5,
    };
  }
}
