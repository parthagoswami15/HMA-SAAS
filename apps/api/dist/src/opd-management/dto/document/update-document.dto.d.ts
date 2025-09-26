import { CreateDocumentDto } from './create-document.dto';
export declare enum DocumentStatus {
    DRAFT = "DRAFT",
    FINAL = "FINAL",
    VERIFIED = "VERIFIED",
    AMENDED = "AMENDED",
    REJECTED = "REJECTED"
}
declare const UpdateDocumentDto_base: import("@nestjs/common").Type<Partial<CreateDocumentDto>>;
export declare class UpdateDocumentDto extends UpdateDocumentDto_base {
    status?: DocumentStatus;
    verifiedAt?: Date;
    verifiedById?: string;
    rejectionReason?: string;
    rejectedAt?: Date;
    rejectedById?: string;
    version?: number;
    parentDocumentId?: string;
    versionReason?: string;
}
export {};
