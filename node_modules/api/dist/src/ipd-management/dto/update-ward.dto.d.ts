import { CreateWardDto } from './create-ward.dto';
declare const UpdateWardDto_base: import("@nestjs/common").Type<Partial<CreateWardDto>>;
export declare class UpdateWardDto extends UpdateWardDto_base {
    name?: string;
    code?: string;
    updateBeds?: boolean;
    beds?: Array<{
        id?: string;
        bedNumber: string;
        name: string;
        bedClass: string;
        status?: string;
        features?: string[];
        dailyRate?: number;
        notes?: string;
        isActive?: boolean;
        action?: 'create' | 'update' | 'delete';
    }>;
    bedsToRemove?: string[];
    updateReason?: string;
    updatedById?: string;
}
export {};
