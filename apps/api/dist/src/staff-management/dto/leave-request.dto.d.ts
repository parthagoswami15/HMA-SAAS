import { LeaveType, LeaveRequestStatus } from '../enums';
declare class LeaveDayDto {
    date: string;
    isFullDay: boolean;
    startTime?: string;
    endTime?: string;
    days: number;
}
export declare class CreateLeaveRequestDto {
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    contactNumber?: string;
    addressDuringLeave?: string;
    leaveDays?: LeaveDayDto[];
    replacementStaffId?: string;
}
export declare class UpdateLeaveRequestDto {
    type?: LeaveType;
    startDate?: string;
    endDate?: string;
    reason?: string;
    contactNumber?: string;
    addressDuringLeave?: string;
    replacementStaffId?: string;
}
export declare class ProcessLeaveRequestDto {
    status: LeaveRequestStatus.APPROVED | LeaveRequestStatus.REJECTED | LeaveRequestStatus.CANCELLED;
    comments?: string;
}
export declare class LeaveRequestQueryDto {
    staffId?: string;
    type?: LeaveType;
    status?: LeaveRequestStatus;
    startDateFrom?: string;
    endDateTo?: string;
    page?: number;
    limit?: number;
    sortBy?: 'startDate' | 'endDate' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}
export declare class LeaveBalanceDto {
    type: LeaveType;
    allocated: number;
    taken: number;
    remaining: number;
    pending?: number;
}
export {};
