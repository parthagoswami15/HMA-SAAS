import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
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
  DeploymentStatus,
  IncidentSeverity,
  IncidentStatus,
  BackupStatus,
  MetricType,
  AlertSeverity
} from '../dto/devops-sre.dto';

@Injectable()
export class DevOpsSreService {
  constructor(private prisma: PrismaService) {}

  async createDeployment(createDto: CreateDeploymentDto, userId: string): Promise<any> {
    const deployment = await this.prisma.deployment.create({
      data: {
        version: createDto.version,
        environment: createDto.environment,
        description: createDto.description,
        features: createDto.features || [],
        configChanges: createDto.configChanges || {},
        rollbackPlan: createDto.rollbackPlan,
        status: DeploymentStatus.PENDING,
        createdBy: userId,
        startedAt: new Date(),
      },
    });

    // Start deployment process (this would typically be handled by a queue)
    await this.processDeployment(deployment.id);

    return deployment;
  }

  async getDeployments(filterDto: DeploymentFilterDto, listDto: DeploymentListDto): Promise<any> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = false } = listDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filterDto.environment) where.environment = filterDto.environment;
    if (filterDto.status) where.status = filterDto.status;
    if (filterDto.version) where.version = { contains: filterDto.version };

    if (filterDto.dateFrom || filterDto.dateTo) {
      where.createdAt = {};
      if (filterDto.dateFrom) where.createdAt.gte = new Date(filterDto.dateFrom);
      if (filterDto.dateTo) where.createdAt.lte = new Date(filterDto.dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.deployment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder ? 'desc' : 'asc' },
        include: {
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.deployment.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDeployment(id: string): Promise<any> {
    const deployment = await this.prisma.deployment.findUnique({
      where: { id },
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        rollbackDeployment: true,
      },
    });

    if (!deployment) {
      throw new NotFoundException('Deployment not found');
    }

    return deployment;
  }

  async rollbackDeployment(deploymentId: string, userId: string): Promise<any> {
    const deployment = await this.prisma.deployment.findUnique({
      where: { id: deploymentId },
    });

    if (!deployment) {
      throw new NotFoundException('Deployment not found');
    }

    if (deployment.status !== DeploymentStatus.SUCCESS) {
      throw new BadRequestException('Can only rollback successful deployments');
    }

    // Create rollback deployment
    const rollbackDeployment = await this.prisma.deployment.create({
      data: {
        version: `${deployment.version}-rollback`,
        environment: deployment.environment,
        description: `Rollback of deployment ${deployment.id}`,
        status: DeploymentStatus.PENDING,
        createdBy: userId,
        rollbackFromId: deployment.id,
        startedAt: new Date(),
      },
    });

    // Update original deployment
    await this.prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        rollbackDeploymentId: rollbackDeployment.id,
      },
    });

    await this.processDeployment(rollbackDeployment.id, true);

    return rollbackDeployment;
  }

  async createIncident(createDto: CreateIncidentDto, userId: string): Promise<any> {
    const incident = await this.prisma.incident.create({
      data: {
        title: createDto.title,
        description: createDto.description,
        severity: createDto.severity,
        status: IncidentStatus.OPEN,
        affectedServices: createDto.affectedServices || [],
        environment: createDto.environment,
        errorDetails: createDto.errorDetails || {},
        stepsToReproduce: createDto.stepsToReproduce,
        workaround: createDto.workaround,
        createdBy: userId,
        createdAt: new Date(),
      },
    });

    // Create initial incident update
    await this.prisma.incidentUpdate.create({
      data: {
        incidentId: incident.id,
        updateText: `Incident created: ${createDto.description}`,
        updatedBy: userId,
        updateType: 'CREATED',
      },
    });

    return incident;
  }

  async updateIncident(id: string, updateDto: UpdateIncidentDto): Promise<any> {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    const updatedIncident = await this.prisma.incident.update({
      where: { id },
      data: updateDto,
    });

    // Create incident update if status changed
    if (updateDto.status && updateDto.status !== incident.status) {
      await this.prisma.incidentUpdate.create({
        data: {
          incidentId: id,
          updateText: `Status changed to ${updateDto.status}`,
          updatedBy: 'system', // This should be the user ID
          updateType: 'STATUS_CHANGE',
        },
      });
    }

    return updatedIncident;
  }

  async getIncidents(filterDto: IncidentFilterDto, listDto: DeploymentListDto): Promise<any> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = false } = listDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filterDto.severity) where.severity = filterDto.severity;
    if (filterDto.status) where.status = filterDto.status;
    if (filterDto.environment) where.environment = filterDto.environment;
    if (filterDto.service) where.affectedServices = { has: filterDto.service };
    if (filterDto.assignedTo) where.assignedTo = filterDto.assignedTo;

    if (filterDto.dateFrom || filterDto.dateTo) {
      where.createdAt = {};
      if (filterDto.dateFrom) where.createdAt.gte = new Date(filterDto.dateFrom);
      if (filterDto.dateTo) where.createdAt.lte = new Date(filterDto.dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.incident.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder ? 'desc' : 'asc' },
        include: {
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          assignedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          incidentUpdates: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      }),
      this.prisma.incident.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getIncident(id: string): Promise<any> {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        incidentUpdates: {
          orderBy: { createdAt: 'desc' },
          include: {
            updatedByUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return incident;
  }

  async createBackup(createDto: CreateBackupDto): Promise<any> {
    const backup = await this.prisma.backup.create({
      data: {
        name: createDto.name,
        description: createDto.description,
        backupType: createDto.backupType || 'FULL',
        status: BackupStatus.PENDING,
        tenantIds: createDto.tenantIds || [],
        dataTypes: createDto.dataTypes || ['ALL'],
        compression: createDto.compression ?? true,
        encryption: createDto.encryption ?? true,
        createdAt: new Date(),
        createdBy: 'system', // This should be the user ID
      },
    });

    // Start backup process
    await this.processBackup(backup.id);

    return backup;
  }

  async getBackups(filterDto: BackupFilterDto, listDto: DeploymentListDto): Promise<any> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = false } = listDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filterDto.status) where.status = filterDto.status;
    if (filterDto.backupType) where.backupType = filterDto.backupType;
    if (filterDto.tenantId) where.tenantIds = { has: filterDto.tenantId };

    if (filterDto.dateFrom || filterDto.dateTo) {
      where.createdAt = {};
      if (filterDto.dateFrom) where.createdAt.gte = new Date(filterDto.dateFrom);
      if (filterDto.dateTo) where.createdAt.lte = new Date(filterDto.dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.backup.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder ? 'desc' : 'asc' },
      }),
      this.prisma.backup.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async restoreFromBackup(restoreDto: RestoreRequestDto): Promise<any> {
    const backup = await this.prisma.backup.findUnique({
      where: { id: restoreDto.backupId },
    });

    if (!backup) {
      throw new NotFoundException('Backup not found');
    }

    if (backup.status !== BackupStatus.COMPLETED) {
      throw new BadRequestException('Can only restore from completed backups');
    }

    // Create restore job
    const restoreJob = await this.prisma.restoreJob.create({
      data: {
        backupId: restoreDto.backupId,
        targetEnvironment: restoreDto.targetEnvironment || 'production',
        pointInTime: restoreDto.pointInTime ? new Date(restoreDto.pointInTime) : null,
        tenantIds: restoreDto.tenantIds || [],
        testRestore: restoreDto.testRestore || false,
        status: 'PENDING',
        createdAt: new Date(),
      },
    });

    // Start restore process
    await this.processRestore(restoreJob.id);

    return restoreJob;
  }

  async recordMetric(metricDto: CreateMetricDto): Promise<any> {
    return this.prisma.metric.create({
      data: {
        name: metricDto.name,
        type: metricDto.type,
        description: metricDto.description,
        labels: metricDto.labels || {},
        value: metricDto.value || 0,
        timestamp: metricDto.timestamp ? new Date(metricDto.timestamp) : new Date(),
      },
    });
  }

  async queryMetrics(queryDto: MetricQueryDto): Promise<any> {
    // This would integrate with Prometheus or similar metrics backend
    // For now, return sample data
    return {
      metricName: queryDto.metricName,
      data: [],
      labels: queryDto.labelFilters,
      timeRange: {
        start: queryDto.startTime,
        end: queryDto.endTime,
      },
    };
  }

  async createAlertRule(ruleDto: CreateAlertRuleDto): Promise<any> {
    return this.prisma.alertRule.create({
      data: {
        name: ruleDto.name,
        query: ruleDto.query,
        severity: ruleDto.severity,
        description: ruleDto.description,
        threshold: ruleDto.threshold,
        operator: ruleDto.operator || '>',
        evaluationInterval: ruleDto.evaluationInterval || 60,
        forDuration: ruleDto.forDuration || '5m',
        notificationChannels: ruleDto.notificationChannels || [],
        labels: ruleDto.labels || {},
        enabled: true,
      },
    });
  }

  async updateAlertRule(id: string, updateDto: UpdateAlertRuleDto): Promise<any> {
    const rule = await this.prisma.alertRule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException('Alert rule not found');
    }

    return this.prisma.alertRule.update({
      where: { id },
      data: updateDto,
    });
  }

  async getAlertRules(): Promise<any[]> {
    return this.prisma.alertRule.findMany({
      where: { enabled: true },
      orderBy: { name: 'asc' },
    });
  }

  async createSLO(sloDto: CreateSLODto): Promise<any> {
    return this.prisma.slo.create({
      data: {
        name: sloDto.name,
        description: sloDto.description,
        serviceName: sloDto.serviceName,
        targetPercentage: sloDto.targetPercentage,
        timeWindow: sloDto.timeWindow || '30d',
        query: sloDto.query,
        alertThresholds: sloDto.alertThresholds || {},
        enabled: true,
      },
    });
  }

  async updateSLO(id: string, updateDto: UpdateSLODto): Promise<any> {
    const slo = await this.prisma.slo.findUnique({
      where: { id },
    });

    if (!slo) {
      throw new NotFoundException('SLO not found');
    }

    return this.prisma.slo.update({
      where: { id },
      data: updateDto,
    });
  }

  async getSLOs(): Promise<any[]> {
    return this.prisma.slo.findMany({
      where: { enabled: true },
      orderBy: { serviceName: 'asc' },
    });
  }

  async createFeatureFlag(flagDto: CreateFeatureFlagDto): Promise<any> {
    return this.prisma.featureFlag.create({
      data: {
        key: flagDto.key,
        name: flagDto.name,
        description: flagDto.description,
        defaultValue: flagDto.defaultValue ?? false,
        targetingRules: flagDto.targetingRules || {},
        prerequisites: flagDto.prerequisites || [],
        enabled: true,
      },
    });
  }

  async updateFeatureFlag(id: string, updateDto: UpdateFeatureFlagDto): Promise<any> {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { id },
    });

    if (!flag) {
      throw new NotFoundException('Feature flag not found');
    }

    return this.prisma.featureFlag.update({
      where: { id },
      data: updateDto,
    });
  }

  async getFeatureFlags(): Promise<any[]> {
    return this.prisma.featureFlag.findMany({
      where: { enabled: true },
      orderBy: { name: 'asc' },
    });
  }

  async evaluateFeatureFlag(flagKey: string, context: any): Promise<boolean> {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { key: flagKey, enabled: true },
    });

    if (!flag) {
      return false;
    }

    // Evaluate targeting rules
    if (flag.targetingRules && Object.keys(flag.targetingRules).length > 0) {
      return this.evaluateTargetingRules(flag.targetingRules, context);
    }

    return flag.defaultValue;
  }

  async runMigration(migrationDto: MigrationRequestDto): Promise<any> {
    // Create migration record
    const migration = await this.prisma.migration.create({
      data: {
        name: migrationDto.migrationName,
        targetVersion: migrationDto.targetVersion,
        status: migrationDto.dryRun ? 'DRY_RUN' : 'PENDING',
        options: migrationDto.options || {},
        startedAt: new Date(),
      },
    });

    // Execute migration
    await this.executeMigration(migration.id, migrationDto);

    return migration;
  }

  async getLogs(queryDto: LogQueryDto): Promise<any> {
    // This would integrate with ELK stack or similar logging system
    // For now, return sample data
    return {
      logs: [],
      total: 0,
      query: queryDto.query,
      timeRange: {
        start: queryDto.startTime,
        end: queryDto.endTime,
      },
    };
  }

  async getTraces(queryDto: TraceQueryDto): Promise<any> {
    // This would integrate with Jaeger or similar tracing system
    // For now, return sample data
    return {
      traces: [],
      total: 0,
      query: {
        service: queryDto.service,
        operation: queryDto.operation,
      },
      timeRange: {
        start: queryDto.startTime,
        end: queryDto.endTime,
      },
    };
  }

  async getSystemHealth(): Promise<any> {
    // Get system health metrics
    const deploymentCount = await this.prisma.deployment.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    const incidentCount = await this.prisma.incident.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        severity: { in: [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL] },
      },
    });

    const backupCount = await this.prisma.backup.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        status: BackupStatus.COMPLETED,
      },
    });

    return {
      status: incidentCount === 0 ? 'HEALTHY' : 'DEGRADED',
      uptime: '99.9%', // This would be calculated from actual metrics
      deploymentSuccessRate: '98.5%',
      incidentCount,
      recentDeployments: deploymentCount,
      successfulBackups: backupCount,
      lastUpdated: new Date(),
    };
  }

  private async processDeployment(deploymentId: string, isRollback = false): Promise<void> {
    // Simulate deployment process
    await this.prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: DeploymentStatus.IN_PROGRESS,
      },
    });

    // Simulate deployment steps
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Random success/failure for demo
    const success = Math.random() > 0.1;

    await this.prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: success ? DeploymentStatus.SUCCESS : DeploymentStatus.FAILED,
        completedAt: new Date(),
      },
    });
  }

  private async processBackup(backupId: string): Promise<void> {
    await this.prisma.backup.update({
      where: { id: backupId },
      data: {
        status: BackupStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });

    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 5000));

    const success = Math.random() > 0.05; // 95% success rate

    await this.prisma.backup.update({
      where: { id: backupId },
      data: {
        status: success ? BackupStatus.COMPLETED : BackupStatus.FAILED,
        completedAt: new Date(),
        fileSize: Math.floor(Math.random() * 1000000) + 500000, // 0.5-1.5GB
      },
    });
  }

  private async processRestore(restoreJobId: string): Promise<void> {
    await this.prisma.restoreJob.update({
      where: { id: restoreJobId },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    // Simulate restore process
    await new Promise(resolve => setTimeout(resolve, 10000));

    const success = Math.random() > 0.1; // 90% success rate

    await this.prisma.restoreJob.update({
      where: { id: restoreJobId },
      data: {
        status: success ? 'COMPLETED' : 'FAILED',
        completedAt: new Date(),
      },
    });
  }

  private async executeMigration(migrationId: string, migrationDto: MigrationRequestDto): Promise<void> {
    await this.prisma.migration.update({
      where: { id: migrationId },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    // Simulate migration execution
    await new Promise(resolve => setTimeout(resolve, 3000));

    const success = migrationDto.dryRun || Math.random() > 0.1;

    await this.prisma.migration.update({
      where: { id: migrationId },
      data: {
        status: success ? 'COMPLETED' : 'FAILED',
        completedAt: new Date(),
      },
    });
  }

  private evaluateTargetingRules(rules: any, context: any): boolean {
    // Simple rule evaluation - in reality this would be more complex
    if (rules.tenantId && rules.tenantId !== context.tenantId) {
      return false;
    }

    if (rules.userRole && rules.userRole !== context.userRole) {
      return false;
    }

    if (rules.percentage && Math.random() * 100 > rules.percentage) {
      return false;
    }

    return rules.defaultValue ?? true;
  }
}
