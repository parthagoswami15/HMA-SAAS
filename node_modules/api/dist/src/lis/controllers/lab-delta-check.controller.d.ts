import { LabDeltaCheckService } from '../services/lab-delta-check.service';
import { DeltaCheckDto, DeltaCheckConfigDto, UpdateDeltaCheckConfigDto, DeltaCheckAlertDto } from '../dto/lab-delta-check.dto';
export declare class LabDeltaCheckController {
    private readonly labDeltaCheckService;
    constructor(labDeltaCheckService: LabDeltaCheckService);
    performDeltaChecks(patientId: string, results: any[]): Promise<DeltaCheckDto[]>;
    getDeltaCheckHistory(patientId: string, analyte: string, limit?: number): Promise<any[]>;
    createDeltaCheckAlert(alertDto: DeltaCheckAlertDto): Promise<{
        message: string;
    }>;
    getDeltaCheckConfigs(): Promise<DeltaCheckConfigDto[]>;
    updateDeltaCheckConfig(analyte: string, configDto: UpdateDeltaCheckConfigDto): Promise<DeltaCheckConfigDto>;
    getSignificantDeltaChecks(patientId: string, days?: number): Promise<DeltaCheckDto[]>;
    performDeltaChecksForOrder(orderId: string): Promise<{
        message: string;
        deltaChecks: DeltaCheckDto[];
    }>;
}
