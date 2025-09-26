import { BillingService } from './billing.service';
import { CreateChargeItemDto, UpdateChargeItemDto, CreatePriceListDto, UpdatePriceListDto, CreatePriceListItemDto, UpdatePriceListItemDto, CreatePackageDto, UpdatePackageDto, CreateInvoiceDto, UpdateInvoiceDto, CreatePaymentDto, UpdatePaymentDto, CreateAdjustmentDto, UpdateAdjustmentDto, CreatePayerDto, UpdatePayerDto, CreateLedgerDto, UpdateLedgerDto } from './billing.dto';
export declare class BillingController {
    private svc;
    constructor(svc: BillingService);
    createChargeItem(tenantId: string, dto: CreateChargeItemDto): Promise<any>;
    getChargeItems(tenantId: string): Promise<any>;
    getChargeItem(tenantId: string, id: string): Promise<any>;
    updateChargeItem(tenantId: string, id: string, dto: UpdateChargeItemDto): Promise<any>;
    deleteChargeItem(tenantId: string, id: string): Promise<any>;
    createPriceList(tenantId: string, dto: CreatePriceListDto): Promise<any>;
    getPriceLists(tenantId: string): Promise<any>;
    updatePriceList(tenantId: string, id: string, dto: UpdatePriceListDto): Promise<any>;
    deletePriceList(tenantId: string, id: string): Promise<any>;
    addItemToPriceList(tenantId: string, dto: CreatePriceListItemDto): Promise<any>;
    updatePriceListItem(tenantId: string, id: string, dto: UpdatePriceListItemDto): Promise<any>;
    removeFromPriceList(tenantId: string, id: string): Promise<any>;
    createPackage(tenantId: string, dto: CreatePackageDto): Promise<any>;
    getPackages(tenantId: string): Promise<any>;
    updatePackage(tenantId: string, id: string, dto: UpdatePackageDto): Promise<any>;
    deletePackage(tenantId: string, id: string): Promise<any>;
    createInvoice(tenantId: string, dto: CreateInvoiceDto): Promise<any>;
    getInvoices(tenantId: string, patientId?: string): Promise<any>;
    updateInvoice(tenantId: string, id: string, dto: UpdateInvoiceDto): Promise<any>;
    deleteInvoice(tenantId: string, id: string): Promise<any>;
    createPayment(tenantId: string, dto: CreatePaymentDto): Promise<any>;
    getPayments(tenantId: string): Promise<any>;
    updatePayment(tenantId: string, id: string, dto: UpdatePaymentDto): Promise<any>;
    deletePayment(tenantId: string, id: string): Promise<any>;
    createAdjustment(tenantId: string, dto: CreateAdjustmentDto): Promise<any>;
    getAdjustments(tenantId: string): Promise<any>;
    updateAdjustment(tenantId: string, id: string, dto: UpdateAdjustmentDto): Promise<any>;
    deleteAdjustment(tenantId: string, id: string): Promise<any>;
    createPayer(tenantId: string, dto: CreatePayerDto): Promise<any>;
    getPayers(tenantId: string): Promise<any>;
    updatePayer(tenantId: string, id: string, dto: UpdatePayerDto): Promise<any>;
    deletePayer(tenantId: string, id: string): Promise<any>;
    createLedgerEntry(tenantId: string, dto: CreateLedgerDto): Promise<any>;
    getLedgerEntries(tenantId: string, entityId?: string): Promise<any>;
    updateLedgerEntry(tenantId: string, id: string, dto: UpdateLedgerDto): Promise<any>;
    deleteLedgerEntry(tenantId: string, id: string): Promise<any>;
    postCharge(tenantId: string, dto: {
        patientId: string;
        chargeItemId: string;
        qty: number;
        visitId?: string;
    }): Promise<any>;
    generateInvoice(tenantId: string, { patientId, consolidated }: {
        patientId: string;
        consolidated?: boolean;
    }): Promise<any>;
    processPayment(tenantId: string, dto: {
        invoiceId: string;
        amount: number;
        mode: string;
        payerId?: string;
    }): Promise<any>;
    applyDiscount(tenantId: string, dto: {
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
    generateInterimBill(tenantId: string, { admissionId }: {
        admissionId: string;
    }): Promise<any>;
    reverseInvoice(tenantId: string, invoiceId: string): Promise<any>;
}
