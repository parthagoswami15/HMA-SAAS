import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
export declare class DataLocalizationService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    getLocalizationStatus(user: any): Promise<{
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
    ensureCompliance(complianceDto: any, user: any): Promise<{
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
    validateCompliance(entityId: string): Promise<{
        isCompliant: boolean;
        issues: string[];
    }>;
    private localizePatientData;
    private localizeRecordData;
    private validateHighSensitivityData;
    private calculateComplianceScore;
    getDataCenters(user: any): Promise<any>;
    getLocalizationReports(query: any, user: any): Promise<{
        data: any;
        total: any;
        period: {
            from: any;
            to: any;
        };
    }>;
    checkComplianceRequirements(entityType: string, sensitivityLevel: string, user: any): Promise<{
        dataLocalization: boolean;
        encryption: boolean;
        accessControl: boolean;
        auditLogging: boolean;
        backupRetention: boolean;
    }>;
}
