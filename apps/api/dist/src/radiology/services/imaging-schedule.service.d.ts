import { PrismaService } from '../../prisma/prisma.service';
export declare class ImagingScheduleService {
    private prisma;
    constructor(prisma: PrismaService);
    scheduleStudy(studyId: string, scheduleData: any): Promise<any>;
    getAvailableSlots(modalityId: string, date: Date): Promise<any[]>;
    rescheduleStudy(studyId: string, newScheduleData: any): Promise<any>;
    cancelSchedule(studyId: string, reason: string): Promise<any>;
    getScheduleByDate(date: Date, modalityId?: string): Promise<any[]>;
    getScheduleStats(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
    private checkSchedulingConflicts;
    private getOperatingHours;
    private calculateTotalSlots;
    updateScheduleStatus(scheduleId: string, status: string): Promise<any>;
}
