import { IsString, IsOptional, IsNumber, IsEnum, IsDate, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ResultFlag {
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  ABNORMAL = 'ABNORMAL',
  PENDING = 'PENDING',
  INVALID = 'INVALID',
}

export enum ValidationStatus {
  PENDING = 'PENDING',
  TECH_REVIEWED = 'TECH_REVIEWED',
  PATH_REVIEWED = 'PATH_REVIEWED',
  FINAL = 'FINAL',
  AMENDED = 'AMENDED',
}

export class CreateLabResultDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  testId: string;

  @ApiProperty()
  @IsString()
  analyte: string;

  @ApiPropertyOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional()
  @IsString()
  textValue?: string;

  @ApiPropertyOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ enum: ResultFlag })
  @IsEnum(ResultFlag)
  flag?: ResultFlag;

  @ApiPropertyOptional()
  @IsNumber()
  referenceLow?: number;

  @ApiPropertyOptional()
  @IsNumber()
  referenceHigh?: number;

  @ApiPropertyOptional()
  @IsString()
  instrument?: string;

  @ApiPropertyOptional()
  @IsDate()
  resultDateTime?: Date;

  @ApiPropertyOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsString()
  method?: string;
}

export class UpdateLabResultDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  textValue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ResultFlag)
  flag?: ResultFlag;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  referenceLow?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  referenceHigh?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instrument?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  resultDateTime?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  method?: string;
}

export class LabResultResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  testId: string;

  @ApiProperty()
  analyte: string;

  @ApiPropertyOptional()
  value?: number;

  @ApiPropertyOptional()
  textValue?: string;

  @ApiPropertyOptional()
  unit?: string;

  @ApiProperty({ enum: ResultFlag })
  flag: ResultFlag;

  @ApiPropertyOptional()
  referenceLow?: number;

  @ApiPropertyOptional()
  referenceHigh?: number;

  @ApiPropertyOptional()
  instrument?: string;

  @ApiPropertyOptional()
  resultDateTime?: Date;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  method?: string;

  @ApiProperty({ enum: ValidationStatus })
  validationStatus: ValidationStatus;

  @ApiPropertyOptional()
  validatedBy?: string;

  @ApiPropertyOptional()
  validatedAt?: Date;

  @ApiPropertyOptional()
  reviewedBy?: string;

  @ApiPropertyOptional()
  reviewedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
