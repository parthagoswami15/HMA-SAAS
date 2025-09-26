import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    sendSms(options: {
        to: string;
        message: string;
        priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    }): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: string;
        status: string;
    }>;
    private sendTwilioSms;
    private sendAwsSms;
    private sendMockSms;
    sendTestSms(to: string, message: string): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: string;
        status: string;
    }>;
    getSmsDeliveryStatus(messageId: string): Promise<{
        messageId: string;
        status: string;
        deliveredAt: Date;
        cost: number;
    }>;
    getSmsBalance(): Promise<{
        provider: string;
        balance: number;
        currency: string;
    }>;
}
