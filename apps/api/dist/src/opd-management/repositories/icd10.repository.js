"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icd10Repository = void 0;
const typeorm_1 = require("typeorm");
const icd10_code_entity_1 = require("../entities/icd10-code.entity");
let Icd10Repository = class Icd10Repository extends typeorm_1.Repository {
    async search(query, { page = 1, limit = 20 } = {}, options = {}) {
        const { exactMatch = false, includeChapters = true, includeBlocks = true, category, sex, age } = options;
        const skip = (page - 1) * limit;
        let queryBuilder = this.createQueryBuilder('code')
            .where('1=1')
            .take(limit)
            .skip(skip);
        if (query) {
            if (exactMatch) {
                queryBuilder = queryBuilder.andWhere('code.code = :query', { query });
            }
            else {
                const searchTerm = `%${query}%`;
                queryBuilder = queryBuilder.andWhere('(code.code ILIKE :searchTerm OR code.description ILIKE :searchTerm OR code.blockDescription ILIKE :searchTerm OR code.chapterDescription ILIKE :searchTerm)', { searchTerm });
            }
        }
        if (category) {
            queryBuilder = queryBuilder.andWhere('code.category = :category', { category });
        }
        if (sex) {
            queryBuilder = queryBuilder.andWhere('(code.sexRestriction IS NULL OR code.sexRestriction = :sex)', { sex });
        }
        if (age !== undefined) {
            queryBuilder = queryBuilder.andWhere('(code.minAge IS NULL OR code.minAge <= :age) AND (code.maxAge IS NULL OR code.maxAge >= :age)', { age });
        }
        if (!includeChapters) {
            queryBuilder = queryBuilder.andWhere('code.chapterCode IS NULL');
        }
        if (!includeBlocks) {
            queryBuilder = queryBuilder.andWhere('code.blockCode IS NULL');
        }
        queryBuilder = queryBuilder.orderBy(`CASE 
        WHEN code.code = :exactQuery THEN 1 
        WHEN code.code LIKE :startsWithQuery THEN 2 
        WHEN code.description ILIKE :startsWithDescQuery THEN 3 
        ELSE 4 
      END`, 'ASC')
            .addOrderBy('code.code', 'ASC')
            .setParameters({
            exactQuery: query,
            startsWithQuery: `${query}%`,
            startsWithDescQuery: `${query}%`,
        });
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
    async findByCode(code) {
        return this.findOne({ where: { code } });
    }
    async findChapters() {
        return this.find({
            where: { isHeader: true, chapterCode: null },
            order: { code: 'ASC' },
        });
    }
    async findBlocksByChapter(chapterCode) {
        return this.find({
            where: { chapterCode, blockCode: null, isHeader: true },
            order: { code: 'ASC' },
        });
    }
    async findCodesByBlock(blockCode) {
        return this.find({
            where: { blockCode, isHeader: false },
            order: { code: 'ASC' },
        });
    }
    async autocomplete(query, limit = 10) {
        const results = await this.createQueryBuilder('code')
            .select(['code.code', 'code.description'])
            .where('code.code ILIKE :query OR code.description ILIKE :query', {
            query: `%${query}%`,
        })
            .andWhere('code.isHeader = false')
            .orderBy('code.code', 'ASC')
            .limit(limit)
            .getMany();
        return results.map(({ code, description }) => ({
            code,
            description: `${code} - ${description}`,
        }));
    }
    async getCodeHierarchy(code) {
        const codeEntity = await this.findOne({ where: { code } });
        if (!codeEntity) {
            return { chapter: null, block: null, code: null };
        }
        const [chapter, block] = await Promise.all([
            codeEntity.chapterCode ? this.findOne({ where: { code: codeEntity.chapterCode } }) : null,
            codeEntity.blockCode ? this.findOne({ where: { code: codeEntity.blockCode } }) : null,
        ]);
        return { chapter, block, code: codeEntity };
    }
};
exports.Icd10Repository = Icd10Repository;
exports.Icd10Repository = Icd10Repository = __decorate([
    (0, typeorm_1.EntityRepository)(icd10_code_entity_1.Icd10Code)
], Icd10Repository);
//# sourceMappingURL=icd10.repository.js.map