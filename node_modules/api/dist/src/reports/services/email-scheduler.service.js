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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EmailSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const reports_entity_1 = require("../entities/reports.entity");
const export_service_1 = require("./export.service");
const email_service_1 = require("../../notifications/services/email.service");
let EmailSchedulerService = EmailSchedulerService_1 = class EmailSchedulerService {
    reportScheduleRepo;
    exportService;
    emailService;
    logger = new common_1.Logger(EmailSchedulerService_1.name);
    isRunning = false;
    constructor(reportScheduleRepo, exportService, emailService) {
        this.reportScheduleRepo = reportScheduleRepo;
        this.exportService = exportService;
        this.emailService = emailService;
    }
    onModuleInit() {
        this.isRunning = true;
        this.logger.log('Email Scheduler Service started');
    }
    onModuleDestroy() {
        this.isRunning = false;
        this.logger.log('Email Scheduler Service stopped');
    }
    async processScheduledReports() {
        if (!this.isRunning) {
            return;
        }
        try {
            this.logger.debug('Processing scheduled reports...');
            const now = new Date();
            const currentTime = now.toTimeString().substring(0, 5);
            const dueSchedules = await this.reportScheduleRepo
                .createQueryBuilder('schedule')
                .leftJoinAndSelect('schedule.report', 'report')
                .where('schedule.isActive = :isActive', { isActive: true })
                .andWhere('schedule.nextRunAt <= :now', { now })
                .andWhere('(schedule.lastRunAt IS NULL OR schedule.lastRunAt < :today)', {
                today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            })
                .getMany();
            this.logger.log(`Found ${dueSchedules.length} scheduled reports to process`);
            for (const schedule of dueSchedules) {
                try {
                    await this.processSchedule(schedule);
                }
                catch (error) {
                    this.logger.error(`Failed to process schedule ${schedule.id}: ${error.message}`, error.stack);
                    schedule.lastError = error.message;
                    await this.reportScheduleRepo.save(schedule);
                }
            }
        }
        catch (error) {
            this.logger.error(`Error in scheduled reports processor: ${error.message}`, error.stack);
        }
    }
    async processSchedule(schedule) {
        this.logger.log(`Processing schedule ${schedule.id} for report ${schedule.reportId}`);
        try {
            const { buffer, fileName, mimeType } = await this.exportService.generateScheduledReport(schedule.tenantId, schedule.reportId, schedule.id, schedule.format);
            const emailContent = this.prepareEmailContent(schedule, fileName);
            await this.sendScheduledReportEmail(schedule, emailContent, buffer, fileName, mimeType);
            schedule.lastRunAt = new Date();
            schedule.lastError = null;
            schedule.nextRunAt = this.calculateNextRunAt(schedule);
            await this.reportScheduleRepo.save(schedule);
            this.logger.log(`Successfully processed schedule ${schedule.id}`);
        }
        catch (error) {
            this.logger.error(`Error processing schedule ${schedule.id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    prepareEmailContent(schedule, fileName) {
        const reportName = schedule.report.name;
        const currentDate = new Date().toLocaleDateString();
        return {
            subject: `Scheduled Report: ${reportName} - ${currentDate}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Scheduled Report</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">${reportName}</h3>
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Report Type:</strong> ${schedule.report.category}</p>
            <p><strong>Format:</strong> ${schedule.format}</p>
          </div>
          <div style="margin: 20px 0;">
            <p>Dear User,</p>
            <p>Please find attached your scheduled report for ${reportName}.</p>
            <p>This report was automatically generated based on your scheduled configuration.</p>
          </div>
          <div style="margin: 20px 0; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p><strong>Report Details:</strong></p>
            <ul>
              <li><strong>File:</strong> ${fileName}</p>
              <li><strong>Generated:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>Schedule:</strong> ${schedule.frequency}</li>
              ${schedule.frequency !== 'MANUAL' ? `<li><strong>Next Run:</strong> ${schedule.nextRunAt?.toLocaleString() || 'Not scheduled'}</li>` : ''}
            </ul>
          </div>
          <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
            <p><strong>Note:</strong> This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `,
            text: `
        Scheduled Report: ${reportName} - ${currentDate}

        Dear User,

        Please find attached your scheduled report for ${reportName}.

        This report was automatically generated based on your scheduled configuration.

        Report Details:
        - File: ${fileName}
        - Generated: ${new Date().toLocaleString()}
        - Schedule: ${schedule.frequency}
        ${schedule.frequency !== 'MANUAL' ? `- Next Run: ${schedule.nextRunAt?.toLocaleString() || 'Not scheduled'}` : ''}

        Note: This is an automated email. Please do not reply to this message.
      `,
        };
    }
    async sendScheduledReportEmail(schedule, emailContent, attachment, fileName, mimeType) {
        const { recipients } = schedule;
        if (recipients.emails && recipients.emails.length > 0) {
            for (const email of recipients.emails) {
                await this.emailService.sendEmail({
                    to: email,
                    subject: emailContent.subject,
                    html: emailContent.html,
                    text: emailContent.text,
                    attachments: [{
                            filename: fileName,
                            content: attachment,
                            contentType: mimeType,
                        }],
                });
            }
        }
        if (recipients.roles && recipients.roles.length > 0) {
            for (const role of recipients.roles) {
                this.logger.log(`Sending to role: ${role}`);
            }
        }
        if (recipients.departments && recipients.departments.length > 0) {
            for (const department of recipients.departments) {
                this.logger.log(`Sending to department: ${department}`);
            }
        }
        this.logger.log(`Email sent for schedule ${schedule.id} to ${recipients.emails?.length || 0} recipients`);
    }
    calculateNextRunAt(schedule) {
        if (schedule.frequency === 'MANUAL') {
            return null;
        }
        const now = new Date();
        const [hours, minutes] = schedule.scheduledTime.split(':').map(Number);
        let nextRun = new Date(now);
        nextRun.setHours(hours, minutes, 0, 0);
        if (nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 1);
        }
        switch (schedule.frequency) {
            case 'DAILY':
                break;
            case 'WEEKLY':
                const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
                const targetDay = daysOfWeek.indexOf(schedule.dayOfWeek);
                while (nextRun.getDay() !== targetDay) {
                    nextRun.setDate(nextRun.getDate() + 1);
                }
                break;
            case 'MONTHLY':
                if (schedule.dayOfMonth) {
                    nextRun.setDate(schedule.dayOfMonth);
                    if (nextRun.getDate() !== schedule.dayOfMonth) {
                        nextRun.setDate(0);
                    }
                }
                break;
        }
        return nextRun;
    }
    async createSchedule(tenantId, reportId, userId, scheduleData) {
        return null;
    }
    async updateSchedule(tenantId, scheduleId, userId, scheduleData) {
        return null;
    }
    async deleteSchedule(tenantId, scheduleId) {
    }
    async getSchedulesByTenant(tenantId) {
        return this.reportScheduleRepo.find({
            where: { tenantId, isActive: true },
            relations: ['report'],
            order: { createdAt: 'DESC' },
        });
    }
    async getSchedulesByUser(userId) {
        return this.reportScheduleRepo.find({
            where: { createdBy: userId, isActive: true },
            relations: ['report'],
            order: { createdAt: 'DESC' },
        });
    }
    async getFailedSchedules() {
        return this.reportScheduleRepo.find({
            where: {
                isActive: true,
                lastError: (0, typeorm_2.Not)(''),
            },
            relations: ['report'],
            order: { lastRunAt: 'DESC' },
        });
    }
    async triggerSchedule(scheduleId) {
        const schedule = await this.reportScheduleRepo.findOne({
            where: { id: scheduleId, isActive: true },
            relations: ['report'],
        });
        if (!schedule) {
            throw new Error('Schedule not found');
        }
        await this.processSchedule(schedule);
    }
};
exports.EmailSchedulerService = EmailSchedulerService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *', {
        name: 'scheduled-reports',
        timeZone: 'Asia/Kolkata',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmailSchedulerService.prototype, "processScheduledReports", null);
exports.EmailSchedulerService = EmailSchedulerService = EmailSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reports_entity_1.ReportSchedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        export_service_1.ExportService,
        email_service_1.EmailService])
], EmailSchedulerService);
//# sourceMappingURL=email-scheduler.service.js.map