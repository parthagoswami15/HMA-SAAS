import { PrismaService } from '../prisma/prisma.service';
export declare class SchedulingService {
    private prisma;
    constructor(prisma: PrismaService);
    createSchedule(tenantId: string, data: {
        doctorId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        location?: string;
    }): Promise<any>;
    listSchedules(tenantId: string): any;
    createAppointment(tenantId: string, data: {
        patientId: string;
        doctorId: string;
        appointmentDate: Date;
        startTime: string;
        endTime: string;
        type: string;
        notes?: string;
    }): Promise<any>;
    getAppointment(tenantId: string, id: string): Promise<any>;
    listAppointments(tenantId: string, filters?: {
        patientId?: string;
        doctorId?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
    }): any;
    updateAppointment(tenantId: string, id: string, data: any): Promise<any>;
    cancelAppointment(tenantId: string, id: string, reason?: string): Promise<any>;
}
