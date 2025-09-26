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
var IvrService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IvrService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let IvrService = IvrService_1 = class IvrService {
    configService;
    logger = new common_1.Logger(IvrService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async makeCall(options) {
        this.logger.log(`Making IVR call to ${options.to}: ${options.message}`);
        const ivrProvider = this.configService.get('IVR_PROVIDER', 'twilio');
        try {
            let result;
            switch (ivrProvider) {
                case 'twilio':
                    result = await this.makeTwilioCall(options);
                    break;
                case 'aws':
                    result = await this.makeAwsCall(options);
                    break;
                default:
                    result = await this.makeMockCall(options);
            }
            return result;
        }
        catch (error) {
            this.logger.error('IVR call failed', error);
            throw error;
        }
    }
    async makeTwilioCall(options) {
        this.logger.log('Using Twilio IVR provider');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            success: true,
            callId: `twilio_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'twilio',
            to: options.to,
            status: 'completed',
            duration: 30,
        };
    }
    async makeAwsCall(options) {
        this.logger.log('Using AWS Connect IVR provider');
        await new Promise(resolve => setTimeout(resolve, 1200));
        return {
            success: true,
            callId: `aws_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'aws',
            to: options.to,
            status: 'completed',
            duration: 35,
        };
    }
    async makeMockCall(options) {
        this.logger.log('Using mock IVR provider');
        await new Promise(resolve => setTimeout(resolve, 500));
        if (Math.random() < 0.1) {
            throw new Error('Mock IVR call failed');
        }
        return {
            success: true,
            callId: `mock_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'mock',
            to: options.to,
            status: 'completed',
            duration: 25,
        };
    }
    async makeTestCall(to, message) {
        this.logger.log(`Making test IVR call to ${to}`);
        return this.makeCall({
            to,
            message: `TEST: ${message}`,
            priority: 'HIGH',
            voice: 'female',
            language: 'en',
        });
    }
    async getCallRecording(callId) {
        this.logger.log(`Retrieving call recording for ${callId}`);
        return {
            callId,
            recordingUrl: `https://example.com/recordings/${callId}.mp3`,
            duration: 30,
            size: 1024000,
        };
    }
    async getCallAnalytics(callId) {
        this.logger.log(`Retrieving call analytics for ${callId}`);
        return {
            callId,
            duration: 30,
            status: 'completed',
            sentiment: 'positive',
            keywords: ['appointment', 'doctor', 'medicine'],
            transcript: 'This is a sample call transcript...',
        };
    }
    async getIvrBalance() {
        return {
            provider: 'twilio',
            minutesRemaining: 1000,
            currency: 'USD',
            costPerMinute: 0.05,
        };
    }
    async createIvrFlow(options) {
        this.logger.log(`Creating IVR flow: ${options.name}`);
        return {
            flowId: `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: options.name,
            status: 'active',
            createdAt: new Date(),
        };
    }
    async updateIvrFlow(flowId, options) {
        this.logger.log(`Updating IVR flow ${flowId}`);
        return {
            flowId,
            updatedAt: new Date(),
            status: 'active',
        };
    }
    async deleteIvrFlow(flowId) {
        this.logger.log(`Deleting IVR flow ${flowId}`);
        return {
            flowId,
            deletedAt: new Date(),
        };
    }
    async getIvrFlows() {
        return [
            {
                flowId: 'flow_1',
                name: 'Appointment Reminder',
                status: 'active',
                createdAt: new Date(),
            },
            {
                flowId: 'flow_2',
                name: 'Payment Reminder',
                status: 'active',
                createdAt: new Date(),
            },
        ];
    }
};
exports.IvrService = IvrService;
exports.IvrService = IvrService = IvrService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IvrService);
//# sourceMappingURL=ivr.service.js.map