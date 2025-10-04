import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsEmail, IsPhoneNumber, IsEnum, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWardDto {
  @ApiProperty({ description: 'Name of the ward', example: 'General Ward A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Code/identifier for the ward', example: 'GW-A' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ 
    description: 'Description of the ward',
    required: false,
    example: 'General medical ward for adult patients'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Floor number where the ward is located',
    example: 2
  })
  @IsNumber()
  @Type(() => Number)
  floor: number;

  @ApiProperty({ 
    description: 'Type of ward',
    example: 'GENERAL',
    enum: ['GENERAL', 'ICU', 'CCU', 'PEDIATRICS', 'MATERNITY', 'SURGICAL', 'ONCOLOGY', 'PSYCHIATRIC', 'ISOLATION', 'OTHER']
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ 
    description: 'Contact number for the ward',
    required: false,
    example: '+1234567890'
  })
  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  contactNumber?: string;

  @ApiProperty({ 
    description: 'Email contact for the ward',
    required: false,
    example: 'ward.a@hospital.com'
  })
  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ 
    description: 'ID of the staff member in charge',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsString()
  @IsOptional()
  inChargeId?: string;

  @ApiProperty({ 
    description: 'Whether the ward is currently active',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive: boolean = true;

  @ApiProperty({ 
    description: 'List of bed types available in this ward',
    required: false,
    example: ['GENERAL', 'PRIVATE', 'DELUXE'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bedTypes?: string[];

  @ApiProperty({ 
    description: 'Specialties or services available in this ward',
    required: false,
    example: ['Cardiology', 'Pulmonology', 'General Medicine'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];

  @ApiProperty({ 
    description: 'Additional notes about the ward',
    required: false,
    example: 'Visiting hours: 2 PM - 6 PM. Only 2 visitors per patient allowed.'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ 
    description: 'Custom fields for additional ward information',
    required: false,
    example: {
      hasPrivateBathroom: true,
      hasAC: true,
      visitingHours: {
        weekdays: '2 PM - 6 PM',
        weekends: '11 AM - 7 PM'
      }
    }
  })
  @IsObject()
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiProperty({ 
    description: 'Initial beds to be added to this ward',
    required: false,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        bedNumber: { type: 'string', example: 'B-101' },
        name: { type: 'string', example: 'Bed 1' },
        bedClass: { 
          type: 'string', 
          enum: ['GENERAL', 'PRIVATE', 'DELUXE', 'ICU', 'ISOLATION', 'HDU', 'PEDIATRIC', 'MATERNITY', 'OTHER'],
          example: 'GENERAL'
        },
        features: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['Oxygen', 'Suction', 'Monitor']
        },
        dailyRate: { type: 'number', example: 150.50 },
        notes: { type: 'string', example: 'Near nursing station' }
      }
    }
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  initialBeds?: Array<{
    bedNumber: string;
    name: string;
    bedClass: string;
    features?: string[];
    dailyRate?: number;
    notes?: string;
  }>;
}
