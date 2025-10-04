import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsUUID, 
  IsArray, 
  IsOptional, 
  IsBoolean, 
  IsDateString, 
  IsEnum, 
  ValidateNested, 
  IsNumber,
  IsEmail,
  IsPhoneNumber,
  MaxLength,
  MinLength
} from 'class-validator';
import { Type } from 'class-transformer';
import { StaffType, StaffStatus } from '../enums';

// Request DTOs
export class CreateStaffUserDto {
  @ApiProperty({ description: 'First name' })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Temporary password (will be hashed)', required: false })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Whether to send welcome email', default: true })
  @IsBoolean()
  @IsOptional()
  sendWelcomeEmail?: boolean = true;
}

export class CreateStaffDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  employeeId: string;

  @ApiProperty({ description: 'Staff type', enum: StaffType })
  @IsEnum(StaffType)
  type: StaffType;

  @ApiProperty({ description: 'Staff status', enum: StaffStatus, default: StaffStatus.ACTIVE })
  @IsEnum(StaffStatus)
  @IsOptional()
  status?: StaffStatus = StaffStatus.ACTIVE;

  @ApiProperty({ description: 'Department ID', required: false })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ description: 'Staff designation/position' })
  @IsString()
  @MaxLength(100)
  designation: string;

  @ApiProperty({ description: 'Date of joining' })
  @IsDateString()
  joiningDate: Date;

  @ApiProperty({ description: 'List of qualifications', type: [String], default: [] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  qualifications: string[] = [];

  @ApiProperty({ description: 'Biography or description', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Whether the staff is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ description: 'User account details' })
  @ValidateNested()
  @Type(() => CreateStaffUserDto)
  user: CreateStaffUserDto;

  @ApiProperty({ description: 'List of role IDs to assign to the staff', type: [String], default: [] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  roleIds?: string[] = [];

  @ApiProperty({ 
    description: 'List of specialties with details', 
    type: 'array', 
    items: {
      type: 'object',
      properties: {
        specialtyId: { type: 'string', format: 'uuid' },
        isPrimary: { type: 'boolean', default: false },
        experience: { type: 'number', minimum: 0, required: false },
        notes: { type: 'string', required: false },
        startDate: { type: 'string', format: 'date-time', required: false },
        certificationNumber: { type: 'string', required: false },
        certificationExpiryDate: { type: 'string', format: 'date-time', required: false }
      }
    },
    default: []
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStaffSpecialtyDto)
  @IsOptional()
  specialties?: CreateStaffSpecialtyDto[] = [];
}

export class UpdateStaffDto {
  @ApiProperty({ description: 'Employee ID', required: false })
  @IsString()
  @IsOptional()
  employeeId?: string;

  @ApiProperty({ description: 'Staff type', enum: StaffType, required: false })
  @IsEnum(StaffType)
  @IsOptional()
  type?: StaffType;

  @ApiProperty({ description: 'Staff status', enum: StaffStatus, required: false })
  @IsEnum(StaffStatus)
  @IsOptional()
  status?: StaffStatus;

  @ApiProperty({ description: 'Department ID', required: false })
  @IsUUID()
  @IsOptional()
  departmentId?: string | null;

  @ApiProperty({ description: 'Staff designation/position', required: false })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  designation?: string;

  @ApiProperty({ description: 'Date of joining', required: false })
  @IsDateString()
  @IsOptional()
  joiningDate?: Date;

  @ApiProperty({ description: 'List of qualifications', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  qualifications?: string[];

  @ApiProperty({ description: 'Biography or description', required: false })
  @IsString()
  @IsOptional()
  bio?: string | null;

  @ApiProperty({ description: 'Whether the staff is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'List of role IDs to assign to the staff', type: [String], required: false })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  roleIds?: string[];

  @ApiProperty({ 
    description: 'List of specialties with details', 
    type: 'array', 
    items: {
      type: 'object',
      properties: {
        specialtyId: { type: 'string', format: 'uuid' },
        isPrimary: { type: 'boolean', default: false },
        experience: { type: 'number', minimum: 0, required: false },
        notes: { type: 'string', required: false },
        startDate: { type: 'string', format: 'date-time', required: false },
        certificationNumber: { type: 'string', required: false },
        certificationExpiryDate: { type: 'string', format: 'date-time', required: false },
        remove: { type: 'boolean', default: false }
      }
    },
    required: false
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateStaffSpecialtyDto)
  @IsOptional()
  specialties?: UpdateStaffSpecialtyDto[];
}

export class StaffFilterDto {
  @ApiProperty({ description: 'Search term (searches in name, email, employee ID)', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Filter by staff type', enum: StaffType, required: false })
  @IsEnum(StaffType)
  @IsOptional()
  type?: StaffType;

  @ApiProperty({ description: 'Filter by staff status', enum: StaffStatus, required: false })
  @IsEnum(StaffStatus)
  @IsOptional()
  status?: StaffStatus;

  @ApiProperty({ description: 'Filter by department ID', required: false })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ description: 'Filter by specialty ID', required: false })
  @IsUUID()
  @IsOptional()
  specialtyId?: string;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Page number (1-based)', default: 1, required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ description: 'Number of items per page', default: 10, required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({ 
    description: 'Sort field', 
    enum: ['firstName', 'lastName', 'email', 'employeeId', 'createdAt', 'updatedAt'],
    default: 'createdAt',
    required: false 
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiProperty({ 
    description: 'Sort order', 
    enum: ['asc', 'desc'],
    default: 'desc',
    required: false 
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

// Response DTOs
export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'First name' })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'Phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'Whether the user is active' })
  isActive: boolean;
}

export class DepartmentResponseDto {
  @ApiProperty({ description: 'Department ID' })
  id: string;

  @ApiProperty({ description: 'Department name' })
  name: string;

  @ApiProperty({ description: 'Department code', required: false })
  code?: string;
}

export class RoleResponseDto {
  @ApiProperty({ description: 'Role ID' })
  id: string;

  @ApiProperty({ description: 'Role name' })
  name: string;

  @ApiProperty({ description: 'Whether this is a system role' })
  isSystem: boolean;
}

export class SpecialtyResponseDto {
  @ApiProperty({ description: 'Specialty ID' })
  id: string;

  @ApiProperty({ description: 'Specialty name' })
  name: string;

  @ApiProperty({ description: 'Specialty code', required: false })
  code?: string;
}

export class StaffSpecialtyResponseDto {
  @ApiProperty({ description: 'Staff-specialty relationship ID' })
  id: string;

  @ApiProperty({ description: 'Whether this is the primary specialty' })
  isPrimary: boolean;

  @ApiProperty({ description: 'Years of experience', required: false })
  experience?: number;

  @ApiProperty({ description: 'Additional notes', required: false })
  notes?: string;

  @ApiProperty({ description: 'Start date in this specialty', required: false })
  startDate?: Date;

  @ApiProperty({ description: 'Certification number', required: false })
  certificationNumber?: string;

  @ApiProperty({ description: 'Certification expiry date', required: false })
  certificationExpiryDate?: Date;

  @ApiProperty({ description: 'Specialty details' })
  specialty: SpecialtyResponseDto;
}

export class StaffResponseDto {
  @ApiProperty({ description: 'Staff ID' })
  id: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenantId: string;

  @ApiProperty({ description: 'Employee ID' })
  employeeId: string;

  @ApiProperty({ description: 'Staff type', enum: StaffType })
  type: StaffType;

  @ApiProperty({ description: 'Staff status', enum: StaffStatus })
  status: StaffStatus;

  @ApiProperty({ description: 'Department details', required: false })
  department?: DepartmentResponseDto;

  @ApiProperty({ description: 'Designation/position' })
  designation: string;

  @ApiProperty({ description: 'Date of joining' })
  joiningDate: Date;

  @ApiProperty({ description: 'List of qualifications', type: [String] })
  qualifications: string[];

  @ApiProperty({ description: 'Biography or description', required: false })
  bio?: string;

  @ApiProperty({ description: 'Whether the staff is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'User account details' })
  user: UserResponseDto;

  @ApiProperty({ description: 'Assigned roles', type: [RoleResponseDto] })
  roles: RoleResponseDto[];

  @ApiProperty({ description: 'Staff specialties', type: [StaffSpecialtyResponseDto] })
  specialties: StaffSpecialtyResponseDto[];
}

export class StaffListResponseDto {
  @ApiProperty({ description: 'List of staff members', type: [StaffResponseDto] })
  data: StaffResponseDto[];

  @ApiProperty({ 
    description: 'Pagination metadata',
    type: 'object',
    properties: {
      total: { type: 'number', description: 'Total number of items' },
      page: { type: 'number', description: 'Current page number' },
      limit: { type: 'number', description: 'Number of items per page' },
      totalPages: { type: 'number', description: 'Total number of pages' }
    }
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class RecentStaffResponseDto {
  @ApiProperty({ description: 'Staff ID' })
  id: string;

  @ApiProperty({ description: 'Employee ID' })
  employeeId: string;

  @ApiProperty({ description: 'Designation/position' })
  designation: string;

  @ApiProperty({ description: 'Date of joining' })
  joiningDate: Date;

  @ApiProperty({ description: 'User details' })
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };

  @ApiProperty({ description: 'Department details', required: false })
  department?: {
    id: string;
    name: string;
    code?: string;
  };
}

export class StaffCountResponseDto {
  @ApiProperty({ description: 'Type or status of staff' })
  key: string;

  @ApiProperty({ description: 'Display name for the type/status' })
  label: string;

  @ApiProperty({ description: 'Count of staff in this category' })
  count: number;

  @ApiProperty({ description: 'Percentage of total staff', required: false })
  percentage?: number;
}

// For staff-specialty relationships
export class CreateStaffSpecialtyDto {
  @ApiProperty({ description: 'Specialty ID' })
  @IsUUID()
  specialtyId: string;

  @ApiProperty({ description: 'Whether this is the primary specialty', default: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean = false;

  @ApiProperty({ description: 'Years of experience in this specialty', required: false })
  @IsNumber()
  @IsOptional()
  experience?: number;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Start date in this specialty', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'Certification number', required: false })
  @IsString()
  @IsOptional()
  certificationNumber?: string;

  @ApiProperty({ description: 'Certification expiry date', required: false })
  @IsDateString()
  @IsOptional()
  certificationExpiryDate?: Date;
}

export class UpdateStaffSpecialtyDto {
  @ApiProperty({ description: 'Whether this is the primary specialty', required: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiProperty({ description: 'Years of experience in this specialty', required: false })
  @IsNumber()
  @IsOptional()
  experience?: number;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Start date in this specialty', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'Certification number', required: false })
  @IsString()
  @IsOptional()
  certificationNumber?: string;

  @ApiProperty({ description: 'Certification expiry date', required: false })
  @IsDateString()
  @IsOptional()
  certificationExpiryDate?: Date;

  @ApiProperty({ description: 'Whether to remove this specialty from the staff member', default: false })
  @IsBoolean()
  @IsOptional()
  remove?: boolean = false;
}
