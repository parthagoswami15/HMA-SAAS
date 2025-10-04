import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsUUID,
  IsInt,
  Min,
  Max,
  IsDateString
} from 'class-validator';

export const ALLOWED_DOCUMENT_TYPES = [
  'ID_PROOF',
  'ADDRESS_PROOF',
  'MEDICAL_REPORT',
  'PRESCRIPTION',
  'INSURANCE',
  'LETTER',
  'REFERRAL',
  'CONSENT_FORM',
  'OTHER'
] as const;

export type DocumentType = typeof ALLOWED_DOCUMENT_TYPES[number];

export class PatientDocumentDto {
  @ApiProperty({ description: 'Document ID' })
  id: string;

  @ApiProperty({ description: 'Patient ID' })
  patientId: string;

  @ApiProperty({ 
    description: 'Type of document',
    enum: ALLOWED_DOCUMENT_TYPES,
    example: 'ID_PROOF'
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ALLOWED_DOCUMENT_TYPES)
  documentType: DocumentType;

  @ApiProperty({ description: 'Original file name' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ description: 'File MIME type' })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsInt()
  @Min(0)
  fileSize: number;

  @ApiProperty({ description: 'File storage path' })
  @IsString()
  @IsNotEmpty()
  filePath: string;

  @ApiProperty({ description: 'Public URL to access the file' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiPropertyOptional({ description: 'Additional notes about the document' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Document issue date' })
  @IsDateString()
  @IsOptional()
  issueDate?: Date;

  @ApiPropertyOptional({ description: 'Document expiration date' })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;

  @ApiProperty({ description: 'ID of the user who uploaded the document' })
  @IsUUID()
  uploadedBy: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class CreatePatientDocumentDto {
  @ApiProperty({ 
    description: 'Type of document',
    enum: ALLOWED_DOCUMENT_TYPES,
    example: 'ID_PROOF'
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ALLOWED_DOCUMENT_TYPES)
  documentType: DocumentType;

  @ApiPropertyOptional({ description: 'Additional notes about the document' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Document issue date (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  issueDate?: Date;

  @ApiPropertyOptional({ description: 'Document expiration date (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;
}

export class UpdatePatientDocumentDto {
  @ApiPropertyOptional({ 
    description: 'Type of document',
    enum: ALLOWED_DOCUMENT_TYPES
  })
  @IsString()
  @IsOptional()
  @IsEnum(ALLOWED_DOCUMENT_TYPES)
  documentType?: DocumentType;

  @ApiPropertyOptional({ description: 'Additional notes about the document' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Document issue date (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  issueDate?: Date;

  @ApiPropertyOptional({ description: 'Document expiration date (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;
}

export class PatientDocumentQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filter by document type',
    enum: ALLOWED_DOCUMENT_TYPES
  })
  @IsString()
  @IsOptional()
  @IsEnum(ALLOWED_DOCUMENT_TYPES)
  documentType?: DocumentType;

  @ApiPropertyOptional({ 
    description: 'Filter by upload date range (start date in ISO 8601 format)'
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by upload date range (end date in ISO 8601 format)'
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Search term to filter by file name or notes',
    example: 'passport'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Page number for pagination',
    minimum: 1,
    default: 1
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
}
