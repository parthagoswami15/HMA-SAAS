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
exports.ImagingScheduleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ImagingScheduleService = class ImagingScheduleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async scheduleStudy(studyId, scheduleData) {
        const { scheduledFor, modalityId, scheduledBy, notes } = scheduleData;
        const study = await this.prisma.study.findUnique({
            where: { id: studyId },
            include: {
                order: true,
            },
        });
        if (!study) {
            throw new common_1.NotFoundException('Study not found');
        }
        if (study.status !== 'ORDERED' && study.status !== 'DRAFTED') {
            throw new common_1.BadRequestException('Study cannot be scheduled in current status');
        }
        const modality = await this.prisma.modality.findUnique({
            where: { id: modalityId },
        });
        if (!modality) {
            throw new common_1.NotFoundException('Modality not found');
        }
        if (!modality.isActive) {
            throw new common_1.BadRequestException('Modality is not active');
        }
        const conflicts = await this.checkSchedulingConflicts(modalityId, scheduledFor, study.estimatedDuration);
        if (conflicts.length > 0) {
            throw new common_1.ConflictException('Scheduling conflict detected');
        }
        const updatedStudy = await this.prisma.study.update({
            where: { id: studyId },
            data: {
                scheduledFor: new Date(scheduledFor),
                modalityId,
                scheduledBy,
                status: 'SCHEDULED',
                notes,
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
                modality: true,
            },
        });
        await this.prisma.imagingSchedule.create({
            data: {
                studyId,
                modalityId,
                scheduledFor: new Date(scheduledFor),
                scheduledBy,
                status: 'CONFIRMED',
                notes,
                tenantId: study.tenantId,
            },
        });
        return updatedStudy;
    }
    async getAvailableSlots(modalityId, date) {
        const modality = await this.prisma.modality.findUnique({
            where: { id: modalityId },
        });
        if (!modality) {
            throw new common_1.NotFoundException('Modality not found');
        }
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        const scheduledStudies = await this.prisma.imagingSchedule.findMany({
            where: {
                modalityId,
                scheduledFor: {
                    gte: dayStart,
                    lte: dayEnd,
                },
                status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
            },
            include: {
                study: {
                    select: {
                        id: true,
                        estimatedDuration: true,
                    },
                },
            },
        });
        const availableSlots = [];
        const slotDuration = 15;
        const operatingHours = this.getOperatingHours(modality.modalityType);
        for (let hour = operatingHours.start; hour < operatingHours.end; hour++) {
            for (let minute = 0; minute < 60; minute += slotDuration) {
                const slotStart = new Date(date);
                slotStart.setHours(hour, minute, 0, 0);
                const slotEnd = new Date(slotStart);
                slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
                const hasConflict = scheduledStudies.some(scheduled => {
                    const studyStart = scheduled.scheduledFor;
                    const studyEnd = new Date(studyStart);
                    studyEnd.setMinutes(studyEnd.getMinutes() + (scheduled.study.estimatedDuration || 30));
                    return ((slotStart >= studyStart && slotStart < studyEnd) ||
                        (slotEnd > studyStart && slotEnd <= studyEnd) ||
                        (slotStart <= studyStart && slotEnd >= studyEnd));
                });
                if (!hasConflict) {
                    availableSlots.push({
                        startTime: slotStart.toISOString(),
                        endTime: slotEnd.toISOString(),
                        duration: slotDuration,
                    });
                }
            }
        }
        return availableSlots;
    }
    async rescheduleStudy(studyId, newScheduleData) {
        const { scheduledFor, modalityId, reason } = newScheduleData;
        const study = await this.prisma.study.findUnique({
            where: { id: studyId },
        });
        if (!study) {
            throw new common_1.NotFoundException('Study not found');
        }
        if (study.status === 'COMPLETED' || study.status === 'SIGNED') {
            throw new common_1.BadRequestException('Cannot reschedule completed or signed study');
        }
        const conflicts = await this.checkSchedulingConflicts(modalityId || study.modalityId, scheduledFor, study.estimatedDuration);
        if (conflicts.length > 0) {
            throw new common_1.ConflictException('Scheduling conflict detected');
        }
        const updatedStudy = await this.prisma.study.update({
            where: { id: studyId },
            data: {
                scheduledFor: new Date(scheduledFor),
                modalityId: modalityId || study.modalityId,
                status: 'SCHEDULED',
            },
        });
        const scheduleEntry = await this.prisma.imagingSchedule.findFirst({
            where: { studyId },
        });
        if (scheduleEntry) {
            await this.prisma.imagingSchedule.update({
                where: { id: scheduleEntry.id },
                data: {
                    scheduledFor: new Date(scheduledFor),
                    modalityId: modalityId || study.modalityId,
                    status: 'CONFIRMED',
                    rescheduledAt: new Date(),
                    rescheduleReason: reason,
                },
            });
        }
        return updatedStudy;
    }
    async cancelSchedule(studyId, reason) {
        const study = await this.prisma.study.findUnique({
            where: { id: studyId },
        });
        if (!study) {
            throw new common_1.NotFoundException('Study not found');
        }
        if (study.status === 'COMPLETED' || study.status === 'IN_PROGRESS') {
            throw new common_1.BadRequestException('Cannot cancel completed or in-progress study');
        }
        await this.prisma.study.update({
            where: { id: studyId },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
            },
        });
        const scheduleEntry = await this.prisma.imagingSchedule.findFirst({
            where: { studyId },
        });
        if (scheduleEntry) {
            await this.prisma.imagingSchedule.update({
                where: { id: scheduleEntry.id },
                data: {
                    status: 'CANCELLED',
                    cancelledAt: new Date(),
                    cancelReason: reason,
                },
            });
        }
        return { message: 'Study schedule cancelled successfully' };
    }
    async getScheduleByDate(date, modalityId) {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        const where = {
            scheduledFor: {
                gte: dayStart,
                lte: dayEnd,
            },
            status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
        };
        if (modalityId) {
            where.modalityId = modalityId;
        }
        const schedules = await this.prisma.imagingSchedule.findMany({
            where,
            include: {
                study: {
                    include: {
                        order: {
                            include: {
                                patient: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        dateOfBirth: true,
                                    },
                                },
                            },
                        },
                    },
                },
                modality: true,
            },
            orderBy: { scheduledFor: 'asc' },
        });
        return schedules.map(schedule => ({
            id: schedule.id,
            scheduledFor: schedule.scheduledFor,
            status: schedule.status,
            study: {
                studyInstanceUID: schedule.study.studyInstanceUID,
                status: schedule.study.status,
                patientName: `${schedule.study.order.patient.firstName} ${schedule.study.order.patient.lastName}`,
                patientId: schedule.study.order.patientId,
                accessionNumber: schedule.study.accessionNumber,
                protocol: schedule.study.order.protocol,
            },
            modality: {
                id: schedule.modality.id,
                name: schedule.modality.name,
                modalityType: schedule.modality.modalityType,
            },
        }));
    }
    async getScheduleStats(tenantId, dateFrom, dateTo) {
        const where = { tenantId };
        if (dateFrom || dateTo) {
            where.scheduledFor = {};
            if (dateFrom)
                where.scheduledFor.gte = dateFrom;
            if (dateTo)
                where.scheduledFor.lte = dateTo;
        }
        const schedules = await this.prisma.imagingSchedule.findMany({
            where,
            include: {
                modality: true,
                study: true,
            },
        });
        const stats = {
            totalScheduled: schedules.length,
            byStatus: {},
            byModality: {},
            utilizationRate: 0,
        };
        schedules.forEach(schedule => {
            stats.byStatus[schedule.status] = (stats.byStatus[schedule.status] || 0) + 1;
            stats.byModality[schedule.modality.modalityType] =
                (stats.byModality[schedule.modality.modalityType] || 0) + 1;
        });
        const totalSlots = this.calculateTotalSlots(schedules);
        stats.utilizationRate = totalSlots > 0 ? (schedules.length / totalSlots) * 100 : 0;
        return stats;
    }
    async checkSchedulingConflicts(modalityId, scheduledFor, duration = 30) {
        const slotStart = new Date(scheduledFor);
        const slotEnd = new Date(scheduledFor);
        slotEnd.setMinutes(slotEnd.getMinutes() + duration);
        const conflicts = await this.prisma.imagingSchedule.findMany({
            where: {
                modalityId,
                status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
                scheduledFor: {
                    lt: slotEnd,
                    gte: new Date(slotStart.getTime() - duration * 60 * 1000),
                },
            },
            include: {
                study: {
                    select: {
                        id: true,
                        studyInstanceUID: true,
                    },
                },
            },
        });
        return conflicts;
    }
    getOperatingHours(modalityType) {
        switch (modalityType) {
            case 'CT':
                return { start: 7, end: 22 };
            case 'MRI':
                return { start: 6, end: 23 };
            case 'XR':
                return { start: 8, end: 20 };
            case 'US':
                return { start: 8, end: 18 };
            default:
                return { start: 8, end: 20 };
        }
    }
    calculateTotalSlots(schedules) {
        const modalities = new Set(schedules.map(s => s.modalityId));
        const operatingHours = 12;
        const slotsPerHour = 4;
        return modalities.size * operatingHours * slotsPerHour;
    }
    async updateScheduleStatus(scheduleId, status) {
        const schedule = await this.prisma.imagingSchedule.findUnique({
            where: { id: scheduleId },
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Schedule not found');
        }
        const updatedSchedule = await this.prisma.imagingSchedule.update({
            where: { id: scheduleId },
            data: {
                status,
                updatedAt: new Date(),
            },
        });
        if (status === 'COMPLETED') {
            await this.prisma.study.update({
                where: { id: schedule.studyId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });
        }
        return updatedSchedule;
    }
};
exports.ImagingScheduleService = ImagingScheduleService;
exports.ImagingScheduleService = ImagingScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImagingScheduleService);
//# sourceMappingURL=imaging-schedule.service.js.map