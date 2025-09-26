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
exports.OTTheater = void 0;
const typeorm_1 = require("typeorm");
const surgery_entity_1 = require("./surgery.entity");
const ward_entity_1 = require("./ward.entity");
let OTTheater = class OTTheater {
    id;
    name;
    code;
    description;
    type;
    floor;
    isActive;
    isInMaintenance;
    equipment;
    schedule;
    wardId;
    ward;
    surgeries;
    auditLog;
    createdAt;
    updatedAt;
    isAvailable(startTime, endTime) {
        if (this.isInMaintenance || !this.isActive) {
            return false;
        }
        const dayOfWeek = startTime.getDay();
        const timeStr = startTime.toTimeString().substring(0, 5);
        const schedule = this.schedule?.find(s => s.dayOfWeek === dayOfWeek);
        if (!schedule) {
            return false;
        }
        if (timeStr < schedule.startTime || timeStr > schedule.endTime) {
            return false;
        }
        return true;
    }
};
exports.OTTheater = OTTheater;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OTTheater.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], OTTheater.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], OTTheater.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], OTTheater.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'GENERAL' }),
    __metadata("design:type", String)
], OTTheater.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], OTTheater.prototype, "floor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], OTTheater.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], OTTheater.prototype, "isInMaintenance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], OTTheater.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], OTTheater.prototype, "schedule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], OTTheater.prototype, "wardId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ward_entity_1.Ward, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'wardId' }),
    __metadata("design:type", ward_entity_1.Ward)
], OTTheater.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => surgery_entity_1.Surgery, surgery => surgery.theater),
    __metadata("design:type", Array)
], OTTheater.prototype, "surgeries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], OTTheater.prototype, "auditLog", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], OTTheater.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], OTTheater.prototype, "updatedAt", void 0);
exports.OTTheater = OTTheater = __decorate([
    (0, typeorm_1.Entity)('ot_theaters')
], OTTheater);
//# sourceMappingURL=ot-theater.entity.js.map