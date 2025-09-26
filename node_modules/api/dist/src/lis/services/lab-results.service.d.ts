import { PrismaService } from '../../prisma/prisma.service';
import { CreateLabResultDto, UpdateLabResultDto, LabResultResponseDto } from '../dto/lab-result.dto';
import { LabValidationService } from './lab-validation.service';
export declare class LabResultsService {
    private prisma;
    private validationService;
    constructor(prisma: PrismaService, validationService: LabValidationService);
    createResult(createResultDto: CreateLabResultDto): Promise<LabResultResponseDto>;
    getAllResults(filters?: any): Promise<LabResultResponseDto[]>;
    getResultById(id: string): Promise<LabResultResponseDto>;
    updateResult(id: string, updateResultDto: UpdateLabResultDto): Promise<LabResultResponseDto>;
    deleteResult(id: string): Promise<{
        message: string;
    }>;
    getResultsByOrder(orderId: string): Promise<LabResultResponseDto[]>;
    getResultsByTest(testId: string, dateFrom?: Date, dateTo?: Date): Promise<LabResultResponseDto[]>;
    validateResult(id: string, validatedBy: string): Promise<LabResultResponseDto>;
    reviewResult(id: string, reviewedBy: string): Promise<LabResultResponseDto>;
    finalizeResult(id: string, finalizedBy: string): Promise<LabResultResponseDto>;
    getCriticalResults(): Promise<LabResultResponseDto[]>;
    private mapToResponseDto;
}
