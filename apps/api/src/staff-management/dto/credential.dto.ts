import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsDateString, 
  IsOptional, 
  IsUUID,
  IsUrl,
  IsArray,
  ValidateNested,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { CredentialStatus, CredentialType } from '../enums';

export class CreateCredentialDto {
  @ApiProperty({ 
    description: 'Type of credential',
    enum: CredentialType,
    example: CredentialType.MEDICAL_LICENSE
  })
  @IsEnum(CredentialType)
  @IsNotEmpty()
  type: CredentialType;

  @ApiProperty({ 
    description: 'Title of the credential (e.g., "Medical License", "Board Certification")',
    example: 'Medical License'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ 
    description: 'Credential/license number if applicable',
    example: 'MD123456'
  })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({ 
    description: 'Name of the issuing authority',
    example: 'Medical Board of California'
  })
  @IsString()
  @IsNotEmpty()
  issuingAuthority: string;

  @ApiProperty({ 
    description: 'Date when the credential was issued',
    example: '2020-01-15'
  })
  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @ApiPropertyOptional({ 
    description: 'Expiration date of the credential if applicable',
    example: '2025-01-15'
  })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiPropertyOptional({ 
    description: 'URL to the uploaded document',
    example: 'https://example.com/documents/license.pdf'
  })
  @IsUrl()
  @IsOptional()
  documentUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Additional notes about the credential'
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateCredentialDto {
  @ApiPropertyOptional({ 
    description: 'Type of credential',
    enum: CredentialType
  })
  @IsEnum(CredentialType)
  @IsOptional()
  type?: CredentialType;

  @ApiPropertyOptional({ 
    description: 'Title of the credential',
    example: 'Medical License'
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ 
    description: 'Credential/license number',
    example: 'MD123456'
  })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiPropertyOptional({ 
    description: 'Name of the issuing authority',
    example: 'Medical Board of California'
  })
  @IsString()
  @IsOptional()
  issuingAuthority?: string;

  @ApiPropertyOptional({ 
    description: 'Date when the credential was issued',
    example: '2020-01-15'
  })
  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @ApiPropertyOptional({ 
    description: 'Expiration date of the credential',
    example: '2025-01-15'
  })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiPropertyOptional({ 
    description: 'URL to the uploaded document',
    example: 'https://example.com/documents/license.pdf'
  })
  @IsUrl()
  @IsOptional()
  documentUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Status of the credential verification',
    enum: CredentialStatus
  })
  @IsEnum(CredentialStatus)
  @IsOptional()
  status?: CredentialStatus;

  @ApiPropertyOptional({ 
    description: 'Additional notes about the credential'
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class VerifyCredentialDto {
  @ApiProperty({ 
    description: 'Verification status',
    enum: [CredentialStatus.VERIFIED, CredentialStatus.REJECTED, CredentialStatus.SUSPENDED]
  })
  @IsEnum([CredentialStatus.VERIFIED, CredentialStatus.REJECTED, CredentialStatus.SUSPENDED])
  @IsNotEmpty()
  status: CredentialStatus.VERIFIED | CredentialStatus.REJECTED | CredentialStatus.SUSPENDED;

  @ApiPropertyOptional({ 
    description: 'Notes about the verification'
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CredentialResponseDto {
  @ApiProperty({ description: 'Credential ID' })
  id: string;

  @ApiProperty({ description: 'Staff member ID' })
  staffId: string;

  @ApiProperty({ 
    description: 'Type of credential',
    enum: CredentialType
  })
  type: CredentialType;

  @ApiProperty({ description: 'Title of the credential' })
  title: string;

  @ApiPropertyOptional({ description: 'Credential/license number' })
  number?: string;

  @ApiProperty({ description: 'Issuing authority' })
  issuingAuthority: string;

  @ApiProperty({ 
    description: 'Issue date',
    type: 'string',
    format: 'date-time'
  })
  issueDate: Date;

  @ApiPropertyOptional({ 
    description: 'Expiry date',
    type: 'string',
    format: 'date-time'
  })
  expiryDate?: Date;

  @ApiProperty({ 
    description: 'Verification status',
    enum: CredentialStatus
  })
  status: CredentialStatus;

  @ApiPropertyOptional({ 
    description: 'URL to the uploaded document',
    format: 'uri'
  })
  documentUrl?: string;

  @ApiPropertyOptional({ 
    description: 'ID of the user who verified the credential'
  })
  verifiedBy?: string;

  @ApiPropertyOptional({ 
    description: 'Verification timestamp',
    type: 'string',
    format: 'date-time'
  })
  verifiedAt?: Date;

  @ApiPropertyOptional({ description: 'Additional notes' })
  notes?: string;

  @ApiProperty({ 
    description: 'Creation timestamp',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Last update timestamp',
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date;
}

export class CredentialQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filter by credential type',
    enum: CredentialType
  })
  @IsEnum(CredentialType)
  @IsOptional()
  type?: CredentialType;

  @ApiPropertyOptional({ 
    description: 'Filter by verification status',
    enum: CredentialStatus
  })
  @IsEnum(CredentialStatus)
  @IsOptional()
  status?: CredentialStatus;

  @ApiPropertyOptional({ 
    description: 'Filter by expiration status',
    enum: ['expired', 'expiring_soon', 'valid'],
    example: 'expiring_soon'
  })
  @IsString()
  @IsOptional()
  expirationStatus?: 'expired' | 'expiring_soon' | 'valid';

  @ApiPropertyOptional({ 
    description: 'Number of days to consider as "expiring soon"',
    default: 30
  })
  @IsInt()
  @IsOptional()
  expiresInDays?: number = 30;

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
