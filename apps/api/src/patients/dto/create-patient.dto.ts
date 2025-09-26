import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsDateString, 
  IsEnum, 
  IsPhoneNumber, 
  IsUUID, 
  IsPostalCode, 
  MaxLength, 
  MinLength, 
  IsNotEmpty, 
  IsBoolean,
  IsArray,
  IsObject,
  IsNumber,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, BloodType, MaritalStatus } from '@prisma/client';

class EmergencyContactDto {
  @ApiProperty({ description: 'Full name of emergency contact' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Relationship to patient' })
  @IsString()
  @IsOptional()
  relationship?: string;

  @ApiProperty({ description: 'Phone number of emergency contact' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: 'Email of emergency contact' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Address of emergency contact' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Whether this is the primary emergency contact', default: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreatePatientDto {
  // Personal Information
  @ApiProperty({ 
    description: 'Patient title (Mr, Mrs, Dr, etc.)',
    example: 'Mr',
    required: false
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ 
    description: 'Patient first name', 
    minLength: 1, 
    maxLength: 100,
    example: 'John'
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({ 
    description: 'Patient middle name',
    maxLength: 100,
    example: 'William'
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  middleName?: string;

  @ApiProperty({ 
    description: 'Patient last name', 
    minLength: 1, 
    maxLength: 100,
    example: 'Doe'
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ 
    description: 'URL to patient photo',
    example: 'https://example.com/photos/patient123.jpg'
  })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Date of birth (ISO 8601 format)', 
    example: '1990-01-01'
  })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiPropertyOptional({ 
    enum: Gender, 
    enumName: 'Gender',
    example: Gender.MALE
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({ 
    enum: BloodType, 
    enumName: 'BloodType',
    example: BloodType.A_POSITIVE
  })
  @IsEnum(BloodType)
  @IsOptional()
  bloodType?: BloodType;

  @ApiPropertyOptional({ 
    enum: MaritalStatus, 
    enumName: 'MaritalStatus',
    example: MaritalStatus.SINGLE
  })
  @IsEnum(MaritalStatus)
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({ 
    description: 'Patient occupation',
    example: 'Software Engineer'
  })
  @IsString()
  @IsOptional()
  occupation?: string;

  // Contact Information
  @ApiPropertyOptional({ 
    description: 'Primary phone number',
    example: '+1234567890'
  })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Alternate phone number',
    example: '+1987654321'
  })
  @IsPhoneNumber()
  @IsOptional()
  alternatePhone?: string;

  @ApiPropertyOptional({ 
    description: 'Email address',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  @MaxLength(255)
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Address line 1',
    example: '123 Main St'
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  addressLine1?: string;

  @ApiPropertyOptional({ 
    description: 'Address line 2',
    example: 'Apt 4B'
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  addressLine2?: string;

  @ApiPropertyOptional({ 
    description: 'City',
    example: 'New York'
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ 
    description: 'State/Province',
    example: 'NY'
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ 
    description: 'Postal/ZIP code',
    example: '10001'
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ 
    description: 'Country',
    example: 'United States'
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  country?: string;

  // Identification
  @ApiPropertyOptional({ 
    description: 'Aadhaar number (India)',
    example: '1234-5678-9012'
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  aadhaarNumber?: string;

  @ApiPropertyOptional({ 
    description: 'PAN number (India)',
    example: 'ABCDE1234F'
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  panNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Passport number',
    example: 'A12345678'
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  passportNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Driving license number',
    example: 'DL12345678901234'
  })
  @IsString()
  @MaxLength(30)
  @IsOptional()
  drivingLicense?: string;

  // Emergency Contacts
  @ApiPropertyOptional({
    description: 'List of emergency contacts',
    type: [EmergencyContactDto]
  })
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  @IsArray()
  @IsOptional()
  emergencyContacts?: EmergencyContactDto[];

  // Medical Information
  @ApiPropertyOptional({ 
    description: 'Blood group',
    example: 'A+'
  })
  @IsString()
  @MaxLength(10)
  @IsOptional()
  bloodGroup?: string;

  @ApiPropertyOptional({ 
    description: 'RH factor',
    example: '+'
  })
  @IsString()
  @MaxLength(1)
  @IsOptional()
  rhFactor?: string;

  @ApiPropertyOptional({ 
    description: 'Structured allergies data',
    example: { drugs: ['Penicillin'], food: ['Peanuts'] }
  })
  @IsObject()
  @IsOptional()
  allergies?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Array of chronic conditions',
    example: ['Hypertension', 'Diabetes']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chronicConditions?: string[];

  @ApiPropertyOptional({ 
    description: 'Array of current medications',
    example: ['Metformin 500mg', 'Lisinopril 10mg']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  currentMedications?: string[];

  @ApiPropertyOptional({ 
    description: 'Array of known allergies',
    example: ['Penicillin', 'Latex']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  knownAllergies?: string[];

  // Insurance
  @ApiPropertyOptional({ 
    description: 'Insurance provider name',
    example: 'United Healthcare'
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  insuranceProvider?: string;

  @ApiPropertyOptional({ 
    description: 'Insurance ID/policy number',
    example: 'UHG123456789'
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  insuranceId?: string;

  @ApiPropertyOptional({ 
    description: 'Insurance group number',
    example: 'GRP123456'
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  insuranceGroup?: string;

  @ApiPropertyOptional({ 
    description: 'Insurance validity end date',
    example: '2024-12-31'
  })
  @IsDateString()
  @IsOptional()
  insuranceValidUntil?: string;

  // Additional Details
  @ApiPropertyOptional({ 
    description: 'Religion',
    example: 'Hindu'
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  religion?: string;

  @ApiPropertyOptional({ 
    description: 'Nationality',
    example: 'Indian'
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  nationality?: string;

  @ApiPropertyOptional({ 
    description: 'Preferred language (ISO 639-1)',
    example: 'en',
    default: 'en'
  })
  @IsString()
  @MaxLength(10)
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ 
    description: 'VIP status',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isVIP?: boolean;

  @ApiPropertyOptional({ 
    description: 'Deceased status',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isDeceased?: boolean;

  @ApiPropertyOptional({ 
    description: 'Date of death',
    example: '2023-01-15'
  })
  @IsDateString()
  @IsOptional()
  dateOfDeath?: string;

  @ApiPropertyOptional({ 
    description: 'Cause of death',
    example: 'Cardiac Arrest'
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  causeOfDeath?: string;

  // System fields
  @ApiPropertyOptional({ 
    description: 'External reference ID',
    example: 'EXT123456'
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  externalId?: string;

  @ApiPropertyOptional({ 
    description: 'Notes about the patient',
    example: 'Patient prefers morning appointments'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ 
    description: 'Whether the patient has provided consent for data processing',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  hasGivenConsent?: boolean;

  @ApiPropertyOptional({ 
    description: 'Date when consent was given',
    example: '2023-01-01T00:00:00Z'
  })
  @IsDateString()
  @IsOptional()
  consentDate?: string;

  @ApiPropertyOptional({ 
    description: 'Marketing preferences',
    example: { email: true, sms: false, phone: true }
  })
  @IsObject()
  @IsOptional()
  marketingPreferences?: Record<string, boolean>;

  @ApiPropertyOptional({ 
    description: 'Tags for categorizing patients',
    example: ['diabetic', 'elderly', 'high_risk']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ 
    description: 'Custom fields for additional patient data',
    example: { preferredDoctor: 'Dr. Smith', lastVisitDate: '2023-06-15' }
  })
  @IsObject()
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Source of patient registration',
    example: 'web',
    enum: ['web', 'mobile', 'walk_in', 'referral', 'other']
  })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ 
    description: 'Referral source details',
    example: { referrerName: 'Dr. Johnson', referrerContact: 'dr.johnson@example.com' }
  })
  @IsObject()
  @IsOptional()
  referralInfo?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Patient preferences',
    example: { preferredCommunication: 'email', language: 'en', timezone: 'America/New_York' }
  })
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Patient status',
    example: 'active',
    enum: ['active', 'inactive', 'archived', 'deceased']
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ 
    description: 'Tenant ID for multi-tenancy',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({ 
    description: 'ID of the user who created this patient record',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsOptional()
  createdById?: string;

  @ApiPropertyOptional({ 
    description: 'ID of the user who last updated this patient record',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsOptional()
  updatedById?: string;

  @ApiPropertyOptional({ 
    description: 'Whether the patient has been verified',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiPropertyOptional({ 
    description: 'Verification method used',
    example: 'email',
    enum: ['email', 'phone', 'document', 'manual']
  })
  @IsString()
  @IsOptional()
  verificationMethod?: string;

  @ApiPropertyOptional({ 
    description: 'Date when the patient was last verified',
    example: '2023-06-01T00:00:00Z'
  })
  @IsDateString()
  @IsOptional()
  lastVerifiedAt?: string;

  @ApiPropertyOptional({ 
    description: 'Patient score/risk level',
    example: 75,
    minimum: 0,
    maximum: 100
  })
  @IsNumber()
  @IsOptional()
  score?: number;

  @ApiPropertyOptional({ 
    description: 'Patient category',
    example: 'premium',
    enum: ['standard', 'premium', 'vip']
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Internal notes about the patient',
    example: 'Handled by Dr. Smith, requires special attention'
  })
  @IsString()
  @IsOptional()
  internalNotes?: string;

  @ApiPropertyOptional({
    description: 'Metadata for the patient record',
    example: { lastSync: '2023-06-15T10:00:00Z', externalSystemId: 'EXT123456' }
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Is the patient active?',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Date when the patient was registered',
    example: '2023-01-01T00:00:00Z'
  })
  @IsDateString()
  @IsOptional()
  registeredAt?: string;

  @ApiPropertyOptional({
    description: 'Date of last visit',
    example: '2023-06-15T00:00:00Z'
  })
  @IsDateString()
  @IsOptional()
  lastVisitAt?: string;

  @ApiPropertyOptional({
    description: 'Total number of visits',
    example: 5,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  totalVisits?: number;

  @ApiPropertyOptional({
    description: 'Total amount spent by patient',
    example: 1250.75,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  totalSpent?: number;

  @ApiPropertyOptional({
    description: 'Patient loyalty points',
    example: 250,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  loyaltyPoints?: number;

  @ApiPropertyOptional({
    description: 'Patient credit balance',
    example: 150.50,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  creditBalance?: number;

  @ApiPropertyOptional({
    description: 'Patient discount percentage',
    example: 10,
    minimum: 0,
    maximum: 100
  })
  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  @ApiPropertyOptional({
    description: 'Patient group/category',
    example: 'premium',
    enum: ['standard', 'premium', 'vip', 'corporate']
  })
  @IsString()
  @IsOptional()
  group?: string;

  @ApiPropertyOptional({
    description: 'Patient segment for marketing',
    example: 'chronic_condition',
    enum: ['new', 'regular', 'chronic_condition', 'pediatric', 'senior', 'other']
  })
  @IsString()
  @IsOptional()
  segment?: string;

  @ApiPropertyOptional({
    description: 'Patient source details',
    example: { campaign: 'summer_checkup', referrer: 'google_ads' }
  })
  @IsObject()
  @IsOptional()
  sourceDetails?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Patient communication preferences',
    example: { email: true, sms: true, push: false, call: true }
  })
  @IsObject()
  @IsOptional()
  communicationPreferences?: Record<string, boolean>;

  @ApiPropertyOptional({
    description: 'Patient privacy preferences',
    example: { shareData: true, researchParticipation: false, thirdPartySharing: true }
  })
  @IsObject()
  @IsOptional()
  privacyPreferences?: Record<string, boolean>;

  @ApiPropertyOptional({
    description: 'Patient medical alerts',
    example: ['Allergic to penicillin', 'Uses hearing aid']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medicalAlerts?: string[];

  @ApiPropertyOptional({
    description: 'Patient special needs',
    example: ['Wheelchair access required', 'Sign language interpreter needed']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialNeeds?: string[];

  @ApiPropertyOptional({
    description: 'Patient preferred pharmacy',
    example: 'CVS Pharmacy, 123 Main St, New York, NY 10001'
  })
  @IsString()
  @IsOptional()
  preferredPharmacy?: string;

  @ApiPropertyOptional({
    description: 'Patient preferred laboratory',
    example: 'Quest Diagnostics, 456 Oak Ave, New York, NY 10002'
  })
  @IsString()
  @IsOptional()
  preferredLab?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact name'
  })
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact phone'
  })
  @IsPhoneNumber()
  @IsOptional()
  emergencyContactPhone?: string;
}
}
