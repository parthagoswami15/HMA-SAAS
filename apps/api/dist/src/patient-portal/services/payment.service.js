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
    async getBills(query, user) {
        this.logger.log(`Getting bills for user: ${user.id}`);
        const { status, fromDate, toDate, page = 1, limit = 10, } = query;
        const where = { patientId: user.id };
        if (status)
            where.status = status;
        if (fromDate || toDate) {
            where.dueDate = {};
            if (fromDate)
                where.dueDate.gte = new Date(fromDate);
            if (toDate)
                where.dueDate.lte = new Date(toDate);
        }
        const bills = await this.prisma.bill.findMany({
            where,
            include: {
                appointment: {
                    select: {
                        id: true,
                        appointmentType: true,
                        scheduledAt: true,
                        doctor: { select: { name: true, specialization: true } },
                    },
                },
                payments: {
                    select: {
                        id: true,
                        amount: true,
                        paymentMethod: true,
                        status: true,
                        paidAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await this.prisma.bill.count({ where });
        return {
            bills,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async processPayment(paymentDto, user) {
        this.logger.log(`Processing payment for user: ${user.id}`);
        const { billId, amount, paymentMethod, paymentDetails, } = paymentDto;
        const bill = await this.prisma.bill.findFirst({
            where: {
                id: billId,
                patientId: user.id,
            },
        });
        if (!bill) {
            throw new common_1.NotFoundException('Bill not found');
        }
        if (bill.status === 'PAID') {
            throw new common_1.BadRequestException('Bill is already paid');
        }
        let paymentResult;
        switch (paymentMethod) {
            case 'UPI':
                paymentResult = await this.processUpiPayment(paymentDetails, amount);
                break;
            case 'CARD':
                paymentResult = await this.processCardPayment(paymentDetails, amount);
                break;
            case 'NET_BANKING':
                paymentResult = await this.processNetBankingPayment(paymentDetails, amount);
                break;
            case 'WALLET':
                paymentResult = await this.processWalletPayment(paymentDetails, amount);
                break;
            default:
                throw new common_1.BadRequestException('Invalid payment method');
        }
        if (!paymentResult.success) {
            throw new common_1.BadRequestException('Payment failed');
        }
        const payment = await this.prisma.payment.create({
            data: {
                billId,
                amount,
                paymentMethod,
                paymentReference: paymentResult.reference,
                status: 'COMPLETED',
                paymentDetails: JSON.stringify(paymentDetails),
                paidAt: new Date(),
                paidBy: user.id,
            },
        });
        const updatedBill = await this.prisma.bill.update({
            where: { id: billId },
            data: {
                status: 'PAID',
                paidAt: new Date(),
            },
            include: {
                appointment: {
                    select: {
                        id: true,
                        appointmentType: true,
                        doctor: { select: { name: true } },
                    },
                },
            },
        });
        await this.auditService.logActivity({
            action: 'PAYMENT_PROCESSED',
            entityType: 'PAYMENT',
            entityId: payment.id,
            userId: user.id,
            details: {
                billId,
                amount,
                paymentMethod,
                status: 'SUCCESS',
            },
        });
        return {
            paymentId: payment.id,
            billId,
            amount,
            status: 'SUCCESS',
            reference: paymentResult.reference,
        };
    }
    async getPaymentHistory(query, user) {
        this.logger.log(`Getting payment history for user: ${user.id}`);
        const { fromDate, toDate, paymentMethod, page = 1, limit = 10, } = query;
        const where = {
            paidBy: user.id,
            status: 'COMPLETED',
        };
        if (fromDate || toDate) {
            where.paidAt = {};
            if (fromDate)
                where.paidAt.gte = new Date(fromDate);
            if (toDate)
                where.paidAt.lte = new Date(toDate);
        }
        if (paymentMethod)
            where.paymentMethod = paymentMethod;
        const payments = await this.prisma.payment.findMany({
            where,
            include: {
                bill: {
                    select: {
                        id: true,
                        amount: true,
                        appointment: {
                            select: {
                                id: true,
                                appointmentType: true,
                                doctor: { select: { name: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { paidAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await this.prisma.payment.count({ where });
        return {
            payments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getPaymentStatus(paymentId, user) {
        this.logger.log(`Getting payment status: ${paymentId}`);
        const payment = await this.prisma.payment.findFirst({
            where: {
                id: paymentId,
                paidBy: user.id,
            },
            include: {
                bill: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        appointment: {
                            select: {
                                id: true,
                                appointmentType: true,
                                doctor: { select: { name: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return {
            paymentId,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            status: payment.status,
            paidAt: payment.paidAt,
            bill: payment.bill,
        };
    }
    async getPendingBills(user) {
        this.logger.log(`Getting pending bills for user: ${user.id}`);
        const bills = await this.prisma.bill.findMany({
            where: {
                patientId: user.id,
                status: { in: ['PENDING', 'OVERDUE'] },
            },
            include: {
                appointment: {
                    select: {
                        id: true,
                        appointmentType: true,
                        scheduledAt: true,
                        doctor: { select: { name: true } },
                    },
                },
            },
            orderBy: { dueDate: 'asc' },
        });
        return bills;
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
                method: 'CARD',
                name: 'Credit/Debit Card',
                supported: true,
                fees: 2.5,
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
        ];
    }
    async getPaymentStats(user) {
        const totalPayments = await this.prisma.payment.count({
            where: {
                paidBy: user.id,
                status: 'COMPLETED',
            },
        });
        const totalAmount = await this.prisma.payment.aggregate({
            where: {
                paidBy: user.id,
                status: 'COMPLETED',
            },
            _sum: { amount: true },
        });
        const pendingBills = await this.prisma.bill.count({
            where: {
                patientId: user.id,
                status: { in: ['PENDING', 'OVERDUE'] },
            },
        });
        const pendingAmount = await this.prisma.bill.aggregate({
            where: {
                patientId: user.id,
                status: { in: ['PENDING', 'OVERDUE'] },
            },
            _sum: { amount: true },
        });
        const paymentsByMethod = await this.prisma.payment.groupBy({
            by: ['paymentMethod'],
            where: {
                paidBy: user.id,
                status: 'COMPLETED',
            },
            _count: { paymentMethod: true },
        });
        return {
            userId: user.id,
            totalPayments,
            totalAmount: totalAmount._sum.amount || 0,
            pendingBills,
            pendingAmount: pendingAmount._sum.amount || 0,
            paymentsByMethod,
        };
    }
    async processUpiPayment(paymentDetails, amount) {
        this.logger.log('Processing UPI payment');
        return {
            success: true,
            reference: `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processCardPayment(paymentDetails, amount) {
        this.logger.log('Processing card payment');
        return {
            success: true,
            reference: `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processNetBankingPayment(paymentDetails, amount) {
        this.logger.log('Processing net banking payment');
        return {
            success: true,
            reference: `NB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processWalletPayment(paymentDetails, amount) {
        this.logger.log('Processing wallet payment');
        return {
            success: true,
            reference: `WALLET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
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