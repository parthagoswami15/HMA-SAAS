import { Repository } from 'typeorm';
import { Document, DocumentStatus, DocumentType } from '../entities/document.entity';
export declare class DocumentRepository extends Repository<Document> {
    findByVisitId(visitId: string): Promise<Document[]>;
    findByPatientId(patientId: string, type?: DocumentType): Promise<Document[]>;
    findDocumentsByType(type: DocumentType, status?: DocumentStatus, startDate?: Date, endDate?: Date): Promise<Document[]>;
    getDocumentStats(patientId?: string): Promise<{
        total: number;
        byType: Record<string, number>;
        byStatus: Record<string, number>;
        totalSize: number;
    }>;
    findDocumentsNeedingReview(providerId?: string): Promise<Document[]>;
    findDocumentsByKeyword(keyword: string): Promise<Document[]>;
    getDocumentVersions(documentId: string): Promise<Document[]>;
    getDocumentUsageStats(startDate: Date, endDate: Date): Promise<Array<{
        type: string;
        count: number;
        totalSize: number;
    }>>;
}
