import { PrismaService } from '../../prisma/prisma.service';
import { StateRestrictionService } from './state-restriction.service';
import { AuditService } from '../../audit/audit.service';
import { ComplianceService } from '../../compliance/compliance.service';
export declare class PrescriptionService {
    private readonly prisma;
    private readonly stateRestrictionService;
    private readonly auditService;
    private readonly complianceService;
    private readonly logger;
    constructor(prisma: PrismaService, stateRestrictionService: StateRestrictionService, auditService: AuditService, complianceService: ComplianceService);
    createPrescription(prescriptionDto: any, user: any): Promise<any>;
    getConsultationPrescription(consultationId: string, user: any): Promise<any>;
    sharePrescription(id: string, shareDto: any, user: any): Promise<{
        prescriptionId: string;
        shareMethod: any;
        sharedAt: Date;
        expiresAt: Date | null;
    }>;
    generatePrescriptionPdf(id: string, user: any): Promise<Buffer<ArrayBuffer>>;
    generateFinalPrescription(consultationId: string, user: any): Promise<any>;
    updatePrescription(id: string, updateDto: any, user: any): Promise<any>;
    cancelPrescription(id: string, reason: string, user: any): Promise<any>;
    private generatePrescriptionPdfContent;
    getPrescriptionHistory(patientId: string, user: any): Promise<any>;
    getPrescriptionById(id: string, user: any): Promise<any>;
}
