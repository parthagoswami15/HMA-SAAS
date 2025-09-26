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
var ApiKeyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let ApiKeyService = ApiKeyService_1 = class ApiKeyService {
    prisma;
    auditService;
    logger = new common_1.Logger(ApiKeyService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async createApiKey(apiKeyDto, user) {
        this.logger.log(`Creating API key for tenant: ${user.tenantId}`);
        const { name, scopes, expiresAt, rateLimit, } = apiKeyDto;
        const apiKey = await this.prisma.apiKey.create({
            data: {
                tenantId: user.tenantId,
                name,
                key: this.generateApiKey(),
                scopes: JSON.stringify(scopes),
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                rateLimit: rateLimit || 1000,
                isActive: true,
                createdBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'API_KEY_CREATED',
            entityType: 'API_KEY',
            entityId: apiKey.id,
            userId: user.id,
            details: { name, scopes },
        });
        return {
            apiKeyId: apiKey.id,
            name: apiKey.name,
            key: apiKey.key,
            scopes: JSON.parse(apiKey.scopes),
            expiresAt: apiKey.expiresAt,
            rateLimit: apiKey.rateLimit,
            isActive: apiKey.isActive,
        };
    }
    async getApiKeys(user) {
        this.logger.log(`Getting API keys for tenant: ${user.tenantId}`);
        const apiKeys = await this.prisma.apiKey.findMany({
            where: { tenantId: user.tenantId },
            select: {
                id: true,
                name: true,
                scopes: true,
                expiresAt: true,
                rateLimit: true,
                isActive: true,
                createdAt: true,
                lastUsedAt: true,
                usageCount: true,
            },
        });
        return apiKeys.map(apiKey => ({
            apiKeyId: apiKey.id,
            name: apiKey.name,
            scopes: JSON.parse(apiKey.scopes || '[]'),
            expiresAt: apiKey.expiresAt,
            rateLimit: apiKey.rateLimit,
            isActive: apiKey.isActive,
            createdAt: apiKey.createdAt,
            lastUsedAt: apiKey.lastUsedAt,
            usageCount: apiKey.usageCount,
        }));
    }
    async updateApiKey(apiKeyId, apiKeyDto, user) {
        this.logger.log(`Updating API key: ${apiKeyId}`);
        const apiKey = await this.prisma.apiKey.findFirst({
            where: {
                id: apiKeyId,
                tenantId: user.tenantId,
            },
        });
        if (!apiKey) {
            throw new common_1.NotFoundException('API key not found');
        }
        const updatedApiKey = await this.prisma.apiKey.update({
            where: { id: apiKeyId },
            data: {
                ...apiKeyDto,
                scopes: apiKeyDto.scopes ? JSON.stringify(apiKeyDto.scopes) : undefined,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'API_KEY_UPDATED',
            entityType: 'API_KEY',
            entityId: apiKeyId,
            userId: user.id,
            details: apiKeyDto,
        });
        return {
            apiKeyId: updatedApiKey.id,
            name: updatedApiKey.name,
            scopes: JSON.parse(updatedApiKey.scopes),
            expiresAt: updatedApiKey.expiresAt,
            rateLimit: updatedApiKey.rateLimit,
            isActive: updatedApiKey.isActive,
        };
    }
    async revokeApiKey(apiKeyId, user) {
        this.logger.log(`Revoking API key: ${apiKeyId}`);
        const apiKey = await this.prisma.apiKey.findFirst({
            where: {
                id: apiKeyId,
                tenantId: user.tenantId,
            },
        });
        if (!apiKey) {
            throw new common_1.NotFoundException('API key not found');
        }
        await this.prisma.apiKey.update({
            where: { id: apiKeyId },
            data: {
                isActive: false,
                revokedAt: new Date(),
                revokedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'API_KEY_REVOKED',
            entityType: 'API_KEY',
            entityId: apiKeyId,
            userId: user.id,
        });
    }
    async rotateApiKey(apiKeyId, user) {
        this.logger.log(`Rotating API key: ${apiKeyId}`);
        const apiKey = await this.prisma.apiKey.findFirst({
            where: {
                id: apiKeyId,
                tenantId: user.tenantId,
            },
        });
        if (!apiKey) {
            throw new common_1.NotFoundException('API key not found');
        }
        const newKey = this.generateApiKey();
        const updatedApiKey = await this.prisma.apiKey.update({
            where: { id: apiKeyId },
            data: {
                key: newKey,
                lastRotatedAt: new Date(),
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'API_KEY_ROTATED',
            entityType: 'API_KEY',
            entityId: apiKeyId,
            userId: user.id,
        });
        return {
            apiKeyId: updatedApiKey.id,
            name: updatedApiKey.name,
            key: newKey,
            scopes: JSON.parse(updatedApiKey.scopes),
        };
    }
    async validateApiKey(key, scopes) {
        this.logger.log(`Validating API key`);
        const apiKey = await this.prisma.apiKey.findFirst({
            where: {
                key,
                isActive: true,
            },
        });
        if (!apiKey) {
            throw new common_1.BadRequestException('Invalid API key');
        }
        if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
            throw new common_1.BadRequestException('API key has expired');
        }
        const keyScopes = JSON.parse(apiKey.scopes || '[]');
        const hasScopes = scopes.every(scope => keyScopes.includes(scope));
        if (!hasScopes) {
            throw new common_1.BadRequestException('API key does not have required scopes');
        }
        await this.prisma.apiKey.update({
            where: { id: apiKey.id },
            data: {
                usageCount: { increment: 1 },
                lastUsedAt: new Date(),
            },
        });
        return {
            tenantId: apiKey.tenantId,
            scopes: keyScopes,
            rateLimit: apiKey.rateLimit,
        };
    }
    async getApiKeyUsage(apiKeyId, user) {
        this.logger.log(`Getting API key usage: ${apiKeyId}`);
        const apiKey = await this.prisma.apiKey.findFirst({
            where: {
                id: apiKeyId,
                tenantId: user.tenantId,
            },
        });
        if (!apiKey) {
            throw new common_1.NotFoundException('API key not found');
        }
        const usageStats = await this.prisma.apiKeyUsage.groupBy({
            by: ['endpoint'],
            where: { apiKeyId },
            _count: { endpoint: true },
            _sum: { requestCount: true },
        });
        return {
            apiKeyId,
            name: apiKey.name,
            usageCount: apiKey.usageCount,
            lastUsedAt: apiKey.lastUsedAt,
            usageStats,
        };
    }
    generateApiKey() {
        const prefix = 'sk-';
        const random = Math.random().toString(36).substr(2, 32);
        return `${prefix}${random}`;
    }
    async getAvailableScopes() {
        return [
            'patients:read',
            'patients:write',
            'appointments:read',
            'appointments:write',
            'reports:read',
            'reports:write',
            'prescriptions:read',
            'prescriptions:write',
            'billing:read',
            'billing:write',
            'webhooks:read',
            'webhooks:write',
            'integrations:read',
            'integrations:write',
        ];
    }
};
exports.ApiKeyService = ApiKeyService;
exports.ApiKeyService = ApiKeyService = ApiKeyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ApiKeyService);
//# sourceMappingURL=api-key.service.js.map