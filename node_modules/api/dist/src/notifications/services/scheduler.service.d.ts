import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications.service';
export declare class NotificationSchedulerService {
    private readonly prisma;
    private readonly notificationsService;
    private readonly logger;
    private scheduledJobs;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    scheduleNotification(scheduleDto: any, user: any): Promise<any>;
    scheduleBulkNotification(bulkDto: any, user: any): Promise<{
        totalScheduled: number;
        notifications: any[];
    }>;
    cancelScheduledNotification(id: string, user: any): Promise<any>;
    getScheduledNotifications(query: any, user: any): Promise<{
        notifications: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    rescheduleNotification(id: string, newScheduledAt: Date, user: any): Promise<any>;
    getScheduledNotificationStats(user: any): Promise<{
        totalScheduled: any;
        todayScheduled: any;
        tomorrowScheduled: any;
        overdueScheduled: any;
    }>;
    private scheduleJob;
    private cancelJob;
    private executeScheduledNotification;
    private initializeScheduledNotifications;
    cleanupCompletedJobs(): Promise<void>;
    getScheduledJobsStatus(): Promise<{
        totalScheduled: number;
        jobs: {
            notificationId: string;
            scheduledAt: any;
            running: any;
        }[];
    }>;
}
