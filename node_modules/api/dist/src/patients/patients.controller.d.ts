import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
export declare class PatientsController {
    private patients;
    constructor(patients: PatientsService);
    create(user: {
        tenantId: string;
    }, dto: CreatePatientDto): Promise<PatientResponseDto>;
    list(user: {
        tenantId: string;
    }, page?: number, limit?: number, search?: string, status?: 'active' | 'inactive' | 'all'): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<PatientResponseDto>>;
    get(user: {
        tenantId: string;
    }, id: string, includeDeleted?: boolean): Promise<PatientResponseDto>;
    update(user: {
        tenantId: string;
    }, id: string, dto: UpdatePatientDto): Promise<PatientResponseDto>;
    remove(user: {
        tenantId: string;
    }, id: string, hardDelete?: boolean): Promise<{
        message: string;
        success: boolean;
    }>;
}
