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
exports.Icd10Code = void 0;
const typeorm_1 = require("typeorm");
const diagnosis_entity_1 = require("./diagnosis.entity");
let Icd10Code = class Icd10Code {
    code;
    description;
    chapterCode;
    chapterDescription;
    blockCode;
    blockDescription;
    category;
    isHeader;
    sexRestriction;
    minAge;
    maxAge;
    hasSubCodes;
    isLeaf;
    metadata;
    diagnoses;
    getFullDescription() {
        return `${this.code} - ${this.description}`;
    }
    isAgeValid(age) {
        if (this.minAge !== null && age < this.minAge)
            return false;
        if (this.maxAge !== null && age > this.maxAge)
            return false;
        return true;
    }
    isSexValid(sex) {
        if (!this.sexRestriction)
            return true;
        return this.sexRestriction === sex;
    }
};
exports.Icd10Code = Icd10Code;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Icd10Code.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Icd10Code.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Icd10Code.prototype, "chapterCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Icd10Code.prototype, "chapterDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Icd10Code.prototype, "blockCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Icd10Code.prototype, "blockDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Icd10Code.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Icd10Code.prototype, "isHeader", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Icd10Code.prototype, "sexRestriction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Icd10Code.prototype, "minAge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Icd10Code.prototype, "maxAge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Icd10Code.prototype, "hasSubCodes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Icd10Code.prototype, "isLeaf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Icd10Code.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => diagnosis_entity_1.Diagnosis, diagnosis => diagnosis.icd10Code),
    __metadata("design:type", Array)
], Icd10Code.prototype, "diagnoses", void 0);
exports.Icd10Code = Icd10Code = __decorate([
    (0, typeorm_1.Entity)('icd10_codes')
], Icd10Code);
//# sourceMappingURL=icd10-code.entity.js.map