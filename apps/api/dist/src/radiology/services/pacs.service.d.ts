import { PrismaService } from '../../prisma/prisma.service';
import { StoreDicomDto, QueryDicomDto, RetrieveDicomDto } from '../dto/pacs.dto';
import { Study, Series, Image } from '@prisma/client';
export declare class PACSService {
    private prisma;
    constructor(prisma: PrismaService);
    storeDicom(storeDto: StoreDicomDto): Promise<{
        study: Study;
        series: Series;
        image: Image;
    }>;
    queryDicom(queryDto: QueryDicomDto): Promise<any[]>;
    retrieveDicom(retrieveDto: RetrieveDicomDto): Promise<any>;
    getStudyHierarchy(studyInstanceUID: string): Promise<any>;
    getPatientStudies(patientId: string): Promise<any[]>;
    searchStudies(searchTerm: string): Promise<any[]>;
    getStorageStats(tenantId: string): Promise<any>;
    cleanupOrphanedData(): Promise<any>;
}
