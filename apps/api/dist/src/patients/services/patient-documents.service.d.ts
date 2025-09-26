import { PrismaService } from '../../prisma/prisma.service';
import { FileStorageService } from '../../file-storage/file-storage.service';
import { FileUpload } from '../../file-storage/interfaces/file-upload.interface';
import { CreatePatientDocumentDto } from '../dto/create-patient-document.dto';
import { UpdatePatientDocumentDto } from '../dto/update-patient-document.dto';
import { PatientDocument } from '@prisma/client';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';
export declare class PatientDocumentsService {
    private prisma;
    private fileStorageService;
    constructor(prisma: PrismaService, fileStorageService: FileStorageService);
    uploadDocument(patientId: string, createDocumentDto: CreatePatientDocumentDto, file: FileUpload, userId: string, tenantId: string): Promise<PatientDocument>;
    findAll(patientId: string, query: any, tenantId: string): Promise<PaginatedResponse<PatientDocument>>;
    findOne(id: string, tenantId: string): Promise<PatientDocument>;
    update(id: string, updateDocumentDto: UpdatePatientDocumentDto, tenantId: string): Promise<PatientDocument>;
    remove(id: string, tenantId: string): Promise<void>;
    getDocumentFileStream(id: string, tenantId: string): Promise<NodeJS.ReadableStream>;
}
