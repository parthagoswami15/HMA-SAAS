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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async sendEmail(options) {
        this.logger.log(`Sending email to ${options.to}: ${options.subject}`);
        const emailProvider = this.configService.get('EMAIL_PROVIDER', 'sendgrid');
        try {
            let result;
            switch (emailProvider) {
                case 'sendgrid':
                    result = await this.sendSendGridEmail(options);
                    break;
                case 'aws':
                    result = await this.sendAwsEmail(options);
                    break;
                case 'nodemailer':
                    result = await this.sendNodeMailerEmail(options);
                    break;
                default:
                    result = await this.sendMockEmail(options);
            }
            return result;
        }
        catch (error) {
            this.logger.error('Email sending failed', error);
            throw error;
        }
    }
    async sendSendGridEmail(options) {
        this.logger.log('Using SendGrid email provider');
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            success: true,
            messageId: `sendgrid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'sendgrid',
            to: options.to,
            status: 'sent',
        };
    }
    async sendAwsEmail(options) {
        this.logger.log('Using AWS SES email provider');
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            success: true,
            messageId: `aws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'aws',
            to: options.to,
            status: 'sent',
        };
    }
    async sendNodeMailerEmail(options) {
        this.logger.log('Using NodeMailer email provider');
        await new Promise(resolve => setTimeout(resolve, 150));
        return {
            success: true,
            messageId: `nodemailer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'nodemailer',
            to: options.to,
            status: 'sent',
        };
    }
    async sendMockEmail(options) {
        this.logger.log('Using mock email provider');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (Math.random() < 0.02) {
            throw new Error('Mock email delivery failed');
        }
        return {
            success: true,
            messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'mock',
            to: options.to,
            status: 'sent',
        };
    }
    async sendTestEmail(to, subject, html) {
        this.logger.log(`Sending test email to ${to}`);
        return this.sendEmail({
            to,
            subject: `TEST: ${subject}`,
            html: `<p>This is a test email.</p><p>${html}</p>`,
            priority: 'HIGH',
        });
    }
    async getEmailDeliveryStatus(messageId) {
        this.logger.log(`Checking email delivery status for ${messageId}`);
        return {
            messageId,
            status: 'delivered',
            deliveredAt: new Date(),
            cost: 0.001,
            opens: 0,
            clicks: 0,
        };
    }
    async getEmailBalance() {
        return {
            provider: 'sendgrid',
            quota: 100000,
            used: 15000,
            remaining: 85000,
            resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        };
    }
    async sendBulkEmail(recipients, options) {
        this.logger.log(`Sending bulk email to ${recipients.length} recipients`);
        const results = [];
        const errors = [];
        for (const recipient of recipients) {
            try {
                const result = await this.sendEmail({
                    ...options,
                    to: recipient,
                });
                results.push({ recipient, status: 'SUCCESS', messageId: result.messageId });
            }
            catch (error) {
                errors.push({ recipient, error: error.message });
            }
        }
        return {
            totalRequested: recipients.length,
            successful: results.length,
            failed: errors.length,
            results,
            errors,
        };
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map