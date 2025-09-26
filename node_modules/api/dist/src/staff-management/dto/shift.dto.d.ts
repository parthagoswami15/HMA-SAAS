import { ShiftType } from '../enums';
declare class RecurrenceRuleDto {
    freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval?: number;
    byWeekDay?: number[];
    until?: string;
    count?: number;
}
export declare class CreateShiftDto {
    staffId: string;
    locationId: string;
    type: ShiftType;
    startTime: string;
    endTime: string;
    isRecurring?: boolean;
    recurrence?: RecurrenceRuleDto;
    notes?: string;
}
export declare class UpdateShiftDto {
    locationId?: string;
    type?: ShiftType;
    startTime?: string;
    endTime?: string;
    isActive?: boolean;
    notes?: string;
}
export declare class BulkCreateShiftsDto {
    shifts: CreateShiftDto[];
}
export declare class FindShiftsQueryDto {
    staffId?: string;
    locationId?: string;
    type?: ShiftType;
    startDate?: string;
    endDate?: string;
    includeInactive?: boolean;
    page?: number;
    limit?: number;
}
export {};
