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
exports.DiagnosisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const diagnosis_entity_1 = require("../entities/diagnosis.entity");
const diagnosis_repository_1 = require("../repositories/diagnosis.repository");
const icd10_service_1 = require("./icd10.service");
const patient_service_1 = require("../../patient/patient.service");
const staff_service_1 = require("../../staff-management/services/staff.service");
const encounter_service_1 = require("./encounter.service");
let DiagnosisService = class DiagnosisService {
    diagnosisRepository;
    icd10Service;
    patientService;
    staffService;
    encounterService;
    constructor(diagnosisRepository, icd10Service, patientService, staffService, encounterService) {
        this.diagnosisRepository = diagnosisRepository;
        this.icd10Service = icd10Service;
        this.patientService = patientService;
        this.staffService = staffService;
        this.encounterService = encounterService;
    }
    async createPatientDiagnosis(createDiagnosisDto, recordedById) {
        await this.patientService.getPatientById(createDiagnosisDto.patientId);
        await this.icd10Service.findByCode(createDiagnosisDto.icd10Code);
        if (createDiagnosisDto.encounterId) {
            await this.encounterService.getEncounterById(createDiagnosisDto.encounterId);
        }
        if (createDiagnosisDto.isPrimary && createDiagnosisDto.encounterId) {
            await this.clearPrimaryDiagnosis(createDiagnosisDto.encounterId);
        }
        const diagnosis = this.diagnosisRepository.create({
            ...createDiagnosisDto,
            recordedById,
            status: createDiagnosisDto.status || diagnosis_entity_1.DiagnosisStatus.ACTIVE,
        });
        return this.diagnosisRepository.save(diagnosis);
    }
    async createEncounterDiagnosis(createDiagnosisDto, recordedById) {
        const encounter = await this.encounterService.getEncounterById(createDiagnosisDto.encounterId);
        return this.createPatientDiagnosis({
            ...createDiagnosisDto,
            patientId: encounter.patientId,
        }, recordedById);
    }
    async updateDiagnosis(id, updateDiagnosisDto, updatedById) {
        const diagnosis = await this.getDiagnosisById(id);
        if (updateDiagnosisDto.icd10Code && updateDiagnosisDto.icd10Code !== diagnosis.icd10Code) {
            await this.icd10Service.findByCode(updateDiagnosisDto.icd10Code);
        }
        if (updateDiagnosisDto.status === diagnosis_entity_1.DiagnosisStatus.RESOLVED && diagnosis.status !== diagnosis_entity_1.DiagnosisStatus.RESOLVED) {
            updateDiagnosisDto.resolvedDate = new Date();
        }
        else if (updateDiagnosisDto.status === diagnosis_entity_1.DiagnosisStatus.ACTIVE && diagnosis.status === diagnosis_entity_1.DiagnosisStatus.RESOLVED) {
            updateDiagnosisDto.resolvedDate = null;
        }
        if (updateDiagnosisDto.isPrimary && diagnosis.encounterId) {
            await this.clearPrimaryDiagnosis(diagnosis.encounterId, id);
        }
        await this.diagnosisRepository.update(id, {
            ...updateDiagnosisDto,
            updatedById,
        });
        return this.getDiagnosisById(id);
    }
    async resolveDiagnosis(id, resolveDto, resolvedById) {
        const diagnosis = await this.getDiagnosisById(id);
        if (diagnosis.status === diagnosis_entity_1.DiagnosisStatus.RESOLVED) {
            throw new common_1.ConflictException('Diagnosis is already resolved');
        }
        return this.updateDiagnosis(id, {
            status: diagnosis_entity_1.DiagnosisStatus.RESOLVED,
            resolvedDate: resolveDto.resolvedDate ? new Date(resolveDto.resolvedDate) : new Date(),
            notes: resolveDto.notes || diagnosis.notes,
        }, resolvedById);
    }
    async reactivateDiagnosis(id, reactivateDto, reactivatedById) {
        const diagnosis = await this.getDiagnosisById(id);
        if (diagnosis.status !== diagnosis_entity_1.DiagnosisStatus.RESOLVED && diagnosis.status !== diagnosis_entity_1.DiagnosisStatus.RULED_OUT) {
            throw new common_1.BadRequestException('Only resolved or ruled out diagnoses can be reactivated');
        }
        return this.updateDiagnosis(id, {
            status: diagnosis_entity_1.DiagnosisStatus.RECURRED,
            resolvedDate: null,
            notes: reactivateDto.notes || diagnosis.notes,
        }, reactivatedById);
    }
    async getDiagnosisById(id) {
        const diagnosis = await this.diagnosisRepository.findOne(id, {
            relations: ['icd10', 'recordedBy', 'patient', 'encounter', 'updatedBy'],
        });
        if (!diagnosis) {
            throw new common_1.NotFoundException(`Diagnosis with ID ${id} not found`);
        }
        return diagnosis;
    }
    async getPatientDiagnoses(patientId, filters = {}, pagination = { page: 1, limit: 20 }) {
        await this.patientService.getPatientById(patientId);
        return this.diagnosisRepository.findPatientDiagnoses(patientId, pagination, filters);
    }
    async getEncounterDiagnoses(encounterId) {
        await this.encounterService.getEncounterById(encounterId);
        return this.diagnosisRepository.findEncounterDiagnoses(encounterId);
    }
    async getActiveDiagnoses(patientId) {
        await this.patientService.getPatientById(patientId);
        return this.diagnosisRepository.findActiveDiagnoses(patientId);
    }
    async getChronicConditions(patientId) {
        await this.patientService.getPatientById(patientId);
        return this.diagnosisRepository.findChronicConditions(patientId);
    }
    async getDiagnosisStats(patientId) {
        await this.patientService.getPatientById(patientId);
        return this.diagnosisRepository.getDiagnosisStats(patientId);
    }
    async getDiagnosisTimeline(patientId) {
        await this.patientService.getPatientById(patientId);
        return this.diagnosisRepository.getDiagnosisTimeline(patientId);
    }
    async clearPrimaryDiagnosis(encounterId, excludeId) {
        const updateCondition = {
            encounterId,
            isPrimary: true
        };
        if (excludeId) {
            updateCondition.id = Not(excludeId);
        }
        await this.diagnosisRepository.update(updateCondition, { isPrimary: false });
    }
    async getCommonDiagnoses(limit = 10) {
        return this.diagnosisRepository.getCommonDiagnoses(limit);
    }
    async deleteDiagnosis(id) {
        const result = await this.diagnosisRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Diagnosis with ID ${id} not found`);
        }
    }
};
exports.DiagnosisService = DiagnosisService;
exports.DiagnosisService = DiagnosisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(diagnosis_entity_1.Diagnosis)),
    __metadata("design:paramtypes", [diagnosis_repository_1.DiagnosisRepository,
        icd10_service_1.Icd10Service, typeof (_a = typeof patient_service_1.PatientService !== "undefined" && patient_service_1.PatientService) === "function" ? _a : Object, staff_service_1.StaffService, typeof (_b = typeof encounter_service_1.EncounterService !== "undefined" && encounter_service_1.EncounterService) === "function" ? _b : Object])
], DiagnosisService);
//# sourceMappingURL=diagnosis.service.js.map