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

  async processPayment(paymentDto: any, user: any) {
    this.logger.log(`Processing payment for consultation ${paymentDto.consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: paymentDto.consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Calculate amount based on consultation type and duration
    const amount = await this.calculateConsultationAmount(consultation);

    // Process payment based on method
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
        throw new BadRequestException('Invalid payment method');
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

    // Update consultation payment status
    await this.prisma.telemedicineConsultation.update({
      where: { id: paymentDto.consultationId },
      data: {
        paymentStatus: paymentResult.success ? 'PAID' : 'FAILED',
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    // Log the payment
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

  async processPostPayment(consultationId: string, paymentDetails: any) {
    this.logger.log(`Processing post-payment for consultation ${consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
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

    // Update consultation payment status
    await this.prisma.telemedicineConsultation.update({
      where: { id: consultationId },
      data: {
        paymentStatus: 'PAID',
        updatedAt: new Date(),
      },
    });

    return payment;
  }

  async processRefund(consultationId: string, refundDto: any, user: any) {
    this.logger.log(`Processing refund for consultation ${consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    const payment = await this.prisma.payment.findFirst({
      where: { consultationId, status: 'COMPLETED' },
    });

    if (!payment) {
      throw new NotFoundException('No completed payment found for this consultation');
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

    // Update consultation payment status if full refund
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

    // Log the refund
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

  async getPaymentStatus(consultationId: string, user: any) {
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

  async getPaymentMethods(user: any) {
    // Return available payment methods for the user's region
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

  private async calculateConsultationAmount(consultation: any): Promise<number> {
    // Base rates for different consultation types
    const baseRates = {
      GENERAL: 500,
      SPECIALIST: 800,
      FOLLOW_UP: 300,
      EMERGENCY: 1500,
      MENTAL_HEALTH: 1000,
    };

    let amount = baseRates[consultation.consultationType] || 500;

    // Add emergency premium
    if (consultation.isEmergency) {
      amount += 500;
    }

    // Add duration premium (if longer than 30 minutes)
    const duration = consultation.duration || 30;
    if (duration > 30) {
      amount += (duration - 30) * 10; // ₹10 per additional minute
    }

    return amount;
  }

  private async processCardPayment(paymentDto: any, amount: number) {
    // In production, integrate with payment gateways like Razorpay, Stripe, etc.
    this.logger.log('Processing card payment');

    // Mock implementation
    return {
      success: true,
      reference: `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processUpiPayment(paymentDto: any, amount: number) {
    // UPI integration would go here
    this.logger.log('Processing UPI payment');

    // Mock implementation
    return {
      success: true,
      reference: `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processNetBankingPayment(paymentDto: any, amount: number) {
    // Net banking integration would go here
    this.logger.log('Processing net banking payment');

    // Mock implementation
    return {
      success: true,
      reference: `NB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processWalletPayment(paymentDto: any, amount: number) {
    // Digital wallet integration would go here
    this.logger.log('Processing wallet payment');

    // Mock implementation
    return {
      success: true,
      reference: `WALLET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Payment successful',
    };
  }

  private async processInsurancePayment(paymentDto: any, amount: number) {
    // Insurance claim processing would go here
    this.logger.log('Processing insurance payment');

    // Mock implementation
    return {
      success: false, // Insurance payments typically need manual processing
      reference: `INS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: 'Insurance claim submitted for processing',
    };
  }

  async getPaymentHistory(user: any) {
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

  async getRevenueAnalytics(user: any) {
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

    // Group by month
    const monthlyRevenue = consultations.reduce((acc, consultation) => {
      const month = consultation.scheduledAt.toISOString().slice(0, 7); // YYYY-MM
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
}
