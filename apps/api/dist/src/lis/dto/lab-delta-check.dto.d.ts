export declare class DeltaCheckConfigDto {
    analyte: string;
    threshold: number;
    timeWindowDays: number;
    enabled: boolean;
}
export declare class DeltaCheckDto {
    analyte: string;
    currentValue: number;
    previousValue: number;
    delta: number;
    deltaPercentage: number;
    threshold: number;
    isSignificant: boolean;
    previousDate: Date;
    currentDate: Date;
}
export declare class CreateDeltaCheckConfigDto {
    analyte: string;
    threshold: number;
    timeWindowDays: number;
    enabled: boolean;
}
export declare class UpdateDeltaCheckConfigDto {
    threshold?: number;
    timeWindowDays?: number;
    enabled?: boolean;
}
export declare class DeltaCheckAlertDto {
    patientId: string;
    analyte: string;
    currentValue: number;
    previousValue: number;
    deltaPercentage: number;
    message: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    orderId?: string;
}
export declare class DeltaCheckHistoryDto {
    patientId: string;
    analyte: string;
    results: Array<{
        value: number;
        date: Date;
        orderId: string;
    }>;
    significantChanges: DeltaCheckDto[];
}
