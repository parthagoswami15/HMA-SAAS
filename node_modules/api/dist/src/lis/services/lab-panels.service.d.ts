import { PrismaService } from '../../prisma/prisma.service';
import { CreateLabPanelDto, UpdateLabPanelDto, LabPanelResponseDto } from '../dto/lab-panel.dto';
export declare class LabPanelsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPanel(createPanelDto: CreateLabPanelDto): Promise<LabPanelResponseDto>;
    getAllPanels(filters?: any): Promise<LabPanelResponseDto[]>;
    getPanelById(id: string): Promise<LabPanelResponseDto>;
    updatePanel(id: string, updatePanelDto: UpdateLabPanelDto): Promise<LabPanelResponseDto>;
    deletePanel(id: string): Promise<{
        message: string;
    }>;
    addTestToPanel(panelId: string, testId: string): Promise<LabPanelResponseDto>;
    removeTestFromPanel(panelId: string, testId: string): Promise<LabPanelResponseDto>;
    getPanelsByCategory(category: string): Promise<LabPanelResponseDto[]>;
    getActivePanels(): Promise<LabPanelResponseDto[]>;
    private mapToResponseDto;
}
