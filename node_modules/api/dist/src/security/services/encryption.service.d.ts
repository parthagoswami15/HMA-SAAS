import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
export declare class EncryptionService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    private readonly algorithm;
    private readonly keyLength;
    private readonly ivLength;
    constructor(prisma: PrismaService, auditService: AuditService);
    encryptData(encryptDto: any, user: any): Promise<{
        id: any;
        dataType: any;
        encryptedAt: any;
    }>;
    decryptData(decryptDto: any, user: any): Promise<{
        id: any;
        dataType: any;
        data: any;
        decryptedAt: Date;
    }>;
    encryptField(data: any, fieldName: string, user: any): Promise<any>;
    decryptField(data: any, fieldName: string, user: any): Promise<any>;
    private encryptKey;
    private decryptKey;
    private getMasterKey;
    rotateEncryptionKeys(tenantId: string, user: any): Promise<{
        success: boolean;
        rotatedKeys: any;
    }>;
    getEncryptionStats(tenantId: string): Promise<{
        tenantId: string;
        totalEncryptedData: any;
        keysCount: any;
        dataByType: any;
    }>;
}
