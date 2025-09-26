import { CreatePrescriptionDto, PrescriptionItemDto } from './create-prescription.dto';
export declare enum PrescriptionStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
export declare class UpdatePrescriptionItemDto extends PrescriptionItemDto {
    id?: string;
}
declare const UpdatePrescriptionDto_base: import("@nestjs/common").Type<Partial<CreatePrescriptionDto>>;
export declare class UpdatePrescriptionDto extends UpdatePrescriptionDto_base {
    status?: PrescriptionStatus;
    items?: UpdatePrescriptionItemDto[];
    filledAt?: Date;
    filledById?: string;
    verifiedAt?: Date;
    verifiedById?: string;
    cancellationReason?: string;
    cancelledAt?: Date;
    cancelledById?: string;
}
export {};
