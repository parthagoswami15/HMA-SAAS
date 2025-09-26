import { IsUUID, IsEnum, IsDateString, IsString, IsOptional, IsNumber, IsJSON, IsArray, ValidateNested, IsBoolean, IsPositive, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AdmissionType, AdmissionStatus } from '../enums';

export class CreateAdmissionDto {
  @ApiProperty({ description: 'ID of the patient being admitted', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'ID of the admitting doctor', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  admittingDoctorId: string;

  @ApiProperty({ description: 'ID of the bed assigned', example: '123e4567-e89b-12d3-a456-426614174002' })
  @IsUUID()
  bedId: string;

  @ApiProperty({ enum: AdmissionType, description: 'Type of admission' })
  @IsEnum(AdmissionType)
  admissionType: AdmissionType;

  @ApiProperty({ description: 'Admission date and time', example: '2023-06-15T10:30:00Z' })
  @IsDateString()
  admissionDate: Date;

  @ApiProperty({ description: 'Primary diagnosis or reason for admission', example: 'Community-acquired pneumonia' })
  @IsString()
  diagnosis: string;

  @ApiProperty({ description: 'ICD code for the diagnosis', required: false, example: 'J18.9' })
  @IsString()
  @IsOptional()
  icdCode?: string;

  @ApiProperty({ description: 'Additional notes about the admission', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ 
    description: 'Additional details about the admission',
    required: false,
    example: { 
      symptoms: ['Fever', 'Cough', 'Shortness of breath'],
      severity: 'Moderate',
      comorbidities: ['Hypertension', 'Type 2 Diabetes']
    }
  })
  @IsJSON()
  @IsOptional()
  details?: Record<string, any>;

  @ApiProperty({ description: 'Estimated length of stay in days', required: false, example: 5 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  estimatedStayDays?: number;

  @ApiProperty({ description: 'Whether this is an emergency admission', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isEmergency?: boolean = false;

  @ApiProperty({ 
    description: 'Insurance information',
    required: false,
    example: {
      provider: 'ABC Insurance',
      policyNumber: 'POL12345678',
      groupNumber: 'GRP987654',
      isVerified: true
    }
  })
  @IsJSON()
  @IsOptional()
  insuranceInfo?: Record<string, any>;

  @ApiProperty({ 
    description: 'List of next of kin or emergency contacts',
    required: false,
    type: [Object],
    example: [
      {
        name: 'John Doe',
        relationship: 'Spouse',
        phone: '+1234567890',
        isPrimary: true
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  emergencyContacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
    isPrimary?: boolean;
  }>;

  @ApiProperty({ 
    description: 'Consent forms signed by the patient',
    required: false,
    example: [
      {
        formId: 'consent_treatment',
        formName: 'Consent for Treatment',
        signed: true,
        signedAt: '2023-06-15T10:15:00Z',
        signedById: '123e4567-e89b-12d3-a456-426614174003'
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  consentForms?: Array<{
    formId: string;
    formName: string;
    signed: boolean;
    signedAt: Date;
    signedById: string;
    notes?: string;
  }>;

  @ApiProperty({ 
    description: 'Initial assessment details',
    required: false,
    example: {
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        height: 170,
        weight: 70,
        bmi: 24.2
      },
      allergies: ['Penicillin', 'Sulfa drugs'],
      currentMedications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
      ]
    }
  })
  @IsJSON()
  @IsOptional()
  initialAssessment?: Record<string, any>;

  @ApiProperty({ 
    description: 'Custom fields for additional admission information',
    required: false,
    example: {
      referringDoctor: 'Dr. Smith',
      referralNotes: 'Patient referred for further evaluation and management',
      admissionSource: 'Emergency Department'
    }
  })
  @IsJSON()
  @IsOptional()
  customFields?: Record<string, any>;
}
