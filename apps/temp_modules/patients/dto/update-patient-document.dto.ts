import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';

export class UpdatePatientDocumentDto {
  @ApiProperty({ 
    description: 'Type of the document',
    enum: DocumentType,
    example: DocumentType.REPORT,
    required: false
  })
  @IsEnum(DocumentType)
  @IsOptional()
  documentType?: DocumentType;

  @ApiProperty({ 
    description: 'Optional description for the document',
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Date when the document was issued',
    required: false,
    example: '2023-01-01'
  })
  @IsString()
  @IsOptional()
  issueDate?: string;

  @ApiProperty({ 
    description: 'Expiration date of the document if applicable',
    required: false,
    example: '2024-01-01'
  })
  @IsString()
  @IsOptional()
  expiryDate?: string;
}
