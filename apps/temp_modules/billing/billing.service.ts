import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus, PaymentMode, AdjustmentType, PayerType } from '@prisma/client';
import { CreateChargeItemDto, UpdateChargeItemDto, CreatePriceListDto, UpdatePriceListDto, CreatePriceListItemDto, UpdatePriceListItemDto, CreatePackageDto, UpdatePackageDto, CreateInvoiceDto, UpdateInvoiceDto, CreatePaymentDto, UpdatePaymentDto, CreateAdjustmentDto, UpdateAdjustmentDto, CreatePayerDto, UpdatePayerDto, CreateLedgerDto, UpdateLedgerDto } from './billing.dto';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private prisma: PrismaService) {}

  // ChargeItem Management
  async createChargeItem(tenantId: string, data: CreateChargeItemDto) {
    return this.prisma.chargeItem.create({
      data: { ...data, tenantId },
    });
  }

  async getChargeItems(tenantId: string) {
    return this.prisma.chargeItem.findMany({
      where: { tenantId },
      include: { priceLists: true },
    });
  }

  async getChargeItemById(tenantId: string, id: string) {
    const item = await this.prisma.chargeItem.findUnique({
      where: { id, tenantId },
      include: { priceLists: true },
    });
    if (!item) throw new NotFoundException('ChargeItem not found');
    return item;
  }

  async updateChargeItem(tenantId: string, id: string, data: UpdateChargeItemDto) {
    return this.prisma.chargeItem.update({
      where: { id, tenantId },
      data,
    });
  }

  async deleteChargeItem(tenantId: string, id: string) {
    return this.prisma.chargeItem.delete({
      where: { id, tenantId },
    });
  }

  // PriceList Management
  async createPriceList(tenantId: string, data: CreatePriceListDto) {
    return this.prisma.priceList.create({
      data: { ...data, tenantId },
    });
  }

  async getPriceLists(tenantId: string) {
    return this.prisma.priceList.findMany({
      where: { tenantId },
      include: { items: { include: { chargeItem: true } } },
    });
  }

  async updatePriceList(tenantId: string, id: string, data: UpdatePriceListDto) {
    return this.prisma.priceList.update({
      where: { id, tenantId },
      data,
    });
  }

  async deletePriceList(tenantId: string, id: string) {
    return this.prisma.priceList.delete({
      where: { id, tenantId },
    });
  }

  // PriceListItem Management
  async addItemToPriceList(tenantId: string, data: CreatePriceListItemDto) {
    return this.prisma.priceListItem.create({
      data: {
        ...data,
        effectiveFrom: new Date(data.effectiveFrom),
        effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
        tenantId,
      },
    });
  }

  async updatePriceListItem(tenantId: string, id: string, data: UpdatePriceListItemDto) {
    return this.prisma.priceListItem.update({
      where: { id, tenantId },
      data: {
        ...data,
        effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : undefined,
        effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : undefined,
      },
    });
  }

  async removeFromPriceList(tenantId: string, id: string) {
    return this.prisma.priceListItem.delete({
      where: { id, tenantId },
    });
  }

  // Package Management
  async createPackage(tenantId: string, data: CreatePackageDto) {
    return this.prisma.package.create({
      data: { ...data, tenantId },
    });
  }

  async getPackages(tenantId: string) {
    return this.prisma.package.findMany({
      where: { tenantId },
    });
  }

  async updatePackage(tenantId: string, id: string, data: UpdatePackageDto) {
    return this.prisma.package.update({
      where: { id, tenantId },
      data,
    });
  }

  async deletePackage(tenantId: string, id: string) {
    return this.prisma.package.delete({
      where: { id, tenantId },
    });
  }

  // Invoice Management
  async createInvoice(tenantId: string, data: CreateInvoiceDto) {
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          ...data,
          visitId: data.visitId || null,
          totalAmount: data.totalAmount || 0,
          gstAmount: data.gstAmount || 0,
          discount: data.discount || 0,
          tenantId,
        },
        include: { lines: true },
      });

      if (data.lines) {
        for (const line of data.lines) {
          await tx.invoiceLine.create({
            data: {
              ...line,
              invoiceId: invoice.id,
              tenantId,
            },
          });
        }
      }

      return invoice;
    });
  }

  async getInvoices(tenantId: string, patientId?: string) {
    const where: any = { tenantId };
    if (patientId) where.patientId = patientId;

    return this.prisma.invoice.findMany({
      where,
      include: {
        patient: { select: { firstName: true, lastName: true } },
        lines: { include: { chargeItem: true, package: true } },
        payments: true,
      },
    });
  }

  async updateInvoice(tenantId: string, id: string, data: UpdateInvoiceDto) {
    return this.prisma.invoice.update({
      where: { id, tenantId },
      data,
    });
  }

  async deleteInvoice(tenantId: string, id: string) {
    return this.prisma.invoice.delete({
      where: { id, tenantId },
    });
  }

  // Payment Management
  async createPayment(tenantId: string, data: CreatePaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: { ...data, tenantId },
      });

      // Update invoice
      const invoice = await tx.invoice.findUnique({
        where: { id: data.invoiceId, tenantId },
      });

      if (invoice) {
        await tx.invoice.update({
          where: { id: data.invoiceId },
          data: {
            paidAmount: { increment: data.amount },
            dueAmount: { decrement: data.amount },
          },
        });
      }

      return payment;
    });
  }

  async getPayments(tenantId: string) {
    return this.prisma.payment.findMany({
      where: { tenantId },
      include: { invoice: true, payer: true },
    });
  }

  async updatePayment(tenantId: string, id: string, data: UpdatePaymentDto) {
    return this.prisma.payment.update({
      where: { id, tenantId },
      data,
    });
  }

  async deletePayment(tenantId: string, id: string) {
    return this.prisma.payment.delete({
      where: { id, tenantId },
    });
  }

  // Adjustment Management
  async createAdjustment(tenantId: string, data: CreateAdjustmentDto) {
    return this.prisma.$transaction(async (tx) => {
      const adjustment = await tx.adjustment.create({
        data: {
          ...data,
          approvedAt: data.approvedAt ? new Date(data.approvedAt) : null,
          tenantId,
        },
      });

      // Update invoice
      const invoice = await tx.invoice.findUnique({
        where: { id: data.invoiceId, tenantId },
      });

      if (invoice) {
        await tx.invoice.update({
          where: { id: data.invoiceId },
          data: {
            totalAmount: data.type === AdjustmentType.DISCOUNT ? { decrement: data.amount } : invoice.totalAmount,
          },
        });
      }

      return adjustment;
    });
  }

  async getAdjustments(tenantId: string) {
    return this.prisma.adjustment.findMany({
      where: { tenantId },
      include: { invoice: true },
    });
  }

  async updateAdjustment(tenantId: string, id: string, data: UpdateAdjustmentDto) {
    return this.prisma.adjustment.update({
      where: { id, tenantId },
      data: {
        ...data,
        approvedAt: data.approvedAt ? new Date(data.approvedAt) : undefined,
      },
    });
  }

  async deleteAdjustment(tenantId: string, id: string) {
    return this.prisma.adjustment.delete({
      where: { id, tenantId },
    });
  }

  // Payer Management
  async createPayer(tenantId: string, data: CreatePayerDto) {
    return this.prisma.payer.create({
      data: { ...data, tenantId },
    });
  }

  async getPayers(tenantId: string) {
    return this.prisma.payer.findMany({
      where: { tenantId },
    });
  }

  async updatePayer(tenantId: string, id: string, data: UpdatePayerDto) {
    return this.prisma.payer.update({
      where: { id, tenantId },
      data,
    });
  }

  async deletePayer(tenantId: string, id: string) {
    return this.prisma.payer.delete({
      where: { id, tenantId },
    });
  }

  // Ledger Management
  async createLedgerEntry(tenantId: string, data: CreateLedgerDto) {
    return this.prisma.ledger.create({
      data: { ...data, tenantId },
    });
  }

  async getLedgerEntries(tenantId: string, entityId?: string) {
    const where: any = { tenantId };
    if (entityId) where.entityId = entityId;

    return this.prisma.ledger.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLedgerEntry(tenantId: string, id: string, data: UpdateLedgerDto) {
    return this.prisma.ledger.update({
      where: { id, tenantId },
      data,
    });
  }

  async deleteLedgerEntry(tenantId: string, id: string) {
    return this.prisma.ledger.delete({
      where: { id, tenantId },
    });
  }

  // Workflows and Business Logic

  // Accruals Workflow
  async postCharge(tenantId: string, data: { patientId: string, chargeItemId: string, qty: number, visitId?: string }) {
    return this.prisma.$transaction(async (tx) => {
      // Get charge item
      const chargeItem = await tx.chargeItem.findUnique({
        where: { id: data.chargeItemId, tenantId },
      });

      if (!chargeItem) throw new NotFoundException('ChargeItem not found');

      // Create invoice line
      const invoice = await tx.invoice.findFirst({
        where: { patientId: data.patientId, tenantId, status: InvoiceStatus.DRAFT },
        orderBy: { createdAt: 'desc' },
      });

      if (invoice) {
        await tx.invoiceLine.create({
          data: {
            invoiceId: invoice.id,
            chargeItemId: data.chargeItemId,
            qty: data.qty,
            rate: chargeItem.price,
            amount: chargeItem.price * data.qty,
            tenantId,
          },
        });

        await tx.invoice.update({
          where: { id: invoice.id },
          data: { totalAmount: { increment: chargeItem.price * data.qty } },
        });
      } else {
        const newInvoice = await tx.invoice.create({
          data: {
            patientId: data.patientId,
            visitId: data.visitId,
            tenantId,
          },
        });

        await tx.invoiceLine.create({
          data: {
            invoiceId: newInvoice.id,
            chargeItemId: data.chargeItemId,
            qty: data.qty,
            rate: chargeItem.price,
            amount: chargeItem.price * data.qty,
            tenantId,
          },
        });
      }
    });
  }

  // Invoicing Workflow
  async generateInvoice(tenantId: string, patientId: string, consolidated: boolean = false) {
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          patientId,
          consolidated,
          status: InvoiceStatus.GENERATED,
          tenantId,
        },
        include: { lines: true },
      });

      // Calculate totals
      const lines = await tx.invoiceLine.findMany({
        where: { invoiceId: invoice.id, tenantId },
      });

      let totalAmount = 0;
      let gstAmount = 0;

      for (const line of lines) {
        totalAmount += line.amount;
        gstAmount += line.gstAmount;
      }

      await tx.invoice.update({
        where: { id: invoice.id },
        data: { totalAmount, gstAmount, dueAmount: totalAmount },
      });

      return invoice;
    });
  }

  // Payments Workflow
  async processPayment(tenantId: string, data: { invoiceId: string, amount: number, mode: PaymentMode, payerId?: string }) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: { ...data, tenantId },
      });

      // Update invoice
      const invoice = await tx.invoice.findUnique({
        where: { id: data.invoiceId, tenantId },
      });

      if (invoice) {
        const newPaidAmount = invoice.paidAmount + data.amount;
        const newDueAmount = Math.max(0, invoice.totalAmount - newPaidAmount);

        await tx.invoice.update({
          where: { id: data.invoiceId },
          data: {
            paidAmount: newPaidAmount,
            dueAmount: newDueAmount,
            status: newDueAmount === 0 ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID,
          },
        });
      }

      return payment;
    });
  }

  // Discounts Workflow
  async applyDiscount(tenantId: string, data: { invoiceId: string, amount: number, reason: string, approvedBy: string }) {
    return this.prisma.$transaction(async (tx) => {
      const adjustment = await tx.adjustment.create({
        data: {
          invoiceId: data.invoiceId,
          amount: data.amount,
          type: AdjustmentType.DISCOUNT,
          reason: data.reason,
          approvedBy: data.approvedBy,
          approvedAt: new Date(),
          tenantId,
        },
      });

      await tx.invoice.update({
        where: { id: data.invoiceId, tenantId },
        data: { totalAmount: { decrement: data.amount } },
      });

      return adjustment;
    });
  }

  // Statements Workflow
  async getPatientStatement(tenantId: string, patientId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { patientId, tenantId },
      include: { payments: true, adjustments: true },
    });

    const ledger = await this.prisma.ledger.findMany({
      where: { entityId: patientId, entityType: 'PATIENT', tenantId },
    });

    return { invoices, ledger };
  }

  async getCorporateStatement(tenantId: string, payerId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { payerId, tenantId },
      include: { invoice: true },
    });

    const ledger = await this.prisma.ledger.findMany({
      where: { entityId: payerId, entityType: 'PAYER', tenantId },
    });

    return { payments, ledger };
  }

  // Configurables
  async getBillingConfig(tenantId: string) {
    // Implement tenant-specific configurations
    return {
      centralizedBilling: true,
      gstEnabled: true,
      roundingRules: 'standard',
      hsnMapping: true,
    };
  }

  // Edge Cases
  async generateInterimBill(tenantId: string, admissionId: string) {
    // Implement IPD interim billing logic
    return this.generateInvoice(tenantId, '', false);
  }

  async reverseInvoice(tenantId: string, invoiceId: string) {
    // Implement reversal logic with guardrails
    return this.prisma.invoice.update({
      where: { id: invoiceId, tenantId },
      data: { status: InvoiceStatus.CANCELLED },
    });
  }
}


