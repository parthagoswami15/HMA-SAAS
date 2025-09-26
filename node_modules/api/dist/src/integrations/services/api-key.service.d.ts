import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class ApiKeyService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    createApiKey(apiKeyDto: any, user: any): Promise<{
        apiKeyId: any;
        name: any;
        key: any;
        scopes: any;
        expiresAt: any;
        rateLimit: any;
        isActive: any;
    }>;
    getApiKeys(user: any): Promise<any>;
    updateApiKey(apiKeyId: string, apiKeyDto: any, user: any): Promise<{
        apiKeyId: any;
        name: any;
        scopes: any;
        expiresAt: any;
        rateLimit: any;
        isActive: any;
    }>;
    revokeApiKey(apiKeyId: string, user: any): Promise<void>;
    rotateApiKey(apiKeyId: string, user: any): Promise<{
        apiKeyId: any;
        name: any;
        key: string;
        scopes: any;
    }>;
    validateApiKey(key: string, scopes: string[]): Promise<any>;
    getApiKeyUsage(apiKeyId: string, user: any): Promise<{
        apiKeyId: string;
        name: any;
        usageCount: any;
        lastUsedAt: any;
        usageStats: any;
    }>;
    private generateApiKey;
    getAvailableScopes(): Promise<string[]>;
}
