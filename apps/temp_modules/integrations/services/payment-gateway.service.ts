import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class PaymentGatewayService {
  private readonly logger = new Logger(PaymentGatewayService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async processPayment(paymentDto: any, user: any) {
    this.logger.log(`Processing payment for tenant: ${user.tenantId}`);

    const {
      amount,
      currency,
      paymentMethod,
      billId,
      description,
    } = paymentDto;

    // Process payment based on method
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
        throw new BadRequestException('Invalid payment method');
    }

    if (!paymentResult.success) {
      throw new BadRequestException('Payment failed');
    }

    // Create payment record
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

    // Update bill status if provided
    if (billId) {
      await this.prisma.bill.update({
        where: { id: billId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      });
    }

    // Log payment
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

  async getPaymentStatus(paymentId: string, user: any) {
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

  async processRefund(refundDto: any, user: any) {
    this.logger.log(`Processing refund for tenant: ${user.tenantId}`);

    const {
      paymentId,
      amount,
      reason,
    } = refundDto;

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
      throw new BadRequestException('Can only refund completed payments');
    }

    // Process refund
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

    // Log refund
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

  async getAvailableGateways(user: any) {
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

  async getStatus(tenantId: string) {
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

  async getStats(tenantId: string) {
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

  private async processUpiPayment(paymentDto: any) {
    this.logger.log('Processing UPI payment');

    // In production, integrate with UPI gateway
    return {
      success: true,
      reference: `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processCardPayment(paymentDto: any) {
    this.logger.log('Processing card payment');

    // In production, integrate with card gateway
    return {
      success: true,
      reference: `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processNetBankingPayment(paymentDto: any) {
    this.logger.log('Processing net banking payment');

    // In production, integrate with net banking gateway
    return {
      success: true,
      reference: `NB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processWalletPayment(paymentDto: any) {
    this.logger.log('Processing wallet payment');

    // In production, integrate with wallet gateway
    return {
      success: true,
      reference: `WALLET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processRefundWithGateway(payment: any, amount: number) {
    this.logger.log(`Processing refund for payment: ${payment.id}`);

    // In production, integrate with payment gateway for refunds
    return {
      success: true,
      reference: `REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Refund successful',
    };
  }
}
