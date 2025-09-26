import { InvoiceStatus, PaymentMode, AdjustmentType, PayerType } from '@prisma/client';
export declare class CreateChargeItemDto {
    code: string;
    name: string;
    description?: string;
    category?: string;
    price?: number;
    isActive?: boolean;
}
export declare class UpdateChargeItemDto {
    code?: string;
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    isActive?: boolean;
}
export declare class CreatePriceListDto {
    name: string;
    description?: string;
    isActive?: boolean;
}
export declare class UpdatePriceListDto {
    name?: string;
    description?: string;
    isActive?: boolean;
}
export declare class CreatePriceListItemDto {
    priceListId: string;
    chargeItemId: string;
    price: number;
    effectiveFrom: string;
    effectiveTo?: string;
    isActive?: boolean;
}
export declare class UpdatePriceListItemDto {
    priceListId?: string;
    chargeItemId?: string;
    price?: number;
    effectiveFrom?: string;
    effectiveTo?: string;
    isActive?: boolean;
}
export declare class CreatePackageDto {
    name: string;
    description?: string;
    price?: number;
    isActive?: boolean;
}
export declare class UpdatePackageDto {
    name?: string;
    description?: string;
    price?: number;
    isActive?: boolean;
}
export declare class CreateInvoiceDto {
    patientId: string;
    visitId?: string;
    consolidated?: boolean;
    totalAmount?: number;
    gstAmount?: number;
    discount?: number;
    status?: InvoiceStatus;
    notes?: string;
    lines?: Array<{
        chargeItemId: string;
        packageId?: string;
        qty: number;
        rate: number;
        amount: number;
        gstRate: number;
        gstAmount: number;
        dept?: string;
    }>;
}
export declare class UpdateInvoiceDto {
    patientId?: string;
    visitId?: string;
    consolidated?: boolean;
    totalAmount?: number;
    gstAmount?: number;
    discount?: number;
    status?: InvoiceStatus;
    notes?: string;
}
export declare class CreatePaymentDto {
    invoiceId: string;
    amount: number;
    mode: PaymentMode;
    txnRef?: string;
    notes?: string;
    payerId?: string;
}
export declare class UpdatePaymentDto {
    invoiceId?: string;
    amount?: number;
    mode?: PaymentMode;
    txnRef?: string;
    notes?: string;
    payerId?: string;
}
export declare class CreateAdjustmentDto {
    invoiceId: string;
    amount: number;
    type: AdjustmentType;
    reason: string;
    approvedBy?: string;
    approvedAt?: string;
}
export declare class UpdateAdjustmentDto {
    invoiceId?: string;
    amount?: number;
    type?: AdjustmentType;
    reason?: string;
    approvedBy?: string;
    approvedAt?: string;
}
export declare class CreatePayerDto {
    name: string;
    type: PayerType;
    contact?: string;
    email?: string;
    address?: string;
    isActive?: boolean;
}
export declare class UpdatePayerDto {
    name?: string;
    type?: PayerType;
    contact?: string;
    email?: string;
    address?: string;
    isActive?: boolean;
}
export declare class CreateLedgerDto {
    entityId: string;
    entityType: string;
    debit?: number;
    credit?: number;
    balance?: number;
    ref?: string;
}
export declare class UpdateLedgerDto {
    entityId?: string;
    entityType?: string;
    debit?: number;
    credit?: number;
    balance?: number;
    ref?: string;
}
