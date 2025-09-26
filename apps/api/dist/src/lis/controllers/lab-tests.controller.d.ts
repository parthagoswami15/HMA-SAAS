import { LabTestsService } from '../services/lab-tests.service';
import { CreateLabTestDto, UpdateLabTestDto, LabTestResponseDto } from '../dto/lab-test.dto';
export declare class LabTestsController {
    private readonly labTestsService;
    constructor(labTestsService: LabTestsService);
    createTest(createTestDto: CreateLabTestDto): Promise<LabTestResponseDto>;
    getAllTests(category?: string, active?: boolean): Promise<LabTestResponseDto[]>;
    getTestById(id: string): Promise<LabTestResponseDto>;
    updateTest(id: string, updateTestDto: UpdateLabTestDto): Promise<LabTestResponseDto>;
    deleteTest(id: string): Promise<{
        message: string;
    }>;
    getTestsByPanel(panelId: string): Promise<LabTestResponseDto[]>;
}
