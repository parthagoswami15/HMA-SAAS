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
exports.LabDeltaCheckService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let LabDeltaCheckService = class LabDeltaCheckService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    defaultConfigs = [
        { analyte: 'GLUCOSE', threshold: 20, timeWindowDays: 30, enabled: true },
        { analyte: 'CREATININE', threshold: 15, timeWindowDays: 90, enabled: true },
        { analyte: 'POTASSIUM', threshold: 10, timeWindowDays: 7, enabled: true },
        { analyte: 'SODIUM', threshold: 8, timeWindowDays: 7, enabled: true },
        { analyte: 'CALCIUM', threshold: 12, timeWindowDays: 30, enabled: true },
        { analyte: 'HEMOGLOBIN', threshold: 10, timeWindowDays: 60, enabled: true },
        { analyte: 'WBC', threshold: 25, timeWindowDays: 7, enabled: true },
        { analyte: 'PLATELETS', threshold: 20, timeWindowDays: 14, enabled: true },
    ];
    async performDeltaChecks(patientId, currentResults) {
        const deltaChecks = [];
        for (const result of currentResults) {
            const config = this.getDeltaCheckConfig(result.analyte);
            if (!config.enabled)
                continue;
            const previousResult = await this.findPreviousResult(patientId, result.analyte, config.timeWindowDays);
            if (previousResult && previousResult.value) {
                const deltaCheck = this.calculateDelta(result.analyte, result.value, previousResult.value, config.threshold, previousResult.resultDateTime || previousResult.createdAt, result.resultDateTime || new Date());
                if (deltaCheck.isSignificant) {
                    deltaChecks.push(deltaCheck);
                }
            }
        }
        return deltaChecks;
    }
    async getDeltaCheckHistory(patientId, analyte, limit = 10) {
        const results = await this.prisma.labResult.findMany({
            where: {
                order: {
                    patientId,
                },
                analyte,
            },
            include: {
                order: true,
            },
            orderBy: {
                resultDateTime: 'desc',
            },
            take: limit,
        });
        return results;
    }
    async createDeltaCheckAlert(patientId, deltaCheck) {
        const alert = {
            type: 'DELTA_CHECK',
            message: `Significant change detected in ${deltaCheck.analyte}: ${deltaCheck.deltaPercentage.toFixed(1)}% change (${deltaCheck.currentValue} vs ${deltaCheck.previousValue})`,
            priority: deltaCheck.deltaPercentage > 50 ? 'HIGH' : 'MEDIUM',
            patientId,
            analyte: deltaCheck.analyte,
            metadata: deltaCheck,
        };
        await this.createAlert(alert);
    }
    async getDeltaCheckConfigs() {
        return this.defaultConfigs;
    }
    async updateDeltaCheckConfig(analyte, config) {
        const existingConfig = this.defaultConfigs.find(c => c.analyte === analyte);
        if (!existingConfig) {
            throw new common_1.NotFoundException(`Delta check config for ${analyte} not found`);
        }
        Object.assign(existingConfig, config);
        return existingConfig;
    }
    getDeltaCheckConfig(analyte) {
        return this.defaultConfigs.find(c => c.analyte === analyte) || {
            analyte,
            threshold: 20,
            timeWindowDays: 30,
            enabled: false,
        };
    }
    async findPreviousResult(patientId, analyte, timeWindowDays) {
        const cutoffDate = (0, date_fns_1.subDays)(new Date(), timeWindowDays);
        const previousResult = await this.prisma.labResult.findFirst({
            where: {
                order: {
                    patientId,
                },
                analyte,
                resultDateTime: {
                    lt: new Date(),
                    gte: cutoffDate,
                },
                flag: {
                    not: 'INVALID',
                },
            },
            include: {
                order: true,
            },
            orderBy: {
                resultDateTime: 'desc',
            },
        });
        return previousResult;
    }
    calculateDelta(analyte, currentValue, previousValue, threshold, previousDate, currentDate) {
        const delta = currentValue - previousValue;
        const deltaPercentage = Math.abs(((currentValue - previousValue) / previousValue) * 100);
        return {
            analyte,
            currentValue,
            previousValue,
            delta,
            deltaPercentage,
            threshold,
            isSignificant: deltaPercentage >= threshold,
            previousDate,
            currentDate,
        };
    }
    async createAlert(alert) {
        console.log('Delta check alert:', alert);
        await this.prisma.labNotification.create({
            data: {
                orderId: '',
                message: alert.message,
                type: 'DELTA_CHECK',
                isRead: false,
                tenantId: '',
            },
        });
    }
    async getSignificantDeltaChecks(patientId, days = 30) {
        const cutoffDate = (0, date_fns_1.subDays)(new Date(), days);
        const results = await this.prisma.labResult.findMany({
            where: {
                order: {
                    patientId,
                },
                resultDateTime: {
                    gte: cutoffDate,
                },
            },
            include: {
                order: true,
            },
            orderBy: {
                resultDateTime: 'desc',
            },
        });
        const analyteGroups = {};
        for (const result of results) {
            if (!analyteGroups[result.analyte]) {
                analyteGroups[result.analyte] = [];
            }
            analyteGroups[result.analyte].push(result);
        }
        const significantDeltas = [];
        for (const [analyte, analyteResults] of Object.entries(analyteGroups)) {
            if (analyteResults.length < 2)
                continue;
            analyteResults.sort((a, b) => (b.resultDateTime || b.createdAt).getTime() - (a.resultDateTime || a.createdAt).getTime());
            const current = analyteResults[0];
            const previous = analyteResults[1];
            if (current.value && previous.value) {
                const deltaCheck = this.calculateDelta(analyte, current.value, previous.value, 20, previous.resultDateTime || previous.createdAt, current.resultDateTime || current.createdAt);
                if (deltaCheck.isSignificant) {
                    significantDeltas.push(deltaCheck);
                }
            }
        }
        return significantDeltas;
    }
};
exports.LabDeltaCheckService = LabDeltaCheckService;
exports.LabDeltaCheckService = LabDeltaCheckService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabDeltaCheckService);
//# sourceMappingURL=lab-delta-check.service.js.map