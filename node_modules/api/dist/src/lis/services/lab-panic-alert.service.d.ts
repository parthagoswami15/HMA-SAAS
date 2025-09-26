import { PrismaService } from '../../prisma/prisma.service';
export interface PanicAlert {
    id: string;
    orderId: string;
    patientId: string;
    analyte: string;
    value: number;
    unit: string;
    flag: string;
    referenceLow?: number;
    referenceHigh?: number;
    alertLevel: 'CRITICAL' | 'PANIC';
    message: string;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    notifiedUsers: string[];
    tenantId: string;
}
export interface PanicThreshold {
    analyte: string;
    criticalLow?: number;
    criticalHigh?: number;
    panicLow?: number;
    panicHigh?: number;
    unit: string;
}
export declare class LabPanicAlertService {
    private prisma;
    constructor(prisma: PrismaService);
    private defaultThresholds;
    checkForPanicAlerts(orderId: string, results: any[]): Promise<PanicAlert[]>;
    evaluateResultForPanic(result: any): Promise<PanicAlert | null>;
    createPanicAlert(alert: PanicAlert): Promise<void>;
    getActivePanicAlerts(tenantId: string): Promise<any[]>;
    acknowledgePanicAlert(alertId: string, userId: string): Promise<void>;
    getPanicThresholds(): Promise<PanicThreshold[]>;
    updatePanicThreshold(analyte: string, threshold: Partial<PanicThreshold>): Promise<PanicThreshold>;
    getPanicAlertsByPatient(patientId: string): Promise<any[]>;
    getPanicAlertStatistics(tenantId: string, days?: number): Promise<any>;
    private getPanicThreshold;
    private notifyClinicians;
    private getCliniciansToNotify;
    private sendNotification;
}
