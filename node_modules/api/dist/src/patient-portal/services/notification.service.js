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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let NotificationService = NotificationService_1 = class NotificationService {
    prisma;
    auditService;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getNotifications(query, user) {
        this.logger.log(`Getting notifications for user: ${user.id}`);
        const { type, status, fromDate, toDate, page = 1, limit = 20, } = query;
        const where = { userId: user.id };
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate)
                where.createdAt.gte = new Date(fromDate);
            if (toDate)
                where.createdAt.lte = new Date(toDate);
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
    async markAsRead(notificationId, user) {
        this.logger.log(`Marking notification as read: ${notificationId}`);
        const notification = await this.prisma.patientNotification.findFirst({
            where: {
                id: notificationId,
                userId: user.id,
            },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
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
    async markAllAsRead(user) {
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
    async getUnreadCount(user) {
        this.logger.log(`Getting unread count for user: ${user.id}`);
        const unreadCount = await this.prisma.patientNotification.count({
            where: {
                userId: user.id,
                status: 'UNREAD',
            },
        });
        return { unreadCount };
    }
    async sendNotification(userId, notificationDto) {
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
        await this.sendPushNotification(notification);
        return notification;
    }
    async getNotificationSettings(user) {
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
    async updateNotificationSettings(settingsDto, user) {
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
    async getNotificationStats(user) {
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
    async sendPushNotification(notification) {
        console.log(`Push notification sent: ${notification.title} - ${notification.message}`);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map