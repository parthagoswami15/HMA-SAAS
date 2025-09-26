import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PolicyType, PreAuthStatus, ClaimStatus, AuthorizationStatus, FlowType } from '@prisma/client';
import {
  CreatePlanDto, UpdatePlanDto, CreatePolicyDto, UpdatePolicyDto, CreateTPADto, UpdateTPADto,
  CreatePreAuthDto, UpdatePreAuthDto, SubmitPreAuthDto, CreateAuthorizationDto, UpdateAuthorizationDto,
  CreateClaimDto, UpdateClaimDto, SubmitClaimDto, CreateEOBDto, CreatePayerConfigDto, UpdatePayerConfigDto,
  EligibilityCheckDto, BillSplitDto, RoomUpgradeDto, PreAuthQueryDto, ClaimQueryDto, AuthorizationQueryDto, ClaimSettlementDto
} from './insurance.dto';

@Injectable()
export class InsuranceService {
  private readonly logger = new Logger(InsuranceService.name);

  constructor(private prisma: PrismaService) {}

  // ==================== PLAN MANAGEMENT ====================

  async createPlan(tenantId: string, data: CreatePlanDto) {
    return this.prisma.plan.create({
      data: {
        ...data,
        tenantId,
        deductible: data.deductible || 0,
        copayPercent: data.copayPercent || 0,
      },
      include: {
        payer: true,
      },
    });
  }

  async getPlans(tenantId: string, payerId?: string) {
    const where: any = { tenantId };
    if (payerId) where.payerId = payerId;

    return this.prisma.plan.findMany({
      where,
      include: {
        payer: true,
        policies: { select: { id: true } },
      },
    });
  }

