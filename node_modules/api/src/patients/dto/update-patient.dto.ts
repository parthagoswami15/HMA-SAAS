import { PartialType, PickType, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { 
  IsOptional, 
  IsDateString, 
  IsEnum, 
  IsEmail, 
  IsPhoneNumber, 
  IsString, 
  MaxLength,
  IsBoolean,
  IsArray,
  IsObject,
  IsNumber,
  ValidateNested,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, BloodType, MaritalStatus } from '@prisma/client';
import { CreatePatientDto } from './create-patient.dto';

class UpdateEmergencyContactDto {
  @ApiPropertyOptional({ description: 'Full name of emergency contact' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Relationship to patient' })
  @IsString()
  @IsOptional()
  relationship?: string;

  @ApiPropertyOptional({ description: 'Phone number of emergency contact' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email of emergency contact' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Address of emergency contact' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Whether this is the primary emergency contact' })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePatientDto extends PartialType(OmitType(CreatePatientDto, [
  'emergencyContacts'
] as const)) {
  @ApiPropertyOptional({
    description: 'List of emergency contacts',
    type: [UpdateEmergencyContactDto]
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateEmergencyContactDto)
  @IsArray()
  @IsOptional()
  emergencyContacts?: UpdateEmergencyContactDto[];

  @ApiPropertyOptional({
    description: 'Patient score/risk level',
    example: 75,
    minimum: 0,
    maximum: 100
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  score?: number;

  @ApiPropertyOptional({
    description: 'Total amount spent by patient',
    example: 1250.75,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalSpent?: number;

  @ApiPropertyOptional({
    description: 'Patient loyalty points',
    example: 250,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  loyaltyPoints?: number;

  @ApiPropertyOptional({
    description: 'Patient credit balance',
    example: 150.50,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  creditBalance?: number;

  @ApiPropertyOptional({
    description: 'Patient discount percentage',
    example: 10,
    minimum: 0,
    maximum: 100
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercentage?: number;

  @ApiPropertyOptional({
    description: 'Total number of visits',
    example: 5,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalVisits?: number;

  @ApiPropertyOptional({
    description: 'Date when the patient was last verified',
    example: '2023-06-01T00:00:00Z'
  })
  @IsDateString()
  @IsOptional()
  lastVerifiedAt?: string | null;

  @ApiPropertyOptional({
    description: 'Date of death',
    example: '2023-01-15'
  })
  @IsDateString()
  @IsOptional()
  dateOfDeath?: string | null;

  @ApiPropertyOptional({
    description: 'Date when the patient was registered',
    example: '2023-01-01T00:00:00Z'
  })
  @IsDateString()
  @IsOptional()
  registeredAt?: string | null;

  @ApiPropertyOptional({
    description: 'Date of last visit',
    example: '2023-06-15T00:00:00Z'
  })
  @IsDateString()
  @IsOptional()
  lastVisitAt?: string | null;
}
