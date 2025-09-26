export declare enum BookingChannel {
    WEB = "WEB",
    APP = "APP",
    CALL = "CALL",
    PARTNER = "PARTNER",
    KIOSK = "KIOSK",
    WALK_IN = "WALK_IN"
}
export declare enum BookingStatus {
    SCHEDULED = "SCHEDULED",
    CONFIRMED = "CONFIRMED",
    CHECKED_IN = "CHECKED_IN",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW",
    RESCHEDULED = "RESCHEDULED"
}
export declare enum TokenState {
    ISSUED = "ISSUED",
    CALLED = "CALLED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    SKIPPED = "SKIPPED",
    EXPIRED = "EXPIRED"
}
export declare class CreateScheduleDto {
    providerId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotLength?: number;
    overbookingPercentage?: number;
    isActive?: boolean;
}
export declare class UpdateScheduleDto {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    slotLength?: number;
    overbookingPercentage?: number;
    isActive?: boolean;
}
export declare class CreateSlotDto {
    scheduleId: string;
    startTime: string;
    endTime: string;
    maxCapacity?: number;
    isAvailable?: boolean;
}
export declare class UpdateSlotDto {
    startTime?: string;
    endTime?: string;
    maxCapacity?: number;
    isAvailable?: boolean;
}
export declare class CreateBookingDto {
    patientId: string;
    scheduleId: string;
    slotId?: string;
    channel?: BookingChannel;
    startTime: string;
    endTime?: string;
    notes?: string;
    isPrePaid?: boolean;
}
export declare class UpdateBookingDto {
    status?: BookingStatus;
    notes?: string;
    checkInTime?: string;
    endTime?: string;
    isPrePaid?: boolean;
}
export declare class BookAppointmentDto {
    patientId: string;
    providerId: string;
    appointmentDate: string;
    notes?: string;
    channel?: BookingChannel;
}
export declare class RescheduleBookingDto {
    bookingId: string;
    newStartTime: string;
    reason?: string;
}
export declare class CreateTokenDto {
    bookingId: string;
    counterId?: string;
    tokenNumber?: number;
}
export declare class UpdateTokenDto {
    counterId?: string;
    state?: TokenState;
    calledAt?: string;
    completedAt?: string;
    notes?: string;
}
export declare class CreateCounterDto {
    name: string;
    location?: string;
    isActive?: boolean;
}
export declare class UpdateCounterDto {
    name?: string;
    location?: string;
    isActive?: boolean;
}
export declare class CreateReminderDto {
    bookingId: string;
    name: string;
    message: string;
    scheduledAt: string;
}
export declare class UpdateReminderDto {
    scheduledAt?: string;
    sentAt?: string;
    status?: string;
}
export declare class CreateAppointmentConfigDto {
    key: string;
    value: any;
    description?: string;
    isActive?: boolean;
}
export declare class UpdateAppointmentConfigDto {
    value?: any;
    description?: string;
    isActive?: boolean;
}
export declare class ScheduleQueryDto {
    providerId?: string;
    dayOfWeek?: number;
    isActive?: boolean;
}
export declare class BookingQueryDto {
    patientId?: string;
    providerId?: string;
    status?: BookingStatus;
    fromDate?: string;
    toDate?: string;
    channel?: BookingChannel;
}
export declare class TokenQueryDto {
    bookingId?: string;
    counterId?: string;
    state?: TokenState;
    tokenNumber?: number;
}
export declare class CheckInDto {
    bookingId: string;
    counterId?: string;
}
export declare class KioskCheckInDto {
    patientId?: string;
    bookingNumber?: string;
    qrCode?: string;
}
export declare class SearchSlotsDto {
    providerId: string;
    date: string;
    duration?: number;
}
export declare class GenerateQrCodeDto {
    bookingId: string;
    format?: string;
    size?: number;
}
export declare class BulkRescheduleDto {
    providerId: string;
    oldDate: string;
    newDate: string;
    reason?: string;
}
