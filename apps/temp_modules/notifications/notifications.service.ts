import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './services/sms.service';
import { EmailService } from './services/email.service';
import { WhatsAppService } from './services/whatsapp.service';
import { IvrService } from './services/ivr.service';
import { NotificationTemplateService } from './services/template.service';
import { NotificationThreadService } from './services/thread.service';
import { NotificationSchedulerService } from './services/scheduler.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationQueryDto,
  BulkNotificationDto,
} from './dto/notification.dto';

export interface NotificationPayload {
  recipientId: string;
  tenantId: string;
  type: string;
  title: string;
  message: string;
  channels: string[];
  data?: any;
  scheduledAt?: Date;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly whatsAppService: WhatsAppService,
    private readonly ivrService: IvrService,
    private readonly templateService: NotificationTemplateService,
    private readonly threadService: NotificationThreadService,
    private readonly schedulerService: NotificationSchedulerService,
  ) {}

  async createNotification(createDto: CreateNotificationDto, user: any) {
    this.logger.log(`Creating notification for user ${user.id}`);

    // Validate recipient exists
    const recipient = await this.prisma.patient.findUnique({
      where: { id: createDto.recipientId },
    });

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    // Check notification preferences
    const preferences = await this.getNotificationPreferences(createDto.recipientId, user);
    const allowedChannels = createDto.channels.filter(channel =>
      preferences[channel.toLowerCase()] !== false
    );

    if (allowedChannels.length === 0) {
      throw new BadRequestException('No allowed channels for this recipient');
    }

    const notification = await this.prisma.notification.create({
      data: {
        recipientId: createDto.recipientId,
        tenantId: user.tenantId,
        type: createDto.type,
        title: createDto.title,
        message: createDto.message,
        channels: allowedChannels,
        data: createDto.data,
        scheduledAt: createDto.scheduledAt,
        priority: createDto.priority || 'MEDIUM',
        status: createDto.scheduledAt ? 'SCHEDULED' : 'PENDING',
        createdBy: user.id,
      },
    });

    // Process immediately if not scheduled
    if (!createDto.scheduledAt) {
      await this.processNotification(notification.id);
    }

    return notification;
  }

  async updateNotification(id: string, updateDto: UpdateNotificationDto, user: any) {
    this.logger.log(`Updating notification ${id}`);

    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.status === 'SENT') {
      throw new BadRequestException('Cannot update sent notification');
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id },
      data: {
        ...updateDto,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    // Reprocess if status changed to pending
    if (updateDto.status === 'PENDING' && notification.status !== 'PENDING') {
      await this.processNotification(id);
    }

    return updatedNotification;
  }

  async deleteNotification(id: string, user: any) {
    this.logger.log(`Deleting notification ${id}`);

    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // Cancel if scheduled
    if (notification.status === 'SCHEDULED') {
      await this.schedulerService.cancelScheduledNotification(id, user);
    }

    await this.prisma.notification.delete({
      where: { id },
    });
  }

  async getNotifications(query: NotificationQueryDto, user: any) {
    const {
      type,
      status,
      priority,
      fromDate,
      toDate,
      page = '1',
      limit = '20',
    } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      tenantId: user.tenantId,
    };

    if (type) where.type = type;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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

  async getNotification(id: string, user: any) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async sendBulkNotification(bulkDto: BulkNotificationDto, user: any) {
    this.logger.log(`Sending bulk notification to ${bulkDto.recipientIds.length} recipients`);

    const results = [];
    const errors = [];

    for (const recipientId of bulkDto.recipientIds) {
      try {
        const notification = await this.createNotification(
          {
            ...bulkDto,
            recipientId,
          },
          user,
        );
        results.push({ recipientId, status: 'SUCCESS', notificationId: notification.id });
      } catch (error) {
        errors.push({ recipientId, error: error.message });
      }
    }

    return {
      totalRequested: bulkDto.recipientIds.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors,
    };
  }

  async processNotification(notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    const results = [];

    // Process each channel
    for (const channel of notification.channels) {
      try {
        let result;
        switch (channel) {
          case 'EMAIL':
            result = await this.sendEmail(notification);
            break;
          case 'SMS':
            result = await this.sendSms(notification);
            break;
          case 'WHATSAPP':
            result = await this.sendWhatsApp(notification);
            break;
          case 'IVR':
            result = await this.makeIvrCall(notification);
            break;
          default:
            throw new Error(`Unsupported channel: ${channel}`);
        }
        results.push({ channel, success: true, result });
      } catch (error) {
        this.logger.error(`Failed to send ${channel} notification`, error);
        results.push({ channel, success: false, error: error.message });
      }
    }

    // Update notification status
    const hasSuccess = results.some(r => r.success);
    const allSuccess = results.every(r => r.success);

    await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: allSuccess ? 'SENT' : hasSuccess ? 'PARTIAL' : 'FAILED',
        sentAt: hasSuccess ? new Date() : null,
        deliveryResults: JSON.stringify(results),
      },
    });

    return results;
  }

  async sendSms(smsDto: any, user: any) {
    this.logger.log(`Sending SMS to ${smsDto.to}`);

    const result = await this.smsService.sendSms({
      to: smsDto.to,
      message: smsDto.message,
      priority: smsDto.priority || 'MEDIUM',
    });

    // Log SMS delivery
    await this.prisma.notificationDelivery.create({
      data: {
        notificationId: smsDto.notificationId,
        channel: 'SMS',
        recipient: smsDto.to,
        status: result.success ? 'DELIVERED' : 'FAILED',
        providerMessageId: result.messageId,
        deliveredAt: result.success ? new Date() : null,
      },
    });

    return result;
  }

  async sendEmail(emailDto: any, user: any) {
    this.logger.log(`Sending email to ${emailDto.to}`);

    const result = await this.emailService.sendEmail({
      to: emailDto.to,
      subject: emailDto.subject,
      html: emailDto.html,
      text: emailDto.text,
      priority: emailDto.priority || 'MEDIUM',
    });

    // Log email delivery
    await this.prisma.notificationDelivery.create({
      data: {
        notificationId: emailDto.notificationId,
        channel: 'EMAIL',
        recipient: emailDto.to,
        status: result.success ? 'DELIVERED' : 'FAILED',
        providerMessageId: result.messageId,
        deliveredAt: result.success ? new Date() : null,
      },
    });

    return result;
  }

  async sendWhatsApp(whatsappDto: any, user: any) {
    this.logger.log(`Sending WhatsApp to ${whatsappDto.to}`);

    const result = await this.whatsAppService.sendWhatsApp({
      to: whatsappDto.to,
      message: whatsappDto.message,
      mediaUrl: whatsappDto.mediaUrl,
      priority: whatsappDto.priority || 'MEDIUM',
    });

    // Log WhatsApp delivery
    await this.prisma.notificationDelivery.create({
      data: {
        notificationId: whatsappDto.notificationId,
        channel: 'WHATSAPP',
        recipient: whatsappDto.to,
        status: result.success ? 'DELIVERED' : 'FAILED',
        providerMessageId: result.messageId,
        deliveredAt: result.success ? new Date() : null,
      },
    });

    return result;
  }

  async makeIvrCall(ivrDto: any, user: any) {
    this.logger.log(`Making IVR call to ${ivrDto.to}`);

    const result = await this.ivrService.makeCall({
      to: ivrDto.to,
      message: ivrDto.message,
      priority: ivrDto.priority || 'MEDIUM',
    });

    // Log IVR delivery
    await this.prisma.notificationDelivery.create({
      data: {
        notificationId: ivrDto.notificationId,
        channel: 'IVR',
        recipient: ivrDto.to,
        status: result.success ? 'DELIVERED' : 'FAILED',
        providerMessageId: result.callId,
        deliveredAt: result.success ? new Date() : null,
      },
    });

    return result;
  }

  async getNotificationPreferences(userId: string, currentUser: any) {
    const preferences = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // Return default preferences
      return {
        sms: true,
        email: true,
        whatsapp: true,
        ivr: false,
        inApp: true,
        push: true,
        quietHours: { start: '22:00', end: '08:00' },
        language: 'en',
      };
    }

    return preferences.preferences;
  }

  async updateNotificationPreferences(userId: string, preferencesDto: any, currentUser: any) {
    const preferences = await this.prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        preferences: preferencesDto,
        updatedBy: currentUser.id,
        updatedAt: new Date(),
      },
      create: {
        userId,
        preferences: preferencesDto,
        createdBy: currentUser.id,
      },
    });

    return preferences;
  }

  async getNotificationSummary(query: any, user: any) {
    const { fromDate, toDate } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate) where.createdAt = { ...where.createdAt, gte: new Date(fromDate) };
    if (toDate) where.createdAt = { ...where.createdAt, lte: new Date(toDate) };

    const [
      totalNotifications,
      sentNotifications,
      failedNotifications,
      pendingNotifications,
      scheduledNotifications,
    ] = await Promise.all([
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { ...where, status: 'SENT' } }),
      this.prisma.notification.count({ where: { ...where, status: 'FAILED' } }),
      this.prisma.notification.count({ where: { ...where, status: 'PENDING' } }),
      this.prisma.notification.count({ where: { ...where, status: 'SCHEDULED' } }),
    ]);

    return {
      total: totalNotifications,
      sent: sentNotifications,
      failed: failedNotifications,
      pending: pendingNotifications,
      scheduled: scheduledNotifications,
      successRate: totalNotifications > 0 ? (sentNotifications / totalNotifications) * 100 : 0,
      period: { from: fromDate, to: toDate },
    };
  }

  async getDeliveryReport(query: any, user: any) {
    const { fromDate, toDate, channel } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate) where.deliveredAt = { ...where.deliveredAt, gte: new Date(fromDate) };
    if (toDate) where.deliveredAt = { ...where.deliveredAt, lte: new Date(toDate) };
    if (channel) where.channel = channel;

    const deliveries = await this.prisma.notificationDelivery.findMany({
      where,
      include: {
        notification: {
          select: {
            type: true,
            title: true,
            createdAt: true,
          },
        },
      },
      orderBy: { deliveredAt: 'desc' },
    });

    const summary = deliveries.reduce(
      (acc, delivery) => {
        acc.total++;
        if (delivery.status === 'DELIVERED') acc.delivered++;
        if (delivery.status === 'FAILED') acc.failed++;
        if (delivery.status === 'PENDING') acc.pending++;

        if (!acc.byChannel[delivery.channel]) {
          acc.byChannel[delivery.channel] = { total: 0, delivered: 0, failed: 0, pending: 0 };
        }
        acc.byChannel[delivery.channel].total++;
        if (delivery.status === 'DELIVERED') acc.byChannel[delivery.channel].delivered++;
        if (delivery.status === 'FAILED') acc.byChannel[delivery.channel].failed++;
        if (delivery.status === 'PENDING') acc.byChannel[delivery.channel].pending++;

        return acc;
      },
      { total: 0, delivered: 0, failed: 0, pending: 0, byChannel: {} },
    );

    return {
      summary,
      deliveries,
    };
  }

  async getChannelPerformance(query: any, user: any) {
    const { fromDate, toDate } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate) where.deliveredAt = { ...where.deliveredAt, gte: new Date(fromDate) };
    if (toDate) where.deliveredAt = { ...where.deliveredAt, lte: new Date(toDate) };

    const channelStats = await this.prisma.notificationDelivery.groupBy({
      by: ['channel'],
      where,
      _count: { channel: true },
      _sum: { deliveredAt: null }, // This would need proper aggregation
    });

    // Calculate success rates
    const performance = {};
    for (const stat of channelStats) {
      const total = await this.prisma.notificationDelivery.count({
        where: { ...where, channel: stat.channel },
      });
      const delivered = await this.prisma.notificationDelivery.count({
        where: { ...where, channel: stat.channel, status: 'DELIVERED' },
      });

      performance[stat.channel] = {
        total,
        delivered,
        successRate: total > 0 ? (delivered / total) * 100 : 0,
        averageDeliveryTime: 'N/A', // Would need more complex calculation
      };
    }

    return performance;
  }

  async testSms(testDto: any, user: any) {
    return this.smsService.sendTestSms(testDto.to, testDto.message);
  }

  async testEmail(testDto: any, user: any) {
    return this.emailService.sendTestEmail(testDto.to, testDto.subject, testDto.html);
  }

  async testWhatsApp(testDto: any, user: any) {
    return this.whatsAppService.sendTestWhatsApp(testDto.to, testDto.message);
  }

  // Legacy methods for backward compatibility
  async sendNotification(payload: NotificationPayload) {
    return this.createNotification(
      {
        recipientId: payload.recipientId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        channels: payload.channels,
        data: payload.data,
        scheduledAt: payload.scheduledAt,
        priority: payload.priority,
      },
      { id: 'system', tenantId: payload.tenantId },
    );
  }

  async getNotifications(userId: string, tenantId: string, limit = 20, offset = 0) {
    return this.prisma.notification.findMany({
      where: {
        recipientId: userId,
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.update({
      where: {
        id: notificationId,
        recipientId: userId,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  async sendAppointmentReminder(appointmentId: string, tenantId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
      },
    });

    if (!appointment) return;

    await this.sendNotification({
      recipientId: appointment.patientId,
      tenantId,
      type: 'APPOINTMENT_REMINDER',
      title: 'Appointment Reminder',
      message: `You have an upcoming appointment on ${appointment.startsAt.toLocaleDateString()}.`,
      channels: ['EMAIL', 'SMS', 'IN_APP'],
      data: { appointmentId },
      priority: 'HIGH',
    });
  }
}


