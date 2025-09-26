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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SmsService = SmsService_1 = class SmsService {
    configService;
    logger = new common_1.Logger(SmsService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async sendSms(options) {
        this.logger.log(`Sending SMS to ${options.to}: ${options.message}`);
        const smsProvider = this.configService.get('SMS_PROVIDER', 'twilio');
        try {
            let result;
            switch (smsProvider) {
                case 'twilio':
                    result = await this.sendTwilioSms(options);
                    break;
                case 'aws':
                    result = await this.sendAwsSms(options);
                    break;
                default:
                    result = await this.sendMockSms(options);
            }
            return result;
        }
        catch (error) {
            this.logger.error('SMS sending failed', error);
            throw error;
        }
    }
    async sendTwilioSms(options) {
        this.logger.log('Using Twilio SMS provider');
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            success: true,
            messageId: `twilio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'twilio',
            to: options.to,
            status: 'sent',
        };
    }
    async sendAwsSms(options) {
        this.logger.log('Using AWS SNS SMS provider');
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            success: true,
            messageId: `aws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'aws',
            to: options.to,
            status: 'sent',
        };
    }
    async sendMockSms(options) {
        this.logger.log('Using mock SMS provider');
        await new Promise(resolve => setTimeout(resolve, 50));
        if (Math.random() < 0.05) {
            throw new Error('Mock SMS delivery failed');
        }
        return {
            success: true,
            messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'mock',
            to: options.to,
            status: 'sent',
        };
    }
    async sendTestSms(to, message) {
        this.logger.log(`Sending test SMS to ${to}`);
        return this.sendSms({
            to,
            message: `TEST: ${message}`,
            priority: 'HIGH',
        });
    }
    async getSmsDeliveryStatus(messageId) {
        this.logger.log(`Checking SMS delivery status for ${messageId}`);
        return {
            messageId,
            status: 'delivered',
            deliveredAt: new Date(),
            cost: 0.05,
        };
    }
    async getSmsBalance() {
        return {
            provider: 'twilio',
            balance: 1000,
            currency: 'USD',
        };
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map