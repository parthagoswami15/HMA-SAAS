import { FileStorageService } from '../../file-storage/file-storage.service';
import { PatientDocumentDto, CreatePatientDocumentDto, UpdatePatientDocumentDto, PatientDocumentQueryDto } from '../dto/patient-document.dto';
import { PatientsService } from '../patients.service';
import { PrismaService } from '../../prisma/prisma.service';
export declare class PatientDocumentsController {
    private readonly patientsService;
    private readonly prisma;
    private readonly fileStorageService;
    constructor(patientsService: PatientsService, prisma: PrismaService, fileStorageService: FileStorageService);
    uploadDocument(patientId: string, file: Express.Multer.File, createDto: CreatePatientDocumentDto, user: {
        id: string;
        tenantId: string;
    }): Promise<PatientDocumentDto>;
    getPatientDocuments(patientId: string, query: PatientDocumentQueryDto, user: {
        tenantId: string;
    }): Promise<{
        data: PatientDocumentDto[];
        total: number;
    }>;
    getDocument(patientId: string, documentId: string, user: {
        tenantId: string;
    }): Promise<PatientDocumentDto>;
    updateDocument(patientId: string, documentId: string, updateDto: UpdatePatientDocumentDto, user: {
        tenantId: string;
    }): Promise<PatientDocumentDto>;
    deleteDocument(patientId: string, documentId: string, user: {
        tenantId: string;
    }): Promise<void>;
}
