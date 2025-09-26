import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class SchedulingService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    scheduleConsultation(scheduleDto: any, user: any): Promise<any>;
    checkDoctorAvailability(doctorId: string, date: string, timeSlot?: string): Promise<{
        available: boolean;
        reason: string;
    } | {
        available: boolean;
        reason?: undefined;
    }>;
    getAvailability(query: any, user: any): Promise<{
        available: boolean;
        reason: string;
        doctorId?: undefined;
        date?: undefined;
        workingHours?: undefined;
        slotDuration?: undefined;
        availableSlots?: undefined;
    } | {
        doctorId: any;
        date: any;
        workingHours: {
            start: any;
            end: any;
        };
        slotDuration: any;
        availableSlots: {
            startTime: string;
            endTime: string;
            duration: any;
        }[];
        available?: undefined;
        reason?: undefined;
    }>;
    getTimeSlots(query: any, user: any): Promise<{
        startTime: string;
        endTime: string;
        duration: any;
    }[] | undefined>;
    rescheduleConsultation(id: string, rescheduleDto: any, user: any): Promise<any>;
    findEmergencyDoctor(tenantId: string): Promise<any>;
    getDoctorSchedule(doctorId: string, date: string): Promise<any>;
    cancelAppointment(id: string, reason: string, user: any): Promise<any>;
}
