import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  IsObject,
  IsDateString
} from 'class-validator';

export enum DocumentType {
  PRESCRIPTION = 'PRESCRIPTION',
  LAB_REPORT = 'LAB_REPORT',
  RADIOLOGY_REPORT = 'RADIOLOGY_REPORT',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
  REFERRAL_LETTER = 'REFERRAL_LETTER',
  MEDICAL_CERTIFICATE = 'MEDICAL_CERTIFICATE',
  CONSENT_FORM = 'CONSENT_FORM',
  ID_PROOF = 'ID_PROOF',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER'
}

export class DocumentMetadataDto {
  @ApiPropertyOptional({ description: 'Document title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Document description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Document author name' })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({ description: 'Document creation date', type: Date })
  @IsDateString()
  @IsOptional()
  dateCreated?: Date;

  @ApiPropertyOptional({ 
    description: 'Document keywords for search',
    type: [String] 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @ApiPropertyOptional({ 
    description: 'Custom metadata fields',
    type: 'object' 
  })
  @IsObject()
  @IsOptional()
  custom?: Record<string, any>;
}

export class CreateDocumentDto {
  @ApiProperty({ 
    enum: DocumentType, 
    description: 'Type of document' 
  })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ description: 'Patient ID this document belongs to' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ 
    description: 'Original filename',
    example: 'lab-report-2023.pdf' 
  })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ 
    description: 'File MIME type',
    example: 'application/pdf' 
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ 
    description: 'File size in bytes',
    example: 1024 
  })
  @IsNumber()
  @Min(0)
  size: number;

  @ApiProperty({ 
    description: 'Checksum/hash of the file content',
    required: false 
  })
  @IsString()
  @IsOptional()
  checksum?: string;

  @ApiProperty({ 
    type: DocumentMetadataDto, 
    description: 'Document metadata' 
  })
  @IsOptional()
  metadata?: DocumentMetadataDto;

  @ApiPropertyOptional({ 
    description: 'Visit ID this document is associated with' 
  })
  @IsString()
  @IsOptional()
  visitId?: string;

  @ApiPropertyOptional({ 
    description: 'Encounter ID this document is associated with' 
  })
  @IsString()
  @IsOptional()
  encounterId?: string;

  @ApiPropertyOptional({ 
    description: 'Additional notes about the document' 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
