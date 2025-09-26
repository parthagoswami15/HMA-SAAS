import { TestPriority } from './lab-test.dto';
export declare enum OrderStatus {
    PENDING = "PENDING",
    ORDERED = "ORDERED",
    COLLECTED = "COLLECTED",
    ACCESSIONED = "ACCESSIONED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    VALIDATED = "VALIDATED",
    PUBLISHED = "PUBLISHED",
    CANCELLED = "CANCELLED"
}
export declare enum SampleStatus {
    PENDING = "PENDING",
    COLLECTED = "COLLECTED",
    RECEIVED = "RECEIVED",
    PROCESSED = "PROCESSED",
    STORED = "STORED",
    DISPOSED = "DISPOSED"
}
export declare class CreateLabOrderDto {
    visitId: string;
    patientId: string;
    panelId?: string;
    testIds: string[];
    priority?: TestPriority;
    orderingPhysician?: string;
    clinicalNotes?: string;
    requiredDateTime?: Date;
    isStat?: boolean;
    diagnosis?: string;
}
export declare class UpdateLabOrderDto {
    priority?: TestPriority;
    orderingPhysician?: string;
    clinicalNotes?: string;
    requiredDateTime?: Date;
    isStat?: boolean;
    diagnosis?: string;
}
export declare class LabOrderResponseDto {
    id: string;
    visitId: string;
    patientId: string;
    panelId?: string;
    testIds: string[];
    testNames?: string[];
    panelName?: string;
    priority: TestPriority;
    status: OrderStatus;
    orderingPhysician?: string;
    clinicalNotes?: string;
    requiredDateTime?: Date;
    isStat: boolean;
    diagnosis?: string;
    barcode?: string;
    createdAt: Date;
    updatedAt: Date;
    samples?: any[];
    results?: any[];
}
export declare class SampleDto {
    sampleType: string;
    containerType: string;
    volume?: number;
    collectionNotes?: string;
    collectedAt?: Date;
    stabilityExpiresAt?: Date;
}
export declare class CreateSampleDto {
    orderId: string;
    sampleType: string;
    containerType: string;
    volume?: number;
    collectionNotes?: string;
    collectedAt?: Date;
    stabilityExpiresAt?: Date;
}
export declare class SampleResponseDto {
    id: string;
    orderId: string;
    sampleType: string;
    containerType: string;
    volume?: number;
    collectionNotes?: string;
    collectedAt?: Date;
    stabilityExpiresAt?: Date;
    status: SampleStatus;
    barcode?: string;
    createdAt: Date;
    updatedAt: Date;
}
