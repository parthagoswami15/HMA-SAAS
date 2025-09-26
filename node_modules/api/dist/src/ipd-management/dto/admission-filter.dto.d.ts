import { AdmissionStatus, AdmissionType } from '../enums';
export declare class AdmissionFilterDto {
    search?: string;
    status?: AdmissionStatus;
    type?: AdmissionType;
    patientId?: string;
    doctorId?: string;
    wardId?: string;
    bedId?: string;
    admissionDateFrom?: string;
    admissionDateTo?: string;
    dischargeDateFrom?: string;
    dischargeDateTo?: string;
    isEmergency?: boolean;
    insuranceProvider?: string;
    diagnosis?: string;
    minStayDays?: number;
    maxStayDays?: number;
    includeDischarged?: boolean;
    includeActive?: boolean;
    includeTransferred?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
    include?: string;
    ids?: string[];
}
