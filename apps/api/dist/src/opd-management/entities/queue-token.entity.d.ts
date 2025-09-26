import { QueuePriority } from '../enums/visit.enum';
export declare enum TokenStatus {
    WAITING = "WAITING",
    CALLED = "CALLED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW"
}
export declare class QueueToken {
    id: string;
    visitId: string;
    facilityId: string;
    departmentId: string;
    tokenNumber: string;
    displayNumber: string;
    priority: QueuePriority;
    status: TokenStatus;
    estimatedWaitTime?: number;
    issuedAt: Date;
    calledAt?: Date;
    servedAt?: Date;
    completedAt?: Date;
    servedById?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class QueueStats {
    total: number;
    waiting: number;
    inProgress: number;
    averageWaitTime: number;
    estimatedWaitTime: number;
}
