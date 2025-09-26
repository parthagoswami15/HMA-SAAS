import { ModalityType, ImagingOrderStatus, ImagingPriority, ContrastType } from '@prisma/client';
export declare class CreateImagingOrderDto {
    visitId?: string;
    patientId: string;
    modalityType: ModalityType;
    modalityId?: string;
    protocol: string;
    bodyPart?: string;
    clinicalHistory?: string;
    priority?: ImagingPriority;
    contrastType?: ContrastType;
    contrastAgent?: string;
    contrastVolume?: string;
    contrastAllergy?: boolean;
    allergyDetails?: string;
    isPregnant?: boolean;
    pregnancyDetails?: string;
    isInpatient?: boolean;
    isolationRequired?: boolean;
    specialInstructions?: string;
    previousStudies?: string;
    cumulativeDose?: number;
}
export declare class UpdateImagingOrderDto {
    modalityType?: ModalityType;
    modalityId?: string;
    protocol?: string;
    bodyPart?: string;
    clinicalHistory?: string;
    priority?: ImagingPriority;
    status?: ImagingOrderStatus;
    scheduledFor?: string;
    contrastType?: ContrastType;
    contrastAgent?: string;
    contrastVolume?: string;
    contrastAllergy?: boolean;
    allergyDetails?: string;
    isPregnant?: boolean;
    pregnancyDetails?: string;
    isInpatient?: boolean;
    isolationRequired?: boolean;
    specialInstructions?: string;
    previousStudies?: string;
    cumulativeDose?: number;
}
export declare class ScheduleImagingOrderDto {
    scheduledFor: string;
    modalityId?: string;
    scheduledBy?: string;
}
export declare class ImagingOrderFilterDto {
    status?: ImagingOrderStatus;
    modalityType?: ModalityType;
    priority?: ImagingPriority;
    patientId?: string;
    dateFrom?: string;
    dateTo?: string;
    contrastAllergy?: boolean;
    isPregnant?: boolean;
}
export declare class ImagingOrderListDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: boolean;
}
