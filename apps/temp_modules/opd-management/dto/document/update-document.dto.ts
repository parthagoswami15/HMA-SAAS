import { PartialType } from '@nestjs/swagger';
import { 
  CreateDocumentDto, 
  DocumentType, 
  DocumentMetadataDto 
} from './create-document.dto';
import { 
  ApiProperty, 
  ApiPropertyOptional 
} from '@nestjs/swagger';
import { 
  IsOptional, 
  IsEnum, 
  IsString, 
  IsObject,
  IsDateString
} from 'class-validator';

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  FINAL = 'FINAL',
  VERIFIED = 'VERIFIED',
  AMENDED = 'AMENDED',
  REJECTED = 'REJECTED'
}

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @ApiPropertyOptional({ 
    enum: DocumentStatus,
    description: 'Status of the document',
  })
  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @ApiPropertyOptional({ 
    description: 'Date and time when the document was verified',
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  verifiedAt?: Date;

  @ApiPropertyOptional({ 
    description: 'ID of the staff who verified the document',
  })
  @IsString()
  @IsOptional()
  verifiedById?: string;

  @ApiPropertyOptional({ 
    description: 'Reason for rejection if applicable',
  })
  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @ApiPropertyOptional({ 
    description: 'Date and time when the document was rejected',
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  rejectedAt?: Date;

  @ApiPropertyOptional({ 
    description: 'ID of the staff who rejected the document',
  })
  @IsString()
  @IsOptional()
  rejectedById?: string;

  @ApiPropertyOptional({ 
    description: 'Version number of the document',
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  version?: number;

  @ApiPropertyOptional({ 
    description: 'ID of the parent document if this is a new version',
  })
  @IsString()
  @IsOptional()
  parentDocumentId?: string;

  @ApiPropertyOptional({ 
    description: 'Reason for creating a new version',
  })
  @IsString()
  @IsOptional()
  versionReason?: string;
}
