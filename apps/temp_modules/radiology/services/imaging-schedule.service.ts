import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ImagingScheduleService {
  constructor(private prisma: PrismaService) {}

  async scheduleStudy(studyId: string, scheduleData: any): Promise<any> {
    const { scheduledFor, modalityId, scheduledBy, notes } = scheduleData;

    const study = await this.prisma.study.findUnique({
      where: { id: studyId },
      include: {
        order: true,
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    if (study.status !== 'ORDERED' && study.status !== 'DRAFTED') {
      throw new BadRequestException('Study cannot be scheduled in current status');
    }

    // Check modality availability
    const modality = await this.prisma.modality.findUnique({
      where: { id: modalityId },
    });

    if (!modality) {
      throw new NotFoundException('Modality not found');
    }

    if (!modality.isActive) {
      throw new BadRequestException('Modality is not active');
    }

    // Check for scheduling conflicts
    const conflicts = await this.checkSchedulingConflicts(modalityId, scheduledFor, study.estimatedDuration);

    if (conflicts.length > 0) {
      throw new ConflictException('Scheduling conflict detected');
    }

    // Update study
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

    // Create schedule entry
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

  async getAvailableSlots(modalityId: string, date: Date): Promise<any[]> {
    const modality = await this.prisma.modality.findUnique({
      where: { id: modalityId },
    });

    if (!modality) {
      throw new NotFoundException('Modality not found');
    }

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Get existing scheduled studies for this modality on this date
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

    // Generate available slots (assuming 15-minute intervals)
    const availableSlots = [];
    const slotDuration = 15; // minutes
    const operatingHours = this.getOperatingHours(modality.modalityType);

    for (let hour = operatingHours.start; hour < operatingHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minute, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

        // Check if slot conflicts with existing studies
        const hasConflict = scheduledStudies.some(scheduled => {
          const studyStart = scheduled.scheduledFor;
          const studyEnd = new Date(studyStart);
          studyEnd.setMinutes(studyEnd.getMinutes() + (scheduled.study.estimatedDuration || 30));

          return (
            (slotStart >= studyStart && slotStart < studyEnd) ||
            (slotEnd > studyStart && slotEnd <= studyEnd) ||
            (slotStart <= studyStart && slotEnd >= studyEnd)
          );
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

  async rescheduleStudy(studyId: string, newScheduleData: any): Promise<any> {
    const { scheduledFor, modalityId, reason } = newScheduleData;

    const study = await this.prisma.study.findUnique({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    if (study.status === 'COMPLETED' || study.status === 'SIGNED') {
      throw new BadRequestException('Cannot reschedule completed or signed study');
    }

    // Check for conflicts
    const conflicts = await this.checkSchedulingConflicts(modalityId || study.modalityId, scheduledFor, study.estimatedDuration);

    if (conflicts.length > 0) {
      throw new ConflictException('Scheduling conflict detected');
    }

    // Update study
    const updatedStudy = await this.prisma.study.update({
      where: { id: studyId },
      data: {
        scheduledFor: new Date(scheduledFor),
        modalityId: modalityId || study.modalityId,
        status: 'SCHEDULED',
      },
    });

    // Update schedule entry
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

  async cancelSchedule(studyId: string, reason: string): Promise<any> {
    const study = await this.prisma.study.findUnique({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    if (study.status === 'COMPLETED' || study.status === 'IN_PROGRESS') {
      throw new BadRequestException('Cannot cancel completed or in-progress study');
    }

    // Update study status
    await this.prisma.study.update({
      where: { id: studyId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    // Update schedule entry
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

  async getScheduleByDate(date: Date, modalityId?: string): Promise<any[]> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const where: any = {
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

  async getScheduleStats(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
    const where: any = { tenantId };

    if (dateFrom || dateTo) {
      where.scheduledFor = {};
      if (dateFrom) where.scheduledFor.gte = dateFrom;
      if (dateTo) where.scheduledFor.lte = dateTo;
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
      byStatus: {} as Record<string, number>,
      byModality: {} as Record<string, number>,
      utilizationRate: 0,
    };

    schedules.forEach(schedule => {
      // Count by status
      stats.byStatus[schedule.status] = (stats.byStatus[schedule.status] || 0) + 1;

      // Count by modality
      stats.byModality[schedule.modality.modalityType] =
        (stats.byModality[schedule.modality.modalityType] || 0) + 1;
    });

    // Calculate utilization (simplified)
    const totalSlots = this.calculateTotalSlots(schedules);
    stats.utilizationRate = totalSlots > 0 ? (schedules.length / totalSlots) * 100 : 0;

    return stats;
  }

  private async checkSchedulingConflicts(modalityId: string, scheduledFor: Date, duration: number = 30): Promise<any[]> {
    const slotStart = new Date(scheduledFor);
    const slotEnd = new Date(scheduledFor);
    slotEnd.setMinutes(slotEnd.getMinutes() + duration);

    const conflicts = await this.prisma.imagingSchedule.findMany({
      where: {
        modalityId,
        status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
        scheduledFor: {
          lt: slotEnd,
          gte: new Date(slotStart.getTime() - duration * 60 * 1000), // Check overlapping slots
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

  private getOperatingHours(modalityType: string): { start: number; end: number } {
    // Different operating hours for different modality types
    switch (modalityType) {
      case 'CT':
        return { start: 7, end: 22 }; // 7 AM to 10 PM
      case 'MRI':
        return { start: 6, end: 23 }; // 6 AM to 11 PM
      case 'XR':
        return { start: 8, end: 20 }; // 8 AM to 8 PM
      case 'US':
        return { start: 8, end: 18 }; // 8 AM to 6 PM
      default:
        return { start: 8, end: 20 }; // Default 8 AM to 8 PM
    }
  }

  private calculateTotalSlots(schedules: any[]): number {
    // Simplified calculation - in reality this would be more complex
    const modalities = new Set(schedules.map(s => s.modalityId));
    const operatingHours = 12; // Average 12 hours per day
    const slotsPerHour = 4; // 15-minute slots

    return modalities.size * operatingHours * slotsPerHour;
  }

  async updateScheduleStatus(scheduleId: string, status: string): Promise<any> {
    const schedule = await this.prisma.imagingSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    const updatedSchedule = await this.prisma.imagingSchedule.update({
      where: { id: scheduleId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    // Update study status if needed
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
}
