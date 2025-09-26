import { ItemType, SaleStatus, ReturnStatus, InventoryReason } from '@prisma/client';
export declare class CreateInventoryItemDto {
    name: string;
    sku: string;
    quantity?: number;
    expiryDate?: string;
    priceCents?: number;
    currency?: string;
}
export declare class UpdateInventoryItemDto {
    name?: string;
    quantity?: number;
    expiryDate?: string;
    priceCents?: number;
    currency?: string;
}
export declare class CreatePrescriptionDto {
    patientId: string;
    doctorId: string;
    items: Array<{
        sku: string;
        name: string;
        quantity: number;
        instructions?: string;
    }>;
    notes?: string;
}
export declare class CreateItemDto {
    name: string;
    type: ItemType;
    hsn?: string;
    gstRate?: number;
    isActive?: boolean;
}
export declare class UpdateItemDto {
    name?: string;
    type?: ItemType;
    hsn?: string;
    gstRate?: number;
    isActive?: boolean;
}
export declare class CreateBatchDto {
    itemId: string;
    batchNo: string;
    expDt: string;
    mrp: number;
    qtyOnHand?: number;
    mfgDt?: string;
    vendorId?: string;
    grnId?: string;
    isQuarantined?: boolean;
    quarantineReason?: string;
}
export declare class UpdateBatchDto {
    itemId?: string;
    batchNo?: string;
    expDt?: string;
    mrp?: number;
    qtyOnHand?: number;
    mfgDt?: string;
    vendorId?: string;
    grnId?: string;
    isQuarantined?: boolean;
    quarantineReason?: string;
}
export declare class CreateVendorDto {
    name: string;
    code: string;
    contact?: string;
    email?: string;
    address?: string;
    isActive?: boolean;
}
export declare class UpdateVendorDto {
    name?: string;
    code?: string;
    contact?: string;
    email?: string;
    address?: string;
    isActive?: boolean;
}
export declare class CreateGrnDto {
    grnNo: string;
    vendorId: string;
    poNo?: string;
    receivedDt?: string;
    totalAmount?: number;
    notes?: string;
}
export declare class UpdateGrnDto {
    grnNo?: string;
    vendorId?: string;
    poNo?: string;
    receivedDt?: string;
    totalAmount?: number;
    notes?: string;
}
export declare class CreateFormularyDto {
    name: string;
    description?: string;
    isActive?: boolean;
}
export declare class UpdateFormularyDto {
    name?: string;
    description?: string;
    isActive?: boolean;
}
export declare class CreateFormularyItemDto {
    formularyId: string;
    itemId: string;
    isPreferred?: boolean;
    notes?: string;
}
export declare class UpdateFormularyItemDto {
    formularyId?: string;
    itemId?: string;
    isPreferred?: boolean;
    notes?: string;
}
export declare class CreateReorderRuleDto {
    itemId: string;
    minStock: number;
    maxStock: number;
    reorderQty: number;
    isActive?: boolean;
}
export declare class UpdateReorderRuleDto {
    itemId?: string;
    minStock?: number;
    maxStock?: number;
    reorderQty?: number;
    isActive?: boolean;
}
export declare class CreateRxFillDto {
    prescriptionId: string;
    itemId: string;
    qty: number;
    batchId?: string;
    rate: number;
    dispensedBy?: string;
    dispensedAt?: string;
}
export declare class UpdateRxFillDto {
    prescriptionId?: string;
    itemId?: string;
    qty?: number;
    batchId?: string;
    rate?: number;
    dispensedBy?: string;
    dispensedAt?: string;
}
export declare class CreateSaleDto {
    patientId?: string;
    storeId: string;
    totalAmount: number;
    gstAmount: number;
    discount?: number;
    paymentMethod?: string;
    status?: SaleStatus;
    notes?: string;
    items: Array<{
        itemId: string;
        batchId?: string;
        qty: number;
        rate: number;
        amount: number;
        gstRate?: number;
    }>;
}
export declare class UpdateSaleDto {
    patientId?: string;
    storeId?: string;
    totalAmount?: number;
    gstAmount?: number;
    discount?: number;
    paymentMethod?: string;
    status?: SaleStatus;
    notes?: string;
    items?: Array<{
        itemId: string;
        batchId?: string;
        qty: number;
        rate: number;
        amount: number;
        gstRate?: number;
    }>;
}
export declare class CreateReturnDto {
    saleId: string;
    reason: string;
    totalAmount: number;
    status?: ReturnStatus;
    items: Array<{
        itemId: string;
        batchId?: string;
        qty: number;
        rate: number;
        amount: number;
    }>;
}
export declare class UpdateReturnDto {
    saleId?: string;
    reason?: string;
    totalAmount?: number;
    status?: ReturnStatus;
    items?: Array<{
        itemId: string;
        batchId?: string;
        qty: number;
        rate: number;
        amount: number;
    }>;
}
export declare class CreateInventoryTxDto {
    itemId: string;
    batchId?: string;
    qty: number;
    reason: InventoryReason;
    refDoc?: string;
}
export declare class UpdateInventoryTxDto {
    itemId?: string;
    batchId?: string;
    qty?: number;
    reason?: InventoryReason;
    refDoc?: string;
}
