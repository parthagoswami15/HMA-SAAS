import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CreateAadhaarDto, UpdateAadhaarDto, AadhaarConsentDto } from '../dto/aadhaar.dto';
export declare class AadhaarService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    createAadhaar(createAadhaarDto: CreateAadhaarDto, user: any): Promise<{
        id: any;
        patientId: any;
        maskedAadhaar: any;
        consentGiven: any;
        consentDate: any;
        createdAt: any;
    }>;
    updateAadhaar(id: string, updateAadhaarDto: UpdateAadhaarDto, user: any): Promise<{
        id: any;
        patientId: any;
        maskedAadhaar: any;
        consentGiven: any;
        consentDate: any;
        updatedAt: any;
    }>;
    recordConsent(id: string, consentDto: AadhaarConsentDto, user: any): Promise<{
        id: any;
        consentGiven: any;
        consentDate: any;
    }>;
    getAadhaar(id: string, user: any): Promise<any>;
    getComplianceStatus(): Promise<{
        totalRecords: any;
        compliantRecords: any;
        nonCompliantRecords: number;
        compliancePercentage: number;
        lastUpdated: Date;
    }>;
    validateCompliance(entityId: string): Promise<{
        isCompliant: boolean;
        issues: string[];
    }>;
    verifyAadhaar(aadhaarNumber: string, recordId: string): Promise<boolean>;
    getPatientAadhaar(patientId: string, user: any): Promise<any>;
}
