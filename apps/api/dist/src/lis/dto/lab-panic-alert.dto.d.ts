export declare enum AlertLevel {
    CRITICAL = "CRITICAL",
    PANIC = "PANIC"
}
export declare class PanicThresholdDto {
    analyte: string;
    criticalLow?: number;
    criticalHigh?: number;
    panicLow?: number;
    panicHigh?: number;
    unit: string;
}
export declare class PanicAlertDto {
    id: string;
    orderId: string;
    patientId: string;
    analyte: string;
    value: number;
    unit: string;
    flag: string;
    referenceLow?: number;
    referenceHigh?: number;
    alertLevel: AlertLevel;
    message: string;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    notifiedUsers: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreatePanicAlertDto {
    orderId: string;
    patientId: string;
    analyte: string;
    value: number;
    unit: string;
    flag: string;
    referenceLow?: number;
    referenceHigh?: number;
    alertLevel: AlertLevel;
    message: string;
}
export declare class AcknowledgePanicAlertDto {
    acknowledgedBy: string;
}
export declare class PanicAlertStatisticsDto {
    totalAlerts: number;
    acknowledgedAlerts: number;
    pendingAlerts: number;
    panicLevelAlerts: number;
    acknowledgmentRate: number;
}
export declare class UpdatePanicThresholdDto {
    criticalLow?: number;
    criticalHigh?: number;
    panicLow?: number;
    panicHigh?: number;
    unit?: string;
}
