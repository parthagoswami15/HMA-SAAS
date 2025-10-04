import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEmail, 
  IsPhoneNumber, 
  IsDateString, 
  IsEnum, 
  IsBoolean, 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsNotEmpty, 
  IsNumber, 
  Min, 
  Max, 
  IsPostalCode, 
  IsIn, 
  IsISO8601 
} from 'class-validator';
import { Type } from 'class-transformer';
import { 
  Gender, 
  BloodType, 
  MaritalStatus, 
  RegistrationType, 
  InsuranceType 
} from '../../common/enums/patient.enums';

export interface IEmergencyContact {
  id?: string;
  name: string;
  relationship?: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
  patientId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EmergencyContactDto implements IEmergencyContact {
  @ApiProperty({ description: 'ID of the emergency contact' })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ description: 'Full name of emergency contact' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Relationship to patient' })
  @IsString()
  @IsOptional()
  relationship?: string;

  @ApiProperty({ description: 'Contact phone number' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: 'Contact email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Contact address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Whether this is the primary emergency contact', default: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Patient ID this contact belongs to' })
  @IsString()
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}

export interface IPatient {
  id?: string;
  tenantId: string;
  registrationNumber: string;
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodType?: BloodType;
  maritalStatus?: MaritalStatus;
  registrationType: RegistrationType;
  insuranceType?: InsuranceType;
  insuranceNumber?: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  emergencyContacts?: IEmergencyContact[];
  medicalHistory?: string;
  allergies?: string[];
  currentMedications?: string[];
  isActive: boolean;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  lastVisitAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export class PatientRegistrationDto implements Omit<IPatient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'lastVisitAt' | 'isVerified' | 'verifiedAt' | 'verifiedBy'> {
  // ========== Personal Information ==========
  @ApiPropertyOptional({ description: 'Title (Mr, Mrs, Dr, etc.)' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'Registration number' })
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty({ description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({ description: 'Middle name' })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ description: 'Date of birth (YYYY-MM-DD)' })
  @IsISO8601()
  @IsOptional()
  dob?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'Gender' })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({ enum: BloodType, description: 'Blood type' })
  @IsEnum(BloodType)
  @IsOptional()
  bloodType?: BloodType;

  @ApiPropertyOptional({ enum: MaritalStatus, description: 'Marital status' })
  @IsEnum(MaritalStatus)
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({ description: 'Occupation' })
  @IsString()
  @IsOptional()
  occupation?: string;

  // ========== Contact Information ==========
  @ApiProperty({ description: 'Primary phone number' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: 'Alternate phone number' })
  @IsPhoneNumber()
  @IsOptional()
  alternatePhone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Address line 1' })
  @IsString()
  @IsOptional()
  addressLine1?: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ description: 'Postal/ZIP code' })
  @IsPostalCode('any')
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsString()
  @IsOptional()
  country?: string;

  // ========== Identification ==========
  @ApiPropertyOptional({ description: 'Aadhaar number' })
  @IsString()
  @IsOptional()
  aadhaarNumber?: string;

  @ApiPropertyOptional({ description: 'PAN number' })
  @IsString()
  @IsOptional()
  panNumber?: string;

  @ApiPropertyOptional({ description: 'Passport number' })
  @IsString()
  @IsOptional()
  passportNumber?: string;

  @ApiPropertyOptional({ description: 'Driving license number' })
  @IsString()
  @IsOptional()
  drivingLicense?: string;

  // ========== Medical Information ==========
  @ApiPropertyOptional({ description: 'Blood group (e.g., A+, O-)' })
  @IsString()
  @IsOptional()
  bloodGroup?: string;

  @ApiPropertyOptional({ description: 'RH factor (+ or -)' })
  @IsIn(['+', '-'])
  @IsOptional()
  rhFactor?: string;

  @ApiPropertyOptional({ 
    description: 'Structured allergies data',
    type: 'object',
    additionalProperties: true
  })
  @IsObject()
  @IsOptional()
  allergies?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Array of chronic conditions',
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chronicConditions?: string[];

  @ApiPropertyOptional({ 
    description: 'Array of current medications',
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  currentMedications?: string[];

  @ApiPropertyOptional({ 
    description: 'Array of known allergies',
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  knownAllergies?: string[];

  // ========== Insurance & Billing ==========
  @ApiPropertyOptional({ description: 'Insurance provider name' })
  @IsString()
  @IsOptional()
  insuranceProvider?: string;

  @ApiPropertyOptional({ description: 'Insurance policy/ID number' })
  @IsString()
  @IsOptional()
  insuranceId?: string;

  @ApiPropertyOptional({ description: 'Insurance group number' })
  @IsString()
  @IsOptional()
  insuranceGroup?: string;

  @ApiPropertyOptional({ 
    description: 'Insurance validity end date (YYYY-MM-DD)',
    example: '2024-12-31'
  })
  @IsISO8601()
  @IsOptional()
  insuranceValidUntil?: string;

  @ApiPropertyOptional({ 
    enum: InsuranceType, 
    description: 'Type of insurance/payment' 
  })
  @IsEnum(InsuranceType)
  @IsOptional()
  insuranceType?: InsuranceType;

  @ApiPropertyOptional({ description: 'Third Party Administrator ID' })
  @IsString()
  @IsOptional()
  tpaId?: string;

  // ========== Registration Details ==========
  @ApiProperty({ 
    enum: RegistrationType, 
    description: 'Type of registration',
    default: RegistrationType.WALK_IN
  })
  @IsEnum(RegistrationType)
  @IsOptional()
  registrationType?: RegistrationType = RegistrationType.WALK_IN;

  @ApiPropertyOptional({ description: 'Source of referral' })
  @IsString()
  @IsOptional()
  referralSource?: string;

  @ApiPropertyOptional({ description: 'Referring doctor\'s name' })
  @IsString()
  @IsOptional()
  referralDoctor?: string;

  @ApiPropertyOptional({ description: 'Referring hospital/clinic name' })
  @IsString()
  @IsOptional()
  referralHospital?: string;

  // ========== Additional Details ==========
  @ApiPropertyOptional({ description: 'Religion' })
  @IsString()
  @IsOptional()
  religion?: string;

  @ApiPropertyOptional({ description: 'Nationality' })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiPropertyOptional({ 
    description: 'Preferred language (ISO 639-1 code)',
    default: 'en'
  })
  @IsString()
  @IsOptional()
  language?: string = 'en';

  @ApiPropertyOptional({ description: 'VIP status', default: false })
  @IsBoolean()
  @IsOptional()
  isVIP?: boolean = false;

  @ApiPropertyOptional({ description: 'Photo URL or base64 image data' })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiPropertyOptional({ description: 'Photo file name' })
  @IsString()
  @IsOptional()
  photoName?: string;

  // ========== Emergency Contacts ==========
  @ApiPropertyOptional({
    type: [EmergencyContactDto],
    description: 'List of emergency contacts'
  })
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  @IsOptional()
  emergencyContacts?: EmergencyContactDto[];

  // ========== System Fields ==========
  @ApiPropertyOptional({ 
    description: 'Whether to verify email/phone automatically',
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  autoVerify?: boolean = false;
}
