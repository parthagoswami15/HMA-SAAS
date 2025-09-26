import { LabPanelsService } from '../services/lab-panels.service';
import { CreateLabPanelDto, UpdateLabPanelDto, LabPanelResponseDto } from '../dto/lab-panel.dto';
export declare class LabPanelsController {
    private readonly labPanelsService;
    constructor(labPanelsService: LabPanelsService);
    createPanel(createPanelDto: CreateLabPanelDto): Promise<LabPanelResponseDto>;
    getAllPanels(category?: string, isActive?: boolean, search?: string): Promise<LabPanelResponseDto[]>;
    getPanelById(id: string): Promise<LabPanelResponseDto>;
    updatePanel(id: string, updatePanelDto: UpdateLabPanelDto): Promise<LabPanelResponseDto>;
    deletePanel(id: string): Promise<{
        message: string;
    }>;
    addTestToPanel(panelId: string, testId: string): Promise<LabPanelResponseDto>;
    removeTestFromPanel(panelId: string, testId: string): Promise<LabPanelResponseDto>;
    getPanelsByCategory(category: string): Promise<LabPanelResponseDto[]>;
    getActivePanels(): Promise<LabPanelResponseDto[]>;
}
