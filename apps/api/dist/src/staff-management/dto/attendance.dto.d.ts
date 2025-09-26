import { AttendanceStatus } from '../enums';
export declare class CheckInOutDto {
    staffId: string;
    timestamp?: string;
    location?: {
        latitude: number;
        longitude: number;
        accuracy?: number;
    };
    deviceInfo?: Record<string, any>;
    notes?: string;
}
export declare class UpdateAttendanceDto {
    checkIn?: string;
    checkOut?: string;
    status?: AttendanceStatus;
    totalHours?: number;
    notes?: string;
    requiresApproval?: boolean;
}
export declare class AttendanceQueryDto {
    staffId?: string;
    departmentId?: string;
    status?: AttendanceStatus;
    date?: string;
    startDate?: string;
    endDate?: string;
    lateOnly?: boolean;
    earlyDepartureOnly?: boolean;
    requiresApproval?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'date' | 'checkIn' | 'checkOut' | 'totalHours';
    sortOrder?: 'asc' | 'desc';
}
export declare class BulkAttendanceUpdateDto {
    records: BulkAttendanceItemDto[];
}
export declare class BulkAttendanceItemDto {
    id: string;
    checkIn?: string;
    checkOut?: string;
    status?: AttendanceStatus;
    totalHours?: number;
    notes?: string;
}
