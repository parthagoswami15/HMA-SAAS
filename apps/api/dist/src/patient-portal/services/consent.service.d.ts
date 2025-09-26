import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class ConsentService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getConsents(user: any): Promise<any>;
    createConsent(consentDto: any, user: any): Promise<any>;
    updateConsent(consentId: string, updateDto: any, user: any): Promise<any>;
    revokeConsent(consentId: string, user: any): Promise<any>;
    getConsentStatus(consentId: string, user: any): Promise<{
        consentId: string;
        status: any;
        isValid: boolean;
        validFrom: any;
        validUntil: any;
        daysUntilExpiry: number | null;
    }>;
    getActiveConsents(user: any): Promise<any>;
    getConsentHistory(user: any): Promise<any>;
    getConsentStats(user: any): Promise<{
        userId: any;
        totalConsents: any;
        activeConsents: any;
        revokedConsents: any;
        consentsByType: any;
    }>;
    private isConsentValid;
    private getDaysUntilExpiry;
    getConsentTemplate(consentType: string): Promise<{
        consentType: any;
        title: any;
        content: any;
        version: any;
        isMandatory: any;
        validForDays: any;
    }>;
    getAllConsentTemplates(): Promise<any>;
}
