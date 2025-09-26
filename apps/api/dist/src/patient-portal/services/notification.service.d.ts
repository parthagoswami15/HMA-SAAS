import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class NotificationService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getNotifications(query: any, user: any): Promise<{
        notifications: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    markAsRead(notificationId: string, user: any): Promise<any>;
    markAllAsRead(user: any): Promise<{
        updatedCount: any;
    }>;
    getUnreadCount(user: any): Promise<{
        unreadCount: any;
    }>;
    sendNotification(userId: string, notificationDto: any): Promise<any>;
    getNotificationSettings(user: any): Promise<any>;
    updateNotificationSettings(settingsDto: any, user: any): Promise<any>;
    getNotificationStats(user: any): Promise<{
        userId: any;
        totalNotifications: any;
        unreadNotifications: any;
        notificationsByType: any;
        notificationsByStatus: any;
    }>;
    private sendPushNotification;
}
