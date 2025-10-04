import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-tenant.dto';
import { IsEnum, IsOptional, IsString, IsBoolean, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TenantType } from '../enums/tenant-type.enum';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  // Note: All fields from CreateTenantDto are already included via PartialType
  // We only need to add additional fields or override validation here
  
  @ApiPropertyOptional({
    description: 'The timestamp when the tenant was soft deleted',
    required: false,
    readOnly: true
  })
  @IsDateString()
  @IsOptional()
  deletedAt?: Date | null;
  @ApiProperty({
    example: 'Updated Hospital Name',
    description: 'The updated name of the tenant',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'updated-hospital-name',
    description: 'The updated URL-friendly identifier',
    required: false
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    enum: TenantType,
    example: TenantType.HOSPITAL,
    description: 'The updated type of healthcare facility',
    required: false
  })
  @IsOptional()
  @IsEnum(TenantType)
  type?: TenantType;

  @ApiProperty({
    example: '456 Updated St, City',
    description: 'Updated physical address',
    required: false
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: '+1987654321',
    description: 'Updated contact phone number',
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'updated@hospital.com',
    description: 'Updated contact email',
    required: false
  })

  @ApiProperty({
    example: 'https://example.com/updated-logo.png',
    description: 'Updated URL to the tenant\'s logo',
    required: false
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the tenant is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

}
