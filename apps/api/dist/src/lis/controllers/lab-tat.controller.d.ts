import { LabTatService } from '../services/lab-tat.service';
import { TATConfigDto, TATMetricsDto, UpdateTATConfigDto, TATPerformanceDto, SLAViolationDto, STATOrderAlertDto } from '../dto/lab-tat.dto';
export declare class LabTatController {
    private readonly labTatService;
    constructor(labTatService: LabTatService);
    calculateTAT(orderId: string): Promise<TATMetricsDto[]>;
    getTATPerformance(tenantId: string, startDate: string, endDate: string): Promise<TATPerformanceDto>;
    checkSLAViolations(tenantId: string): Promise<SLAViolationDto[]>;
    getTATConfigs(tenantId: string): Promise<TATConfigDto[]>;
    updateTATConfig(id: string, configDto: UpdateTATConfigDto): Promise<TATConfigDto>;
    getSTATOrdersRequiringAttention(): Promise<STATOrderAlertDto[]>;
    getSLAViolationsCount(tenantId: string): Promise<{
        count: number;
    }>;
    getTATPerformanceSummary(tenantId: string, days?: number): Promise<any>;
    private getTopPerformers;
    private getAreasForImprovement;
}
