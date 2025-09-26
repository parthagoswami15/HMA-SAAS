export declare enum TokenStatus {
    WAITING = "WAITING",
    CALLED = "CALLED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW"
}
export declare class UpdateQueueTokenDto {
    status?: TokenStatus;
    estimatedWaitTime?: number;
    calledAt?: Date;
    servedAt?: Date;
    completedAt?: Date;
    servedById?: string;
    notes?: string;
    cancellationReason?: string;
}
