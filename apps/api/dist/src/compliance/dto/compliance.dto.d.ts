export declare class CreateAadhaarDto {
    patientId: string;
    aadhaarNumber: string;
    maskedAadhaar?: string;
    hashedAadhaar?: string;
    consentGiven: boolean;
    consentDetails?: string;
    consentDate?: string;
}
export declare class UpdateAadhaarDto {
    maskedAadhaar?: string;
    hashedAadhaar?: string;
    consentGiven?: boolean;
    consentDetails?: string;
    consentDate?: string;
}
export declare class AadhaarConsentDto {
    consentGiven: boolean;
    consentDetails?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare class CreateBirthRegistrationDto {
    patientId: string;
    hospitalId: string;
    birthDetails: {
        dateOfBirth: string;
        timeOfBirth: string;
        placeOfBirth: string;
        gender: string;
        weight?: number;
        length?: number;
        motherName: string;
        fatherName?: string;
    };
    parentDetails: {
        motherAadhaar?: string;
        fatherAadhaar?: string;
        motherPhone?: string;
        fatherPhone?: string;
        address: string;
    };
    witnesses?: Array<{
        name: string;
        relation: string;
        aadhaar?: string;
    }>;
    registrationNumber?: string;
}
export declare class UpdateBirthRegistrationDto {
    birthDetails?: Partial<CreateBirthRegistrationDto['birthDetails']>;
    parentDetails?: Partial<CreateBirthRegistrationDto['parentDetails']>;
    witnesses?: Array<{
        name: string;
        relation: string;
        aadhaar?: string;
    }>;
    registrationNumber?: string;
}
export declare class BirthRegistrationApprovalDto {
    status: 'APPROVED' | 'REJECTED' | 'PENDING';
    approvalComments?: string;
    approvedBy?: string;
    approvalDate?: string;
}
export declare class CreateDeathRegistrationDto {
    patientId: string;
    hospitalId: string;
    deathDetails: {
        dateOfDeath: string;
        timeOfDeath: string;
        placeOfDeath: string;
        causeOfDeath: string;
        immediateCause?: string;
        antecedentCause?: string;
        otherConditions?: string;
    };
    deceasedDetails: {
        name: string;
        age: number;
        gender: string;
        aadhaar?: string;
        address: string;
    };
    informantDetails: {
        name: string;
        relation: string;
        phone: string;
        aadhaar?: string;
        address: string;
    };
    witnesses?: Array<{
        name: string;
        relation: string;
        aadhaar?: string;
    }>;
    registrationNumber?: string;
}
export declare class UpdateDeathRegistrationDto {
    deathDetails?: Partial<CreateDeathRegistrationDto['deathDetails']>;
    deceasedDetails?: Partial<CreateDeathRegistrationDto['deceasedDetails']>;
    informantDetails?: Partial<CreateDeathRegistrationDto['informantDetails']>;
    witnesses?: Array<{
        name: string;
        relation: string;
        aadhaar?: string;
    }>;
    registrationNumber?: string;
}
export declare class DeathRegistrationApprovalDto {
    status: 'APPROVED' | 'REJECTED' | 'PENDING';
    approvalComments?: string;
    approvedBy?: string;
    approvalDate?: string;
}
export declare class CreatePrescriptionDto {
    patientId: string;
    doctorId: string;
    medications: Array<{
        drugName: string;
        genericName?: string;
        strength: string;
        dosage: string;
        frequency: string;
        duration: string;
        quantity: number;
        instructions?: string;
        isScheduledDrug: boolean;
        scheduleCategory?: string;
    }>;
    diagnosis?: string;
    isEmergency?: boolean;
    validTill?: string;
}
export declare class UpdatePrescriptionDto {
    medications?: Partial<CreatePrescriptionDto['medications']>;
    diagnosis?: string;
    isEmergency?: boolean;
    validTill?: string;
}
export declare class NarcoticsRegisterDto {
    prescriptionId: string;
    drugName: string;
    batchNumber: string;
    dispensedBy: string;
    witnessName: string;
    witnessSignature: string;
    patientSignature: string;
    remarks?: string;
}
export declare class AuditLogDto {
    action: string;
    entityType: string;
    entityId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
}
export declare class AuditQueryDto {
    entityType?: string;
    entityId?: string;
    action?: string;
    userId?: string;
    fromDate?: string;
    toDate?: string;
    page?: string;
    limit?: string;
}
export declare class ComplianceReportDto {
    period?: string;
    type?: string;
    components?: string[];
    fromDate?: string;
    toDate?: string;
}
