"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitRepository = void 0;
const typeorm_1 = require("typeorm");
const visit_entity_1 = require("../entities/visit.entity");
const visit_enum_1 = require("../enums/visit.enum");
let VisitRepository = class VisitRepository extends typeorm_1.Repository {
    async hasAssociatedRecords(visitId) {
        const [encounters, prescriptions, orders] = await Promise.all([
            this.manager.count('encounter', { where: { visitId } }),
            this.manager.count('prescription', { where: { visitId } }),
            this.manager.count('order', { where: { visitId } }),
        ]);
        return encounters > 0 || prescriptions > 0 || orders > 0;
    }
    async findActiveVisits(patientId) {
        return this.find({
            where: {
                patientId,
                status: In([visit_enum_1.VisitStatus.SCHEDULED, visit_enum_1.VisitStatus.IN_PROGRESS, visit_enum_1.VisitStatus.ARRIVED]),
            },
            order: { scheduledAt: 'DESC' },
        });
    }
    async findCompletedVisits(patientId, limit = 10) {
        return this.find({
            where: {
                patientId,
                status: visit_enum_1.VisitStatus.COMPLETED,
            },
            order: { completedAt: 'DESC' },
            take: limit,
        });
    }
    async findVisitsByProvider(providerId, status) {
        const where = { providerId };
        if (status)
            where.status = status;
        return this.find({
            where,
            relations: ['patient'],
            order: { scheduledAt: 'DESC' },
        });
    }
    async findVisitsByDateRange(startDate, endDate, status) {
        const where = {
            scheduledAt: Between(startDate, endDate),
        };
        if (status)
            where.status = status;
        return this.find({
            where,
            relations: ['patient', 'provider'],
            order: { scheduledAt: 'ASC' },
        });
    }
    async countVisitsByStatus(patientId) {
        const query = this.createQueryBuilder('visit')
            .select('visit.status', 'status')
            .addSelect('COUNT(visit.id)', 'count')
            .groupBy('visit.status');
        if (patientId) {
            query.where('visit.patientId = :patientId', { patientId });
        }
        return query.getRawMany();
    }
};
exports.VisitRepository = VisitRepository;
exports.VisitRepository = VisitRepository = __decorate([
    (0, typeorm_1.EntityRepository)(visit_entity_1.Visit)
], VisitRepository);
//# sourceMappingURL=visit.repository.js.map