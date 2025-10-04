import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsUUID,
  IsDateString,
  IsNumber,
  Min,
  Max,
  IsInt,
  IsEnum,
  IsArray,
  ValidateNested,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PerformanceMetricType {
  PATIENT_VISITS = 'PATIENT_VISITS',
  PROCEDURES = 'PROCEDURES',
  REVENUE = 'REVENUE',
  PATIENT_SATISFACTION = 'PATIENT_SATISFACTION',
  DOCUMENTATION_COMPLETENESS = 'DOCUMENTATION_COMPLETENESS',
  ON_TIME_ARRIVAL = 'ON_TIME_ARRIVAL',
  PRODUCTIVITY = 'PRODUCTIVITY',
  QUALITY = 'QUALITY',
  EFFICIENCY = 'EFFICIENCY',
  CUSTOM = 'CUSTOM'
}

export enum PerformanceTimeframe {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM'
}

export class PerformanceMetricDto {
  @ApiProperty({ 
    description: 'Type of performance metric',
    enum: PerformanceMetricType
  })
  @IsEnum(PerformanceMetricType)
  @IsNotEmpty()
  type: PerformanceMetricType;

  @ApiProperty({ 
    description: 'Name of the metric',
    example: 'Patient Satisfaction Score'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Value of the metric',
    example: 95.5
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  value: number;

  @ApiPropertyOptional({ 
    description: 'Target value for this metric',
    example: 90
  })
  @IsNumber()
  @IsOptional()
  target?: number;

  @ApiPropertyOptional({ 
    description: 'Unit of measurement',
    example: '%',
    default: '%'
  })
  @IsString()
  @IsOptional()
  unit?: string = '%';

  @ApiPropertyOptional({ 
    description: 'Whether this is a positive metric (higher is better)',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isPositive?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Additional metadata about the metric'
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class StaffPerformanceDto {
  @ApiProperty({ 
    description: 'Staff member ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ 
    description: 'Staff member name',
    example: 'Dr. John Doe'
  })
  @IsString()
  @IsNotEmpty()
  staffName: string;

  @ApiProperty({ 
    description: 'Department name',
    example: 'Cardiology'
  })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ 
    description: 'Job title/designation',
    example: 'Senior Cardiologist'
  })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiProperty({ 
    description: 'Performance metrics',
    type: [PerformanceMetricDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerformanceMetricDto)
  metrics: PerformanceMetricDto[];

  @ApiProperty({ 
    description: 'Overall performance score (0-100)',
    example: 88.5
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore: number;

  @ApiProperty({ 
    description: 'Performance rating (1-5)',
    example: 4.5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ 
    description: 'Start date of the evaluation period',
    example: '2023-01-01'
  })
  @IsDateString()
  periodStart: string;

  @ApiProperty({ 
    description: 'End date of the evaluation period',
    example: '2023-12-31'
  })
  @IsDateString()
  periodEnd: string;

  @ApiPropertyOptional({ 
    description: 'Date when the evaluation was performed',
    default: 'Current date'
  })
  @IsDateString()
  @IsOptional()
  evaluatedAt?: string;

  @ApiPropertyOptional({ 
    description: 'ID of the evaluator',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsUUID()
  @IsOptional()
  evaluatedById?: string;

  @ApiPropertyOptional({ 
    description: 'Name of the evaluator',
    example: 'Dr. Sarah Johnson'
  })
  @IsString()
  @IsOptional()
  evaluatedByName?: string;

  @ApiPropertyOptional({ 
    description: 'Additional comments about the performance evaluation'
  })
  @IsString()
  @IsOptional()
  comments?: string;
}

export class PerformanceQueryDto {
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
    description: 'Filter by performance metric type',
    enum: PerformanceMetricType
  })
  @IsEnum(PerformanceMetricType)
  @IsOptional()
  metricType?: PerformanceMetricType;

  @ApiPropertyOptional({ 
    description: 'Filter by minimum rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 4
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  minRating?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by maximum rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  maxRating?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by start date (inclusive)',
    example: '2023-01-01'
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by end date (inclusive)',
    example: '2023-12-31'
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Timeframe for grouping results',
    enum: PerformanceTimeframe,
    default: PerformanceTimeframe.MONTHLY
  })
  @IsEnum(PerformanceTimeframe)
  @IsOptional()
  timeframe?: PerformanceTimeframe = PerformanceTimeframe.MONTHLY;

  @ApiPropertyOptional({ 
    description: 'Whether to include detailed metrics',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  includeDetails?: boolean = false;

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

export class PerformanceGoalDto {
  @ApiProperty({ 
    description: 'Title of the performance goal',
    example: 'Increase patient satisfaction score'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: 'Description of the goal',
    example: 'Achieve a patient satisfaction score of 95% or higher'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    description: 'Target metric type',
    enum: PerformanceMetricType
  })
  @IsEnum(PerformanceMetricType)
  @IsNotEmpty()
  metricType: PerformanceMetricType;

  @ApiProperty({ 
    description: 'Target value to achieve',
    example: 95
  })
  @IsNumber()
  @Min(0)
  targetValue: number;

  @ApiProperty({ 
    description: 'Current value of the metric',
    example: 88
  })
  @IsNumber()
  @Min(0)
  currentValue: number;

  @ApiProperty({ 
    description: 'Start date of the goal period',
    example: '2023-01-01'
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ 
    description: 'Target completion date',
    example: '2023-12-31'
  })
  @IsDateString()
  @IsNotEmpty()
  targetDate: string;

  @ApiPropertyOptional({ 
    description: 'Actual completion date',
    example: '2023-12-15'
  })
  @IsDateString()
  @IsOptional()
  completedDate?: string;

  @ApiProperty({ 
    description: 'Progress percentage (0-100)',
    example: 75.5,
    default: 0
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number = 0;

  @ApiProperty({ 
    description: 'Priority level (1-5, with 5 being highest)', 
    example: 3,
    minimum: 1,
    maximum: 5
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  priority?: number = 3;

  @ApiPropertyOptional({ 
    description: 'Whether the goal is currently active',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Additional notes about the goal'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ 
    description: 'Tags for categorization',
    example: ['patient-satisfaction', 'quality-care']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];
}
