import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsBoolean, 
  IsEnum, 
  IsDateString,
  IsUUID
} from 'class-validator';
import { DiagnosisStatus, DiagnosisType } from '../../entities/diagnosis.entity';

export class CreateEncounterDiagnosisDto {
  @ApiProperty({ description: 'Encounter ID' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  encounterId: string;

  @ApiProperty({ description: 'ICD-10 code' })
  @IsString()
  @IsNotEmpty()
  icd10Code: string;

  @ApiPropertyOptional({ 
    description: 'Diagnosis status', 
    enum: DiagnosisStatus,
    default: DiagnosisStatus.ACTIVE 
  })
  @IsOptional()
  @IsEnum(DiagnosisStatus)
  status?: DiagnosisStatus = DiagnosisStatus.ACTIVE;

  @ApiPropertyOptional({ 
    description: 'Diagnosis type', 
    enum: DiagnosisType,
    default: DiagnosisType.PROVISIONAL 
  })
  @IsOptional()
  @IsEnum(DiagnosisType)
  type?: DiagnosisType = DiagnosisType.PROVISIONAL;

  @ApiPropertyOptional({ 
    description: 'Whether this is the primary diagnosis for the encounter',
    default: false 
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Whether this is a chronic condition',
    default: false 
  })
  @IsOptional()
  @IsBoolean()
  isChronic?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Whether this is an external cause of injury',
    default: false 
  })
  @IsOptional()
  @IsBoolean()
  isExternalCause?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Date of diagnosis',
    default: () => new Date().toISOString()
  })
  @IsOptional()
  @IsDateString()
  diagnosisDate?: string = new Date().toISOString();

  @ApiPropertyOptional({ description: 'Onset date of the condition' })
  @IsOptional()
  @IsDateString()
  onsetDate?: string;

  @ApiPropertyOptional({ description: 'Clinical notes about the diagnosis' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ 
    description: 'Severity of the condition',
    example: 'mild',
    enum: ['mild', 'moderate', 'severe']
  })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({ 
    description: 'Body site affected',
    example: 'left arm',
  })
  @IsOptional()
  @IsString()
  bodySite?: string;

  @ApiPropertyOptional({ 
    description: 'Additional metadata as key-value pairs',
    example: { priority: 'high', followUpRequired: true },
    type: 'object',
    additionalProperties: true
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
