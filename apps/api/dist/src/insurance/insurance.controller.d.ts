import { InsuranceService } from './insurance.service';
import { CreatePlanDto, UpdatePlanDto, CreatePolicyDto, UpdatePolicyDto, CreateTPADto, UpdateTPADto, CreatePreAuthDto, UpdatePreAuthDto, SubmitPreAuthDto, CreateAuthorizationDto, UpdateAuthorizationDto, CreateClaimDto, UpdateClaimDto, SubmitClaimDto, CreateEOBDto, CreatePayerConfigDto, UpdatePayerConfigDto, EligibilityCheckDto, BillSplitDto, RoomUpgradeDto, PreAuthQueryDto, ClaimQueryDto, AuthorizationQueryDto, ClaimSettlementDto } from './insurance.dto';
export declare class InsuranceController {
    private svc;
    constructor(svc: InsuranceService);
    createPlan(tenantId: string, dto: CreatePlanDto): Promise<any>;
    getPlans(tenantId: string, payerId?: string): Promise<any>;
    getPlan(tenantId: string, id: string): Promise<any>;
    updatePlan(tenantId: string, id: string, dto: UpdatePlanDto): Promise<any>;
    deletePlan(tenantId: string, id: string): Promise<any>;
    createPolicy(tenantId: string, dto: CreatePolicyDto): Promise<any>;
    getPolicies(tenantId: string, patientId?: string): Promise<any>;
    getPolicy(tenantId: string, id: string): Promise<any>;
    updatePolicy(tenantId: string, id: string, dto: UpdatePolicyDto): Promise<any>;
    deletePolicy(tenantId: string, id: string): Promise<any>;
    createTPA(tenantId: string, dto: CreateTPADto): Promise<any>;
    getTPAs(tenantId: string): Promise<any>;
    getTPA(tenantId: string, id: string): Promise<any>;
    updateTPA(tenantId: string, id: string, dto: UpdateTPADto): Promise<any>;
    deleteTPA(tenantId: string, id: string): Promise<any>;
    createPreAuth(tenantId: string, dto: CreatePreAuthDto): Promise<any>;
    getPreAuths(tenantId: string, query: PreAuthQueryDto): Promise<any>;
    getPreAuth(tenantId: string, id: string): Promise<any>;
    updatePreAuth(tenantId: string, id: string, dto: UpdatePreAuthDto): Promise<any>;
    submitPreAuth(tenantId: string, id: string, dto: SubmitPreAuthDto): Promise<any>;
    deletePreAuth(tenantId: string, id: string): Promise<any>;
    createAuthorization(tenantId: string, dto: CreateAuthorizationDto): Promise<any>;
    getAuthorizations(tenantId: string, query: AuthorizationQueryDto): Promise<any>;
    getAuthorization(tenantId: string, id: string): Promise<any>;
    updateAuthorization(tenantId: string, id: string, dto: UpdateAuthorizationDto): Promise<any>;
    deleteAuthorization(tenantId: string, id: string): Promise<any>;
    createClaim(tenantId: string, dto: CreateClaimDto): Promise<any>;
    getClaims(tenantId: string, query: ClaimQueryDto): Promise<any>;
    getClaim(tenantId: string, id: string): Promise<any>;
    updateClaim(tenantId: string, id: string, dto: UpdateClaimDto): Promise<any>;
    submitClaim(tenantId: string, id: string, dto: SubmitClaimDto): Promise<any>;
    processClaimSettlement(tenantId: string, id: string, dto: ClaimSettlementDto): Promise<any>;
    createEOB(tenantId: string, dto: CreateEOBDto): Promise<any>;
    getEOB(tenantId: string, id: string): Promise<any>;
    createPayerConfig(tenantId: string, dto: CreatePayerConfigDto): Promise<any>;
    getPayerConfigs(tenantId: string, payerId?: string): Promise<any>;
    updatePayerConfig(tenantId: string, id: string, dto: UpdatePayerConfigDto): Promise<any>;
    deletePayerConfig(tenantId: string, id: string): Promise<any>;
    checkEligibility(tenantId: string, dto: EligibilityCheckDto): Promise<{
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
    splitBill(tenantId: string, dto: BillSplitDto): Promise<any>;
    processRoomUpgrade(tenantId: string, dto: RoomUpgradeDto): Promise<any>;
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
    getInsuranceSummary(tenantId: string, fromDate?: string, toDate?: string): Promise<{
        totalPolicies: any;
        activePreAuths: any;
        pendingClaims: any;
        approvedClaims: any;
        totalClaims: any;
        totalApprovedAmount: any;
    }>;
    handlePartialApproval(tenantId: string, id: string, { approvedAmount, reason }: {
        approvedAmount: number;
        reason: string;
    }): Promise<any>;
    handleExhaustedLimit(tenantId: string, id: string): Promise<any>;
}
