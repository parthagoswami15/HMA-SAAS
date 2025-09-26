import { PrismaService } from '../../prisma/prisma.service';
export interface DeltaCheck {
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
export interface DeltaCheckConfig {
    analyte: string;
    threshold: number;
    timeWindowDays: number;
    enabled: boolean;
}
export declare class LabDeltaCheckService {
    private prisma;
    constructor(prisma: PrismaService);
    private defaultConfigs;
    performDeltaChecks(patientId: string, currentResults: any[]): Promise<DeltaCheck[]>;
    getDeltaCheckHistory(patientId: string, analyte: string, limit?: number): Promise<any[]>;
    createDeltaCheckAlert(patientId: string, deltaCheck: DeltaCheck): Promise<void>;
    getDeltaCheckConfigs(): Promise<DeltaCheckConfig[]>;
    updateDeltaCheckConfig(analyte: string, config: Partial<DeltaCheckConfig>): Promise<DeltaCheckConfig>;
    private getDeltaCheckConfig;
    private findPreviousResult;
    private calculateDelta;
    private createAlert;
    getSignificantDeltaChecks(patientId: string, days?: number): Promise<DeltaCheck[]>;
}
