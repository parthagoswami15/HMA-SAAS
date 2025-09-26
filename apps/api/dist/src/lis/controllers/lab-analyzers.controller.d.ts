import { LabAnalyzersService } from '../services/lab-analyzers.service';
import { CreateAnalyzerDto, UpdateAnalyzerDto, AnalyzerResponseDto } from '../dto/lab-analyzer.dto';
export declare class LabAnalyzersController {
    private readonly labAnalyzersService;
    constructor(labAnalyzersService: LabAnalyzersService);
    createAnalyzer(createAnalyzerDto: CreateAnalyzerDto): Promise<AnalyzerResponseDto>;
    getAllAnalyzers(type?: string, status?: string, isActive?: boolean, location?: string): Promise<AnalyzerResponseDto[]>;
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
}
