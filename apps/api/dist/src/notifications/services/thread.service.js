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
var NotificationThreadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationThreadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications.service");
let NotificationThreadService = NotificationThreadService_1 = class NotificationThreadService {
    prisma;
    notificationsService;
    logger = new common_1.Logger(NotificationThreadService_1.name);
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async createThread(threadDto, user) {
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
        if (threadDto.initialMessage) {
            await this.sendMessage(thread.id, {
                content: threadDto.initialMessage,
                messageType: 'TEXT',
                senderId: user.id,
            }, user);
        }
        return thread;
    }
    async getThreads(query, user) {
        const { status, type, priority, fromDate, toDate, page = '1', limit = '20' } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {
            tenantId: user.tenantId,
            participants: { has: user.id },
        };
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        if (priority)
            where.priority = priority;
        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate)
                where.createdAt.gte = new Date(fromDate);
            if (toDate)
                where.createdAt.lte = new Date(toDate);
        }
        const [threads, total] = await Promise.all([
            this.prisma.notificationThread.findMany({
                where,
                include: {
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
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
    async getThread(id, user) {
        const thread = await this.prisma.notificationThread.findUnique({
            where: { id },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        if (!thread.participants.includes(user.id)) {
            throw new common_1.BadRequestException('User is not a participant in this thread');
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
    async sendMessage(threadId, messageDto, user) {
        this.logger.log(`Sending message to thread ${threadId}`);
        const thread = await this.prisma.notificationThread.findUnique({
            where: { id: threadId },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        if (!thread.participants.includes(user.id)) {
            throw new common_1.BadRequestException('User is not a participant in this thread');
        }
        if (thread.status === 'CLOSED') {
            throw new common_1.BadRequestException('Cannot send messages to closed thread');
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
        await this.prisma.notificationThread.update({
            where: { id: threadId },
            data: { updatedAt: new Date() },
        });
        if (messageDto.messageType === 'NOTIFICATION') {
            await this.createNotificationFromMessage(message, thread, user);
        }
        return message;
    }
    async closeThread(id, user) {
        this.logger.log(`Closing thread ${id}`);
        const thread = await this.prisma.notificationThread.findUnique({
            where: { id },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        if (!thread.participants.includes(user.id)) {
            throw new common_1.BadRequestException('User is not a participant in this thread');
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
    async addParticipant(threadId, participantId, user) {
        this.logger.log(`Adding participant ${participantId} to thread ${threadId}`);
        const thread = await this.prisma.notificationThread.findUnique({
            where: { id: threadId },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        if (!thread.participants.includes(user.id)) {
            throw new common_1.BadRequestException('User is not a participant in this thread');
        }
        if (thread.participants.includes(participantId)) {
            throw new common_1.BadRequestException('User is already a participant');
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
    async removeParticipant(threadId, participantId, user) {
        this.logger.log(`Removing participant ${participantId} from thread ${threadId}`);
        const thread = await this.prisma.notificationThread.findUnique({
            where: { id: threadId },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        if (!thread.participants.includes(user.id)) {
            throw new common_1.BadRequestException('User is not a participant in this thread');
        }
        if (thread.createdBy === participantId) {
            throw new common_1.BadRequestException('Cannot remove thread creator');
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
    async markThreadAsRead(threadId, userId) {
        this.logger.log(`Marking thread ${threadId} as read for user ${userId}`);
        await this.prisma.threadMessage.updateMany({
            where: {
                threadId,
                senderId: { not: userId },
            },
            data: {
                readBy: {
                    push: userId,
                },
            },
        });
        return { success: true };
    }
    async getUnreadCount(userId) {
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
    async createNotificationFromMessage(message, thread, user) {
        for (const participantId of thread.participants) {
            if (participantId !== user.id) {
                await this.notificationsService.createNotification({
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
                }, user);
            }
        }
    }
    async searchThreads(query, user) {
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
};
exports.NotificationThreadService = NotificationThreadService;
exports.NotificationThreadService = NotificationThreadService = NotificationThreadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], NotificationThreadService);
//# sourceMappingURL=thread.service.js.map