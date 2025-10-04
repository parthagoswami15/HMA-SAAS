import { IsString, IsOptional, IsBoolean, IsDateString, IsObject, IsArray, IsEnum } from 'class-validator';

export class CreateAadhaarDto {
  @IsString()
  patientId: string;

  @IsString()
  aadhaarNumber: string;

  @IsOptional()
  @IsString()
  maskedAadhaar?: string;

  @IsOptional()
  @IsString()
  hashedAadhaar?: string;

  @IsBoolean()
  consentGiven: boolean;

  @IsOptional()
  @IsString()
  consentDetails?: string;

  @IsOptional()
  @IsDateString()
  consentDate?: string;
}

export class UpdateAadhaarDto {
  @IsOptional()
  @IsString()
  maskedAadhaar?: string;

  @IsOptional()
  @IsString()
  hashedAadhaar?: string;

  @IsOptional()
  @IsBoolean()
  consentGiven?: boolean;

  @IsOptional()
  @IsString()
  consentDetails?: string;

  @IsOptional()
  @IsDateString()
  consentDate?: string;
}

export class AadhaarConsentDto {
  @IsBoolean()
  consentGiven: boolean;

  @IsOptional()
  @IsString()
  consentDetails?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class CreateBirthRegistrationDto {
  @IsString()
  patientId: string;

  @IsString()
  hospitalId: string;

  @IsObject()
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

  @IsObject()
  parentDetails: {
    motherAadhaar?: string;
    fatherAadhaar?: string;
    motherPhone?: string;
    fatherPhone?: string;
    address: string;
  };

  @IsOptional()
  @IsArray()
  witnesses?: Array<{
    name: string;
    relation: string;
    aadhaar?: string;
  }>;

  @IsOptional()
  @IsString()
  registrationNumber?: string;
}

export class UpdateBirthRegistrationDto {
  @IsOptional()
  @IsObject()
  birthDetails?: Partial<CreateBirthRegistrationDto['birthDetails']>;

  @IsOptional()
  @IsObject()
  parentDetails?: Partial<CreateBirthRegistrationDto['parentDetails']>;

  @IsOptional()
  @IsArray()
  witnesses?: Array<{
    name: string;
    relation: string;
    aadhaar?: string;
  }>;

  @IsOptional()
  @IsString()
  registrationNumber?: string;
}

export class BirthRegistrationApprovalDto {
  @IsEnum(['APPROVED', 'REJECTED', 'PENDING'])
  status: 'APPROVED' | 'REJECTED' | 'PENDING';

  @IsOptional()
  @IsString()
  approvalComments?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsDateString()
  approvalDate?: string;
}

export class CreateDeathRegistrationDto {
  @IsString()
  patientId: string;

  @IsString()
  hospitalId: string;

  @IsObject()
  deathDetails: {
    dateOfDeath: string;
    timeOfDeath: string;
    placeOfDeath: string;
    causeOfDeath: string;
    immediateCause?: string;
    antecedentCause?: string;
    otherConditions?: string;
  };

  @IsObject()
  deceasedDetails: {
    name: string;
    age: number;
    gender: string;
    aadhaar?: string;
    address: string;
  };

  @IsObject()
  informantDetails: {
    name: string;
    relation: string;
    phone: string;
    aadhaar?: string;
    address: string;
  };

  @IsOptional()
  @IsArray()
  witnesses?: Array<{
    name: string;
    relation: string;
    aadhaar?: string;
  }>;

  @IsOptional()
  @IsString()
  registrationNumber?: string;
}

export class UpdateDeathRegistrationDto {
  @IsOptional()
  @IsObject()
  deathDetails?: Partial<CreateDeathRegistrationDto['deathDetails']>;

  @IsOptional()
  @IsObject()
  deceasedDetails?: Partial<CreateDeathRegistrationDto['deceasedDetails']>;

  @IsOptional()
  @IsObject()
  informantDetails?: Partial<CreateDeathRegistrationDto['informantDetails']>;

  @IsOptional()
  @IsArray()
  witnesses?: Array<{
    name: string;
    relation: string;
    aadhaar?: string;
  }>;

  @IsOptional()
  @IsString()
  registrationNumber?: string;
}

export class DeathRegistrationApprovalDto {
  @IsEnum(['APPROVED', 'REJECTED', 'PENDING'])
  status: 'APPROVED' | 'REJECTED' | 'PENDING';

  @IsOptional()
  @IsString()
  approvalComments?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsDateString()
  approvalDate?: string;
}

export class CreatePrescriptionDto {
  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @IsArray()
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

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;

  @IsOptional()
  @IsDateString()
  validTill?: string;
}

export class UpdatePrescriptionDto {
  @IsOptional()
  @IsArray()
  medications?: Partial<CreatePrescriptionDto['medications']>;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;

  @IsOptional()
  @IsDateString()
  validTill?: string;
}

export class NarcoticsRegisterDto {
  @IsString()
  prescriptionId: string;

  @IsString()
  drugName: string;

  @IsString()
  batchNumber: string;

  @IsString()
  dispensedBy: string;

  @IsString()
  witnessName: string;

  @IsString()
  witnessSignature: string;

  @IsString()
  patientSignature: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class AuditLogDto {
  @IsString()
  action: string;

  @IsString()
  entityType: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsObject()
  oldValues?: any;

  @IsOptional()
  @IsObject()
  newValues?: any;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class AuditQueryDto {
  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

export class ComplianceReportDto {
  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'])
  period?: string;

  @IsOptional()
  @IsEnum(['summary', 'detailed', 'regulatory'])
  type?: string;

  @IsOptional()
  @IsArray()
  components?: string[];

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
