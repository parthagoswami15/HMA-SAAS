import { AadhaarService } from './services/aadhaar.service';
import { AuditService } from './services/audit.service';
import { BirthDeathService } from './services/birth-death.service';
import { PcpndtService } from './services/pcpndt.service';
import { PrescriptionService } from './services/prescription.service';
import { DataLocalizationService } from './services/data-localization.service';
import { ComplianceReportDto } from './dto/compliance.dto';
export declare class ComplianceService {
    private readonly aadhaarService;
    private readonly auditService;
    private readonly birthDeathService;
    private readonly pcpndtService;
    private readonly prescriptionService;
    private readonly dataLocalizationService;
    private readonly logger;
    constructor(aadhaarService: AadhaarService, auditService: AuditService, birthDeathService: BirthDeathService, pcpndtService: PcpndtService, prescriptionService: PrescriptionService, dataLocalizationService: DataLocalizationService);
    generateComplianceReport(query: ComplianceReportDto, user: any): Promise<{
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
    getOverallComplianceStatus(user: any): Promise<{
        status: string;
        percentage: number;
        lastUpdated: Date;
    }>;
    validateCompliance(entityType: string, entityId: string, user: any): Promise<{
        isCompliant: boolean;
        validations: {
            aadhaar: {
                isCompliant: boolean;
                issues: string[];
            };
            audit: {
                isCompliant: boolean;
                issues: never[];
            };
            pcpndt: {
                isCompliant: boolean;
                issues: string[];
            };
            prescription: {
                isCompliant: boolean;
                issues: string[];
            };
            dataLocalization: {
                isCompliant: boolean;
                issues: string[];
            };
        };
        timestamp: Date;
    }>;
}
