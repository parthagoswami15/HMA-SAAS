"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterRepository = void 0;
const typeorm_1 = require("typeorm");
const encounter_entity_1 = require("../entities/encounter.entity");
let EncounterRepository = class EncounterRepository extends typeorm_1.Repository {
    async findByVisitId(visitId) {
        return this.find({
            where: { visitId },
            relations: ['provider'],
            order: { startTime: 'DESC' },
        });
    }
    async findByProviderId(providerId, startDate, endDate) {
        const where = { providerId };
        if (startDate && endDate) {
            where.startTime = (0, typeorm_1.Between)(startDate, endDate);
        }
        return this.find({
            where,
            relations: ['visit', 'visit.patient'],
            order: { startTime: 'DESC' },
        });
    }
    async findIncompleteEncounters(providerId) {
        const where = { endTime: null };
        if (providerId)
            where.providerId = providerId;
        return this.find({
            where,
            relations: ['visit', 'visit.patient'],
            order: { startTime: 'ASC' },
        });
    }
    async findEncountersWithSoapNotes(visitId) {
        const query = this.createQueryBuilder('encounter')
            .where("encounter.soapNote IS NOT NULL AND encounter.soapNote != '{}'");
        if (visitId) {
            query.andWhere('encounter.visitId = :visitId', { visitId });
        }
        return query.getMany();
    }
    async countEncountersByType(providerId) {
        const query = this.createQueryBuilder('encounter')
            .select('encounter.encounterType', 'type')
            .addSelect('COUNT(encounter.id)', 'count')
            .groupBy('encounter.encounterType');
        if (providerId) {
            query.where('encounter.providerId = :providerId', { providerId });
        }
        return query.getRawMany();
    }
};
exports.EncounterRepository = EncounterRepository;
exports.EncounterRepository = EncounterRepository = __decorate([
    (0, typeorm_1.EntityRepository)(encounter_entity_1.Encounter)
], EncounterRepository);
//# sourceMappingURL=encounter.repository.js.map