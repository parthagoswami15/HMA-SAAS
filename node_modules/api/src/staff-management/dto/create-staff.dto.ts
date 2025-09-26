import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsEmail, 
  IsEnum, 
  IsOptional, 
  IsArray, 
  ValidateNested,
  IsBoolean,
  IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';
import { StaffType, StaffStatus } from '../enums';

class CreateUserDto {
  @ApiProperty({ description: 'First name of the staff member' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of the staff member' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email address (must be unique)' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class CreateStaffDto {
  @ApiProperty({ description: 'Employee ID (must be unique within tenant)' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ 
    description: 'Type of staff member',
    enum: StaffType,
    example: StaffType.DOCTOR
  })
  @IsEnum(StaffType)
  @IsNotEmpty()
  type: StaffType;

  @ApiProperty({ 
    description: 'Staff status',
    enum: StaffStatus,
    default: StaffStatus.ACTIVE
  })
  @IsEnum(StaffStatus)
  @IsOptional()
  status?: StaffStatus = StaffStatus.ACTIVE;

  @ApiProperty({ description: 'Date of joining the organization' })
  @IsDateString()
  @IsNotEmpty()
  joiningDate: Date;

  @ApiProperty({ description: 'Department ID' })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ description: 'Job title/designation' })
  @IsString()
  @IsNotEmpty()
  designation: string;

  @ApiProperty({ 
    description: 'Array of qualifications',
    example: ['MBBS', 'MD'] 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  qualifications?: string[] = [];

  @ApiProperty({ description: 'Professional biography' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Whether the staff member is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ description: 'User account details' })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ApiProperty({ 
    description: 'Array of role IDs to assign to the staff member',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roleIds?: string[] = [];

  @ApiProperty({ 
    description: 'Array of specialty IDs with additional details',
    required: false,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        specialtyId: { type: 'string' },
        isPrimary: { type: 'boolean', default: false },
        experience: { type: 'number', nullable: true },
        notes: { type: 'string', nullable: true }
      }
    }
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StaffSpecialtyDto)
  specialties?: StaffSpecialtyDto[] = [];
}

export class StaffSpecialtyDto {
  @ApiProperty({ description: 'Specialty ID' })
  @IsString()
  @IsNotEmpty()
  specialtyId: string;

  @ApiProperty({ 
    description: 'Whether this is the primary specialty',
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean = false;

  @ApiProperty({ 
    description: 'Years of experience in this specialty',
    required: false 
  })
  @IsOptional()
  experience?: number;

  @ApiProperty({ 
    description: 'Additional notes about this specialty',
    required: false 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
