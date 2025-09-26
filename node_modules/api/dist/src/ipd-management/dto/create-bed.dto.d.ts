import { BedClass, BedStatus } from '../enums';
export declare class CreateBedDto {
    bedNumber: string;
    name: string;
    wardId: string;
    bedClass: BedClass;
    status?: BedStatus;
    features?: string[];
    dailyRate?: number;
    notes?: string;
    isActive?: boolean;
    lastCleanedAt?: Date;
    maintenanceScheduledAt?: Date;
    maintenanceReason?: string;
    customFields?: Record<string, any>;
    createdById?: string;
}
