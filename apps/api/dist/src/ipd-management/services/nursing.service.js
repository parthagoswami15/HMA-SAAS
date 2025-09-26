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
exports.NursingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nursing_chart_entity_1 = require("../entities/nursing-chart.entity");
const medication_administration_entity_1 = require("../entities/medication-administration.entity");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
const admission_entity_1 = require("../entities/admission.entity");
const medication_status_enum_1 = require("../enums/medication-status.enum");
let NursingService = class NursingService {
    nursingChartRepository;
    medicationAdminRepository;
    patientRepository;
    staffRepository;
    admissionRepository;
    constructor(nursingChartRepository, medicationAdminRepository, patientRepository, staffRepository, admissionRepository) {
        this.nursingChartRepository = nursingChartRepository;
        this.medicationAdminRepository = medicationAdminRepository;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.admissionRepository = admissionRepository;
    }
    async recordVitalSigns(patientId, recordedById, vitalSigns) {
        const patient = await this.patientRepository.findOne(patientId);
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${patientId} not found`);
        }
        const staff = await this.staffRepository.findOne(recordedById);
        if (!staff) {
            throw new common_1.NotFoundException(`Staff with ID ${recordedById} not found`);
        }
        const admission = await this.admissionRepository.findOne({
            where: {
                patientId,
                status: 'ADMITTED',
            },
        });
        if (!admission) {
            throw new common_1.BadRequestException('Patient does not have an active admission');
        }
        const records = vitalSigns.map(vs => this.nursingChartRepository.create({
            ...vs,
            patientId,
            recordedById,
            admissionId: admission.id,
        }));
        return this.nursingChartRepository.save(records);
    }
    async getVitalSigns(patientId, filters = {}) {
        const { startDate, endDate, vitalSign, limit = 100 } = filters;
        const where = { patientId };
        if (vitalSign) {
            where.vitalSign = vitalSign;
        }
        if (startDate && endDate) {
            where.recordedAt = (0, typeorm_2.Between)(startDate, endDate);
        }
        else if (startDate) {
            where.recordedAt = (0, typeorm_2.Between)(startDate, new Date());
        }
        return this.nursingChartRepository.find({
            where,
            relations: ['recordedBy'],
            order: { recordedAt: 'DESC' },
            take: limit,
        });
    }
    async scheduleMedication(createMedicationDto) {
        const { patientId, scheduledById, ...rest } = createMedicationDto;
        const patient = await this.patientRepository.findOne(patientId);
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${patientId} not found`);
        }
        const staff = await this.staffRepository.findOne(scheduledById);
        if (!staff) {
            throw new common_1.NotFoundException(`Staff with ID ${scheduledById} not found`);
        }
        const admission = await this.admissionRepository.findOne({
            where: {
                patientId,
                status: 'ADMITTED',
            },
        });
        if (!admission) {
            throw new common_1.BadRequestException('Patient does not have an active admission');
        }
        const medication = this.medicationAdminRepository.create({
            ...rest,
            patientId,
            admissionId: admission.id,
            scheduledById: staff.id,
            status: medication_status_enum_1.MedicationStatus.PENDING,
        });
        return this.medicationAdminRepository.save(medication);
    }
    async administerMedication(medicationId, administeredById, data = {}) {
        const medication = await this.medicationAdminRepository.findOne(medicationId, {
            relations: ['patient', 'admission'],
        });
        if (!medication) {
            throw new common_1.NotFoundException(`Medication administration record with ID ${medicationId} not found`);
        }
        if (medication.status !== medication_status_enum_1.MedicationStatus.PENDING &&
            medication.status !== medication_status_enum_1.MedicationStatus.HOLD) {
            throw new common_1.BadRequestException(`Cannot administer medication with status: ${medication.status}`);
        }
        const staff = await this.staffRepository.findOne(administeredById);
        if (!staff) {
            throw new common_1.NotFoundException(`Staff with ID ${administeredById} not found`);
        }
        medication.status = medication_status_enum_1.MedicationStatus.ADMINISTERED;
        medication.administeredAt = data.administeredAt || new Date();
        medication.administeredById = staff.id;
        medication.notes = data.notes || medication.notes;
        if (data.vitalSigns) {
            medication.vitalSigns = data.vitalSigns;
        }
        medication.auditLog = medication.auditLog || [];
        medication.auditLog.push({
            timestamp: new Date(),
            action: 'MEDICATION_ADMINISTERED',
            performedById: staff.id,
            performedBy: `${staff.firstName} ${staff.lastName}`,
            changes: {
                status: medication_status_enum_1.MedicationStatus.ADMINISTERED,
                administeredAt: medication.administeredAt,
                notes: medication.notes,
            },
        });
        return this.medicationAdminRepository.save(medication);
    }
    async updateMedicationStatus(medicationId, status, updatedById, notes) {
        const medication = await this.medicationAdminRepository.findOne(medicationId);
        if (!medication) {
            throw new common_1.NotFoundException(`Medication administration record with ID ${medicationId} not found`);
        }
        const staff = await this.staffRepository.findOne(updatedById);
        if (!staff) {
            throw new common_1.NotFoundException(`Staff with ID ${updatedById} not found`);
        }
        const validTransitions = {
            [medication_status_enum_1.MedicationStatus.PENDING]: [
                medication_status_enum_1.MedicationStatus.ADMINISTERED,
                medication_status_enum_1.MedicationStatus.REFUSED,
                medication_status_enum_1.MedicationStatus.MISSED,
                medication_status_enum_1.MedicationStatus.HOLD,
                medication_status_enum_1.MedicationStatus.CANCELLED
            ],
            [medication_status_enum_1.MedicationStatus.HOLD]: [
                medication_status_enum_1.MedicationStatus.ADMINISTERED,
                medication_status_enum_1.MedicationStatus.CANCELLED
            ],
        };
        const allowedTransitions = validTransitions[medication.status] || [];
        if (medication.status !== status && !allowedTransitions.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${medication.status} to ${status}`);
        }
        const previousStatus = medication.status;
        medication.status = status;
        if (status === medication_status_enum_1.MedicationStatus.ADMINISTERED) {
            medication.administeredAt = new Date();
            medication.administeredById = staff.id;
        }
        if (notes) {
            medication.notes = notes;
        }
        medication.auditLog = medication.auditLog || [];
        medication.auditLog.push({
            timestamp: new Date(),
            action: `STATUS_CHANGED_${status}`,
            performedById: staff.id,
            performedBy: `${staff.firstName} ${staff.lastName}`,
            changes: {
                status,
                notes: notes || null,
            },
        });
        return this.medicationAdminRepository.save(medication);
    }
    async getMedicationAdministrations(patientId, filters = {}) {
        const { startDate, endDate, status, isPRN, medicationName, limit = 100 } = filters;
        const query = this.medicationAdminRepository
            .createQueryBuilder('mar')
            .leftJoinAndSelect('mar.patient', 'patient')
            .leftJoinAndSelect('mar.admission', 'admission')
            .leftJoinAndSelect('mar.administeredBy', 'administeredBy')
            .where('mar.patientId = :patientId', { patientId });
        if (status) {
            query.andWhere('mar.status = :status', { status });
        }
        if (isPRN !== undefined) {
            query.andWhere('mar.isPRN = :isPRN', { isPRN });
        }
        if (medicationName) {
            query.andWhere('mar.medicationName ILIKE :medicationName', {
                medicationName: `%${medicationName}%`
            });
        }
        if (startDate && endDate) {
            query.andWhere('mar.scheduledTime BETWEEN :startDate AND :endDate', {
                startDate,
                endDate
            });
        }
        else if (startDate) {
            query.andWhere('mar.scheduledTime >= :startDate', { startDate });
        }
        query.orderBy('mar.scheduledTime', 'DESC').take(limit);
        return query.getMany();
    }
    async getMedicationAdministration(id) {
        const medication = await this.medicationAdminRepository.findOne(id, {
            relations: [
                'patient',
                'admission',
                'administeredBy',
                'scheduledBy'
            ],
        });
        if (!medication) {
            throw new common_1.NotFoundException(`Medication administration record with ID ${id} not found`);
        }
        return medication;
    }
    async getMedicationAdherenceReport(patientId, startDate, endDate) {
        const medications = await this.medicationAdminRepository
            .createQueryBuilder('mar')
            .where('mar.patientId = :patientId', { patientId })
            .andWhere('mar.scheduledTime BETWEEN :startDate AND :endDate', { startDate, endDate })
            .orderBy('mar.scheduledTime', 'ASC')
            .getMany();
        const totalScheduled = medications.length;
        const administered = medications.filter(m => m.status === medication_status_enum_1.MedicationStatus.ADMINISTERED).length;
        const missed = medications.filter(m => m.status === medication_status_enum_1.MedicationStatus.MISSED).length;
        const refused = medications.filter(m => m.status === medication_status_enum_1.MedicationStatus.REFUSED).length;
        const onHold = medications.filter(m => m.status === medication_status_enum_1.MedicationStatus.HOLD).length;
        const pending = medications.filter(m => m.status === medication_status_enum_1.MedicationStatus.PENDING).length;
        const adherenceRate = totalScheduled > 0
            ? Math.round((administered / totalScheduled) * 100)
            : 0;
        return {
            totalScheduled,
            administered,
            missed,
            refused,
            onHold,
            pending,
            adherenceRate,
            medications,
        };
    }
};
exports.NursingService = NursingService;
exports.NursingService = NursingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nursing_chart_entity_1.NursingChart)),
    __param(1, (0, typeorm_1.InjectRepository)(medication_administration_entity_1.MedicationAdministration)),
    __param(2, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(3, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(4, (0, typeorm_1.InjectRepository)(admission_entity_1.Admission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NursingService);
//# sourceMappingURL=nursing.service.js.map