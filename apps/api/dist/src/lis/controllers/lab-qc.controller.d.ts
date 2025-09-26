import { LabQcService } from '../services/lab-qc.service';
import { CreateQcRunDto, QcRunResponseDto } from '../dto/lab-analyzer.dto';
export declare class LabQcController {
    private readonly labQcService;
    constructor(labQcService: LabQcService);
    createQcRun(createQcRunDto: CreateQcRunDto): Promise<QcRunResponseDto>;
    getAllQcRuns(analyzerId?: string, isPassed?: boolean, operator?: string, dateFrom?: string, dateTo?: string): Promise<QcRunResponseDto[]>;
    getQcRunById(id: string): Promise<QcRunResponseDto>;
    updateQcRun(id: string, updateData: any): Promise<QcRunResponseDto>;
    deleteQcRun(id: string): Promise<{
        message: string;
    }>;
    evaluateQcRun(id: string): Promise<QcRunResponseDto>;
    getQcRunsByAnalyzer(analyzerId: string): Promise<QcRunResponseDto[]>;
    getQcRunsByDateRange(dateFrom: string, dateTo: string): Promise<QcRunResponseDto[]>;
    getFailedQcRuns(): Promise<QcRunResponseDto[]>;
    getRecentQcRuns(days: number): Promise<QcRunResponseDto[]>;
}
