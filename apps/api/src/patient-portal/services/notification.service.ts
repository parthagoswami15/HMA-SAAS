import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getNotifications(query: any, user: any) {
    this.logger.log(`Getting notifications for user: ${user.id}`);

    const {
      type,
      status,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
    } = query;

    const where: any = { userId: user.id };
    if (type) where.type = type;
    if (status) where.status = status;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const notifications = await this.prisma.patientNotification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.patientNotification.count({ where });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(notificationId: string, user: any) {
    this.logger.log(`Marking notification as read: ${notificationId}`);

    const notification = await this.prisma.patientNotification.findFirst({
      where: {
        id: notificationId,
        userId: user.id,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updatedNotification = await this.prisma.patientNotification.update({
      where: { id: notificationId },
      data: {
        status: 'READ',
        readAt: new Date(),
      },
    });

    return updatedNotification;
  }

  async markAllAsRead(user: any) {
    this.logger.log(`Marking all notifications as read for user: ${user.id}`);

    const updatedNotifications = await this.prisma.patientNotification.updateMany({
      where: {
        userId: user.id,
        status: 'UNREAD',
      },
      data: {
        status: 'READ',
        readAt: new Date(),
      },
    });

    return {
      updatedCount: updatedNotifications.count,
    };
  }

  async getUnreadCount(user: any) {
    this.logger.log(`Getting unread count for user: ${user.id}`);

    const unreadCount = await this.prisma.patientNotification.count({
      where: {
        userId: user.id,
        status: 'UNREAD',
      },
    });

    return { unreadCount };
  }

  async sendNotification(userId: string, notificationDto: any) {
    this.logger.log(`Sending notification to user: ${userId}`);

    const { type, title, message, priority = 'MEDIUM', metadata } = notificationDto;

    const notification = await this.prisma.patientNotification.create({
      data: {
        userId,
        type,
        title,
        message,
        priority,
        status: 'UNREAD',
        metadata: JSON.stringify(metadata || {}),
      },
    });

    // In production, send push notification or email
    await this.sendPushNotification(notification);

    return notification;
  }

  async getNotificationSettings(user: any) {
    this.logger.log(`Getting notification settings for user: ${user.id}`);

    const settings = await this.prisma.patientPreferences.findUnique({
      where: { userId: user.id },
    });

    if (!settings) {
      return {
        email: true,
        sms: true,
        push: true,
        appointmentReminders: true,
        reportUpdates: true,
        paymentReminders: true,
        marketingEmails: false,
      };
    }

    return settings.notifications;
  }

  async updateNotificationSettings(settingsDto: any, user: any) {
    this.logger.log(`Updating notification settings for user: ${user.id}`);

    const settings = await this.prisma.patientPreferences.upsert({
      where: { userId: user.id },
      update: {
        notifications: settingsDto,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        notifications: settingsDto,
      },
    });

    return settings.notifications;
  }

  async getNotificationStats(user: any) {
    const totalNotifications = await this.prisma.patientNotification.count({
      where: { userId: user.id },
    });

    const unreadNotifications = await this.prisma.patientNotification.count({
      where: {
        userId: user.id,
        status: 'UNREAD',
      },
    });

    const notificationsByType = await this.prisma.patientNotification.groupBy({
      by: ['type'],
      where: { userId: user.id },
      _count: { type: true },
    });

    const notificationsByStatus = await this.prisma.patientNotification.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: { status: true },
    });

    return {
      userId: user.id,
      totalNotifications,
      unreadNotifications,
      notificationsByType,
      notificationsByStatus,
    };
  }

  private async sendPushNotification(notification: any) {
    // In production, integrate with push notification service
    console.log(`Push notification sent: ${notification.title} - ${notification.message}`);
  }
}
