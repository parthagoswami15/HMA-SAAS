import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsUUID, 
  IsDateString, 
  IsBoolean, 
  IsOptional,
  ValidateNested,
  IsEnum,
  IsArray,
  ArrayMinSize,
  IsInt,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShiftType } from '../enums';

class RecurrenceRuleDto {
  @ApiProperty({ 
    description: 'Recurrence frequency',
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    example: 'WEEKLY' 
  })
  @IsString()
  @IsNotEmpty()
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

  @ApiPropertyOptional({ 
    description: 'Interval between occurrences',
    minimum: 1,
    default: 1 
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  interval?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Days of the week (0-6 where 0 is Sunday)',
    type: [Number],
    example: [1, 3, 5] // Monday, Wednesday, Friday
  })
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  @IsOptional()
  byWeekDay?: number[];

  @ApiPropertyOptional({ 
    description: 'End date for the recurrence',
    example: '2023-12-31T23:59:59.999Z' 
  })
  @IsDateString()
  @IsOptional()
  until?: string;

  @ApiPropertyOptional({ 
    description: 'Maximum number of occurrences',
    minimum: 1 
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  count?: number;
}

export class CreateShiftDto {
  @ApiProperty({ 
    description: 'Staff member ID',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsUUID()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ 
    description: 'Location ID where the shift takes place',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsUUID()
  @IsNotEmpty()
  locationId: string;

  @ApiProperty({ 
    description: 'Type of shift',
    enum: ShiftType,
    example: ShiftType.MORNING 
  })
  @IsEnum(ShiftType)
  @IsNotEmpty()
  type: ShiftType;

  @ApiProperty({ 
    description: 'Shift start time (ISO 8601 format)',
    example: '2023-06-01T09:00:00.000Z' 
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ 
    description: 'Shift end time (ISO 8601 format)',
    example: '2023-06-01T17:00:00.000Z' 
  })
  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @ApiPropertyOptional({ 
    description: 'Whether this is a recurring shift',
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Recurrence rule (required if isRecurring is true)', 
    type: RecurrenceRuleDto 
  })
  @ValidateNested()
  @Type(() => RecurrenceRuleDto)
  @IsOptional()
  recurrence?: RecurrenceRuleDto;

  @ApiPropertyOptional({ 
    description: 'Additional notes about the shift',
    example: 'Covering for Dr. Smith' 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateShiftDto {
  @ApiPropertyOptional({ 
    description: 'New location ID for the shift',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsUUID()
  @IsOptional()
  locationId?: string;

  @ApiPropertyOptional({ 
    description: 'New shift type',
    enum: ShiftType 
  })
  @IsEnum(ShiftType)
  @IsOptional()
  type?: ShiftType;

  @ApiPropertyOptional({ 
    description: 'New start time (ISO 8601 format)',
    example: '2023-06-01T10:00:00.000Z' 
  })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ 
    description: 'New end time (ISO 8601 format)',
    example: '2023-06-01T18:00:00.000Z' 
  })
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ 
    description: 'Whether the shift is active',
    default: true 
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Additional notes about the shift' 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class BulkCreateShiftsDto {
  @ApiProperty({ 
    description: 'Array of shifts to create',
    type: [CreateShiftDto] 
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateShiftDto)
  shifts: CreateShiftDto[];
}

export class FindShiftsQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filter by staff member ID',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsUUID()
  @IsOptional()
  staffId?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by location ID',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsUUID()
  @IsOptional()
  locationId?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by shift type',
    enum: ShiftType 
  })
  @IsEnum(ShiftType)
  @IsOptional()
  type?: ShiftType;

  @ApiPropertyOptional({ 
    description: 'Start date to filter shifts (inclusive)',
    example: '2023-06-01T00:00:00.000Z' 
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'End date to filter shifts (inclusive)',
    example: '2023-06-30T23:59:59.999Z' 
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Whether to include inactive shifts',
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  includeInactive?: boolean = false;

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
}
