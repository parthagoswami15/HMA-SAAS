import { Ward } from '../entities/ward.entity';
export declare class WardResponseDto {
    id: string;
    name: string;
    code: string;
    description?: string;
    floor: number;
    type: string;
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    contactNumber?: string;
    email?: string;
    inChargeName?: string;
    inChargeId?: string;
    isActive: boolean;
    bedTypes?: string[];
    specialties?: string[];
    notes?: string;
    customFields?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    constructor(ward: Ward);
    static fromWards(wards: Ward[]): WardResponseDto[];
}
