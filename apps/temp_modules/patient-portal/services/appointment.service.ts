import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getAppointments(query: any, user: any) {
    this.logger.log(`Getting appointments for user: ${user.id}`);

    const {
      status,
      type,
      fromDate,
      toDate,
      doctorId,
      page = 1,
      limit = 10,
    } = query;

    const where: any = { patientId: user.id };
    if (status) where.status = status;
    if (type) where.appointmentType = type;
    if (doctorId) where.doctorId = doctorId;
    if (fromDate || toDate) {
      where.scheduledAt = {};
      if (fromDate) where.scheduledAt.gte = new Date(fromDate);
      if (toDate) where.scheduledAt.lte = new Date(toDate);
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            phone: true,
          },
        },
        chamber: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.appointment.count({ where });

    return {
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async bookAppointment(appointmentDto: any, user: any) {
    this.logger.log(`Booking appointment for user: ${user.id}`);

    const {
      doctorId,
      chamberId,
      appointmentType,
      scheduledAt,
      notes,
      familyMemberId,
    } = appointmentDto;

    // Validate doctor availability
    const isAvailable = await this.checkDoctorAvailability(
      doctorId,
      chamberId,
      scheduledAt
    );

    if (!isAvailable) {
      throw new BadRequestException('Doctor is not available at this time');
    }

    // Check for conflicting appointments
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        patientId: user.id,
        scheduledAt: {
          gte: new Date(scheduledAt.getTime() - 30 * 60 * 1000), // 30 minutes before
          lte: new Date(scheduledAt.getTime() + 30 * 60 * 1000), // 30 minutes after
        },
        status: { not: 'CANCELLED' },
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException('You have a conflicting appointment');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: user.id,
        doctorId,
        chamberId,
        appointmentType,
        scheduledAt: new Date(scheduledAt),
        notes,
        status: 'SCHEDULED',
        bookingSource: 'PATIENT_PORTAL',
        familyMemberId,
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        chamber: { select: { name: true, address: true } },
      },
    });

    // Send confirmation notification
    await this.sendAppointmentConfirmation(appointment);

    // Log appointment booking
    await this.auditService.logActivity({
      action: 'APPOINTMENT_BOOKED',
      entityType: 'APPOINTMENT',
      entityId: appointment.id,
      userId: user.id,
      details: { doctorId, scheduledAt: appointment.scheduledAt },
    });

    return appointment;
  }

  async updateAppointment(appointmentId: string, updateDto: any, user: any) {
    this.logger.log(`Updating appointment: ${appointmentId}`);

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: user.id,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === 'COMPLETED') {
      throw new BadRequestException('Cannot update completed appointment');
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...updateDto,
        updatedAt: new Date(),
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        chamber: { select: { name: true, address: true } },
      },
    });

    // Log appointment update
    await this.auditService.logActivity({
      action: 'APPOINTMENT_UPDATED',
      entityType: 'APPOINTMENT',
      entityId: appointmentId,
      userId: user.id,
      details: updateDto,
    });

    return updatedAppointment;
  }

  async cancelAppointment(appointmentId: string, user: any) {
    this.logger.log(`Cancelling appointment: ${appointmentId}`);

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: user.id,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel completed appointment');
    }

    // Check if cancellation is allowed (at least 2 hours before)
    const now = new Date();
    const appointmentTime = new Date(appointment.scheduledAt);
    const hoursDiff = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 2) {
      throw new BadRequestException('Appointments must be cancelled at least 2 hours in advance');
    }

    const cancelledAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy: user.id,
        cancellationReason: 'PATIENT_CANCELLED',
      },
    });

    // Send cancellation notification
    await this.sendAppointmentCancellation(cancelledAppointment);

    // Log appointment cancellation
    await this.auditService.logActivity({
      action: 'APPOINTMENT_CANCELLED',
      entityType: 'APPOINTMENT',
      entityId: appointmentId,
      userId: user.id,
    });

    return cancelledAppointment;
  }

  async getAppointmentDetails(appointmentId: string, user: any) {
    this.logger.log(`Getting appointment details: ${appointmentId}`);

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: user.id,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            phone: true,
            email: true,
          },
        },
        chamber: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            phone: true,
          },
        },
        bills: {
          select: {
            id: true,
            amount: true,
            status: true,
            dueDate: true,
          },
        },
        reports: {
          select: {
            id: true,
            reportType: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async getUpcomingAppointments(user: any) {
    this.logger.log(`Getting upcoming appointments for user: ${user.id}`);

    const now = new Date();

    const appointments = await this.prisma.appointment.findMany({
      where: {
        patientId: user.id,
        scheduledAt: { gt: now },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        chamber: { select: { name: true, address: true } },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 5,
    });

    return appointments;
  }

  async rescheduleAppointment(appointmentId: string, rescheduleDto: any, user: any) {
    this.logger.log(`Rescheduling appointment: ${appointmentId}`);

    const { newScheduledAt, reason } = rescheduleDto;

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: user.id,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== 'SCHEDULED') {
      throw new BadRequestException('Can only reschedule scheduled appointments');
    }

    // Check doctor availability for new time
    const isAvailable = await this.checkDoctorAvailability(
      appointment.doctorId,
      appointment.chamberId,
      newScheduledAt
    );

    if (!isAvailable) {
      throw new BadRequestException('Doctor is not available at the new time');
    }

    const rescheduledAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        scheduledAt: new Date(newScheduledAt),
        rescheduledAt: new Date(),
        rescheduledBy: user.id,
        rescheduleReason: reason,
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        chamber: { select: { name: true, address: true } },
      },
    });

    // Log appointment reschedule
    await this.auditService.logActivity({
      action: 'APPOINTMENT_RESCHEDULED',
      entityType: 'APPOINTMENT',
      entityId: appointmentId,
      userId: user.id,
      details: { newScheduledAt, reason },
    });

    return rescheduledAppointment;
  }

  async getAppointmentHistory(user: any) {
    this.logger.log(`Getting appointment history for user: ${user.id}`);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        patientId: user.id,
        status: { in: ['COMPLETED', 'CANCELLED', 'NO_SHOW'] },
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        chamber: { select: { name: true, address: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    return appointments;
  }

  async rateAppointment(appointmentId: string, ratingDto: any, user: any) {
    this.logger.log(`Rating appointment: ${appointmentId}`);

    const { rating, feedback } = ratingDto;

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: user.id,
        status: 'COMPLETED',
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found or not completed');
    }

    // Update appointment with rating
    const ratedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        rating,
        feedback,
        ratedAt: new Date(),
      },
    });

    // Update doctor's average rating
    await this.updateDoctorRating(appointment.doctorId);

    // Log appointment rating
    await this.auditService.logActivity({
      action: 'APPOINTMENT_RATED',
      entityType: 'APPOINTMENT',
      entityId: appointmentId,
      userId: user.id,
      details: { rating, feedback },
    });

    return ratedAppointment;
  }

  private async checkDoctorAvailability(doctorId: string, chamberId: string, scheduledAt: Date) {
    // Check doctor's schedule
    const doctorSchedule = await this.prisma.doctorSchedule.findFirst({
      where: {
        doctorId,
        dayOfWeek: scheduledAt.getDay(),
        isAvailable: true,
      },
    });

    if (!doctorSchedule) {
      return false;
    }

    // Check if time slot is within working hours
    const appointmentTime = scheduledAt.getHours() * 60 + scheduledAt.getMinutes();
    const startTime = doctorSchedule.startTime.getHours() * 60 + doctorSchedule.startTime.getMinutes();
    const endTime = doctorSchedule.endTime.getHours() * 60 + doctorSchedule.endTime.getMinutes();

    if (appointmentTime < startTime || appointmentTime >= endTime) {
      return false;
    }

    // Check for conflicting appointments
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        chamberId,
        scheduledAt: {
          gte: new Date(scheduledAt.getTime() - 30 * 60 * 1000),
          lte: new Date(scheduledAt.getTime() + 30 * 60 * 1000),
        },
        status: { not: 'CANCELLED' },
      },
    });

    return !conflictingAppointment;
  }

  private async sendAppointmentConfirmation(appointment: any) {
    // In production, integrate with notification service
    console.log(`Appointment confirmation sent for appointment ${appointment.id}`);
  }

  private async sendAppointmentCancellation(appointment: any) {
    // In production, integrate with notification service
    console.log(`Appointment cancellation notification sent for appointment ${appointment.id}`);
  }

  private async updateDoctorRating(doctorId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        rating: { not: null },
      },
      select: { rating: true },
    });

    const averageRating = appointments.reduce((sum, apt) => sum + apt.rating, 0) / appointments.length;

    await this.prisma.user.update({
      where: { id: doctorId },
      data: { averageRating },
    });
  }

  async getAppointmentStats(user: any) {
    const totalAppointments = await this.prisma.appointment.count({
      where: { patientId: user.id },
    });

    const completedAppointments = await this.prisma.appointment.count({
      where: {
        patientId: user.id,
        status: 'COMPLETED',
      },
    });

    const cancelledAppointments = await this.prisma.appointment.count({
      where: {
        patientId: user.id,
        status: 'CANCELLED',
      },
    });

    const upcomingAppointments = await this.prisma.appointment.count({
      where: {
        patientId: user.id,
        scheduledAt: { gt: new Date() },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
    });

    return {
      userId: user.id,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      upcomingAppointments,
      completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
    };
  }
}
