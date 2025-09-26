export declare enum OrderPriority {
    ROUTINE = "ROUTINE",
    URGENT = "URGENT",
    STAT = "STAT",
    ASAP = "ASAP"
}
export declare enum OrderItemType {
    LAB_TEST = "LAB_TEST",
    RADIOLOGY = "RADIOLOGY",
    PROCEDURE = "PROCEDURE",
    MEDICATION = "MEDICATION",
    CONSULT = "CONSULT",
    NURSING = "NURSING",
    OTHER = "OTHER"
}
export declare class OrderItemDto {
    itemId: string;
    itemName: string;
    itemType: OrderItemType;
    quantity?: number;
    instructions?: string;
    priority?: OrderPriority;
}
export declare class CreateOrderDto {
    visitId: string;
    providerId: string;
    departmentId: string;
    items: OrderItemDto[];
    priority?: OrderPriority;
    clinicalNotes?: string;
    diagnosisCode?: string;
    diagnosisDescription?: string;
    dueDate?: Date;
}
