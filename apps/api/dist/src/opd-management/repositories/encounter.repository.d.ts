import { Repository } from 'typeorm';
import { Encounter } from '../entities/encounter.entity';
export declare class EncounterRepository extends Repository<Encounter> {
    findByVisitId(visitId: string): Promise<Encounter[]>;
    findByProviderId(providerId: string, startDate?: Date, endDate?: Date): Promise<Encounter[]>;
    findIncompleteEncounters(providerId?: string): Promise<Encounter[]>;
    findEncountersWithSoapNotes(visitId?: string): Promise<Encounter[]>;
    countEncountersByType(providerId?: string): Promise<{
        type: string;
        count: number;
    }[]>;
}
