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
exports.RadiationDoseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RadiationDoseService = class RadiationDoseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recordDose(studyId, doseData) {
        const study = await this.prisma.study.findUnique({
            where: { id: studyId },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
        });
        if (!study) {
            throw new common_1.NotFoundException('Study not found');
        }
        const doseRecord = await this.prisma.radiationDose.create({
            data: {
                studyId,
                patientId: study.order.patientId,
                modalityType: doseData.modalityType,
                effectiveDose: doseData.effectiveDose,
                dlp: doseData.dlp,
                ctdiVol: doseData.ctdiVol,
                exposureTime: doseData.exposureTime,
                kvp: doseData.kvp,
                mas: doseData.mas,
                recordedBy: doseData.recordedBy,
                recordedAt: new Date(),
                tenantId: study.tenantId,
            },
        });
        await this.updateCumulativeDose(study.order.patientId);
        return doseRecord;
    }
    async getStudyDose(studyId) {
        const doseRecords = await this.prisma.radiationDose.findMany({
            where: { studyId },
            orderBy: { recordedAt: 'desc' },
        });
        return doseRecords;
    }
    async getPatientCumulativeDose(patientId) {
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const cumulativeDose = await this.prisma.radiationDose.aggregate({
            where: { patientId },
            _sum: {
                effectiveDose: true,
                dlp: true,
            },
            _count: { id: true },
        });
        const recentStudies = await this.prisma.study.findMany({
            where: {
                order: {
                    patientId,
                },
            },
            include: {
                radiationDoses: {
                    orderBy: { recordedAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { studyDate: 'desc' },
            take: 10,
        });
        return {
            patientId,
            cumulativeEffectiveDose: cumulativeDose._sum.effectiveDose || 0,
            cumulativeDLP: cumulativeDose._sum.dlp || 0,
            totalStudies: cumulativeDose._count.id,
            recentStudies: recentStudies.map(study => ({
                studyInstanceUID: study.studyInstanceUID,
                studyDate: study.studyDate,
                modalityType: study.modalityType,
                latestDose: study.radiationDoses[0] || null,
            })),
        };
    }
    async getPatientDoseHistory(patientId, dateFrom, dateTo) {
        const where = { patientId };
        if (dateFrom || dateTo) {
            where.recordedAt = {};
            if (dateFrom)
                where.recordedAt.gte = dateFrom;
            if (dateTo)
                where.recordedAt.lte = dateTo;
        }
        const doseRecords = await this.prisma.radiationDose.findMany({
            where,
            include: {
                study: {
                    include: {
                        order: {
                            select: {
                                id: true,
                                protocol: true,
                                bodyPart: true,
                            },
                        },
                    },
                },
            },
            orderBy: { recordedAt: 'desc' },
        });
        return doseRecords.map(record => ({
            id: record.id,
            studyInstanceUID: record.study?.studyInstanceUID,
            studyDate: record.study?.studyDate,
            modalityType: record.modalityType,
            effectiveDose: record.effectiveDose,
            dlp: record.dlp,
            ctdiVol: record.ctdiVol,
            recordedAt: record.recordedAt,
            protocol: record.study?.order?.protocol,
            bodyPart: record.study?.order?.bodyPart,
        }));
    }
    async checkDoseAlerts(patientId) {
        const alerts = [];
        const cumulativeDose = await this.getPatientCumulativeDose(patientId);
        const totalEffectiveDose = cumulativeDose.cumulativeEffectiveDose;
        if (totalEffectiveDose > 100) {
            alerts.push({
                type: 'HIGH_CUMULATIVE_DOSE',
                level: 'CRITICAL',
                message: `Patient cumulative effective dose exceeds 100 mSv (${totalEffectiveDose.toFixed(2)} mSv)`,
                threshold: 100,
                currentValue: totalEffectiveDose,
            });
        }
        else if (totalEffectiveDose > 50) {
            alerts.push({
                type: 'HIGH_CUMULATIVE_DOSE',
                level: 'WARNING',
                message: `Patient cumulative effective dose exceeds 50 mSv (${totalEffectiveDose.toFixed(2)} mSv)`,
                threshold: 50,
                currentValue: totalEffectiveDose,
            });
        }
        const recentHighDose = await this.prisma.radiationDose.findMany({
            where: {
                patientId,
                effectiveDose: { gt: 10 },
                recordedAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
            orderBy: { recordedAt: 'desc' },
            take: 5,
        });
        if (recentHighDose.length > 0) {
            alerts.push({
                type: 'RECENT_HIGH_DOSE_STUDIES',
                level: 'WARNING',
                message: `Patient had ${recentHighDose.length} high-dose studies (>10 mSv) in the last 30 days`,
                recentStudies: recentHighDose.map(dose => ({
                    studyInstanceUID: dose.study?.studyInstanceUID,
                    effectiveDose: dose.effectiveDose,
                    recordedAt: dose.recordedAt,
                })),
            });
        }
        return alerts;
    }
    async getModalityDoseStats(modalityType, tenantId) {
        const doseStats = await this.prisma.radiationDose.aggregate({
            where: {
                modalityType,
                tenantId,
            },
            _count: { id: true },
            _avg: {
                effectiveDose: true,
                dlp: true,
                ctdiVol: true,
            },
            _min: {
                effectiveDose: true,
            },
            _max: {
                effectiveDose: true,
            },
        });
        const recentStudies = await this.prisma.radiationDose.findMany({
            where: {
                modalityType,
                tenantId,
            },
            include: {
                study: {
                    include: {
                        order: {
                            select: {
                                patient: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { recordedAt: 'desc' },
            take: 10,
        });
        return {
            modalityType,
            totalStudies: doseStats._count.id,
            averageEffectiveDose: doseStats._avg.effectiveDose || 0,
            averageDLP: doseStats._avg.dlp || 0,
            averageCTDIvol: doseStats._avg.ctdiVol || 0,
            minEffectiveDose: doseStats._min.effectiveDose || 0,
            maxEffectiveDose: doseStats._max.effectiveDose || 0,
            recentStudies: recentStudies.map(dose => ({
                studyInstanceUID: dose.study?.studyInstanceUID,
                patientName: dose.study?.order?.patient
                    ? `${dose.study.order.patient.firstName} ${dose.study.order.patient.lastName}`
                    : 'Unknown',
                effectiveDose: dose.effectiveDose,
                recordedAt: dose.recordedAt,
            })),
        };
    }
    async updateCumulativeDose(patientId) {
        const cumulativeDose = await this.prisma.radiationDose.aggregate({
            where: { patientId },
            _sum: { effectiveDose: true },
        });
    }
    async getDoseReport(patientId, dateFrom, dateTo) {
        const doseHistory = await this.getPatientDoseHistory(patientId, dateFrom, dateTo);
        const cumulativeDose = await this.getPatientCumulativeDose(patientId);
        const alerts = await this.checkDoseAlerts(patientId);
        return {
            patientId,
            cumulativeDose: cumulativeDose.cumulativeEffectiveDose,
            totalStudies: doseHistory.length,
            doseHistory,
            alerts,
            generatedAt: new Date(),
        };
    }
};
exports.RadiationDoseService = RadiationDoseService;
exports.RadiationDoseService = RadiationDoseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RadiationDoseService);
//# sourceMappingURL=radiation-dose.service.js.map