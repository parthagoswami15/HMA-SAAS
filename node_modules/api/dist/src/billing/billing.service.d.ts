import { PrismaService } from '../prisma/prisma.service';
import { PaymentMode } from '@prisma/client';
import { CreateChargeItemDto, UpdateChargeItemDto, CreatePriceListDto, UpdatePriceListDto, CreatePriceListItemDto, UpdatePriceListItemDto, CreatePackageDto, UpdatePackageDto, CreateInvoiceDto, UpdateInvoiceDto, CreatePaymentDto, UpdatePaymentDto, CreateAdjustmentDto, UpdateAdjustmentDto, CreatePayerDto, UpdatePayerDto, CreateLedgerDto, UpdateLedgerDto } from './billing.dto';
export declare class BillingService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createChargeItem(tenantId: string, data: CreateChargeItemDto): Promise<any>;
    getChargeItems(tenantId: string): Promise<any>;
    getChargeItemById(tenantId: string, id: string): Promise<any>;
    updateChargeItem(tenantId: string, id: string, data: UpdateChargeItemDto): Promise<any>;
    deleteChargeItem(tenantId: string, id: string): Promise<any>;
    createPriceList(tenantId: string, data: CreatePriceListDto): Promise<any>;
    getPriceLists(tenantId: string): Promise<any>;
    updatePriceList(tenantId: string, id: string, data: UpdatePriceListDto): Promise<any>;
    deletePriceList(tenantId: string, id: string): Promise<any>;
    addItemToPriceList(tenantId: string, data: CreatePriceListItemDto): Promise<any>;
    updatePriceListItem(tenantId: string, id: string, data: UpdatePriceListItemDto): Promise<any>;
    removeFromPriceList(tenantId: string, id: string): Promise<any>;
    createPackage(tenantId: string, data: CreatePackageDto): Promise<any>;
    getPackages(tenantId: string): Promise<any>;
    updatePackage(tenantId: string, id: string, data: UpdatePackageDto): Promise<any>;
    deletePackage(tenantId: string, id: string): Promise<any>;
    createInvoice(tenantId: string, data: CreateInvoiceDto): Promise<any>;
    getInvoices(tenantId: string, patientId?: string): Promise<any>;
    updateInvoice(tenantId: string, id: string, data: UpdateInvoiceDto): Promise<any>;
    deleteInvoice(tenantId: string, id: string): Promise<any>;
    createPayment(tenantId: string, data: CreatePaymentDto): Promise<any>;
    getPayments(tenantId: string): Promise<any>;
    updatePayment(tenantId: string, id: string, data: UpdatePaymentDto): Promise<any>;
    deletePayment(tenantId: string, id: string): Promise<any>;
    createAdjustment(tenantId: string, data: CreateAdjustmentDto): Promise<any>;
    getAdjustments(tenantId: string): Promise<any>;
    updateAdjustment(tenantId: string, id: string, data: UpdateAdjustmentDto): Promise<any>;
    deleteAdjustment(tenantId: string, id: string): Promise<any>;
    createPayer(tenantId: string, data: CreatePayerDto): Promise<any>;
    getPayers(tenantId: string): Promise<any>;
    updatePayer(tenantId: string, id: string, data: UpdatePayerDto): Promise<any>;
    deletePayer(tenantId: string, id: string): Promise<any>;
    createLedgerEntry(tenantId: string, data: CreateLedgerDto): Promise<any>;
    getLedgerEntries(tenantId: string, entityId?: string): Promise<any>;
    updateLedgerEntry(tenantId: string, id: string, data: UpdateLedgerDto): Promise<any>;
    deleteLedgerEntry(tenantId: string, id: string): Promise<any>;
    postCharge(tenantId: string, data: {
        patientId: string;
        chargeItemId: string;
        qty: number;
        visitId?: string;
    }): Promise<any>;
    generateInvoice(tenantId: string, patientId: string, consolidated?: boolean): Promise<any>;
    processPayment(tenantId: string, data: {
        invoiceId: string;
        amount: number;
        mode: PaymentMode;
        payerId?: string;
    }): Promise<any>;
    applyDiscount(tenantId: string, data: {
        invoiceId: string;
        amount: number;
        reason: string;
        approvedBy: string;
    }): Promise<any>;
    getPatientStatement(tenantId: string, patientId: string): Promise<{
        invoices: any;
        ledger: any;
    }>;
    getCorporateStatement(tenantId: string, payerId: string): Promise<{
        payments: any;
        ledger: any;
    }>;
    getBillingConfig(tenantId: string): Promise<{
        centralizedBilling: boolean;
        gstEnabled: boolean;
        roundingRules: string;
        hsnMapping: boolean;
    }>;
    generateInterimBill(tenantId: string, admissionId: string): Promise<any>;
    reverseInvoice(tenantId: string, invoiceId: string): Promise<any>;
}
