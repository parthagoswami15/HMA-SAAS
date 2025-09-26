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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let PaymentService = PaymentService_1 = class PaymentService {
    prisma;
    auditService;
    logger = new common_1.Logger(PaymentService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async processPayment(paymentDto, user) {
        this.logger.log(`Processing payment for consultation ${paymentDto.consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: paymentDto.consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const amount = await this.calculateConsultationAmount(consultation);
        let paymentResult;
        switch (paymentDto.paymentMethod) {
            case 'CREDIT_CARD':
            case 'DEBIT_CARD':
                paymentResult = await this.processCardPayment(paymentDto, amount);
                break;
            case 'UPI':
                paymentResult = await this.processUpiPayment(paymentDto, amount);
                break;
            case 'NET_BANKING':
                paymentResult = await this.processNetBankingPayment(paymentDto, amount);
                break;
            case 'WALLET':
                paymentResult = await this.processWalletPayment(paymentDto, amount);
                break;
            case 'INSURANCE':
                paymentResult = await this.processInsurancePayment(paymentDto, amount);
                break;
            default:
                throw new common_1.BadRequestException('Invalid payment method');
        }
        const payment = await this.prisma.payment.create({
            data: {
                consultationId: paymentDto.consultationId,
                amount: amount,
                currency: 'INR',
                paymentMethod: paymentDto.paymentMethod,
                paymentReference: paymentResult.reference,
                status: paymentResult.success ? 'COMPLETED' : 'FAILED',
                paymentDetails: paymentDto.paymentDetails,
                processedAt: new Date(),
                createdBy: user.id,
            },
        });
        await this.prisma.telemedicineConsultation.update({
            where: { id: paymentDto.consultationId },
            data: {
                paymentStatus: paymentResult.success ? 'PAID' : 'FAILED',
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'PAYMENT_PROCESSED',
            entityType: 'PAYMENT',
            entityId: payment.id,
            userId: user.id,
            details: {
                consultationId: paymentDto.consultationId,
                amount,
                paymentMethod: paymentDto.paymentMethod,
                status: paymentResult.success ? 'SUCCESS' : 'FAILED',
            },
        });
        return {
            paymentId: payment.id,
            amount,
            status: paymentResult.success ? 'SUCCESS' : 'FAILED',
            reference: paymentResult.reference,
        };
    }
    async processPostPayment(consultationId, paymentDetails) {
        this.logger.log(`Processing post-payment for consultation ${consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const amount = await this.calculateConsultationAmount(consultation);
        const payment = await this.prisma.payment.create({
            data: {
                consultationId,
                amount,
                currency: 'INR',
                paymentMethod: 'POST_PAID',
                paymentReference: `POST_${consultationId}_${Date.now()}`,
                status: 'COMPLETED',
                paymentDetails,
                processedAt: new Date(),
                createdBy: consultation.doctorId,
            },
        });
        await this.prisma.telemedicineConsultation.update({
            where: { id: consultationId },
            data: {
                paymentStatus: 'PAID',
                updatedAt: new Date(),
            },
        });
        return payment;
    }
    async processRefund(consultationId, refundDto, user) {
        this.logger.log(`Processing refund for consultation ${consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const payment = await this.prisma.payment.findFirst({
            where: { consultationId, status: 'COMPLETED' },
        });
        if (!payment) {
            throw new common_1.NotFoundException('No completed payment found for this consultation');
        }
        const refundAmount = refundDto.partialRefund ? refundDto.amount : payment.amount;
        const refund = await this.prisma.refund.create({
            data: {
                paymentId: payment.id,
                amount: refundAmount,
                reason: refundDto.reason,
                status: 'PROCESSED',
                processedAt: new Date(),
                createdBy: user.id,
            },
        });
        if (!refundDto.partialRefund) {
            await this.prisma.telemedicineConsultation.update({
                where: { id: consultationId },
                data: {
                    paymentStatus: 'REFUNDED',
                    updatedBy: user.id,
                    updatedAt: new Date(),
                },
            });
        }
        await this.auditService.logActivity({
            action: 'REFUND_PROCESSED',
            entityType: 'REFUND',
            entityId: refund.id,
            userId: user.id,
            details: {
                consultationId,
                amount: refundAmount,
                reason: refundDto.reason,
            },
        });
        return refund;
    }
    async getPaymentStatus(consultationId, user) {
        const payments = await this.prisma.payment.findMany({
            where: { consultationId },
            orderBy: { createdAt: 'desc' },
        });
        const refunds = await this.prisma.refund.findMany({
            where: { paymentId: { in: payments.map(p => p.id) } },
        });
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
        });
        return {
            consultationId,
            paymentStatus: consultation?.paymentStatus || 'PENDING',
            payments,
            refunds,
            totalPaid: payments
                .filter(p => p.status === 'COMPLETED')
                .reduce((sum, p) => sum + p.amount, 0),
            totalRefunded: refunds
                .filter(r => r.status === 'PROCESSED')
                .reduce((sum, r) => sum + r.amount, 0),
        };
    }
    async getPaymentMethods(user) {
        return [
            {
                method: 'UPI',
                name: 'Unified Payments Interface',
                supported: true,
                fees: 0,
            },
            {
                method: 'CREDIT_CARD',
                name: 'Credit Card',
                supported: true,
                fees: 2.5,
            },
            {
                method: 'DEBIT_CARD',
                name: 'Debit Card',
                supported: true,
                fees: 1.5,
            },
            {
                method: 'NET_BANKING',
                name: 'Net Banking',
                supported: true,
                fees: 0,
            },
            {
                method: 'WALLET',
                name: 'Digital Wallet',
                supported: true,
                fees: 1.0,
            },
            {
                method: 'INSURANCE',
                name: 'Insurance',
                supported: false,
                fees: 0,
            },
        ];
    }
    async calculateConsultationAmount(consultation) {
        const baseRates = {
            GENERAL: 500,
            SPECIALIST: 800,
            FOLLOW_UP: 300,
            EMERGENCY: 1500,
            MENTAL_HEALTH: 1000,
        };
        let amount = baseRates[consultation.consultationType] || 500;
        if (consultation.isEmergency) {
            amount += 500;
        }
        const duration = consultation.duration || 30;
        if (duration > 30) {
            amount += (duration - 30) * 10;
        }
        return amount;
    }
    async processCardPayment(paymentDto, amount) {
        this.logger.log('Processing card payment');
        return {
            success: true,
            reference: `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processUpiPayment(paymentDto, amount) {
        this.logger.log('Processing UPI payment');
        return {
            success: true,
            reference: `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processNetBankingPayment(paymentDto, amount) {
        this.logger.log('Processing net banking payment');
        return {
            success: true,
            reference: `NB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processWalletPayment(paymentDto, amount) {
        this.logger.log('Processing wallet payment');
        return {
            success: true,
            reference: `WALLET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processInsurancePayment(paymentDto, amount) {
        this.logger.log('Processing insurance payment');
        return {
            success: false,
            reference: `INS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Insurance claim submitted for processing',
        };
    }
    async getPaymentHistory(user) {
        const payments = await this.prisma.payment.findMany({
            where: {
                OR: [
                    { consultation: { patientId: user.id } },
                    { consultation: { doctorId: user.id } },
                ],
            },
            include: {
                consultation: {
                    select: {
                        id: true,
                        consultationType: true,
                        scheduledAt: true,
                        patient: { select: { id: true, name: true } },
                        doctor: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return payments;
    }
    async getRevenueAnalytics(user) {
        const consultations = await this.prisma.telemedicineConsultation.findMany({
            where: {
                doctorId: user.id,
                status: 'COMPLETED',
                paymentStatus: 'PAID',
            },
            include: { payments: true },
        });
        const totalRevenue = consultations.reduce((sum, consultation) => {
            return sum + consultation.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0);
        }, 0);
        const consultationCount = consultations.length;
        const averageRevenuePerConsultation = consultationCount > 0 ? totalRevenue / consultationCount : 0;
        const monthlyRevenue = consultations.reduce((acc, consultation) => {
            const month = consultation.scheduledAt.toISOString().slice(0, 7);
            if (!acc[month]) {
                acc[month] = { revenue: 0, count: 0 };
            }
            acc[month].revenue += consultation.payments.reduce((sum, p) => sum + p.amount, 0);
            acc[month].count++;
            return acc;
        }, {});
        return {
            totalRevenue,
            consultationCount,
            averageRevenuePerConsultation,
            monthlyRevenue,
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map