  async getPlanById(tenantId: string, id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id, tenantId },
      include: {
        payer: true,
        policies: {
          include: {
            patient: { select: { firstName: true, lastName: true, medicalRecordNumber: true } },
          },
        },
      },
    });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async updatePlan(tenantId: string, id: string, data: UpdatePlanDto) {
    return this.prisma.plan.update({
      where: { id, tenantId },
      data,
    });
  }

  async deletePlan(tenantId: string, id: string) {
    return this.prisma.plan.delete({
      where: { id, tenantId },
    });
  }

  // ==================== POLICY MANAGEMENT ====================

  async createPolicy(tenantId: string, data: CreatePolicyDto) {
    return this.prisma.$transaction(async (tx) => {
      const policy = await tx.policy.create({
        data: {
          ...data,
          tenantId,
        },
        include: {
          plan: { include: { payer: true } },
          patient: { select: { firstName: true, lastName: true } },
          tpa: true,
        },
      });

      // Update primary insured if this is a dependent policy
      if (data.primaryInsuredId) {
        await tx.policy.update({
          where: { id: data.primaryInsuredId },
          data: { dependents: { connect: { id: policy.id } } },
        });
      }

      return policy;
    });
  }

  async getPolicies(tenantId: string, patientId?: string) {
    const where: any = { tenantId };
    if (patientId) where.patientId = patientId;

    return this.prisma.policy.findMany({
      where,
      include: {
        plan: { include: { payer: true } },
        patient: { select: { firstName: true, lastName: true } },
        tpa: true,
        preAuths: { select: { id: true, status: true } },
      },
    });
  }

  async getPolicyById(tenantId: string, id: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id, tenantId },
      include: {
        plan: { include: { payer: true } },
        patient: { select: { firstName: true, lastName: true, medicalRecordNumber: true } },
        tpa: true,
        preAuths: true,
        authorizations: true,
        claims: { include: { invoice: true } },
      },
    });
    if (!policy) throw new NotFoundException('Policy not found');
    return policy;
  }

  async updatePolicy(tenantId: string, id: string, data: UpdatePolicyDto) {
    return this.prisma.policy.update({
      where: { id, tenantId },
      data,
    });
  }

  async deletePolicy(tenantId: string, id: string) {
    return this.prisma.policy.delete({
      where: { id, tenantId },
    });
  }

  // ==================== TPA MANAGEMENT ====================

  async createTPA(tenantId: string, data: CreateTPADto) {
    return this.prisma.tPA.create({
      data: { ...data, tenantId },
    });
  }

  async getTPAs(tenantId: string) {
    return this.prisma.tPA.findMany({
      where: { tenantId },
      include: {
        policies: { select: { id: true } },
        preAuths: { select: { id: true, status: true } },
        claims: { select: { id: true, status: true } },
      },
    });
  }

  async getTPAById(tenantId: string, id: string) {
    const tpa = await this.prisma.tPA.findUnique({
      where: { id, tenantId },
      include: {
        policies: { include: { patient: { select: { firstName: true, lastName: true } } } },
        preAuths: { include: { patient: { select: { firstName: true, lastName: true } } } },
        claims: { include: { patient: { select: { firstName: true, lastName: true } } } },
      },
    });
    if (!tpa) throw new NotFoundException('TPA not found');
    return tpa;
  }

  async updateTPA(tenantId: string, id: string, data: UpdateTPADto) {
    return this.prisma.tPA.update({
      where: { id, tenantId },
      data,
    });
  }

  async deleteTPA(tenantId: string, id: string) {
    return this.prisma.tPA.delete({
      where: { id, tenantId },
    });
  }

  // ==================== PRE-AUTH MANAGEMENT ====================

  async createPreAuth(tenantId: string, data: CreatePreAuthDto) {
    return this.prisma.$transaction(async (tx) => {
      const preAuth = await tx.preAuth.create({
        data: {
          ...data,
          tenantId,
          submittedAt: data.status === PreAuthStatus.SUBMITTED ? new Date() : null,
        },
        include: {
          policy: { include: { plan: { include: { payer: true } }, patient: { select: { firstName: true, lastName: true } } } },
          plan: { include: { payer: true } },
          patient: { select: { firstName: true, lastName: true } },
          tpa: true,
        },
      });

      // Update policy utilization if pre-auth is submitted
      if (data.status === PreAuthStatus.SUBMITTED) {
        await this.updatePolicyUtilization(tx, data.policyId, 0, data.requestedAmount);
      }

      return preAuth;
    });
  }

  async getPreAuths(tenantId: string, query: PreAuthQueryDto) {
    const where: any = { tenantId };

    if (query.patientId) where.patientId = query.patientId;
    if (query.policyId) where.policyId = query.policyId;
    if (query.tpaId) where.tpaId = query.tpaId;
    if (query.status) where.status = query.status;
    if (query.fromDate || query.toDate) {
      where.submittedAt = {};
      if (query.fromDate) where.submittedAt.gte = new Date(query.fromDate);
      if (query.toDate) where.submittedAt.lte = new Date(query.toDate);
    }

    return this.prisma.preAuth.findMany({
      where,
      include: {
        policy: { include: { plan: { include: { payer: true } } } },
        plan: { include: { payer: true } },
        patient: { select: { firstName: true, lastName: true, medicalRecordNumber: true } },
        tpa: true,
        documents: true,
        authorizations: true,
      },
    });
  }

  async getPreAuthById(tenantId: string, id: string) {
    const preAuth = await this.prisma.preAuth.findUnique({
      where: { id, tenantId },
      include: {
        policy: { include: { plan: { include: { payer: true } }, patient: { select: { firstName: true, lastName: true } } } },
        plan: { include: { payer: true } },
        patient: { select: { firstName: true, lastName: true, medicalRecordNumber: true } },
        tpa: true,
        documents: true,
        authorizations: true,
        claims: { include: { invoice: true } },
      },
    });
    if (!preAuth) throw new NotFoundException('Pre-auth not found');
    return preAuth;
  }

  async updatePreAuth(tenantId: string, id: string, data: UpdatePreAuthDto) {
    return this.prisma.$transaction(async (tx) => {
      const preAuth = await tx.preAuth.update({
        where: { id, tenantId },
        data: {
          ...data,
          approvedAt: data.approvedAt ? new Date(data.approvedAt) : null,
          rejectedAt: data.rejectedAt ? new Date(data.rejectedAt) : null,
        },
        include: {
          policy: { include: { plan: { include: { payer: true } } } },
        },
      });

      // Update policy utilization based on approval
      if (data.status === PreAuthStatus.APPROVED && data.approvedAmount) {
        await this.updatePolicyUtilization(tx, preAuth.policyId, 0, data.approvedAmount);
      } else if (data.status === PreAuthStatus.REJECTED && preAuth.status === PreAuthStatus.SUBMITTED) {
        // Revert requested amount if rejected
        await this.updatePolicyUtilization(tx, preAuth.policyId, 0, -preAuth.requestedAmount);
      }

      return preAuth;
    });
  }

  async submitPreAuth(tenantId: string, data: SubmitPreAuthDto) {
    return this.prisma.$transaction(async (tx) => {
      const preAuth = await tx.preAuth.findUnique({
        where: { id: data.preAuthId, tenantId },
        include: { policy: true },
      });

      if (!preAuth) throw new NotFoundException('Pre-auth not found');

      // Add documents
      if (data.documents) {
        for (const doc of data.documents) {
          await tx.preAuthDocument.create({
            data: {
              preAuthId: data.preAuthId,
              ...doc,
              tenantId,
            },
          });
        }
      }

      // Update pre-auth status and submission time
      return tx.preAuth.update({
        where: { id: data.preAuthId },
        data: {
          status: PreAuthStatus.SUBMITTED,
          submittedAt: new Date(),
        },
        include: {
          policy: { include: { plan: { include: { payer: true } } } },
          documents: true,
        },
      });
    });
  }

  async deletePreAuth(tenantId: string, id: string) {
    return this.prisma.preAuth.delete({
      where: { id, tenantId },
    });
  }

  // ==================== AUTHORIZATION MANAGEMENT ====================

  async createAuthorization(tenantId: string, data: CreateAuthorizationDto) {
    return this.prisma.$transaction(async (tx) => {
      const auth = await tx.authorization.create({
        data: {
          ...data,
          tenantId,
          validFrom: new Date(data.validFrom),
          validUntil: new Date(data.validUntil),
          approvedAt: data.approvedBy ? new Date() : null,
        },
        include: {
          preAuth: { include: { policy: { include: { plan: { include: { payer: true } } } } } },
          policy: { include: { plan: { include: { payer: true } } } },
          patient: { select: { firstName: true, lastName: true } },
          tpa: true,
        },
      });

      // Update pre-auth with authorization link
      await tx.preAuth.update({
        where: { id: data.preAuthId },
        data: { authorizations: { connect: { id: auth.id } } },
      });

      return auth;
    });
  }

  async getAuthorizations(tenantId: string, query: AuthorizationQueryDto) {
    const where: any = { tenantId };

    if (query.patientId) where.patientId = query.patientId;
    if (query.policyId) where.policyId = query.policyId;
    if (query.status) where.status = query.status;
    if (query.validFrom || query.validUntil) {
      where.validFrom = {};
      if (query.validFrom) where.validFrom.gte = new Date(query.validFrom);
      if (query.validUntil) where.validUntil.lte = new Date(query.validUntil);
    }

    return this.prisma.authorization.findMany({
      where,
      include: {
        preAuth: { include: { policy: { include: { plan: { include: { payer: true } } } } } },
        policy: { include: { plan: { include: { payer: true } } } },
        patient: { select: { firstName: true, lastName: true } },
        tpa: true,
        claims: { select: { id: true, claimedAmount: true } },
      },
    });
  }

  async getAuthorizationById(tenantId: string, id: string) {
    const auth = await this.prisma.authorization.findUnique({
      where: { id, tenantId },
      include: {
        preAuth: { include: { policy: { include: { plan: { include: { payer: true } } } } } },
        policy: { include: { plan: { include: { payer: true } } } },
        patient: { select: { firstName: true, lastName: true } },
        tpa: true,
        claims: { include: { invoice: true } },
      },
    });
    if (!auth) throw new NotFoundException('Authorization not found');
    return auth;
  }

  async updateAuthorization(tenantId: string, id: string, data: UpdateAuthorizationDto) {
    return this.prisma.authorization.update({
      where: { id, tenantId },
      data: {
        ...data,
        validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        exhaustedAt: data.exhaustedAt ? new Date(data.exhaustedAt) : null,
      },
    });
  }

  async deleteAuthorization(tenantId: string, id: string) {
    return this.prisma.authorization.delete({
      where: { id, tenantId },
    });
  }

  // ==================== CLAIM MANAGEMENT ====================

  async createClaim(tenantId: string, data: CreateClaimDto) {
    return this.prisma.$transaction(async (tx) => {
      const claim = await tx.claim.create({
        data: { ...data, tenantId },
        include: {
          invoice: { include: { patient: { select: { firstName: true, lastName: true } } } },
          policy: { include: { plan: { include: { payer: true } } } },
          plan: { include: { payer: true } },
          patient: { select: { firstName: true, lastName: true } },
          preAuth: true,
          authorization: true,
          tpa: true,
        },
      });

      // Link claim to invoice
      await tx.invoice.update({
        where: { id: data.invoiceId },
        data: { claims: { connect: { id: claim.id } } },
      });

      return claim;
    });
  }

  async getClaims(tenantId: string, query: ClaimQueryDto) {
    const where: any = { tenantId };

    if (query.patientId) where.patientId = query.patientId;
    if (query.policyId) where.policyId = query.policyId;
    if (query.tpaId) where.tpaId = query.tpaId;
    if (query.status) where.status = query.status;
    if (query.fromDate || query.toDate) {
      where.submittedAt = {};
      if (query.fromDate) where.submittedAt.gte = new Date(query.fromDate);
      if (query.toDate) where.submittedAt.lte = new Date(query.toDate);
    }

    return this.prisma.claim.findMany({
      where,
      include: {
        invoice: { include: { lines: true } },
        policy: { include: { plan: { include: { payer: true } } } },
        plan: { include: { payer: true } },
        patient: { select: { firstName: true, lastName: true } },
        preAuth: true,
        authorization: true,
        tpa: true,
        eob: true,
        documents: true,
      },
    });
  }

  async getClaimById(tenantId: string, id: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id, tenantId },
      include: {
        invoice: { include: { lines: true, patient: { select: { firstName: true, lastName: true } } } },
        policy: { include: { plan: { include: { payer: true } } } },
        plan: { include: { payer: true } },
        patient: { select: { firstName: true, lastName: true } },
        preAuth: true,
        authorization: true,
        tpa: true,
        eob: true,
        documents: true,
      },
    });
    if (!claim) throw new NotFoundException('Claim not found');
    return claim;
  }

  async updateClaim(tenantId: string, id: string, data: UpdateClaimDto) {
    return this.prisma.claim.update({
      where: { id, tenantId },
      data: {
        ...data,
        submittedAt: data.submittedAt ? new Date(data.submittedAt) : undefined,
        processedAt: data.processedAt ? new Date(data.processedAt) : undefined,
        settledAt: data.settledAt ? new Date(data.settledAt) : undefined,
      },
    });
  }

  async submitClaim(tenantId: string, data: SubmitClaimDto) {
    return this.prisma.$transaction(async (tx) => {
      const claim = await tx.claim.findUnique({
        where: { id: data.claimId, tenantId },
        include: { invoice: true, policy: true },
      });

      if (!claim) throw new NotFoundException('Claim not found');

      // Add documents
      if (data.documents) {
        for (const doc of data.documents) {
          await tx.claimDocument.create({
            data: {
              claimId: data.claimId,
              ...doc,
              tenantId,
            },
          });
        }
      }

      // Update claim status
      return tx.claim.update({
        where: { id: data.claimId },
        data: {
          status: ClaimStatus.SUBMITTED,
          submittedAt: new Date(),
        },
        include: {
          invoice: { include: { lines: true } },
          policy: { include: { plan: { include: { payer: true } } } },
          documents: true,
        },
      });
    });
  }

  async deleteClaim(tenantId: string, id: string) {
    return this.prisma.claim.delete({
      where: { id, tenantId },
    });
  }

  // ==================== EOB MANAGEMENT ====================

  async createEOB(tenantId: string, data: CreateEOBDto) {
    return this.prisma.eOB.create({
      data: {
        ...data,
        tenantId,
        processedDate: new Date(data.processedDate),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
      },
      include: {
        claim: { include: { invoice: true, policy: { include: { plan: { include: { payer: true } } } } } },
      },
    });
  }

  async getEOBById(tenantId: string, id: string) {
    const eob = await this.prisma.eOB.findUnique({
      where: { id, tenantId },
      include: {
        claim: { include: { invoice: true, policy: { include: { plan: { include: { payer: true } } } } } },
      },
    });
    if (!eob) throw new NotFoundException('EOB not found');
    return eob;
  }

  // ==================== PAYER CONFIG MANAGEMENT ====================

  async createPayerConfig(tenantId: string, data: CreatePayerConfigDto) {
    return this.prisma.payerConfig.create({
      data: { ...data, tenantId },
      include: { payer: true },
    });
  }

  async getPayerConfigs(tenantId: string, payerId?: string) {
    const where: any = { tenantId };
    if (payerId) where.payerId = payerId;

    return this.prisma.payerConfig.findMany({
      where,
      include: { payer: true },
    });
  }

  async updatePayerConfig(tenantId: string, id: string, data: UpdatePayerConfigDto) {
    return this.prisma.payerConfig.update({
      where: { id, tenantId },
      data,
    });
  }

  async deletePayerConfig(tenantId: string, id: string) {
    return this.prisma.payerConfig.delete({
      where: { id, tenantId },
    });
  }

  // Real-time Balance Tracking Workflow
  async getPolicyBalance(tenantId: string, policyId: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id: policyId, tenantId },
      include: {
        plan: true,
      },
    });

    if (!policy) throw new NotFoundException('Policy not found');

    const sumInsured = policy.plan.sumInsured;
    const sumInsuredUsed = policy.sumInsuredUsed || 0;
    const opdLimit = policy.plan.opdLimit || 0;
    const opdLimitUsed = policy.opdLimitUsed || 0;
    const pharmacyLimit = policy.plan.pharmacyLimit || 0;
    const pharmacyLimitUsed = policy.pharmacyLimitUsed || 0;
    const roomRentLimit = policy.plan.roomRentLimit || 0;
    const roomRentUsed = policy.roomRentUsed || 0;

    return {
      policy,
      balance: {
        sumInsured: {
          total: sumInsured,
          used: sumInsuredUsed,
          remaining: sumInsured - sumInsuredUsed,
        },
        opd: {
          total: opdLimit,
          used: opdLimitUsed,
          remaining: opdLimit - opdLimitUsed,
        },
        pharmacy: {
          total: pharmacyLimit,
          used: pharmacyLimitUsed,
          remaining: pharmacyLimit - pharmacyLimitUsed,
        },
        roomRent: {
          total: roomRentLimit,
          used: roomRentUsed,
          remaining: roomRentLimit - roomRentUsed,
        },
      },
      isExhausted: sumInsuredUsed >= sumInsured,
    };
  }
  async checkEligibility(tenantId: string, data: EligibilityCheckDto) {
    const policy = await this.prisma.policy.findUnique({
      where: {
        policyNumber: data.policyNumber,
        tenantId,
        isActive: true,
      },
      include: {
        plan: { include: { payer: true } },
        patient: { select: { firstName: true, lastName: true } },
      },
    });

    if (!policy) throw new NotFoundException('Policy not found');

    // Check policy validity
    const now = new Date();
    if (policy.startDate > now || policy.endDate < now) {
      return {
        eligible: false,
        reason: 'Policy not active',
        policy,
      };
    }

    // Check service coverage (basic logic - can be enhanced)
    let eligible = true;
    let reason = '';
    let copayPercent = policy.plan.copayPercent;

    if (data.serviceCode) {
      // Check if service is covered
      const covered = policy.plan.inclusions.some(inclusion =>
        inclusion.toLowerCase().includes(data.serviceCode.toLowerCase())
      );

      const excluded = policy.plan.exclusions.some(exclusion =>
        exclusion.toLowerCase().includes(data.serviceCode.toLowerCase())
      );

      if (excluded) {
        eligible = false;
        reason = 'Service excluded from policy';
      } else if (!covered) {
        eligible = false;
        reason = 'Service not covered by policy';
      }
    }

    // Check limits
    if (data.amount) {
      const remainingLimit = policy.plan.sumInsured - policy.sumInsuredUsed;
      if (data.amount > remainingLimit) {
        eligible = false;
        reason = `Amount exceeds remaining limit of ${remainingLimit}`;
      }
    }

    return {
      eligible,
      reason: eligible ? 'Eligible' : reason,
      policy,
      copayPercent,
      remainingLimit: policy.plan.sumInsured - policy.sumInsuredUsed,
    };
  }

  // Bill Split Workflow
  async splitBill(tenantId: string, data: BillSplitDto) {
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: data.invoiceId, tenantId },
        include: { lines: true, patient: { select: { firstName: true, lastName: true } } },
      });

      if (!invoice) throw new NotFoundException('Invoice not found');

      let payerAmount = 0;
      let patientAmount = 0;
      let copayAmount = 0;

      if (data.policyId) {
        const policy = await tx.policy.findUnique({
          where: { id: data.policyId, tenantId },
          include: { plan: true },
        });

        if (policy) {
          // Calculate coverage based on policy
          const copayPercent = policy.plan.copayPercent;
          const totalAmount = invoice.totalAmount;

          payerAmount = totalAmount * (1 - copayPercent / 100);
          copayAmount = totalAmount * (copayPercent / 100);
          patientAmount = copayAmount;

          // Update policy utilization
          await this.updatePolicyUtilization(tx, data.policyId, 0, payerAmount);
        } else {
          patientAmount = invoice.totalAmount;
        }
      } else {
        patientAmount = invoice.totalAmount;
      }

      return {
        invoice,
        split: {
          payerAmount,
          patientAmount,
          copayAmount,
        },
        policyId: data.policyId,
      };
    });
  }

  // Room Upgrade Workflow with proper invoice handling
  async processRoomUpgrade(tenantId: string, data: RoomUpgradeDto) {
    return this.prisma.$transaction(async (tx) => {
      // Find the patient and their current admission/invoice
      const patient = await tx.patient.findUnique({
        where: { id: data.admissionId, tenantId },
        include: {
          policies: {
            where: { isActive: true },
            include: { plan: true }
          }
        }
      });

      if (!patient) throw new NotFoundException('Patient not found');

      // Find active invoice for this patient
      const invoice = await tx.invoice.findFirst({
        where: {
          patientId: data.admissionId,
          tenantId,
          status: { in: ['DRAFT', 'GENERATED', 'PARTIALLY_PAID'] }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!invoice) throw new NotFoundException('No active invoice found for patient');

      // Find active authorization
      const auth = await tx.authorization.findFirst({
        where: {
          patientId: data.admissionId,
          status: AuthorizationStatus.ACTIVE,
          tenantId,
        },
        include: { policy: { include: { plan: true } } },
      });

      if (!auth) throw new NotFoundException('No active authorization found');

      const differential = data.differentialAmount;
      const roomRentLimit = auth.policy.plan.roomRentLimit || 0;

      let payerCovers = 0;
      let patientPays = differential;

      if (roomRentLimit > 0) {
        payerCovers = Math.min(differential, roomRentLimit);
        patientPays = differential - payerCovers;
      }

      // Create adjustment for patient payment if needed
      if (patientPays > 0) {
        await tx.adjustment.create({
          data: {
            invoiceId: invoice.id,
            amount: patientPays,
            type: 'OTHER',
            reason: `Room upgrade differential - ${data.newRoomType}${data.approvalRef ? ` (Ref: ${data.approvalRef})` : ''}`,
            tenantId,
          },
        });
      }

      // Update invoice totals
      await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          totalAmount: { increment: differential },
          dueAmount: { increment: patientPays }
        }
      });

      return {
        upgrade: {
          differential,
          payerCovers,
          patientPays,
          roomRentLimit,
        },
        authorization: auth,
        invoice: { id: invoice.id, updatedTotal: invoice.totalAmount + differential }
      };
    });
  }

  // Enhanced Denial Handling Workflow
  async processClaimDenial(tenantId: string, claimId: string, denialData: {
    denialCodes: string[];
    denialReasons: string;
    appealedAmount?: number;
    appealReason?: string;
    finalAmount?: number;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const claim = await tx.claim.findUnique({
        where: { id: claimId, tenantId },
        include: {
          policy: true,
          patient: { select: { firstName: true, lastName: true } }
        }
      });

      if (!claim) throw new NotFoundException('Claim not found');

      // Update claim with denial information
      const updatedClaim = await tx.claim.update({
        where: { id: claimId },
        data: {
          status: ClaimStatus.DENIED,
          denialCodes: denialData.denialCodes,
          denialReasons: denialData.denialReasons,
          rejectedAmount: claim.claimedAmount - (denialData.finalAmount || 0),
          approvedAmount: denialData.finalAmount || 0,
        }
      });

      // Revert policy utilization if claim was previously approved
      if (claim.status === ClaimStatus.APPROVED && claim.approvedAmount) {
        await this.updatePolicyUtilization(tx, claim.policyId, 0, -claim.approvedAmount);
      }

      // Create notification for patient
      // Note: This would typically integrate with a notification service
      this.logger.log(
        `Claim ${claimId} denied for patient ${claim.patient.firstName} ${claim.patient.lastName}. ` +
        `Reasons: ${denialData.denialReasons}`
      );

      return {
        claim: updatedClaim,
        denial: {
          codes: denialData.denialCodes,
          reasons: denialData.denialReasons,
          appealedAmount: denialData.appealedAmount,
          appealReason: denialData.appealReason
        }
      };
    });
  // Claim Settlement Workflow
  async processClaimSettlement(tenantId: string, data: ClaimSettlementDto) {
    return this.prisma.$transaction(async (tx) => {
      const claim = await tx.claim.findUnique({
        where: { id: data.claimId, tenantId },
        include: {
          invoice: true,
          policy: { include: { plan: true } },
          patient: { select: { firstName: true, lastName: true } },
        },
      });

      if (!claim) throw new NotFoundException('Claim not found');

      // Calculate short payment
      const shortPayment = data.shortPayment || (claim.claimedAmount - data.paymentAmount);

      // Create EOB record
      const eob = await tx.eOB.create({
        data: {
          claimId: data.claimId,
          eobNumber: data.settlementRef || `EOB-${Date.now()}`,
          processedDate: new Date(),
          paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
          paymentRef: data.settlementRef,
          totalClaimed: claim.claimedAmount,
          totalApproved: data.paymentAmount,
          totalRejected: shortPayment,
          patientShare: shortPayment,
          disallowances: data.disallowances,
          paymentDetails: data.paymentDetails,
          remarks: data.remarks,
          tenantId,
        },
        include: {
          claim: { include: { invoice: true, policy: { include: { plan: { include: { payer: true } } } } } },
        },
      });

      // Update claim status
      await tx.claim.update({
        where: { id: data.claimId },
        data: {
          status: ClaimStatus.SETTLED,
          settledAt: new Date(),
          settlementRef: data.settlementRef,
          approvedAmount: data.paymentAmount,
          rejectedAmount: shortPayment,
        },
      });

      // Update invoice totals
      if (claim.invoice) {
        const patientShare = shortPayment;
        await tx.invoice.update({
          where: { id: claim.invoice.id },
          data: {
            dueAmount: { increment: patientShare },
            totalAmount: { increment: patientShare },
          },
        });
      }

      // Log settlement
      this.logger.log(
        `Claim ${data.claimId} settled for patient ${claim.patient.firstName} ${claim.patient.lastName}. ` +
        `Payment: ${data.paymentAmount}, Short Payment: ${shortPayment}`
      );

      return {
        claim: { id: claim.id, status: ClaimStatus.SETTLED },
        eob,
        settlement: {
          paymentAmount: data.paymentAmount,
          shortPayment,
          patientShare: shortPayment,
        },
      };
    });
  }

  private async updatePolicyUtilization(tx: any, policyId: string, opdAmount: number = 0, totalAmount: number = 0) {
    await tx.policy.update({
      where: { id: policyId },
      data: {
        sumInsuredUsed: { increment: totalAmount },
        opdLimitUsed: { increment: opdAmount },
      },
    });
  }

  // ==================== REPORTING ====================

  async getInsuranceSummary(tenantId: string, fromDate?: Date, toDate?: Date) {
    const dateFilter = {};
    if (fromDate || toDate) {
      dateFilter['createdAt'] = {};
      if (fromDate) dateFilter['createdAt']['gte'] = fromDate;
      if (toDate) dateFilter['createdAt']['lte'] = toDate;
    }

    const [
      totalPolicies,
      activePreAuths,
      pendingClaims,
      approvedClaims,
      totalClaims,
    ] = await Promise.all([
      this.prisma.policy.count({
        where: { tenantId, isActive: true, ...dateFilter },
      }),
      this.prisma.preAuth.count({
        where: { tenantId, status: PreAuthStatus.SUBMITTED, ...dateFilter },
      }),
      this.prisma.claim.count({
        where: { tenantId, status: ClaimStatus.UNDER_REVIEW, ...dateFilter },
      }),
      this.prisma.claim.count({
        where: { tenantId, status: ClaimStatus.APPROVED, ...dateFilter },
      }),
      this.prisma.claim.count({
        where: { tenantId, ...dateFilter },
      }),
    ]);

    const claimsAmount = await this.prisma.claim.aggregate({
      where: { tenantId, status: ClaimStatus.APPROVED, ...dateFilter },
      _sum: { approvedAmount: true },
    });

    return {
      totalPolicies,
      activePreAuths,
      pendingClaims,
      approvedClaims,
      totalClaims,
      totalApprovedAmount: claimsAmount._sum.approvedAmount || 0,
    };
  }

  // ==================== EDGE CASES ====================

  // Handle partial approvals
  async handlePartialApproval(tenantId: string, preAuthId: string, approvedAmount: number, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const preAuth = await tx.preAuth.findUnique({
        where: { id: preAuthId, tenantId },
        include: { policy: true },
      });

      if (!preAuth) throw new NotFoundException('Pre-auth not found');

      // Update pre-auth status
      await tx.preAuth.update({
        where: { id: preAuthId },
        data: {
          status: PreAuthStatus.PARTIALLY_APPROVED,
          approvedAmount,
          rejectionReason: reason,
          approvedAt: new Date(),
        },
      });

      // Update policy utilization with approved amount only
      await this.updatePolicyUtilization(tx, preAuth.policyId, 0, approvedAmount);

      return preAuth;
    });
  }

  // Handle exhausted limits
  async handleExhaustedLimit(tenantId: string, policyId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Update policy status
      await tx.policy.update({
        where: { id: policyId, tenantId },
        data: { status: 'EXHAUSTED' },
      });

      // Cancel active authorizations
      await tx.authorization.updateMany({
        where: {
          policyId,
          status: AuthorizationStatus.ACTIVE,
          tenantId,
        },
        data: { status: AuthorizationStatus.EXHAUSTED },
      });

      return { message: 'Policy limit exhausted, all active authorizations cancelled' };
    });
  }
}
