import { PatientRegistrationDto } from '../dto/patient-registration.dto';
import { PatientsService } from '../patients.service';
import { PatientResponseDto } from '../dto/patient-response.dto';
export declare class PatientRegistrationController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    registerWalkInPatient(user: {
        tenantId: string;
        id: string;
    }, data: PatientRegistrationDto): Promise<PatientResponseDto>;
    registerOnlinePatient(tenantSlug: string, data: PatientRegistrationDto): Promise<PatientResponseDto>;
    registerReferredPatient(user: {
        tenantId: string;
        id: string;
    }, data: PatientRegistrationDto): Promise<PatientResponseDto>;
    uploadDocument(user: {
        tenantId: string;
        id: string;
    }, patientId: string, file: Express.Multer.File, documentType: string): Promise<{
        id: any;
        documentType: any;
        fileName: any;
        fileUrl: any;
        uploadedAt: any;
    }>;
    checkPatientExists(email?: string, phone?: string, aadhaar?: string): Promise<{
        exists: boolean;
        patient: PatientResponseDto | null;
    }>;
}
