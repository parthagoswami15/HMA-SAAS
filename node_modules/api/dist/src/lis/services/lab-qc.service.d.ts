import { PrismaService } from '../../prisma/prisma.service';
import { CreateQcRunDto, QcRunResponseDto } from '../dto/lab-analyzer.dto';
export declare class LabQcService {
    private prisma;
    constructor(prisma: PrismaService);
    createQcRun(createQcRunDto: CreateQcRunDto): Promise<QcRunResponseDto>;
    getAllQcRuns(filters?: any): Promise<QcRunResponseDto[]>;
    getQcRunById(id: string): Promise<QcRunResponseDto>;
    updateQcRun(id: string, updateData: any): Promise<QcRunResponseDto>;
    deleteQcRun(id: string): Promise<{
        message: string;
    }>;
    evaluateQcRun(id: string): Promise<QcRunResponseDto>;
    getQcRunsByAnalyzer(analyzerId: string): Promise<QcRunResponseDto[]>;
    getQcRunsByDateRange(dateFrom: Date, dateTo: Date): Promise<QcRunResponseDto[]>;
    getFailedQcRuns(): Promise<QcRunResponseDto[]>;
    getRecentQcRuns(days?: number): Promise<QcRunResponseDto[]>;
    private evaluateQcResults;
    private mapToResponseDto;
}
