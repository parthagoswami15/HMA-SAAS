import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class AppointmentService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getAppointments(query: any, user: any): Promise<{
        appointments: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    bookAppointment(appointmentDto: any, user: any): Promise<any>;
    updateAppointment(appointmentId: string, updateDto: any, user: any): Promise<any>;
    cancelAppointment(appointmentId: string, user: any): Promise<any>;
    getAppointmentDetails(appointmentId: string, user: any): Promise<any>;
    getUpcomingAppointments(user: any): Promise<any>;
    rescheduleAppointment(appointmentId: string, rescheduleDto: any, user: any): Promise<any>;
    getAppointmentHistory(user: any): Promise<any>;
    rateAppointment(appointmentId: string, ratingDto: any, user: any): Promise<any>;
    private checkDoctorAvailability;
    private sendAppointmentConfirmation;
    private sendAppointmentCancellation;
    private updateDoctorRating;
    getAppointmentStats(user: any): Promise<{
        userId: any;
        totalAppointments: any;
        completedAppointments: any;
        cancelledAppointments: any;
        upcomingAppointments: any;
        completionRate: number;
    }>;
}
