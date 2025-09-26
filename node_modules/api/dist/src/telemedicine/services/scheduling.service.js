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
var SchedulingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let SchedulingService = SchedulingService_1 = class SchedulingService {
    prisma;
    auditService;
    logger = new common_1.Logger(SchedulingService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async scheduleConsultation(scheduleDto, user) {
        this.logger.log(`Scheduling consultation for doctor ${scheduleDto.doctorId}`);
        const availability = await this.checkDoctorAvailability(scheduleDto.doctorId, scheduleDto.date, scheduleDto.timeSlot);
        if (!availability.available) {
            throw new common_1.BadRequestException('Doctor is not available at the requested time');
        }
        const conflictingAppointment = await this.prisma.telemedicineConsultation.findFirst({
            where: {
                doctorId: scheduleDto.doctorId,
                scheduledAt: new Date(scheduleDto.date),
                status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
            },
        });
        if (conflictingAppointment) {
            throw new common_1.BadRequestException('Doctor has a conflicting appointment');
        }
        const consultation = await this.prisma.telemedicineConsultation.create({
            data: {
                patientId: scheduleDto.patientId,
                doctorId: scheduleDto.doctorId,
                scheduledAt: new Date(scheduleDto.date),
                duration: scheduleDto.duration || 30,
                consultationType: scheduleDto.consultationType || 'GENERAL',
                status: 'SCHEDULED',
                createdBy: user.id,
                tenantId: user.tenantId,
            },
        });
        await this.auditService.logActivity({
            action: 'CONSULTATION_SCHEDULED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: consultation.id,
            userId: user.id,
            details: {
                doctorId: scheduleDto.doctorId,
                scheduledAt: scheduleDto.date,
                duration: scheduleDto.duration,
            },
        });
        return consultation;
    }
    async checkDoctorAvailability(doctorId, date, timeSlot) {
        this.logger.log(`Checking availability for doctor ${doctorId} on ${date}`);
        const doctor = await this.prisma.user.findUnique({
            where: { id: doctorId },
            select: {
                id: true,
                availabilitySchedule: true,
                workingHours: true,
            },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const requestedDate = new Date(date);
        const dayOfWeek = requestedDate.getDay();
        const workingHours = doctor.workingHours?.find(wh => wh.dayOfWeek === dayOfWeek);
        if (!workingHours) {
            return { available: false, reason: 'Doctor not available on this day' };
        }
        const requestedTime = timeSlot ? new Date(`${date}T${timeSlot}`) : requestedDate;
        const startTime = new Date(`${date}T${workingHours.startTime}`);
        const endTime = new Date(`${date}T${workingHours.endTime}`);
        if (requestedTime < startTime || requestedTime > endTime) {
            return { available: false, reason: 'Time outside working hours' };
        }
        const existingAppointments = await this.prisma.telemedicineConsultation.findMany({
            where: {
                doctorId,
                scheduledAt: {
                    gte: new Date(date),
                    lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
                },
                status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
            },
        });
        for (const appointment of existingAppointments) {
            const appointmentEnd = new Date(appointment.scheduledAt.getTime() + (appointment.duration || 30) * 60 * 1000);
            if (requestedTime < appointmentEnd && new Date(requestedTime.getTime() + (scheduleDto.duration || 30) * 60 * 1000) > appointment.scheduledAt) {
                return { available: false, reason: 'Conflicting appointment' };
            }
        }
        return { available: true };
    }
    async getAvailability(query, user) {
        const { doctorId, date, duration = 30 } = query;
        if (!doctorId || !date) {
            throw new common_1.BadRequestException('Doctor ID and date are required');
        }
        const doctor = await this.prisma.user.findUnique({
            where: { id: doctorId },
            select: {
                workingHours: true,
                telemedicineSettings: true,
            },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const requestedDate = new Date(date);
        const dayOfWeek = requestedDate.getDay();
        const workingHours = doctor.workingHours?.find(wh => wh.dayOfWeek === dayOfWeek);
        if (!workingHours) {
            return { available: false, reason: 'Doctor not available on this day' };
        }
        const existingAppointments = await this.prisma.telemedicineConsultation.findMany({
            where: {
                doctorId,
                scheduledAt: {
                    gte: new Date(date),
                    lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
                },
                status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
            },
            select: {
                scheduledAt: true,
                duration: true,
            },
        });
        const availableSlots = [];
        const slotDuration = doctor.telemedicineSettings?.slotDuration || 30;
        const startTime = new Date(`${date}T${workingHours.startTime}`);
        const endTime = new Date(`${date}T${workingHours.endTime}`);
        let currentSlot = new Date(startTime);
        while (currentSlot < endTime) {
            const slotEnd = new Date(currentSlot.getTime() + slotDuration * 60 * 1000);
            const hasConflict = existingAppointments.some(appointment => {
                const appointmentEnd = new Date(appointment.scheduledAt.getTime() + (appointment.duration || 30) * 60 * 1000);
                return currentSlot < appointmentEnd && slotEnd > appointment.scheduledAt;
            });
            if (!hasConflict) {
                availableSlots.push({
                    startTime: currentSlot.toTimeString().slice(0, 5),
                    endTime: slotEnd.toTimeString().slice(0, 5),
                    duration: slotDuration,
                });
            }
            currentSlot = slotEnd;
        }
        return {
            doctorId,
            date,
            workingHours: {
                start: workingHours.startTime,
                end: workingHours.endTime,
            },
            slotDuration,
            availableSlots,
        };
    }
    async getTimeSlots(query, user) {
        const { doctorId, date } = query;
        const availability = await this.getAvailability({ doctorId, date }, user);
        return availability.availableSlots;
    }
    async rescheduleConsultation(id, rescheduleDto, user) {
        this.logger.log(`Rescheduling consultation ${id}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cannot reschedule completed consultation');
        }
        const availability = await this.checkDoctorAvailability(consultation.doctorId, rescheduleDto.newDate, rescheduleDto.newTime);
        if (!availability.available) {
            throw new common_1.BadRequestException('Doctor is not available at the new time');
        }
        const oldValues = { ...consultation };
        const updatedConsultation = await this.prisma.telemedicineConsultation.update({
            where: { id },
            data: {
                scheduledAt: new Date(rescheduleDto.newDate),
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'CONSULTATION_RESCHEDULED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: id,
            userId: user.id,
            oldValues,
            newValues: updatedConsultation,
            details: {
                oldDate: consultation.scheduledAt,
                newDate: rescheduleDto.newDate,
            },
        });
        return updatedConsultation;
    }
    async findEmergencyDoctor(tenantId) {
        this.logger.log(`Finding emergency doctor for tenant ${tenantId}`);
        const emergencyDoctors = await this.prisma.user.findMany({
            where: {
                tenantId,
                roles: { has: 'DOCTOR' },
                isEmergencyAvailable: true,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                specialization: true,
            },
            orderBy: { lastEmergencyConsultation: 'asc' },
        });
        if (emergencyDoctors.length === 0) {
            return null;
        }
        return emergencyDoctors[0];
    }
    async getDoctorSchedule(doctorId, date) {
        this.logger.log(`Getting schedule for doctor ${doctorId} on ${date}`);
        const consultations = await this.prisma.telemedicineConsultation.findMany({
            where: {
                doctorId,
                scheduledAt: {
                    gte: new Date(date),
                    lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
                },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
            orderBy: { scheduledAt: 'asc' },
        });
        return consultations;
    }
    async cancelAppointment(id, reason, user) {
        this.logger.log(`Cancelling appointment ${id}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const updatedConsultation = await this.prisma.telemedicineConsultation.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                cancellationReason: reason,
                cancelledAt: new Date(),
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'APPOINTMENT_CANCELLED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: id,
            userId: user.id,
            details: { reason },
        });
        return updatedConsultation;
    }
};
exports.SchedulingService = SchedulingService;
exports.SchedulingService = SchedulingService = SchedulingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], SchedulingService);
//# sourceMappingURL=scheduling.service.js.map