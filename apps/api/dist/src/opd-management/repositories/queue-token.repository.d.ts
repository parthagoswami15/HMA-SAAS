import { Repository } from 'typeorm';
import { QueueToken } from '../entities/queue-token.entity';
export declare class QueueTokenRepository extends Repository<QueueToken> {
    getCurrentToken(departmentId: string): Promise<QueueToken | null>;
    getNextInQueue(departmentId: string): Promise<QueueToken | null>;
    getQueueStats(departmentId?: string): Promise<{
        waiting: number;
        inProgress: number;
        averageWaitTime: number;
        estimatedWaitTime: number;
    }>;
    getPatientQueuePosition(visitId: string): Promise<number>;
    getDepartmentQueues(): Promise<Array<{
        departmentId: string;
        departmentName: string;
        waiting: number;
        inProgress: number;
        currentToken: string | null;
    }>>;
}
