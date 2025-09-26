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
export declare enum DocumentStatus {
    DRAFT = "DRAFT",
    FINAL = "FINAL",
    VERIFIED = "VERIFIED",
    AMENDED = "AMENDED",
    REJECTED = "REJECTED"
}
export declare class DocumentMetadata {
    title?: string;
    description?: string;
    author?: string;
    dateCreated?: Date;
    keywords?: string[];
    custom?: Record<string, any>;
}
export declare class DocumentVersion {
    version: number;
    fileUrl: string;
    mimeType: string;
    size: number;
    createdAt: Date;
    createdById: string;
    notes?: string;
    checksum?: string;
}
export declare class Document {
    id: string;
    type: DocumentType;
    status: DocumentStatus;
    patientId: string;
    visitId?: string;
    encounterId?: string;
    filename: string;
    metadata: DocumentMetadata;
    currentVersion: DocumentVersion;
    versions?: DocumentVersion[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    createdById: string;
    updatedById?: string;
}
