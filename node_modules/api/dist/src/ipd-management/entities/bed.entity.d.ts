import { Ward } from './ward.entity';
import { Admission } from './admission.entity';
export declare enum BedStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    MAINTENANCE = "MAINTENANCE",
    RESERVED = "RESERVED"
}
export declare enum BedClass {
    GENERAL = "GENERAL",
    DELUXE = "DELUXE",
    PRIVATE = "PRIVATE",
    ICU = "ICU",
    ICCU = "ICCU",
    PICU = "PICU",
    NICU = "NICU"
}
export declare class Bed {
    id: string;
    bedNumber: string;
    wardId: string;
    ward: Ward;
    class: BedClass;
    status: BedStatus;
    isIsolation: boolean;
    tariffPerDay: number;
    features: {
        hasOxygen: boolean;
        hasMonitor: boolean;
        hasVentilator: boolean;
        isWheelchairAccessible: boolean;
    };
    notes: string;
    currentAdmission: Admission;
    createdAt: Date;
    updatedAt: Date;
}
