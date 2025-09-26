import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createApiKey(apiKeyDto: any, user: any) {
    this.logger.log(`Creating API key for tenant: ${user.tenantId}`);

    const {
      name,
      scopes,
      expiresAt,
      rateLimit,
    } = apiKeyDto;

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

    // Log API key creation
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

  async getApiKeys(user: any) {
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

  async updateApiKey(apiKeyId: string, apiKeyDto: any, user: any) {
    this.logger.log(`Updating API key: ${apiKeyId}`);

    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        tenantId: user.tenantId,
      },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    const updatedApiKey = await this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        ...apiKeyDto,
        scopes: apiKeyDto.scopes ? JSON.stringify(apiKeyDto.scopes) : undefined,
        updatedAt: new Date(),
      },
    });

    // Log API key update
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

  async revokeApiKey(apiKeyId: string, user: any) {
    this.logger.log(`Revoking API key: ${apiKeyId}`);

    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        tenantId: user.tenantId,
      },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    await this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedBy: user.id,
      },
    });

    // Log API key revocation
    await this.auditService.logActivity({
      action: 'API_KEY_REVOKED',
      entityType: 'API_KEY',
      entityId: apiKeyId,
      userId: user.id,
    });
  }

  async rotateApiKey(apiKeyId: string, user: any) {
    this.logger.log(`Rotating API key: ${apiKeyId}`);

    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        tenantId: user.tenantId,
      },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
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

    // Log API key rotation
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

  async validateApiKey(key: string, scopes: string[]): Promise<any> {
    this.logger.log(`Validating API key`);

    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        key,
        isActive: true,
      },
    });

    if (!apiKey) {
      throw new BadRequestException('Invalid API key');
    }

    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      throw new BadRequestException('API key has expired');
    }

    const keyScopes = JSON.parse(apiKey.scopes || '[]');

    // Check if key has required scopes
    const hasScopes = scopes.every(scope => keyScopes.includes(scope));
    if (!hasScopes) {
      throw new BadRequestException('API key does not have required scopes');
    }

    // Update usage
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

  async getApiKeyUsage(apiKeyId: string, user: any) {
    this.logger.log(`Getting API key usage: ${apiKeyId}`);

    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        tenantId: user.tenantId,
      },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    // Get usage statistics
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

  private generateApiKey(): string {
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
}
