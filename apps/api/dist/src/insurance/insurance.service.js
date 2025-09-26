"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InsuranceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const insurance_dto_1 = require("./insurance.dto");
let InsuranceService = InsuranceService_1 = class InsuranceService {
    prisma;
    logger = new common_1.Logger(InsuranceService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPlan(tenantId, data) {
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
    async getPlans(tenantId, payerId) {
        const where = { tenantId };
        if (payerId)
            where.payerId = payerId;
        return this.prisma.plan.findMany({
            where,
            include: {
                payer: true,
                policies: { select: { id: true } },
            },
        });
    }
    async getPlanById(tenantId, id) {
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
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        return plan;
    }
    async updatePlan(tenantId, id, data) {
        return this.prisma.plan.update({
            where: { id, tenantId },
            data,
        });
    }
    async deletePlan(tenantId, id) {
        return this.prisma.plan.delete({
            where: { id, tenantId },
        });
    }
    async createPolicy(tenantId, data) {
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
            if (data.primaryInsuredId) {
                await tx.policy.update({
                    where: { id: data.primaryInsuredId },
                    data: { dependents: { connect: { id: policy.id } } },
                });
            }
            return policy;
        });
    }
    async getPolicies(tenantId, patientId) {
        const where = { tenantId };
        if (patientId)
            where.patientId = patientId;
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
    async getPolicyById(tenantId, id) {
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
        if (!policy)
            throw new common_1.NotFoundException('Policy not found');
        return policy;
    }
    async updatePolicy(tenantId, id, data) {
        return this.prisma.policy.update({
            where: { id, tenantId },
            data,
        });
    }
    async deletePolicy(tenantId, id) {
        return this.prisma.policy.delete({
            where: { id, tenantId },
        });
    }
    async createTPA(tenantId, data) {
        return this.prisma.tPA.create({
            data: { ...data, tenantId },
        });
    }
    async getTPAs(tenantId) {
        return this.prisma.tPA.findMany({
            where: { tenantId },
            include: {
                policies: { select: { id: true } },
                preAuths: { select: { id: true, status: true } },
                claims: { select: { id: true, status: true } },
            },
        });
    }
    async getTPAById(tenantId, id) {
        const tpa = await this.prisma.tPA.findUnique({
            where: { id, tenantId },
            include: {
                policies: { include: { patient: { select: { firstName: true, lastName: true } } } },
                preAuths: { include: { patient: { select: { firstName: true, lastName: true } } } },
                claims: { include: { patient: { select: { firstName: true, lastName: true } } } },
            },
        });
        if (!tpa)
            throw new common_1.NotFoundException('TPA not found');
        return tpa;
    }
    async updateTPA(tenantId, id, data) {
        return this.prisma.tPA.update({
            where: { id, tenantId },
            data,
        });
    }
    async deleteTPA(tenantId, id) {
        return this.prisma.tPA.delete({
            where: { id, tenantId },
        });
    }
    async createPreAuth(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const preAuth = await tx.preAuth.create({
                data: {
                    ...data,
                    tenantId,
                    submittedAt: data.status === client_1.PreAuthStatus.SUBMITTED ? new Date() : null,
                },
                include: {
                    policy: { include: { plan: { include: { payer: true } }, patient: { select: { firstName: true, lastName: true } } } },
                    plan: { include: { payer: true } },
                    patient: { select: { firstName: true, lastName: true } },
                    tpa: true,
                },
            });
            if (data.status === client_1.PreAuthStatus.SUBMITTED) {
                await this.updatePolicyUtilization(tx, data.policyId, 0, data.requestedAmount);
            }
            return preAuth;
        });
    }
    async getPreAuths(tenantId, query) {
        const where = { tenantId };
        if (query.patientId)
            where.patientId = query.patientId;
        if (query.policyId)
            where.policyId = query.policyId;
        if (query.tpaId)
            where.tpaId = query.tpaId;
        if (query.status)
            where.status = query.status;
        if (query.fromDate || query.toDate) {
            where.submittedAt = {};
            if (query.fromDate)
                where.submittedAt.gte = new Date(query.fromDate);
            if (query.toDate)
                where.submittedAt.lte = new Date(query.toDate);
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
    async getPreAuthById(tenantId, id) {
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
        if (!preAuth)
            throw new common_1.NotFoundException('Pre-auth not found');
        return preAuth;
    }
    async updatePreAuth(tenantId, id, data) {
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
            if (data.status === client_1.PreAuthStatus.APPROVED && data.approvedAmount) {
                await this.updatePolicyUtilization(tx, preAuth.policyId, 0, data.approvedAmount);
            }
            else if (data.status === client_1.PreAuthStatus.REJECTED && preAuth.status === client_1.PreAuthStatus.SUBMITTED) {
                await this.updatePolicyUtilization(tx, preAuth.policyId, 0, -preAuth.requestedAmount);
            }
            return preAuth;
        });
    }
    async submitPreAuth(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const preAuth = await tx.preAuth.findUnique({
                where: { id: data.preAuthId, tenantId },
                include: { policy: true },
            });
            if (!preAuth)
                throw new common_1.NotFoundException('Pre-auth not found');
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
            return tx.preAuth.update({
                where: { id: data.preAuthId },
                data: {
                    status: client_1.PreAuthStatus.SUBMITTED,
                    submittedAt: new Date(),
                },
                include: {
                    policy: { include: { plan: { include: { payer: true } } } },
                    documents: true,
                },
            });
        });
    }
    async deletePreAuth(tenantId, id) {
        return this.prisma.preAuth.delete({
            where: { id, tenantId },
        });
    }
    async createAuthorization(tenantId, data) {
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
            await tx.preAuth.update({
                where: { id: data.preAuthId },
                data: { authorizations: { connect: { id: auth.id } } },
            });
            return auth;
        });
    }
    async getAuthorizations(tenantId, query) {
        const where = { tenantId };
        if (query.patientId)
            where.patientId = query.patientId;
        if (query.policyId)
            where.policyId = query.policyId;
        if (query.status)
            where.status = query.status;
        if (query.validFrom || query.validUntil) {
            where.validFrom = {};
            if (query.validFrom)
                where.validFrom.gte = new Date(query.validFrom);
            if (query.validUntil)
                where.validUntil.lte = new Date(query.validUntil);
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
    async getAuthorizationById(tenantId, id) {
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
        if (!auth)
            throw new common_1.NotFoundException('Authorization not found');
        return auth;
    }
    async updateAuthorization(tenantId, id, data) {
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
    async deleteAuthorization(tenantId, id) {
        return this.prisma.authorization.delete({
            where: { id, tenantId },
        });
    }
    async createClaim(tenantId, data) {
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
            await tx.invoice.update({
                where: { id: data.invoiceId },
                data: { claims: { connect: { id: claim.id } } },
            });
            return claim;
        });
    }
    async getClaims(tenantId, query) {
        const where = { tenantId };
        if (query.patientId)
            where.patientId = query.patientId;
        if (query.policyId)
            where.policyId = query.policyId;
        if (query.tpaId)
            where.tpaId = query.tpaId;
        if (query.status)
            where.status = query.status;
        if (query.fromDate || query.toDate) {
            where.submittedAt = {};
            if (query.fromDate)
                where.submittedAt.gte = new Date(query.fromDate);
            if (query.toDate)
                where.submittedAt.lte = new Date(query.toDate);
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
    async getClaimById(tenantId, id) {
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
        if (!claim)
            throw new common_1.NotFoundException('Claim not found');
        return claim;
    }
    async updateClaim(tenantId, id, data) {
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
    async submitClaim(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const claim = await tx.claim.findUnique({
                where: { id: data.claimId, tenantId },
                include: { invoice: true, policy: true },
            });
            if (!claim)
                throw new common_1.NotFoundException('Claim not found');
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
            return tx.claim.update({
                where: { id: data.claimId },
                data: {
                    status: client_1.ClaimStatus.SUBMITTED,
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
    async deleteClaim(tenantId, id) {
        return this.prisma.claim.delete({
            where: { id, tenantId },
        });
    }
    async createEOB(tenantId, data) {
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
    async getEOBById(tenantId, id) {
        const eob = await this.prisma.eOB.findUnique({
            where: { id, tenantId },
            include: {
                claim: { include: { invoice: true, policy: { include: { plan: { include: { payer: true } } } } } },
            },
        });
        if (!eob)
            throw new common_1.NotFoundException('EOB not found');
        return eob;
    }
    async createPayerConfig(tenantId, data) {
        return this.prisma.payerConfig.create({
            data: { ...data, tenantId },
            include: { payer: true },
        });
    }
    async getPayerConfigs(tenantId, payerId) {
        const where = { tenantId };
        if (payerId)
            where.payerId = payerId;
        return this.prisma.payerConfig.findMany({
            where,
            include: { payer: true },
        });
    }
    async updatePayerConfig(tenantId, id, data) {
        return this.prisma.payerConfig.update({
            where: { id, tenantId },
            data,
        });
    }
    async deletePayerConfig(tenantId, id) {
        return this.prisma.payerConfig.delete({
            where: { id, tenantId },
        });
    }
    async getPolicyBalance(tenantId, policyId) {
        const policy = await this.prisma.policy.findUnique({
            where: { id: policyId, tenantId },
            include: {
                plan: true,
            },
        });
        if (!policy)
            throw new common_1.NotFoundException('Policy not found');
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
    async checkEligibility(tenantId, data) {
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
        if (!policy)
            throw new common_1.NotFoundException('Policy not found');
        const now = new Date();
        if (policy.startDate > now || policy.endDate < now) {
            return {
                eligible: false,
                reason: 'Policy not active',
                policy,
            };
        }
        let eligible = true;
        let reason = '';
        let copayPercent = policy.plan.copayPercent;
        if (data.serviceCode) {
            const covered = policy.plan.inclusions.some(inclusion => inclusion.toLowerCase().includes(data.serviceCode.toLowerCase()));
            const excluded = policy.plan.exclusions.some(exclusion => exclusion.toLowerCase().includes(data.serviceCode.toLowerCase()));
            if (excluded) {
                eligible = false;
                reason = 'Service excluded from policy';
            }
            else if (!covered) {
                eligible = false;
                reason = 'Service not covered by policy';
            }
        }
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
    async splitBill(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const invoice = await tx.invoice.findUnique({
                where: { id: data.invoiceId, tenantId },
                include: { lines: true, patient: { select: { firstName: true, lastName: true } } },
            });
            if (!invoice)
                throw new common_1.NotFoundException('Invoice not found');
            let payerAmount = 0;
            let patientAmount = 0;
            let copayAmount = 0;
            if (data.policyId) {
                const policy = await tx.policy.findUnique({
                    where: { id: data.policyId, tenantId },
                    include: { plan: true },
                });
                if (policy) {
                    const copayPercent = policy.plan.copayPercent;
                    const totalAmount = invoice.totalAmount;
                    payerAmount = totalAmount * (1 - copayPercent / 100);
                    copayAmount = totalAmount * (copayPercent / 100);
                    patientAmount = copayAmount;
                    await this.updatePolicyUtilization(tx, data.policyId, 0, payerAmount);
                }
                else {
                    patientAmount = invoice.totalAmount;
                }
            }
            else {
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
    async processRoomUpgrade(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const patient = await tx.patient.findUnique({
                where: { id: data.admissionId, tenantId },
                include: {
                    policies: {
                        where: { isActive: true },
                        include: { plan: true }
                    }
                }
            });
            if (!patient)
                throw new common_1.NotFoundException('Patient not found');
            const invoice = await tx.invoice.findFirst({
                where: {
                    patientId: data.admissionId,
                    tenantId,
                    status: { in: ['DRAFT', 'GENERATED', 'PARTIALLY_PAID'] }
                },
                orderBy: { createdAt: 'desc' }
            });
            if (!invoice)
                throw new common_1.NotFoundException('No active invoice found for patient');
            const auth = await tx.authorization.findFirst({
                where: {
                    patientId: data.admissionId,
                    status: client_1.AuthorizationStatus.ACTIVE,
                    tenantId,
                },
                include: { policy: { include: { plan: true } } },
            });
            if (!auth)
                throw new common_1.NotFoundException('No active authorization found');
            const differential = data.differentialAmount;
            const roomRentLimit = auth.policy.plan.roomRentLimit || 0;
            let payerCovers = 0;
            let patientPays = differential;
            if (roomRentLimit > 0) {
                payerCovers = Math.min(differential, roomRentLimit);
                patientPays = differential - payerCovers;
            }
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
    async processClaimDenial(tenantId, claimId, denialData) {
        return this.prisma.$transaction(async (tx) => {
            const claim = await tx.claim.findUnique({
                where: { id: claimId, tenantId },
                include: {
                    policy: true,
                    patient: { select: { firstName: true, lastName: true } }
                }
            });
            if (!claim)
                throw new common_1.NotFoundException('Claim not found');
            const updatedClaim = await tx.claim.update({
                where: { id: claimId },
                data: {
                    status: client_1.ClaimStatus.DENIED,
                    denialCodes: denialData.denialCodes,
                    denialReasons: denialData.denialReasons,
                    rejectedAmount: claim.claimedAmount - (denialData.finalAmount || 0),
                    approvedAmount: denialData.finalAmount || 0,
                }
            });
            if (claim.status === client_1.ClaimStatus.APPROVED && claim.approvedAmount) {
                await this.updatePolicyUtilization(tx, claim.policyId, 0, -claim.approvedAmount);
            }
            this.logger.log(`Claim ${claimId} denied for patient ${claim.patient.firstName} ${claim.patient.lastName}. ` +
                `Reasons: ${denialData.denialReasons}`);
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
        async;
        processClaimSettlement(tenantId, string, data, insurance_dto_1.ClaimSettlementDto);
        {
            return this.prisma.$transaction(async (tx) => {
                const claim = await tx.claim.findUnique({
                    where: { id: data.claimId, tenantId },
                    include: {
                        invoice: true,
                        policy: { include: { plan: true } },
                        patient: { select: { firstName: true, lastName: true } },
                    },
                });
                if (!claim)
                    throw new common_1.NotFoundException('Claim not found');
                const shortPayment = data.shortPayment || (claim.claimedAmount - data.paymentAmount);
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
                await tx.claim.update({
                    where: { id: data.claimId },
                    data: {
                        status: client_1.ClaimStatus.SETTLED,
                        settledAt: new Date(),
                        settlementRef: data.settlementRef,
                        approvedAmount: data.paymentAmount,
                        rejectedAmount: shortPayment,
                    },
                });
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
                this.logger.log(`Claim ${data.claimId} settled for patient ${claim.patient.firstName} ${claim.patient.lastName}. ` +
                    `Payment: ${data.paymentAmount}, Short Payment: ${shortPayment}`);
                return {
                    claim: { id: claim.id, status: client_1.ClaimStatus.SETTLED },
                    eob,
                    settlement: {
                        paymentAmount: data.paymentAmount,
                        shortPayment,
                        patientShare: shortPayment,
                    },
                };
            });
        }
    }
    async updatePolicyUtilization(tx, policyId, opdAmount = 0, totalAmount = 0) {
        await tx.policy.update({
            where: { id: policyId },
            data: {
                sumInsuredUsed: { increment: totalAmount },
                opdLimitUsed: { increment: opdAmount },
            },
        });
    }
    async getInsuranceSummary(tenantId, fromDate, toDate) {
        const dateFilter = {};
        if (fromDate || toDate) {
            dateFilter['createdAt'] = {};
            if (fromDate)
                dateFilter['createdAt']['gte'] = fromDate;
            if (toDate)
                dateFilter['createdAt']['lte'] = toDate;
        }
        const [totalPolicies, activePreAuths, pendingClaims, approvedClaims, totalClaims,] = await Promise.all([
            this.prisma.policy.count({
                where: { tenantId, isActive: true, ...dateFilter },
            }),
            this.prisma.preAuth.count({
                where: { tenantId, status: client_1.PreAuthStatus.SUBMITTED, ...dateFilter },
            }),
            this.prisma.claim.count({
                where: { tenantId, status: client_1.ClaimStatus.UNDER_REVIEW, ...dateFilter },
            }),
            this.prisma.claim.count({
                where: { tenantId, status: client_1.ClaimStatus.APPROVED, ...dateFilter },
            }),
            this.prisma.claim.count({
                where: { tenantId, ...dateFilter },
            }),
        ]);
        const claimsAmount = await this.prisma.claim.aggregate({
            where: { tenantId, status: client_1.ClaimStatus.APPROVED, ...dateFilter },
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
    async handlePartialApproval(tenantId, preAuthId, approvedAmount, reason) {
        return this.prisma.$transaction(async (tx) => {
            const preAuth = await tx.preAuth.findUnique({
                where: { id: preAuthId, tenantId },
                include: { policy: true },
            });
            if (!preAuth)
                throw new common_1.NotFoundException('Pre-auth not found');
            await tx.preAuth.update({
                where: { id: preAuthId },
                data: {
                    status: client_1.PreAuthStatus.PARTIALLY_APPROVED,
                    approvedAmount,
                    rejectionReason: reason,
                    approvedAt: new Date(),
                },
            });
            await this.updatePolicyUtilization(tx, preAuth.policyId, 0, approvedAmount);
            return preAuth;
        });
    }
    async handleExhaustedLimit(tenantId, policyId) {
        return this.prisma.$transaction(async (tx) => {
            await tx.policy.update({
                where: { id: policyId, tenantId },
                data: { status: 'EXHAUSTED' },
            });
            await tx.authorization.updateMany({
                where: {
                    policyId,
                    status: client_1.AuthorizationStatus.ACTIVE,
                    tenantId,
                },
                data: { status: client_1.AuthorizationStatus.EXHAUSTED },
            });
            return { message: 'Policy limit exhausted, all active authorizations cancelled' };
        });
    }
};
exports.InsuranceService = InsuranceService;
exports.InsuranceService = InsuranceService = InsuranceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InsuranceService);
//# sourceMappingURL=insurance.service.js.map