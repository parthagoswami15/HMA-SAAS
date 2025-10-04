import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsDateString, 
  IsOptional, 
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsInt,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../enums';

export class CheckInOutDto {
  @ApiProperty({ 
    description: 'Staff member ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsNotEmpty()
  staffId: string;

  @ApiPropertyOptional({ 
    description: 'Check-in/out timestamp (defaults to current time if not provided)',
    example: '2023-06-15T09:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  timestamp?: string;

  @ApiPropertyOptional({ 
    description: 'Location coordinates',
    example: { latitude: 12.9716, longitude: 77.5946 }
  })
  @IsObject()
  @IsOptional()
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };

  @ApiPropertyOptional({ 
    description: 'Device information',
    example: { 
      deviceId: 'device-123',
      deviceName: 'iPhone 13',
      os: 'iOS 15.0',
      ipAddress: '192.168.1.1'
    }
  })
  @IsObject()
  @IsOptional()
  deviceInfo?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Additional notes',
    example: 'Remote work from home'
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateAttendanceDto {
  @ApiPropertyOptional({ 
    description: 'Check-in time',
    example: '2023-06-15T09:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  checkIn?: string;

  @ApiPropertyOptional({ 
    description: 'Check-out time',
    example: '2023-06-15T18:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @ApiPropertyOptional({ 
    description: 'Attendance status',
    enum: AttendanceStatus
  })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @ApiPropertyOptional({ 
    description: 'Total working hours',
    minimum: 0,
    maximum: 24
  })
  @IsNumber()
  @Min(0)
  @Max(24)
  @IsOptional()
  totalHours?: number;

  @ApiPropertyOptional({ 
    description: 'Additional notes',
    example: 'Late due to traffic'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ 
    description: 'Whether this attendance record requires approval',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean = false;
}

export class AttendanceQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filter by staff member ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsOptional()
  staffId?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by department ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by attendance status',
    enum: AttendanceStatus
  })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @ApiPropertyOptional({ 
    description: 'Filter by date (YYYY-MM-DD format)',
    example: '2023-06-15'
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by start date (inclusive)',
    example: '2023-06-01'
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by end date (inclusive)',
    example: '2023-06-30'
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by late arrivals only',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  lateOnly?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Filter by early departures only',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  earlyDepartureOnly?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Filter by attendance records requiring approval',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean = false;

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
    enum: ['date', 'checkIn', 'checkOut', 'totalHours'],
    default: 'date'
  })
  @IsString()
  @IsOptional()
  sortBy?: 'date' | 'checkIn' | 'checkOut' | 'totalHours' = 'date';

  @ApiPropertyOptional({ 
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc'
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class BulkAttendanceUpdateDto {
  @ApiProperty({ 
    description: 'Array of attendance records to update',
    type: [BulkAttendanceItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkAttendanceItemDto)
  records: BulkAttendanceItemDto[];
}

export class BulkAttendanceItemDto {
  @ApiProperty({ 
    description: 'Attendance record ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ 
    description: 'Check-in time',
    example: '2023-06-15T09:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  checkIn?: string;

  @ApiPropertyOptional({ 
    description: 'Check-out time',
    example: '2023-06-15T18:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @ApiPropertyOptional({ 
    description: 'Attendance status',
    enum: AttendanceStatus
  })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @ApiPropertyOptional({ 
    description: 'Total working hours',
    minimum: 0,
    maximum: 24
  })
  @IsNumber()
  @Min(0)
  @Max(24)
  @IsOptional()
  totalHours?: number;

  @ApiPropertyOptional({ 
    description: 'Additional notes'
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
