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
var BillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BillingService = BillingService_1 = class BillingService {
    prisma;
    logger = new common_1.Logger(BillingService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChargeItem(tenantId, data) {
        return this.prisma.chargeItem.create({
            data: { ...data, tenantId },
        });
    }
    async getChargeItems(tenantId) {
        return this.prisma.chargeItem.findMany({
            where: { tenantId },
            include: { priceLists: true },
        });
    }
    async getChargeItemById(tenantId, id) {
        const item = await this.prisma.chargeItem.findUnique({
            where: { id, tenantId },
            include: { priceLists: true },
        });
        if (!item)
            throw new common_1.NotFoundException('ChargeItem not found');
        return item;
    }
    async updateChargeItem(tenantId, id, data) {
        return this.prisma.chargeItem.update({
            where: { id, tenantId },
            data,
        });
    }
    async deleteChargeItem(tenantId, id) {
        return this.prisma.chargeItem.delete({
            where: { id, tenantId },
        });
    }
    async createPriceList(tenantId, data) {
        return this.prisma.priceList.create({
            data: { ...data, tenantId },
        });
    }
    async getPriceLists(tenantId) {
        return this.prisma.priceList.findMany({
            where: { tenantId },
            include: { items: { include: { chargeItem: true } } },
        });
    }
    async updatePriceList(tenantId, id, data) {
        return this.prisma.priceList.update({
            where: { id, tenantId },
            data,
        });
    }
    async deletePriceList(tenantId, id) {
        return this.prisma.priceList.delete({
            where: { id, tenantId },
        });
    }
    async addItemToPriceList(tenantId, data) {
        return this.prisma.priceListItem.create({
            data: {
                ...data,
                effectiveFrom: new Date(data.effectiveFrom),
                effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
                tenantId,
            },
        });
    }
    async updatePriceListItem(tenantId, id, data) {
        return this.prisma.priceListItem.update({
            where: { id, tenantId },
            data: {
                ...data,
                effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : undefined,
                effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : undefined,
            },
        });
    }
    async removeFromPriceList(tenantId, id) {
        return this.prisma.priceListItem.delete({
            where: { id, tenantId },
        });
    }
    async createPackage(tenantId, data) {
        return this.prisma.package.create({
            data: { ...data, tenantId },
        });
    }
    async getPackages(tenantId) {
        return this.prisma.package.findMany({
            where: { tenantId },
        });
    }
    async updatePackage(tenantId, id, data) {
        return this.prisma.package.update({
            where: { id, tenantId },
            data,
        });
    }
    async deletePackage(tenantId, id) {
        return this.prisma.package.delete({
            where: { id, tenantId },
        });
    }
    async createInvoice(tenantId, data) {
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
    async getInvoices(tenantId, patientId) {
        const where = { tenantId };
        if (patientId)
            where.patientId = patientId;
        return this.prisma.invoice.findMany({
            where,
            include: {
                patient: { select: { firstName: true, lastName: true } },
                lines: { include: { chargeItem: true, package: true } },
                payments: true,
            },
        });
    }
    async updateInvoice(tenantId, id, data) {
        return this.prisma.invoice.update({
            where: { id, tenantId },
            data,
        });
    }
    async deleteInvoice(tenantId, id) {
        return this.prisma.invoice.delete({
            where: { id, tenantId },
        });
    }
    async createPayment(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: { ...data, tenantId },
            });
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
    async getPayments(tenantId) {
        return this.prisma.payment.findMany({
            where: { tenantId },
            include: { invoice: true, payer: true },
        });
    }
    async updatePayment(tenantId, id, data) {
        return this.prisma.payment.update({
            where: { id, tenantId },
            data,
        });
    }
    async deletePayment(tenantId, id) {
        return this.prisma.payment.delete({
            where: { id, tenantId },
        });
    }
    async createAdjustment(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const adjustment = await tx.adjustment.create({
                data: {
                    ...data,
                    approvedAt: data.approvedAt ? new Date(data.approvedAt) : null,
                    tenantId,
                },
            });
            const invoice = await tx.invoice.findUnique({
                where: { id: data.invoiceId, tenantId },
            });
            if (invoice) {
                await tx.invoice.update({
                    where: { id: data.invoiceId },
                    data: {
                        totalAmount: data.type === client_1.AdjustmentType.DISCOUNT ? { decrement: data.amount } : invoice.totalAmount,
                    },
                });
            }
            return adjustment;
        });
    }
    async getAdjustments(tenantId) {
        return this.prisma.adjustment.findMany({
            where: { tenantId },
            include: { invoice: true },
        });
    }
    async updateAdjustment(tenantId, id, data) {
        return this.prisma.adjustment.update({
            where: { id, tenantId },
            data: {
                ...data,
                approvedAt: data.approvedAt ? new Date(data.approvedAt) : undefined,
            },
        });
    }
    async deleteAdjustment(tenantId, id) {
        return this.prisma.adjustment.delete({
            where: { id, tenantId },
        });
    }
    async createPayer(tenantId, data) {
        return this.prisma.payer.create({
            data: { ...data, tenantId },
        });
    }
    async getPayers(tenantId) {
        return this.prisma.payer.findMany({
            where: { tenantId },
        });
    }
    async updatePayer(tenantId, id, data) {
        return this.prisma.payer.update({
            where: { id, tenantId },
            data,
        });
    }
    async deletePayer(tenantId, id) {
        return this.prisma.payer.delete({
            where: { id, tenantId },
        });
    }
    async createLedgerEntry(tenantId, data) {
        return this.prisma.ledger.create({
            data: { ...data, tenantId },
        });
    }
    async getLedgerEntries(tenantId, entityId) {
        const where = { tenantId };
        if (entityId)
            where.entityId = entityId;
        return this.prisma.ledger.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateLedgerEntry(tenantId, id, data) {
        return this.prisma.ledger.update({
            where: { id, tenantId },
            data,
        });
    }
    async deleteLedgerEntry(tenantId, id) {
        return this.prisma.ledger.delete({
            where: { id, tenantId },
        });
    }
    async postCharge(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const chargeItem = await tx.chargeItem.findUnique({
                where: { id: data.chargeItemId, tenantId },
            });
            if (!chargeItem)
                throw new common_1.NotFoundException('ChargeItem not found');
            const invoice = await tx.invoice.findFirst({
                where: { patientId: data.patientId, tenantId, status: client_1.InvoiceStatus.DRAFT },
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
            }
            else {
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
    async generateInvoice(tenantId, patientId, consolidated = false) {
        return this.prisma.$transaction(async (tx) => {
            const invoice = await tx.invoice.create({
                data: {
                    patientId,
                    consolidated,
                    status: client_1.InvoiceStatus.GENERATED,
                    tenantId,
                },
                include: { lines: true },
            });
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
    async processPayment(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: { ...data, tenantId },
            });
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
                        status: newDueAmount === 0 ? client_1.InvoiceStatus.PAID : client_1.InvoiceStatus.PARTIALLY_PAID,
                    },
                });
            }
            return payment;
        });
    }
    async applyDiscount(tenantId, data) {
        return this.prisma.$transaction(async (tx) => {
            const adjustment = await tx.adjustment.create({
                data: {
                    invoiceId: data.invoiceId,
                    amount: data.amount,
                    type: client_1.AdjustmentType.DISCOUNT,
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
    async getPatientStatement(tenantId, patientId) {
        const invoices = await this.prisma.invoice.findMany({
            where: { patientId, tenantId },
            include: { payments: true, adjustments: true },
        });
        const ledger = await this.prisma.ledger.findMany({
            where: { entityId: patientId, entityType: 'PATIENT', tenantId },
        });
        return { invoices, ledger };
    }
    async getCorporateStatement(tenantId, payerId) {
        const payments = await this.prisma.payment.findMany({
            where: { payerId, tenantId },
            include: { invoice: true },
        });
        const ledger = await this.prisma.ledger.findMany({
            where: { entityId: payerId, entityType: 'PAYER', tenantId },
        });
        return { payments, ledger };
    }
    async getBillingConfig(tenantId) {
        return {
            centralizedBilling: true,
            gstEnabled: true,
            roundingRules: 'standard',
            hsnMapping: true,
        };
    }
    async generateInterimBill(tenantId, admissionId) {
        return this.generateInvoice(tenantId, '', false);
    }
    async reverseInvoice(tenantId, invoiceId) {
        return this.prisma.invoice.update({
            where: { id: invoiceId, tenantId },
            data: { status: client_1.InvoiceStatus.CANCELLED },
        });
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BillingService);
//# sourceMappingURL=billing.service.js.map