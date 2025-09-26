"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VitalsRepository = void 0;
const typeorm_1 = require("typeorm");
const vitals_entity_1 = require("../entities/vitals.entity");
let VitalsRepository = class VitalsRepository extends typeorm_1.Repository {
    async findByPatientId(patientId, limit = 10) {
        return this.find({
            where: { patientId },
            order: { recordedAt: 'DESC' },
            take: limit,
            relations: ['recordedBy'],
        });
    }
    async findByVisitId(visitId) {
        return this.find({
            where: { visitId },
            order: { recordedAt: 'DESC' },
            relations: ['recordedBy'],
        });
    }
    async findRecentByPatient(patientId, days = 30) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return this.find({
            where: {
                patientId,
                recordedAt: (0, typeorm_1.MoreThan)(date),
            },
            order: { recordedAt: 'DESC' },
        });
    }
    async getVitalsTrends(patientId, metric, days = 30) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        const vitals = await this.createQueryBuilder('vitals')
            .select(['vitals.recordedAt', `vitals.${metric}`])
            .where('vitals.patientId = :patientId', { patientId })
            .andWhere('vitals.recordedAt > :date', { date })
            .orderBy('vitals.recordedAt', 'ASC')
            .getMany();
        return vitals.map(v => ({
            date: v.recordedAt,
            value: v[metric],
        }));
    }
    async getAbnormalVitals(thresholds) {
        const query = this.createQueryBuilder('vitals')
            .where('1=1');
        if (thresholds.temperature) {
            query.andWhere('(vitals.temperature < :minTemp OR vitals.temperature > :maxTemp)', {
                minTemp: thresholds.temperature.min,
                maxTemp: thresholds.temperature.max,
            });
        }
        if (thresholds.heartRate) {
            query.andWhere('(vitals.heartRate < :minHR OR vitals.heartRate > :maxHR)', {
                minHR: thresholds.heartRate.min,
                maxHR: thresholds.heartRate.max,
            });
        }
        if (thresholds.bloodPressure) {
            query.andWhere(`(CAST(SPLIT_PART(vitals.bloodPressure, '/', 1) AS INTEGER) < :minSys OR ` +
                `CAST(SPLIT_PART(vitals.bloodPressure, '/', 1) AS INTEGER) > :maxSys OR ` +
                `CAST(SPLIT_PART(vitals.bloodPressure, '/', 2) AS INTEGER) < :minDia OR ` +
                `CAST(SPLIT_PART(vitals.bloodPressure, '/', 2) AS INTEGER) > :maxDia)`, {
                minSys: thresholds.bloodPressure.minSys,
                maxSys: thresholds.bloodPressure.maxSys,
                minDia: thresholds.bloodPressure.minDia,
                maxDia: thresholds.bloodPressure.maxDia,
            });
        }
        if (thresholds.oxygenSaturation) {
            query.andWhere('vitals.oxygenSaturation < :minSpO2', {
                minSpO2: thresholds.oxygenSaturation.min,
            });
        }
        return query
            .orderBy('vitals.recordedAt', 'DESC')
            .leftJoinAndSelect('vitals.patient', 'patient')
            .getMany();
    }
    async getLastVitals(patientId) {
        const vitals = await this.findOne({
            where: { patientId },
            order: { recordedAt: 'DESC' },
        });
        if (!vitals)
            return null;
        return {
            temperature: vitals.temperature,
            heartRate: vitals.heartRate,
            bloodPressure: vitals.bloodPressure,
            respiratoryRate: vitals.respiratoryRate,
            oxygenSaturation: vitals.oxygenSaturation,
            height: vitals.height,
            weight: vitals.weight,
            bmi: vitals.bmi,
            painScore: vitals.painScore,
            recordedAt: vitals.recordedAt,
        };
    }
};
exports.VitalsRepository = VitalsRepository;
exports.VitalsRepository = VitalsRepository = __decorate([
    (0, typeorm_1.EntityRepository)(vitals_entity_1.Vitals)
], VitalsRepository);
//# sourceMappingURL=vitals.repository.js.map