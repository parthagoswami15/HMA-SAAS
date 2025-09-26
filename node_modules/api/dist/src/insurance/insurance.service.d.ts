import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto, UpdatePlanDto, CreatePolicyDto, UpdatePolicyDto, CreateTPADto, UpdateTPADto, CreatePreAuthDto, UpdatePreAuthDto, SubmitPreAuthDto, CreateAuthorizationDto, UpdateAuthorizationDto, CreateClaimDto, UpdateClaimDto, SubmitClaimDto, CreateEOBDto, CreatePayerConfigDto, UpdatePayerConfigDto, EligibilityCheckDto, BillSplitDto, RoomUpgradeDto, PreAuthQueryDto, ClaimQueryDto, AuthorizationQueryDto } from './insurance.dto';
export declare class InsuranceService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createPlan(tenantId: string, data: CreatePlanDto): Promise<any>;
    getPlans(tenantId: string, payerId?: string): Promise<any>;
    getPlanById(tenantId: string, id: string): Promise<any>;
    updatePlan(tenantId: string, id: string, data: UpdatePlanDto): Promise<any>;
    deletePlan(tenantId: string, id: string): Promise<any>;
    createPolicy(tenantId: string, data: CreatePolicyDto): Promise<any>;
    getPolicies(tenantId: string, patientId?: string): Promise<any>;
    getPolicyById(tenantId: string, id: string): Promise<any>;
    updatePolicy(tenantId: string, id: string, data: UpdatePolicyDto): Promise<any>;
    deletePolicy(tenantId: string, id: string): Promise<any>;
    createTPA(tenantId: string, data: CreateTPADto): Promise<any>;
    getTPAs(tenantId: string): Promise<any>;
    getTPAById(tenantId: string, id: string): Promise<any>;
    updateTPA(tenantId: string, id: string, data: UpdateTPADto): Promise<any>;
    deleteTPA(tenantId: string, id: string): Promise<any>;
    createPreAuth(tenantId: string, data: CreatePreAuthDto): Promise<any>;
    getPreAuths(tenantId: string, query: PreAuthQueryDto): Promise<any>;
    getPreAuthById(tenantId: string, id: string): Promise<any>;
    updatePreAuth(tenantId: string, id: string, data: UpdatePreAuthDto): Promise<any>;
    submitPreAuth(tenantId: string, data: SubmitPreAuthDto): Promise<any>;
    deletePreAuth(tenantId: string, id: string): Promise<any>;
    createAuthorization(tenantId: string, data: CreateAuthorizationDto): Promise<any>;
    getAuthorizations(tenantId: string, query: AuthorizationQueryDto): Promise<any>;
    getAuthorizationById(tenantId: string, id: string): Promise<any>;
    updateAuthorization(tenantId: string, id: string, data: UpdateAuthorizationDto): Promise<any>;
    deleteAuthorization(tenantId: string, id: string): Promise<any>;
    createClaim(tenantId: string, data: CreateClaimDto): Promise<any>;
    getClaims(tenantId: string, query: ClaimQueryDto): Promise<any>;
    getClaimById(tenantId: string, id: string): Promise<any>;
    updateClaim(tenantId: string, id: string, data: UpdateClaimDto): Promise<any>;
    submitClaim(tenantId: string, data: SubmitClaimDto): Promise<any>;
    deleteClaim(tenantId: string, id: string): Promise<any>;
    createEOB(tenantId: string, data: CreateEOBDto): Promise<any>;
    getEOBById(tenantId: string, id: string): Promise<any>;
    createPayerConfig(tenantId: string, data: CreatePayerConfigDto): Promise<any>;
    getPayerConfigs(tenantId: string, payerId?: string): Promise<any>;
    updatePayerConfig(tenantId: string, id: string, data: UpdatePayerConfigDto): Promise<any>;
    deletePayerConfig(tenantId: string, id: string): Promise<any>;
    getPolicyBalance(tenantId: string, policyId: string): Promise<{
        policy: any;
        balance: {
            sumInsured: {
                total: any;
                used: any;
                remaining: number;
            };
            opd: {
                total: any;
                used: any;
                remaining: number;
            };
            pharmacy: {
                total: any;
                used: any;
                remaining: number;
            };
            roomRent: {
                total: any;
                used: any;
                remaining: number;
            };
        };
        isExhausted: boolean;
    }>;
    checkEligibility(tenantId: string, data: EligibilityCheckDto): Promise<{
        eligible: boolean;
        reason: string;
        policy: any;
        copayPercent?: undefined;
        remainingLimit?: undefined;
    } | {
        eligible: boolean;
        reason: string;
        policy: any;
        copayPercent: any;
        remainingLimit: number;
    }>;
    splitBill(tenantId: string, data: BillSplitDto): Promise<any>;
    processRoomUpgrade(tenantId: string, data: RoomUpgradeDto): Promise<any>;
    processClaimDenial(tenantId: string, claimId: string, denialData: {
        denialCodes: string[];
        denialReasons: string;
        appealedAmount?: number;
        appealReason?: string;
        finalAmount?: number;
    }): Promise<any>;
    private updatePolicyUtilization;
    getInsuranceSummary(tenantId: string, fromDate?: Date, toDate?: Date): Promise<{
        totalPolicies: any;
        activePreAuths: any;
        pendingClaims: any;
        approvedClaims: any;
        totalClaims: any;
        totalApprovedAmount: any;
    }>;
    handlePartialApproval(tenantId: string, preAuthId: string, approvedAmount: number, reason: string): Promise<any>;
    handleExhaustedLimit(tenantId: string, policyId: string): Promise<any>;
}
