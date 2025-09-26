import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsUUID,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDepartmentDto {
  @ApiProperty({ 
    description: 'Department name',
    example: 'Cardiology'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ 
    description: 'Department code (must be unique within tenant)',
    example: 'CARD'
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ 
    description: 'Description of the department',
    example: 'Cardiology department handles heart-related conditions and treatments.'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'ID of the department head (staff member)',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsOptional()
  headStaffId?: string;

  @ApiPropertyOptional({ 
    description: 'ID of the parent department (for hierarchical structures)',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsUUID()
  @IsOptional()
  parentDepartmentId?: string;

  @ApiPropertyOptional({ 
    description: 'Whether the department is active',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Color code for the department (e.g., #FF5733)',
    example: '#FF5733'
  })
  @IsString()
  @IsOptional()
  colorCode?: string;

  @ApiPropertyOptional({ 
    description: 'Department contact email',
    example: 'cardiology@hospital.com'
  })
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({ 
    description: 'Department contact phone number',
    example: '+1234567890'
  })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({ 
    description: 'Physical location of the department',
    example: 'Building A, 2nd Floor, Wing C'
  })
  @IsString()
  @IsOptional()
  location?: string;
}

export class UpdateDepartmentDto {
  @ApiPropertyOptional({ 
    description: 'Department name',
    example: 'Cardiology'
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Department code (must be unique within tenant)', 
    example: 'CARD'
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ 
    description: 'Description of the department',
    example: 'Cardiology department handles heart-related conditions and treatments.'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'ID of the department head (staff member)',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsOptional()
  headStaffId?: string | null;

  @ApiPropertyOptional({ 
    description: 'ID of the parent department (for hierarchical structures)',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsUUID()
  @IsOptional()
  parentDepartmentId?: string | null;

  @ApiPropertyOptional({ 
    description: 'Whether the department is active',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Color code for the department (e.g., #FF5733)',
    example: '#FF5733'
  })
  @IsString()
  @IsOptional()
  colorCode?: string;

  @ApiPropertyOptional({ 
    description: 'Department contact email',
    example: 'cardiology@hospital.com'
  })
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({ 
    description: 'Department contact phone number',
    example: '+1234567890'
  })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({ 
    description: 'Physical location of the department',
    example: 'Building A, 2nd Floor, Wing C'
  })
  @IsString()
  @IsOptional()
  location?: string;
}

export class DepartmentQueryDto {
  @ApiPropertyOptional({ 
    description: 'Search term for department name or code',
    example: 'cardio'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by active status',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Filter by parent department ID',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsUUID()
  @IsOptional()
  parentDepartmentId?: string;

  @ApiPropertyOptional({ 
    description: 'Include child departments in the results',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  includeChildren?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Include staff count for each department',
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
    enum: ['name', 'code', 'createdAt'],
    default: 'name'
  })
  @IsString()
  @IsOptional()
  sortBy?: 'name' | 'code' | 'createdAt' = 'name';

  @ApiPropertyOptional({ 
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'asc'
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'asc';
}

export class DepartmentResponseDto {
  @ApiProperty({ description: 'Department ID' })
  id: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenantId: string;

  @ApiProperty({ description: 'Department name' })
  name: string;

  @ApiPropertyOptional({ description: 'Department code' })
  code?: string;

  @ApiPropertyOptional({ description: 'Department description' })
  description?: string;

  @ApiPropertyOptional({ 
    description: 'ID of the department head',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  headStaffId?: string | null;

  @ApiPropertyOptional({ 
    description: 'Name of the department head',
    example: 'Dr. John Smith'
  })
  headStaffName?: string | null;

  @ApiPropertyOptional({ 
    description: 'ID of the parent department',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  parentDepartmentId?: string | null;

  @ApiPropertyOptional({ 
    description: 'Name of the parent department',
    example: 'Medical Services'
  })
  parentDepartmentName?: string | null;

  @ApiProperty({ 
    description: 'Whether the department is active',
    default: true
  })
  isActive: boolean;

  @ApiPropertyOptional({ 
    description: 'Color code for the department',
    example: '#FF5733'
  })
  colorCode?: string;

  @ApiPropertyOptional({ 
    description: 'Department contact email',
    example: 'cardiology@hospital.com'
  })
  contactEmail?: string;

  @ApiPropertyOptional({ 
    description: 'Department contact phone number',
    example: '+1234567890'
  })
  contactPhone?: string;

  @ApiPropertyOptional({ 
    description: 'Physical location of the department',
    example: 'Building A, 2nd Floor, Wing C'
  })
  location?: string;

  @ApiPropertyOptional({ 
    description: 'Number of staff members in the department',
    default: 0
  })
  staffCount?: number;

  @ApiPropertyOptional({ 
    description: 'Child departments',
    type: [DepartmentResponseDto]
  })
  children?: DepartmentResponseDto[];

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
