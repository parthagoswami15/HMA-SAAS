import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications.service';
import * as cron from 'node-cron';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.initializeScheduledNotifications();
  }

  async scheduleNotification(scheduleDto: any, user: any) {
    this.logger.log(`Scheduling notification: ${scheduleDto.title}`);

    const notification = await this.prisma.notification.create({
      data: {
        recipientId: scheduleDto.recipientId,
        tenantId: user.tenantId,
        type: scheduleDto.type,
        title: scheduleDto.title,
        message: scheduleDto.message,
        channels: scheduleDto.channels,
        data: scheduleDto.data,
        scheduledAt: new Date(scheduleDto.scheduledAt),
        priority: scheduleDto.priority || 'MEDIUM',
        status: 'SCHEDULED',
        createdBy: user.id,
      },
    });

    // Schedule the job
    await this.scheduleJob(notification.id, new Date(scheduleDto.scheduledAt));

    return notification;
  }

  async scheduleBulkNotification(bulkDto: any, user: any) {
    this.logger.log(`Scheduling bulk notification to ${bulkDto.recipientIds.length} recipients`);

    const scheduledNotifications = [];

    for (const recipientId of bulkDto.recipientIds) {
      const notification = await this.prisma.notification.create({
        data: {
          recipientId,
          tenantId: user.tenantId,
          type: bulkDto.type,
          title: bulkDto.title,
          message: bulkDto.message,
          channels: bulkDto.channels,
          data: bulkDto.data,
          scheduledAt: new Date(bulkDto.scheduledAt),
          priority: bulkDto.priority || 'MEDIUM',
          status: 'SCHEDULED',
          createdBy: user.id,
        },
      });

      scheduledNotifications.push(notification);
    }

    // Schedule jobs for each notification
    for (const notification of scheduledNotifications) {
      await this.scheduleJob(notification.id, new Date(bulkDto.scheduledAt));
    }

    return {
      totalScheduled: scheduledNotifications.length,
      notifications: scheduledNotifications,
    };
  }

  async cancelScheduledNotification(id: string, user: any) {
    this.logger.log(`Cancelling scheduled notification ${id}`);

    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Scheduled notification not found');
    }

    if (notification.status !== 'SCHEDULED') {
      throw new BadRequestException('Notification is not scheduled');
    }

    // Cancel the job
    this.cancelJob(id);

    // Update notification status
    const updatedNotification = await this.prisma.notification.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    return updatedNotification;
  }

  async getScheduledNotifications(query: any, user: any) {
    const { fromDate, toDate, type, page = '1', limit = '20' } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      tenantId: user.tenantId,
      status: 'SCHEDULED',
    };

    if (type) where.type = type;
    if (fromDate || toDate) {
      where.scheduledAt = {};
      if (fromDate) where.scheduledAt.gte = new Date(fromDate);
      if (toDate) where.scheduledAt.lte = new Date(toDate);
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip,
        take: limitNum,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async rescheduleNotification(id: string, newScheduledAt: Date, user: any) {
    this.logger.log(`Rescheduling notification ${id} to ${newScheduledAt}`);

    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.status !== 'SCHEDULED') {
      throw new BadRequestException('Only scheduled notifications can be rescheduled');
    }

    // Cancel existing job
    this.cancelJob(id);

    // Update notification
    const updatedNotification = await this.prisma.notification.update({
      where: { id },
      data: {
        scheduledAt: newScheduledAt,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    // Schedule new job
    await this.scheduleJob(id, newScheduledAt);

    return updatedNotification;
  }

  async getScheduledNotificationStats(user: any) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalScheduled,
      todayScheduled,
      tomorrowScheduled,
      overdueScheduled,
    ] = await Promise.all([
      this.prisma.notification.count({
        where: {
          tenantId: user.tenantId,
          status: 'SCHEDULED',
        },
      }),
      this.prisma.notification.count({
        where: {
          tenantId: user.tenantId,
          status: 'SCHEDULED',
          scheduledAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      this.prisma.notification.count({
        where: {
          tenantId: user.tenantId,
          status: 'SCHEDULED',
          scheduledAt: {
            gte: tomorrow,
            lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.notification.count({
        where: {
          tenantId: user.tenantId,
          status: 'SCHEDULED',
          scheduledAt: { lt: now },
        },
      }),
    ]);

    return {
      totalScheduled,
      todayScheduled,
      tomorrowScheduled,
      overdueScheduled,
    };
  }

  private async scheduleJob(notificationId: string, scheduledAt: Date) {
    // Cancel existing job if any
    this.cancelJob(notificationId);

    const delay = scheduledAt.getTime() - Date.now();

    if (delay <= 0) {
      // If scheduled time has passed, execute immediately
      await this.executeScheduledNotification(notificationId);
      return;
    }

    // Schedule the job
    const job = cron.schedule(
      new Date(Date.now() + delay),
      async () => {
        await this.executeScheduledNotification(notificationId);
      },
      { scheduled: false }
    );

    this.scheduledJobs.set(notificationId, job);

    this.logger.log(`Scheduled notification ${notificationId} for ${scheduledAt}`);
  }

  private cancelJob(notificationId: string) {
    const existingJob = this.scheduledJobs.get(notificationId);
    if (existingJob) {
      existingJob.stop();
      this.scheduledJobs.delete(notificationId);
      this.logger.log(`Cancelled scheduled job for notification ${notificationId}`);
    }
  }

  private async executeScheduledNotification(notificationId: string) {
    try {
      this.logger.log(`Executing scheduled notification ${notificationId}`);

      // Remove from scheduled jobs
      this.scheduledJobs.delete(notificationId);

      // Process the notification
      await this.notificationsService.processNotification(notificationId);

    } catch (error) {
      this.logger.error(`Failed to execute scheduled notification ${notificationId}`, error);

      // Update notification status to failed
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'FAILED',
          updatedAt: new Date(),
        },
      });
    }
  }

  private async initializeScheduledNotifications() {
    this.logger.log('Initializing scheduled notifications');

    // Get all scheduled notifications that haven't been processed
    const scheduledNotifications = await this.prisma.notification.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: { lte: new Date() },
      },
    });

    for (const notification of scheduledNotifications) {
      await this.scheduleJob(notification.id, notification.scheduledAt!);
    }

    this.logger.log(`Initialized ${scheduledNotifications.length} scheduled notifications`);
  }

  async cleanupCompletedJobs() {
    this.logger.log('Cleaning up completed scheduled jobs');

    const now = new Date();
    const completedJobs = [];

    for (const [notificationId, job] of this.scheduledJobs.entries()) {
      // Check if job has been executed (you might need to track this differently)
      // For now, we'll clean up jobs that are scheduled for more than 24 hours ago
      const scheduledAt = job.scheduledAt;
      if (scheduledAt && (now.getTime() - scheduledAt.getTime() > 24 * 60 * 60 * 1000)) {
        job.stop();
        completedJobs.push(notificationId);
      }
    }

    for (const notificationId of completedJobs) {
      this.scheduledJobs.delete(notificationId);
    }

    this.logger.log(`Cleaned up ${completedJobs.length} completed jobs`);
  }

  async getScheduledJobsStatus() {
    return {
      totalScheduled: this.scheduledJobs.size,
      jobs: Array.from(this.scheduledJobs.entries()).map(([id, job]) => ({
        notificationId: id,
        scheduledAt: job.scheduledAt,
        running: job.running,
      })),
    };
  }
}
