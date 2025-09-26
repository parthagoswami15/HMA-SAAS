import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { NotificationType } from './enums/notification-type.enum';
import { NotificationChannel } from './enums/notification-channel.enum';
import { RegistrationType } from '@prisma/client';

type WelcomeNotificationData = {
  patientId: string;
  name: string;
  email?: string;
  phone?: string;
  mrn: string;
  registrationType: RegistrationType;
  tenantId: string;
};

type AppointmentReminderData = {
  patientId: string;
  appointmentId: string;
  patientName: string;
  doctorName: string;
  appointmentDate: Date;
  location: string;
  email?: string;
  phone?: string;
};

type TestResultsNotificationData = {
  patientId: string;
  testName: string;
  testDate: Date;
  resultsUrl: string;
  email?: string;
  phone?: string;
};

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private isEnabled: boolean;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {
    this.isEnabled = this.configService.get<boolean>('NOTIFICATIONS_ENABLED', true);
  }

  onModuleInit() {
    this.logger.log('NotificationService initialized');
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for patient registration events
    this.eventEmitter.on('patient.registered', async (data: WelcomeNotificationData) => {
      try {
        await this.sendPatientWelcome(data);
      } catch (error) {
        this.logger.error(`Error sending welcome notification: ${error.message}`, error.stack);
      }
    });

    // Listen for appointment reminder events
    this.eventEmitter.on('appointment.reminder', async (data: AppointmentReminderData) => {
      try {
        await this.sendAppointmentReminder(data);
      } catch (error) {
        this.logger.error(`Error sending appointment reminder: ${error.message}`, error.stack);
      }
    });
  }

  /**
   * Send welcome notification to newly registered patient
   */
  async sendPatientWelcome(data: WelcomeNotificationData): Promise<void> {
    if (!this.isEnabled) {
      this.logger.debug('Notifications are disabled. Skipping welcome notification.');
      return;
    }

    const { patientId, name, email, phone, mrn, registrationType, tenantId } = data;
    const channels: NotificationChannel[] = [];

    // Determine which channels to use based on available contact info
    if (email) channels.push(NotificationChannel.EMAIL);
    if (phone) channels.push(NotificationChannel.SMS);

    if (channels.length === 0) {
      this.logger.warn(`No notification channels available for patient ${patientId}`);
      return;
    }

    // Prepare notification content
    const subject = 'Welcome to Our Healthcare System';
    const message = this.getWelcomeMessage(name, mrn, registrationType);
    
    // Emit notification event for each channel
    for (const channel of channels) {
      this.eventEmitter.emit('notification.send', {
        type: NotificationType.WELCOME,
        channel,
        recipient: channel === NotificationChannel.EMAIL ? email : phone,
        subject,
        message,
        metadata: {
          patientId,
          tenantId,
          registrationType,
        },
      });
    }
  }

  /**
   * Send appointment reminder to patient
   */
  async sendAppointmentReminder(data: AppointmentReminderData): Promise<void> {
    if (!this.isEnabled) {
      this.logger.debug('Notifications are disabled. Skipping appointment reminder.');
      return;
    }

    const { patientId, patientName, doctorName, appointmentDate, email, phone } = data;
    const channels: NotificationChannel[] = [];

    // Determine which channels to use based on available contact info
    if (email) channels.push(NotificationChannel.EMAIL);
    if (phone) channels.push(NotificationChannel.SMS);

    if (channels.length === 0) {
      this.logger.warn(`No notification channels available for appointment reminder for patient ${patientId}`);
      return;
    }

    // Format appointment date
    const formattedDate = new Date(appointmentDate).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Prepare notification content
    const subject = 'Upcoming Appointment Reminder';
    const message = `Dear ${patientName},\n\n` +
      `This is a reminder for your appointment with Dr. ${doctorName} on ${formattedDate}.\n\n` +
      `Please arrive 15 minutes before your scheduled time.\n\n` +
      `Thank you for choosing our healthcare services.`;

    // Emit notification event for each channel
    for (const channel of channels) {
      this.eventEmitter.emit('notification.send', {
        type: NotificationType.APPOINTMENT_REMINDER,
        channel,
        recipient: channel === NotificationChannel.EMAIL ? email : phone,
        subject,
        message,
        metadata: {
          patientId,
          appointmentId: data.appointmentId,
        },
      });
    }
  }

  /**
   * Send test results notification to patient
   */
  async sendTestResults(data: TestResultsNotificationData): Promise<void> {
    if (!this.isEnabled) {
      this.logger.debug('Notifications are disabled. Skipping test results notification.');
      return;
    }

    const { patientId, testName, testDate, resultsUrl, email, phone } = data;
    const channels: NotificationChannel[] = [];

    // Determine which channels to use based on available contact info
    if (email) channels.push(NotificationChannel.EMAIL);
    if (phone) channels.push(NotificationChannel.SMS);

    if (channels.length === 0) {
      this.logger.warn(`No notification channels available for test results for patient ${patientId}`);
      return;
    }

    // Format test date
    const formattedDate = new Date(testDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Prepare notification content
    const subject = `Your ${testName} Test Results`;
    const message = `Your ${testName} test results from ${formattedDate} are now available. ` +
      `You can view them by logging into your patient portal.\n\n` +
      `View Results: ${resultsUrl}\n\n` +
      `If you have any questions, please contact your healthcare provider.`;

    // Emit notification event for each channel
    for (const channel of channels) {
      this.eventEmitter.emit('notification.send', {
        type: NotificationType.TEST_RESULTS,
        channel,
        recipient: channel === NotificationChannel.EMAIL ? email : phone,
        subject,
        message,
        metadata: {
          patientId,
          testName,
          testDate: formattedDate,
        },
      });
    }
  }

  /**
   * Generate welcome message based on registration type
   */
  private getWelcomeMessage(name: string, mrn: string, registrationType: RegistrationType): string {
    let welcomeText = '';
    
    switch (registrationType) {
      case 'ONLINE':
        welcomeText = 'Thank you for registering with our online patient portal. ';
        break;
      case 'WALK_IN':
        welcomeText = 'Thank you for visiting our facility. ';
        break;
      case 'REFERRAL':
        welcomeText = 'Welcome to our healthcare network. ';
        break;
      default:
        welcomeText = 'Welcome to our healthcare system. ';
    }

    return `Dear ${name},\n\n` +
      `${welcomeText}Your registration is now complete.\n\n` +
      `Your Medical Record Number (MRN) is: ${mrn}\n\n` +
      `You can use this number to schedule appointments, view test results, and access your medical records through our patient portal.\n\n` +
      `If you have any questions, please don't hesitate to contact our support team.\n\n` +
      `Best regards,\nThe Healthcare Team`;
  }

  /**
   * Enable or disable notifications
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.logger.log(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
  }
}
