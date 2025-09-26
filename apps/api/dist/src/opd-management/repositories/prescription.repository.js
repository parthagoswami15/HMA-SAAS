"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionRepository = void 0;
const typeorm_1 = require("typeorm");
const prescription_entity_1 = require("../entities/prescription.entity");
let PrescriptionRepository = class PrescriptionRepository extends typeorm_1.Repository {
    async findByVisitId(visitId) {
        return this.find({
            where: { visitId },
            relations: ['provider', 'items'],
            order: { datePrescribed: 'DESC' },
        });
    }
    async findByPatientId(patientId, status) {
        const where = { patientId };
        if (status)
            where.status = status;
        return this.find({
            where,
            relations: ['provider', 'items', 'visit'],
            order: { datePrescribed: 'DESC' },
        });
    }
    async findActivePrescriptions(patientId) {
        return this.find({
            where: {
                patientId,
                status: (0, typeorm_1.In)([prescription_entity_1.PrescriptionStatus.ACTIVE, prescription_entity_1.PrescriptionStatus.PENDING]),
                endDate: (0, typeorm_1.Not)(IsNull()),
            },
            relations: ['provider', 'items'],
            order: { endDate: 'ASC' },
        });
    }
    async findExpiringPrescriptions(days = 7) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        return this.createQueryBuilder('prescription')
            .where('prescription.endDate BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('prescription.status = :status', { status: prescription_entity_1.PrescriptionStatus.ACTIVE })
            .leftJoinAndSelect('prescription.patient', 'patient')
            .leftJoinAndSelect('prescription.provider', 'provider')
            .orderBy('prescription.endDate', 'ASC')
            .getMany();
    }
    async countPrescriptionsByStatus(providerId) {
        const query = this.createQueryBuilder('prescription')
            .select('prescription.status', 'status')
            .addSelect('COUNT(prescription.id)', 'count')
            .groupBy('prescription.status');
        if (providerId) {
            query.where('prescription.providerId = :providerId', { providerId });
        }
        return query.getRawMany();
    }
    async findPrescriptionsByMedication(medicationName) {
        return this.createQueryBuilder('prescription')
            .innerJoin('prescription.items', 'item')
            .where('LOWER(item.name) LIKE LOWER(:name)', { name: `%${medicationName}%` })
            .orWhere('LOWER(item.genericName) LIKE LOWER(:name)', { name: `%${medicationName}%` })
            .leftJoinAndSelect('prescription.patient', 'patient')
            .leftJoinAndSelect('prescription.provider', 'provider')
            .orderBy('prescription.datePrescribed', 'DESC')
            .getMany();
    }
};
exports.PrescriptionRepository = PrescriptionRepository;
exports.PrescriptionRepository = PrescriptionRepository = __decorate([
    (0, typeorm_1.EntityRepository)(prescription_entity_1.Prescription)
], PrescriptionRepository);
//# sourceMappingURL=prescription.repository.js.map