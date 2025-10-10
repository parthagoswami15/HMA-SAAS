import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunicationsService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(createDto: any, tenantId: string, senderId: string) {
    const message = await this.prisma.message.create({
      data: { ...createDto, senderId, tenantId },
    });
    return { success: true, message: 'Message sent', data: message };
  }

  async getMessages(tenantId: string, userId: string, query: any) {
    const { page = 1, limit = 10 } = query;
    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: {
          tenantId,
          OR: [{ senderId: userId }, { recipientId: userId }],
        },
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.message.count({
        where: {
          tenantId,
          OR: [{ senderId: userId }, { recipientId: userId }],
        },
      }),
    ]);
    return {
      success: true,
      data: { items: messages, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } },
    };
  }

  async markAsRead(id: string, tenantId: string) {
    const message = await this.prisma.message.findFirst({ where: { id, tenantId } });
    if (!message) throw new NotFoundException('Message not found');
    const updated = await this.prisma.message.update({ where: { id }, data: { read: true } });
    return { success: true, message: 'Message marked as read', data: updated };
  }

  async createNotification(createDto: any, tenantId: string) {
    const notification = await this.prisma.notification.create({
      data: { ...createDto, tenantId },
    });
    return { success: true, message: 'Notification created', data: notification };
  }

  async getNotifications(tenantId: string, userId: string, query: any) {
    const { page = 1, limit = 10 } = query;
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { tenantId, userId },
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { tenantId, userId } }),
    ]);
    return {
      success: true,
      data: { items: notifications, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } },
    };
  }

  async markNotificationAsRead(id: string, tenantId: string) {
    const notification = await this.prisma.notification.findFirst({ where: { id, tenantId } });
    if (!notification) throw new NotFoundException('Notification not found');
    const updated = await this.prisma.notification.update({ where: { id }, data: { read: true } });
    return { success: true, message: 'Notification marked as read', data: updated };
  }

  async getStats(tenantId: string, userId: string) {
    const [unreadMessages, unreadNotifications] = await Promise.all([
      this.prisma.message.count({ where: { tenantId, recipientId: userId, read: false } }),
      this.prisma.notification.count({ where: { tenantId, userId, read: false } }),
    ]);
    return { success: true, data: { unreadMessages, unreadNotifications } };
  }
}
