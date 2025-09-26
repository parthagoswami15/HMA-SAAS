import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CreatePrescriptionDto, UpdatePrescriptionDto, NarcoticsRegisterDto } from '../dto/prescription.dto';
export declare class PrescriptionService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    createPrescription(createDto: CreatePrescriptionDto, user: any): Promise<{
        id: any;
        status: any;
        validTill: any;
        createdAt: any;
    }>;
    updatePrescription(id: string, updateDto: UpdatePrescriptionDto, user: any): Promise<{
        id: any;
        status: any;
        validTill: any;
        updatedAt: any;
    }>;
    recordNarcoticsDispense(registerDto: NarcoticsRegisterDto, user: any): Promise<{
        id: any;
        dispensedAt: any;
    }>;
    getComplianceStatus(): Promise<{
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
    }>;
    validateCompliance(entityId: string): Promise<{
        isCompliant: boolean;
        issues: string[];
    }>;
    private validateScheduleDrugPrescription;
    getPrescriptionHistory(patientId: string, user: any): Promise<any>;
    getNarcoticsRegister(query: any, user: any): Promise<{
        registers: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    cancelPrescription(id: string, reason: string, user: any): Promise<any>;
}
