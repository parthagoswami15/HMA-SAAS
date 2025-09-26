import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class StateRestrictionService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    validatePrescriptionRestrictions(state: string, userId: string): Promise<{
        allowed: boolean;
        restrictions?: undefined;
    } | {
        allowed: boolean;
        restrictions: {
            restrictedDrugs: any;
            requiredLicenses: any;
            specialConditions: any;
        };
    }>;
    validateScheduleDrugPrescription(medication: any, userId: string): Promise<{
        allowed: boolean;
    }>;
    getStateRestrictions(state: string, user: any): Promise<{
        state: string;
        allowed: boolean;
        restrictions: {
            restrictedDrugs: never[];
            requiredLicenses: never[];
            specialConditions: null;
            lastUpdated?: undefined;
        };
    } | {
        state: string;
        allowed: boolean;
        restrictions: {
            restrictedDrugs: any;
            requiredLicenses: any;
            specialConditions: any;
            lastUpdated: any;
        };
    }>;
    updateStateRestrictions(state: string, restrictionsDto: any, user: any): Promise<any>;
    getAllStateRestrictions(): Promise<any>;
    checkDrugAvailability(drugName: string, state: string): Promise<{
        available: boolean;
        restrictions: null;
        state?: undefined;
    } | {
        available: boolean;
        restrictions: string | null;
        state: string;
    }>;
    validateTelemedicinePrescription(state: string, userId: string): Promise<{
        allowed: boolean;
        rules?: undefined;
    } | {
        allowed: boolean;
        rules: {
            requiredExperience: any;
            requiredSpecializations: any;
            maxPrescriptionsPerDay: any;
            allowedDrugCategories: any;
        };
    }>;
    getPrescriptionLimits(state: string, userId: string): Promise<{
        state: string;
        dailyLimit: any;
        todaysCount: any;
        remaining: number;
        restrictions: {
            restrictedDrugs: any;
            requiredLicenses: any;
        } | null;
    }>;
}
