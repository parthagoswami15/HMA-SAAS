import { AdmissionService } from '../services/admission.service';
import { CreateAdmissionDto } from '../dto/create-admission.dto';
import { UpdateAdmissionDto } from '../dto/update-admission.dto';
import { AdmissionFilterDto } from '../dto/admission-filter.dto';
export declare class AdmissionController {
    private readonly admissionService;
    constructor(admissionService: AdmissionService);
    createAdmission(createAdmissionDto: CreateAdmissionDto): Promise<any>;
    getAdmissions(filterDto: AdmissionFilterDto): Promise<any>;
    getAdmissionById(id: string): Promise<any>;
    updateAdmission(id: string, updateAdmissionDto: UpdateAdmissionDto): Promise<any>;
    cancelAdmission(id: string, cancellationReason: string, cancelledById: string): Promise<any>;
    transferBed(admissionId: string, newBedId: string, transferredById: string, reason?: string): Promise<any>;
    getPatientAdmissions(patientId: string, status?: string, limit?: number): Promise<any>;
    getOccupancyStats(): Promise<any>;
    getAdmissionStats(startDate?: string, endDate?: string): Promise<any>;
}
