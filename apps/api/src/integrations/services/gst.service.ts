import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class GstService {
  private readonly logger = new Logger(GstService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async generateGstInvoice(invoiceDto: any, user: any) {
    this.logger.log(`Generating GST invoice for tenant: ${user.tenantId}`);

    const {
      invoiceNumber,
      invoiceDate,
      customerName,
      customerGstin,
      items,
      totalAmount,
      cgstRate = 9,
      sgstRate = 9,
      igstRate = 18,
    } = invoiceDto;

    // Calculate GST components
    const cgstAmount = (totalAmount * cgstRate) / 100;
    const sgstAmount = (totalAmount * sgstRate) / 100;
    const igstAmount = (totalAmount * igstRate) / 100;
    const grandTotal = totalAmount + cgstAmount + sgstAmount + igstAmount;

    const invoice = await this.prisma.gstInvoice.create({
      data: {
        tenantId: user.tenantId,
        invoiceNumber,
        invoiceDate: new Date(invoiceDate),
        customerName,
        customerGstin,
        items: JSON.stringify(items),
        totalAmount,
        cgstRate,
        cgstAmount,
        sgstRate,
        sgstAmount,
        igstRate,
        igstAmount,
        grandTotal,
        status: 'GENERATED',
        generatedBy: user.id,
      },
    });

    // Log invoice generation
    await this.auditService.logActivity({
      action: 'GST_INVOICE_GENERATED',
      entityType: 'GST_INVOICE',
      entityId: invoice.id,
      userId: user.id,
      details: { invoiceNumber, totalAmount },
    });

    return {
      invoiceId: invoice.id,
      invoiceNumber,
      grandTotal,
      status: 'GENERATED',
    };
  }

  async getGstInvoice(invoiceId: string, user: any) {
    this.logger.log(`Getting GST invoice: ${invoiceId}`);

    const invoice = await this.prisma.gstInvoice.findFirst({
      where: {
        id: invoiceId,
        tenantId: user.tenantId,
      },
    });

    if (!invoice) {
      throw new Error('GST invoice not found');
    }

    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      customerName: invoice.customerName,
      customerGstin: invoice.customerGstin,
      items: JSON.parse(invoice.items || '[]'),
      totalAmount: invoice.totalAmount,
      cgstRate: invoice.cgstRate,
      cgstAmount: invoice.cgstAmount,
      sgstRate: invoice.sgstRate,
      sgstAmount: invoice.sgstAmount,
      igstRate: invoice.igstRate,
      igstAmount: invoice.igstAmount,
      grandTotal: invoice.grandTotal,
      status: invoice.status,
    };
  }

  async generateCreditNote(creditNoteDto: any, user: any) {
    this.logger.log(`Generating GST credit note for tenant: ${user.tenantId}`);

    const {
      creditNoteNumber,
      originalInvoiceId,
      reason,
      items,
      totalAmount,
    } = creditNoteDto;

    const originalInvoice = await this.prisma.gstInvoice.findFirst({
      where: {
        id: originalInvoiceId,
        tenantId: user.tenantId,
      },
    });

    if (!originalInvoice) {
      throw new Error('Original invoice not found');
    }

    const creditNote = await this.prisma.gstCreditNote.create({
      data: {
        tenantId: user.tenantId,
        creditNoteNumber,
        originalInvoiceId,
        reason,
        items: JSON.stringify(items),
        totalAmount,
        status: 'GENERATED',
        generatedBy: user.id,
      },
    });

    // Log credit note generation
    await this.auditService.logActivity({
      action: 'GST_CREDIT_NOTE_GENERATED',
      entityType: 'GST_CREDIT_NOTE',
      entityId: creditNote.id,
      userId: user.id,
      details: { creditNoteNumber, originalInvoiceId },
    });

    return {
      creditNoteId: creditNote.id,
      creditNoteNumber,
      originalInvoiceId,
      totalAmount,
      status: 'GENERATED',
    };
  }

  async getGstReports(query: any, user: any) {
    this.logger.log(`Getting GST reports for tenant: ${user.tenantId}`);

    const { fromDate, toDate, reportType } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate || toDate) {
      where.invoiceDate = {};
      if (fromDate) where.invoiceDate.gte = new Date(fromDate);
      if (toDate) where.invoiceDate.lte = new Date(toDate);
    }

    const invoices = await this.prisma.gstInvoice.findMany({
      where,
      orderBy: { invoiceDate: 'desc' },
    });

    // Calculate GST summary
    const summary = {
      totalInvoices: invoices.length,
      totalTaxableValue: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalCgst: invoices.reduce((sum, inv) => sum + inv.cgstAmount, 0),
      totalSgst: invoices.reduce((sum, inv) => sum + inv.sgstAmount, 0),
      totalIgst: invoices.reduce((sum, inv) => sum + inv.igstAmount, 0),
      totalGrandTotal: invoices.reduce((sum, inv) => sum + inv.grandTotal, 0),
    };

    return {
      summary,
      invoices: invoices.map(invoice => ({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        customerName: invoice.customerName,
        totalAmount: invoice.totalAmount,
        grandTotal: invoice.grandTotal,
        status: invoice.status,
      })),
    };
  }

  async getStatus(tenantId: string) {
    this.logger.log(`Getting GST status for tenant: ${tenantId}`);

    const config = await this.prisma.integrationConfiguration.findFirst({
      where: {
        tenantId,
        integrationType: 'GST',
      },
    });

    return {
      integrationType: 'GST',
      status: config?.isActive ? 'HEALTHY' : 'ERROR',
      lastSyncAt: config?.lastSyncAt,
      isActive: config?.isActive || false,
    };
  }
}
