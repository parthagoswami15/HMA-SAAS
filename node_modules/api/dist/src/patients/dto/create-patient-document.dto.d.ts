import { DocumentType } from '../enums/document-type.enum';
export declare class CreatePatientDocumentDto {
    documentType: DocumentType;
    description?: string;
    issueDate?: string;
    expiryDate?: string;
}
