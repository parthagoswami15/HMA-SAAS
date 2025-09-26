import { IsOptional, IsString, IsEnum, IsDateString, IsBoolean, IsInt, Min, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AdmissionStatus, AdmissionType } from '../enums';

export class AdmissionFilterDto {
  @ApiProperty({
    description: 'Search term to filter admissions (searches in patient name, ID, admission number)',
    required: false,
    example: 'John Doe or ADM-2023-001'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Filter by admission status',
    enum: AdmissionStatus,
    required: false,
    example: AdmissionStatus.ADMITTED
  })
  @IsEnum(AdmissionStatus)
  @IsOptional()
  status?: AdmissionStatus;

  @ApiProperty({
    description: 'Filter by admission type',
    enum: AdmissionType,
    required: false,
    example: AdmissionType.EMERGENCY
  })
  @IsEnum(AdmissionType)
  @IsOptional()
  type?: AdmissionType;

  @ApiProperty({
    description: 'Filter by patient ID',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiProperty({
    description: 'Filter by admitting doctor ID',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  @IsOptional()
  doctorId?: string;

  @ApiProperty({
    description: 'Filter by ward ID',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsUUID()
  @IsOptional()
  wardId?: string;

  @ApiProperty({
    description: 'Filter by bed ID',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174003'
  })
  @IsUUID()
  @IsOptional()
  bedId?: string;

  @ApiProperty({
    description: 'Filter by admission date range (start date)',
    required: false,
    example: '2023-06-01T00:00:00Z'
  })
  @IsDateString()
  @IsOptional()
  admissionDateFrom?: string;

  @ApiProperty({
    description: 'Filter by admission date range (end date)',
    required: false,
    example: '2023-06-30T23:59:59Z'
  })
  @IsDateString()
  @IsOptional()
  admissionDateTo?: string;

  @ApiProperty({
    description: 'Filter by discharge date range (start date)',
    required: false,
    example: '2023-06-15T00:00:00Z'
  })
  @IsDateString()
  @IsOptional()
  dischargeDateFrom?: string;

  @ApiProperty({
    description: 'Filter by discharge date range (end date)',
    required: false,
    example: '2023-06-25T23:59:59Z'
  })
  @IsDateString()
  @IsOptional()
  dischargeDateTo?: string;

  @ApiProperty({
    description: 'Filter by emergency admissions only',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isEmergency?: boolean;

  @ApiProperty({
    description: 'Filter by insurance provider',
    required: false,
    example: 'ABC Insurance'
  })
  @IsString()
  @IsOptional()
  insuranceProvider?: string;

  @ApiProperty({
    description: 'Filter by diagnosis or ICD code',
    required: false,
    example: 'J18.9 or pneumonia'
  })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiProperty({
    description: 'Filter by minimum length of stay (in days)',
    required: false,
    example: 3
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minStayDays?: number;

  @ApiProperty({
    description: 'Filter by maximum length of stay (in days)',
    required: false,
    example: 14
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  maxStayDays?: number;

  @ApiProperty({
    description: 'Include discharged patients',
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  includeDischarged?: boolean = true;

  @ApiProperty({
    description: 'Include active admissions',
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  includeActive?: boolean = true;

  @ApiProperty({
    description: 'Include transferred patients',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  includeTransferred?: boolean = false;

  @ApiProperty({
    description: 'Sort field',
    required: false,
    enum: ['admissionDate', 'dischargeDate', 'patientName', 'doctorName', 'wardName', 'bedNumber'],
    default: 'admissionDate'
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'admissionDate';

  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'DESC'
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: 'Include related entities (comma-separated)',
    required: false,
    example: 'patient,doctor,bed.ward,diagnoses'
  })
  @IsString()
  @IsOptional()
  include?: string;

  @ApiProperty({
    description: 'Filter by specific admission IDs',
    required: false,
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174005']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ids?: string[];
}
