import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    sendEmail(options: {
        to: string;
        subject: string;
        html?: string;
        text?: string;
        priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
        attachments?: Array<{
            filename: string;
            content: Buffer;
            encoding: string;
        }>;
    }): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    private sendSendGridEmail;
    private sendAwsEmail;
    private sendNodeMailerEmail;
    private sendMockEmail;
    sendTestEmail(to: string, subject: string, html: string): Promise<{
        success: boolean;
        messageId: string;
        provider: string;
        to: any;
        status: string;
    }>;
    getEmailDeliveryStatus(messageId: string): Promise<{
        messageId: string;
        status: string;
        deliveredAt: Date;
        cost: number;
        opens: number;
        clicks: number;
    }>;
    getEmailBalance(): Promise<{
        provider: string;
        quota: number;
        used: number;
        remaining: number;
        resetDate: Date;
    }>;
    sendBulkEmail(recipients: string[], options: any): Promise<{
        totalRequested: number;
        successful: number;
        failed: number;
        results: {
            recipient: string;
            status: string;
            messageId: string;
        }[];
        errors: {
            recipient: string;
            error: any;
        }[];
    }>;
}
