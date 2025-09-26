import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnalyzerDto, UpdateAnalyzerDto, AnalyzerResponseDto } from '../dto/lab-analyzer.dto';
export declare class LabAnalyzersService {
    private prisma;
    constructor(prisma: PrismaService);
    createAnalyzer(createAnalyzerDto: CreateAnalyzerDto): Promise<AnalyzerResponseDto>;
    getAllAnalyzers(filters?: any): Promise<AnalyzerResponseDto[]>;
    getAnalyzerById(id: string): Promise<AnalyzerResponseDto>;
    updateAnalyzer(id: string, updateAnalyzerDto: UpdateAnalyzerDto): Promise<AnalyzerResponseDto>;
    deleteAnalyzer(id: string): Promise<{
        message: string;
    }>;
    updateAnalyzerStatus(id: string, status: string): Promise<AnalyzerResponseDto>;
    updateAnalyzerCommunication(id: string): Promise<AnalyzerResponseDto>;
    getAnalyzersByType(type: string): Promise<AnalyzerResponseDto[]>;
    getActiveAnalyzers(): Promise<AnalyzerResponseDto[]>;
    getOnlineAnalyzers(): Promise<AnalyzerResponseDto[]>;
    private mapToResponseDto;
}
