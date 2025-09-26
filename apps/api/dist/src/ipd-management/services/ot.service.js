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
exports.OtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const surgery_entity_1 = require("../entities/surgery.entity");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const staff_entity_1 = require("../../staff/entities/staff.entity");
const admission_entity_1 = require("../entities/admission.entity");
const surgery_status_enum_1 = require("../enums/surgery-status.enum");
let OtService = class OtService {
    surgeryRepository;
    patientRepository;
    staffRepository;
    admissionRepository;
    constructor(surgeryRepository, patientRepository, staffRepository, admissionRepository) {
        this.surgeryRepository = surgeryRepository;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.admissionRepository = admissionRepository;
    }
    async scheduleSurgery(createSurgeryDto) {
        const { patientId, admissionId, surgeonId, anesthetistId, assistantSurgeonId, scheduledById, ...rest } = createSurgeryDto;
        const patient = await this.patientRepository.findOne(patientId);
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${patientId} not found`);
        }
        const admission = await this.admissionRepository.findOne({
            where: { id: admissionId, patientId },
        });
        if (!admission) {
            throw new common_1.NotFoundException(`Active admission not found for patient ${patientId}`);
        }
        const surgeon = await this.staffRepository.findOne(surgeonId);
        if (!surgeon) {
            throw new common_1.NotFoundException(`Surgeon with ID ${surgeonId} not found`);
        }
        if (anesthetistId) {
            const anesthetist = await this.staffRepository.findOne(anesthetistId);
            if (!anesthetist) {
                throw new common_1.NotFoundException(`Anesthetist with ID ${anesthetistId} not found`);
            }
        }
        if (assistantSurgeonId) {
            const assistantSurgeon = await this.staffRepository.findOne(assistantSurgeonId);
            if (!assistantSurgeon) {
                throw new common_1.NotFoundException(`Assistant surgeon with ID ${assistantSurgeonId} not found`);
            }
        }
        const isTheaterAvailable = await this.isTheaterAvailable(createSurgeryDto.theaterRoom, createSurgeryDto.scheduledDate, createSurgeryDto.estimatedDuration);
        if (!isTheaterAvailable) {
            throw new common_1.ConflictException(`Theater ${createSurgeryDto.theaterRoom} is not available at the scheduled time`);
        }
        const isSurgeonAvailable = await this.isStaffAvailable(surgeonId, createSurgeryDto.scheduledDate, createSurgeryDto.estimatedDuration);
        if (!isSurgeonAvailable) {
            throw new common_1.ConflictException(`Surgeon ${surgeon.firstName} ${surgeon.lastName} is not available at the scheduled time`);
        }
        const surgery = this.surgeryRepository.create({
            ...rest,
            patientId,
            admissionId,
            surgeonId,
            anesthetistId,
            assistantSurgeonId,
            status: surgery_status_enum_1.SurgeryStatus.SCHEDULED,
            scheduledBy: scheduledById,
        });
        return this.surgeryRepository.save(surgery);
    }
    async updateSurgeryStatus(surgeryId, status, updatedById, notes) {
        const surgery = await this.surgeryRepository.findOne(surgeryId, {
            relations: ['patient', 'surgeon', 'anesthetist', 'assistantSurgeon'],
        });
        if (!surgery) {
            throw new common_1.NotFoundException(`Surgery with ID ${surgeryId} not found`);
        }
        const validTransitions = {
            [surgery_status_enum_1.SurgeryStatus.SCHEDULED]: [
                surgery_status_enum_1.SurgeryStatus.PRE_OPERATIVE,
                surgery_status_enum_1.SurgeryStatus.CANCELLED,
                surgery_status_enum_1.SurgeryStatus.POSTPONED
            ],
            [surgery_status_enum_1.SurgeryStatus.PRE_OPERATIVE]: [
                surgery_status_enum_1.SurgeryStatus.IN_PROGRESS,
                surgery_status_enum_1.SurgeryStatus.CANCELLED
            ],
            [surgery_status_enum_1.SurgeryStatus.IN_PROGRESS]: [
                surgery_status_enum_1.SurgeryStatus.COMPLETED,
                surgery_status_enum_1.SurgeryStatus.CANCELLED
            ],
            [surgery_status_enum_1.SurgeryStatus.COMPLETED]: [
                surgery_status_enum_1.SurgeryStatus.IN_RECOVERY
            ],
            [surgery_status_enum_1.SurgeryStatus.IN_RECOVERY]: [
                surgery_status_enum_1.SurgeryStatus.DISCHARGED
            ],
        };
        const allowedTransitions = validTransitions[surgery.status] || [];
        if (surgery.status !== status && !allowedTransitions.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${surgery.status} to ${status}`);
        }
        const previousStatus = surgery.status;
        surgery.status = status;
        const now = new Date();
        switch (status) {
            case surgery_status_enum_1.SurgeryStatus.IN_PROGRESS:
                surgery.startTime = surgery.startTime || now;
                break;
            case surgery_status_enum_1.SurgeryStatus.COMPLETED:
                surgery.endTime = surgery.endTime || now;
                break;
            case surgery_status_enum_1.SurgeryStatus.IN_RECOVERY:
                surgery.recoveryStartTime = surgery.recoveryStartTime || now;
                break;
            case surgery_status_enum_1.SurgeryStatus.DISCHARGED:
                surgery.dischargeTime = surgery.dischargeTime || now;
                break;
            case surgery_status_enum_1.SurgeryStatus.CANCELLED:
            case surgery_status_enum_1.SurgeryStatus.POSTPONED:
                surgery.cancellationTime = surgery.cancellationTime || now;
                surgery.cancellationReason = notes || surgery.cancellationReason;
                break;
        }
        surgery.auditLog = surgery.auditLog || [];
        surgery.auditLog.push({
            timestamp: now,
            action: `STATUS_CHANGED_${status}`,
            performedById: updatedById,
            performedBy: 'System',
            changes: {
                status: {
                    from: previousStatus,
                    to: status,
                },
                notes: notes || null,
            },
        });
        return this.surgeryRepository.save(surgery);
    }
    async updateSurgeryDetails(surgeryId, updateData, updatedById) {
        const surgery = await this.surgeryRepository.findOne(surgeryId);
        if (!surgery) {
            throw new common_1.NotFoundException(`Surgery with ID ${surgeryId} not found`);
        }
        const { id, patientId, admissionId, status, ...safeUpdateData } = updateData;
        if (safeUpdateData.scheduledDate || safeUpdateData.estimatedDuration || safeUpdateData.theaterRoom) {
            const scheduledDate = safeUpdateData.scheduledDate || surgery.scheduledDate;
            const estimatedDuration = safeUpdateData.estimatedDuration || surgery.estimatedDuration;
            const theaterRoom = safeUpdateData.theaterRoom || surgery.theaterRoom;
            const isTheaterAvailable = await this.isTheaterAvailable(theaterRoom, scheduledDate, estimatedDuration, surgeryId);
            if (!isTheaterAvailable) {
                throw new common_1.ConflictException(`Theater ${theaterRoom} is not available at the scheduled time`);
            }
        }
        if (safeUpdateData.surgeonId || safeUpdateData.anesthetistId || safeUpdateData.assistantSurgeonId) {
            const scheduledDate = safeUpdateData.scheduledDate || surgery.scheduledDate;
            const estimatedDuration = safeUpdateData.estimatedDuration || surgery.estimatedDuration;
            if (safeUpdateData.surgeonId) {
                const isAvailable = await this.isStaffAvailable(safeUpdateData.surgeonId, scheduledDate, estimatedDuration, surgeryId);
                if (!isAvailable) {
                    throw new common_1.ConflictException('The selected surgeon is not available at the scheduled time');
                }
            }
        }
        const changes = {};
        Object.keys(safeUpdateData).forEach(key => {
            if (surgery[key] !== safeUpdateData[key]) {
                changes[key] = {
                    from: surgery[key],
                    to: safeUpdateData[key],
                };
            }
        });
        if (Object.keys(changes).length > 0) {
            surgery.auditLog = surgery.auditLog || [];
            surgery.auditLog.push({
                timestamp: new Date(),
                action: 'DETAILS_UPDATED',
                performedById: updatedById,
                performedBy: 'System',
                changes,
            });
        }
        Object.assign(surgery, safeUpdateData);
        return this.surgeryRepository.save(surgery);
    }
    async getSurgeryById(surgeryId) {
        const surgery = await this.surgeryRepository.findOne(surgeryId, {
            relations: [
                'patient',
                'admission',
                'surgeon',
                'anesthetist',
                'assistantSurgeon',
                'scheduledBy',
            ],
        });
        if (!surgery) {
            throw new common_1.NotFoundException(`Surgery with ID ${surgeryId} not found`);
        }
        return surgery;
    }
    async getSurgeries(filters = {}) {
        const { patientId, surgeonId, anesthetistId, status, startDate, endDate, theaterRoom, page = 1, limit = 10, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (patientId)
            where.patientId = patientId;
        if (surgeonId)
            where.surgeonId = surgeonId;
        if (anesthetistId)
            where.anesthetistId = anesthetistId;
        if (status) {
            if (Array.isArray(status)) {
                where.status = (0, typeorm_2.In)(status);
            }
            else {
                where.status = status;
            }
        }
        if (theaterRoom)
            where.theaterRoom = theaterRoom;
        if (startDate && endDate) {
            where.scheduledDate = (0, typeorm_2.Between)(startDate, endDate);
        }
        else if (startDate) {
            where.scheduledDate = (0, typeorm_2.Between)(startDate, new Date());
        }
        const [surgeries, total] = await this.surgeryRepository.findAndCount({
            where,
            relations: ['patient', 'surgeon', 'anesthetist'],
            order: { scheduledDate: 'ASC' },
            skip,
            take: limit,
        });
        return {
            data: surgeries,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getSurgerySchedule(theaterRoom, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return this.surgeryRepository.find({
            where: {
                theaterRoom,
                scheduledDate: (0, typeorm_2.Between)(startOfDay, endOfDay),
                status: (0, typeorm_2.In)([
                    surgery_status_enum_1.SurgeryStatus.SCHEDULED,
                    surgery_status_enum_1.SurgeryStatus.PRE_OPERATIVE,
                    surgery_status_enum_1.SurgeryStatus.IN_PROGRESS
                ]),
            },
            relations: ['patient', 'surgeon', 'anesthetist'],
            order: { scheduledDate: 'ASC' },
        });
    }
    async getSurgeonSchedule(surgeonId, startDate, endDate) {
        return this.surgeryRepository.find({
            where: {
                surgeonId,
                scheduledDate: (0, typeorm_2.Between)(startDate, endDate),
                status: (0, typeorm_2.In)([
                    surgery_status_enum_1.SurgeryStatus.SCHEDULED,
                    surgery_status_enum_1.SurgeryStatus.PRE_OPERATIVE,
                    surgery_status_enum_1.SurgeryStatus.IN_PROGRESS
                ]),
            },
            relations: ['patient', 'theater'],
            order: { scheduledDate: 'ASC' },
        });
    }
    async addSurgeryNotes(surgeryId, notes, userId, type) {
        const surgery = await this.surgeryRepository.findOne(surgeryId);
        if (!surgery) {
            throw new common_1.NotFoundException(`Surgery with ID ${surgeryId} not found`);
        }
        const note = {
            type,
            content: notes,
            createdBy: userId,
            createdAt: new Date(),
        };
        surgery.notes = surgery.notes || [];
        surgery.notes.push(note);
        surgery.auditLog = surgery.auditLog || [];
        surgery.auditLog.push({
            timestamp: new Date(),
            action: 'NOTES_ADDED',
            performedById: userId,
            performedBy: 'System',
            changes: {
                noteType: type,
                content: notes,
            },
        });
        return this.surgeryRepository.save(surgery);
    }
    async addSurgeryComplication(surgeryId, complication, severity, notes, userId) {
        const surgery = await this.surgeryRepository.findOne(surgeryId);
        if (!surgery) {
            throw new common_1.NotFoundException(`Surgery with ID ${surgeryId} not found`);
        }
        const complicationRecord = {
            complication,
            severity,
            notes,
            reportedBy: userId,
            reportedAt: new Date(),
        };
        surgery.complications = surgery.complications || [];
        surgery.complications.push(complicationRecord);
        surgery.auditLog = surgery.auditLog || [];
        surgery.auditLog.push({
            timestamp: new Date(),
            action: 'COMPLICATION_ADDED',
            performedById: userId,
            performedBy: 'System',
            changes: {
                complication,
                severity,
                notes,
            },
        });
        return this.surgeryRepository.save(surgery);
    }
    async isTheaterAvailable(theaterRoom, startTime, durationMinutes, excludeSurgeryId) {
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
        const query = this.surgeryRepository
            .createQueryBuilder('surgery')
            .where('surgery.theaterRoom = :theaterRoom', { theaterRoom })
            .andWhere('surgery.status IN (:...statuses)', {
            statuses: [surgery_status_enum_1.SurgeryStatus.SCHEDULED, surgery_status_enum_1.SurgeryStatus.PRE_OPERATIVE, surgery_status_enum_1.SurgeryStatus.IN_PROGRESS],
        })
            .andWhere('(:startTime BETWEEN surgery.scheduledDate AND DATE_ADD(surgery.scheduledDate, INTERVAL surgery.estimatedDuration MINUTE) ' +
            'OR :endTime BETWEEN surgery.scheduledDate AND DATE_ADD(surgery.scheduledDate, INTERVAL surgery.estimatedDuration MINUTE) ' +
            'OR surgery.scheduledDate BETWEEN :startTime AND :endTime)', { startTime, endTime });
        if (excludeSurgeryId) {
            query.andWhere('surgery.id != :excludeSurgeryId', { excludeSurgeryId });
        }
        const conflictingSurgeries = await query.getCount();
        return conflictingSurgeries === 0;
    }
    async isStaffAvailable(staffId, startTime, durationMinutes, excludeSurgeryId) {
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
        const query = this.surgeryRepository
            .createQueryBuilder('surgery')
            .where('(surgery.surgeonId = :staffId OR surgery.anesthetistId = :staffId OR surgery.assistantSurgeonId = :staffId)', { staffId })
            .andWhere('surgery.status IN (:...statuses)', {
            statuses: [surgery_status_enum_1.SurgeryStatus.SCHEDULED, surgery_status_enum_1.SurgeryStatus.PRE_OPERATIVE, surgery_status_enum_1.SurgeryStatus.IN_PROGRESS],
        })
            .andWhere('(:startTime BETWEEN surgery.scheduledDate AND DATE_ADD(surgery.scheduledDate, INTERVAL surgery.estimatedDuration MINUTE) ' +
            'OR :endTime BETWEEN surgery.scheduledDate AND DATE_ADD(surgery.scheduledDate, INTERVAL surgery.estimatedDuration MINUTE) ' +
            'OR surgery.scheduledDate BETWEEN :startTime AND :endTime)', { startTime, endTime });
        if (excludeSurgeryId) {
            query.andWhere('surgery.id != :excludeSurgeryId', { excludeSurgeryId });
        }
        const conflictingSurgeries = await query.getCount();
        return conflictingSurgeries === 0;
    }
};
exports.OtService = OtService;
exports.OtService = OtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(surgery_entity_1.Surgery)),
    __param(1, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(2, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(3, (0, typeorm_1.InjectRepository)(admission_entity_1.Admission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OtService);
//# sourceMappingURL=ot.service.js.map