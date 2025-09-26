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
exports.Bed = exports.BedClass = exports.BedStatus = void 0;
const typeorm_1 = require("typeorm");
const ward_entity_1 = require("./ward.entity");
const admission_entity_1 = require("./admission.entity");
var BedStatus;
(function (BedStatus) {
    BedStatus["AVAILABLE"] = "AVAILABLE";
    BedStatus["OCCUPIED"] = "OCCUPIED";
    BedStatus["MAINTENANCE"] = "MAINTENANCE";
    BedStatus["RESERVED"] = "RESERVED";
})(BedStatus || (exports.BedStatus = BedStatus = {}));
var BedClass;
(function (BedClass) {
    BedClass["GENERAL"] = "GENERAL";
    BedClass["DELUXE"] = "DELUXE";
    BedClass["PRIVATE"] = "PRIVATE";
    BedClass["ICU"] = "ICU";
    BedClass["ICCU"] = "ICCU";
    BedClass["PICU"] = "PICU";
    BedClass["NICU"] = "NICU";
})(BedClass || (exports.BedClass = BedClass = {}));
let Bed = class Bed {
    id;
    bedNumber;
    wardId;
    ward;
    class;
    status;
    isIsolation;
    tariffPerDay;
    features;
    notes;
    currentAdmission;
    createdAt;
    updatedAt;
};
exports.Bed = Bed;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Bed.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bed.prototype, "bedNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Bed.prototype, "wardId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ward_entity_1.Ward, ward => ward.beds, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'wardId' }),
    __metadata("design:type", ward_entity_1.Ward)
], Bed.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BedClass, default: BedClass.GENERAL }),
    __metadata("design:type", String)
], Bed.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BedStatus, default: BedStatus.AVAILABLE }),
    __metadata("design:type", String)
], Bed.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Bed.prototype, "isIsolation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Bed.prototype, "tariffPerDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Bed.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Bed.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => admission_entity_1.Admission, admission => admission.bed, { nullable: true }),
    __metadata("design:type", admission_entity_1.Admission)
], Bed.prototype, "currentAdmission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Bed.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Bed.prototype, "updatedAt", void 0);
exports.Bed = Bed = __decorate([
    (0, typeorm_1.Entity)('beds')
], Bed);
//# sourceMappingURL=bed.entity.js.map