import { ReportStatus, BIRADS, LungRADS } from '@prisma/client';
export declare class CreateRadReportDto {
    studyId: string;
    orderId?: string;
    reportType?: string;
    clinicalHistory?: string;
    comparison?: string;
    technique?: string;
    findingsText?: string;
    impression?: string;
    recommendations?: string;
    conclusion?: string;
    findings?: Record<string, any>;
    biRadsScore?: BIRADS;
    lungRadsScore?: LungRADS;
    otherScores?: Record<string, any>;
    dictatedBy?: string;
    primaryReadBy?: string;
    secondReadBy?: string;
    signedBy?: string;
    sharedWithPatient?: boolean;
    sharedWithDoctor?: boolean;
    requiresSecondRead?: boolean;
    peerReviewRequired?: boolean;
}
export declare class UpdateRadReportDto {
    status?: ReportStatus;
    clinicalHistory?: string;
    comparison?: string;
    technique?: string;
    findingsText?: string;
    impression?: string;
    recommendations?: string;
    conclusion?: string;
    findings?: Record<string, any>;
    biRadsScore?: BIRADS;
    lungRadsScore?: LungRADS;
    otherScores?: Record<string, any>;
    dictatedBy?: string;
    primaryReadBy?: string;
    secondReadBy?: string;
    signedBy?: string;
    sharedWithPatient?: boolean;
    sharedWithDoctor?: boolean;
    requiresSecondRead?: boolean;
    peerReviewRequired?: boolean;
    peerReviewedBy?: string;
}
export declare class SignRadReportDto {
    signedBy: string;
    finalImpression?: string;
    finalRecommendations?: string;
}
export declare class RadReportFilterDto {
    status?: ReportStatus;
    biRadsScore?: BIRADS;
    lungRadsScore?: LungRADS;
    studyId?: string;
    dictatedBy?: string;
    primaryReadBy?: string;
    signedBy?: string;
    dateFrom?: string;
    dateTo?: string;
    requiresSecondRead?: boolean;
    peerReviewRequired?: boolean;
}
export declare class RadReportListDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: boolean;
}
