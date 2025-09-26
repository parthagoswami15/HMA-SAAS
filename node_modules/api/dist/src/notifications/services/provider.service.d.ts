import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class NotificationProviderService {
    private readonly configService;
    private readonly prisma;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    getProviderConfig(providerName: string): Promise<any>;
    updateProviderConfig(providerName: string, config: any, user: any): Promise<any>;
    testProvider(providerName: string): Promise<{
        success: boolean;
        messageId: string;
        timestamp: Date;
        responseTime: number;
    } | {
        success: boolean;
        callId: string;
        timestamp: Date;
        responseTime: number;
    }>;
    getProviderStatus(providerName: string): Promise<{
        name: string;
        type: any;
        isActive: any;
        lastTested: any;
        testStatus: any;
        quotaUsed: any;
        quotaLimit: any;
        errorCount: any;
    }>;
    getAllProviders(): Promise<any>;
    resetProviderErrorCount(providerName: string, user: any): Promise<any>;
    updateProviderQuota(providerName: string, quotaUsed: number): Promise<void>;
    incrementProviderErrorCount(providerName: string): Promise<void>;
    private testSmsProvider;
    private testEmailProvider;
    private testWhatsAppProvider;
    private testIvrProvider;
    private updateProviderTestResult;
    private getProviderType;
    getProviderAnalytics(providerName: string, fromDate: Date, toDate: Date): Promise<{
        provider: string;
        period: {
            from: Date;
            to: Date;
        };
        total: any;
        successful: any;
        failed: any;
        successRate: number;
        dailyStats: any;
    }>;
    failoverToBackupProvider(primaryProvider: string, backupProvider: string): Promise<{
        primaryProvider: string;
        backupProvider: string;
        timestamp: Date;
    }>;
    getProviderHealthStatus(): Promise<{
        name: any;
        type: any;
        isHealthy: any;
        isActive: any;
        errorCount: any;
        lastTested: any;
        testStatus: any;
    }[]>;
}
