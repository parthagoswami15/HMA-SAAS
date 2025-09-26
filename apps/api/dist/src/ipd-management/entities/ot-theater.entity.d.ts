import { Surgery } from './surgery.entity';
import { Ward } from './ward.entity';
export declare class OTTheater {
    id: string;
    name: string;
    code: string;
    description: string;
    type: string;
    floor: number;
    isActive: boolean;
    isInMaintenance: boolean;
    equipment: {
        name: string;
        model: string;
        lastMaintenanceDate: Date;
        nextMaintenanceDate: Date;
        status: 'OPERATIONAL' | 'MAINTENANCE_REQUIRED' | 'OUT_OF_SERVICE';
    }[];
    schedule: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }[];
    wardId: string;
    ward: Ward;
    surgeries: Surgery[];
    auditLog: Array<{
        timestamp: Date;
        action: string;
        performedById: string;
        performedBy: string;
        changes: Record<string, any>;
    }>;
    createdAt: Date;
    updatedAt: Date;
    isAvailable(startTime: Date, endTime: Date): boolean;
}
