"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications.service");
const cron = __importStar(require("node-cron"));
let NotificationSchedulerService = NotificationSchedulerService_1 = class NotificationSchedulerService {
    prisma;
    notificationsService;
    logger = new common_1.Logger(NotificationSchedulerService_1.name);
    scheduledJobs = new Map();
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.initializeScheduledNotifications();
    }
    async scheduleNotification(scheduleDto, user) {
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
        await this.scheduleJob(notification.id, new Date(scheduleDto.scheduledAt));
        return notification;
    }
    async scheduleBulkNotification(bulkDto, user) {
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
        for (const notification of scheduledNotifications) {
            await this.scheduleJob(notification.id, new Date(bulkDto.scheduledAt));
        }
        return {
            totalScheduled: scheduledNotifications.length,
            notifications: scheduledNotifications,
        };
    }
    async cancelScheduledNotification(id, user) {
        this.logger.log(`Cancelling scheduled notification ${id}`);
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Scheduled notification not found');
        }
        if (notification.status !== 'SCHEDULED') {
            throw new common_1.BadRequestException('Notification is not scheduled');
        }
        this.cancelJob(id);
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
    async getScheduledNotifications(query, user) {
        const { fromDate, toDate, type, page = '1', limit = '20' } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {
            tenantId: user.tenantId,
            status: 'SCHEDULED',
        };
        if (type)
            where.type = type;
        if (fromDate || toDate) {
            where.scheduledAt = {};
            if (fromDate)
                where.scheduledAt.gte = new Date(fromDate);
            if (toDate)
                where.scheduledAt.lte = new Date(toDate);
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
    async rescheduleNotification(id, newScheduledAt, user) {
        this.logger.log(`Rescheduling notification ${id} to ${newScheduledAt}`);
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.status !== 'SCHEDULED') {
            throw new common_1.BadRequestException('Only scheduled notifications can be rescheduled');
        }
        this.cancelJob(id);
        const updatedNotification = await this.prisma.notification.update({
            where: { id },
            data: {
                scheduledAt: newScheduledAt,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.scheduleJob(id, newScheduledAt);
        return updatedNotification;
    }
    async getScheduledNotificationStats(user) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [totalScheduled, todayScheduled, tomorrowScheduled, overdueScheduled,] = await Promise.all([
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
    async scheduleJob(notificationId, scheduledAt) {
        this.cancelJob(notificationId);
        const delay = scheduledAt.getTime() - Date.now();
        if (delay <= 0) {
            await this.executeScheduledNotification(notificationId);
            return;
        }
        const job = cron.schedule(new Date(Date.now() + delay), async () => {
            await this.executeScheduledNotification(notificationId);
        }, { scheduled: false });
        this.scheduledJobs.set(notificationId, job);
        this.logger.log(`Scheduled notification ${notificationId} for ${scheduledAt}`);
    }
    cancelJob(notificationId) {
        const existingJob = this.scheduledJobs.get(notificationId);
        if (existingJob) {
            existingJob.stop();
            this.scheduledJobs.delete(notificationId);
            this.logger.log(`Cancelled scheduled job for notification ${notificationId}`);
        }
    }
    async executeScheduledNotification(notificationId) {
        try {
            this.logger.log(`Executing scheduled notification ${notificationId}`);
            this.scheduledJobs.delete(notificationId);
            await this.notificationsService.processNotification(notificationId);
        }
        catch (error) {
            this.logger.error(`Failed to execute scheduled notification ${notificationId}`, error);
            await this.prisma.notification.update({
                where: { id: notificationId },
                data: {
                    status: 'FAILED',
                    updatedAt: new Date(),
                },
            });
        }
    }
    async initializeScheduledNotifications() {
        this.logger.log('Initializing scheduled notifications');
        const scheduledNotifications = await this.prisma.notification.findMany({
            where: {
                status: 'SCHEDULED',
                scheduledAt: { lte: new Date() },
            },
        });
        for (const notification of scheduledNotifications) {
            await this.scheduleJob(notification.id, notification.scheduledAt);
        }
        this.logger.log(`Initialized ${scheduledNotifications.length} scheduled notifications`);
    }
    async cleanupCompletedJobs() {
        this.logger.log('Cleaning up completed scheduled jobs');
        const now = new Date();
        const completedJobs = [];
        for (const [notificationId, job] of this.scheduledJobs.entries()) {
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
};
exports.NotificationSchedulerService = NotificationSchedulerService;
exports.NotificationSchedulerService = NotificationSchedulerService = NotificationSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], NotificationSchedulerService);
//# sourceMappingURL=scheduler.service.js.map