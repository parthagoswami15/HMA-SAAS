import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsBoolean, IsDateString, IsNumber, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { StaffType, StaffStatus } from '../enums';

export class BaseDto {
  @ApiProperty({ description: 'ID of the record' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: 'Created at timestamp' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({ description: 'Deleted at timestamp', required: false })
  @IsDateString()
  @IsOptional()
  deletedAt?: Date;
}

export class BaseStaffDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  employeeId: string;

  @ApiProperty({ description: 'Staff type', enum: StaffType })
  @IsEnum(StaffType)
  type: StaffType;

  @ApiProperty({ description: 'Staff status', enum: StaffStatus })
  @IsEnum(StaffStatus)
  status: StaffStatus;

  @ApiProperty({ description: 'Department ID', required: false })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ description: 'Staff designation/position' })
  @IsString()
  designation: string;

  @ApiProperty({ description: 'Date of joining' })
  @IsDateString()
  joiningDate: Date;

  @ApiProperty({ description: 'List of qualifications', type: [String] })
  @IsArray()
  @IsString({ each: true })
  qualifications: string[];

  @ApiProperty({ description: 'Biography or description', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Whether the staff is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class BaseUserDto {
  @ApiProperty({ description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Email address' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class BaseRoleDto {
  @ApiProperty({ description: 'Role name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Role description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether this is a system role', default: false })
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;

  @ApiProperty({ description: 'Whether the role is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class BaseSpecialtyDto {
  @ApiProperty({ description: 'Specialty name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Specialty code', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'Specialty description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Specialty category', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Whether the specialty is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Color code for UI display', required: false })
  @IsString()
  @IsOptional()
  colorCode?: string;

  @ApiProperty({ description: 'Icon name or URL', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: 'Display order', default: 0 })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiProperty({ description: 'Whether certification is required', default: false })
  @IsBoolean()
  @IsOptional()
  requiresCertification?: boolean;

  @ApiProperty({ description: 'Minimum years of experience required', default: 0 })
  @IsNumber()
  @IsOptional()
  minYearsExperience?: number;
}

export class BaseStaffSpecialtyDto {
  @ApiProperty({ description: 'Specialty ID' })
  @IsUUID()
  specialtyId: string;

  @ApiProperty({ description: 'Whether this is the primary specialty', default: false })
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
}

export class BasePermissionDto {
  @ApiProperty({ description: 'Permission key (e.g., user:create)' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Permission name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Permission description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Module this permission belongs to' })
  @IsString()
  module: string;

  @ApiProperty({ description: 'Whether the permission is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
