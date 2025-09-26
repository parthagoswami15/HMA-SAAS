import { DocumentType } from '../enums/document-type.enum';
export declare class UpdatePatientDocumentDto {
    documentType?: DocumentType;
    description?: string;
    issueDate?: string;
    expiryDate?: string;
}
