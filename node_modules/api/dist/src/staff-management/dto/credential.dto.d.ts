import { CredentialStatus, CredentialType } from '../enums';
export declare class CreateCredentialDto {
    type: CredentialType;
    title: string;
    number?: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate?: string;
    documentUrl?: string;
    notes?: string;
}
export declare class UpdateCredentialDto {
    type?: CredentialType;
    title?: string;
    number?: string;
    issuingAuthority?: string;
    issueDate?: string;
    expiryDate?: string;
    documentUrl?: string;
    status?: CredentialStatus;
    notes?: string;
}
export declare class VerifyCredentialDto {
    status: CredentialStatus.VERIFIED | CredentialStatus.REJECTED | CredentialStatus.SUSPENDED;
    notes?: string;
}
export declare class CredentialResponseDto {
    id: string;
    staffId: string;
    type: CredentialType;
    title: string;
    number?: string;
    issuingAuthority: string;
    issueDate: Date;
    expiryDate?: Date;
    status: CredentialStatus;
    documentUrl?: string;
    verifiedBy?: string;
    verifiedAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CredentialQueryDto {
    type?: CredentialType;
    status?: CredentialStatus;
    expirationStatus?: 'expired' | 'expiring_soon' | 'valid';
    expiresInDays?: number;
    page?: number;
    limit?: number;
}
