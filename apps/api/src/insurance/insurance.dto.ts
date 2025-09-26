import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString, IsArray, IsDecimal, Min } from 'class-validator';
import { PolicyType, PreAuthStatus, ClaimStatus, AuthorizationStatus, FlowType } from '@prisma/client';

// Plan DTOs
export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  payerId: string;

  @IsEnum(PolicyType)
  policyType: PolicyType;

  @IsEnum(FlowType)
  flowType: FlowType;

  @IsDecimal()
  sumInsured: number;

  @IsOptional()
  @IsDecimal()
  deductible?: number;

  @IsOptional()
  @IsDecimal()
  roomRentLimit?: number;

  @IsOptional()
  @IsDecimal()
  icuLimit?: number;

  @IsOptional()
  @IsDecimal()
  copayPercent?: number;

  @IsOptional()
  @IsDecimal()
  opdLimit?: number;

  @IsOptional()
  @IsDecimal()
  pharmacyLimit?: number;

  @IsOptional()
  @IsString()
  networkType?: string;

  @IsOptional()
  @IsBoolean()
  preAuthRequired?: boolean;

  @IsOptional()
  @IsNumber()
  claimTAT?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclusions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[];
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PolicyType)
  policyType?: PolicyType;

  @IsOptional()
  @IsEnum(FlowType)
  flowType?: FlowType;

  @IsOptional()
  @IsDecimal()
  sumInsured?: number;

  @IsOptional()
  @IsDecimal()
  deductible?: number;

  @IsOptional()
  @IsDecimal()
  roomRentLimit?: number;

  @IsOptional()
  @IsDecimal()
  icuLimit?: number;

  @IsOptional()
  @IsDecimal()
  copayPercent?: number;

  @IsOptional()
  @IsDecimal()
  opdLimit?: number;

  @IsOptional()
  @IsDecimal()
  pharmacyLimit?: number;

  @IsOptional()
  @IsString()
  networkType?: string;

  @IsOptional()
  @IsBoolean()
  preAuthRequired?: boolean;

  @IsOptional()
  @IsNumber()
  claimTAT?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclusions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[];
}

// Policy DTOs
export class CreatePolicyDto {
  @IsString()
  policyNumber: string;

  @IsString()
  planId: string;

  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  primaryInsuredId?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsDecimal()
  sumInsuredUsed?: number;

  @IsOptional()
  @IsString()
  tpaId?: string;
}

export class UpdatePolicyDto {
  @IsOptional()
  @IsString()
  policyNumber?: string;

  @IsOptional()
  @IsString()
  planId?: string;

  @IsOptional()
  @IsString()
  primaryInsuredId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsDecimal()
  sumInsuredUsed?: number;

  @IsOptional()
  @IsDecimal()
  opdLimitUsed?: number;

  @IsOptional()
  @IsDecimal()
  pharmacyLimitUsed?: number;

  @IsOptional()
  @IsDecimal()
  roomRentUsed?: number;

  @IsOptional()
  @IsDecimal()
  icuUsed?: number;

  @IsOptional()
  @IsString()
  tpaId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

// TPA DTOs
export class CreateTPADto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}

export class UpdateTPADto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}

// PreAuth DTOs
export class CreatePreAuthDto {
  @IsString()
  policyId: string;

  @IsString()
  planId: string;

  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  visitId?: string;

  @IsOptional()
  @IsString()
  tpaId?: string;

  @IsDecimal()
  @Min(0)
  requestedAmount: number;

  @IsOptional()
  @IsEnum(PreAuthStatus)
  status?: PreAuthStatus;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  procedureCodes?: string[];

  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @IsOptional()
  @IsNumber()
  estimatedLOS?: number;

  @IsOptional()
  @IsString()
  roomType?: string;
}

export class UpdatePreAuthDto {
  @IsOptional()
  @IsDecimal()
  @Min(0)
  requestedAmount?: number;

  @IsOptional()
  @IsDecimal()
  @Min(0)
  approvedAmount?: number;

  @IsOptional()
  @IsEnum(PreAuthStatus)
  status?: PreAuthStatus;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  procedureCodes?: string[];

  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @IsOptional()
  @IsNumber()
  estimatedLOS?: number;

  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @IsDateString()
  approvedAt?: string;

  @IsOptional()
  @IsDateString()
  rejectedAt?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  tpaReferenceNumber?: string;
}

export class SubmitPreAuthDto {
  @IsString()
  preAuthId: string;

  @IsOptional()
  @IsArray()
  documents?: Array<{
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
  }>;
}

// Authorization DTOs
export class CreateAuthorizationDto {
  @IsString()
  preAuthId: string;

  @IsString()
  policyId: string;

  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  tpaId?: string;

  @IsDecimal()
  @Min(0)
  approvedAmount: number;

  @IsDateString()
  validFrom: string;

  @IsDateString()
  validUntil: string;

  @IsOptional()
  @IsString()
  roomTypeApproved?: string;

  @IsOptional()
  @IsBoolean()
  icuApproved?: boolean;

  @IsOptional()
  @IsDecimal()
  pharmacyLimit?: number;

  @IsOptional()
  @IsDecimal()
  opdLimit?: number;

  @IsOptional()
  @IsString()
  specialConditions?: string;

