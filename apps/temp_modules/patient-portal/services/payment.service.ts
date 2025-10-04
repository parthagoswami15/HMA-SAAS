import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getBills(query: any, user: any) {
    this.logger.log(`Getting bills for user: ${user.id}`);

    const {
      status,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = query;

    const where: any = { patientId: user.id };
    if (status) where.status = status;
    if (fromDate || toDate) {
      where.dueDate = {};
      if (fromDate) where.dueDate.gte = new Date(fromDate);
      if (toDate) where.dueDate.lte = new Date(toDate);
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

  async processPayment(paymentDto: any, user: any) {
    this.logger.log(`Processing payment for user: ${user.id}`);

    const {
      billId,
      amount,
      paymentMethod,
      paymentDetails,
    } = paymentDto;

    const bill = await this.prisma.bill.findFirst({
      where: {
        id: billId,
        patientId: user.id,
      },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    if (bill.status === 'PAID') {
      throw new BadRequestException('Bill is already paid');
    }

    // Process payment based on method
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
        throw new BadRequestException('Invalid payment method');
    }

    if (!paymentResult.success) {
      throw new BadRequestException('Payment failed');
    }

    // Create payment record
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

    // Update bill status
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

    // Log payment
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

  async getPaymentHistory(query: any, user: any) {
    this.logger.log(`Getting payment history for user: ${user.id}`);

    const {
      fromDate,
      toDate,
      paymentMethod,
      page = 1,
      limit = 10,
    } = query;

    const where: any = {
      paidBy: user.id,
      status: 'COMPLETED',
    };

    if (fromDate || toDate) {
      where.paidAt = {};
      if (fromDate) where.paidAt.gte = new Date(fromDate);
      if (toDate) where.paidAt.lte = new Date(toDate);
    }

    if (paymentMethod) where.paymentMethod = paymentMethod;

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

  async getPaymentStatus(paymentId: string, user: any) {
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
      throw new NotFoundException('Payment not found');
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

  async getPendingBills(user: any) {
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

  async getPaymentMethods(user: any) {
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

  async getPaymentStats(user: any) {
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

  private async processUpiPayment(paymentDetails: any, amount: number) {
    this.logger.log('Processing UPI payment');

    // In production, integrate with UPI gateway
    // Mock implementation
    return {
      success: true,
      reference: `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processCardPayment(paymentDetails: any, amount: number) {
    this.logger.log('Processing card payment');

    // In production, integrate with card payment gateway
    // Mock implementation
    return {
      success: true,
      reference: `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processNetBankingPayment(paymentDetails: any, amount: number) {
    this.logger.log('Processing net banking payment');

    // In production, integrate with net banking gateway
    // Mock implementation
    return {
      success: true,
      reference: `NB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processWalletPayment(paymentDetails: any, amount: number) {
    this.logger.log('Processing wallet payment');

    // In production, integrate with wallet gateway
    // Mock implementation
    return {
      success: true,
      reference: `WALLET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }
}
