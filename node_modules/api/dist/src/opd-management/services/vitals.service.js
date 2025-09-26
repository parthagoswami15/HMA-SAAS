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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VitalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vitals_entity_1 = require("../entities/vitals.entity");
const vitals_repository_1 = require("../repositories/vitals.repository");
const patient_service_1 = require("../../patient/patient.service");
const visit_service_1 = require("./visit.service");
let VitalsService = class VitalsService {
    vitalsRepository;
    patientService;
    visitService;
    constructor(vitalsRepository, patientService, visitService) {
        this.vitalsRepository = vitalsRepository;
        this.patientService = patientService;
        this.visitService = visitService;
    }
    async create(createVitalsDto, recordedById) {
        await this.patientService.getPatientById(createVitalsDto.patientId);
        await this.visitService.getVisitById(createVitalsDto.visitId);
        const vitals = this.vitalsRepository.create({
            ...createVitalsDto,
            recordedById,
        });
        if (createVitalsDto.height && createVitalsDto.weight) {
            vitals.calculateBMI();
        }
        return this.vitalsRepository.save(vitals);
    }
    async findAll(filters) {
        const where = {};
        if (filters?.patientId)
            where.patientId = filters.patientId;
        if (filters?.visitId)
            where.visitId = filters.visitId;
        if (filters?.startDate || filters?.endDate) {
            where.recordedAt = Between(filters.startDate || new Date(0), filters.endDate || new Date());
        }
        return this.vitalsRepository.find({
            where,
            order: { recordedAt: 'DESC' },
            relations: ['recordedBy'],
        });
    }
    async findOne(id) {
        const vitals = await this.vitalsRepository.findOne(id, {
            relations: ['patient', 'visit', 'recordedBy'],
        });
        if (!vitals) {
            throw new common_1.NotFoundException(`Vitals with ID ${id} not found`);
        }
        return vitals;
    }
    async update(id, updateVitalsDto) {
        const vitals = await this.findOne(id);
        Object.assign(vitals, updateVitalsDto);
        if (updateVitalsDto.height || updateVitalsDto.weight) {
            vitals.calculateBMI();
        }
        return this.vitalsRepository.save(vitals);
    }
    async remove(id) {
        const result = await this.vitalsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Vitals with ID ${id} not found`);
        }
    }
    async getPatientVitalsTrends(patientId, metric, days = 30) {
        return this.vitalsRepository.getVitalsTrends(patientId, metric, days);
    }
    async getAbnormalVitals(thresholds) {
        return this.vitalsRepository.getAbnormalVitals(thresholds);
    }
    async getLastVitals(patientId) {
        return this.vitalsRepository.getLastVitals(patientId);
    }
    async getVitalsByVisit(visitId) {
        return this.vitalsRepository.findByVisitId(visitId);
    }
    async getRecentVitals(patientId, limit = 5) {
        return this.vitalsRepository.findByPatientId(patientId, limit);
    }
};
exports.VitalsService = VitalsService;
exports.VitalsService = VitalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vitals_entity_1.Vitals)),
    __metadata("design:paramtypes", [vitals_repository_1.VitalsRepository, typeof (_a = typeof patient_service_1.PatientService !== "undefined" && patient_service_1.PatientService) === "function" ? _a : Object, typeof (_b = typeof visit_service_1.VisitService !== "undefined" && visit_service_1.VisitService) === "function" ? _b : Object])
], VitalsService);
//# sourceMappingURL=vitals.service.js.map