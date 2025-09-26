import { ModalityType, StudyStatus } from '@prisma/client';
export declare class CreateStudyDto {
    orderId: string;
    studyInstanceUID: string;
    accessionNumber?: string;
    studyDate: string;
    studyTime?: string;
    studyDescription?: string;
    procedureCode?: string;
    modalityType: ModalityType;
    performingPhysician?: string;
    readingPhysician?: string;
    dicomMetadata?: Record<string, any>;
}
export declare class UpdateStudyDto {
    accessionNumber?: string;
    studyDescription?: string;
    procedureCode?: string;
    status?: StudyStatus;
    performingPhysician?: string;
    readingPhysician?: string;
    dicomMetadata?: Record<string, any>;
}
export declare class StudyFilterDto {
    status?: StudyStatus;
    modalityType?: ModalityType;
    orderId?: string;
    performingPhysician?: string;
    readingPhysician?: string;
    dateFrom?: string;
    dateTo?: string;
}
export declare class StudyListDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: boolean;
}
