import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './services/sms.service';
import { EmailService } from './services/email.service';
import { WhatsAppService } from './services/whatsapp.service';
import { IvrService } from './services/ivr.service';
import { NotificationTemplateService } from './services/template.service';
import { NotificationThreadService } from './services/thread.service';
import { NotificationSchedulerService } from './services/scheduler.service';
import { CreateNotificationDto, UpdateNotificationDto, BulkNotificationDto } from './dto/notification.dto';
export interface NotificationPayload {
    recipientId: string;
    tenantId: string;
    type: string;
    title: string;
    message: string;
    channels: string[];
    data?: any;
    scheduledAt?: Date;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
export declare class NotificationsService {
    private readonly prisma;
    private readonly smsService;
    private readonly emailService;
    private readonly whatsAppService;
    private readonly ivrService;
    private readonly templateService;
    private readonly threadService;
    private readonly schedulerService;
    private readonly logger;
    constructor(prisma: PrismaService, smsService: SmsService, emailService: EmailService, whatsAppService: WhatsAppService, ivrService: IvrService, templateService: NotificationTemplateService, threadService: NotificationThreadService, schedulerService: NotificationSchedulerService);
    createNotification(createDto: CreateNotificationDto, user: any): Promise<any>;
    updateNotification(id: string, updateDto: UpdateNotificationDto, user: any): Promise<any>;
    deleteNotification(id: string, user: any): Promise<void>;
    getNotification(id: string, user: any): Promise<any>;
    sendBulkNotification(bulkDto: BulkNotificationDto, user: any): Promise<{
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
    processNotification(notificationId: string): Promise<({
        channel: any;
        success: boolean;
        result: {
            success: boolean;
            messageId: string;
            provider: string;
            to: any;
            status: string;
        } | {
            success: boolean;
            callId: string;
            provider: string;
            to: any;
            status: string;
            duration: number;
        };
        error?: undefined;
    } | {
        channel: any;
        success: boolean;
        error: any;
        result?: undefined;
    })[]>;
    sendSms(smsDto: any, user: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: string;
        status: string;
    }>;
    sendEmail(emailDto: any, user: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    sendWhatsApp(whatsappDto: any, user: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    makeIvrCall(ivrDto: any, user: any): Promise<{
        success: boolean;
        callId: string;
        provider: string;
        to: any;
        status: string;
        duration: number;
    }>;
    getNotificationPreferences(userId: string, currentUser: any): Promise<any>;
    updateNotificationPreferences(userId: string, preferencesDto: any, currentUser: any): Promise<any>;
    getNotificationSummary(query: any, user: any): Promise<{
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
    getDeliveryReport(query: any, user: any): Promise<{
        summary: any;
        deliveries: any;
    }>;
    getChannelPerformance(query: any, user: any): Promise<{}>;
    testSms(testDto: any, user: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: string;
        status: string;
    }>;
    testEmail(testDto: any, user: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    testWhatsApp(testDto: any, user: any): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    sendNotification(payload: NotificationPayload): Promise<any>;
    markAsRead(notificationId: string, userId: string): Promise<any>;
    sendAppointmentReminder(appointmentId: string, tenantId: string): Promise<void>;
}
