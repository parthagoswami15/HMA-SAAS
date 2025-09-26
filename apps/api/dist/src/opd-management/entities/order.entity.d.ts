export declare enum OrderStatus {
    DRAFT = "DRAFT",
    REQUESTED = "REQUESTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REJECTED = "REJECTED",
    FAILED = "FAILED"
}
export declare enum OrderPriority {
    ROUTINE = "ROUTINE",
    URGENT = "URGENT",
    STAT = "STAT",
    ASAP = "ASAP"
}
export declare enum OrderType {
    LAB_TEST = "LAB_TEST",
    RADIOLOGY = "RADIOLOGY",
    PROCEDURE = "PROCEDURE",
    MEDICATION = "MEDICATION",
    CONSULT = "CONSULT",
    NURSING = "NURSING",
    OTHER = "OTHER"
}
export declare class OrderItem {
    id: string;
    itemId: string;
    itemName: string;
    itemType: OrderType;
    quantity: number;
    instructions?: string;
    status: OrderStatus;
    result?: string;
    completedAt?: Date;
    completedById?: string;
    notes?: string;
}
export declare class Order {
    id: string;
    visitId: string;
    patientId: string;
    providerId: string;
    facilityId: string;
    departmentId: string;
    items: OrderItem[];
    status: OrderStatus;
    priority: OrderPriority;
    clinicalNotes?: string;
    diagnosisCode?: string;
    diagnosisDescription?: string;
    orderDate: Date;
    completedAt?: Date;
    completedById?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
