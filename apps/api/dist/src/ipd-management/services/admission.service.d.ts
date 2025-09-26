import { Repository } from 'typeorm';
import { Admission } from '../entities/admission.entity';
import { CreateAdmissionDto } from '../dto/admission/create-admission.dto';
import { UpdateAdmissionDto } from '../dto/admission/update-admission.dto';
import { AdmissionFilterDto } from '../dto/admission/admission-filter.dto';
import { AdmissionResponseDto } from '../dto/admission/admission-response.dto';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Bed } from '../entities/bed.entity';
import { BedService } from './bed.service';
export declare class AdmissionService {
    private readonly admissionRepository;
    private readonly patientRepository;
    private readonly staffRepository;
    private readonly bedRepository;
    private readonly bedService;
    constructor(admissionRepository: Repository<Admission>, patientRepository: Repository<Patient>, staffRepository: Repository<Staff>, bedRepository: Repository<Bed>, bedService: BedService);
    create(createAdmissionDto: CreateAdmissionDto, userId: string): Promise<AdmissionResponseDto>;
    findAll(filterDto: AdmissionFilterDto): Promise<{
        data: AdmissionResponseDto[];
        total: number;
    }>;
    findOne(id: string): Promise<AdmissionResponseDto>;
    update(id: string, updateAdmissionDto: UpdateAdmissionDto, userId: string): Promise<AdmissionResponseDto>;
    remove(id: string, userId: string): Promise<void>;
    getActiveAdmissionByPatientId(patientId: string): Promise<AdmissionResponseDto | null>;
    getAdmissionStatistics(): Promise<{
        totalAdmissions: number;
        activeAdmissions: number;
        admissionsByType: any;
    }>;
}
