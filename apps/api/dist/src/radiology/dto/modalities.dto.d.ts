import { ModalityType } from '@prisma/client';
export declare class CreateModalityDto {
    name: string;
    modalityType: ModalityType;
    aeTitle: string;
    hostname: string;
    port?: number;
    location?: string;
    manufacturer?: string;
    model?: string;
    description?: string;
    isActive?: boolean;
}
export declare class UpdateModalityDto {
    name?: string;
    modalityType?: ModalityType;
    aeTitle?: string;
    hostname?: string;
    port?: number;
    location?: string;
    manufacturer?: string;
    model?: string;
    description?: string;
    isActive?: boolean;
}
export declare class ModalityWorklistDto {
    studyId: string;
    patientName: string;
    patientId: string;
    accessionNumber?: string;
    studyInstanceUID: string;
    worklistData?: Record<string, any>;
}
export declare class TestModalityConnectionDto {
    modalityId: string;
    testMessage?: string;
}
