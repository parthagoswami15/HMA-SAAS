import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TestPriority {
  STAT = 'STAT',
  URGENT = 'URGENT',
  ROUTINE = 'ROUTINE',
}

export enum TATStatus {
  ON_TIME = 'ON_TIME',
  WARNING = 'WARNING',
  OVERDUE = 'OVERDUE',
}

export class TATConfigDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  testId: string;

  @ApiProperty({ enum: TestPriority })
  priority: TestPriority;

  @ApiProperty()
  targetMinutes: number;

  @ApiProperty()
  warningMinutes: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class TATMetricsDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  testId: string;

  @ApiProperty()
  testName: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  orderedAt: Date;

  @ApiPropertyOptional()
  collectedAt?: Date;

  @ApiPropertyOptional()
  receivedAt?: Date;

  @ApiPropertyOptional()
  resultedAt?: Date;

  @ApiPropertyOptional()
  verifiedAt?: Date;

  @ApiPropertyOptional()
  publishedAt?: Date;

  @ApiProperty()
  tatMinutes: number;

  @ApiProperty()
  isWithinTarget: boolean;

  @ApiProperty()
  isOverdue: boolean;

  @ApiProperty({ enum: TATStatus })
  status: TATStatus;
}

export class CreateTATConfigDto {
  @ApiProperty()
  @IsString()
  testId: string;

  @ApiProperty({ enum: TestPriority })
  @IsEnum(TestPriority)
  priority: TestPriority;

  @ApiProperty()
  @IsNumber()
  targetMinutes: number;

  @ApiProperty()
  @IsNumber()
  warningMinutes: number;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

export class UpdateTATConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  targetMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  warningMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class TATPerformanceDto {
  @ApiProperty()
  summary: {
    totalTests: number;
    onTimeTests: number;
    warningTests: number;
    overdueTests: number;
    onTimePercentage: number;
    averageTAT: number;
    medianTAT: number;
  };

  @ApiProperty()
  priorityBreakdown: {
    STAT: any;
    URGENT: any;
    ROUTINE: any;
  };
}

export class SLAViolationDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  testId: string;

  @ApiProperty()
  testName: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  targetMinutes: number;

  @ApiProperty()
  actualMinutes: number;

  @ApiProperty()
  minutesOverdue: number;

  @ApiProperty()
  orderedAt: Date;

  @ApiProperty()
  resultedAt: Date;
}

export class STATOrderAlertDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  patientName: string;

  @ApiProperty()
  testName: string;

  @ApiProperty()
  minutesOverdue: number;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  orderedAt: Date;
}
