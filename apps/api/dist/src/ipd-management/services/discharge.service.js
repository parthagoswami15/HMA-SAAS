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
exports.DischargeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const discharge_entity_1 = require("../entities/discharge.entity");
const admission_entity_1 = require("../entities/admission.entity");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
const bed_entity_1 = require("../entities/bed.entity");
const discharge_status_enum_1 = require("../enums/discharge-status.enum");
const admission_status_enum_1 = require("../enums/admission-status.enum");
let DischargeService = class DischargeService {
    dischargeRepository;
    admissionRepository;
    patientRepository;
    staffRepository;
    bedRepository;
    constructor(dischargeRepository, admissionRepository, patientRepository, staffRepository, bedRepository) {
        this.dischargeRepository = dischargeRepository;
        this.admissionRepository = admissionRepository;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.bedRepository = bedRepository;
    }
    async initiateDischarge(admissionId, dischargedById, dischargeType) {
        const admission = await this.admissionRepository.findOne({
            where: { id: admissionId },
            relations: ['patient', 'bed', 'discharge'],
        });
        if (!admission) {
            throw new common_1.NotFoundException(`Admission with ID ${admissionId} not found`);
        }
        if (admission.status !== admission_status_enum_1.AdmissionStatus.ADMITTED) {
            throw new common_1.BadRequestException(`Admission is already ${admission.status.toLowerCase()}`);
        }
        if (admission.discharge) {
            throw new common_1.ConflictException('Discharge process already initiated for this admission');
        }
        const staff = await this.staffRepository.findOne(dischargedById);
        if (!staff) {
            throw new common_1.NotFoundException(`Staff with ID ${dischargedById} not found`);
        }
        const discharge = this.dischargeRepository.create({
            admissionId,
            patientId: admission.patientId,
            dischargedById,
            dischargeType,
            status: discharge_status_enum_1.DischargeStatus.INITIATED,
            dischargeDate: new Date(),
        });
        const savedDischarge = await this.dischargeRepository.save(discharge);
        await this.admissionRepository.update(admissionId, {
            status: admission_status_enum_1.AdmissionStatus.DISCHARGED,
            dischargeDate: new Date(),
        });
        return savedDischarge;
    }
    async updateDischargeStatus(dischargeId, status, updatedById) {
        const discharge = await this.dischargeRepository.findOne(dischargeId, {
            relations: ['admission', 'patient', 'dischargedBy'],
        });
        if (!discharge) {
            throw new common_1.NotFoundException(`Discharge with ID ${dischargeId} not found`);
        }
        const validTransitions = {
            [discharge_status_enum_1.DischargeStatus.INITIATED]: [
                discharge_status_enum_1.DischargeStatus.BILLING_PENDING,
                discharge_status_enum_1.DischargeStatus.CANCELLED
            ],
            [discharge_status_enum_1.DischargeStatus.BILLING_PENDING]: [
                discharge_status_enum_1.DischargeStatus.BILLING_COMPLETED,
                discharge_status_enum_1.DischargeStatus.CANCELLED
            ],
            [discharge_status_enum_1.DischargeStatus.BILLING_COMPLETED]: [
                discharge_status_enum_1.DischargeStatus.MEDICATION_PENDING,
                discharge_status_enum_1.DischargeStatus.CANCELLED
            ],
            [discharge_status_enum_1.DischargeStatus.MEDICATION_PENDING]: [
                discharge_status_enum_1.DischargeStatus.DOCUMENTATION_PENDING,
                discharge_status_enum_1.DischargeStatus.CANCELLED
            ],
            [discharge_status_enum_1.DischargeStatus.DOCUMENTATION_PENDING]: [
                discharge_status_enum_1.DischargeStatus.FINAL_REVIEW,
                discharge_status_enum_1.DischargeStatus.CANCELLED
            ],
            [discharge_status_enum_1.DischargeStatus.FINAL_REVIEW]: [
                discharge_status_enum_1.DischargeStatus.COMPLETED,
                discharge_status_enum_1.DischargeStatus.CANCELLED
            ],
        };
        const allowedTransitions = validTransitions[discharge.status] || [];
        if (discharge.status !== status && !allowedTransitions.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${discharge.status} to ${status}`);
        }
        const previousStatus = discharge.status;
        discharge.status = status;
        const now = new Date();
        switch (status) {
            case discharge_status_enum_1.DischargeStatus.BILLING_COMPLETED:
                discharge.billingCompletedAt = discharge.billingCompletedAt || now;
                break;
            case discharge_status_enum_1.DischargeStatus.MEDICATION_PENDING:
                discharge.medicationIssuedAt = discharge.medicationIssuedAt || now;
                break;
            case discharge_status_enum_1.DischargeStatus.DOCUMENTATION_PENDING:
                discharge.documentationCompletedAt = discharge.documentationCompletedAt || now;
                break;
            case discharge_status_enum_1.DischargeStatus.FINAL_REVIEW:
                discharge.finalReviewAt = discharge.finalReviewAt || now;
                break;
            case discharge_status_enum_1.DischargeStatus.COMPLETED:
                discharge.completedAt = discharge.completedAt || now;
                if (discharge.admission?.bedId) {
                    await this.bedRepository.update(discharge.admission.bedId, {
                        status: 'AVAILABLE',
                        updatedBy: updatedById,
                    });
                }
                break;
            case discharge_status_enum_1.DischargeStatus.CANCELLED:
                discharge.cancelledAt = discharge.cancelledAt || now;
                discharge.cancelledBy = updatedById;
                if (discharge.admission) {
                    await this.admissionRepository.update(discharge.admission.id, {
                        status: admission_status_enum_1.AdmissionStatus.ADMITTED,
                        dischargeDate: null,
                    });
                }
                break;
        }
        discharge.auditLog = discharge.auditLog || [];
        discharge.auditLog.push({
            timestamp: now,
            action: `STATUS_CHANGED_${status}`,
            performedById: updatedById,
            performedBy: 'System',
            changes: {
                status: {
                    from: previousStatus,
                    to: status,
                },
            },
        });
        return this.dischargeRepository.save(discharge);
    }
    async updateDischargeSummary(dischargeId, summaryData, updatedById) {
        const discharge = await this.dischargeRepository.findOne(dischargeId);
        if (!discharge) {
            throw new common_1.NotFoundException(`Discharge with ID ${dischargeId} not found`);
        }
        const changes = {};
        Object.keys(summaryData).forEach(key => {
            if (JSON.stringify(discharge[key]) !== JSON.stringify(summaryData[key])) {
                changes[key] = {
                    from: discharge[key],
                    to: summaryData[key],
                };
            }
        });
        Object.assign(discharge, summaryData);
        if (Object.keys(changes).length > 0) {
            discharge.auditLog = discharge.auditLog || [];
            discharge.auditLog.push({
                timestamp: new Date(),
                action: 'SUMMARY_UPDATED',
                performedById: updatedById,
                performedBy: 'System',
                changes,
            });
        }
        return this.dischargeRepository.save(discharge);
    }
    async getDischargeById(dischargeId) {
        const discharge = await this.dischargeRepository.findOne(dischargeId, {
            relations: [
                'patient',
                'admission',
                'admission.bed',
                'admission.bed.ward',
                'dischargedBy',
                'cancelledBy',
            ],
        });
        if (!discharge) {
            throw new common_1.NotFoundException(`Discharge with ID ${dischargeId} not found`);
        }
        return discharge;
    }
    async getDischarges(filters = {}) {
        const { patientId, doctorId, wardId, status, dischargeType, startDate, endDate, page = 1, limit = 10, } = filters;
        const skip = (page - 1) * limit;
        const query = this.dischargeRepository
            .createQueryBuilder('discharge')
            .leftJoinAndSelect('discharge.patient', 'patient')
            .leftJoinAndSelect('discharge.admission', 'admission')
            .leftJoinAndSelect('admission.bed', 'bed')
            .leftJoinAndSelect('bed.ward', 'ward')
            .leftJoinAndSelect('discharge.dischargedBy', 'dischargedBy');
        if (patientId) {
            query.andWhere('discharge.patientId = :patientId', { patientId });
        }
        if (doctorId) {
            query.andWhere('admission.admittingDoctorId = :doctorId', { doctorId });
        }
        if (wardId) {
            query.andWhere('bed.wardId = :wardId', { wardId });
        }
        if (status) {
            if (Array.isArray(status)) {
                query.andWhere('discharge.status IN (:...statuses)', { statuses: status });
            }
            else {
                query.andWhere('discharge.status = :status', { status });
            }
        }
        if (dischargeType) {
            if (Array.isArray(dischargeType)) {
                query.andWhere('discharge.dischargeType IN (:...types)', { types: dischargeType });
            }
            else {
                query.andWhere('discharge.dischargeType = :dischargeType', { dischargeType });
            }
        }
        if (startDate && endDate) {
            query.andWhere('discharge.dischargeDate BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        else if (startDate) {
            query.andWhere('discharge.dischargeDate >= :startDate', { startDate });
        }
        else if (endDate) {
            query.andWhere('discharge.dischargeDate <= :endDate', { endDate });
        }
        const total = await query.getCount();
        const data = await query
            .orderBy('discharge.dischargeDate', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();
        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getDischargeSummary(dischargeId) {
        const discharge = await this.dischargeRepository.findOne(dischargeId, {
            relations: [
                'patient',
                'admission',
                'admission.admittingDoctor',
                'admission.bed',
                'admission.bed.ward',
                'dischargedBy',
            ],
        });
        if (!discharge) {
            throw new common_1.NotFoundException(`Discharge with ID ${dischargeId} not found`);
        }
        return {
            patient: {
                id: discharge.patient.id,
                name: `${discharge.patient.firstName} ${discharge.patient.lastName}`,
                dateOfBirth: discharge.patient.dateOfBirth,
                gender: discharge.patient.gender,
                bloodGroup: discharge.patient.bloodGroup,
                address: discharge.patient.address,
                phone: discharge.patient.phone,
            },
            admission: {
                id: discharge.admission.id,
                admissionDate: discharge.admission.admissionDate,
                admissionDiagnosis: discharge.admission.diagnosis,
                admittingDoctor: discharge.admission.admittingDoctor
                    ? `${discharge.admission.admittingDoctor.firstName} ${discharge.admission.admittingDoctor.lastName}`
                    : null,
                ward: discharge.admission.bed?.ward?.name,
                bed: discharge.admission.bed?.bedNumber,
            },
            discharge: {
                id: discharge.id,
                dischargeDate: discharge.dischargeDate,
                dischargeType: discharge.dischargeType,
                status: discharge.status,
                dischargedBy: discharge.dischargedBy
                    ? `${discharge.dischargedBy.firstName} ${discharge.dischargedBy.lastName}`
                    : null,
                diagnosisAtDischarge: discharge.diagnosisAtDischarge,
                proceduresPerformed: discharge.proceduresPerformed,
                hospitalCourse: discharge.hospitalCourse,
                conditionAtDischarge: discharge.conditionAtDischarge,
                followUpPlan: discharge.followUpPlan,
                patientEducation: discharge.patientEducation,
                dischargeMedications: discharge.dischargeMedications,
                followUpAppointments: discharge.followUpAppointments,
            },
        };
    }
    async getDischargeStatistics(startDate, endDate) {
        const totalDischarges = await this.dischargeRepository.count({
            where: {
                dischargeDate: (0, typeorm_2.Between)(startDate, endDate),
            },
        });
        const dischargesByType = await this.dischargeRepository
            .createQueryBuilder('discharge')
            .select('discharge.dischargeType', 'type')
            .addSelect('COUNT(*)', 'count')
            .where('discharge.dischargeDate BETWEEN :startDate AND :endDate', { startDate, endDate })
            .groupBy('discharge.dischargeType')
            .getRawMany();
        const avgStayDuration = await this.dischargeRepository
            .createQueryBuilder('discharge')
            .select('AVG(DATEDIFF(discharge.dischargeDate, admission.admissionDate))', 'avgDays')
            .innerJoin('discharge.admission', 'admission')
            .where('discharge.dischargeDate BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getRawOne();
        const readmissionThreshold = new Date(endDate);
        readmissionThreshold.setDate(readmissionThreshold.getDate() - 30);
        const readmissions = await this.dischargeRepository
            .createQueryBuilder('d1')
            .select('COUNT(DISTINCT d1.patientId)', 'readmissionCount')
            .innerJoin('d1.admission', 'a1')
            .innerJoin(admission_entity_1.Admission, 'a2', 'a2.patientId = d1.patientId AND a2.admissionDate > d1.dischargeDate AND a2.admissionDate <= DATE_ADD(d1.dischargeDate, INTERVAL 30 DAY)')
            .where('d1.dischargeDate BETWEEN :startDate AND :endDate', {
            startDate: readmissionThreshold,
            endDate
        })
            .getRawOne();
        const readmissionRate = totalDischarges > 0
            ? (parseInt(readmissions.readmissionCount, 10) / totalDischarges) * 100
            : 0;
        return {
            totalDischarges,
            dischargesByType: dischargesByType.reduce((acc, { type, count }) => ({
                ...acc,
                [type]: parseInt(count, 10),
            }), {}),
            averageLengthOfStay: parseFloat(avgStayDuration.avgDays || 0).toFixed(2),
            readmissionRate: readmissionRate.toFixed(2),
            timePeriod: { startDate, endDate },
        };
    }
};
exports.DischargeService = DischargeService;
exports.DischargeService = DischargeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(discharge_entity_1.Discharge)),
    __param(1, (0, typeorm_1.InjectRepository)(admission_entity_1.Admission)),
    __param(2, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(3, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(4, (0, typeorm_1.InjectRepository)(bed_entity_1.Bed)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DischargeService);
//# sourceMappingURL=discharge.service.js.map