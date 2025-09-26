import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class NotificationThreadService {
  private readonly logger = new Logger(NotificationThreadService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createThread(threadDto: any, user: any) {
    this.logger.log(`Creating notification thread for user ${user.id}`);

    const thread = await this.prisma.notificationThread.create({
      data: {
        subject: threadDto.subject,
        type: threadDto.type,
        priority: threadDto.priority || 'MEDIUM',
        status: 'OPEN',
        participants: threadDto.participants,
        createdBy: user.id,
        tenantId: user.tenantId,
      },
    });

    // Send initial message if provided
    if (threadDto.initialMessage) {
      await this.sendMessage(thread.id, {
        content: threadDto.initialMessage,
        messageType: 'TEXT',
        senderId: user.id,
      }, user);
    }

    return thread;
  }

  async getThreads(query: any, user: any) {
    const { status, type, priority, fromDate, toDate, page = '1', limit = '20' } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      tenantId: user.tenantId,
      participants: { has: user.id },
    };

    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const [threads, total] = await Promise.all([
      this.prisma.notificationThread.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Get latest message
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.notificationThread.count({ where }),
    ]);

    return {
      threads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async getThread(id: string, user: any) {
    const thread = await this.prisma.notificationThread.findUnique({
      where: { id },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    // Check if user is a participant
    if (!thread.participants.includes(user.id)) {
      throw new BadRequestException('User is not a participant in this thread');
    }

    const messages = await this.prisma.threadMessage.findMany({
      where: { threadId: id },
      orderBy: { createdAt: 'asc' },
    });

    return {
      ...thread,
      messages,
    };
  }

  async sendMessage(threadId: string, messageDto: any, user: any) {
    this.logger.log(`Sending message to thread ${threadId}`);

    const thread = await this.prisma.notificationThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (!thread.participants.includes(user.id)) {
      throw new BadRequestException('User is not a participant in this thread');
    }

    if (thread.status === 'CLOSED') {
      throw new BadRequestException('Cannot send messages to closed thread');
    }

    const message = await this.prisma.threadMessage.create({
      data: {
        threadId,
        content: messageDto.content,
        messageType: messageDto.messageType || 'TEXT',
        senderId: user.id,
        metadata: messageDto.metadata,
      },
    });

    // Update thread's updatedAt timestamp
    await this.prisma.notificationThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    });

    // If message contains actionable content, create notifications
    if (messageDto.messageType === 'NOTIFICATION') {
      await this.createNotificationFromMessage(message, thread, user);
    }

    return message;
  }

  async closeThread(id: string, user: any) {
    this.logger.log(`Closing thread ${id}`);

    const thread = await this.prisma.notificationThread.findUnique({
      where: { id },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (!thread.participants.includes(user.id)) {
      throw new BadRequestException('User is not a participant in this thread');
    }

    const updatedThread = await this.prisma.notificationThread.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedBy: user.id,
        closedAt: new Date(),
      },
    });

    return updatedThread;
  }

  async addParticipant(threadId: string, participantId: string, user: any) {
    this.logger.log(`Adding participant ${participantId} to thread ${threadId}`);

    const thread = await this.prisma.notificationThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (!thread.participants.includes(user.id)) {
      throw new BadRequestException('User is not a participant in this thread');
    }

    if (thread.participants.includes(participantId)) {
      throw new BadRequestException('User is already a participant');
    }

    const updatedParticipants = [...thread.participants, participantId];

    const updatedThread = await this.prisma.notificationThread.update({
      where: { id: threadId },
      data: {
        participants: updatedParticipants,
      },
    });

    return updatedThread;
  }

  async removeParticipant(threadId: string, participantId: string, user: any) {
    this.logger.log(`Removing participant ${participantId} from thread ${threadId}`);

    const thread = await this.prisma.notificationThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (!thread.participants.includes(user.id)) {
      throw new BadRequestException('User is not a participant in this thread');
    }

    if (thread.createdBy === participantId) {
      throw new BadRequestException('Cannot remove thread creator');
    }

    const updatedParticipants = thread.participants.filter(p => p !== participantId);

    const updatedThread = await this.prisma.notificationThread.update({
      where: { id: threadId },
      data: {
        participants: updatedParticipants,
      },
    });

    return updatedThread;
  }

  async markThreadAsRead(threadId: string, userId: string) {
    this.logger.log(`Marking thread ${threadId} as read for user ${userId}`);

    // Update all messages in thread as read by this user
    await this.prisma.threadMessage.updateMany({
      where: {
        threadId,
        senderId: { not: userId }, // Don't mark user's own messages as read
      },
      data: {
        readBy: {
          push: userId,
        },
      },
    });

    return { success: true };
  }

  async getUnreadCount(userId: string) {
    const unreadThreads = await this.prisma.notificationThread.count({
      where: {
        participants: { has: userId },
        status: 'OPEN',
        messages: {
          some: {
            senderId: { not: userId },
            readBy: { not: { has: userId } },
          },
        },
      },
    });

    return { unreadThreads };
  }

  private async createNotificationFromMessage(message: any, thread: any, user: any) {
    // Create a notification for thread participants (except sender)
    for (const participantId of thread.participants) {
      if (participantId !== user.id) {
        await this.notificationsService.createNotification(
          {
            recipientId: participantId,
            type: 'THREAD_MESSAGE',
            title: `New message in ${thread.subject}`,
            message: message.content,
            channels: ['IN_APP', 'EMAIL'],
            data: {
              threadId: thread.id,
              messageId: message.id,
              senderId: user.id,
            },
          },
          user,
        );
      }
    }
  }

  async searchThreads(query: string, user: any) {
    this.logger.log(`Searching threads for query: ${query}`);

    const threads = await this.prisma.notificationThread.findMany({
      where: {
        tenantId: user.tenantId,
        participants: { has: user.id },
        OR: [
          { subject: { contains: query, mode: 'insensitive' } },
          {
            messages: {
              some: {
                content: { contains: query, mode: 'insensitive' },
              },
            },
          },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return threads;
  }
}
