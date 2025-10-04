import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BookingChannel, BookingStatus, TokenState } from './appointments.dto';
import {
  CreateScheduleDto, UpdateScheduleDto, CreateBookingDto, UpdateBookingDto,
  CreateTokenDto, UpdateTokenDto, CreateCounterDto, UpdateCounterDto,
  CreateReminderDto, UpdateReminderDto, CheckInDto, KioskCheckInDto,
  SearchSlotsDto, BulkRescheduleDto, BookAppointmentDto, RescheduleBookingDto
} from './appointments.dto';

@Injectable()
export class AppointmentsService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(AppointmentsService.name);

  constructor() {}

  // ==================== SCHEDULE MANAGEMENT ====================

  async createSchedule(tenantId: string, data: CreateScheduleDto) {
    return this.prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.create({
        data: {
          ...data,
          tenantId,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
        },
        include: {
          provider: { select: { firstName: true, lastName: true } },
        },
      });

      // Auto-generate slots based on schedule
      await this.generateSlots(tx, schedule.id, tenantId);

      return schedule;
    });
  }

  async getSchedules(tenantId: string, providerId?: string, dayOfWeek?: number, isActive?: boolean) {
    const where: any = { tenantId };
    if (providerId) where.providerId = providerId;
    if (dayOfWeek !== undefined) where.dayOfWeek = dayOfWeek;
    if (isActive !== undefined) where.isActive = isActive;

    return this.prisma.schedule.findMany({
      where,
      include: {
        provider: { select: { firstName: true, lastName: true } },
        slots: {
          where: { isAvailable: true },
          include: { bookings: { select: { id: true, status: true } } }
        },
      },
    });
  }

  async getScheduleById(tenantId: string, id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id, tenantId },
      include: {
        provider: { select: { firstName: true, lastName: true } },
        slots: {
          include: { bookings: { select: { id: true, status: true, patient: { select: { firstName: true, lastName: true } } } } }
        },
      },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async updateSchedule(tenantId: string, id: string, data: UpdateScheduleDto) {
    return this.prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.update({
        where: { id, tenantId },
        data: {
          ...data,
          startTime: data.startTime ? new Date(data.startTime) : undefined,
          endTime: data.endTime ? new Date(data.endTime) : undefined,
        },
      });

      // Regenerate slots if schedule changed
      if (data.startTime || data.endTime || data.slotLength) {
        await this.regenerateSlots(tx, id, tenantId);
      }

      return schedule;
    });
  }

  async deleteSchedule(tenantId: string, id: string) {
    return this.prisma.schedule.delete({
      where: { id, tenantId },
    });
  }

  // ==================== SLOT MANAGEMENT ====================

  private async generateSlots(tx: any, scheduleId: string, tenantId: string) {
    const schedule = await tx.schedule.findUnique({
      where: { id: scheduleId, tenantId },
    });

    if (!schedule) return;

    const slotLength = schedule.slotLength;
    const startTime = schedule.startTime;
    const endTime = schedule.endTime;

    const slots = [];
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + slotLength * 60000);
      if (slotEndTime <= endTime) {
        slots.push({
          scheduleId,
          startTime: currentTime,
          endTime: slotEndTime,
          tenantId,
        });
      }
      currentTime = slotEndTime;
    }

    await tx.slot.createMany({ data: slots });
  }

  private async regenerateSlots(tx: any, scheduleId: string, tenantId: string) {
    // Delete existing slots
    await tx.slot.deleteMany({ where: { scheduleId, tenantId } });

    // Generate new slots
    await this.generateSlots(tx, scheduleId, tenantId);
  }

  async getAvailableSlots(tenantId: string, data: SearchSlotsDto) {
    const date = new Date(data.date);
    const dayOfWeek = date.getDay();

    const schedules = await this.prisma.schedule.findMany({
      where: {
        tenantId,
        providerId: data.providerId,
        dayOfWeek,
        isActive: true,
      },
      include: {
        slots: {
          where: {
            startTime: {
              gte: new Date(date.setHours(0, 0, 0, 0)),
              lt: new Date(date.setHours(23, 59, 59, 999))
            },
            isAvailable: true,
          },
          include: { bookings: { select: { status: true } } }
        },
      },
    });

    const availableSlots = [];
    for (const schedule of schedules) {
      for (const slot of schedule.slots) {
        const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
        const maxCapacity = Math.floor(slot.maxCapacity * (1 + overbookingConfig / 100));
        const bookedCount = slot.bookings.filter((b: any) => b.status === BookingStatus.SCHEDULED || b.status === BookingStatus.CONFIRMED).length;

        if (bookedCount < maxCapacity) {
          availableSlots.push({
            ...slot,
            schedule,
            availableCapacity: maxCapacity - bookedCount,
          });
        }
      }
    }

    return availableSlots;
  }

  // ==================== BOOKING MANAGEMENT ====================

  async createBooking(tenantId: string, data: CreateBookingDto) {
    return this.prisma.$transaction(async (tx) => {
      // Check if slot is available
      if (data.slotId) {
        const slot = await tx.slot.findUnique({
          where: { id: data.slotId, tenantId },
          include: { bookings: { select: { status: true } } }
        });

        if (!slot) throw new NotFoundException('Slot not found');

        const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
        const maxCapacity = Math.floor(slot.maxCapacity * (1 + overbookingConfig / 100));
        const bookedCount = slot.bookings.filter((b: any) => b.status === BookingStatus.SCHEDULED || b.status === BookingStatus.CONFIRMED).length;

        if (bookedCount >= maxCapacity) {
          throw new BadRequestException('Slot is fully booked');
        }
      }

      const bookingNumber = await this.generateBookingNumber(tx, tenantId);

      const booking = await tx.booking.create({
        data: {
          ...data,
          tenantId,
          bookingNumber,
          startTime: new Date(data.startTime),
          endTime: data.endTime ? new Date(data.endTime) : null,
          channel: data.channel || BookingChannel.WEB,
        },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          schedule: { include: { provider: { select: { firstName: true, lastName: true } } } },
          slot: true,
        },
      });

      // Create initial token
      await tx.token.create({
        data: {
          bookingId: booking.id,
          tokenNumber: await this.getNextTokenNumber(tx, tenantId),
          tenantId,
        },
      });

      // Schedule reminders
      await this.scheduleReminders(tx, booking.id, tenantId);

      return booking;
    });
  }

  async bookAppointment(tenantId: string, data: BookAppointmentDto) {
    return this.prisma.$transaction(async (tx) => {
      const date = new Date(data.appointmentDate);
      const dayOfWeek = date.getDay();

      // Find available schedule
      const schedule = await tx.schedule.findFirst({
        where: {
          tenantId,
          providerId: data.providerId,
          dayOfWeek,
          isActive: true,
        },
      });

      if (!schedule) throw new NotFoundException('No schedule available for this provider on this date');

      // Find available slot
      const slots = await tx.slot.findMany({
        where: {
          scheduleId: schedule.id,
          startTime: {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lt: new Date(date.setHours(23, 59, 59, 999))
          },
          isAvailable: true,
        },
        include: { bookings: { select: { status: true } } }
      });

      let availableSlot = null;
      for (const slot of slots) {
        const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
        const maxCapacity = Math.floor(slot.maxCapacity * (1 + overbookingConfig / 100));
        const bookedCount = slot.bookings.filter((b: any) => b.status === BookingStatus.SCHEDULED || b.status === BookingStatus.CONFIRMED).length;

        if (bookedCount < maxCapacity) {
          availableSlot = slot;
          break;
        }
      }

      if (!availableSlot) throw new BadRequestException('No slots available for this date');

      const bookingNumber = await this.generateBookingNumber(tx, tenantId);

      const booking = await tx.booking.create({
        data: {
          patientId: data.patientId,
          scheduleId: schedule.id,
          slotId: availableSlot.id,
          channel: data.channel || BookingChannel.WEB,
          startTime: availableSlot.startTime,
          endTime: availableSlot.endTime,
          notes: data.notes,
          tenantId,
          bookingNumber,
        },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          schedule: { include: { provider: { select: { firstName: true, lastName: true } } } },
          slot: true,
        },
      });

      // Create token
      await tx.token.create({
        data: {
          bookingId: booking.id,
          tokenNumber: await this.getNextTokenNumber(tx, tenantId),
          tenantId,
        },
      });

      // Schedule reminders
      await this.scheduleReminders(tx, booking.id, tenantId);

      return booking;
    });
  }

  async getBookings(tenantId: string, patientId?: string, providerId?: string, status?: BookingStatus, fromDate?: string, toDate?: string, channel?: BookingChannel) {
    const where: any = { tenantId };

    if (patientId) where.patientId = patientId;
    if (providerId) where.schedule = { providerId };
    if (status) where.status = status;
    if (channel) where.channel = channel;

    if (fromDate || toDate) {
      where.startTime = {};
      if (fromDate) where.startTime.gte = new Date(fromDate);
      if (toDate) where.startTime.lte = new Date(toDate);
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        patient: { select: { firstName: true, lastName: true, medicalRecordNumber: true } },
        schedule: { include: { provider: { select: { firstName: true, lastName: true } } } },
        slot: true,
        tokens: { include: { counter: true } },
        reminders: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async getBookingById(tenantId: string, id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id, tenantId },
      include: {
        patient: { select: { firstName: true, lastName: true, medicalRecordNumber: true } },
        schedule: { include: { provider: { select: { firstName: true, lastName: true } } } },
        slot: true,
        tokens: { include: { counter: true } },
        reminders: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async updateBooking(tenantId: string, id: string, data: UpdateBookingDto) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id, tenantId },
        data: {
          ...data,
          checkInTime: data.checkInTime ? new Date(data.checkInTime) : undefined,
          endTime: data.endTime ? new Date(data.endTime) : undefined,
        },
        include: {
          tokens: true,
        },
      });

      // Update token state if booking status changed
      if (data.status && data.status === BookingStatus.CHECKED_IN) {
        await tx.token.updateMany({
          where: { bookingId: id },
          data: { state: TokenState.CALLED },
        });
      }

      return booking;
    });
  }

  async rescheduleBooking(tenantId: string, data: RescheduleBookingDto) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: data.bookingId, tenantId },
        include: { slot: true },
      });

      if (!booking) throw new NotFoundException('Booking not found');

      // Cancel old slot booking
      if (booking.slotId) {
        await tx.slot.update({
          where: { id: booking.slotId },
          data: { bookedCount: { decrement: 1 } },
        });
      }

      // Find new slot
      const newDate = new Date(data.newStartTime);
      const newSlot = await tx.slot.findFirst({
        where: {
          scheduleId: booking.scheduleId,
          startTime: newDate,
          isAvailable: true,
        },
        include: { bookings: { select: { status: true } } }
      });

      if (!newSlot) throw new BadRequestException('No available slot for new time');

      // Check capacity
      const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
      const maxCapacity = Math.floor(newSlot.maxCapacity * (1 + overbookingConfig / 100));
      const bookedCount = newSlot.bookings.filter(b => b.status === BookingStatus.SCHEDULED || b.status === BookingStatus.CONFIRMED).length;

      if (bookedCount >= maxCapacity) {
        throw new BadRequestException('New slot is fully booked');
      }

      // Update booking
      const updatedBooking = await tx.booking.update({
        where: { id: data.bookingId },
        data: {
          startTime: newDate,
          endTime: new Date(newDate.getTime() + (booking.endTime ? booking.endTime.getTime() - booking.startTime.getTime() : 30 * 60000)),
          slotId: newSlot.id,
          status: BookingStatus.RESCHEDULED,
          notes: booking.notes ? `${booking.notes}\nRescheduled: ${data.reason}` : `Rescheduled: ${data.reason}`,
        },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          schedule: { include: { provider: { select: { firstName: true, lastName: true } } } },
          slot: true,
        },
      });

      // Update slot counts
      await tx.slot.update({
        where: { id: newSlot.id },
        data: { bookedCount: { increment: 1 } },
      });

      // Update token
      await tx.token.updateMany({
        where: { bookingId: data.bookingId },
        data: { state: TokenState.ISSUED },
      });

      // Reschedule reminders
      await tx.reminder.deleteMany({ where: { bookingId: data.bookingId } });
      await this.scheduleReminders(tx, data.bookingId, tenantId);

      return updatedBooking;
    });
  }

  async processNoShows(tenantId: string) {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const noShowThreshold = await this.getConfigValue(tenantId, 'no_show_threshold_minutes', 30);

      // Find appointments that should be marked as no-show
      const overdueBookings = await tx.booking.findMany({
        where: {
          tenantId,
          status: { in: [BookingStatus.SCHEDULED, BookingStatus.CONFIRMED] },
          startTime: {
            lt: new Date(now.getTime() - noShowThreshold * 60 * 1000)
          }
        },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          schedule: { include: { provider: { select: { firstName: true, lastName: true } } } },
          slot: true
        }
      });

      const noShowBookings = [];
      for (const booking of overdueBookings) {
        // Update booking status to no-show
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: BookingStatus.NO_SHOW }
        });

        // Free up the slot
        if (booking.slotId) {
          await tx.slot.update({
            where: { id: booking.slotId },
            data: { bookedCount: { decrement: 1 } }
          });
        }

        // Update token state
        await tx.token.updateMany({
          where: { bookingId: booking.id },
          data: { state: TokenState.EXPIRED }
        });

        // Cancel reminders
        await tx.reminder.updateMany({
          where: { bookingId: booking.id },
          data: { status: 'CANCELLED' }
        });

        // Log the no-show
        await tx.appointmentConfig.upsert({
          where: {
            key: `no_show_${booking.id}`,
            tenantId
          },
          update: {
            value: {
              bookingId: booking.id,
              patientName: `${booking.patient.firstName} ${booking.patient.lastName}`,
              providerName: `${booking.schedule.provider.firstName} ${booking.schedule.provider.lastName}`,
              scheduledTime: booking.startTime,
              markedAt: now
            }
          },
          create: {
            key: `no_show_${booking.id}`,
            value: {
              bookingId: booking.id,
              patientName: `${booking.patient.firstName} ${booking.patient.lastName}`,
              providerName: `${booking.schedule.provider.firstName} ${booking.schedule.provider.lastName}`,
              scheduledTime: booking.startTime,
              markedAt: now
            },
            tenantId
          }
        });

        noShowBookings.push(booking);
      }

      return {
        message: `${noShowBookings.length} appointments marked as no-show`,
        noShowBookings
      };
    });
  }

  async generateQrCode(tenantId: string, data: any) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId, tenantId },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        schedule: { include: { provider: { select: { firstName: true, lastName: true } } } }
      }
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const qrData = {
      type: 'appointment_checkin',
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      patientId: booking.patientId,
      patientName: `${booking.patient.firstName} ${booking.patient.lastName}`,
      providerName: `${booking.schedule.provider.firstName} ${booking.schedule.provider.lastName}`,
      appointmentTime: booking.startTime,
      tenantId
    };

    const qrString = JSON.stringify(qrData);

    if (data.format === 'base64') {
      // Return base64 encoded QR code
      const qrCode = await this.generateQRCodeBase64(qrString, data.size || 256);
      return {
        qrCode,
        qrData,
        format: 'base64'
      };
    }

    return {
      qrData,
      qrString
    };
  }

  async scanQrCode(tenantId: string, data: any) {
    let qrData;

    try {
      // Try to parse as JSON first
      qrData = JSON.parse(data.qrCode);
    } catch {
      // If not JSON, try to decode from base64
      try {
        const decoded = Buffer.from(data.qrCode, 'base64').toString('utf-8');
        qrData = JSON.parse(decoded);
      } catch {
        throw new BadRequestException('Invalid QR code format');
      }
    }

    if (!qrData.type || qrData.type !== 'appointment_checkin') {
      throw new BadRequestException('Invalid QR code type');
    }

    if (qrData.tenantId !== tenantId) {
      throw new BadRequestException('QR code not valid for this tenant');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: qrData.bookingId, tenantId },
      include: { tokens: true }
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status === BookingStatus.CHECKED_IN) {
      throw new BadRequestException('Appointment already checked in');
    }

    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.NO_SHOW) {
      throw new BadRequestException('Appointment is not active');
    }

    // Perform kiosk check-in
    return this.kioskCheckIn(tenantId, {
      patientId: qrData.patientId,
      qrCode: data.qrCode,
      kioskId: data.kioskId
    });
  }

  async createWalkInAppointment(tenantId: string, data: any) {
    return this.prisma.$transaction(async (tx) => {
      // Find available counter for walk-in
      const availableCounter = await tx.counter.findFirst({
        where: { tenantId, isActive: true }
      });

      if (!availableCounter) {
        throw new BadRequestException('No available counters for walk-in appointments');
      }

      // Create patient if not exists (simplified - would need full patient creation logic)
      let patient = await tx.patient.findUnique({
        where: { id: data.patientId, tenantId }
      });

      if (!patient) {
        throw new NotFoundException('Patient not found. Please register patient first.');
      }

      // Find available slot for walk-in (look for slots within next hour)
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

      const availableSlot = await tx.slot.findFirst({
        where: {
          tenantId,
          startTime: {
            gte: now,
            lte: nextHour
          },
          isAvailable: true,
        },
        include: {
          schedule: {
            include: {
              provider: { select: { firstName: true, lastName: true } }
            }
          },
          bookings: { select: { status: true } }
        },
        orderBy: { startTime: 'asc' }
      });

      if (!availableSlot) {
        throw new BadRequestException('No available slots for walk-in appointments in the next hour');
      }

      // Check capacity
      const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
      const maxCapacity = Math.floor(availableSlot.maxCapacity * (1 + overbookingConfig / 100));
      const bookedCount = availableSlot.bookings.filter(b =>
        b.status === BookingStatus.SCHEDULED || b.status === BookingStatus.CONFIRMED
      ).length;

      if (bookedCount >= maxCapacity) {
        throw new BadRequestException('No available capacity for walk-in appointments');
      }

      // Create booking
      const bookingNumber = await this.generateBookingNumber(tx, tenantId);

      const booking = await tx.booking.create({
        data: {
          patientId: data.patientId,
          scheduleId: availableSlot.scheduleId,
          slotId: availableSlot.id,
          channel: BookingChannel.WALK_IN,
          startTime: availableSlot.startTime,
          endTime: availableSlot.endTime,
          notes: data.notes || 'Walk-in appointment',
          tenantId,
          bookingNumber,
        },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          schedule: { include: { provider: { select: { firstName: true, lastName: true } } } },
          slot: true,
        },
      });

      // Update slot count
      await tx.slot.update({
        where: { id: availableSlot.id },
        data: { bookedCount: { increment: 1 } }
      });

      // Create token immediately for walk-in
      const token = await tx.token.create({
        data: {
          bookingId: booking.id,
          tokenNumber: await this.getNextTokenNumber(tx, tenantId),
          counterId: availableCounter.id,
          tenantId,
        },
        include: {
          counter: true
        }
      });

      // Update booking status to checked in
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CHECKED_IN,
          checkInTime: new Date()
        }
      });

      // Update token state
      await tx.token.update({
        where: { id: token.id },
        data: { state: TokenState.CALLED }
      });

      return {
        booking,
        token,
        counter: availableCounter,
        estimatedWaitTime: await this.calculateWaitTime(tx, availableCounter.id, tenantId)
      };
    });
  }

  async setPriorityRules(tenantId: string, rules: any) {
    return this.prisma.appointmentConfig.upsert({
      where: {
        key: 'priority_rules',
        tenantId
      },
      update: {
        value: rules,
        description: 'Priority rules for appointment booking'
      },
      create: {
        key: 'priority_rules',
        value: rules,
        description: 'Priority rules for appointment booking',
        tenantId
      }
    });
  }

  async getPriorityRules(tenantId: string) {
    const config = await this.prisma.appointmentConfig.findFirst({
      where: {
        key: 'priority_rules',
        tenantId,
        isActive: true
      }
    });

    return config?.value || this.getDefaultPriorityRules();
  }

  private getDefaultPriorityRules() {
    return {
      emergency: {
        priority: 1,
        timeWindow: 30, // minutes before appointment
        maxSlots: 2 // max emergency slots per hour
      },
      vip: {
        priority: 2,
        bookingWindow: 7, // days
        preferredProviders: []
      },
      regular: {
        priority: 3,
        bookingWindow: 30, // days
        waitTimeMultiplier: 1
      },
      walkIn: {
        priority: 4,
        maxWaitTime: 60, // minutes
        preferredTimes: ['09:00', '14:00'] // preferred times for walk-ins
      }
    };
  }

  async applyPriorityRules(tenantId: string, bookingData: any) {
    const rules = await this.getPriorityRules(tenantId);
    const patient = await this.prisma.patient.findUnique({
      where: { id: bookingData.patientId, tenantId }
    });

    if (!patient) throw new NotFoundException('Patient not found');

    let priority = 3; // default priority
    let adjustedData = { ...bookingData };

    // Check for emergency priority
    if (bookingData.isEmergency) {
      priority = 1;
      // Find nearest emergency slot
      const emergencySlot = await this.findEmergencySlot(tenantId, bookingData.providerId, rules.emergency.timeWindow);
      if (emergencySlot) {
        adjustedData.slotId = emergencySlot.id;
        adjustedData.startTime = emergencySlot.startTime;
        adjustedData.endTime = emergencySlot.endTime;
      }
    }

    // Check for VIP priority
    else if (patient.isVIP) {
      priority = 2;
      // Ensure booking is within VIP window
      const bookingDate = new Date(bookingData.startTime);
      const daysDiff = Math.ceil((bookingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > rules.vip.bookingWindow) {
        throw new BadRequestException(`VIP bookings must be made within ${rules.vip.bookingWindow} days`);
      }
    }

    // Check for walk-in priority
    else if (bookingData.channel === BookingChannel.WALK_IN) {
      priority = 4;
      // Adjust to preferred times if possible
      const preferredTime = await this.findPreferredWalkInSlot(tenantId, bookingData.providerId, rules.walkIn.preferredTimes);
      if (preferredTime) {
        adjustedData.startTime = preferredTime.startTime;
        adjustedData.endTime = preferredTime.endTime;
        adjustedData.slotId = preferredTime.id;
      }
    }

    return {
      priority,
      adjustedData,
      rules
    };
  }

  private async findEmergencySlot(tenantId: string, providerId: string, timeWindow: number) {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + timeWindow * 60 * 1000);

    const slot = await this.prisma.slot.findFirst({
      where: {
        tenantId,
        schedule: { providerId },
        startTime: {
          gte: now,
          lte: windowEnd
        },
        isAvailable: true,
      },
      include: {
        schedule: true,
        bookings: { select: { status: true } }
      },
      orderBy: { startTime: 'asc' }
    });

    if (!slot) return null;

    // Check if emergency slot is available
    const emergencyConfig = await this.getConfigValue(tenantId, 'emergency_slots_per_hour', 2);
    const hourStart = new Date(slot.startTime);
    hourStart.setMinutes(0, 0, 0);

    const emergencyBookings = await this.prisma.booking.count({
      where: {
        tenantId,
        slot: {
          schedule: { providerId },
          startTime: {
            gte: hourStart,
            lt: new Date(hourStart.getTime() + 60 * 60 * 1000)
          }
        },
        channel: BookingChannel.WALK_IN,
        isEmergency: true
      }
    });

    if (emergencyBookings < emergencyConfig) {
      return slot;
    }

    return null;
  }

  private async findPreferredWalkInSlot(tenantId: string, providerId: string, preferredTimes: string[]) {
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

    for (const timeStr of preferredTimes) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const preferredTime = new Date(now);
      preferredTime.setHours(hours, minutes, 0, 0);

      if (preferredTime >= now && preferredTime <= nextHour) {
        const slot = await this.prisma.slot.findFirst({
          where: {
            tenantId,
            schedule: { providerId },
            startTime: preferredTime,
            isAvailable: true,
          },
          include: { bookings: { select: { status: true } } }
        });

        if (slot) {
          const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
          const maxCapacity = Math.floor(slot.maxCapacity * (1 + overbookingConfig / 100));
          const bookedCount = slot.bookings.filter(b =>
            b.status === BookingStatus.SCHEDULED || b.status === BookingStatus.CONFIRMED
          ).length;

          if (bookedCount < maxCapacity) {
            return slot;
          }
        }
      }
    }

    return null;
  }

  async cancelBooking(tenantId: string, id: string, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id, tenantId },
        include: { slot: true, tokens: true },
      });

      if (!booking) throw new NotFoundException('Booking not found');

      // Update booking status
      await tx.booking.update({
        where: { id },
        data: {
          status: BookingStatus.CANCELLED,
          notes: booking.notes ? `${booking.notes}\nCancelled: ${reason}` : `Cancelled: ${reason}`,
        },
      });

      // Update slot count
      if (booking.slotId) {
        await tx.slot.update({
          where: { id: booking.slotId },
          data: { bookedCount: { decrement: 1 } },
        });
      }

      // Update token state
      await tx.token.updateMany({
        where: { bookingId: id },
        data: { state: TokenState.EXPIRED },
      });

      // Cancel reminders
      await tx.reminder.updateMany({
        where: { bookingId: id },
        data: { status: 'CANCELLED' },
      });

      return { message: 'Booking cancelled successfully' };
    });
  }

  async getNoShowHistory(tenantId: string, fromDate?: Date, toDate?: Date) {
    const where: any = { tenantId, key: { startsWith: 'no_show_' } };

    const configs = await this.prisma.appointmentConfig.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const noShows = configs.map(config => config.value as any);

    return {
      totalNoShows: noShows.length,
      noShows: noShows.filter(noShow => {
        if (!fromDate && !toDate) return true;
        const scheduledTime = new Date(noShow.scheduledTime);
        if (fromDate && scheduledTime < fromDate) return false;
        if (toDate && scheduledTime > toDate) return false;
        return true;
      })
    };
  }

  async processPayment(tenantId: string, bookingId: string, paymentData: any) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId, tenantId },
        include: { patient: true, schedule: { include: { provider: true } } }
      });

      if (!booking) throw new NotFoundException('Booking not found');

      if (booking.isPrePaid) {
        throw new BadRequestException('Payment already processed for this booking');
      }

      // Calculate amount (this would typically come from a pricing service)
      const consultationFee = await this.getConfigValue(tenantId, 'consultation_fee', 500);
      const processingFee = Math.round(consultationFee * 0.02); // 2% processing fee

      const payment = await tx.payment.create({
        data: {
          billingId: bookingId, // Using booking ID as billing ID for simplicity
          amount: consultationFee + processingFee,
          paymentMethod: paymentData.method,
          transactionId: paymentData.transactionId,
          notes: paymentData.notes,
          receivedBy: 'system', // Or actual user ID
          tenantId,
        }
      });

      // Update booking to mark as pre-paid
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          isPrePaid: true,
          paymentId: payment.id
        }
      });

      return {
        payment,
        booking: {
          ...booking,
          isPrePaid: true
        }
      };
    });
  }

  async createToken(tenantId: string, data: CreateTokenDto) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: data.bookingId, tenantId },
      });

      if (!booking) throw new NotFoundException('Booking not found');

      const tokenNumber = data.tokenNumber || await this.getNextTokenNumber(tx, tenantId);

      const token = await tx.token.create({
        data: {
          ...data,
          tokenNumber,
          tenantId,
        },
        include: { booking: { include: { patient: { select: { firstName: true, lastName: true } } } }, counter: true },
      });

      return token;
    });
  }

  async getTokens(tenantId: string, bookingId?: string, counterId?: string, state?: TokenState, tokenNumber?: number) {
    const where: any = { tenantId };

    if (bookingId) where.bookingId = bookingId;
    if (counterId) where.counterId = counterId;
    if (state) where.state = state;
    if (tokenNumber) where.tokenNumber = tokenNumber;

    return this.prisma.token.findMany({
      where,
      include: {
        booking: { include: { patient: { select: { firstName: true, lastName: true } }, schedule: { include: { provider: { select: { firstName: true, lastName: true } } } } } },
        counter: true,
      },
      orderBy: { issuedAt: 'asc' },
    });
  }

  async updateToken(tenantId: string, id: string, data: UpdateTokenDto) {
    return this.prisma.token.update({
      where: { id, tenantId },
      data: {
        ...data,
        calledAt: data.calledAt ? new Date(data.calledAt) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      },
      include: {
        booking: { include: { patient: { select: { firstName: true, lastName: true } } } },
        counter: true,
      },
    });
  }

  async callNextToken(tenantId: string, counterId: string) {
    return this.prisma.$transaction(async (tx) => {
      const counter = await tx.counter.findUnique({
        where: { id: counterId, tenantId },
      });

      if (!counter) throw new NotFoundException('Counter not found');

      const nextToken = await tx.token.findFirst({
        where: {
          tenantId,
          counterId: null,
          state: TokenState.ISSUED,
        },
        include: { booking: { include: { patient: { select: { firstName: true, lastName: true } } } } },
        orderBy: { tokenNumber: 'asc' },
      });

      if (!nextToken) throw new NotFoundException('No tokens available');

      const updatedToken = await tx.token.update({
        where: { id: nextToken.id },
        data: {
          counterId,
          state: TokenState.CALLED,
          calledAt: new Date(),
        },
        include: {
          booking: { include: { patient: { select: { firstName: true, lastName: true } } } },
          counter: true,
        },
      });

      // Update booking status
      await tx.booking.update({
        where: { id: nextToken.bookingId },
        data: { status: BookingStatus.IN_PROGRESS },
      });

      return updatedToken;
    });
  }

  // ==================== COUNTER MANAGEMENT ====================

  async createCounter(tenantId: string, data: CreateCounterDto) {
    return this.prisma.counter.create({
      data: { ...data, tenantId },
    });
  }

  async getCounters(tenantId: string, isActive?: boolean) {
    const where: any = { tenantId };
    if (isActive !== undefined) where.isActive = isActive;

    return this.prisma.counter.findMany({
      where,
      include: { tokens: { where: { state: TokenState.CALLED } } },
    });
  }

  async updateCounter(tenantId: string, id: string, data: UpdateCounterDto) {
    return this.prisma.counter.update({
      where: { id, tenantId },
      data,
    });
  }

  // ==================== REMINDER MANAGEMENT ====================

  async createReminder(tenantId: string, data: CreateReminderDto) {
    return this.prisma.reminder.create({
      data: {
        ...data,
        scheduledAt: new Date(data.scheduledAt),
        tenantId,
      },
      include: { booking: { include: { patient: { select: { firstName: true, lastName: true } } } } },
    });
  }

  async getReminders(tenantId: string, bookingId?: string, status?: string) {
    const where: any = { tenantId };

    if (bookingId) where.bookingId = bookingId;
    if (status) where.status = status;

    return this.prisma.reminder.findMany({
      where,
      include: { booking: { include: { patient: { select: { firstName: true, lastName: true } } } } },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async updateReminder(tenantId: string, id: string, data: UpdateReminderDto) {
    return this.prisma.reminder.update({
      where: { id, tenantId },
      data: {
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        sentAt: data.sentAt ? new Date(data.sentAt) : undefined,
      },
    });
  }

  // ==================== WORKFLOWS ====================

  async checkIn(tenantId: string, data: CheckInDto) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: data.bookingId, tenantId },
        include: { tokens: true },
      });

      if (!booking) throw new NotFoundException('Booking not found');

      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: data.bookingId },
        data: {
          status: BookingStatus.CHECKED_IN,
          checkInTime: new Date(),
        },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          tokens: { include: { counter: true } },
        },
      });

      // Update token state
      await tx.token.updateMany({
        where: { bookingId: data.bookingId },
        data: { state: TokenState.CALLED },
      });

      return updatedBooking;
    });
  }

  async kioskCheckIn(tenantId: string, data: KioskCheckInDto) {
    return this.prisma.$transaction(async (tx) => {
      let booking;

      if (data.bookingNumber) {
        booking = await tx.booking.findUnique({
          where: { bookingNumber: data.bookingNumber, tenantId },
          include: { tokens: true },
        });
      } else if (data.patientId && data.qrCode) {
        // QR code contains booking info - simplified logic
        booking = await tx.booking.findFirst({
          where: {
            patientId: data.patientId,
            tenantId,
            status: { in: [BookingStatus.SCHEDULED, BookingStatus.CONFIRMED] },
          },
          include: { tokens: true },
        });
      }

      if (!booking) throw new NotFoundException('Booking not found');

      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CHECKED_IN,
          checkInTime: new Date(),
        },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          tokens: { include: { counter: true } },
        },
      });

      // Update token state
      await tx.token.updateMany({
        where: { bookingId: booking.id },
        data: { state: TokenState.CALLED },
      });

      return updatedBooking;
    });
  }

  async bulkReschedule(tenantId: string, data: BulkRescheduleDto) {
    return this.prisma.$transaction(async (tx) => {
      const oldDate = new Date(data.oldDate);
      const newDate = new Date(data.newDate);

      // Find all bookings for the provider on the old date
      const bookings = await tx.booking.findMany({
        where: {
          tenantId,
          schedule: { providerId: data.providerId },
          startTime: {
            gte: new Date(oldDate.setHours(0, 0, 0, 0)),
            lt: new Date(oldDate.setHours(23, 59, 59, 999))
          },
          status: { in: [BookingStatus.SCHEDULED, BookingStatus.CONFIRMED] },
        },
        include: { slot: true },
      });

      const rescheduledBookings = [];

      for (const booking of bookings) {
        // Find new slot at same time on new date
        const newStartTime = new Date(newDate);
        newStartTime.setHours(booking.startTime.getHours(), booking.startTime.getMinutes());

        const newSlot = await tx.slot.findFirst({
          where: {
            scheduleId: booking.scheduleId,
            startTime: newStartTime,
            isAvailable: true,
          },
          include: { bookings: { select: { status: true } } }
        });

        if (!newSlot) {
          this.logger.warn(`No slot available for booking ${booking.id} on new date`);
          continue;
        }

        // Check capacity
        const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
        const maxCapacity = Math.floor(newSlot.maxCapacity * (1 + overbookingConfig / 100));
        const bookedCount = newSlot.bookings.filter(b => b.status === BookingStatus.SCHEDULED || b.status === BookingStatus.CONFIRMED).length;

        if (bookedCount >= maxCapacity) {
          this.logger.warn(`Slot ${newSlot.id} is fully booked`);
          continue;
        }

        // Update booking
        const updatedBooking = await tx.booking.update({
          where: { id: booking.id },
          data: {
            startTime: newStartTime,
            endTime: new Date(newStartTime.getTime() + (booking.endTime ? booking.endTime.getTime() - booking.startTime.getTime() : 30 * 60000)),
            slotId: newSlot.id,
            status: BookingStatus.RESCHEDULED,
            notes: booking.notes ? `${booking.notes}\nBulk rescheduled: ${data.reason}` : `Bulk rescheduled: ${data.reason}`,
          },
        });

        // Update slot counts
        await tx.slot.update({
          where: { id: booking.slotId },
          data: { bookedCount: { decrement: 1 } },
        });

        await tx.slot.update({
          where: { id: newSlot.id },
          data: { bookedCount: { increment: 1 } },
        });

        // Update token
        await tx.token.updateMany({
          where: { bookingId: booking.id },
          data: { state: TokenState.ISSUED },
        });

        // Reschedule reminders
        await tx.reminder.deleteMany({ where: { bookingId: booking.id } });
        await this.scheduleReminders(tx, booking.id, tenantId);

        rescheduledBookings.push(updatedBooking);
      }

      return {
        message: `${rescheduledBookings.length} bookings rescheduled successfully`,
        rescheduledBookings,
      };
    });
  }

  // ==================== UTILITY FUNCTIONS ====================

  private async generateBookingNumber(tx: any, tenantId: string): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const count = await tx.booking.count({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lt: new Date(today.setHours(23, 59, 59, 999))
        }
      }
    });

    return `BKG${dateStr}${(count + 1).toString().padStart(3, '0')}`;
  }

  private async getNextTokenNumber(tx: any, tenantId: string): Promise<number> {
    const today = new Date();
    const maxToken = await tx.token.findFirst({
      where: {
        tenantId,
        issuedAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lt: new Date(today.setHours(23, 59, 59, 999))
        }
      },
      orderBy: { tokenNumber: 'desc' },
      select: { tokenNumber: true }
    });

    return (maxToken?.tokenNumber || 0) + 1;
  }

  private async scheduleReminders(tx: any, bookingId: string, tenantId: string) {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId, tenantId },
      include: { patient: { select: { phone: true, email: true } } }
    });

    if (!booking) return;

    const reminderConfig = await this.getConfigValue(tenantId, 'reminder_hours_before', 24);

    // Schedule SMS reminder
    if (booking.patient.phone) {
      await tx.reminder.create({
        data: {
          bookingId,
          type: 'SMS',
          message: `Reminder: Your appointment with ${booking.schedule.provider.firstName} ${booking.schedule.provider.lastName} is scheduled for ${booking.startTime.toLocaleString()}`,
          scheduledAt: new Date(booking.startTime.getTime() - reminderConfig * 60 * 60 * 1000),
          tenantId,
        },
      });
    }

    // Schedule Email reminder
    if (booking.patient.email) {
      await tx.reminder.create({
        data: {
          bookingId,
          type: 'EMAIL',
          message: `Dear ${booking.patient.firstName}, your appointment is confirmed for ${booking.startTime.toLocaleString()}. Please arrive 15 minutes early.`,
          scheduledAt: new Date(booking.startTime.getTime() - reminderConfig * 60 * 60 * 1000),
          tenantId,
        },
      });
    }
  }

  private async getConfigValue(tenantId: string, key: string, defaultValue: any): Promise<any> {
    const config = await this.prisma.appointmentConfig.findFirst({
      where: { tenantId, key, isActive: true },
    });

    if (!config) return defaultValue;

    return config.value;
  }

  // ==================== CONFIGURATION ====================

  async createConfig(tenantId: string, data: any) {
    return this.prisma.appointmentConfig.create({
      data: { ...data, tenantId },
    });
  }

  async getConfigs(tenantId: string) {
    return this.prisma.appointmentConfig.findMany({
      where: { tenantId, isActive: true },
    });
  }

  async updateConfig(tenantId: string, id: string, data: any) {
    return this.prisma.appointmentConfig.update({
      where: { id, tenantId },
      data,
    });
  }

  // ==================== REPORTING ====================

  async getAppointmentSummary(tenantId: string, fromDate?: Date, toDate?: Date) {
    const dateFilter = {};
    if (fromDate || toDate) {
      dateFilter['startTime'] = {};
      if (fromDate) dateFilter['startTime']['gte'] = fromDate;
      if (toDate) dateFilter['startTime']['lte'] = toDate;
    }

    const [
      totalBookings,
      scheduledBookings,
      completedBookings,
      cancelledBookings,
      noShowBookings,
    ] = await Promise.all([
      this.prisma.booking.count({
        where: { tenantId, ...dateFilter },
      }),
      this.prisma.booking.count({
        where: { tenantId, status: BookingStatus.SCHEDULED, ...dateFilter },
      }),
      this.prisma.booking.count({
        where: { tenantId, status: BookingStatus.COMPLETED, ...dateFilter },
      }),
      this.prisma.booking.count({
        where: { tenantId, status: BookingStatus.CANCELLED, ...dateFilter },
      }),
      this.prisma.booking.count({
        where: { tenantId, status: BookingStatus.NO_SHOW, ...dateFilter },
      }),
    ]);

    return {
      totalBookings,
      scheduledBookings,
      completedBookings,
      cancelledBookings,
      noShowBookings,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
    };
  }
}
