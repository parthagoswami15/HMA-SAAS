import { IsString, IsOptional, IsNumber, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeltaCheckConfigDto {
  @ApiProperty()
  analyte: string;

  @ApiProperty()
  threshold: number;

  @ApiProperty()
  timeWindowDays: number;

  @ApiProperty()
  enabled: boolean;
}

export class DeltaCheckDto {
  @ApiProperty()
  analyte: string;

  @ApiProperty()
  currentValue: number;

  @ApiProperty()
  previousValue: number;

  @ApiProperty()
  delta: number;

  @ApiProperty()
  deltaPercentage: number;

  @ApiProperty()
  threshold: number;

  @ApiProperty()
  isSignificant: boolean;

  @ApiProperty()
  previousDate: Date;

  @ApiProperty()
  currentDate: Date;
}

export class CreateDeltaCheckConfigDto {
  @ApiProperty()
  @IsString()
  analyte: string;

  @ApiProperty()
  @IsNumber()
  threshold: number;

  @ApiProperty()
  @IsNumber()
  timeWindowDays: number;

  @ApiProperty()
  @IsBoolean()
  enabled: boolean;
}

export class UpdateDeltaCheckConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  threshold?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  timeWindowDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class DeltaCheckAlertDto {
  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty()
  @IsString()
  analyte: string;

  @ApiProperty()
  currentValue: number;

  @ApiProperty()
  previousValue: number;

  @ApiProperty()
  deltaPercentage: number;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiPropertyOptional()
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';

  @ApiPropertyOptional()
  orderId?: string;
}

export class DeltaCheckHistoryDto {
  @ApiProperty()
  patientId: string;

  @ApiProperty()
  analyte: string;

  @ApiProperty()
  results: Array<{
    value: number;
    date: Date;
    orderId: string;
  }>;

  @ApiProperty()
  significantChanges: DeltaCheckDto[];
}
