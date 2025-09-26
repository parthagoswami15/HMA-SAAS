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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icd10Service = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const icd10_repository_1 = require("../repositories/icd10.repository");
let Icd10Service = class Icd10Service {
    icd10Repository;
    constructor(icd10Repository) {
        this.icd10Repository = icd10Repository;
    }
    async search(query, pagination, options = {}) {
        return this.icd10Repository.search(query, pagination, options);
    }
    async findByCode(code) {
        const icd10Code = await this.icd10Repository.findByCode(code);
        if (!icd10Code) {
            throw new common_1.NotFoundException(`ICD-10 code '${code}' not found`);
        }
        return icd10Code;
    }
    async autocomplete(query, limit = 10) {
        return this.icd10Repository.autocomplete(query, limit);
    }
    async getChapters() {
        return this.icd10Repository.findChapters();
    }
    async getChapterByCode(chapterCode) {
        const chapter = (await this.icd10Repository.findChapters()).find((c) => c.code === chapterCode);
        if (!chapter) {
            throw new common_1.NotFoundException(`Chapter '${chapterCode}' not found`);
        }
        return chapter;
    }
    async getBlocksByChapter(chapterCode) {
        await this.getChapterByCode(chapterCode);
        return this.icd10Repository.findBlocksByChapter(chapterCode);
    }
    async getBlockByCode(blockCode) {
        const blocks = await this.icd10Repository.find({
            where: { code: blockCode, isHeader: true },
        });
        if (blocks.length === 0) {
            throw new common_1.NotFoundException(`Block '${blockCode}' not found`);
        }
        return blocks[0];
    }
    async getCodesByBlock(blockCode) {
        await this.getBlockByCode(blockCode);
        return this.icd10Repository.findCodesByBlock(blockCode);
    }
    async getCodeHierarchy(code) {
        return this.icd10Repository.getCodeHierarchy(code);
    }
    async validateCode(code, options = {}) {
        try {
            const icd10Code = await this.findByCode(code);
            if (options.sex && !icd10Code.isSexValid(options.sex)) {
                return {
                    valid: false,
                    message: `This diagnosis code is restricted to ${icd10Code.sexRestriction} patients`,
                };
            }
            if (options.age !== undefined && !icd10Code.isAgeValid(options.age)) {
                return {
                    valid: false,
                    message: `This diagnosis code is not applicable for the patient's age`,
                };
            }
            return { valid: true };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return { valid: false, message: 'Invalid ICD-10 code' };
            }
            throw error;
        }
    }
    async getCategories() {
        const results = await this.icd10Repository
            .createQueryBuilder('code')
            .select('DISTINCT code.category', 'category')
            .where('code.category IS NOT NULL')
            .orderBy('code.category', 'ASC')
            .getRawMany();
        return results.map((r) => r.category);
    }
};
exports.Icd10Service = Icd10Service;
exports.Icd10Service = Icd10Service = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(icd10_repository_1.Icd10Repository)),
    __metadata("design:paramtypes", [icd10_repository_1.Icd10Repository])
], Icd10Service);
//# sourceMappingURL=icd10.service.js.map