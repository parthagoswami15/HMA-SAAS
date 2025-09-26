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
var PaymentGatewayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewayService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let PaymentGatewayService = PaymentGatewayService_1 = class PaymentGatewayService {
    prisma;
    auditService;
    logger = new common_1.Logger(PaymentGatewayService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async processPayment(paymentDto, user) {
        this.logger.log(`Processing payment for tenant: ${user.tenantId}`);
        const { amount, currency, paymentMethod, billId, description, } = paymentDto;
        let paymentResult;
        switch (paymentMethod) {
            case 'UPI':
                paymentResult = await this.processUpiPayment(paymentDto);
                break;
            case 'CARD':
                paymentResult = await this.processCardPayment(paymentDto);
                break;
            case 'NET_BANKING':
                paymentResult = await this.processNetBankingPayment(paymentDto);
                break;
            case 'WALLET':
                paymentResult = await this.processWalletPayment(paymentDto);
                break;
            default:
                throw new common_1.BadRequestException('Invalid payment method');
        }
        if (!paymentResult.success) {
            throw new common_1.BadRequestException('Payment failed');
        }
        const payment = await this.prisma.paymentTransaction.create({
            data: {
                tenantId: user.tenantId,
                amount,
                currency,
                paymentMethod,
                billId,
                description,
                status: 'COMPLETED',
                gatewayResponse: JSON.stringify(paymentResult),
                processedBy: user.id,
                processedAt: new Date(),
            },
        });
        if (billId) {
            await this.prisma.bill.update({
                where: { id: billId },
                data: {
                    status: 'PAID',
                    paidAt: new Date(),
                },
            });
        }
        await this.auditService.logActivity({
            action: 'PAYMENT_PROCESSED',
            entityType: 'PAYMENT_TRANSACTION',
            entityId: payment.id,
            userId: user.id,
            details: {
                amount,
                paymentMethod,
                status: 'SUCCESS',
            },
        });
        return {
            paymentId: payment.id,
            amount,
            status: 'SUCCESS',
            reference: paymentResult.reference,
        };
    }
    async getPaymentStatus(paymentId, user) {
        this.logger.log(`Getting payment status: ${paymentId}`);
        const payment = await this.prisma.paymentTransaction.findFirst({
            where: {
                id: paymentId,
                tenantId: user.tenantId,
            },
        });
        if (!payment) {
            throw new Error('Payment not found');
        }
        return {
            paymentId,
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.paymentMethod,
            status: payment.status,
            processedAt: payment.processedAt,
            gatewayResponse: JSON.parse(payment.gatewayResponse || '{}'),
        };
    }
    async processRefund(refundDto, user) {
        this.logger.log(`Processing refund for tenant: ${user.tenantId}`);
        const { paymentId, amount, reason, } = refundDto;
        const payment = await this.prisma.paymentTransaction.findFirst({
            where: {
                id: paymentId,
                tenantId: user.tenantId,
            },
        });
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Can only refund completed payments');
        }
        const refundResult = await this.processRefundWithGateway(payment, amount);
        const refund = await this.prisma.paymentRefund.create({
            data: {
                paymentId,
                amount,
                reason,
                status: 'COMPLETED',
                gatewayResponse: JSON.stringify(refundResult),
                processedBy: user.id,
                processedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'PAYMENT_REFUNDED',
            entityType: 'PAYMENT_REFUND',
            entityId: refund.id,
            userId: user.id,
            details: {
                paymentId,
                amount,
                reason,
            },
        });
        return {
            refundId: refund.id,
            paymentId,
            amount,
            status: 'SUCCESS',
        };
    }
    async getAvailableGateways(user) {
        this.logger.log(`Getting available payment gateways for tenant: ${user.tenantId}`);
        const config = await this.prisma.integrationConfiguration.findFirst({
            where: {
                tenantId: user.tenantId,
                integrationType: 'PAYMENT_GATEWAY',
            },
        });
        const availableGateways = config?.configuration?.gateways || [
            {
                name: 'Razorpay',
                methods: ['UPI', 'CARD', 'NET_BANKING', 'WALLET'],
                isActive: true,
            },
            {
                name: 'PayU',
                methods: ['CARD', 'NET_BANKING'],
                isActive: true,
            },
            {
                name: 'Stripe',
                methods: ['CARD'],
                isActive: false,
            },
        ];
        return availableGateways.filter(gateway => gateway.isActive);
    }
    async getStatus(tenantId) {
        this.logger.log(`Getting payment gateway status for tenant: ${tenantId}`);
        const config = await this.prisma.integrationConfiguration.findFirst({
            where: {
                tenantId,
                integrationType: 'PAYMENT_GATEWAY',
            },
        });
        return {
            integrationType: 'PAYMENT_GATEWAY',
            status: config?.isActive ? 'HEALTHY' : 'ERROR',
            lastSyncAt: config?.lastSyncAt,
            isActive: config?.isActive || false,
        };
    }
    async getStats(tenantId) {
        this.logger.log(`Getting payment gateway stats for tenant: ${tenantId}`);
        const transactionCount = await this.prisma.paymentTransaction.count({ where: { tenantId } });
        const refundCount = await this.prisma.paymentRefund.count({ where: { tenantId } });
        const totalAmount = await this.prisma.paymentTransaction.aggregate({
            where: { tenantId, status: 'COMPLETED' },
            _sum: { amount: true },
        });
        const refundedAmount = await this.prisma.paymentRefund.aggregate({
            where: { tenantId, status: 'COMPLETED' },
            _sum: { amount: true },
        });
        const transactionsByMethod = await this.prisma.paymentTransaction.groupBy({
            by: ['paymentMethod'],
            where: { tenantId, status: 'COMPLETED' },
            _count: { paymentMethod: true },
        });
        return {
            totalTransactions: transactionCount,
            totalRefunds: refundCount,
            totalAmount: totalAmount._sum.amount || 0,
            refundedAmount: refundedAmount._sum.amount || 0,
            transactionsByMethod,
        };
    }
    async processUpiPayment(paymentDto) {
        this.logger.log('Processing UPI payment');
        return {
            success: true,
            reference: `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processCardPayment(paymentDto) {
        this.logger.log('Processing card payment');
        return {
            success: true,
            reference: `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processNetBankingPayment(paymentDto) {
        this.logger.log('Processing net banking payment');
        return {
            success: true,
            reference: `NB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processWalletPayment(paymentDto) {
        this.logger.log('Processing wallet payment');
        return {
            success: true,
            reference: `WALLET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Payment successful',
        };
    }
    async processRefundWithGateway(payment, amount) {
        this.logger.log(`Processing refund for payment: ${payment.id}`);
        return {
            success: true,
            reference: `REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gatewayResponse: 'Refund successful',
        };
    }
};
exports.PaymentGatewayService = PaymentGatewayService;
exports.PaymentGatewayService = PaymentGatewayService = PaymentGatewayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PaymentGatewayService);
//# sourceMappingURL=payment-gateway.service.js.map