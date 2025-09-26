export declare class WardFilterDto {
    search?: string;
    type?: string;
    floor?: number;
    isActive?: boolean;
    hasAvailableBeds?: boolean;
    bedClass?: string;
    specialty?: string;
    minAvailableBeds?: number;
    maxAvailableBeds?: number;
    minOccupancyPercent?: number;
    maxOccupancyPercent?: number;
    includeBeds?: boolean;
    onlyAvailableBeds?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
    types?: string[];
    floors?: number[];
    specialties?: string[];
    bedFeatures?: string[];
    genderSpecific?: 'MALE' | 'FEMALE' | 'MIXED';
    patientTypes?: string[];
}
