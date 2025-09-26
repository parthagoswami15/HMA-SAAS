import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class NotificationService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    scheduleConsultationReminders(consultationId: string): Promise<void>;
    sendConsultationNotification(consultationId: string, notificationDto: any, user: any): Promise<{
        success: boolean;
        recipients: any;
    }>;
    notifyEmergencyConsultation(consultationId: string, doctorId: string): Promise<{
        success: boolean;
    }>;
    cancelConsultationNotifications(consultationId: string): Promise<{
        success: boolean;
    }>;
    sendPrescriptionNotification(prescriptionId: string, user: any): Promise<{
        success: boolean;
    }>;
    sendPaymentReminder(consultationId: string, user: any): Promise<{
        success: boolean;
    }>;
    sendFollowUpNotification(consultationId: string, user: any): Promise<{
        success: boolean;
    }>;
    private scheduleNotification;
    private sendNotification;
    getNotificationHistory(consultationId: string, user: any): Promise<any>;
    getScheduledNotifications(user: any): Promise<any>;
    cancelScheduledNotification(notificationId: string, user: any): Promise<{
        success: boolean;
    }>;
}
