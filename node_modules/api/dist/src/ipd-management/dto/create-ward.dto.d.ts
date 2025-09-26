export declare class CreateWardDto {
    name: string;
    code: string;
    description?: string;
    floor: number;
    type: string;
    contactNumber?: string;
    email?: string;
    inChargeId?: string;
    isActive: boolean;
    bedTypes?: string[];
    specialties?: string[];
    notes?: string;
    customFields?: Record<string, any>;
    initialBeds?: Array<{
        bedNumber: string;
        name: string;
        bedClass: string;
        features?: string[];
        dailyRate?: number;
        notes?: string;
    }>;
}
