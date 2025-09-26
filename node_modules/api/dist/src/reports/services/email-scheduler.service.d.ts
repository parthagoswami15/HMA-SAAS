import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReportSchedule } from '../entities/reports.entity';
import { ExportService } from './export.service';
import { EmailService } from '../../notifications/services/email.service';
export declare class EmailSchedulerService implements OnModuleInit, OnModuleDestroy {
    private readonly reportScheduleRepo;
    private readonly exportService;
    private readonly emailService;
    private readonly logger;
    private isRunning;
    constructor(reportScheduleRepo: Repository<ReportSchedule>, exportService: ExportService, emailService: EmailService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    processScheduledReports(): Promise<void>;
    private processSchedule;
    private prepareEmailContent;
    private sendScheduledReportEmail;
    private calculateNextRunAt;
    createSchedule(tenantId: string, reportId: string, userId: string, scheduleData: any): Promise<ReportSchedule>;
    updateSchedule(tenantId: string, scheduleId: string, userId: string, scheduleData: any): Promise<ReportSchedule>;
    deleteSchedule(tenantId: string, scheduleId: string): Promise<void>;
    getSchedulesByTenant(tenantId: string): Promise<ReportSchedule[]>;
    getSchedulesByUser(userId: string): Promise<ReportSchedule[]>;
    getFailedSchedules(): Promise<ReportSchedule[]>;
    triggerSchedule(scheduleId: string): Promise<void>;
}
