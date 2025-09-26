import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationService } from '../notifications/notification.service';
import { Gender, BloodType, MaritalStatus, RegistrationType, InsuranceType } from '../common/enums/patient.enums';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { PatientRegistrationDto, EmergencyContactDto } from './dto/patient-registration.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { FileStorageService } from '../file-storage/file-storage.service';
import { PatientRepository } from './repositories/patient.repository';
import { PrismaService } from '../prisma/prisma.service';
export interface Patient {
    id: string;
    tenantId: string;
    registrationNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: Date;
    gender: Gender;
    bloodType?: BloodType;
    maritalStatus?: MaritalStatus;
    registrationType: RegistrationType;
    insuranceType?: InsuranceType;
    insuranceNumber?: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    emergencyContacts?: EmergencyContactDto[];
    medicalHistory?: string;
    allergies?: string[];
    currentMedications?: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
}
export declare class PatientsService {
    private readonly patientRepository;
    private eventEmitter;
    private notificationService;
    private fileStorageService;
    private prisma;
    private readonly logger;
    constructor(patientRepository: PatientRepository, eventEmitter: EventEmitter2, notificationService: NotificationService, fileStorageService: FileStorageService, prisma: PrismaService);
    registerPatient(tenantId: string, data: PatientRegistrationDto, createdById?: string): Promise<PatientResponseDto>;
    getTenantBySlug(slug: string): Promise<any>;
    checkPatientExists(params: {
        email?: string;
        phone?: string;
        aadhaarNumber?: string;
    }): Promise<any>;
    uploadPatientDocument(params: {
        patientId: string;
        file: any;
        documentType: string;
        uploadedBy: string;
        tenantId: string;
    }): Promise<{
        id: any;
        documentType: any;
        fileName: any;
        fileUrl: any;
        uploadedAt: any;
    }>;
    private validatePatientData;
    private generateMedicalRecordNumber;
    private generateRegistrationNumber;
    private calculateAge;
    private addEmergencyContacts;
    create(tenantId: string, data: CreatePatientDto, createdById?: string): Promise<PatientResponseDto>;
    findOne(tenantId: string, id: string, includeDeleted?: boolean): Promise<PatientResponseDto>;
    private mapToDto;
    list(tenantId: string, page?: number, limit?: number, search?: string, status?: 'active' | 'inactive' | 'all', filters?: Record<string, any>): Promise<PaginatedResponseDto<PatientResponseDto>>;
    update(tenantId: string, id: string, data: UpdatePatientDto): Promise<PatientResponseDto>;
    remove(tenantId: string, id: string, hardDelete?: boolean): Promise<{
        success: boolean;
    }>;
}
