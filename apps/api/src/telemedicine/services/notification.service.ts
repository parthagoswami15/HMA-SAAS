import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async scheduleConsultationReminders(consultationId: string) {
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

    // Schedule pre-consultation reminder (24 hours before)
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

    // Schedule immediate reminder (1 hour before)
    await this.scheduleNotification({
      consultationId,
      type: 'IMMEDIATE_REMINDER',
      scheduledAt: new Date(consultation.scheduledAt.getTime() - 60 * 60 * 1000),
      message: `Your telemedicine consultation starts in 1 hour at ${consultation.scheduledAt.toLocaleTimeString()}`,
      channels: ['SMS', 'EMAIL', 'PUSH'],
      recipients: [consultation.patientId, consultation.doctorId],
    });

    // Schedule follow-up reminder (if applicable)
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

  async sendConsultationNotification(consultationId: string, notificationDto: any, user: any) {
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

    // Log the notification
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

  async notifyEmergencyConsultation(consultationId: string, doctorId: string) {
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

  async cancelConsultationNotifications(consultationId: string) {
    this.logger.log(`Cancelling all notifications for consultation ${consultationId}`);

    // In production, this would cancel scheduled notifications
    // For now, just log the action
    await this.auditService.logActivity({
      action: 'CONSULTATION_NOTIFICATIONS_CANCELLED',
      entityType: 'TELEMEDICINE_CONSULTATION',
      entityId: consultationId,
      details: { reason: 'Consultation cancelled' },
    });

    return { success: true };
  }

  async sendPrescriptionNotification(prescriptionId: string, user: any) {
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

    // Log the notification
    await this.auditService.logActivity({
      action: 'PRESCRIPTION_NOTIFICATION_SENT',
      entityType: 'PRESCRIPTION',
      entityId: prescriptionId,
      userId: user.id,
    });

    return { success: true };
  }

  async sendPaymentReminder(consultationId: string, user: any) {
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

    // Log the notification
    await this.auditService.logActivity({
      action: 'PAYMENT_REMINDER_SENT',
      entityType: 'TELEMEDICINE_CONSULTATION',
      entityId: consultationId,
      userId: user.id,
    });

    return { success: true };
  }

  async sendFollowUpNotification(consultationId: string, user: any) {
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

    // Log the notification
    await this.auditService.logActivity({
      action: 'FOLLOW_UP_NOTIFICATION_SENT',
      entityType: 'TELEMEDICINE_CONSULTATION',
      entityId: consultationId,
      userId: user.id,
    });

    return { success: true };
  }

  private async scheduleNotification(notificationData: any) {
    // In production, this would integrate with the notification scheduler
    // For now, just create a notification record

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

  private async sendNotification(notificationData: any) {
    // In production, this would integrate with the notification service
    // For now, just create a notification record

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

  async getNotificationHistory(consultationId: string, user: any) {
    const notifications = await this.prisma.consultationNotification.findMany({
      where: { consultationId },
      orderBy: { createdAt: 'desc' },
    });

    return notifications;
  }

  async getScheduledNotifications(user: any) {
    const notifications = await this.prisma.scheduledNotification.findMany({
      where: {
        recipientId: user.id,
        scheduledAt: { gt: new Date() },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return notifications;
  }

  async cancelScheduledNotification(notificationId: string, user: any) {
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

    // Log the cancellation
    await this.auditService.logActivity({
      action: 'SCHEDULED_NOTIFICATION_CANCELLED',
      entityType: 'SCHEDULED_NOTIFICATION',
      entityId: notificationId,
      userId: user.id,
    });

    return { success: true };
  }
}
