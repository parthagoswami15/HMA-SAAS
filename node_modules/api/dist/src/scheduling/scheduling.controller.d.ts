import { SchedulingService } from './scheduling.service';
declare class CreateScheduleDto {
    doctorId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    location?: string;
}
declare class CreateAppointmentDto {
    patientId: string;
    doctorId: string;
    startsAt: string;
    endsAt: string;
    notes?: string;
}
export declare class SchedulingController {
    private svc;
    constructor(svc: SchedulingService);
    createSchedule(tenantId: string, dto: CreateScheduleDto): Promise<any>;
    listSchedules(tenantId: string): any;
    createAppointment(tenantId: string, dto: CreateAppointmentDto): Promise<any>;
    listAppointments(tenantId: string): any;
    updateAppointment(tenantId: string, id: string, dto: Partial<CreateAppointmentDto>): Promise<any>;
    cancel(tenantId: string, id: string): Promise<any>;
}
export {};
