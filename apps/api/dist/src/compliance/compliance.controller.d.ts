import { ComplianceService } from './compliance.service';
import { AadhaarService } from './services/aadhaar.service';
import { AuditService } from './services/audit.service';
import { BirthDeathService } from './services/birth-death.service';
import { PcpndtService } from './services/pcpndt.service';
import { PrescriptionService } from './services/prescription.service';
import { DataLocalizationService } from './services/data-localization.service';
import { CreateAadhaarDto, UpdateAadhaarDto, AadhaarConsentDto } from './dto/aadhaar.dto';
import { CreateBirthRegistrationDto, CreateDeathRegistrationDto, UpdateBirthRegistrationDto, UpdateDeathRegistrationDto, BirthRegistrationApprovalDto, DeathRegistrationApprovalDto } from './dto/birth-death.dto';
import { CreatePrescriptionDto, UpdatePrescriptionDto, NarcoticsRegisterDto } from './dto/prescription.dto';
import { AuditLogDto, AuditQueryDto, ComplianceReportDto } from './dto/compliance.dto';
export declare class ComplianceController {
    private readonly complianceService;
    private readonly aadhaarService;
    private readonly auditService;
    private readonly birthDeathService;
    private readonly pcpndtService;
    private readonly prescriptionService;
    private readonly dataLocalizationService;
    constructor(complianceService: ComplianceService, aadhaarService: AadhaarService, auditService: AuditService, birthDeathService: BirthDeathService, pcpndtService: PcpndtService, prescriptionService: PrescriptionService, dataLocalizationService: DataLocalizationService);
    createAadhaar(createAadhaarDto: CreateAadhaarDto, req: any): Promise<{
        id: any;
        patientId: any;
        maskedAadhaar: any;
        consentGiven: any;
        consentDate: any;
        createdAt: any;
    }>;
    updateAadhaar(id: string, updateAadhaarDto: UpdateAadhaarDto, req: any): Promise<{
        id: any;
        patientId: any;
        maskedAadhaar: any;
        consentGiven: any;
        consentDate: any;
        updatedAt: any;
    }>;
    recordAadhaarConsent(id: string, consentDto: AadhaarConsentDto, req: any): Promise<{
        id: any;
        consentGiven: any;
        consentDate: any;
    }>;
    getAadhaar(id: string, req: any): Promise<any>;
    createBirthRegistration(createDto: CreateBirthRegistrationDto, req: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        createdAt: any;
    }>;
    updateBirthRegistration(id: string, updateDto: UpdateBirthRegistrationDto, req: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        updatedAt: any;
    }>;
    approveBirthRegistration(id: string, approvalDto: BirthRegistrationApprovalDto, req: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        approvedAt: any;
    }>;
    createDeathRegistration(createDto: CreateDeathRegistrationDto, req: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        createdAt: any;
    }>;
    updateDeathRegistration(id: string, updateDto: UpdateDeathRegistrationDto, req: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        updatedAt: any;
    }>;
    approveDeathRegistration(id: string, approvalDto: DeathRegistrationApprovalDto, req: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        approvedAt: any;
    }>;
    requestPcpndtAccess(requestDto: any, req: any): Promise<{
        id: any;
        status: any;
        requestedAt: any;
    }>;
    getPcpndtAccessLogs(query: any, req: any): Promise<{
        logs: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    createPrescription(createDto: CreatePrescriptionDto, req: any): Promise<{
        id: any;
        status: any;
        validTill: any;
        createdAt: any;
    }>;
    updatePrescription(id: string, updateDto: UpdatePrescriptionDto, req: any): Promise<{
        id: any;
        status: any;
        validTill: any;
        updatedAt: any;
    }>;
    recordNarcoticsDispense(registerDto: NarcoticsRegisterDto, req: any): Promise<{
        id: any;
        dispensedAt: any;
    }>;
    getAuditLogs(query: AuditQueryDto, req: any): Promise<{
        logs: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    createAuditLog(auditDto: AuditLogDto, req: any): Promise<any>;
    getComplianceReports(query: ComplianceReportDto, req: any): Promise<{
        timestamp: Date;
        generatedBy: any;
        period: string;
        components: {
            aadhaar: {
                totalRecords: any;
                compliantRecords: any;
                nonCompliantRecords: number;
                compliancePercentage: number;
                lastUpdated: Date;
            };
            audit: {
                totalRecords: any;
                compliantRecords: any;
                nonCompliantRecords: number;
                compliancePercentage: number;
                lastUpdated: Date;
                todayActivity: any;
            };
            birthDeath: {
                totalRecords: any;
                compliantRecords: any;
                nonCompliantRecords: number;
                compliancePercentage: number;
                lastUpdated: Date;
                details: {
                    birthRegistrations: {
                        total: any;
                        approved: any;
                    };
                    deathRegistrations: {
                        total: any;
                        approved: any;
                    };
                };
            };
            pcpndt: {
                totalRecords: any;
                compliantRecords: any;
                nonCompliantRecords: any;
                compliancePercentage: number;
                lastUpdated: Date;
                details: {
                    totalRequests: any;
                    approvedRequests: any;
                    deniedRequests: any;
                    pendingRequests: number;
                    totalAccessLogs: any;
                };
            };
            prescription: {
                totalRecords: any;
                compliantRecords: number;
                nonCompliantRecords: any;
                compliancePercentage: number;
                lastUpdated: Date;
                details: {
                    totalPrescriptions: any;
                    prescriptionsWithScheduledDrugs: any;
                    narcoticsDispenses: any;
                    expiredPrescriptions: any;
                };
            };
            dataLocalization: any;
        };
        summary: {
            totalRecords: number;
            compliantRecords: number;
            nonCompliantRecords: number;
            compliancePercentage: number;
        };
    }>;
    getDataLocalizationStatus(req: any): Promise<{
        complianceScore: number;
        summary: {
            totalPatients: any;
            localizedPatients: any;
            localizationPercentage: number;
            totalRecords: any;
            localizedRecords: any;
            recordLocalizationPercentage: number;
        };
        dataCenters: any;
        lastUpdated: Date;
    }>;
    complyWithDataLocalization(complianceDto: any, req: any): Promise<{
        totalRequested: any;
        successful: number;
        failed: number;
        results: {
            entityId: any;
            status: string;
        }[];
        errors: {
            entityId: any;
            error: any;
        }[];
    }>;
}
