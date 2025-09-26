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
    async scheduleConsultationReminders(consultationId) {
        this.logger.log(`Scheduling reminders for consultation ${consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
            include: {
                patient: { select: { id: true, name: true, phone: true, email: true } },
                doctor: { select: { id: true, name: true, phone: true, email: true } },
            },
        });
        if (!consultation) {
            throw new Error('Consultation not found');
        }
        if (consultation.scheduledAt > new Date(Date.now() + 24 * 60 * 60 * 1000)) {
            await this.scheduleNotification({
                consultationId,
                type: 'PRE_CONSULTATION_REMINDER',
                scheduledAt: new Date(consultation.scheduledAt.getTime() - 24 * 60 * 60 * 1000),
                message: `Reminder: You have a telemedicine consultation scheduled for tomorrow at ${consultation.scheduledAt.toLocaleTimeString()}`,
                channels: ['SMS', 'EMAIL', 'PUSH'],
                recipients: [consultation.patientId, consultation.doctorId],
            });
        }
        await this.scheduleNotification({
            consultationId,
            type: 'IMMEDIATE_REMINDER',
            scheduledAt: new Date(consultation.scheduledAt.getTime() - 60 * 60 * 1000),
            message: `Your telemedicine consultation starts in 1 hour at ${consultation.scheduledAt.toLocaleTimeString()}`,
            channels: ['SMS', 'EMAIL', 'PUSH'],
            recipients: [consultation.patientId, consultation.doctorId],
        });
        if (consultation.consultationType === 'FOLLOW_UP') {
            await this.scheduleNotification({
                consultationId,
                type: 'FOLLOW_UP_REMINDER',
                scheduledAt: new Date(consultation.scheduledAt.getTime() + 24 * 60 * 60 * 1000),
                message: 'Please remember to follow up on your telemedicine consultation as discussed.',
                channels: ['EMAIL'],
                recipients: [consultation.patientId],
            });
        }
    }
    async sendConsultationNotification(consultationId, notificationDto, user) {
        this.logger.log(`Sending consultation notification for ${consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
            include: {
                patient: { select: { id: true, name: true, phone: true, email: true } },
                doctor: { select: { id: true, name: true, phone: true, email: true } },
            },
        });
        if (!consultation) {
            throw new Error('Consultation not found');
        }
        const recipients = notificationDto.recipients || [consultation.patientId];
        const channels = notificationDto.channels || ['EMAIL'];
        for (const recipientId of recipients) {
            await this.sendNotification({
                consultationId,
                recipientId,
                type: notificationDto.type,
                message: notificationDto.message,
                channels,
                priority: notificationDto.priority || 'MEDIUM',
            });
        }
        await this.auditService.logActivity({
            action: 'CONSULTATION_NOTIFICATION_SENT',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: consultationId,
            userId: user.id,
            details: {
                type: notificationDto.type,
                recipients: recipients.length,
                channels,
            },
        });
        return { success: true, recipients: recipients.length };
    }
    async notifyEmergencyConsultation(consultationId, doctorId) {
        this.logger.log(`Notifying emergency consultation ${consultationId} to doctor ${doctorId}`);
        const doctor = await this.prisma.user.findUnique({
            where: { id: doctorId },
            select: { id: true, name: true, phone: true, email: true },
        });
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        await this.sendNotification({
            consultationId,
            recipientId: doctorId,
            type: 'EMERGENCY_CONSULTATION',
            message: 'Emergency telemedicine consultation requires your immediate attention.',
            channels: ['SMS', 'EMAIL', 'PUSH'],
            priority: 'URGENT',
        });
        return { success: true };
    }
    async cancelConsultationNotifications(consultationId) {
        this.logger.log(`Cancelling all notifications for consultation ${consultationId}`);
        await this.auditService.logActivity({
            action: 'CONSULTATION_NOTIFICATIONS_CANCELLED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: consultationId,
            details: { reason: 'Consultation cancelled' },
        });
        return { success: true };
    }
    async sendPrescriptionNotification(prescriptionId, user) {
        this.logger.log(`Sending prescription notification for ${prescriptionId}`);
        const prescription = await this.prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: {
                patient: { select: { id: true, name: true, phone: true, email: true } },
                doctor: { select: { id: true, name: true } },
            },
        });
        if (!prescription) {
            throw new Error('Prescription not found');
        }
        await this.sendNotification({
            consultationId: prescription.consultationId,
            recipientId: prescription.patientId,
            type: 'PRESCRIPTION_READY',
            message: 'Your prescription is ready and has been shared with you.',
            channels: ['SMS', 'EMAIL', 'PUSH'],
            priority: 'HIGH',
        });
        await this.auditService.logActivity({
            action: 'PRESCRIPTION_NOTIFICATION_SENT',
            entityType: 'PRESCRIPTION',
            entityId: prescriptionId,
            userId: user.id,
        });
        return { success: true };
    }
    async sendPaymentReminder(consultationId, user) {
        this.logger.log(`Sending payment reminder for consultation ${consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
            include: {
                patient: { select: { id: true, name: true, phone: true, email: true } },
            },
        });
        if (!consultation) {
            throw new Error('Consultation not found');
        }
        await this.sendNotification({
            consultationId,
            recipientId: consultation.patientId,
            type: 'PAYMENT_REMINDER',
            message: 'Payment for your telemedicine consultation is pending. Please complete the payment to access your records.',
            channels: ['SMS', 'EMAIL', 'PUSH'],
            priority: 'HIGH',
        });
        await this.auditService.logActivity({
            action: 'PAYMENT_REMINDER_SENT',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: consultationId,
            userId: user.id,
        });
        return { success: true };
    }
    async sendFollowUpNotification(consultationId, user) {
        this.logger.log(`Sending follow-up notification for consultation ${consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
            include: {
                patient: { select: { id: true, name: true, phone: true, email: true } },
            },
        });
        if (!consultation) {
            throw new Error('Consultation not found');
        }
        await this.sendNotification({
            consultationId,
            recipientId: consultation.patientId,
            type: 'FOLLOW_UP_REQUIRED',
            message: 'A follow-up consultation has been recommended. Please schedule at your earliest convenience.',
            channels: ['EMAIL', 'PUSH'],
            priority: 'MEDIUM',
        });
        await this.auditService.logActivity({
            action: 'FOLLOW_UP_NOTIFICATION_SENT',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: consultationId,
            userId: user.id,
        });
        return { success: true };
    }
    async scheduleNotification(notificationData) {
        for (const recipientId of notificationData.recipients) {
            await this.prisma.scheduledNotification.create({
                data: {
                    consultationId: notificationData.consultationId,
                    recipientId,
                    type: notificationData.type,
                    message: notificationData.message,
                    channels: notificationData.channels,
                    priority: notificationData.priority || 'MEDIUM',
                    scheduledAt: notificationData.scheduledAt,
                    status: 'SCHEDULED',
                },
            });
        }
        return { success: true };
    }
    async sendNotification(notificationData) {
        await this.prisma.consultationNotification.create({
            data: {
                consultationId: notificationData.consultationId,
                recipientId: notificationData.recipientId,
                type: notificationData.type,
                message: notificationData.message,
                channels: notificationData.channels,
                priority: notificationData.priority,
                status: 'SENT',
                sentAt: new Date(),
            },
        });
        return { success: true };
    }
    async getNotificationHistory(consultationId, user) {
        const notifications = await this.prisma.consultationNotification.findMany({
            where: { consultationId },
            orderBy: { createdAt: 'desc' },
        });
        return notifications;
    }
    async getScheduledNotifications(user) {
        const notifications = await this.prisma.scheduledNotification.findMany({
            where: {
                recipientId: user.id,
                scheduledAt: { gt: new Date() },
            },
            orderBy: { scheduledAt: 'asc' },
        });
        return notifications;
    }
    async cancelScheduledNotification(notificationId, user) {
        const notification = await this.prisma.scheduledNotification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            throw new Error('Scheduled notification not found');
        }
        await this.prisma.scheduledNotification.update({
            where: { id: notificationId },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'SCHEDULED_NOTIFICATION_CANCELLED',
            entityType: 'SCHEDULED_NOTIFICATION',
            entityId: notificationId,
            userId: user.id,
        });
        return { success: true };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map