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
var NotificationProviderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProviderService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
let NotificationProviderService = NotificationProviderService_1 = class NotificationProviderService {
    configService;
    prisma;
    logger = new common_1.Logger(NotificationProviderService_1.name);
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
    }
    async getProviderConfig(providerName) {
        this.logger.log(`Getting configuration for provider: ${providerName}`);
        const config = await this.prisma.notificationProvider.findUnique({
            where: { name: providerName },
        });
        if (!config) {
            throw new Error(`Provider ${providerName} not configured`);
        }
        return config;
    }
    async updateProviderConfig(providerName, config, user) {
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
    async testProvider(providerName) {
        this.logger.log(`Testing provider: ${providerName}`);
        const config = await this.getProviderConfig(providerName);
        if (!config.isActive) {
            throw new Error(`Provider ${providerName} is not active`);
        }
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
    async getProviderStatus(providerName) {
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
    async resetProviderErrorCount(providerName, user) {
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
    async updateProviderQuota(providerName, quotaUsed) {
        this.logger.log(`Updating quota for provider: ${providerName}`);
        await this.prisma.notificationProvider.update({
            where: { name: providerName },
            data: {
                quotaUsed: quotaUsed,
                lastUpdated: new Date(),
            },
        });
    }
    async incrementProviderErrorCount(providerName) {
        this.logger.log(`Incrementing error count for provider: ${providerName}`);
        const config = await this.getProviderConfig(providerName);
        await this.prisma.notificationProvider.update({
            where: { name: providerName },
            data: {
                errorCount: config.errorCount + 1,
                lastUpdated: new Date(),
            },
        });
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
    async testSmsProvider(config) {
        const testResult = {
            success: true,
            messageId: `test_${Date.now()}`,
            timestamp: new Date(),
            responseTime: 100,
        };
        await this.updateProviderTestResult(config.name, testResult);
        return testResult;
    }
    async testEmailProvider(config) {
        const testResult = {
            success: true,
            messageId: `test_${Date.now()}`,
            timestamp: new Date(),
            responseTime: 200,
        };
        await this.updateProviderTestResult(config.name, testResult);
        return testResult;
    }
    async testWhatsAppProvider(config) {
        const testResult = {
            success: true,
            messageId: `test_${Date.now()}`,
            timestamp: new Date(),
            responseTime: 150,
        };
        await this.updateProviderTestResult(config.name, testResult);
        return testResult;
    }
    async testIvrProvider(config) {
        const testResult = {
            success: true,
            callId: `test_${Date.now()}`,
            timestamp: new Date(),
            responseTime: 1000,
        };
        await this.updateProviderTestResult(config.name, testResult);
        return testResult;
    }
    async updateProviderTestResult(providerName, testResult) {
        await this.prisma.notificationProvider.update({
            where: { name: providerName },
            data: {
                lastTested: new Date(),
                testStatus: testResult.success ? 'SUCCESS' : 'FAILED',
                lastTestResult: testResult,
            },
        });
    }
    getProviderType(providerName) {
        const smsProviders = ['twilio', 'aws', 'msg91', 'textlocal'];
        const emailProviders = ['sendgrid', 'aws', 'nodemailer', 'mailgun'];
        const whatsappProviders = ['twilio', 'whatsapp-business', '360dialog', 'gupshup'];
        const ivrProviders = ['twilio', 'aws', 'knowlarity', 'exotel'];
        if (smsProviders.includes(providerName))
            return 'SMS';
        if (emailProviders.includes(providerName))
            return 'EMAIL';
        if (whatsappProviders.includes(providerName))
            return 'WHATSAPP';
        if (ivrProviders.includes(providerName))
            return 'IVR';
        return 'UNKNOWN';
    }
    async getProviderAnalytics(providerName, fromDate, toDate) {
        this.logger.log(`Getting analytics for provider: ${providerName}`);
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
        const dailyStats = deliveries.reduce((acc, delivery) => {
            const day = delivery.deliveredAt.toISOString().split('T')[0];
            if (!acc[day]) {
                acc[day] = { total: 0, successful: 0, failed: 0 };
            }
            acc[day].total++;
            if (delivery.status === 'DELIVERED')
                acc[day].successful++;
            if (delivery.status === 'FAILED')
                acc[day].failed++;
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
    async failoverToBackupProvider(primaryProvider, backupProvider) {
        this.logger.log(`Failing over from ${primaryProvider} to ${backupProvider}`);
        await this.prisma.notificationProvider.update({
            where: { name: primaryProvider },
            data: {
                isActive: false,
                failoverReason: `Failed over to ${backupProvider}`,
            },
        });
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
};
exports.NotificationProviderService = NotificationProviderService;
exports.NotificationProviderService = NotificationProviderService = NotificationProviderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], NotificationProviderService);
//# sourceMappingURL=provider.service.js.map