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
exports.DevOpsSreService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const devops_sre_dto_1 = require("../dto/devops-sre.dto");
let DevOpsSreService = class DevOpsSreService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDeployment(createDto, userId) {
        const deployment = await this.prisma.deployment.create({
            data: {
                version: createDto.version,
                environment: createDto.environment,
                description: createDto.description,
                features: createDto.features || [],
                configChanges: createDto.configChanges || {},
                rollbackPlan: createDto.rollbackPlan,
                status: devops_sre_dto_1.DeploymentStatus.PENDING,
                createdBy: userId,
                startedAt: new Date(),
            },
        });
        await this.processDeployment(deployment.id);
        return deployment;
    }
    async getDeployments(filterDto, listDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = false } = listDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (filterDto.environment)
            where.environment = filterDto.environment;
        if (filterDto.status)
            where.status = filterDto.status;
        if (filterDto.version)
            where.version = { contains: filterDto.version };
        if (filterDto.dateFrom || filterDto.dateTo) {
            where.createdAt = {};
            if (filterDto.dateFrom)
                where.createdAt.gte = new Date(filterDto.dateFrom);
            if (filterDto.dateTo)
                where.createdAt.lte = new Date(filterDto.dateTo);
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
    async getDeployment(id) {
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
            throw new common_1.NotFoundException('Deployment not found');
        }
        return deployment;
    }
    async rollbackDeployment(deploymentId, userId) {
        const deployment = await this.prisma.deployment.findUnique({
            where: { id: deploymentId },
        });
        if (!deployment) {
            throw new common_1.NotFoundException('Deployment not found');
        }
        if (deployment.status !== devops_sre_dto_1.DeploymentStatus.SUCCESS) {
            throw new common_1.BadRequestException('Can only rollback successful deployments');
        }
        const rollbackDeployment = await this.prisma.deployment.create({
            data: {
                version: `${deployment.version}-rollback`,
                environment: deployment.environment,
                description: `Rollback of deployment ${deployment.id}`,
                status: devops_sre_dto_1.DeploymentStatus.PENDING,
                createdBy: userId,
                rollbackFromId: deployment.id,
                startedAt: new Date(),
            },
        });
        await this.prisma.deployment.update({
            where: { id: deploymentId },
            data: {
                rollbackDeploymentId: rollbackDeployment.id,
            },
        });
        await this.processDeployment(rollbackDeployment.id, true);
        return rollbackDeployment;
    }
    async createIncident(createDto, userId) {
        const incident = await this.prisma.incident.create({
            data: {
                title: createDto.title,
                description: createDto.description,
                severity: createDto.severity,
                status: devops_sre_dto_1.IncidentStatus.OPEN,
                affectedServices: createDto.affectedServices || [],
                environment: createDto.environment,
                errorDetails: createDto.errorDetails || {},
                stepsToReproduce: createDto.stepsToReproduce,
                workaround: createDto.workaround,
                createdBy: userId,
                createdAt: new Date(),
            },
        });
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
    async updateIncident(id, updateDto) {
        const incident = await this.prisma.incident.findUnique({
            where: { id },
        });
        if (!incident) {
            throw new common_1.NotFoundException('Incident not found');
        }
        const updatedIncident = await this.prisma.incident.update({
            where: { id },
            data: updateDto,
        });
        if (updateDto.status && updateDto.status !== incident.status) {
            await this.prisma.incidentUpdate.create({
                data: {
                    incidentId: id,
                    updateText: `Status changed to ${updateDto.status}`,
                    updatedBy: 'system',
                    updateType: 'STATUS_CHANGE',
                },
            });
        }
        return updatedIncident;
    }
    async getIncidents(filterDto, listDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = false } = listDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (filterDto.severity)
            where.severity = filterDto.severity;
        if (filterDto.status)
            where.status = filterDto.status;
        if (filterDto.environment)
            where.environment = filterDto.environment;
        if (filterDto.service)
            where.affectedServices = { has: filterDto.service };
        if (filterDto.assignedTo)
            where.assignedTo = filterDto.assignedTo;
        if (filterDto.dateFrom || filterDto.dateTo) {
            where.createdAt = {};
            if (filterDto.dateFrom)
                where.createdAt.gte = new Date(filterDto.dateFrom);
            if (filterDto.dateTo)
                where.createdAt.lte = new Date(filterDto.dateTo);
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
    async getIncident(id) {
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
            throw new common_1.NotFoundException('Incident not found');
        }
        return incident;
    }
    async createBackup(createDto) {
        const backup = await this.prisma.backup.create({
            data: {
                name: createDto.name,
                description: createDto.description,
                backupType: createDto.backupType || 'FULL',
                status: devops_sre_dto_1.BackupStatus.PENDING,
                tenantIds: createDto.tenantIds || [],
                dataTypes: createDto.dataTypes || ['ALL'],
                compression: createDto.compression ?? true,
                encryption: createDto.encryption ?? true,
                createdAt: new Date(),
                createdBy: 'system',
            },
        });
        await this.processBackup(backup.id);
        return backup;
    }
    async getBackups(filterDto, listDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = false } = listDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (filterDto.status)
            where.status = filterDto.status;
        if (filterDto.backupType)
            where.backupType = filterDto.backupType;
        if (filterDto.tenantId)
            where.tenantIds = { has: filterDto.tenantId };
        if (filterDto.dateFrom || filterDto.dateTo) {
            where.createdAt = {};
            if (filterDto.dateFrom)
                where.createdAt.gte = new Date(filterDto.dateFrom);
            if (filterDto.dateTo)
                where.createdAt.lte = new Date(filterDto.dateTo);
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
    async restoreFromBackup(restoreDto) {
        const backup = await this.prisma.backup.findUnique({
            where: { id: restoreDto.backupId },
        });
        if (!backup) {
            throw new common_1.NotFoundException('Backup not found');
        }
        if (backup.status !== devops_sre_dto_1.BackupStatus.COMPLETED) {
            throw new common_1.BadRequestException('Can only restore from completed backups');
        }
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
        await this.processRestore(restoreJob.id);
        return restoreJob;
    }
    async recordMetric(metricDto) {
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
    async queryMetrics(queryDto) {
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
    async createAlertRule(ruleDto) {
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
    async updateAlertRule(id, updateDto) {
        const rule = await this.prisma.alertRule.findUnique({
            where: { id },
        });
        if (!rule) {
            throw new common_1.NotFoundException('Alert rule not found');
        }
        return this.prisma.alertRule.update({
            where: { id },
            data: updateDto,
        });
    }
    async getAlertRules() {
        return this.prisma.alertRule.findMany({
            where: { enabled: true },
            orderBy: { name: 'asc' },
        });
    }
    async createSLO(sloDto) {
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
    async updateSLO(id, updateDto) {
        const slo = await this.prisma.slo.findUnique({
            where: { id },
        });
        if (!slo) {
            throw new common_1.NotFoundException('SLO not found');
        }
        return this.prisma.slo.update({
            where: { id },
            data: updateDto,
        });
    }
    async getSLOs() {
        return this.prisma.slo.findMany({
            where: { enabled: true },
            orderBy: { serviceName: 'asc' },
        });
    }
    async createFeatureFlag(flagDto) {
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
    async updateFeatureFlag(id, updateDto) {
        const flag = await this.prisma.featureFlag.findUnique({
            where: { id },
        });
        if (!flag) {
            throw new common_1.NotFoundException('Feature flag not found');
        }
        return this.prisma.featureFlag.update({
            where: { id },
            data: updateDto,
        });
    }
    async getFeatureFlags() {
        return this.prisma.featureFlag.findMany({
            where: { enabled: true },
            orderBy: { name: 'asc' },
        });
    }
    async evaluateFeatureFlag(flagKey, context) {
        const flag = await this.prisma.featureFlag.findUnique({
            where: { key: flagKey, enabled: true },
        });
        if (!flag) {
            return false;
        }
        if (flag.targetingRules && Object.keys(flag.targetingRules).length > 0) {
            return this.evaluateTargetingRules(flag.targetingRules, context);
        }
        return flag.defaultValue;
    }
    async runMigration(migrationDto) {
        const migration = await this.prisma.migration.create({
            data: {
                name: migrationDto.migrationName,
                targetVersion: migrationDto.targetVersion,
                status: migrationDto.dryRun ? 'DRY_RUN' : 'PENDING',
                options: migrationDto.options || {},
                startedAt: new Date(),
            },
        });
        await this.executeMigration(migration.id, migrationDto);
        return migration;
    }
    async getLogs(queryDto) {
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
    async getTraces(queryDto) {
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
    async getSystemHealth() {
        const deploymentCount = await this.prisma.deployment.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
        });
        const incidentCount = await this.prisma.incident.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
                severity: { in: [devops_sre_dto_1.IncidentSeverity.HIGH, devops_sre_dto_1.IncidentSeverity.CRITICAL] },
            },
        });
        const backupCount = await this.prisma.backup.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
                status: devops_sre_dto_1.BackupStatus.COMPLETED,
            },
        });
        return {
            status: incidentCount === 0 ? 'HEALTHY' : 'DEGRADED',
            uptime: '99.9%',
            deploymentSuccessRate: '98.5%',
            incidentCount,
            recentDeployments: deploymentCount,
            successfulBackups: backupCount,
            lastUpdated: new Date(),
        };
    }
    async processDeployment(deploymentId, isRollback = false) {
        await this.prisma.deployment.update({
            where: { id: deploymentId },
            data: {
                status: devops_sre_dto_1.DeploymentStatus.IN_PROGRESS,
            },
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        const success = Math.random() > 0.1;
        await this.prisma.deployment.update({
            where: { id: deploymentId },
            data: {
                status: success ? devops_sre_dto_1.DeploymentStatus.SUCCESS : devops_sre_dto_1.DeploymentStatus.FAILED,
                completedAt: new Date(),
            },
        });
    }
    async processBackup(backupId) {
        await this.prisma.backup.update({
            where: { id: backupId },
            data: {
                status: devops_sre_dto_1.BackupStatus.IN_PROGRESS,
                startedAt: new Date(),
            },
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
        const success = Math.random() > 0.05;
        await this.prisma.backup.update({
            where: { id: backupId },
            data: {
                status: success ? devops_sre_dto_1.BackupStatus.COMPLETED : devops_sre_dto_1.BackupStatus.FAILED,
                completedAt: new Date(),
                fileSize: Math.floor(Math.random() * 1000000) + 500000,
            },
        });
    }
    async processRestore(restoreJobId) {
        await this.prisma.restoreJob.update({
            where: { id: restoreJobId },
            data: {
                status: 'IN_PROGRESS',
                startedAt: new Date(),
            },
        });
        await new Promise(resolve => setTimeout(resolve, 10000));
        const success = Math.random() > 0.1;
        await this.prisma.restoreJob.update({
            where: { id: restoreJobId },
            data: {
                status: success ? 'COMPLETED' : 'FAILED',
                completedAt: new Date(),
            },
        });
    }
    async executeMigration(migrationId, migrationDto) {
        await this.prisma.migration.update({
            where: { id: migrationId },
            data: {
                status: 'IN_PROGRESS',
            },
        });
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
    evaluateTargetingRules(rules, context) {
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
};
exports.DevOpsSreService = DevOpsSreService;
exports.DevOpsSreService = DevOpsSreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DevOpsSreService);
//# sourceMappingURL=devops-sre.service.js.map