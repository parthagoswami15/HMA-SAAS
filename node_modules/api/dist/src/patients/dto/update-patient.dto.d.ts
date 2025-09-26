import { CreatePatientDto } from './create-patient.dto';
declare class UpdateEmergencyContactDto {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
    address?: string;
    isPrimary?: boolean;
    notes?: string;
}
declare const UpdatePatientDto_base: import("@nestjs/common").Type<Partial<Omit<CreatePatientDto, "emergencyContacts">>>;
export declare class UpdatePatientDto extends UpdatePatientDto_base {
    emergencyContacts?: UpdateEmergencyContactDto[];
    score?: number;
    totalSpent?: number;
    loyaltyPoints?: number;
    creditBalance?: number;
    discountPercentage?: number;
    totalVisits?: number;
    lastVerifiedAt?: string | null;
    dateOfDeath?: string | null;
    registeredAt?: string | null;
    lastVisitAt?: string | null;
}
export {};
