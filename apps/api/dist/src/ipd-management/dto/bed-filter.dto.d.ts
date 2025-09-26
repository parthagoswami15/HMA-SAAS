import { BedStatus, BedClass } from '../enums';
export declare class BedFilterDto {
    search?: string;
    status?: BedStatus;
    bedClass?: BedClass;
    wardId?: string;
    wardName?: string;
    floor?: number;
    features?: string[];
    minDailyRate?: number;
    maxDailyRate?: number;
    isAvailable?: boolean;
    isActive?: boolean;
    needsMaintenance?: boolean;
    needsCleaning?: boolean;
    includeWard?: boolean;
    includeAdmission?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
    statuses?: BedStatus[];
    bedClasses?: BedClass[];
    wardIds?: string[];
}
