import { NotificationsService } from './notifications.service';
import { NotificationTemplateService } from './services/template.service';
import { NotificationThreadService } from './services/thread.service';
import { NotificationSchedulerService } from './services/scheduler.service';
import { CreateNotificationDto, UpdateNotificationDto, NotificationQueryDto, BulkNotificationDto } from './dto/notification.dto';
import { CreateTemplateDto, UpdateTemplateDto, TemplateQueryDto } from './dto/template.dto';
import { SendMessageDto, MessageThreadDto, ThreadQueryDto } from './dto/thread.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly templateService;
    private readonly threadService;
    private readonly schedulerService;
    constructor(notificationsService: NotificationsService, templateService: NotificationTemplateService, threadService: NotificationThreadService, schedulerService: NotificationSchedulerService);
    createNotification(createDto: CreateNotificationDto, req: any): Promise<any>;
    getNotifications(query: NotificationQueryDto, req: any): Promise<{
        notifications: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getNotification(id: string, req: any): Promise<any>;
    updateNotification(id: string, updateDto: UpdateNotificationDto, req: any): Promise<any>;
    deleteNotification(id: string, req: any): Promise<void>;
    sendBulkNotification(bulkDto: BulkNotificationDto, req: any): Promise<{
        totalRequested: number;
        successful: number;
        failed: number;
        results: {
            recipientId: string;
            status: string;
            notificationId: any;
        }[];
        errors: {
            recipientId: string;
            error: any;
        }[];
    }>;
    scheduleBulkNotification(bulkDto: BulkNotificationDto, req: any): Promise<{
        totalScheduled: number;
        notifications: any[];
    }>;
    createTemplate(createDto: CreateTemplateDto, req: any): Promise<any>;
    getTemplates(query: TemplateQueryDto, req: any): Promise<{
        templates: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getTemplate(id: string, req: any): Promise<any>;
    updateTemplate(id: string, updateDto: UpdateTemplateDto, req: any): Promise<any>;
    deleteTemplate(id: string, req: any): Promise<void>;
    createThread(threadDto: MessageThreadDto, req: any): Promise<any>;
    getThreads(query: ThreadQueryDto, req: any): Promise<{
        threads: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getThread(id: string, req: any): Promise<any>;
    sendMessage(threadId: string, messageDto: SendMessageDto, req: any): Promise<any>;
    closeThread(id: string, req: any): Promise<any>;
    sendSms(smsDto: any, req: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: string;
        status: string;
    }>;
    sendEmail(emailDto: any, req: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    sendWhatsApp(whatsappDto: any, req: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    makeIvrCall(ivrDto: any, req: any): Promise<{
        success: boolean;
        callId: string;
        provider: string;
        to: any;
        status: string;
        duration: number;
    }>;
    getNotificationPreferences(userId: string, req: any): Promise<any>;
    updateNotificationPreferences(userId: string, preferencesDto: any, req: any): Promise<any>;
    getNotificationSummary(query: any, req: any): Promise<{
        total: any;
        sent: any;
        failed: any;
        pending: any;
        scheduled: any;
        successRate: number;
        period: {
            from: any;
            to: any;
        };
    }>;
    getDeliveryReport(query: any, req: any): Promise<{
        summary: any;
        deliveries: any;
    }>;
    getChannelPerformance(query: any, req: any): Promise<{}>;
    getScheduledNotifications(query: any, req: any): Promise<{
        notifications: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    cancelScheduledNotification(id: string, req: any): Promise<any>;
    testSms(testDto: any, req: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: string;
        status: string;
    }>;
    testEmail(testDto: any, req: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    testWhatsApp(testDto: any, req: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
}
