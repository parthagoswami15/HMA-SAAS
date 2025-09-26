import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsUUID,
  IsBoolean,
  IsArray,
  IsInt,
  Min,
  Max,
  IsEnum
} from 'class-validator';

export class CreateSpecialtyDto {
  @ApiProperty({ 
    description: 'Specialty name',
    example: 'Cardiology'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ 
    description: 'Specialty code (must be unique within tenant)',
    example: 'CARD'
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ 
    description: 'Description of the specialty',
    example: 'Specializes in the diagnosis and treatment of heart conditions.'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Category of the specialty',
    example: 'Medical'
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Whether the specialty is active',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Color code for the specialty (e.g., #FF5733)',
    example: '#FF5733'
  })
  @IsString()
  @IsOptional()
  colorCode?: string;

  @ApiPropertyOptional({ 
    description: 'Icon name or class for the specialty',
    example: 'heart-pulse'
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ 
    description: 'Order in which the specialty should be displayed',
    example: 1
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number = 0;

  @ApiPropertyOptional({ 
    description: 'Whether this specialty requires board certification',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  requiresCertification?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Minimum years of experience required for this specialty',
    example: 3
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  minYearsExperience?: number;
}

export class UpdateSpecialtyDto {
  @ApiPropertyOptional({ 
    description: 'Specialty name',
    example: 'Cardiology'
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Specialty code (must be unique within tenant)',
    example: 'CARD'
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ 
    description: 'Description of the specialty',
    example: 'Specializes in the diagnosis and treatment of heart conditions.'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Category of the specialty',
    example: 'Medical'
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Whether the specialty is active',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Color code for the specialty (e.g., #FF5733)',
    example: '#FF5733'
  })
  @IsString()
  @IsOptional()
  colorCode?: string;

  @ApiPropertyOptional({ 
    description: 'Icon name or class for the specialty',
    example: 'heart-pulse'
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ 
    description: 'Order in which the specialty should be displayed',
    example: 1
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ 
    description: 'Whether this specialty requires board certification',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  requiresCertification?: boolean;

  @ApiPropertyOptional({ 
    description: 'Minimum years of experience required for this specialty',
    example: 3
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  minYearsExperience?: number;
}

export class SpecialtyQueryDto {
  @ApiPropertyOptional({ 
    description: 'Search term for specialty name or code',
    example: 'cardio'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by category',
    example: 'Medical'
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by active status',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Include staff count for each specialty',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  includeStaffCount?: boolean = false;

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

  @ApiPropertyOptional({ 
    description: 'Sort field',
    enum: ['name', 'code', 'category', 'displayOrder'],
    default: 'name'
  })
  @IsString()
  @IsOptional()
  sortBy?: 'name' | 'code' | 'category' | 'displayOrder' = 'name';

  @ApiPropertyOptional({ 
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'asc'
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'asc';
}

export class StaffSpecialtyDto {
  @ApiProperty({ 
    description: 'Specialty ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsNotEmpty()
  specialtyId: string;

  @ApiProperty({ 
    description: 'Whether this is the primary specialty',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Years of experience in this specialty',
    example: 5
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  yearsExperience?: number;

  @ApiPropertyOptional({ 
    description: 'Date when the staff member started practicing this specialty',
    example: '2018-01-01'
  })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'Board certification number',
    example: 'BC123456'
  })
  @IsString()
  @IsOptional()
  certificationNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Board certification expiry date',
    example: '2025-12-31'
  })
  @IsString()
  @IsOptional()
  certificationExpiryDate?: string;

  @ApiPropertyOptional({ 
    description: 'Additional notes about this specialty assignment'
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateStaffSpecialtyDto extends StaffSpecialtyDto {
  @ApiPropertyOptional({ 
    description: 'Whether to remove this specialty from the staff member',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  remove?: boolean = false;
}

export class SpecialtyResponseDto {
  @ApiProperty({ description: 'Specialty ID' })
  id: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenantId: string;

  @ApiProperty({ description: 'Specialty name' })
  name: string;

  @ApiPropertyOptional({ description: 'Specialty code' })
  code?: string;

  @ApiPropertyOptional({ description: 'Specialty description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Specialty category' })
  category?: string;

  @ApiProperty({ 
    description: 'Whether the specialty is active',
    default: true
  })
  isActive: boolean;

  @ApiPropertyOptional({ 
    description: 'Color code for the specialty',
    example: '#FF5733'
  })
  colorCode?: string;

  @ApiPropertyOptional({ 
    description: 'Icon name or class for the specialty',
    example: 'heart-pulse'
  })
  icon?: string;

  @ApiPropertyOptional({ 
    description: 'Display order',
    default: 0
  })
  displayOrder: number;

  @ApiPropertyOptional({ 
    description: 'Whether this specialty requires board certification',
    default: false
  })
  requiresCertification: boolean;

  @ApiPropertyOptional({ 
    description: 'Minimum years of experience required',
    default: 0
  })
  minYearsExperience: number;

  @ApiPropertyOptional({ 
    description: 'Number of staff members with this specialty',
    default: 0
  })
  staffCount?: number;

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
