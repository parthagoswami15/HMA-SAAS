export declare enum DicomStorageClass {
    CT_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.2",
    MR_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.4",
    US_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.6.1",
    CR_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.1",
    DX_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.1.1",
    MG_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.1.2",
    NM_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.20",
    PT_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.128",
    XA_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.12.1",
    RF_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.12.2",
    US_MULTIFRAME_IMAGE_STORAGE = "1.2.840.10008.5.1.4.1.1.3.1"
}
export declare enum DicomQueryLevel {
    PATIENT = "PATIENT",
    STUDY = "STUDY",
    SERIES = "SERIES",
    IMAGE = "IMAGE"
}
export declare class StoreDicomDto {
    studyInstanceUID: string;
    seriesInstanceUID: string;
    sopInstanceUID: string;
    sopClassUID: string;
    dicomData: string;
    patientId?: string;
    accessionNumber?: string;
    metadata?: Record<string, any>;
}
export declare class QueryDicomDto {
    queryLevel: DicomQueryLevel;
    patientId?: string;
    patientName?: string;
    studyInstanceUID?: string;
    accessionNumber?: string;
    studyDate?: string;
    modality?: string;
    seriesInstanceUID?: string;
    sopInstanceUID?: string;
    queryParams?: Record<string, any>;
}
export declare class RetrieveDicomDto {
    studyInstanceUID: string;
    seriesInstanceUID?: string;
    sopInstanceUID?: string;
    includeBulkData?: string;
}
export declare class DicomStudyDto {
    studyInstanceUID: string;
    accessionNumber?: string;
    studyDate?: string;
    studyTime?: string;
    studyDescription?: string;
    patientName?: string;
    patientId?: string;
    modalitiesInStudy?: string;
    numberOfStudyRelatedSeries?: string;
    numberOfStudyRelatedInstances?: string;
}
export declare class DicomSeriesDto {
    seriesInstanceUID: string;
    seriesNumber?: string;
    modality?: string;
    seriesDate?: string;
    seriesTime?: string;
    seriesDescription?: string;
    bodyPartExamined?: string;
    numberOfSeriesRelatedInstances?: string;
}
export declare class DicomImageDto {
    sopInstanceUID: string;
    instanceNumber?: string;
    sopClassUID?: string;
    rows?: string;
    columns?: string;
}
