import { CreateBedDto } from './create-bed.dto';
import { BedStatus } from '../enums';
declare const UpdateBedDto_base: import("@nestjs/common").Type<Partial<CreateBedDto>>;
export declare class UpdateBedDto extends UpdateBedDto_base {
    status?: BedStatus;
    markAsCleaned?: boolean;
    markAsAvailable?: boolean;
    markForMaintenance?: boolean;
    maintenanceReason?: string;
    maintenanceScheduledAt?: Date;
    transferToWardId?: string;
    updateReason?: string;
    updatedById?: string;
    updateBedClass?: boolean;
    updateFeatures?: boolean;
    updateRate?: boolean;
    updateStatus?: boolean;
    updateMaintenance?: boolean;
    transferBed?: boolean;
    updateNotes?: boolean;
    updateCustomFields?: boolean;
}
export {};
