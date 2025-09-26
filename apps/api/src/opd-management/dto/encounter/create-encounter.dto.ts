import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsNumber,
  IsBoolean,
  IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';

class SOAPNoteDto {
  @ApiProperty({ description: 'Subjective information from the patient' })
  @IsString()
  @IsOptional()
  subjective?: string;

  @ApiProperty({ description: 'Objective findings from examination' })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiProperty({ description: 'Assessment and diagnosis' })
  @IsString()
  @IsOptional()
  assessment?: string;

  @ApiProperty({ description: 'Plan for treatment and follow-up' })
  @IsString()
  @IsOptional()
  plan?: string;
}

class DiagnosisDto {
  @ApiProperty({ description: 'ICD-10 code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Description of the diagnosis' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether this is the primary diagnosis', default: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiProperty({ description: 'Additional notes about the diagnosis', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

class VitalsDto {
  @ApiProperty({ description: 'Blood pressure (systolic/diastolic)', example: '120/80', required: false })
  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @ApiProperty({ description: 'Heart rate (bpm)', example: 72, required: false })
  @IsNumber()
  @IsOptional()
  heartRate?: number;

  @ApiProperty({ description: 'Temperature in Celsius', example: 36.8, required: false })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiProperty({ description: 'Respiratory rate (breaths per minute)', example: 16, required: false })
  @IsNumber()
  @IsOptional()
  respiratoryRate?: number;

  @ApiProperty({ description: 'Oxygen saturation percentage', example: 98, required: false })
  @IsNumber()
  @IsOptional()
  oxygenSaturation?: number;

  @ApiProperty({ description: 'Weight in kg', example: 70.5, required: false })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({ description: 'Height in cm', example: 170, required: false })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({ description: 'Pain level (0-10)', example: 2, required: false })
  @IsNumber()
  @IsOptional()
  painLevel?: number;
}

export class CreateEncounterDto {
  @ApiProperty({ description: 'Visit ID this encounter belongs to' })
  @IsString()
  @IsNotEmpty()
  visitId: string;

  @ApiProperty({ description: 'Provider (staff) ID who is handling this encounter' })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ description: 'Type of encounter (initial, follow-up, procedure, etc.)' })
  @IsString()
  @IsNotEmpty()
  encounterType: string;

  @ApiProperty({ 
    description: 'Start date and time of the encounter',
    type: Date,
    default: () => new Date().toISOString()
  })
  @IsDateString()
  @IsOptional()
  startTime?: Date;

  @ApiProperty({ type: SOAPNoteDto, description: 'SOAP note for this encounter', required: false })
  @ValidateNested()
  @Type(() => SOAPNoteDto)
  @IsOptional()
  soapNote?: SOAPNoteDto;

  @ApiProperty({ type: [DiagnosisDto], description: 'List of diagnoses for this encounter', required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiagnosisDto)
  @IsOptional()
  diagnoses?: DiagnosisDto[];

  @ApiProperty({ type: VitalsDto, description: 'Vital signs recorded during this encounter', required: false })
  @ValidateNested()
  @Type(() => VitalsDto)
  @IsOptional()
  vitals?: VitalsDto;

  @ApiProperty({ description: 'Additional notes about the encounter', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