  @IsOptional()
  @IsString()
  approvalNotes?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;
}

export class UpdateAuthorizationDto {
  @IsOptional()
  @IsDecimal()
  @Min(0)
  approvedAmount?: number;

  @IsOptional()
  @IsDecimal()
  @Min(0)
  utilizedAmount?: number;

  @IsOptional()
  @IsEnum(AuthorizationStatus)
  status?: AuthorizationStatus;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsString()
  roomTypeApproved?: string;

  @IsOptional()
  @IsBoolean()
  icuApproved?: boolean;

  @IsOptional()
  @IsDecimal()
  pharmacyLimit?: number;

  @IsOptional()
  @IsDecimal()
  opdLimit?: number;

  @IsOptional()
  @IsString()
  specialConditions?: string;

  @IsOptional()
  @IsString()
  approvalNotes?: string;

  @IsOptional()
  @IsDateString()
  exhaustedAt?: string;
}

// Claim DTOs
export class CreateClaimDto {
  @IsString()
  invoiceId: string;

  @IsString()
  policyId: string;

  @IsString()
  planId: string;

  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  preAuthId?: string;

  @IsOptional()
  @IsString()
  authorizationId?: string;

  @IsOptional()
  @IsString()
  tpaId?: string;

  @IsDecimal()
  @Min(0)
  claimedAmount: number;

  @IsOptional()
  @IsEnum(ClaimStatus)
  status?: ClaimStatus;
}

export class UpdateClaimDto {
  @IsOptional()
  @IsDecimal()
  @Min(0)
  claimedAmount?: number;

  @IsOptional()
  @IsDecimal()
  @Min(0)
  approvedAmount?: number;

  @IsOptional()
  @IsDecimal()
  @Min(0)
  rejectedAmount?: number;

  @IsOptional()
  @IsDecimal()
  @Min(0)
  patientShare?: number;

  @IsOptional()
  @IsEnum(ClaimStatus)
  status?: ClaimStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  denialCodes?: string[];

  @IsOptional()
  @IsString()
  denialReasons?: string;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsOptional()
  @IsDateString()
  processedAt?: string;

  @IsOptional()
  @IsDateString()
  settledAt?: string;

  @IsOptional()
  @IsString()
  processedBy?: string;

  @IsOptional()
  @IsString()
  settlementRef?: string;
}

export class SubmitClaimDto {
  @IsString()
  claimId: string;

  @IsOptional()
  @IsArray()
  documents?: Array<{
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
  }>;
}

// EOB DTOs
export class CreateEOBDto {
  @IsString()
  claimId: string;

  @IsOptional()
  @IsString()
  eobNumber?: string;

  @IsDateString()
  processedDate: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsString()
  paymentRef?: string;

  @IsDecimal()
  @Min(0)
  totalClaimed: number;

  @IsDecimal()
  @Min(0)
  totalApproved: number;

  @IsOptional()
  @IsDecimal()
  totalRejected?: number;

  @IsOptional()
  @IsDecimal()
  patientShare?: number;

  @IsOptional()
  disallowances?: any;

  @IsOptional()
  paymentDetails?: any;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  processedBy?: string;
}

// Payer Config DTOs
export class CreatePayerConfigDto {
  @IsString()
  payerId: string;

  @IsString()
  configKey: string;

  @IsOptional()
  configValue?: any;
}

export class UpdatePayerConfigDto {
  @IsOptional()
  @IsString()
  configKey?: string;

  @IsOptional()
  configValue?: any;
}

// Workflow DTOs
export class EligibilityCheckDto {
  @IsString()
  policyNumber: string;

  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  serviceCode?: string;

  @IsOptional()
  @IsDecimal()
  @Min(0)
  amount?: number;
}

export class BillSplitDto {
  @IsString()
  invoiceId: string;

  @IsOptional()
  @IsString()
  policyId?: string;

  @IsOptional()
  @IsString()
  preAuthId?: string;

  @IsOptional()
  @IsString()
  authorizationId?: string;
}

export class RoomUpgradeDto {
  @IsString()
  admissionId: string;

  @IsString()
  newRoomType: string;

  @IsDecimal()
  @Min(0)
  differentialAmount: number;

  @IsOptional()
  @IsString()
  approvalRef?: string;
}

// Query DTOs
export class PreAuthQueryDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  policyId?: string;

  @IsOptional()
  @IsString()
  tpaId?: string;

  @IsOptional()
  @IsEnum(PreAuthStatus)
  status?: PreAuthStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}

export class ClaimQueryDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  policyId?: string;

  @IsOptional()
  @IsString()
  tpaId?: string;

  @IsOptional()
  @IsEnum(ClaimStatus)
  status?: ClaimStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}

export class AuthorizationQueryDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  policyId?: string;

  @IsOptional()
  @IsEnum(AuthorizationStatus)
  status?: AuthorizationStatus;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;
}

// Claim Settlement DTOs
export class ClaimSettlementDto {
  @IsString()
  claimId: string;

  @IsOptional()
  @IsString()
  settlementRef?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsDecimal()
  @Min(0)
  paymentAmount: number;

  @IsOptional()
  @IsDecimal()
  shortPayment?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  disallowances?: any;

  @IsOptional()
  paymentDetails?: any;
}
