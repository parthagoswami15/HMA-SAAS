export declare const ALLOWED_DOCUMENT_TYPES: readonly ["ID_PROOF", "ADDRESS_PROOF", "MEDICAL_REPORT", "PRESCRIPTION", "INSURANCE", "LETTER", "REFERRAL", "CONSENT_FORM", "OTHER"];
export type DocumentType = typeof ALLOWED_DOCUMENT_TYPES[number];
export declare class PatientDocumentDto {
    id: string;
    patientId: string;
    documentType: DocumentType;
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    fileUrl: string;
    notes?: string;
    issueDate?: Date;
    expiryDate?: Date;
    uploadedBy: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreatePatientDocumentDto {
    documentType: DocumentType;
    notes?: string;
    issueDate?: Date;
    expiryDate?: Date;
}
export declare class UpdatePatientDocumentDto {
    documentType?: DocumentType;
    notes?: string;
    issueDate?: Date;
    expiryDate?: Date;
}
export declare class PatientDocumentQueryDto {
    documentType?: DocumentType;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}
