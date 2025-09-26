import { ModalitiesService } from '../services/modalities.service';
import { CreateModalityDto, UpdateModalityDto, ModalityWorklistDto, TestModalityConnectionDto } from '../dto/modalities.dto';
export declare class ModalitiesController {
    private readonly modalitiesService;
    constructor(modalitiesService: ModalitiesService);
    create(createDto: CreateModalityDto, req: any): Promise<Modality>;
    findAll(modalityType?: string, isActive?: string, page?: number, limit?: number): Promise<{
        data: Modality[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Modality>;
    update(id: string, updateDto: UpdateModalityDto): Promise<Modality>;
    getWorklist(modalityId: string): Promise<any[]>;
    sendToWorklist(modalityId: string, worklistDto: ModalityWorklistDto): Promise<any>;
    testConnection(modalityId: string, testDto: TestModalityConnectionDto): Promise<any>;
    getStats(req: any): Promise<any>;
    activate(id: string): Promise<Modality>;
    deactivate(id: string): Promise<Modality>;
    remove(id: string): Promise<void>;
}
