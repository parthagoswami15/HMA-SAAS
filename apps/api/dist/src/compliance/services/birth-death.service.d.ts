import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CreateBirthRegistrationDto, UpdateBirthRegistrationDto, BirthRegistrationApprovalDto, CreateDeathRegistrationDto, UpdateDeathRegistrationDto, DeathRegistrationApprovalDto } from '../dto/birth-death.dto';
export declare class BirthDeathService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    createBirthRegistration(createDto: CreateBirthRegistrationDto, user: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        createdAt: any;
    }>;
    updateBirthRegistration(id: string, updateDto: UpdateBirthRegistrationDto, user: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        updatedAt: any;
    }>;
    approveBirthRegistration(id: string, approvalDto: BirthRegistrationApprovalDto, user: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        approvedAt: any;
    }>;
    createDeathRegistration(createDto: CreateDeathRegistrationDto, user: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        createdAt: any;
    }>;
    updateDeathRegistration(id: string, updateDto: UpdateDeathRegistrationDto, user: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        updatedAt: any;
    }>;
    approveDeathRegistration(id: string, approvalDto: DeathRegistrationApprovalDto, user: any): Promise<{
        id: any;
        registrationNumber: any;
        status: any;
        approvedAt: any;
    }>;
    getComplianceStatus(): Promise<{
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
    }>;
    validateCompliance(entityId: string): Promise<{
        isCompliant: boolean;
        issues: string[];
    }>;
    private generateRegistrationNumber;
    private createRegistryExport;
    getBirthRegistrations(query: any, user: any): Promise<{
        registrations: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getDeathRegistrations(query: any, user: any): Promise<{
        registrations: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
}
