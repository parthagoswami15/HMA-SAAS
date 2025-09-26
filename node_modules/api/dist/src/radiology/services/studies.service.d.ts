import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudyDto, UpdateStudyDto, StudyFilterDto, StudyListDto } from '../dto/studies.dto';
import { Study } from '@prisma/client';
export declare class StudiesService {
    private prisma;
    constructor(prisma: PrismaService);
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
    getStats(tenantId: string): Promise<{
        total: any;
        today: any;
        byStatus: {
            [k: string]: any;
        };
        byModality: {
            [k: string]: any;
        };
    }>;
    private generateStudyUID;
    updateDicomMetadata(id: string, dicomMetadata: Record<string, any>): Promise<Study>;
    getStudyImages(studyId: string): Promise<any[]>;
}
