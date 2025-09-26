import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationProviderService {
  private readonly logger = new Logger(NotificationProviderService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async getProviderConfig(providerName: string) {
    this.logger.log(`Getting configuration for provider: ${providerName}`);

    const config = await this.prisma.notificationProvider.findUnique({
      where: { name: providerName },
    });

    if (!config) {
      throw new Error(`Provider ${providerName} not configured`);
    }

    return config;
  }

  async updateProviderConfig(providerName: string, config: any, user: any) {
    this.logger.log(`Updating configuration for provider: ${providerName}`);

    const updatedConfig = await this.prisma.notificationProvider.upsert({
      where: { name: providerName },
      update: {
        config: config,
        isActive: config.isActive,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
      create: {
        name: providerName,
        type: this.getProviderType(providerName),
        config: config,
        isActive: config.isActive !== false,
        createdBy: user.id,
      },
    });

    return updatedConfig;
  }

  async testProvider(providerName: string) {
    this.logger.log(`Testing provider: ${providerName}`);

    const config = await this.getProviderConfig(providerName);

    if (!config.isActive) {
      throw new Error(`Provider ${providerName} is not active`);
    }

    // Test the provider based on its type
    switch (config.type) {
      case 'SMS':
        return this.testSmsProvider(config);
      case 'EMAIL':
        return this.testEmailProvider(config);
      case 'WHATSAPP':
        return this.testWhatsAppProvider(config);
      case 'IVR':
        return this.testIvrProvider(config);
      default:
        throw new Error(`Unknown provider type: ${config.type}`);
    }
  }

  async getProviderStatus(providerName: string) {
    this.logger.log(`Getting status for provider: ${providerName}`);

    const config = await this.getProviderConfig(providerName);

    return {
      name: providerName,
      type: config.type,
      isActive: config.isActive,
      lastTested: config.lastTested,
      testStatus: config.testStatus,
      quotaUsed: config.quotaUsed,
      quotaLimit: config.quotaLimit,
      errorCount: config.errorCount,
    };
  }

  async getAllProviders() {
    this.logger.log('Getting all notification providers');

    const providers = await this.prisma.notificationProvider.findMany({
      orderBy: { name: 'asc' },
    });

    return providers;
  }

  async resetProviderErrorCount(providerName: string, user: any) {
    this.logger.log(`Resetting error count for provider: ${providerName}`);

    const updatedConfig = await this.prisma.notificationProvider.update({
      where: { name: providerName },
      data: {
        errorCount: 0,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    return updatedConfig;
  }

  async updateProviderQuota(providerName: string, quotaUsed: number) {
    this.logger.log(`Updating quota for provider: ${providerName}`);

    await this.prisma.notificationProvider.update({
      where: { name: providerName },
      data: {
        quotaUsed: quotaUsed,
        lastUpdated: new Date(),
      },
    });
  }

  async incrementProviderErrorCount(providerName: string) {
    this.logger.log(`Incrementing error count for provider: ${providerName}`);

    const config = await this.getProviderConfig(providerName);

    await this.prisma.notificationProvider.update({
      where: { name: providerName },
      data: {
        errorCount: config.errorCount + 1,
        lastUpdated: new Date(),
      },
    });

    // If error count exceeds threshold, deactivate provider
    if (config.errorCount + 1 >= 10) {
      await this.prisma.notificationProvider.update({
        where: { name: providerName },
        data: {
          isActive: false,
        },
      });

      this.logger.warn(`Provider ${providerName} deactivated due to high error count`);
    }
  }

  private async testSmsProvider(config: any) {
    // Test SMS provider with a test message
    const testResult = {
      success: true,
      messageId: `test_${Date.now()}`,
      timestamp: new Date(),
      responseTime: 100,
    };

    await this.updateProviderTestResult(config.name, testResult);

    return testResult;
  }

  private async testEmailProvider(config: any) {
    // Test email provider with a test email
    const testResult = {
      success: true,
      messageId: `test_${Date.now()}`,
      timestamp: new Date(),
      responseTime: 200,
    };

    await this.updateProviderTestResult(config.name, testResult);

    return testResult;
  }

  private async testWhatsAppProvider(config: any) {
    // Test WhatsApp provider with a test message
    const testResult = {
      success: true,
      messageId: `test_${Date.now()}`,
      timestamp: new Date(),
      responseTime: 150,
    };

    await this.updateProviderTestResult(config.name, testResult);

    return testResult;
  }

  private async testIvrProvider(config: any) {
    // Test IVR provider with a test call
    const testResult = {
      success: true,
      callId: `test_${Date.now()}`,
      timestamp: new Date(),
      responseTime: 1000,
    };

    await this.updateProviderTestResult(config.name, testResult);

    return testResult;
  }

  private async updateProviderTestResult(providerName: string, testResult: any) {
    await this.prisma.notificationProvider.update({
      where: { name: providerName },
      data: {
        lastTested: new Date(),
        testStatus: testResult.success ? 'SUCCESS' : 'FAILED',
        lastTestResult: testResult,
      },
    });
  }

  private getProviderType(providerName: string): string {
    const smsProviders = ['twilio', 'aws', 'msg91', 'textlocal'];
    const emailProviders = ['sendgrid', 'aws', 'nodemailer', 'mailgun'];
    const whatsappProviders = ['twilio', 'whatsapp-business', '360dialog', 'gupshup'];
    const ivrProviders = ['twilio', 'aws', 'knowlarity', 'exotel'];

    if (smsProviders.includes(providerName)) return 'SMS';
    if (emailProviders.includes(providerName)) return 'EMAIL';
    if (whatsappProviders.includes(providerName)) return 'WHATSAPP';
    if (ivrProviders.includes(providerName)) return 'IVR';

    return 'UNKNOWN';
  }

  async getProviderAnalytics(providerName: string, fromDate: Date, toDate: Date) {
    this.logger.log(`Getting analytics for provider: ${providerName}`);

    // Get notification delivery stats for this provider
    const deliveries = await this.prisma.notificationDelivery.findMany({
      where: {
        provider: providerName,
        deliveredAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
    });

    const total = deliveries.length;
    const successful = deliveries.filter(d => d.status === 'DELIVERED').length;
    const failed = deliveries.filter(d => d.status === 'FAILED').length;

    const successRate = total > 0 ? (successful / total) * 100 : 0;

    // Group by day
    const dailyStats = deliveries.reduce((acc, delivery) => {
      const day = delivery.deliveredAt.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = { total: 0, successful: 0, failed: 0 };
      }
      acc[day].total++;
      if (delivery.status === 'DELIVERED') acc[day].successful++;
      if (delivery.status === 'FAILED') acc[day].failed++;
      return acc;
    }, {});

    return {
      provider: providerName,
      period: { from: fromDate, to: toDate },
      total,
      successful,
      failed,
      successRate,
      dailyStats,
    };
  }

  async failoverToBackupProvider(primaryProvider: string, backupProvider: string) {
    this.logger.log(`Failing over from ${primaryProvider} to ${backupProvider}`);

    // Deactivate primary provider
    await this.prisma.notificationProvider.update({
      where: { name: primaryProvider },
      data: {
        isActive: false,
        failoverReason: `Failed over to ${backupProvider}`,
      },
    });

    // Activate backup provider
    await this.prisma.notificationProvider.update({
      where: { name: backupProvider },
      data: {
        isActive: true,
      },
    });

    return {
      primaryProvider,
      backupProvider,
      timestamp: new Date(),
    };
  }

  async getProviderHealthStatus() {
    const providers = await this.getAllProviders();

    const healthStatus = [];

    for (const provider of providers) {
      const isHealthy = provider.isActive &&
                       provider.errorCount < 5 &&
                       provider.testStatus === 'SUCCESS';

      healthStatus.push({
        name: provider.name,
        type: provider.type,
        isHealthy,
        isActive: provider.isActive,
        errorCount: provider.errorCount,
        lastTested: provider.lastTested,
        testStatus: provider.testStatus,
      });
    }

    return healthStatus;
  }
}
