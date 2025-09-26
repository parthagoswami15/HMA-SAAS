import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsUUID, 
  IsOptional, 
  IsDateString, 
  IsBoolean, 
  IsEnum, 
  ValidateNested, 
  IsObject 
} from 'class-validator';
import { Type } from 'class-transformer';
import { DiagnosisStatus, DiagnosisType } from '../../entities/diagnosis.entity';

export class CreateDiagnosisDto {
  @ApiProperty({ description: 'ICD-10 code for the diagnosis' })
  @IsString()
  @IsNotEmpty()
  icd10Code: string;

  @ApiPropertyOptional({ enum: DiagnosisType, default: 'secondary' })
  @IsEnum(DiagnosisType)
  @IsOptional()
  type?: DiagnosisType = DiagnosisType.SECONDARY;

  @ApiPropertyOptional({ description: 'Whether this is the primary diagnosis', default: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean = false;

  @ApiPropertyOptional({ description: 'Date when the condition was first observed', format: 'date' })
  @IsDateString()
  @IsOptional()
  onsetDate?: string;

  @ApiPropertyOptional({ enum: DiagnosisStatus, default: 'active' })
  @IsEnum(DiagnosisStatus)
  @IsOptional()
  status?: DiagnosisStatus = DiagnosisStatus.ACTIVE;

  @ApiPropertyOptional({ description: 'Additional notes about the diagnosis' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Custom metadata for the diagnosis' })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  metadata?: Record<string, any>;
}

export class CreatePatientDiagnosisDto extends CreateDiagnosisDto {
  @ApiProperty({ description: 'ID of the patient' })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiPropertyOptional({ description: 'ID of the encounter this diagnosis is associated with' })
  @IsUUID()
  @IsOptional()
  encounterId?: string;
}

export class CreateEncounterDiagnosisDto extends CreateDiagnosisDto {
  @ApiProperty({ description: 'ID of the encounter' })
  @IsUUID()
  @IsNotEmpty()
  encounterId: string;
}
