import { Bed } from '../entities/bed.entity';
import { BedStatus } from '../enums/bed-status.enum';
import { BedClass } from '../enums/bed-class.enum';
export declare class BedResponseDto {
    id: string;
    bedNumber: string;
    name: string;
    status: BedStatus;
    bedClass: BedClass;
    features?: string[];
    dailyRate?: number;
    isOccupied: boolean;
    wardId: string;
    wardName: string;
    notes?: string;
    lastCleanedAt?: Date;
    maintenanceScheduledAt?: Date;
    customFields?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    constructor(bed: Bed);
    static fromBeds(beds: Bed[]): BedResponseDto[];
}
