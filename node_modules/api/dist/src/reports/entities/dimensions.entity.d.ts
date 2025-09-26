export declare abstract class BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
}
export declare class DimDate extends BaseEntity {
    date: Date;
    year: number;
    month: number;
    day: number;
    quarter: number;
    monthName: string;
    dayOfWeek: string;
    isWeekend: boolean;
    isHoliday: boolean;
    holidayName?: string;
    fiscalYear: string;
    fiscalQuarter: number;
    weekOfYear: number;
}
export declare class DimFacility extends BaseEntity {
    name: string;
    code: string;
    type: 'HOSPITAL' | 'CLINIC' | 'LAB' | 'PHARMACY' | 'OTHER';
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    totalBeds: number;
    licenseNumber?: string;
    isActive: boolean;
}
export declare class DimProvider extends BaseEntity {
    firstName: string;
    lastName: string;
    employeeId: string;
    specialization: string;
    department: string;
    type: 'DOCTOR' | 'NURSE' | 'TECHNICIAN' | 'ADMINISTRATIVE' | 'SUPPORT_STAFF';
    licenseNumber?: string;
    isActive: boolean;
    email?: string;
    phone?: string;
}
export declare class DimService extends BaseEntity {
    name: string;
    code: string;
    category: 'OPD' | 'IPD' | 'LAB' | 'PHARMACY' | 'SURGERY' | 'DIAGNOSTIC' | 'OTHER';
    description?: string;
    basePrice: number;
    gstRate?: number;
    isActive: boolean;
    isTaxable: boolean;
    cptCode?: string;
    icdCode?: string;
}
export declare class DimPayer extends BaseEntity {
    name: string;
    code: string;
    type: 'INSURANCE' | 'CORPORATE' | 'GOVERNMENT' | 'CASH' | 'OTHER';
    policyNumber?: string;
    tpaName?: string;
    policyStartDate?: Date;
    policyEndDate?: Date;
    coveragePercentage: number;
    isActive: boolean;
}
