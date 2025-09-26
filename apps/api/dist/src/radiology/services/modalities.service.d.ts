import { PrismaService } from '../../prisma/prisma.service';
import { CreateModalityDto, UpdateModalityDto, ModalityWorklistDto, TestModalityConnectionDto } from '../dto/modalities.dto';
import { Modality } from '@prisma/client';
export declare class ModalitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateModalityDto, tenantId: string): Promise<Modality>;
    findAll(filterDto: any, listDto: any): Promise<{
        data: Modality[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Modality>;
    update(id: string, updateDto: UpdateModalityDto): Promise<Modality>;
    updateStatus(id: string, isActive: boolean): Promise<Modality>;
    getWorklist(modalityId: string): Promise<any[]>;
    sendToWorklist(modalityId: string, worklistDto: ModalityWorklistDto): Promise<any>;
    testConnection(modalityId: string, testDto: TestModalityConnectionDto): Promise<any>;
    getStats(tenantId: string): Promise<any>;
    remove(id: string): Promise<void>;
}
