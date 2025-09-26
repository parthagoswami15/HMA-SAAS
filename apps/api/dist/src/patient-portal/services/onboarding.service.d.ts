import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class OnboardingService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    onboardPatient(onboardDto: any, req: any): Promise<{
        onboardingId: any;
        message: string;
        expiresIn: number;
    }>;
    verifyOtp(verifyDto: any): Promise<{
        onboardingId: any;
        message: string;
        nextStep: string;
    }>;
    verifyAadhaar(aadhaarDto: any, req: any): Promise<{
        onboardingId: any;
        message: string;
        nextStep: string;
    }>;
    completeProfile(profileDto: any, req: any): Promise<{
        userId: any;
        message: string;
        temporaryPassword: string;
        nextStep: string;
    }>;
    resendOtp(phone: string): Promise<{
        message: string;
        expiresIn: number;
    }>;
    getOnboardingStatus(onboardingId: string): Promise<{
        onboardingId: string;
        phone: any;
        email: any;
        verified: any;
        aadhaarVerified: any;
        otpExpiresAt: any;
    }>;
    private generateOtp;
    private sendOtp;
    private maskAadhaar;
    private verifyAadhaarWithApi;
    getOnboardingStats(tenantId: string): Promise<{
        tenantId: string;
        totalOnboardings: any;
        verifiedOnboardings: any;
        aadhaarVerified: any;
        completedProfiles: any;
        completionRate: number;
    }>;
}
