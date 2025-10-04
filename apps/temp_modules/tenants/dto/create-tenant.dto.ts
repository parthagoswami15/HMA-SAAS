import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TenantType } from '../enums/tenant-type.enum';

export class CreateTenantDto {
  @ApiProperty({
    example: 'City General Hospital',
    description: 'The name of the tenant (hospital/clinic/lab)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'city-general',
    description: 'A unique URL-friendly identifier for the tenant',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    enum: TenantType,
    default: TenantType.HOSPITAL,
    description: 'The type of healthcare facility',
    required: false,
  })
  @IsEnum(TenantType)
  @IsOptional()
  type?: TenantType;

  @ApiProperty({
    example: '123 Main St, City',
    description: 'Physical address of the facility',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Contact phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'contact@hospital.com',
    description: 'Contact email address',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'URL to the tenant\'s logo',
    required: false,
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Whether the tenant is active',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
