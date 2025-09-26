import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class IdentityVerificationService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    verifyIdentity(identityDto: any, user: any): Promise<{
        success: boolean;
        error: string;
        method?: undefined;
        verifiedAt?: undefined;
    } | {
        success: boolean;
        method: string;
        verifiedAt: Date;
        error: string | null;
    } | {
        success: boolean;
        method: string;
        verifiedAt: Date;
        error?: undefined;
    } | {
        verified: boolean;
        method: string;
    }>;
    isVerificationRequired(consultation: any): Promise<{
        required: boolean;
        reason: string;
        methods?: undefined;
    } | {
        required: boolean;
        reason: string;
        methods: any;
    }>;
    getVerificationStatus(consultationId: string, user: any): Promise<{
        consultationId: string;
        required: boolean;
        reason: string;
        methods: any;
        verifications: any;
        isVerified: any;
    }>;
    private verifyAadhaar;
    private verifyOtp;
    private verifyVideo;
    private verifyDocument;
    sendOtp(phoneNumber: string, user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    resendOtp(phoneNumber: string, user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getVerificationHistory(user: any): Promise<any>;
    getVerificationStats(user: any): Promise<{
        total: any;
        successful: any;
        failed: number;
        successRate: number;
        byMethod: any;
    }>;
}
