export declare class CreateSpecialtyDto {
    name: string;
    code?: string;
    description?: string;
    category?: string;
    isActive?: boolean;
    colorCode?: string;
    icon?: string;
    displayOrder?: number;
    requiresCertification?: boolean;
    minYearsExperience?: number;
}
export declare class UpdateSpecialtyDto {
    name?: string;
    code?: string;
    description?: string;
    category?: string;
    isActive?: boolean;
    colorCode?: string;
    icon?: string;
    displayOrder?: number;
    requiresCertification?: boolean;
    minYearsExperience?: number;
}
export declare class SpecialtyQueryDto {
    search?: string;
    category?: string;
    isActive?: boolean;
    includeStaffCount?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'code' | 'category' | 'displayOrder';
    sortOrder?: 'asc' | 'desc';
}
export declare class StaffSpecialtyDto {
    specialtyId: string;
    isPrimary?: boolean;
    yearsExperience?: number;
    startDate?: string;
    certificationNumber?: string;
    certificationExpiryDate?: string;
    notes?: string;
}
export declare class UpdateStaffSpecialtyDto extends StaffSpecialtyDto {
    remove?: boolean;
}
export declare class SpecialtyResponseDto {
    id: string;
    tenantId: string;
    name: string;
    code?: string;
    description?: string;
    category?: string;
    isActive: boolean;
    colorCode?: string;
    icon?: string;
    displayOrder: number;
    requiresCertification: boolean;
    minYearsExperience: number;
    staffCount?: number;
    createdAt: Date;
    updatedAt: Date;
}
