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
var WhatsAppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let WhatsAppService = WhatsAppService_1 = class WhatsAppService {
    configService;
    logger = new common_1.Logger(WhatsAppService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async sendWhatsApp(options) {
        this.logger.log(`Sending WhatsApp to ${options.to}: ${options.message}`);
        const whatsappProvider = this.configService.get('WHATSAPP_PROVIDER', 'twilio');
        try {
            let result;
            switch (whatsappProvider) {
                case 'twilio':
                    result = await this.sendTwilioWhatsApp(options);
                    break;
                case 'whatsapp-business':
                    result = await this.sendWhatsAppBusiness(options);
                    break;
                case '360dialog':
                    result = await this.send360DialogWhatsApp(options);
                    break;
                default:
                    result = await this.sendMockWhatsApp(options);
            }
            return result;
        }
        catch (error) {
            this.logger.error('WhatsApp sending failed', error);
            throw error;
        }
    }
    async sendTwilioWhatsApp(options) {
        this.logger.log('Using Twilio WhatsApp provider');
        await new Promise(resolve => setTimeout(resolve, 150));
        return {
            success: true,
            messageId: `twilio_wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'twilio',
            to: options.to,
            status: 'sent',
        };
    }
    async sendWhatsAppBusiness(options) {
        this.logger.log('Using WhatsApp Business API provider');
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            success: true,
            messageId: `whatsapp_business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'whatsapp_business',
            to: options.to,
            status: 'sent',
        };
    }
    async send360DialogWhatsApp(options) {
        this.logger.log('Using 360Dialog WhatsApp provider');
        await new Promise(resolve => setTimeout(resolve, 180));
        return {
            success: true,
            messageId: `360dialog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: '360dialog',
            to: options.to,
            status: 'sent',
        };
    }
    async sendMockWhatsApp(options) {
        this.logger.log('Using mock WhatsApp provider');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (Math.random() < 0.03) {
            throw new Error('Mock WhatsApp delivery failed');
        }
        return {
            success: true,
            messageId: `mock_wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'mock',
            to: options.to,
            status: 'sent',
        };
    }
    async sendTestWhatsApp(to, message) {
        this.logger.log(`Sending test WhatsApp to ${to}`);
        return this.sendWhatsApp({
            to,
            message: `TEST: ${message}`,
            priority: 'HIGH',
        });
    }
    async sendWhatsAppWithMedia(options) {
        this.logger.log(`Sending WhatsApp with media to ${options.to}`);
        const uploadResult = await this.uploadMedia(options.mediaUrl, options.mediaType);
        return this.sendWhatsApp({
            to: options.to,
            message: options.message,
            mediaUrl: uploadResult.mediaId,
            priority: 'MEDIUM',
        });
    }
    async uploadMedia(mediaUrl, mediaType) {
        this.logger.log(`Uploading ${mediaType} media: ${mediaUrl}`);
        return {
            mediaId: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            uploadedAt: new Date(),
        };
    }
    async getWhatsAppDeliveryStatus(messageId) {
        this.logger.log(`Checking WhatsApp delivery status for ${messageId}`);
        return {
            messageId,
            status: 'delivered',
            deliveredAt: new Date(),
            readAt: new Date(Date.now() - 5 * 60 * 1000),
            cost: 0.05,
        };
    }
    async getWhatsAppBalance() {
        return {
            provider: 'twilio',
            balance: 5000,
            currency: 'USD',
        };
    }
    async sendWhatsAppTemplate(options) {
        this.logger.log(`Sending WhatsApp template ${options.templateName} to ${options.to}`);
        const templateMessage = await this.buildTemplateMessage(options.templateName, options.language, options.variables);
        return this.sendWhatsApp({
            to: options.to,
            message: templateMessage,
            priority: 'MEDIUM',
        });
    }
    async buildTemplateMessage(templateName, language, variables) {
        return `Template: ${templateName} - Variables: ${JSON.stringify(variables)}`;
    }
    async getWhatsAppTemplates() {
        return [
            {
                name: 'appointment_reminder',
                language: 'en',
                content: 'Hi {{1}}, you have an appointment scheduled for {{2}} at {{3}}.',
                variables: ['patient_name', 'date', 'time'],
            },
            {
                name: 'report_ready',
                language: 'en',
                content: 'Hi {{1}}, your medical report is ready. Please find it attached.',
                variables: ['patient_name'],
            },
            {
                name: 'payment_due',
                language: 'en',
                content: 'Hi {{1}}, you have a pending payment of {{2}}. Please pay at your earliest convenience.',
                variables: ['patient_name', 'amount'],
            },
        ];
    }
};
exports.WhatsAppService = WhatsAppService;
exports.WhatsAppService = WhatsAppService = WhatsAppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsAppService);
//# sourceMappingURL=whatsapp.service.js.map