import { IsString, IsOptional, IsNumber, IsBoolean, IsDate, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AlertLevel {
  CRITICAL = 'CRITICAL',
  PANIC = 'PANIC',
}

export class PanicThresholdDto {
  @ApiProperty()
  analyte: string;

  @ApiPropertyOptional()
  criticalLow?: number;

  @ApiPropertyOptional()
  criticalHigh?: number;

  @ApiPropertyOptional()
  panicLow?: number;

  @ApiPropertyOptional()
  panicHigh?: number;

  @ApiProperty()
  unit: string;
}

export class PanicAlertDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  analyte: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  flag: string;

  @ApiPropertyOptional()
  referenceLow?: number;

  @ApiPropertyOptional()
  referenceHigh?: number;

  @ApiProperty({ enum: AlertLevel })
  alertLevel: AlertLevel;

  @ApiProperty()
  message: string;

  @ApiProperty()
  acknowledged: boolean;

  @ApiPropertyOptional()
  acknowledgedBy?: string;

  @ApiPropertyOptional()
  acknowledgedAt?: Date;

  @ApiProperty()
  notifiedUsers: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreatePanicAlertDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty()
  @IsString()
  analyte: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsString()
  flag: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  referenceLow?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  referenceHigh?: number;

  @ApiProperty({ enum: AlertLevel })
  @IsEnum(AlertLevel)
  alertLevel: AlertLevel;

  @ApiProperty()
  @IsString()
  message: string;
}

export class AcknowledgePanicAlertDto {
  @ApiProperty()
  @IsString()
  acknowledgedBy: string;
}

export class PanicAlertStatisticsDto {
  @ApiProperty()
  totalAlerts: number;

  @ApiProperty()
  acknowledgedAlerts: number;

  @ApiProperty()
  pendingAlerts: number;

  @ApiProperty()
  panicLevelAlerts: number;

  @ApiProperty()
  acknowledgmentRate: number;
}

export class UpdatePanicThresholdDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  criticalLow?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  criticalHigh?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  panicLow?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  panicHigh?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;
}
