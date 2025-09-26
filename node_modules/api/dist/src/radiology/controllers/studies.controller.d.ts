import { StudiesService } from '../services/studies.service';
import { CreateStudyDto, UpdateStudyDto, StudyFilterDto, StudyListDto } from '../dto/studies.dto';
export declare class StudiesController {
    private readonly studiesService;
    constructor(studiesService: StudiesService);
    create(createDto: CreateStudyDto): Promise<Study>;
    findAll(filterDto: StudyFilterDto, listDto: StudyListDto): Promise<{
        data: Study[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Study>;
    update(id: string, updateDto: UpdateStudyDto): Promise<Study>;
    startStudy(id: string): Promise<Study>;
    completeStudy(id: string): Promise<Study>;
    getStudyByUID(studyInstanceUID: string): Promise<Study>;
    getStudiesByOrder(orderId: string): Promise<Study[]>;
    getStudyImages(studyId: string): Promise<any[]>;
    updateDicomMetadata(id: string, dicomMetadata: Record<string, any>): Promise<Study>;
    getStats(req: any): Promise<{
        total: any;
        today: any;
        byStatus: {
            [k: string]: any;
        };
        byModality: {
            [k: string]: any;
        };
    }>;
    remove(id: string): Promise<void>;
}
