import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  Patient, 
  Gender, 
  BloodType, 
  MaritalStatus, 
  RegistrationType,
  InsuranceType,
  VerificationStatus
} from '@prisma/client';
import { TenantInfoDto } from '../../tenants/dto/tenant-info.dto';
import { Exclude, Type } from 'class-transformer';

type PatientWithRelations = Patient & {
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
  emergencyContacts?: Array<{
    id: string;
    name: string;
    relationship: string | null;
    phone: string;
    email: string | null;
    address: string | null;
    isPrimary: boolean;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  documents?: Array<{
    id: string;
    documentType: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    uploadedBy: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  createdByUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  updatedByUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
};

export class PatientResponseDto {
  constructor(patient: PatientWithRelations) {
    this.id = patient.id;
    this.medicalRecordNumber = patient.medicalRecordNumber;
    this.registrationNumber = patient.registrationNumber || null;
    this.externalId = patient.externalId || null;
    this.title = patient.title || null;
    this.firstName = patient.firstName;
    this.middleName = patient.middleName || null;
    this.lastName = patient.lastName;
    this.fullName = [patient.title, patient.firstName, patient.middleName, patient.lastName]
      .filter(Boolean)
      .join(' ');
    this.photoUrl = patient.photoUrl || null;
    this.dob = patient.dob || null;
    this.gender = patient.gender || null;
    this.bloodType = patient.bloodType || null;
    this.maritalStatus = patient.maritalStatus || null;
    this.occupation = patient.occupation || null;
    this.phone = patient.phone || null;
    this.alternatePhone = patient.alternatePhone || null;
    this.email = patient.email || null;
    this.addressLine1 = patient.addressLine1 || null;
    this.addressLine2 = patient.addressLine2 || null;
    this.city = patient.city || null;
    this.state = patient.state || null;
    this.postalCode = patient.postalCode || null;
    this.country = patient.country || null;
    this.aadhaarNumber = patient.aadhaarNumber || null;
    this.panNumber = patient.panNumber || null;
    this.passportNumber = patient.passportNumber || null;
    this.drivingLicense = patient.drivingLicense || null;
    this.bloodGroup = patient.bloodGroup || null;
    this.rhFactor = patient.rhFactor || null;
    this.allergies = patient.allergies || null;
    this.chronicConditions = patient.chronicConditions || [];
    this.currentMedications = patient.currentMedications || [];
    this.knownAllergies = patient.knownAllergies || [];
    this.insuranceProvider = patient.insuranceProvider || null;
    this.insuranceId = patient.insuranceId || null;
    this.insuranceGroup = patient.insuranceGroup || null;
    this.insuranceValidUntil = patient.insuranceValidUntil || null;
    this.religion = patient.religion || null;
    this.nationality = patient.nationality || null;
    this.language = patient.language || 'en';
    this.isVIP = patient.isVIP || false;
    this.isDeceased = patient.isDeceased || false;
    this.dateOfDeath = patient.dateOfDeath || null;
    this.causeOfDeath = patient.causeOfDeath || null;
    this.notes = patient.notes || null;
    this.isActive = patient.isActive;
    this.deletedAt = patient.deletedAt || null;
    this.createdAt = patient.createdAt;
    this.updatedAt = patient.updatedAt;
    this.tenantId = patient.tenantId;
    this.tenant = patient.tenant ? new TenantInfoDto(patient.tenant) : undefined;
    this.emergencyContacts = patient.emergencyContacts?.map(ec => ({
      id: ec.id,
      name: ec.name,
      relationship: ec.relationship,
      phone: ec.phone,
      email: ec.email || null,
      address: ec.address || null,
      isPrimary: ec.isPrimary,
      notes: ec.notes || null,
      createdAt: ec.createdAt,
      updatedAt: ec.updatedAt
    })) || [];
    // Calculate age from DOB if available
    if (this.dob) {
      const birthDate = new Date(this.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.age = age;
    }
  }

  @ApiProperty({ description: 'Unique identifier of the patient' })
  id: string;

  @ApiProperty({ description: 'Medical record number (MRN)' })
  medicalRecordNumber: string;

  @ApiPropertyOptional({ description: 'Registration number' })
  registrationNumber: string | null;

  @ApiPropertyOptional({ 
    description: 'Registration type',
    enum: RegistrationType,
    enumName: 'RegistrationType'
  })
  registrationType: RegistrationType;

  @ApiPropertyOptional({ 
    description: 'Referral source information',
    example: 'Referred by Dr. Smith from City Hospital'
  })
  referralSource?: string | null;

  @ApiPropertyOptional({ 
    description: 'Referring doctor/hospital name',
    example: 'Dr. John Smith'
  })
  referringDoctor?: string | null;

  @ApiPropertyOptional({ 
    description: 'Referring doctor/hospital contact',
    example: 'contact@hospital.com'
  })
  referringContact?: string | null;

  @ApiPropertyOptional({ description: 'External reference ID' })
  externalId: string | null;

  @ApiPropertyOptional({ description: 'Title (Mr, Mrs, Dr, etc.)' })
  title: string | null;

  @ApiProperty({ description: 'First name' })
  firstName: string;

  @ApiPropertyOptional({ description: 'Middle name' })
  middleName: string | null;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @ApiProperty({ description: 'Full name (computed)' })
  fullName: string;

  @ApiPropertyOptional({ description: 'URL to patient photo' })
  photoUrl: string | null;

  @ApiPropertyOptional({ description: 'Date of birth' })
  dob: Date | null;

  @ApiPropertyOptional({ description: 'Age (computed from DOB)' })
  age: number | null;

  @ApiPropertyOptional({ enum: Gender, description: 'Gender' })
  gender: Gender | null;

  @ApiPropertyOptional({ enum: BloodType, description: 'Blood type' })
  bloodType: BloodType | null;

  @ApiPropertyOptional({ description: 'Blood group (A, B, AB, O, etc.)' })
  bloodGroup: string | null;

  @ApiPropertyOptional({ description: 'RH factor (+ or -)' })
  rhFactor: string | null;

  @ApiPropertyOptional({ enum: MaritalStatus, description: 'Marital status' })
  maritalStatus: MaritalStatus | null;

  @ApiPropertyOptional({ description: 'Occupation' })
  occupation: string | null;

  @ApiPropertyOptional({ description: 'Primary phone number' })
  phone: string | null;

  @ApiPropertyOptional({ description: 'Alternate phone number' })
  alternatePhone: string | null;

  @ApiPropertyOptional({ 
    description: 'Email address',
    example: 'patient@example.com'
  })
  email: string | null;

  @ApiPropertyOptional({ 
    description: 'Whether email is verified',
    default: false
  })
  isEmailVerified: boolean;

  @ApiPropertyOptional({ 
    description: 'Whether phone is verified',
    default: false
  })
  isPhoneVerified: boolean;

  @ApiPropertyOptional({ description: 'Address line 1' })
  addressLine1: string | null;

  @ApiPropertyOptional({ description: 'Address line 2' })
  addressLine2: string | null;

  @ApiPropertyOptional({ description: 'City' })
  city: string | null;

  @ApiPropertyOptional({ description: 'State/Province' })
  state: string | null;

  @ApiPropertyOptional({ description: 'Postal/ZIP code' })
  postalCode: string | null;

  @ApiPropertyOptional({ description: 'Country' })
  country: string | null;

  @ApiPropertyOptional({ description: 'Aadhaar number (India)' })
  aadhaarNumber: string | null;

  @ApiPropertyOptional({ description: 'PAN number (India)' })
  panNumber: string | null;

  @ApiPropertyOptional({ description: 'Passport number' })
  passportNumber: string | null;

  @ApiPropertyOptional({ description: 'Driving license number' })
  drivingLicense: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Allergies information' })
  allergies: any | null;

  @ApiPropertyOptional({ type: [String], description: 'Chronic conditions' })
  chronicConditions: string[];

  @ApiPropertyOptional({ type: [String], description: 'Current medications' })
  currentMedications: string[];

  @ApiPropertyOptional({ type: [String], description: 'Known allergies' })
  knownAllergies: string[];

  @ApiPropertyOptional({ 
    description: 'Insurance provider',
    example: 'United Healthcare'
  })
  insuranceProvider: string | null;

  @ApiPropertyOptional({ 
    description: 'Insurance ID',
    example: 'UH123456789'
  })
  insuranceId: string | null;

  @ApiPropertyOptional({ 
    description: 'Insurance group',
    example: 'GRP-12345'
  })
  insuranceGroup: string | null;

  @ApiPropertyOptional({ 
    description: 'Insurance policy number',
    example: 'POL-987654'
  })
  insurancePolicyNumber: string | null;

  @ApiPropertyOptional({ 
    description: 'Insurance type',
    enum: InsuranceType,
    enumName: 'InsuranceType'
  })
  insuranceType: InsuranceType | null;

  @ApiPropertyOptional({ 
    description: 'TPA (Third Party Administrator) ID',
    example: 'TPA-12345'
  })
  tpaId: string | null;

  @ApiPropertyOptional({ 
    description: 'Insurance valid until date',
    example: '2025-12-31T23:59:59.999Z'
  })
  insuranceValidUntil: Date | null;

  @ApiPropertyOptional({ description: 'Religion' })
  religion: string | null;

  @ApiPropertyOptional({ description: 'Nationality' })
  nationality: string | null;

  @ApiPropertyOptional({ description: 'Preferred language (ISO 639-1 code)' })
  language: string;

  @ApiPropertyOptional({ 
    description: 'Verification status',
    enum: VerificationStatus,
    enumName: 'VerificationStatus'
  })
  verificationStatus: VerificationStatus;

  @ApiPropertyOptional({ 
    description: 'Verification notes',
    example: 'ID verified with passport on 2023-01-15'
  })
  verificationNotes: string | null;

  @ApiPropertyOptional({ 
    description: 'Date when patient was last verified',
    example: '2023-01-15T10:30:00.000Z'
  })
  verifiedAt: Date | null;

  @ApiPropertyOptional({ 
    description: 'ID of the user who verified the patient',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  verifiedBy: string | null;

  @ApiPropertyOptional({ 
    description: 'Is patient active',
    default: true
  })
  isActive: boolean;

  @ApiPropertyOptional({ 
    description: 'Is patient verified',
    default: false
  })
  isVerified: boolean;

  @ApiPropertyOptional({ description: 'Deceased status' })
  isDeceased: boolean;

  @ApiPropertyOptional({ description: 'Date of death' })
  dateOfDeath: Date | null;

  @ApiPropertyOptional({ description: 'Cause of death' })
  causeOfDeath: string | null;

  @ApiPropertyOptional({ description: 'Additional notes' })
  notes: string | null;

  @ApiPropertyOptional({ description: 'Deletion timestamp (soft delete)' })
  deletedAt: Date | null;

  @ApiPropertyOptional({ 
    description: 'Date when patient was created',
    example: '2023-01-01T12:00:00.000Z'
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiPropertyOptional({ 
    description: 'Date when patient was last updated',
    example: '2023-01-15T14:30:00.000Z'
  })
  @Type(() => Date)
  updatedAt: Date;

  @ApiPropertyOptional({ 
    description: 'User who created the patient record',
    type: 'object',
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Doe'
    }
  })
  createdByUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;

  @ApiPropertyOptional({ 
    description: 'User who last updated the patient record',
    type: 'object',
    example: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'nurse@example.com',
      firstName: 'Jane',
      lastName: 'Smith'
    }
  })
  updatedByUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;

  @ApiProperty({ description: 'Tenant ID' })
  @ApiPropertyOptional({ 
    description: 'Tenant ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  tenantId: string;

  @ApiPropertyOptional({ 
    description: 'Tenant information',
    type: TenantInfoDto 
  })
  tenant?: TenantInfoDto;

  @ApiPropertyOptional({
    description: 'Patient documents',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        documentType: { type: 'string' },
        fileName: { type: 'string' },
        fileType: { type: 'string' },
        fileSize: { type: 'number' },
        fileUrl: { type: 'string' },
        uploadedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  documents?: Array<{
    id: string;
    documentType: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    uploadedAt: Date;
  }>;

  @ApiPropertyOptional({ 
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        relationship: { type: 'string', nullable: true },
        phone: { type: 'string' },
        email: { type: 'string', nullable: true },
        address: { type: 'string', nullable: true },
        isPrimary: { type: 'boolean' },
        notes: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    description: 'Emergency contacts'
  })
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string | null;
    phone: string;
    email: string | null;
    address: string | null;
    isPrimary: boolean;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;

  @ApiPropertyOptional({ type: [String], description: 'Special needs' })
  specialNeeds: string[];

  @ApiPropertyOptional({ description: 'Verification status', default: false })
  isVerified: boolean = false;

  @ApiPropertyOptional({ description: 'Verification method used', nullable: true })
  verificationMethod: string | null = null;

  @ApiPropertyOptional({ description: 'Last verification date', nullable: true })
  lastVerifiedAt: Date | null = null;

  @ApiPropertyOptional({ type: Object, description: 'Patient preferences', nullable: true })
  preferences: Record<string, any> | null = null;

  @ApiPropertyOptional({ type: Object, description: 'Communication preferences', nullable: true })
  communicationPreferences: Record<string, boolean> | null = null;

  @ApiPropertyOptional({ type: Object, description: 'Privacy preferences', nullable: true })
  privacyPreferences: Record<string, boolean> | null = null;

  @ApiPropertyOptional({ description: 'ID of the user who created this record', nullable: true })
  createdById: string | null = null;

  @ApiPropertyOptional({ description: 'ID of the user who last updated this record', nullable: true })
  updatedById: string | null = null;
}
