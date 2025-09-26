import { IsOptional, IsString, IsEnum, IsDateString, IsJSON, IsArray, ValidateNested, Type, IsBoolean, IsInt, IsPositive } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAdmissionDto } from './create-admission.dto';
import { AdmissionStatus } from '../enums';

export class UpdateAdmissionDto extends PartialType(CreateAdmissionDto) {
  @ApiProperty({ 
    enum: AdmissionStatus,
    description: 'Updated status of the admission',
    required: false,
    example: AdmissionStatus.DISCHARGED
  })
  @IsEnum(AdmissionStatus)
  @IsOptional()
  status?: AdmissionStatus;

  @ApiProperty({ 
    description: 'Date and time of discharge',
    required: false,
    example: '2023-06-20T14:30:00Z'
  })
  @IsDateString()
  @IsOptional()
  dischargeDate?: Date;

  @ApiProperty({ 
    description: 'Discharge summary or notes',
    required: false,
    example: 'Patient discharged in stable condition with follow-up scheduled in 2 weeks.'
  })
  @IsString()
  @IsOptional()
  dischargeNotes?: string;

  @ApiProperty({ 
    description: 'ID of the staff who discharged the patient',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsString()
  @IsOptional()
  dischargedById?: string;

  @ApiProperty({ 
    description: 'Updated diagnosis or additional diagnoses',
    required: false,
    example: 'Community-acquired pneumonia, resolved. Secondary diagnosis: Type 2 Diabetes, controlled.'
  })
  @IsString()
  @IsOptional()
  updatedDiagnosis?: string;

  @ApiProperty({ 
    description: 'Updated ICD codes',
    required: false,
    example: ['J18.9', 'E11.9']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  icdCodes?: string[];

  @ApiProperty({ 
    description: 'Whether the patient has been transferred to another facility',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isTransferred?: boolean;

  @ApiProperty({ 
    description: 'Transfer details if patient was transferred',
    required: false,
    example: {
      facilityName: 'City General Hospital',
      facilityType: 'Tertiary Care Center',
      reason: 'Higher level of care required',
      transferredAt: '2023-06-18T15:45:00Z',
      transferredById: '123e4567-e89b-12d3-a456-426614174002',
      notes: 'Patient stable for transfer, all records and medications sent with patient.'
    }
  })
  @IsJSON()
  @IsOptional()
  transferDetails?: Record<string, any>;

  @ApiProperty({ 
    description: 'Updated insurance authorization information',
    required: false,
    example: {
      preAuthorizationNumber: 'AUTH987654',
      approvedDays: 5,
      notes: 'Approved for 5 days, may require extension'
    }
  })
  @IsJSON()
  @IsOptional()
  insuranceAuthorization?: Record<string, any>;

  @ApiProperty({ 
    description: 'Follow-up appointment details',
    required: false,
    example: {
      scheduledDate: '2023-07-05T10:00:00Z',
      doctorId: '123e4567-e89b-12d3-a456-426614174003',
      department: 'Cardiology',
      notes: 'Follow-up for post-pneumonia evaluation',
      isScheduled: true
    }
  })
  @IsJSON()
  @IsOptional()
  followUpDetails?: Record<string, any>;

  @ApiProperty({ 
    description: 'Updated length of stay in days',
    required: false,
    example: 6
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  actualStayDays?: number;

  @ApiProperty({ 
    description: 'Additional notes or instructions for the patient',
    required: false,
    example: 'Patient instructed to complete full course of antibiotics and return if symptoms worsen.'
  })
  @IsString()
  @IsOptional()
  patientInstructions?: string;

  @ApiProperty({ 
    description: 'Updated consent forms',
    required: false,
    type: [Object],
    example: [
      {
        formId: 'consent_surgery',
        formName: 'Surgical Consent Form',
        signed: true,
        signedAt: '2023-06-16T11:30:00Z',
        signedById: '123e4567-e89b-12d3-a456-426614174004',
        notes: 'Consent obtained after detailed explanation of risks and benefits.'
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  updatedConsentForms?: Array<{
    formId: string;
    formName: string;
    signed: boolean;
    signedAt: Date;
    signedById: string;
    notes?: string;
  }>;

  @ApiProperty({ 
    description: 'Custom fields for additional admission information',
    required: false,
    example: {
      caseManager: 'Nurse Johnson',
      socialWorker: 'Sarah Williams',
      specialRequirements: 'Requires interpreter for medical discussions',
      patientPreferences: 'Prefers female healthcare providers when possible'
    }
  })
  @IsJSON()
  @IsOptional()
  customFields?: Record<string, any>;
}
