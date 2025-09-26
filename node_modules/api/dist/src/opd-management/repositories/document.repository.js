"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRepository = void 0;
const typeorm_1 = require("typeorm");
const document_entity_1 = require("../entities/document.entity");
let DocumentRepository = class DocumentRepository extends typeorm_1.Repository {
    async findByVisitId(visitId) {
        return this.find({
            where: { visitId },
            relations: ['uploadedBy'],
            order: { uploadedAt: 'DESC' },
        });
    }
    async findByPatientId(patientId, type) {
        const where = { patientId };
        if (type)
            where.type = type;
        return this.find({
            where,
            relations: ['uploadedBy', 'visit'],
            order: { uploadedAt: 'DESC' },
        });
    }
    async findDocumentsByType(type, status, startDate, endDate) {
        const where = { type };
        if (status)
            where.status = status;
        if (startDate && endDate) {
            where.uploadedAt = (0, typeorm_1.Between)(startDate, endDate);
        }
        return this.find({
            where,
            relations: ['patient', 'uploadedBy', 'visit'],
            order: { uploadedAt: 'DESC' },
        });
    }
    async getDocumentStats(patientId) {
        const where = {};
        if (patientId)
            where.patientId = patientId;
        const total = await this.count({ where });
        const typeResults = await this.createQueryBuilder('document')
            .select('document.type', 'type')
            .addSelect('COUNT(document.id)', 'count')
            .where(patientId ? 'document.patientId = :patientId' : '1=1', { patientId })
            .groupBy('document.type')
            .getRawMany();
        const statusResults = await this.createQueryBuilder('document')
            .select('document.status', 'status')
            .addSelect('COUNT(document.id)', 'count')
            .where(patientId ? 'document.patientId = :patientId' : '1=1', { patientId })
            .groupBy('document.status')
            .getRawMany();
        const sizeResult = await this.createQueryBuilder('document')
            .select('COALESCE(SUM(document.size), 0)', 'totalSize')
            .where(patientId ? 'document.patientId = :patientId' : '1=1', { patientId })
            .getRawOne();
        return {
            total,
            byType: typeResults.reduce((acc, { type, count }) => ({
                ...acc,
                [type]: parseInt(count, 10),
            }), {}),
            byStatus: statusResults.reduce((acc, { status, count }) => ({
                ...acc,
                [status]: parseInt(count, 10),
            }), {}),
            totalSize: parseInt(sizeResult?.totalSize || '0', 10),
        };
    }
    async findDocumentsNeedingReview(providerId) {
        const query = this.createQueryBuilder('document')
            .where('document.status = :status', { status: document_entity_1.DocumentStatus.PENDING_REVIEW })
            .orderBy('document.uploadedAt', 'ASC');
        if (providerId) {
            query.andWhere('document.assignedToId = :providerId', { providerId });
        }
        return query
            .leftJoinAndSelect('document.patient', 'patient')
            .leftJoinAndSelect('document.uploadedBy', 'uploadedBy')
            .getMany();
    }
    async findDocumentsByKeyword(keyword) {
        return this.createQueryBuilder('document')
            .where('LOWER(document.name) LIKE LOWER(:keyword)', { keyword: `%${keyword}%` })
            .orWhere('LOWER(document.description) LIKE LOWER(:keyword)', { keyword: `%${keyword}%` })
            .orWhere('LOWER(document.tags) LIKE LOWER(:keyword)', { keyword: `%${keyword}%` })
            .leftJoinAndSelect('document.patient', 'patient')
            .leftJoinAndSelect('document.uploadedBy', 'uploadedBy')
            .orderBy('document.uploadedAt', 'DESC')
            .getMany();
    }
    async getDocumentVersions(documentId) {
        const document = await this.findOne({
            where: { id: documentId },
            select: ['versionGroupId'],
        });
        if (!document || !document.versionGroupId) {
            return [];
        }
        return this.find({
            where: { versionGroupId: document.versionGroupId },
            order: { version: 'DESC' },
            relations: ['uploadedBy'],
        });
    }
    async getDocumentUsageStats(startDate, endDate) {
        return this.createQueryBuilder('document')
            .select('document.type', 'type')
            .addSelect('COUNT(document.id)', 'count')
            .addSelect('COALESCE(SUM(document.size), 0)', 'totalSize')
            .where('document.uploadedAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .groupBy('document.type')
            .orderBy('count', 'DESC')
            .getRawMany();
    }
};
exports.DocumentRepository = DocumentRepository;
exports.DocumentRepository = DocumentRepository = __decorate([
    (0, typeorm_1.EntityRepository)(document_entity_1.Document)
], DocumentRepository);
//# sourceMappingURL=document.repository.js.map