import { LabResultsService } from '../services/lab-results.service';
import { CreateLabResultDto, UpdateLabResultDto, LabResultResponseDto, ValidationStatus } from '../dto/lab-result.dto';
export declare class LabResultsController {
    private readonly labResultsService;
    constructor(labResultsService: LabResultsService);
    createResult(createResultDto: CreateLabResultDto): Promise<LabResultResponseDto>;
    getAllResults(orderId?: string, testId?: string, validationStatus?: ValidationStatus, flag?: string, dateFrom?: string, dateTo?: string): Promise<LabResultResponseDto[]>;
    getResultById(id: string): Promise<LabResultResponseDto>;
    updateResult(id: string, updateResultDto: UpdateLabResultDto): Promise<LabResultResponseDto>;
    deleteResult(id: string): Promise<{
        message: string;
    }>;
    getResultsByOrder(orderId: string): Promise<LabResultResponseDto[]>;
    getResultsByTest(testId: string, dateFrom?: string, dateTo?: string): Promise<LabResultResponseDto[]>;
    validateResult(id: string, validatedBy: string): Promise<LabResultResponseDto>;
    reviewResult(id: string, reviewedBy: string): Promise<LabResultResponseDto>;
    finalizeResult(id: string, finalizedBy: string): Promise<LabResultResponseDto>;
    getCriticalResults(): Promise<LabResultResponseDto[]>;
}
