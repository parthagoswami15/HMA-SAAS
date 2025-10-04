import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { ModalityType } from '@prisma/client';

export class CreateModalityDto {
  @ApiProperty({ description: 'Modality name', required: true })
  @IsString()
  name: string;

  @ApiProperty({ enum: ModalityType, description: 'Modality type', required: true })
  @IsEnum(ModalityType)
  modalityType: ModalityType;

  @ApiProperty({ description: 'DICOM Application Entity Title', required: true })
  @IsString()
  aeTitle: string;

  @ApiProperty({ description: 'Modality hostname/IP', required: true })
  @IsString()
  hostname: string;

  @ApiPropertyOptional({ description: 'DICOM port', default: 104 })
  @IsOptional()
  @IsNumber()
  port?: number;

  @ApiPropertyOptional({ description: 'Room/location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Manufacturer' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ description: 'Model' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateModalityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: ModalityType })
  @IsOptional()
  @IsEnum(ModalityType)
  modalityType?: ModalityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aeTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hostname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  port?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ModalityWorklistDto {
  @ApiProperty({ description: 'Study ID', required: true })
  @IsString()
  studyId: string;

  @ApiProperty({ description: 'Patient name for MWL', required: true })
  @IsString()
  patientName: string;

  @ApiProperty({ description: 'Patient ID for MWL', required: true })
  @IsString()
  patientId: string;

  @ApiPropertyOptional({ description: 'Accession number' })
  @IsOptional()
  @IsString()
  accessionNumber?: string;

  @ApiProperty({ description: 'Study Instance UID', required: true })
  @IsString()
  studyInstanceUID: string;

  @ApiPropertyOptional({ description: 'Full MWL entry as JSON' })
  @IsOptional()
  worklistData?: Record<string, any>;
}

export class TestModalityConnectionDto {
  @ApiProperty({ description: 'Modality ID to test', required: true })
  @IsString()
  modalityId: string;

  @ApiPropertyOptional({ description: 'Test message' })
  @IsOptional()
  @IsString()
  testMessage?: string;
}
