import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class PacsService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    uploadStudy(studyDto: any, user: any): Promise<{
        studyId: any;
        studyInstanceUid: any;
        status: string;
    }>;
    getStudy(studyId: string, user: any): Promise<{
        studyId: any;
        patient: any;
        studyInstanceUid: any;
        modality: any;
        studyDescription: any;
        studyDate: any;
        studyTime: any;
        status: any;
        reports: any;
        metadata: any;
    }>;
    getPatientStudies(patientId: string, user: any): Promise<any>;
    addStudyReport(studyId: string, reportDto: any, user: any): Promise<{
        reportId: any;
        studyId: string;
        status: string;
    }>;
    getStatus(tenantId: string): Promise<{
        integrationType: string;
        status: string;
        lastSyncAt: any;
        isActive: any;
    }>;
    getStats(tenantId: string): Promise<{
        totalStudies: any;
        totalReports: any;
        studiesByModality: any;
        studiesByStatus: any;
    }>;
    retryOperation(log: any): Promise<{
        success: boolean;
        message: string;
    }>;
    private storeDicomData;
}
