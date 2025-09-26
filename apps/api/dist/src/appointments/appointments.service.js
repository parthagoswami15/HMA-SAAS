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
var AppointmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const appointments_dto_1 = require("./appointments.dto");
let AppointmentsService = AppointmentsService_1 = class AppointmentsService {
    prisma = new client_1.PrismaClient();
    logger = new common_1.Logger(AppointmentsService_1.name);
    constructor() { }
    async createSchedule(tenantId, data) {
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
            await this.generateSlots(tx, schedule.id, tenantId);
            return schedule;
        });
    }
    async getSchedules(tenantId, providerId, dayOfWeek, isActive) {
        const where = { tenantId };
        if (providerId)
            where.providerId = providerId;
        if (dayOfWeek !== undefined)
            where.dayOfWeek = dayOfWeek;
        if (isActive !== undefined)
            where.isActive = isActive;
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
    async getScheduleById(tenantId, id) {
        const schedule = await this.prisma.schedule.findUnique({
            where: { id, tenantId },
            include: {
                provider: { select: { firstName: true, lastName: true } },
                slots: {
                    include: { bookings: { select: { id: true, status: true, patient: { select: { firstName: true, lastName: true } } } } }
                },
            },
        });
        if (!schedule)
            throw new common_1.NotFoundException('Schedule not found');
        return schedule;
    }
    async updateSchedule(tenantId, id, data) {
        return this.prisma.$transaction(async (tx) => {
            const schedule = await tx.schedule.update({
                where: { id, tenantId },
                data: {
                    ...data,
                    startTime: data.startTime ? new Date(data.startTime) : undefined,
                    endTime: data.endTime ? new Date(data.endTime) : undefined,
                },
            });
            if (data.startTime || data.endTime || data.slotLength) {
                await this.regenerateSlots(tx, id, tenantId);
            }
            return schedule;
        });
    }
    async deleteSchedule(tenantId, id) {
        return this.prisma.schedule.delete({
            where: { id, tenantId },
        });
    }
    async generateSlots(tx, scheduleId, tenantId) {
        const schedule = await tx.schedule.findUnique({
            where: { id: scheduleId, tenantId },
        });
        if (!schedule)
            return;
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
    async regenerateSlots(tx, scheduleId, tenantId) {
        await tx.slot.deleteMany({ where: { scheduleId, tenantId } });
        await this.generateSlots(tx, scheduleId, tenantId);
    }
    async getAvailableSlots(tenantId, data) {
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
                const bookedCount = slot.bookings.filter((b) => b.status === appointments_dto_1.BookingStatus.SCHEDULED || b.status === appointments_dto_1.BookingStatus.CONFIRMED).length;
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
    async createBooking(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            if (data.slotId) {
                const slot = await tx.slot.findUnique({
                    where: { id: data.slotId, tenantId },
                    include: { bookings: { select: { status: true } } }
                });
                if (!slot)
                    throw new common_1.NotFoundException('Slot not found');
                const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
                const maxCapacity = Math.floor(slot.maxCapacity * (1 + overbookingConfig / 100));
                const bookedCount = slot.bookings.filter((b) => b.status === appointments_dto_1.BookingStatus.SCHEDULED || b.status === appointments_dto_1.BookingStatus.CONFIRMED).length;
                if (bookedCount >= maxCapacity) {
                    throw new common_1.BadRequestException('Slot is fully booked');
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
                    channel: data.channel || appointments_dto_1.BookingChannel.WEB,
                },
                include: {
                    patient: { select: { firstName: true, lastName: true } },
                    schedule: { include: { provider: { select: { firstName: true, lastName: true } } } },
                    slot: true,
                },
            });
            await tx.token.create({
                data: {
                    bookingId: booking.id,
                    tokenNumber: await this.getNextTokenNumber(tx, tenantId),
                    tenantId,
                },
            });
            await this.scheduleReminders(tx, booking.id, tenantId);
            return booking;
        });
    }
    async bookAppointment(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const date = new Date(data.appointmentDate);
            const dayOfWeek = date.getDay();
            const schedule = await tx.schedule.findFirst({
                where: {
                    tenantId,
                    providerId: data.providerId,
                    dayOfWeek,
                    isActive: true,
                },
            });
            if (!schedule)
                throw new common_1.NotFoundException('No schedule available for this provider on this date');
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
                const bookedCount = slot.bookings.filter((b) => b.status === appointments_dto_1.BookingStatus.SCHEDULED || b.status === appointments_dto_1.BookingStatus.CONFIRMED).length;
                if (bookedCount < maxCapacity) {
                    availableSlot = slot;
                    break;
                }
            }
            if (!availableSlot)
                throw new common_1.BadRequestException('No slots available for this date');
            const bookingNumber = await this.generateBookingNumber(tx, tenantId);
            const booking = await tx.booking.create({
                data: {
                    patientId: data.patientId,
                    scheduleId: schedule.id,
                    slotId: availableSlot.id,
                    channel: data.channel || appointments_dto_1.BookingChannel.WEB,
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
            await tx.token.create({
                data: {
                    bookingId: booking.id,
                    tokenNumber: await this.getNextTokenNumber(tx, tenantId),
                    tenantId,
                },
            });
            await this.scheduleReminders(tx, booking.id, tenantId);
            return booking;
        });
    }
    async getBookings(tenantId, patientId, providerId, status, fromDate, toDate, channel) {
        const where = { tenantId };
        if (patientId)
            where.patientId = patientId;
        if (providerId)
            where.schedule = { providerId };
        if (status)
            where.status = status;
        if (channel)
            where.channel = channel;
        if (fromDate || toDate) {
            where.startTime = {};
            if (fromDate)
                where.startTime.gte = new Date(fromDate);
            if (toDate)
                where.startTime.lte = new Date(toDate);
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
    async getBookingById(tenantId, id) {
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
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
    async updateBooking(tenantId, id, data) {
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
            if (data.status && data.status === appointments_dto_1.BookingStatus.CHECKED_IN) {
                await tx.token.updateMany({
                    where: { bookingId: id },
                    data: { state: appointments_dto_1.TokenState.CALLED },
                });
            }
            return booking;
        });
    }
    async rescheduleBooking(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({
                where: { id: data.bookingId, tenantId },
                include: { slot: true },
            });
            if (!booking)
                throw new common_1.NotFoundException('Booking not found');
            if (booking.slotId) {
                await tx.slot.update({
                    where: { id: booking.slotId },
                    data: { bookedCount: { decrement: 1 } },
                });
            }
            const newDate = new Date(data.newStartTime);
            const newSlot = await tx.slot.findFirst({
                where: {
                    scheduleId: booking.scheduleId,
                    startTime: newDate,
                    isAvailable: true,
                },
                include: { bookings: { select: { status: true } } }
            });
            if (!newSlot)
                throw new common_1.BadRequestException('No available slot for new time');
            const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
            const maxCapacity = Math.floor(newSlot.maxCapacity * (1 + overbookingConfig / 100));
            const bookedCount = newSlot.bookings.filter(b => b.status === appointments_dto_1.BookingStatus.SCHEDULED || b.status === appointments_dto_1.BookingStatus.CONFIRMED).length;
            if (bookedCount >= maxCapacity) {
                throw new common_1.BadRequestException('New slot is fully booked');
            }
            const updatedBooking = await tx.booking.update({
                where: { id: data.bookingId },
                data: {
                    startTime: newDate,
                    endTime: new Date(newDate.getTime() + (booking.endTime ? booking.endTime.getTime() - booking.startTime.getTime() : 30 * 60000)),
                    slotId: newSlot.id,
                    status: appointments_dto_1.BookingStatus.RESCHEDULED,
                    notes: booking.notes ? `${booking.notes}\nRescheduled: ${data.reason}` : `Rescheduled: ${data.reason}`,
                },
                include: {
                    patient: { select: { firstName: true, lastName: true } },
                    schedule: { include: { provider: { select: { firstName: true, lastName: true } } } },
                    slot: true,
                },
            });
            await tx.slot.update({
                where: { id: newSlot.id },
                data: { bookedCount: { increment: 1 } },
            });
            await tx.token.updateMany({
                where: { bookingId: data.bookingId },
                data: { state: appointments_dto_1.TokenState.ISSUED },
            });
            await tx.reminder.deleteMany({ where: { bookingId: data.bookingId } });
            await this.scheduleReminders(tx, data.bookingId, tenantId);
            return updatedBooking;
        });
    }
    async processNoShows(tenantId) {
        return this.prisma.$transaction(async (tx) => {
            const now = new Date();
            const noShowThreshold = await this.getConfigValue(tenantId, 'no_show_threshold_minutes', 30);
            const overdueBookings = await tx.booking.findMany({
                where: {
                    tenantId,
                    status: { in: [appointments_dto_1.BookingStatus.SCHEDULED, appointments_dto_1.BookingStatus.CONFIRMED] },
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
                await tx.booking.update({
                    where: { id: booking.id },
                    data: { status: appointments_dto_1.BookingStatus.NO_SHOW }
                });
                if (booking.slotId) {
                    await tx.slot.update({
                        where: { id: booking.slotId },
                        data: { bookedCount: { decrement: 1 } }
                    });
                }
                await tx.token.updateMany({
                    where: { bookingId: booking.id },
                    data: { state: appointments_dto_1.TokenState.EXPIRED }
                });
                await tx.reminder.updateMany({
                    where: { bookingId: booking.id },
                    data: { status: 'CANCELLED' }
                });
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
    async generateQrCode(tenantId, data) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: data.bookingId, tenantId },
            include: {
                patient: { select: { firstName: true, lastName: true } },
                schedule: { include: { provider: { select: { firstName: true, lastName: true } } } }
            }
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
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
    async scanQrCode(tenantId, data) {
        let qrData;
        try {
            qrData = JSON.parse(data.qrCode);
        }
        catch {
            try {
                const decoded = Buffer.from(data.qrCode, 'base64').toString('utf-8');
                qrData = JSON.parse(decoded);
            }
            catch {
                throw new common_1.BadRequestException('Invalid QR code format');
            }
        }
        if (!qrData.type || qrData.type !== 'appointment_checkin') {
            throw new common_1.BadRequestException('Invalid QR code type');
        }
        if (qrData.tenantId !== tenantId) {
            throw new common_1.BadRequestException('QR code not valid for this tenant');
        }
        const booking = await this.prisma.booking.findUnique({
            where: { id: qrData.bookingId, tenantId },
            include: { tokens: true }
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status === appointments_dto_1.BookingStatus.CHECKED_IN) {
            throw new common_1.BadRequestException('Appointment already checked in');
        }
        if (booking.status === appointments_dto_1.BookingStatus.CANCELLED || booking.status === appointments_dto_1.BookingStatus.NO_SHOW) {
            throw new common_1.BadRequestException('Appointment is not active');
        }
        return this.kioskCheckIn(tenantId, {
            patientId: qrData.patientId,
            qrCode: data.qrCode,
            kioskId: data.kioskId
        });
    }
    async createWalkInAppointment(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const availableCounter = await tx.counter.findFirst({
                where: { tenantId, isActive: true }
            });
            if (!availableCounter) {
                throw new common_1.BadRequestException('No available counters for walk-in appointments');
            }
            let patient = await tx.patient.findUnique({
                where: { id: data.patientId, tenantId }
            });
            if (!patient) {
                throw new common_1.NotFoundException('Patient not found. Please register patient first.');
            }
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
                throw new common_1.BadRequestException('No available slots for walk-in appointments in the next hour');
            }
            const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
            const maxCapacity = Math.floor(availableSlot.maxCapacity * (1 + overbookingConfig / 100));
            const bookedCount = availableSlot.bookings.filter(b => b.status === appointments_dto_1.BookingStatus.SCHEDULED || b.status === appointments_dto_1.BookingStatus.CONFIRMED).length;
            if (bookedCount >= maxCapacity) {
                throw new common_1.BadRequestException('No available capacity for walk-in appointments');
            }
            const bookingNumber = await this.generateBookingNumber(tx, tenantId);
            const booking = await tx.booking.create({
                data: {
                    patientId: data.patientId,
                    scheduleId: availableSlot.scheduleId,
                    slotId: availableSlot.id,
                    channel: appointments_dto_1.BookingChannel.WALK_IN,
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
            await tx.slot.update({
                where: { id: availableSlot.id },
                data: { bookedCount: { increment: 1 } }
            });
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
            await tx.booking.update({
                where: { id: booking.id },
                data: {
                    status: appointments_dto_1.BookingStatus.CHECKED_IN,
                    checkInTime: new Date()
                }
            });
            await tx.token.update({
                where: { id: token.id },
                data: { state: appointments_dto_1.TokenState.CALLED }
            });
            return {
                booking,
                token,
                counter: availableCounter,
                estimatedWaitTime: await this.calculateWaitTime(tx, availableCounter.id, tenantId)
            };
        });
    }
    async setPriorityRules(tenantId, rules) {
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
    async getPriorityRules(tenantId) {
        const config = await this.prisma.appointmentConfig.findFirst({
            where: {
                key: 'priority_rules',
                tenantId,
                isActive: true
            }
        });
        return config?.value || this.getDefaultPriorityRules();
    }
    getDefaultPriorityRules() {
        return {
            emergency: {
                priority: 1,
                timeWindow: 30,
                maxSlots: 2
            },
            vip: {
                priority: 2,
                bookingWindow: 7,
                preferredProviders: []
            },
            regular: {
                priority: 3,
                bookingWindow: 30,
                waitTimeMultiplier: 1
            },
            walkIn: {
                priority: 4,
                maxWaitTime: 60,
                preferredTimes: ['09:00', '14:00']
            }
        };
    }
    async applyPriorityRules(tenantId, bookingData) {
        const rules = await this.getPriorityRules(tenantId);
        const patient = await this.prisma.patient.findUnique({
            where: { id: bookingData.patientId, tenantId }
        });
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        let priority = 3;
        let adjustedData = { ...bookingData };
        if (bookingData.isEmergency) {
            priority = 1;
            const emergencySlot = await this.findEmergencySlot(tenantId, bookingData.providerId, rules.emergency.timeWindow);
            if (emergencySlot) {
                adjustedData.slotId = emergencySlot.id;
                adjustedData.startTime = emergencySlot.startTime;
                adjustedData.endTime = emergencySlot.endTime;
            }
        }
        else if (patient.isVIP) {
            priority = 2;
            const bookingDate = new Date(bookingData.startTime);
            const daysDiff = Math.ceil((bookingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff > rules.vip.bookingWindow) {
                throw new common_1.BadRequestException(`VIP bookings must be made within ${rules.vip.bookingWindow} days`);
            }
        }
        else if (bookingData.channel === appointments_dto_1.BookingChannel.WALK_IN) {
            priority = 4;
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
    async findEmergencySlot(tenantId, providerId, timeWindow) {
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
        if (!slot)
            return null;
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
                channel: appointments_dto_1.BookingChannel.WALK_IN,
                isEmergency: true
            }
        });
        if (emergencyBookings < emergencyConfig) {
            return slot;
        }
        return null;
    }
    async findPreferredWalkInSlot(tenantId, providerId, preferredTimes) {
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
                    const bookedCount = slot.bookings.filter(b => b.status === appointments_dto_1.BookingStatus.SCHEDULED || b.status === appointments_dto_1.BookingStatus.CONFIRMED).length;
                    if (bookedCount < maxCapacity) {
                        return slot;
                    }
                }
            }
        }
        return null;
    }
    async cancelBooking(tenantId, id, reason) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({
                where: { id, tenantId },
                include: { slot: true, tokens: true },
            });
            if (!booking)
                throw new common_1.NotFoundException('Booking not found');
            await tx.booking.update({
                where: { id },
                data: {
                    status: appointments_dto_1.BookingStatus.CANCELLED,
                    notes: booking.notes ? `${booking.notes}\nCancelled: ${reason}` : `Cancelled: ${reason}`,
                },
            });
            if (booking.slotId) {
                await tx.slot.update({
                    where: { id: booking.slotId },
                    data: { bookedCount: { decrement: 1 } },
                });
            }
            await tx.token.updateMany({
                where: { bookingId: id },
                data: { state: appointments_dto_1.TokenState.EXPIRED },
            });
            await tx.reminder.updateMany({
                where: { bookingId: id },
                data: { status: 'CANCELLED' },
            });
            return { message: 'Booking cancelled successfully' };
        });
    }
    async getNoShowHistory(tenantId, fromDate, toDate) {
        const where = { tenantId, key: { startsWith: 'no_show_' } };
        const configs = await this.prisma.appointmentConfig.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        const noShows = configs.map(config => config.value);
        return {
            totalNoShows: noShows.length,
            noShows: noShows.filter(noShow => {
                if (!fromDate && !toDate)
                    return true;
                const scheduledTime = new Date(noShow.scheduledTime);
                if (fromDate && scheduledTime < fromDate)
                    return false;
                if (toDate && scheduledTime > toDate)
                    return false;
                return true;
            })
        };
    }
    async processPayment(tenantId, bookingId, paymentData) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({
                where: { id: bookingId, tenantId },
                include: { patient: true, schedule: { include: { provider: true } } }
            });
            if (!booking)
                throw new common_1.NotFoundException('Booking not found');
            if (booking.isPrePaid) {
                throw new common_1.BadRequestException('Payment already processed for this booking');
            }
            const consultationFee = await this.getConfigValue(tenantId, 'consultation_fee', 500);
            const processingFee = Math.round(consultationFee * 0.02);
            const payment = await tx.payment.create({
                data: {
                    billingId: bookingId,
                    amount: consultationFee + processingFee,
                    paymentMethod: paymentData.method,
                    transactionId: paymentData.transactionId,
                    notes: paymentData.notes,
                    receivedBy: 'system',
                    tenantId,
                }
            });
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
    async createToken(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({
                where: { id: data.bookingId, tenantId },
            });
            if (!booking)
                throw new common_1.NotFoundException('Booking not found');
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
    async getTokens(tenantId, bookingId, counterId, state, tokenNumber) {
        const where = { tenantId };
        if (bookingId)
            where.bookingId = bookingId;
        if (counterId)
            where.counterId = counterId;
        if (state)
            where.state = state;
        if (tokenNumber)
            where.tokenNumber = tokenNumber;
        return this.prisma.token.findMany({
            where,
            include: {
                booking: { include: { patient: { select: { firstName: true, lastName: true } }, schedule: { include: { provider: { select: { firstName: true, lastName: true } } } } } },
                counter: true,
            },
            orderBy: { issuedAt: 'asc' },
        });
    }
    async updateToken(tenantId, id, data) {
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
    async callNextToken(tenantId, counterId) {
        return this.prisma.$transaction(async (tx) => {
            const counter = await tx.counter.findUnique({
                where: { id: counterId, tenantId },
            });
            if (!counter)
                throw new common_1.NotFoundException('Counter not found');
            const nextToken = await tx.token.findFirst({
                where: {
                    tenantId,
                    counterId: null,
                    state: appointments_dto_1.TokenState.ISSUED,
                },
                include: { booking: { include: { patient: { select: { firstName: true, lastName: true } } } } },
                orderBy: { tokenNumber: 'asc' },
            });
            if (!nextToken)
                throw new common_1.NotFoundException('No tokens available');
            const updatedToken = await tx.token.update({
                where: { id: nextToken.id },
                data: {
                    counterId,
                    state: appointments_dto_1.TokenState.CALLED,
                    calledAt: new Date(),
                },
                include: {
                    booking: { include: { patient: { select: { firstName: true, lastName: true } } } },
                    counter: true,
                },
            });
            await tx.booking.update({
                where: { id: nextToken.bookingId },
                data: { status: appointments_dto_1.BookingStatus.IN_PROGRESS },
            });
            return updatedToken;
        });
    }
    async createCounter(tenantId, data) {
        return this.prisma.counter.create({
            data: { ...data, tenantId },
        });
    }
    async getCounters(tenantId, isActive) {
        const where = { tenantId };
        if (isActive !== undefined)
            where.isActive = isActive;
        return this.prisma.counter.findMany({
            where,
            include: { tokens: { where: { state: appointments_dto_1.TokenState.CALLED } } },
        });
    }
    async updateCounter(tenantId, id, data) {
        return this.prisma.counter.update({
            where: { id, tenantId },
            data,
        });
    }
    async createReminder(tenantId, data) {
        return this.prisma.reminder.create({
            data: {
                ...data,
                scheduledAt: new Date(data.scheduledAt),
                tenantId,
            },
            include: { booking: { include: { patient: { select: { firstName: true, lastName: true } } } } },
        });
    }
    async getReminders(tenantId, bookingId, status) {
        const where = { tenantId };
        if (bookingId)
            where.bookingId = bookingId;
        if (status)
            where.status = status;
        return this.prisma.reminder.findMany({
            where,
            include: { booking: { include: { patient: { select: { firstName: true, lastName: true } } } } },
            orderBy: { scheduledAt: 'asc' },
        });
    }
    async updateReminder(tenantId, id, data) {
        return this.prisma.reminder.update({
            where: { id, tenantId },
            data: {
                ...data,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
                sentAt: data.sentAt ? new Date(data.sentAt) : undefined,
            },
        });
    }
    async checkIn(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({
                where: { id: data.bookingId, tenantId },
                include: { tokens: true },
            });
            if (!booking)
                throw new common_1.NotFoundException('Booking not found');
            const updatedBooking = await tx.booking.update({
                where: { id: data.bookingId },
                data: {
                    status: appointments_dto_1.BookingStatus.CHECKED_IN,
                    checkInTime: new Date(),
                },
                include: {
                    patient: { select: { firstName: true, lastName: true } },
                    tokens: { include: { counter: true } },
                },
            });
            await tx.token.updateMany({
                where: { bookingId: data.bookingId },
                data: { state: appointments_dto_1.TokenState.CALLED },
            });
            return updatedBooking;
        });
    }
    async kioskCheckIn(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            let booking;
            if (data.bookingNumber) {
                booking = await tx.booking.findUnique({
                    where: { bookingNumber: data.bookingNumber, tenantId },
                    include: { tokens: true },
                });
            }
            else if (data.patientId && data.qrCode) {
                booking = await tx.booking.findFirst({
                    where: {
                        patientId: data.patientId,
                        tenantId,
                        status: { in: [appointments_dto_1.BookingStatus.SCHEDULED, appointments_dto_1.BookingStatus.CONFIRMED] },
                    },
                    include: { tokens: true },
                });
            }
            if (!booking)
                throw new common_1.NotFoundException('Booking not found');
            const updatedBooking = await tx.booking.update({
                where: { id: booking.id },
                data: {
                    status: appointments_dto_1.BookingStatus.CHECKED_IN,
                    checkInTime: new Date(),
                },
                include: {
                    patient: { select: { firstName: true, lastName: true } },
                    tokens: { include: { counter: true } },
                },
            });
            await tx.token.updateMany({
                where: { bookingId: booking.id },
                data: { state: appointments_dto_1.TokenState.CALLED },
            });
            return updatedBooking;
        });
    }
    async bulkReschedule(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const oldDate = new Date(data.oldDate);
            const newDate = new Date(data.newDate);
            const bookings = await tx.booking.findMany({
                where: {
                    tenantId,
                    schedule: { providerId: data.providerId },
                    startTime: {
                        gte: new Date(oldDate.setHours(0, 0, 0, 0)),
                        lt: new Date(oldDate.setHours(23, 59, 59, 999))
                    },
                    status: { in: [appointments_dto_1.BookingStatus.SCHEDULED, appointments_dto_1.BookingStatus.CONFIRMED] },
                },
                include: { slot: true },
            });
            const rescheduledBookings = [];
            for (const booking of bookings) {
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
                const overbookingConfig = await this.getConfigValue(tenantId, 'overbooking_percentage', 0);
                const maxCapacity = Math.floor(newSlot.maxCapacity * (1 + overbookingConfig / 100));
                const bookedCount = newSlot.bookings.filter(b => b.status === appointments_dto_1.BookingStatus.SCHEDULED || b.status === appointments_dto_1.BookingStatus.CONFIRMED).length;
                if (bookedCount >= maxCapacity) {
                    this.logger.warn(`Slot ${newSlot.id} is fully booked`);
                    continue;
                }
                const updatedBooking = await tx.booking.update({
                    where: { id: booking.id },
                    data: {
                        startTime: newStartTime,
                        endTime: new Date(newStartTime.getTime() + (booking.endTime ? booking.endTime.getTime() - booking.startTime.getTime() : 30 * 60000)),
                        slotId: newSlot.id,
                        status: appointments_dto_1.BookingStatus.RESCHEDULED,
                        notes: booking.notes ? `${booking.notes}\nBulk rescheduled: ${data.reason}` : `Bulk rescheduled: ${data.reason}`,
                    },
                });
                await tx.slot.update({
                    where: { id: booking.slotId },
                    data: { bookedCount: { decrement: 1 } },
                });
                await tx.slot.update({
                    where: { id: newSlot.id },
                    data: { bookedCount: { increment: 1 } },
                });
                await tx.token.updateMany({
                    where: { bookingId: booking.id },
                    data: { state: appointments_dto_1.TokenState.ISSUED },
                });
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
    async generateBookingNumber(tx, tenantId) {
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
    async getNextTokenNumber(tx, tenantId) {
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
    async scheduleReminders(tx, bookingId, tenantId) {
        const booking = await tx.booking.findUnique({
            where: { id: bookingId, tenantId },
            include: { patient: { select: { phone: true, email: true } } }
        });
        if (!booking)
            return;
        const reminderConfig = await this.getConfigValue(tenantId, 'reminder_hours_before', 24);
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
    async getConfigValue(tenantId, key, defaultValue) {
        const config = await this.prisma.appointmentConfig.findFirst({
            where: { tenantId, key, isActive: true },
        });
        if (!config)
            return defaultValue;
        return config.value;
    }
    async createConfig(tenantId, data) {
        return this.prisma.appointmentConfig.create({
            data: { ...data, tenantId },
        });
    }
    async getConfigs(tenantId) {
        return this.prisma.appointmentConfig.findMany({
            where: { tenantId, isActive: true },
        });
    }
    async updateConfig(tenantId, id, data) {
        return this.prisma.appointmentConfig.update({
            where: { id, tenantId },
            data,
        });
    }
    async getAppointmentSummary(tenantId, fromDate, toDate) {
        const dateFilter = {};
        if (fromDate || toDate) {
            dateFilter['startTime'] = {};
            if (fromDate)
                dateFilter['startTime']['gte'] = fromDate;
            if (toDate)
                dateFilter['startTime']['lte'] = toDate;
        }
        const [totalBookings, scheduledBookings, completedBookings, cancelledBookings, noShowBookings,] = await Promise.all([
            this.prisma.booking.count({
                where: { tenantId, ...dateFilter },
            }),
            this.prisma.booking.count({
                where: { tenantId, status: appointments_dto_1.BookingStatus.SCHEDULED, ...dateFilter },
            }),
            this.prisma.booking.count({
                where: { tenantId, status: appointments_dto_1.BookingStatus.COMPLETED, ...dateFilter },
            }),
            this.prisma.booking.count({
                where: { tenantId, status: appointments_dto_1.BookingStatus.CANCELLED, ...dateFilter },
            }),
            this.prisma.booking.count({
                where: { tenantId, status: appointments_dto_1.BookingStatus.NO_SHOW, ...dateFilter },
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
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = AppointmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map