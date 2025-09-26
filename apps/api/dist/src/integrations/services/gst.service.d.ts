import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class GstService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    generateGstInvoice(invoiceDto: any, user: any): Promise<{
        invoiceId: any;
        invoiceNumber: any;
        grandTotal: any;
        status: string;
    }>;
    getGstInvoice(invoiceId: string, user: any): Promise<{
        invoiceId: any;
        invoiceNumber: any;
        invoiceDate: any;
        customerName: any;
        customerGstin: any;
        items: any;
        totalAmount: any;
        cgstRate: any;
        cgstAmount: any;
        sgstRate: any;
        sgstAmount: any;
        igstRate: any;
        igstAmount: any;
        grandTotal: any;
        status: any;
    }>;
    generateCreditNote(creditNoteDto: any, user: any): Promise<{
        creditNoteId: any;
        creditNoteNumber: any;
        originalInvoiceId: any;
        totalAmount: any;
        status: string;
    }>;
    getGstReports(query: any, user: any): Promise<{
        summary: {
            totalInvoices: any;
            totalTaxableValue: any;
            totalCgst: any;
            totalSgst: any;
            totalIgst: any;
            totalGrandTotal: any;
        };
        invoices: any;
    }>;
    getStatus(tenantId: string): Promise<{
        integrationType: string;
        status: string;
        lastSyncAt: any;
        isActive: any;
    }>;
}
