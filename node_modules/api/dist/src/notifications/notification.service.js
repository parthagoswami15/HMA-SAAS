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
const event_emitter_1 = require("@nestjs/event-emitter");
const config_1 = require("@nestjs/config");
const notification_type_enum_1 = require("./enums/notification-type.enum");
const notification_channel_enum_1 = require("./enums/notification-channel.enum");
let NotificationService = NotificationService_1 = class NotificationService {
    eventEmitter;
    configService;
    logger = new common_1.Logger(NotificationService_1.name);
    isEnabled;
    constructor(eventEmitter, configService) {
        this.eventEmitter = eventEmitter;
        this.configService = configService;
        this.isEnabled = this.configService.get('NOTIFICATIONS_ENABLED', true);
    }
    onModuleInit() {
        this.logger.log('NotificationService initialized');
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.eventEmitter.on('patient.registered', async (data) => {
            try {
                await this.sendPatientWelcome(data);
            }
            catch (error) {
                this.logger.error(`Error sending welcome notification: ${error.message}`, error.stack);
            }
        });
        this.eventEmitter.on('appointment.reminder', async (data) => {
            try {
                await this.sendAppointmentReminder(data);
            }
            catch (error) {
                this.logger.error(`Error sending appointment reminder: ${error.message}`, error.stack);
            }
        });
    }
    async sendPatientWelcome(data) {
        if (!this.isEnabled) {
            this.logger.debug('Notifications are disabled. Skipping welcome notification.');
            return;
        }
        const { patientId, name, email, phone, mrn, registrationType, tenantId } = data;
        const channels = [];
        if (email)
            channels.push(notification_channel_enum_1.NotificationChannel.EMAIL);
        if (phone)
            channels.push(notification_channel_enum_1.NotificationChannel.SMS);
        if (channels.length === 0) {
            this.logger.warn(`No notification channels available for patient ${patientId}`);
            return;
        }
        const subject = 'Welcome to Our Healthcare System';
        const message = this.getWelcomeMessage(name, mrn, registrationType);
        for (const channel of channels) {
            this.eventEmitter.emit('notification.send', {
                type: notification_type_enum_1.NotificationType.WELCOME,
                channel,
                recipient: channel === notification_channel_enum_1.NotificationChannel.EMAIL ? email : phone,
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
    async sendAppointmentReminder(data) {
        if (!this.isEnabled) {
            this.logger.debug('Notifications are disabled. Skipping appointment reminder.');
            return;
        }
        const { patientId, patientName, doctorName, appointmentDate, email, phone } = data;
        const channels = [];
        if (email)
            channels.push(notification_channel_enum_1.NotificationChannel.EMAIL);
        if (phone)
            channels.push(notification_channel_enum_1.NotificationChannel.SMS);
        if (channels.length === 0) {
            this.logger.warn(`No notification channels available for appointment reminder for patient ${patientId}`);
            return;
        }
        const formattedDate = new Date(appointmentDate).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        const subject = 'Upcoming Appointment Reminder';
        const message = `Dear ${patientName},\n\n` +
            `This is a reminder for your appointment with Dr. ${doctorName} on ${formattedDate}.\n\n` +
            `Please arrive 15 minutes before your scheduled time.\n\n` +
            `Thank you for choosing our healthcare services.`;
        for (const channel of channels) {
            this.eventEmitter.emit('notification.send', {
                type: notification_type_enum_1.NotificationType.APPOINTMENT_REMINDER,
                channel,
                recipient: channel === notification_channel_enum_1.NotificationChannel.EMAIL ? email : phone,
                subject,
                message,
                metadata: {
                    patientId,
                    appointmentId: data.appointmentId,
                },
            });
        }
    }
    async sendTestResults(data) {
        if (!this.isEnabled) {
            this.logger.debug('Notifications are disabled. Skipping test results notification.');
            return;
        }
        const { patientId, testName, testDate, resultsUrl, email, phone } = data;
        const channels = [];
        if (email)
            channels.push(notification_channel_enum_1.NotificationChannel.EMAIL);
        if (phone)
            channels.push(notification_channel_enum_1.NotificationChannel.SMS);
        if (channels.length === 0) {
            this.logger.warn(`No notification channels available for test results for patient ${patientId}`);
            return;
        }
        const formattedDate = new Date(testDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const subject = `Your ${testName} Test Results`;
        const message = `Your ${testName} test results from ${formattedDate} are now available. ` +
            `You can view them by logging into your patient portal.\n\n` +
            `View Results: ${resultsUrl}\n\n` +
            `If you have any questions, please contact your healthcare provider.`;
        for (const channel of channels) {
            this.eventEmitter.emit('notification.send', {
                type: notification_type_enum_1.NotificationType.TEST_RESULTS,
                channel,
                recipient: channel === notification_channel_enum_1.NotificationChannel.EMAIL ? email : phone,
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
    getWelcomeMessage(name, mrn, registrationType) {
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
    setEnabled(enabled) {
        this.isEnabled = enabled;
        this.logger.log(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        config_1.ConfigService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map