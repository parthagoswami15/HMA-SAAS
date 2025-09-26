import { LabPanicAlertService } from '../services/lab-panic-alert.service';
import { PanicAlertDto, PanicThresholdDto, AcknowledgePanicAlertDto, PanicAlertStatisticsDto, UpdatePanicThresholdDto } from '../dto/lab-panic-alert.dto';
export declare class LabPanicAlertController {
    private readonly labPanicAlertService;
    constructor(labPanicAlertService: LabPanicAlertService);
    checkForPanicAlerts(orderId: string, results: any[]): Promise<{
        message: string;
        alerts: PanicAlertDto[];
    }>;
    getActivePanicAlerts(tenantId: string): Promise<PanicAlertDto[]>;
    acknowledgePanicAlert(alertId: string, ackDto: AcknowledgePanicAlertDto): Promise<{
        message: string;
    }>;
    getPanicAlertsByPatient(patientId: string): Promise<PanicAlertDto[]>;
    getPanicAlertStatistics(tenantId: string, days?: number): Promise<PanicAlertStatisticsDto>;
    getPanicThresholds(): Promise<PanicThresholdDto[]>;
    updatePanicThreshold(analyte: string, thresholdDto: UpdatePanicThresholdDto): Promise<PanicThresholdDto>;
    evaluatePanicAlerts(orderId: string, results: any[]): Promise<{
        message: string;
        alertsCreated: number;
    }>;
    getPendingPanicAlertsCount(tenantId: string): Promise<{
        count: number;
    }>;
}
