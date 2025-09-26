import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
export declare class MfaService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    setupMfa(user: any): Promise<{
        secret: any;
        qrCodeUrl: any;
        backupCodes: never[];
    }>;
    verifyMfa(verifyDto: any, user: any): Promise<{
        success: boolean;
        backupCodes: any;
        message: string;
    } | {
        success: boolean;
        backupCodes?: undefined;
        message?: undefined;
    }>;
    disableMfa(disableDto: any, user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getMfaStatus(user: any): Promise<{
        userId: any;
        mfaEnabled: any;
        backupCodesCount: any;
    }>;
    regenerateBackupCodes(user: any): Promise<string[]>;
    validateMfaToken(userId: string, token: string): Promise<boolean>;
    getMfaSetupStatus(user: any): Promise<{
        setupInitiated: boolean;
        secret?: undefined;
        backupCodes?: undefined;
    } | {
        setupInitiated: boolean;
        secret: any;
        backupCodes: any;
    }>;
}
