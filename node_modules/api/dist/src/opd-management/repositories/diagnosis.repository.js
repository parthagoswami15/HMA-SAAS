"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosisRepository = void 0;
const typeorm_1 = require("typeorm");
const diagnosis_entity_1 = require("../entities/diagnosis.entity");
let DiagnosisRepository = class DiagnosisRepository extends typeorm_1.Repository {
    async findPatientDiagnoses(patientId, { page = 1, limit = 20 } = {}, filters = {}) {
        const skip = (page - 1) * limit;
        const queryBuilder = this.createQueryBuilder('diagnosis')
            .leftJoinAndSelect('diagnosis.icd10', 'icd10')
            .leftJoinAndSelect('diagnosis.recordedBy', 'recordedBy')
            .where('diagnosis.patientId = :patientId', { patientId })
            .take(limit)
            .skip(skip)
            .orderBy('diagnosis.createdAt', 'DESC');
        if (filters.status) {
            if (Array.isArray(filters.status)) {
                queryBuilder.andWhere('diagnosis.status IN (:...statuses)', { statuses: filters.status });
            }
            else {
                queryBuilder.andWhere('diagnosis.status = :status', { status: filters.status });
            }
        }
        if (filters.type) {
            queryBuilder.andWhere('diagnosis.type = :type', { type: filters.type });
        }
        if (filters.isPrimary !== undefined) {
            queryBuilder.andWhere('diagnosis.isPrimary = :isPrimary', { isPrimary: filters.isPrimary });
        }
        if (filters.fromDate) {
            queryBuilder.andWhere('diagnosis.createdAt >= :fromDate', { fromDate: filters.fromDate });
        }
        if (filters.toDate) {
            queryBuilder.andWhere('diagnosis.createdAt <= :toDate', { toDate: filters.toDate });
        }
        if (filters.searchTerm) {
            queryBuilder.andWhere('(icd10.code ILIKE :searchTerm OR icd10.description ILIKE :searchTerm)', { searchTerm: `%${filters.searchTerm}%` });
        }
        const [items, total] = await queryBuilder.getManyAndCount();
        return {
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findEncounterDiagnoses(encounterId) {
        return this.find({
            where: { encounterId },
            relations: ['icd10', 'recordedBy'],
            order: { isPrimary: 'DESC', createdAt: 'ASC' },
        });
    }
    async findActiveDiagnoses(patientId) {
        return this.find({
            where: {
                patientId,
                status: (0, typeorm_1.In)([diagnosis_entity_1.DiagnosisStatus.ACTIVE, diagnosis_entity_1.DiagnosisStatus.CHRONIC]),
            },
            relations: ['icd10', 'recordedBy'],
            order: { isPrimary: 'DESC', createdAt: 'ASC' },
        });
    }
    async findChronicConditions(patientId) {
        return this.find({
            where: {
                patientId,
                status: diagnosis_entity_1.DiagnosisStatus.CHRONIC,
            },
            relations: ['icd10'],
        });
    }
    async resolveDiagnosis(id, resolvedDate = new Date()) {
        await this.update(id, {
            status: diagnosis_entity_1.DiagnosisStatus.RESOLVED,
            resolvedDate,
        });
        return this.findOne(id, { relations: ['icd10', 'recordedBy'] });
    }
    async reactivateDiagnosis(id) {
        const diagnosis = await this.findOne(id);
        if (!diagnosis)
            return undefined;
        if ([diagnosis_entity_1.DiagnosisStatus.RESOLVED, diagnosis_entity_1.DiagnosisStatus.RULED_OUT].includes(diagnosis.status)) {
            await this.update(id, {
                status: diagnosis_entity_1.DiagnosisStatus.RECURRED,
                resolvedDate: null,
            });
            return this.findOne(id, { relations: ['icd10', 'recordedBy'] });
        }
        return diagnosis;
    }
    async getDiagnosisStats(patientId) {
        const [total, active, chronic, resolved, byCategory] = await Promise.all([
            this.count({ where: { patientId } }),
            this.count({ where: { patientId, status: diagnosis_entity_1.DiagnosisStatus.ACTIVE } }),
            this.count({ where: { patientId, status: diagnosis_entity_1.DiagnosisStatus.CHRONIC } }),
            this.count({ where: { patientId, status: diagnosis_entity_1.DiagnosisStatus.RESOLVED } }),
            this.createQueryBuilder('diagnosis')
                .select('icd10.category', 'category')
                .addSelect('COUNT(diagnosis.id)', 'count')
                .leftJoin('diagnosis.icd10', 'icd10')
                .where('diagnosis.patientId = :patientId', { patientId })
                .andWhere('icd10.category IS NOT NULL')
                .groupBy('icd10.category')
                .getRawMany(),
        ]);
        return {
            total,
            active,
            chronic,
            resolved,
            byCategory: byCategory.map(({ category, count }) => ({
                category,
                count: parseInt(count, 10),
            })),
        };
    }
    async getCommonDiagnoses(limit = 10) {
        return this.createQueryBuilder('diagnosis')
            .select('diagnosis.icd10Code', 'icd10Code')
            .addSelect('COUNT(diagnosis.id)', 'count')
            .leftJoinAndSelect('diagnosis.icd10', 'icd10')
            .groupBy('diagnosis.icd10Code, icd10.code, icd10.description')
            .orderBy('count', 'DESC')
            .limit(limit)
            .getRawMany();
    }
    async getDiagnosisTimeline(patientId) {
        const diagnoses = await this.find({
            where: { patientId },
            relations: ['icd10'],
            order: { createdAt: 'DESC' },
        });
        const grouped = diagnoses.reduce((acc, diagnosis) => {
            const date = diagnosis.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(diagnosis);
            return acc;
        }, {});
        return Object.entries(grouped)
            .map(([date, diagnoses]) => ({
            date: new Date(date),
            diagnoses,
        }))
            .sort((a, b) => b.date.getTime() - a.date.getTime());
    }
};
exports.DiagnosisRepository = DiagnosisRepository;
exports.DiagnosisRepository = DiagnosisRepository = __decorate([
    (0, typeorm_1.EntityRepository)(diagnosis_entity_1.Diagnosis)
], DiagnosisRepository);
//# sourceMappingURL=diagnosis.repository.js.map