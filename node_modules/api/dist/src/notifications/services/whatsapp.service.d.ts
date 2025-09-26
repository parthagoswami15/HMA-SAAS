import { ConfigService } from '@nestjs/config';
export declare class WhatsAppService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    sendWhatsApp(options: {
        to: string;
        message: string;
        mediaUrl?: string;
        priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    }): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    private sendTwilioWhatsApp;
    private sendWhatsAppBusiness;
    private send360DialogWhatsApp;
    private sendMockWhatsApp;
    sendTestWhatsApp(to: string, message: string): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    sendWhatsAppWithMedia(options: {
        to: string;
        message: string;
        mediaUrl: string;
        mediaType: 'image' | 'document' | 'audio' | 'video';
    }): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    private uploadMedia;
    getWhatsAppDeliveryStatus(messageId: string): Promise<{
        messageId: string;
        status: string;
        deliveredAt: Date;
        readAt: Date;
        cost: number;
    }>;
    getWhatsAppBalance(): Promise<{
        provider: string;
        balance: number;
        currency: string;
    }>;
    sendWhatsAppTemplate(options: {
        to: string;
        templateName: string;
        language: string;
        variables: Record<string, string>;
    }): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    private buildTemplateMessage;
    getWhatsAppTemplates(): Promise<{
        name: string;
        language: string;
        content: string;
        variables: string[];
    }[]>;
}
