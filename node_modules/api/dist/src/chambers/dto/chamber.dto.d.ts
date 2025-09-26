export declare class CreateChamberDto {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    consultationFee: number;
    currency?: string;
    workingHours?: any;
}
export declare class UpdateChamberDto {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    consultationFee?: number;
    currency?: string;
    workingHours?: any;
    isActive?: boolean;
}
