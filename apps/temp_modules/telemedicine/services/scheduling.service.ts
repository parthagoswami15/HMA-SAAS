import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async scheduleConsultation(scheduleDto: any, user: any) {
    this.logger.log(`Scheduling consultation for doctor ${scheduleDto.doctorId}`);

    // Check doctor availability
    const availability = await this.checkDoctorAvailability(
      scheduleDto.doctorId,
      scheduleDto.date,
      scheduleDto.timeSlot,
    );

    if (!availability.available) {
      throw new BadRequestException('Doctor is not available at the requested time');
    }

    // Check for conflicting appointments
    const conflictingAppointment = await this.prisma.telemedicineConsultation.findFirst({
      where: {
        doctorId: scheduleDto.doctorId,
        scheduledAt: new Date(scheduleDto.date),
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException('Doctor has a conflicting appointment');
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

    // Log the scheduling
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

  async checkDoctorAvailability(doctorId: string, date: string, timeSlot?: string) {
    this.logger.log(`Checking availability for doctor ${doctorId} on ${date}`);

    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        // availabilitySchedule: true,
        // workingHours: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();

    // Check working hours
    // const workingHours = doctor.workingHours?.find(wh => wh.dayOfWeek === dayOfWeek);
    const workingHours = null; // TODO: Implement working hours logic
    if (!workingHours) {
      return { available: false, reason: 'Doctor not available on this day' };
    }

    // Check if requested time is within working hours
    const requestedTime = timeSlot ? new Date(`${date}T${timeSlot}`) : requestedDate;
    const startTime = new Date(`${date}T${workingHours.startTime}`);
    const endTime = new Date(`${date}T${workingHours.endTime}`);

    if (requestedTime < startTime || requestedTime > endTime) {
      return { available: false, reason: 'Time outside working hours' };
    }

    // Check existing appointments
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

      if (requestedTime < appointmentEnd && new Date(requestedTime.getTime() + (duration || 30) * 60 * 1000) > appointment.scheduledAt) {
        return { available: false, reason: 'Conflicting appointment' };
      }
    }

    return { available: true };
  }

  async getAvailability(query: any, user: any) {
    const { doctorId, date, duration = 30 } = query;

    if (!doctorId || !date) {
      throw new BadRequestException('Doctor ID and date are required');
    }

    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: {
        // workingHours: true,
        // telemedicineSettings: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();

    // const workingHours = doctor.workingHours?.find(wh => wh.dayOfWeek === dayOfWeek);
    const workingHours = null; // TODO: Implement working hours logic
    if (!workingHours) {
      return { available: false, reason: 'Doctor not available on this day' };
    }

    // Get existing appointments for the day
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

    // Generate available time slots
    const availableSlots = [];
    const slotDuration = 30; // minutes - TODO: Get from doctor settings

    const startTime = new Date(`${date}T${workingHours.startTime}`);
    const endTime = new Date(`${date}T${workingHours.endTime}`);

    let currentSlot = new Date(startTime);

    while (currentSlot < endTime) {
      const slotEnd = new Date(currentSlot.getTime() + slotDuration * 60 * 1000);

      // Check if slot conflicts with existing appointments
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

  async getTimeSlots(query: any, user: any) {
    const { doctorId, date } = query;

    const availability = await this.getAvailability({ doctorId, date }, user);

    return availability.availableSlots;
  }

  async rescheduleConsultation(id: string, rescheduleDto: any, user: any) {
    this.logger.log(`Rescheduling consultation ${id}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.status === 'COMPLETED') {
      throw new BadRequestException('Cannot reschedule completed consultation');
    }

    // Check new time availability
    const availability = await this.checkDoctorAvailability(
      consultation.doctorId,
      rescheduleDto.newDate,
      rescheduleDto.newTime,
    );

    if (!availability.available) {
      throw new BadRequestException('Doctor is not available at the new time');
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

    // Log the rescheduling
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

  async findEmergencyDoctor(tenantId: string) {
    this.logger.log(`Finding emergency doctor for tenant ${tenantId}`);

    // Find doctors available for emergency consultations
    const emergencyDoctors = await this.prisma.user.findMany({
      where: {
        tenantId,
        role: 'DOCTOR',
        // isEmergencyAvailable: true,
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        // phone: true,
        specialization: true,
      },
      // orderBy: { lastEmergencyConsultation: 'asc' }, // TODO: Implement emergency consultation ordering
    });

    if (emergencyDoctors.length === 0) {
      return null;
    }

    // Return the first available emergency doctor
    return emergencyDoctors[0];
  }

  async getDoctorSchedule(doctorId: string, date: string) {
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

  async cancelAppointment(id: string, reason: string, user: any) {
    this.logger.log(`Cancelling appointment ${id}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
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

    // Log the cancellation
    await this.auditService.logActivity({
      action: 'APPOINTMENT_CANCELLED',
      entityType: 'TELEMEDICINE_CONSULTATION',
      entityId: id,
      userId: user.id,
      details: { reason },
    });

    return updatedConsultation;
  }
}
