import { PrismaService } from '../../prisma/prisma.service';
import { CreateLabTestDto, UpdateLabTestDto, LabTestResponseDto } from '../dto/lab-test.dto';
export declare class LabTestsService {
    private prisma;
    constructor(prisma: PrismaService);
    createTest(createTestDto: CreateLabTestDto): Promise<LabTestResponseDto>;
    getAllTests(category?: string, active?: boolean): Promise<LabTestResponseDto[]>;
    getTestById(id: string): Promise<LabTestResponseDto>;
    updateTest(id: string, updateTestDto: UpdateLabTestDto): Promise<LabTestResponseDto>;
    deleteTest(id: string): Promise<{
        message: string;
    }>;
    getTestsByPanel(panelId: string): Promise<LabTestResponseDto[]>;
    private mapToResponseDto;
}
