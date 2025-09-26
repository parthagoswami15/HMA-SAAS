import { PACSService } from '../services/pacs.service';
import { StoreDicomDto, QueryDicomDto, RetrieveDicomDto } from '../dto/pacs.dto';
export declare class PACSController {
    private readonly pacsService;
    constructor(pacsService: PACSService);
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
    getStorageStats(req: any): Promise<any>;
    cleanupOrphanedData(): Promise<any>;
    getStudyForViewer(studyInstanceUID: string): Promise<any>;
    getSeriesImages(seriesInstanceUID: string): Promise<{
        seriesInstanceUID: string;
        images: never[];
    }>;
}
