import { Repository } from 'typeorm';
import { Visit } from '../entities/visit.entity';
import { VisitStatus } from '../enums/visit.enum';
export declare class VisitRepository extends Repository<Visit> {
    hasAssociatedRecords(visitId: string): Promise<boolean>;
    findActiveVisits(patientId: string): Promise<Visit[]>;
    findCompletedVisits(patientId: string, limit?: number): Promise<Visit[]>;
    findVisitsByProvider(providerId: string, status?: VisitStatus): Promise<Visit[]>;
    findVisitsByDateRange(startDate: Date, endDate: Date, status?: VisitStatus): Promise<Visit[]>;
    countVisitsByStatus(patientId?: string): Promise<{
        status: string;
        count: number;
    }[]>;
}
