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
var GstService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GstService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let GstService = GstService_1 = class GstService {
    prisma;
    auditService;
    logger = new common_1.Logger(GstService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async generateGstInvoice(invoiceDto, user) {
        this.logger.log(`Generating GST invoice for tenant: ${user.tenantId}`);
        const { invoiceNumber, invoiceDate, customerName, customerGstin, items, totalAmount, cgstRate = 9, sgstRate = 9, igstRate = 18, } = invoiceDto;
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
    async getGstInvoice(invoiceId, user) {
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
    async generateCreditNote(creditNoteDto, user) {
        this.logger.log(`Generating GST credit note for tenant: ${user.tenantId}`);
        const { creditNoteNumber, originalInvoiceId, reason, items, totalAmount, } = creditNoteDto;
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
    async getGstReports(query, user) {
        this.logger.log(`Getting GST reports for tenant: ${user.tenantId}`);
        const { fromDate, toDate, reportType } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate || toDate) {
            where.invoiceDate = {};
            if (fromDate)
                where.invoiceDate.gte = new Date(fromDate);
            if (toDate)
                where.invoiceDate.lte = new Date(toDate);
        }
        const invoices = await this.prisma.gstInvoice.findMany({
            where,
            orderBy: { invoiceDate: 'desc' },
        });
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
    async getStatus(tenantId) {
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
};
exports.GstService = GstService;
exports.GstService = GstService = GstService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], GstService);
//# sourceMappingURL=gst.service.js.map