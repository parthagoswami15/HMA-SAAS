import { AdmissionType } from '../../enums/admission-type.enum';
import { AdmissionStatus } from '../../enums/admission-status.enum';
export declare class AdmissionFilterDto {
    patientId?: string;
    doctorId?: string;
    wardId?: string;
    bedId?: string;
    admissionType?: AdmissionType;
    status?: AdmissionStatus;
    admissionDateFrom?: Date;
    admissionDateTo?: Date;
    dischargeDateFrom?: Date;
    dischargeDateTo?: Date;
    activeOnly?: boolean;
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
