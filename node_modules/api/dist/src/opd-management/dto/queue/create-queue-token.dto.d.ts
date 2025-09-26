import { QueuePriority } from '../../../enums/visit.enum';
export declare class CreateQueueTokenDto {
    visitId: string;
    departmentId: string;
    priority?: QueuePriority;
    estimatedWaitTime?: number;
    notes?: string;
}
