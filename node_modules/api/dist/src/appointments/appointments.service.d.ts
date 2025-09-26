import { BookingChannel, BookingStatus, TokenState } from './appointments.dto';
import { CreateScheduleDto, UpdateScheduleDto, CreateBookingDto, UpdateBookingDto, CreateTokenDto, UpdateTokenDto, CreateCounterDto, UpdateCounterDto, CreateReminderDto, UpdateReminderDto, CheckInDto, KioskCheckInDto, SearchSlotsDto, BulkRescheduleDto, BookAppointmentDto, RescheduleBookingDto } from './appointments.dto';
export declare class AppointmentsService {
    private readonly prisma;
    private readonly logger;
    constructor();
    createSchedule(tenantId: string, data: CreateScheduleDto): Promise<any>;
    getSchedules(tenantId: string, providerId?: string, dayOfWeek?: number, isActive?: boolean): Promise<any>;
    getScheduleById(tenantId: string, id: string): Promise<any>;
    updateSchedule(tenantId: string, id: string, data: UpdateScheduleDto): Promise<any>;
    deleteSchedule(tenantId: string, id: string): Promise<any>;
    private generateSlots;
    private regenerateSlots;
    getAvailableSlots(tenantId: string, data: SearchSlotsDto): Promise<any[]>;
    createBooking(tenantId: string, data: CreateBookingDto): Promise<any>;
    bookAppointment(tenantId: string, data: BookAppointmentDto): Promise<any>;
    getBookings(tenantId: string, patientId?: string, providerId?: string, status?: BookingStatus, fromDate?: string, toDate?: string, channel?: BookingChannel): Promise<any>;
    getBookingById(tenantId: string, id: string): Promise<any>;
    updateBooking(tenantId: string, id: string, data: UpdateBookingDto): Promise<any>;
    rescheduleBooking(tenantId: string, data: RescheduleBookingDto): Promise<any>;
    processNoShows(tenantId: string): Promise<any>;
    generateQrCode(tenantId: string, data: any): Promise<{
        qrCode: any;
        qrData: {
            type: string;
            bookingId: any;
            bookingNumber: any;
            patientId: any;
            patientName: string;
            providerName: string;
            appointmentTime: any;
            tenantId: string;
        };
        format: string;
        qrString?: undefined;
    } | {
        qrData: {
            type: string;
            bookingId: any;
            bookingNumber: any;
            patientId: any;
            patientName: string;
            providerName: string;
            appointmentTime: any;
            tenantId: string;
        };
        qrString: string;
        qrCode?: undefined;
        format?: undefined;
    }>;
    scanQrCode(tenantId: string, data: any): Promise<any>;
    createWalkInAppointment(tenantId: string, data: any): Promise<any>;
    setPriorityRules(tenantId: string, rules: any): Promise<any>;
    getPriorityRules(tenantId: string): Promise<any>;
    private getDefaultPriorityRules;
    applyPriorityRules(tenantId: string, bookingData: any): Promise<{
        priority: number;
        adjustedData: any;
        rules: any;
    }>;
    private findEmergencySlot;
    private findPreferredWalkInSlot;
    cancelBooking(tenantId: string, id: string, reason?: string): Promise<any>;
    getNoShowHistory(tenantId: string, fromDate?: Date, toDate?: Date): Promise<{
        totalNoShows: any;
        noShows: any;
    }>;
    processPayment(tenantId: string, bookingId: string, paymentData: any): Promise<any>;
    createToken(tenantId: string, data: CreateTokenDto): Promise<any>;
    getTokens(tenantId: string, bookingId?: string, counterId?: string, state?: TokenState, tokenNumber?: number): Promise<any>;
    updateToken(tenantId: string, id: string, data: UpdateTokenDto): Promise<any>;
    callNextToken(tenantId: string, counterId: string): Promise<any>;
    createCounter(tenantId: string, data: CreateCounterDto): Promise<any>;
    getCounters(tenantId: string, isActive?: boolean): Promise<any>;
    updateCounter(tenantId: string, id: string, data: UpdateCounterDto): Promise<any>;
    createReminder(tenantId: string, data: CreateReminderDto): Promise<any>;
    getReminders(tenantId: string, bookingId?: string, status?: string): Promise<any>;
    updateReminder(tenantId: string, id: string, data: UpdateReminderDto): Promise<any>;
    checkIn(tenantId: string, data: CheckInDto): Promise<any>;
    kioskCheckIn(tenantId: string, data: KioskCheckInDto): Promise<any>;
    bulkReschedule(tenantId: string, data: BulkRescheduleDto): Promise<any>;
    private generateBookingNumber;
    private getNextTokenNumber;
    private scheduleReminders;
    private getConfigValue;
    createConfig(tenantId: string, data: any): Promise<any>;
    getConfigs(tenantId: string): Promise<any>;
    updateConfig(tenantId: string, id: string, data: any): Promise<any>;
    getAppointmentSummary(tenantId: string, fromDate?: Date, toDate?: Date): Promise<{
        totalBookings: any;
        scheduledBookings: any;
        completedBookings: any;
        cancelledBookings: any;
        noShowBookings: any;
        completionRate: number;
    }>;
}
