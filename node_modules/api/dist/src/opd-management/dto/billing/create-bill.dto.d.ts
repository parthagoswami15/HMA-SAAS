export declare enum BillStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    PAID = "PAID",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
    WRITTEN_OFF = "WRITTEN_OFF"
}
export declare enum BillItemType {
    CONSULTATION = "CONSULTATION",
    PROCEDURE = "PROCEDURE",
    LAB_TEST = "LAB_TEST",
    RADIOLOGY = "RADIOLOGY",
    MEDICATION = "MEDICATION",
    SUPPLY = "SUPPLY",
    ROOM = "ROOM",
    OTHER = "OTHER"
}
export declare class BillItemDto {
    itemId: string;
    name: string;
    type: BillItemType;
    description?: string;
    quantity?: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
    total: number;
    notes?: string;
}
export declare class PaymentDto {
    amount: number;
    paymentMethod: string;
    transactionId?: string;
    paymentDate?: Date;
    notes?: string;
}
export declare class CreateBillDto {
    visitId: string;
    patientId: string;
    items: BillItemDto[];
    subtotal: number;
    discount?: number;
    tax?: number;
    total: number;
    amountPaid?: number;
    balance?: number;
    status?: BillStatus;
    dueDate?: Date;
    payments?: PaymentDto[];
    notes?: string;
    insurance?: Record<string, any>;
}
