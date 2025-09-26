import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Not } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportSchedule } from '../entities/reports.entity';
import { ExportService } from './export.service';
import { EmailService } from '../../notifications/services/email.service';

@Injectable()
export class EmailSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailSchedulerService.name);
  private isRunning = false;

  constructor(
    @InjectRepository(ReportSchedule)
    private readonly reportScheduleRepo: Repository<ReportSchedule>,
    private readonly exportService: ExportService,
    private readonly emailService: EmailService,
  ) {}

  onModuleInit() {
    this.isRunning = true;
    this.logger.log('Email Scheduler Service started');
  }

  onModuleDestroy() {
    this.isRunning = false;
    this.logger.log('Email Scheduler Service stopped');
  }

  // Run every 5 minutes to check for scheduled reports
  @Cron('*/5 * * * *', {
    name: 'scheduled-reports',
    timeZone: 'Asia/Kolkata',
  })
  async processScheduledReports(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      this.logger.debug('Processing scheduled reports...');

      const now = new Date();
      const currentTime = now.toTimeString().substring(0, 5); // HH:mm format

      // Find schedules that are due to run
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
        } catch (error) {
          this.logger.error(`Failed to process schedule ${schedule.id}: ${error.message}`, error.stack);

          // Update schedule with error
          schedule.lastError = error.message;
          await this.reportScheduleRepo.save(schedule);
        }
      }
    } catch (error) {
      this.logger.error(`Error in scheduled reports processor: ${error.message}`, error.stack);
    }
  }

  private async processSchedule(schedule: ReportSchedule): Promise<void> {
    this.logger.log(`Processing schedule ${schedule.id} for report ${schedule.reportId}`);

    try {
      // Generate the report
      const { buffer, fileName, mimeType } = await this.exportService.generateScheduledReport(
        schedule.tenantId,
        schedule.reportId,
        schedule.id,
        schedule.format,
      );

      // Prepare email content
      const emailContent = this.prepareEmailContent(schedule, fileName);

      // Send email to recipients
      await this.sendScheduledReportEmail(schedule, emailContent, buffer, fileName, mimeType);

      // Update schedule
      schedule.lastRunAt = new Date();
      schedule.lastError = null;
      schedule.nextRunAt = this.calculateNextRunAt(schedule);

      await this.reportScheduleRepo.save(schedule);

      this.logger.log(`Successfully processed schedule ${schedule.id}`);
    } catch (error) {
      this.logger.error(`Error processing schedule ${schedule.id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private prepareEmailContent(schedule: ReportSchedule, fileName: string): any {
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

  private async sendScheduledReportEmail(
    schedule: ReportSchedule,
    emailContent: any,
    attachment: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<void> {
    const { recipients } = schedule;

    // Send to individual emails
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

    // Send to role-based recipients
    if (recipients.roles && recipients.roles.length > 0) {
      for (const role of recipients.roles) {
        // Get users with the specified role and send email
        // This would require integration with user management system
        this.logger.log(`Sending to role: ${role}`);
      }
    }

    // Send to department-based recipients
    if (recipients.departments && recipients.departments.length > 0) {
      for (const department of recipients.departments) {
        // Get users in the specified department and send email
        // This would require integration with user management system
        this.logger.log(`Sending to department: ${department}`);
      }
    }

    this.logger.log(`Email sent for schedule ${schedule.id} to ${recipients.emails?.length || 0} recipients`);
  }

  private calculateNextRunAt(schedule: ReportSchedule): Date {
    if (schedule.frequency === 'MANUAL') {
      return null;
    }

    const now = new Date();
    const [hours, minutes] = schedule.scheduledTime.split(':').map(Number);

    let nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    switch (schedule.frequency) {
      case 'DAILY':
        // Already set to next day if needed
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
          // If day is beyond current month, set to last day of month
          if (nextRun.getDate() !== schedule.dayOfMonth) {
            nextRun.setDate(0); // Last day of previous month
          }
        }
        break;
    }

    return nextRun;
  }

  async createSchedule(
    tenantId: string,
    reportId: string,
    userId: string,
    scheduleData: any,
  ): Promise<ReportSchedule> {
    // This would create a new schedule - implementation would be in ReportsService
    // For now, just a placeholder
    return null;
  }

  async updateSchedule(
    tenantId: string,
    scheduleId: string,
    userId: string,
    scheduleData: any,
  ): Promise<ReportSchedule> {
    // This would update an existing schedule
    return null;
  }

  async deleteSchedule(tenantId: string, scheduleId: string): Promise<void> {
    // This would delete a schedule
  }

  async getSchedulesByTenant(tenantId: string): Promise<ReportSchedule[]> {
    return this.reportScheduleRepo.find({
      where: { tenantId, isActive: true },
      relations: ['report'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSchedulesByUser(userId: string): Promise<ReportSchedule[]> {
    return this.reportScheduleRepo.find({
      where: { createdBy: userId, isActive: true },
      relations: ['report'],
      order: { createdAt: 'DESC' },
    });
  }

  async getFailedSchedules(): Promise<ReportSchedule[]> {
    return this.reportScheduleRepo.find({
      where: {
        isActive: true,
        lastError: Not(''),
      },
      relations: ['report'],
      order: { lastRunAt: 'DESC' },
    });
  }

  // Manual trigger for testing
  async triggerSchedule(scheduleId: string): Promise<void> {
    const schedule = await this.reportScheduleRepo.findOne({
      where: { id: scheduleId, isActive: true },
      relations: ['report'],
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    await this.processSchedule(schedule);
  }
}
