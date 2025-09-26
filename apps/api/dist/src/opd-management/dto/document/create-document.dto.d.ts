export declare enum DocumentType {
    PRESCRIPTION = "PRESCRIPTION",
    LAB_REPORT = "LAB_REPORT",
    RADIOLOGY_REPORT = "RADIOLOGY_REPORT",
    DISCHARGE_SUMMARY = "DISCHARGE_SUMMARY",
    REFERRAL_LETTER = "REFERRAL_LETTER",
    MEDICAL_CERTIFICATE = "MEDICAL_CERTIFICATE",
    CONSENT_FORM = "CONSENT_FORM",
    ID_PROOF = "ID_PROOF",
    INSURANCE = "INSURANCE",
    OTHER = "OTHER"
}
export declare class DocumentMetadataDto {
    title?: string;
    description?: string;
    author?: string;
    dateCreated?: Date;
    keywords?: string[];
    custom?: Record<string, any>;
}
export declare class CreateDocumentDto {
    type: DocumentType;
    patientId: string;
    filename: string;
    mimeType: string;
    size: number;
    checksum?: string;
    metadata?: DocumentMetadataDto;
    visitId?: string;
    encounterId?: string;
    notes?: string;
}
