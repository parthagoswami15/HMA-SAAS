import { PolicyType, PreAuthStatus, ClaimStatus, AuthorizationStatus, FlowType } from '@prisma/client';
export declare class CreatePlanDto {
    name: string;
    code: string;
    description?: string;
    payerId: string;
    policyType: PolicyType;
    flowType: FlowType;
    sumInsured: number;
    deductible?: number;
    roomRentLimit?: number;
    icuLimit?: number;
    copayPercent?: number;
    opdLimit?: number;
    pharmacyLimit?: number;
    networkType?: string;
    preAuthRequired?: boolean;
    claimTAT?: number;
    exclusions?: string[];
    inclusions?: string[];
}
export declare class UpdatePlanDto {
    name?: string;
    code?: string;
    description?: string;
    policyType?: PolicyType;
    flowType?: FlowType;
    sumInsured?: number;
    deductible?: number;
    roomRentLimit?: number;
    icuLimit?: number;
    copayPercent?: number;
    opdLimit?: number;
    pharmacyLimit?: number;
    networkType?: string;
    preAuthRequired?: boolean;
    claimTAT?: number;
    exclusions?: string[];
    inclusions?: string[];
}
export declare class CreatePolicyDto {
    policyNumber: string;
    planId: string;
    patientId: string;
    primaryInsuredId?: string;
    startDate: string;
    endDate: string;
    sumInsuredUsed?: number;
    tpaId?: string;
}
export declare class UpdatePolicyDto {
    policyNumber?: string;
    planId?: string;
    primaryInsuredId?: string;
    startDate?: string;
    endDate?: string;
    sumInsuredUsed?: number;
    opdLimitUsed?: number;
    pharmacyLimitUsed?: number;
    roomRentUsed?: number;
    icuUsed?: number;
    tpaId?: string;
    status?: string;
}
export declare class CreateTPADto {
    name: string;
    code: string;
    contact?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
}
export declare class UpdateTPADto {
    name?: string;
    code?: string;
    contact?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
}
export declare class CreatePreAuthDto {
    policyId: string;
    planId: string;
    patientId: string;
    visitId?: string;
    tpaId?: string;
    requestedAmount: number;
    status?: PreAuthStatus;
    priority?: string;
    diagnosis?: string;
    procedureCodes?: string[];
    clinicalNotes?: string;
    estimatedLOS?: number;
    roomType?: string;
}
export declare class UpdatePreAuthDto {
    requestedAmount?: number;
    approvedAmount?: number;
    status?: PreAuthStatus;
    priority?: string;
    diagnosis?: string;
    procedureCodes?: string[];
    clinicalNotes?: string;
    estimatedLOS?: number;
    roomType?: string;
    approvedAt?: string;
    rejectedAt?: string;
    approvedBy?: string;
    rejectionReason?: string;
    tpaReferenceNumber?: string;
}
export declare class SubmitPreAuthDto {
    preAuthId: string;
    documents?: Array<{
        documentType: string;
        fileName: string;
        fileUrl: string;
        fileSize?: number;
    }>;
}
export declare class CreateAuthorizationDto {
    preAuthId: string;
    policyId: string;
    patientId: string;
    tpaId?: string;
    approvedAmount: number;
    validFrom: string;
    validUntil: string;
    roomTypeApproved?: string;
    icuApproved?: boolean;
    pharmacyLimit?: number;
    opdLimit?: number;
    specialConditions?: string;
    approvalNotes?: string;
    approvedBy?: string;
}
export declare class UpdateAuthorizationDto {
    approvedAmount?: number;
    utilizedAmount?: number;
    status?: AuthorizationStatus;
    validFrom?: string;
    validUntil?: string;
    roomTypeApproved?: string;
    icuApproved?: boolean;
    pharmacyLimit?: number;
    opdLimit?: number;
    specialConditions?: string;
    approvalNotes?: string;
    exhaustedAt?: string;
}
export declare class CreateClaimDto {
    invoiceId: string;
    policyId: string;
    planId: string;
    patientId: string;
    preAuthId?: string;
    authorizationId?: string;
    tpaId?: string;
    claimedAmount: number;
    status?: ClaimStatus;
}
export declare class UpdateClaimDto {
    claimedAmount?: number;
    approvedAmount?: number;
    rejectedAmount?: number;
    patientShare?: number;
    status?: ClaimStatus;
    denialCodes?: string[];
    denialReasons?: string;
    submittedAt?: string;
    processedAt?: string;
    settledAt?: string;
    processedBy?: string;
    settlementRef?: string;
}
export declare class SubmitClaimDto {
    claimId: string;
    documents?: Array<{
        documentType: string;
        fileName: string;
        fileUrl: string;
        fileSize?: number;
    }>;
}
export declare class CreateEOBDto {
    claimId: string;
    eobNumber?: string;
    processedDate: string;
    paymentDate?: string;
    paymentRef?: string;
    totalClaimed: number;
    totalApproved: number;
    totalRejected?: number;
    patientShare?: number;
    disallowances?: any;
    paymentDetails?: any;
    remarks?: string;
    processedBy?: string;
}
export declare class CreatePayerConfigDto {
    payerId: string;
    configKey: string;
    configValue?: any;
}
export declare class UpdatePayerConfigDto {
    configKey?: string;
    configValue?: any;
}
export declare class EligibilityCheckDto {
    policyNumber: string;
    patientId: string;
    serviceCode?: string;
    amount?: number;
}
export declare class BillSplitDto {
    invoiceId: string;
    policyId?: string;
    preAuthId?: string;
    authorizationId?: string;
}
export declare class RoomUpgradeDto {
    admissionId: string;
    newRoomType: string;
    differentialAmount: number;
    approvalRef?: string;
}
export declare class PreAuthQueryDto {
    patientId?: string;
    policyId?: string;
    tpaId?: string;
    status?: PreAuthStatus;
    fromDate?: string;
    toDate?: string;
}
export declare class ClaimQueryDto {
    patientId?: string;
    policyId?: string;
    tpaId?: string;
    status?: ClaimStatus;
    fromDate?: string;
    toDate?: string;
}
export declare class AuthorizationQueryDto {
    patientId?: string;
    policyId?: string;
    status?: AuthorizationStatus;
    validFrom?: string;
    validUntil?: string;
}
export declare class ClaimSettlementDto {
    claimId: string;
    settlementRef?: string;
    paymentDate?: string;
    paymentAmount: number;
    shortPayment?: number;
    remarks?: string;
    disallowances?: any;
    paymentDetails?: any;
}
