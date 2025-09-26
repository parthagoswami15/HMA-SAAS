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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const sms_service_1 = require("./services/sms.service");
const email_service_1 = require("./services/email.service");
const whatsapp_service_1 = require("./services/whatsapp.service");
const ivr_service_1 = require("./services/ivr.service");
const template_service_1 = require("./services/template.service");
const thread_service_1 = require("./services/thread.service");
const scheduler_service_1 = require("./services/scheduler.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    smsService;
    emailService;
    whatsAppService;
    ivrService;
    templateService;
    threadService;
    schedulerService;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(prisma, smsService, emailService, whatsAppService, ivrService, templateService, threadService, schedulerService) {
        this.prisma = prisma;
        this.smsService = smsService;
        this.emailService = emailService;
        this.whatsAppService = whatsAppService;
        this.ivrService = ivrService;
        this.templateService = templateService;
        this.threadService = threadService;
        this.schedulerService = schedulerService;
    }
    async createNotification(createDto, user) {
        this.logger.log(`Creating notification for user ${user.id}`);
        const recipient = await this.prisma.patient.findUnique({
            where: { id: createDto.recipientId },
        });
        if (!recipient) {
            throw new common_1.NotFoundException('Recipient not found');
        }
        const preferences = await this.getNotificationPreferences(createDto.recipientId, user);
        const allowedChannels = createDto.channels.filter(channel => preferences[channel.toLowerCase()] !== false);
        if (allowedChannels.length === 0) {
            throw new common_1.BadRequestException('No allowed channels for this recipient');
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
        if (!createDto.scheduledAt) {
            await this.processNotification(notification.id);
        }
        return notification;
    }
    async updateNotification(id, updateDto, user) {
        this.logger.log(`Updating notification ${id}`);
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.status === 'SENT') {
            throw new common_1.BadRequestException('Cannot update sent notification');
        }
        const updatedNotification = await this.prisma.notification.update({
            where: { id },
            data: {
                ...updateDto,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        if (updateDto.status === 'PENDING' && notification.status !== 'PENDING') {
            await this.processNotification(id);
        }
        return updatedNotification;
    }
    async deleteNotification(id, user) {
        this.logger.log(`Deleting notification ${id}`);
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.status === 'SCHEDULED') {
            await this.schedulerService.cancelScheduledNotification(id, user);
        }
        await this.prisma.notification.delete({
            where: { id },
        });
    }
    async getNotifications(query, user) {
        const { type, status, priority, fromDate, toDate, page = '1', limit = '20', } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {
            tenantId: user.tenantId,
        };
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (priority)
            where.priority = priority;
        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate)
                where.createdAt.gte = new Date(fromDate);
            if (toDate)
                where.createdAt.lte = new Date(toDate);
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
    async getNotification(id, user) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return notification;
    }
    async sendBulkNotification(bulkDto, user) {
        this.logger.log(`Sending bulk notification to ${bulkDto.recipientIds.length} recipients`);
        const results = [];
        const errors = [];
        for (const recipientId of bulkDto.recipientIds) {
            try {
                const notification = await this.createNotification({
                    ...bulkDto,
                    recipientId,
                }, user);
                results.push({ recipientId, status: 'SUCCESS', notificationId: notification.id });
            }
            catch (error) {
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
    async processNotification(notificationId) {
        const notification = await this.prisma.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        const results = [];
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
            }
            catch (error) {
                this.logger.error(`Failed to send ${channel} notification`, error);
                results.push({ channel, success: false, error: error.message });
            }
        }
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
    async sendSms(smsDto, user) {
        this.logger.log(`Sending SMS to ${smsDto.to}`);
        const result = await this.smsService.sendSms({
            to: smsDto.to,
            message: smsDto.message,
            priority: smsDto.priority || 'MEDIUM',
        });
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
    async sendEmail(emailDto, user) {
        this.logger.log(`Sending email to ${emailDto.to}`);
        const result = await this.emailService.sendEmail({
            to: emailDto.to,
            subject: emailDto.subject,
            html: emailDto.html,
            text: emailDto.text,
            priority: emailDto.priority || 'MEDIUM',
        });
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
    async sendWhatsApp(whatsappDto, user) {
        this.logger.log(`Sending WhatsApp to ${whatsappDto.to}`);
        const result = await this.whatsAppService.sendWhatsApp({
            to: whatsappDto.to,
            message: whatsappDto.message,
            mediaUrl: whatsappDto.mediaUrl,
            priority: whatsappDto.priority || 'MEDIUM',
        });
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
    async makeIvrCall(ivrDto, user) {
        this.logger.log(`Making IVR call to ${ivrDto.to}`);
        const result = await this.ivrService.makeCall({
            to: ivrDto.to,
            message: ivrDto.message,
            priority: ivrDto.priority || 'MEDIUM',
        });
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
    async getNotificationPreferences(userId, currentUser) {
        const preferences = await this.prisma.notificationPreference.findUnique({
            where: { userId },
        });
        if (!preferences) {
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
    async updateNotificationPreferences(userId, preferencesDto, currentUser) {
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
    async getNotificationSummary(query, user) {
        const { fromDate, toDate } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate)
            where.createdAt = { ...where.createdAt, gte: new Date(fromDate) };
        if (toDate)
            where.createdAt = { ...where.createdAt, lte: new Date(toDate) };
        const [totalNotifications, sentNotifications, failedNotifications, pendingNotifications, scheduledNotifications,] = await Promise.all([
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
    async getDeliveryReport(query, user) {
        const { fromDate, toDate, channel } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate)
            where.deliveredAt = { ...where.deliveredAt, gte: new Date(fromDate) };
        if (toDate)
            where.deliveredAt = { ...where.deliveredAt, lte: new Date(toDate) };
        if (channel)
            where.channel = channel;
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
        const summary = deliveries.reduce((acc, delivery) => {
            acc.total++;
            if (delivery.status === 'DELIVERED')
                acc.delivered++;
            if (delivery.status === 'FAILED')
                acc.failed++;
            if (delivery.status === 'PENDING')
                acc.pending++;
            if (!acc.byChannel[delivery.channel]) {
                acc.byChannel[delivery.channel] = { total: 0, delivered: 0, failed: 0, pending: 0 };
            }
            acc.byChannel[delivery.channel].total++;
            if (delivery.status === 'DELIVERED')
                acc.byChannel[delivery.channel].delivered++;
            if (delivery.status === 'FAILED')
                acc.byChannel[delivery.channel].failed++;
            if (delivery.status === 'PENDING')
                acc.byChannel[delivery.channel].pending++;
            return acc;
        }, { total: 0, delivered: 0, failed: 0, pending: 0, byChannel: {} });
        return {
            summary,
            deliveries,
        };
    }
    async getChannelPerformance(query, user) {
        const { fromDate, toDate } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate)
            where.deliveredAt = { ...where.deliveredAt, gte: new Date(fromDate) };
        if (toDate)
            where.deliveredAt = { ...where.deliveredAt, lte: new Date(toDate) };
        const channelStats = await this.prisma.notificationDelivery.groupBy({
            by: ['channel'],
            where,
            _count: { channel: true },
            _sum: { deliveredAt: null },
        });
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
                averageDeliveryTime: 'N/A',
            };
        }
        return performance;
    }
    async testSms(testDto, user) {
        return this.smsService.sendTestSms(testDto.to, testDto.message);
    }
    async testEmail(testDto, user) {
        return this.emailService.sendTestEmail(testDto.to, testDto.subject, testDto.html);
    }
    async testWhatsApp(testDto, user) {
        return this.whatsAppService.sendTestWhatsApp(testDto.to, testDto.message);
    }
    async sendNotification(payload) {
        return this.createNotification({
            recipientId: payload.recipientId,
            type: payload.type,
            title: payload.title,
            message: payload.message,
            channels: payload.channels,
            data: payload.data,
            scheduledAt: payload.scheduledAt,
            priority: payload.priority,
        }, { id: 'system', tenantId: payload.tenantId });
    }
    async getNotifications(userId, tenantId, limit = 20, offset = 0) {
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
    async markAsRead(notificationId, userId) {
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
    async sendAppointmentReminder(appointmentId, tenantId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: true,
            },
        });
        if (!appointment)
            return;
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
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        sms_service_1.SmsService,
        email_service_1.EmailService,
        whatsapp_service_1.WhatsAppService,
        ivr_service_1.IvrService,
        template_service_1.NotificationTemplateService,
        thread_service_1.NotificationThreadService,
        scheduler_service_1.NotificationSchedulerService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map