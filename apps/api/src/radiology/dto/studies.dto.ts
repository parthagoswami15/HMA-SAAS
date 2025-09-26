import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDateString, IsEnum, IsObject } from 'class-validator';
import { ModalityType, StudyStatus } from '@prisma/client';

export class CreateStudyDto {
  @ApiProperty({ description: 'Imaging order ID', required: true })
  @IsUUID()
  orderId: string;

  @ApiProperty({ description: 'DICOM Study Instance UID', required: true })
  @IsString()
  studyInstanceUID: string;

  @ApiPropertyOptional({ description: 'DICOM Accession Number' })
  @IsOptional()
  @IsString()
  accessionNumber?: string;

  @ApiProperty({ description: 'Study date', required: true })
  @IsDateString()
  studyDate: string;

  @ApiPropertyOptional({ description: 'Study time (HHMMSS)' })
  @IsOptional()
  @IsString()
  studyTime?: string;

  @ApiPropertyOptional({ description: 'Study description' })
  @IsOptional()
  @IsString()
  studyDescription?: string;

  @ApiPropertyOptional({ description: 'CPT/Procedure code' })
  @IsOptional()
  @IsString()
  procedureCode?: string;

  @ApiProperty({ enum: ModalityType, description: 'Study modality type' })
  @IsEnum(ModalityType)
  modalityType: ModalityType;

  @ApiPropertyOptional({ description: 'Performing physician user ID' })
  @IsOptional()
  @IsUUID()
  performingPhysician?: string;

  @ApiPropertyOptional({ description: 'Reading radiologist user ID' })
  @IsOptional()
  @IsUUID()
  readingPhysician?: string;

  @ApiPropertyOptional({ description: 'DICOM metadata as JSON' })
  @IsOptional()
  @IsObject()
  dicomMetadata?: Record<string, any>;
}

export class UpdateStudyDto {
  @ApiPropertyOptional({ description: 'DICOM Accession Number' })
  @IsOptional()
  @IsString()
  accessionNumber?: string;

  @ApiPropertyOptional({ description: 'Study description' })
  @IsOptional()
  @IsString()
  studyDescription?: string;

  @ApiPropertyOptional({ description: 'CPT/Procedure code' })
  @IsOptional()
  @IsString()
  procedureCode?: string;

  @ApiPropertyOptional({ enum: StudyStatus })
  @IsOptional()
  @IsEnum(StudyStatus)
  status?: StudyStatus;

  @ApiPropertyOptional({ description: 'Performing physician user ID' })
  @IsOptional()
  @IsUUID()
  performingPhysician?: string;

  @ApiPropertyOptional({ description: 'Reading radiologist user ID' })
  @IsOptional()
  @IsUUID()
  readingPhysician?: string;

  @ApiPropertyOptional({ description: 'DICOM metadata as JSON' })
  @IsOptional()
  @IsObject()
  dicomMetadata?: Record<string, any>;
}

export class StudyFilterDto {
  @ApiPropertyOptional({ enum: StudyStatus })
  @IsOptional()
  @IsEnum(StudyStatus)
  status?: StudyStatus;

  @ApiPropertyOptional({ enum: ModalityType })
  @IsOptional()
  @IsEnum(ModalityType)
  modalityType?: ModalityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  performingPhysician?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  readingPhysician?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}

export class StudyListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string = 'studyDate';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  sortOrder?: boolean = false;
}
