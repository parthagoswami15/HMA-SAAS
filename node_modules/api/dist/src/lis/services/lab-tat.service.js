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
exports.LabTatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let LabTatService = class LabTatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    defaultTATConfigs = [
        { id: '1', testId: 'TROPONIN', priority: 'STAT', targetMinutes: 60, warningMinutes: 45, isActive: true, tenantId: '' },
        { id: '2', testId: 'POTASSIUM', priority: 'STAT', targetMinutes: 60, warningMinutes: 45, isActive: true, tenantId: '' },
        { id: '3', testId: 'GLUCOSE', priority: 'STAT', targetMinutes: 30, warningMinutes: 20, isActive: true, tenantId: '' },
        { id: '4', testId: 'CBC', priority: 'STAT', targetMinutes: 60, warningMinutes: 45, isActive: true, tenantId: '' },
        { id: '5', testId: 'LIPID_PANEL', priority: 'URGENT', targetMinutes: 240, warningMinutes: 180, isActive: true, tenantId: '' },
        { id: '6', testId: 'LIVER_PANEL', priority: 'URGENT', targetMinutes: 180, warningMinutes: 120, isActive: true, tenantId: '' },
        { id: '7', testId: 'TSH', priority: 'ROUTINE', targetMinutes: 1440, warningMinutes: 720, isActive: true, tenantId: '' },
        { id: '8', testId: 'VITAMIN_D', priority: 'ROUTINE', targetMinutes: 2880, warningMinutes: 1440, isActive: true, tenantId: '' },
    ];
    async calculateTAT(orderId) {
        const order = await this.prisma.labOrder.findUnique({
            where: { id: orderId },
            include: {
                results: {
                    include: {
                        test: true,
                    },
                },
                samples: true,
            },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        const tatMetrics = [];
        for (const result of order.results) {
            const tatConfig = await this.getTATConfig(result.testId, order.priority);
            if (!tatConfig.isActive)
                continue;
            const metrics = await this.calculateSingleTAT(order, result, tatConfig);
            tatMetrics.push(metrics);
        }
        return tatMetrics;
    }
    async getTATPerformance(tenantId, startDate, endDate) {
        const orders = await this.prisma.labOrder.findMany({
            where: {
                tenantId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                results: {
                    include: {
                        test: true,
                    },
                },
            },
        });
        const metrics = [];
        for (const order of orders) {
            for (const result of order.results) {
                const tatConfig = await this.getTATConfig(result.testId, order.priority);
                if (tatConfig.isActive) {
                    const orderMetrics = await this.calculateSingleTAT(order, result, tatConfig);
                    metrics.push(orderMetrics);
                }
            }
        }
        return this.aggregateTATMetrics(metrics);
    }
    async checkSLAViolations(tenantId) {
        const violations = [];
        const orders = await this.prisma.labOrder.findMany({
            where: {
                tenantId,
                status: {
                    not: 'COMPLETED',
                },
            },
            include: {
                results: {
                    include: {
                        test: true,
                    },
                },
            },
        });
        for (const order of orders) {
            for (const result of order.results) {
                const tatConfig = await this.getTATConfig(result.testId, order.priority);
                if (tatConfig.isActive) {
                    const violation = await this.checkSingleSLAViolation(order, result, tatConfig);
                    if (violation) {
                        violations.push(violation);
                    }
                }
            }
        }
        return violations;
    }
    async getTATConfigs(tenantId) {
        const configs = await this.prisma.labTatConfig.findMany({
            where: { tenantId },
        });
        return configs.length > 0 ? configs : this.defaultTATConfigs.map(config => ({ ...config, tenantId }));
    }
    async updateTATConfig(id, config) {
        const updatedConfig = await this.prisma.labTatConfig.upsert({
            where: { id },
            update: config,
            create: {
                id,
                testId: config.testId,
                priority: config.priority,
                targetMinutes: config.targetMinutes,
                warningMinutes: config.warningMinutes,
                isActive: config.isActive,
                tenantId: config.tenantId,
            },
        });
        return updatedConfig;
    }
    async getSTATOrdersRequiringAttention() {
        const statOrders = await this.prisma.labOrder.findMany({
            where: {
                isStat: true,
                status: {
                    not: 'COMPLETED',
                },
            },
            include: {
                patient: true,
                results: {
                    include: {
                        test: true,
                    },
                },
                samples: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        const requiringAttention = [];
        for (const order of statOrders) {
            for (const result of order.results) {
                const tatConfig = await this.getTATConfig(result.testId, 'STAT');
                if (tatConfig.isActive) {
                    const violation = await this.checkSingleSLAViolation(order, result, tatConfig);
                    if (violation) {
                        requiringAttention.push({
                            order,
                            violation,
                            minutesOverdue: violation.minutesOverdue,
                        });
                    }
                }
            }
        }
        return requiringAttention.sort((a, b) => b.minutesOverdue - a.minutesOverdue);
    }
    async calculateSingleTAT(order, result, tatConfig) {
        const orderedAt = order.createdAt;
        const resultedAt = result.resultDateTime || result.createdAt;
        let tatMinutes = (0, date_fns_1.differenceInMinutes)(resultedAt, orderedAt);
        if (order.samples.length > 0) {
            const firstCollection = order.samples.sort((a, b) => (a.collectedAt || new Date()).getTime() - (b.collectedAt || new Date()).getTime())[0];
            if (firstCollection.collectedAt) {
                tatMinutes = (0, date_fns_1.differenceInMinutes)(resultedAt, firstCollection.collectedAt);
            }
        }
        const isWithinTarget = tatMinutes <= tatConfig.targetMinutes;
        const isOverdue = tatMinutes > tatConfig.targetMinutes;
        let status;
        if (isWithinTarget) {
            status = 'ON_TIME';
        }
        else if (tatMinutes <= tatConfig.warningMinutes) {
            status = 'WARNING';
        }
        else {
            status = 'OVERDUE';
        }
        return {
            orderId: order.id,
            testId: result.testId,
            testName: result.test.name,
            priority: order.priority,
            orderedAt,
            resultedAt,
            tatMinutes,
            isWithinTarget,
            isOverdue,
            status,
        };
    }
    async checkSingleSLAViolation(order, result, tatConfig) {
        const orderedAt = order.createdAt;
        const resultedAt = result.resultDateTime || result.createdAt;
        let tatMinutes = (0, date_fns_1.differenceInMinutes)(resultedAt, orderedAt);
        if (order.samples.length > 0) {
            const firstCollection = order.samples.sort((a, b) => (a.collectedAt || new Date()).getTime() - (b.collectedAt || new Date()).getTime())[0];
            if (firstCollection.collectedAt) {
                tatMinutes = (0, date_fns_1.differenceInMinutes)(resultedAt, firstCollection.collectedAt);
            }
        }
        const isOverdue = tatMinutes > tatConfig.targetMinutes;
        if (isOverdue) {
            return {
                orderId: order.id,
                testId: result.testId,
                testName: result.test.name,
                priority: order.priority,
                targetMinutes: tatConfig.targetMinutes,
                actualMinutes: tatMinutes,
                minutesOverdue: tatMinutes - tatConfig.targetMinutes,
                orderedAt,
                resultedAt,
            };
        }
        return null;
    }
    async getTATConfig(testId, priority) {
        const customConfig = await this.prisma.labTatConfig.findFirst({
            where: {
                testId,
                priority: priority,
            },
        });
        if (customConfig) {
            return customConfig;
        }
        const defaultConfig = this.defaultTATConfigs.find(config => config.testId === testId && config.priority === priority);
        return defaultConfig || {
            id: '',
            testId,
            priority: priority,
            targetMinutes: priority === 'STAT' ? 60 : priority === 'URGENT' ? 240 : 1440,
            warningMinutes: priority === 'STAT' ? 45 : priority === 'URGENT' ? 180 : 720,
            isActive: true,
            tenantId: '',
        };
    }
    aggregateTATMetrics(metrics) {
        const totalTests = metrics.length;
        const onTimeTests = metrics.filter(m => m.status === 'ON_TIME').length;
        const warningTests = metrics.filter(m => m.status === 'WARNING').length;
        const overdueTests = metrics.filter(m => m.status === 'OVERDUE').length;
        const averageTAT = metrics.reduce((sum, m) => sum + m.tatMinutes, 0) / totalTests;
        const medianTAT = this.calculateMedian(metrics.map(m => m.tatMinutes));
        const priorityBreakdown = {
            STAT: metrics.filter(m => m.priority === 'STAT'),
            URGENT: metrics.filter(m => m.priority === 'URGENT'),
            ROUTINE: metrics.filter(m => m.priority === 'ROUTINE'),
        };
        return {
            summary: {
                totalTests,
                onTimeTests,
                warningTests,
                overdueTests,
                onTimePercentage: (onTimeTests / totalTests) * 100,
                averageTAT,
                medianTAT,
            },
            priorityBreakdown: {
                STAT: this.aggregateByPriority(priorityBreakdown.STAT),
                URGENT: this.aggregateByPriority(priorityBreakdown.URGENT),
                ROUTINE: this.aggregateByPriority(priorityBreakdown.ROUTINE),
            },
        };
    }
    aggregateByPriority(metrics) {
        if (metrics.length === 0)
            return {};
        const onTime = metrics.filter(m => m.status === 'ON_TIME').length;
        const averageTAT = metrics.reduce((sum, m) => sum + m.tatMinutes, 0) / metrics.length;
        return {
            count: metrics.length,
            onTime,
            onTimePercentage: (onTime / metrics.length) * 100,
            averageTAT,
        };
    }
    calculateMedian(values) {
        if (values.length === 0)
            return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
            ? (sorted[middle - 1] + sorted[middle]) / 2
            : sorted[middle];
    }
};
exports.LabTatService = LabTatService;
exports.LabTatService = LabTatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabTatService);
//# sourceMappingURL=lab-tat.service.js.map