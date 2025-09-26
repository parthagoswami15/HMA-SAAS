import { DevOpsSreService } from '../services/devops-sre.service';
import { CreateDeploymentDto, DeploymentFilterDto, DeploymentListDto, CreateIncidentDto, UpdateIncidentDto, IncidentFilterDto, CreateBackupDto, BackupFilterDto, RestoreRequestDto, CreateMetricDto, MetricQueryDto, CreateAlertRuleDto, UpdateAlertRuleDto, CreateSLODto, UpdateSLODto, CreateFeatureFlagDto, UpdateFeatureFlagDto, MigrationRequestDto, LogQueryDto, TraceQueryDto } from '../dto/devops-sre.dto';
export declare class DevOpsSreController {
    private readonly devOpsSreService;
    constructor(devOpsSreService: DevOpsSreService);
    createDeployment(createDto: CreateDeploymentDto, req: any): Promise<any>;
    getDeployments(filterDto: DeploymentFilterDto, listDto: DeploymentListDto): Promise<any>;
    getDeployment(id: string): Promise<any>;
    rollbackDeployment(deploymentId: string, req: any): Promise<any>;
    createIncident(createDto: CreateIncidentDto, req: any): Promise<any>;
    updateIncident(id: string, updateDto: UpdateIncidentDto): Promise<any>;
    getIncidents(filterDto: IncidentFilterDto, listDto: DeploymentListDto): Promise<any>;
    getIncident(id: string): Promise<any>;
    createBackup(createDto: CreateBackupDto): Promise<any>;
    getBackups(filterDto: BackupFilterDto, listDto: DeploymentListDto): Promise<any>;
    restoreFromBackup(restoreDto: RestoreRequestDto): Promise<any>;
    recordMetric(metricDto: CreateMetricDto): Promise<any>;
    queryMetrics(queryDto: MetricQueryDto): Promise<any>;
    createAlertRule(ruleDto: CreateAlertRuleDto): Promise<any>;
    updateAlertRule(id: string, updateDto: UpdateAlertRuleDto): Promise<any>;
    getAlertRules(): Promise<any[]>;
    createSLO(sloDto: CreateSLODto): Promise<any>;
    updateSLO(id: string, updateDto: UpdateSLODto): Promise<any>;
    getSLOs(): Promise<any[]>;
    createFeatureFlag(flagDto: CreateFeatureFlagDto): Promise<any>;
    updateFeatureFlag(id: string, updateDto: UpdateFeatureFlagDto): Promise<any>;
    getFeatureFlags(): Promise<any[]>;
    evaluateFeatureFlag(flagKey: string, context: any): Promise<boolean>;
    runMigration(migrationDto: MigrationRequestDto): Promise<any>;
    getLogs(queryDto: LogQueryDto): Promise<any>;
    getTraces(queryDto: TraceQueryDto): Promise<any>;
    getSystemHealth(): Promise<any>;
    promoteCanary(promotionDto: any): Promise<{
        message: string;
        status: string;
    }>;
    getCanaryStatus(version: string): Promise<{
        version: string;
        status: string;
        trafficPercentage: number;
        metrics: {
            errorRate: number;
            latency: number;
            successRate: number;
        };
    }>;
    getMigrationPlaybook(playbookName: string): Promise<{
        name: string;
        steps: never[];
        rollbackProcedure: string;
        verificationSteps: never[];
    }>;
    executePlaybook(playbookName: string, executionDto: any): Promise<{
        playbook: string;
        status: string;
        currentStep: number;
        totalSteps: number;
    }>;
}
