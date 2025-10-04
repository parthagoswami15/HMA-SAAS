import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsDateString, 
  IsOptional, 
  IsUUID,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsNumber,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';
import { LeaveType, LeaveRequestStatus } from '../enums';

class LeaveDayDto {
  @ApiProperty({ 
    description: 'Date of the leave day (YYYY-MM-DD format)',
    example: '2023-07-15'
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ 
    description: 'Whether this is a full day leave',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isFullDay: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Start time (HH:mm format) for partial day leave',
    example: '09:00',
    required: false
  })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ 
    description: 'End time (HH:mm format) for partial day leave',
    example: '13:00',
    required: false
  })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ 
    description: 'Number of leave days (0.5 for half day, 1 for full day)',
    minimum: 0.5,
    default: 1
  })
  @IsNumber()
  @Min(0.5)
  @IsOptional()
  days: number = 1;
}

export class CreateLeaveRequestDto {
  @ApiProperty({ 
    description: 'Type of leave',
    enum: LeaveType,
    example: LeaveType.ANNUAL
  })
  @IsEnum(LeaveType)
  @IsNotEmpty()
  type: LeaveType;

  @ApiProperty({ 
    description: 'Start date of leave (YYYY-MM-DD format)',
    example: '2023-07-15'
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ 
    description: 'End date of leave (YYYY-MM-DD format)',
    example: '2023-07-20'
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ 
    description: 'Reason for leave',
    example: 'Family vacation'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  reason: string;

  @ApiPropertyOptional({ 
    description: 'Contact number during leave',
    example: '+1234567890'
  })
  @IsString()
  @IsOptional()
  contactNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Address during leave',
    example: '123 Vacation St, Beach City'
  })
  @IsString()
  @IsOptional()
  addressDuringLeave?: string;

  @ApiPropertyOptional({ 
    description: 'Array of specific leave days (optional, will be calculated if not provided)', 
    type: [LeaveDayDto],
    required: false
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LeaveDayDto)
  @IsOptional()
  leaveDays?: LeaveDayDto[];

  @ApiPropertyOptional({ 
    description: 'ID of the staff member to assign as replacement (if applicable)',
    required: false
  })
  @IsUUID()
  @IsOptional()
  replacementStaffId?: string;
}

export class UpdateLeaveRequestDto {
  @ApiPropertyOptional({ 
    description: 'Type of leave',
    enum: LeaveType
  })
  @IsEnum(LeaveType)
  @IsOptional()
  type?: LeaveType;

  @ApiPropertyOptional({ 
    description: 'Start date of leave (YYYY-MM-DD format)',
    example: '2023-07-15'
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'End date of leave (YYYY-MM-DD format)',
    example: '2023-07-20'
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Reason for leave',
    example: 'Family vacation'
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  reason?: string;

  @ApiPropertyOptional({ 
    description: 'Contact number during leave',
    example: '+1234567890'
  })
  @IsString()
  @IsOptional()
  contactNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Address during leave',
    example: '123 Vacation St, Beach City'
  })
  @IsString()
  @IsOptional()
  addressDuringLeave?: string;

  @ApiPropertyOptional({ 
    description: 'ID of the staff member to assign as replacement (if applicable)'
  })
  @IsUUID()
  @IsOptional()
  replacementStaffId?: string;
}

export class ProcessLeaveRequestDto {
  @ApiProperty({ 
    description: 'Action to take on the leave request',
    enum: [LeaveRequestStatus.APPROVED, LeaveRequestStatus.REJECTED, LeaveRequestStatus.CANCELLED],
    example: LeaveRequestStatus.APPROVED
  })
  @IsEnum([LeaveRequestStatus.APPROVED, LeaveRequestStatus.REJECTED, LeaveRequestStatus.CANCELLED])
  @IsNotEmpty()
  status: LeaveRequestStatus.APPROVED | LeaveRequestStatus.REJECTED | LeaveRequestStatus.CANCELLED;

  @ApiPropertyOptional({ 
    description: 'Comments regarding the approval/rejection',
    example: 'Approved as per HR policy.'
  })
  @IsString()
  @IsOptional()
  comments?: string;
}

export class LeaveRequestQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filter by staff member ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsOptional()
  staffId?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by leave type',
    enum: LeaveType
  })
  @IsEnum(LeaveType)
  @IsOptional()
  type?: LeaveType;

  @ApiPropertyOptional({ 
    description: 'Filter by status',
    enum: LeaveRequestStatus
  })
  @IsEnum(LeaveRequestStatus)
  @IsOptional()
  status?: LeaveRequestStatus;

  @ApiPropertyOptional({ 
    description: 'Filter by start date (inclusive)',
    example: '2023-01-01'
  })
  @IsDateString()
  @IsOptional()
  startDateFrom?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by end date (inclusive)', 
    example: '2023-12-31'
  })
  @IsDateString()
  @IsOptional()
  endDateTo?: string;

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
    enum: ['startDate', 'endDate', 'createdAt', 'updatedAt'],
    default: 'startDate'
  })
  @IsString()
  @IsOptional()
  sortBy?: 'startDate' | 'endDate' | 'createdAt' | 'updatedAt' = 'startDate';

  @ApiPropertyOptional({ 
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'asc'
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'asc';
}

export class LeaveBalanceDto {
  @ApiProperty({ 
    description: 'Type of leave',
    enum: LeaveType
  })
  @IsEnum(LeaveType)
  @IsNotEmpty()
  type: LeaveType;

  @ApiProperty({ 
    description: 'Total allocated leave days for this type',
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  allocated: number;

  @ApiProperty({ 
    description: 'Number of leave days taken',
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  taken: number;

  @ApiProperty({ 
    description: 'Number of leave days remaining',
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  remaining: number;

  @ApiPropertyOptional({ 
    description: 'Number of leave days pending approval',
    minimum: 0,
    default: 0
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  pending?: number = 0;
}
