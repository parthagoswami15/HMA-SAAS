import { IsString, IsOptional, IsEnum, IsBoolean, IsObject, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AnalyzerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  ERROR = 'ERROR',
}

export enum AnalyzerType {
  CHEMISTRY = 'CHEMISTRY',
  HEMATOLOGY = 'HEMATOLOGY',
  IMMUNOASSAY = 'IMMUNOASSAY',
  COAGULATION = 'COAGULATION',
  URINALYSIS = 'URINALYSIS',
  MICROBIOLOGY = 'MICROBIOLOGY',
}

export enum Direction {
  UNIDIRECTIONAL = 'UNIDIRECTIONAL',
  BIDIRECTIONAL = 'BIDIRECTIONAL',
}

export class CreateAnalyzerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty({ enum: AnalyzerType })
  @IsEnum(AnalyzerType)
  type: AnalyzerType;

  @ApiProperty()
  @IsString()
  serialNumber: string;

  @ApiProperty()
  @IsString()
  ipAddress: string;

  @ApiPropertyOptional()
  @IsNumber()
  port?: number;

  @ApiPropertyOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: Direction })
  @IsEnum(Direction)
  direction?: Direction;

  @ApiPropertyOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsObject()
  configuration?: Record<string, any>;

  @ApiPropertyOptional()
  @IsObject()
  supportedTests?: Record<string, any>;
}

export class UpdateAnalyzerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  port?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(AnalyzerStatus)
  status?: AnalyzerStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  configuration?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  supportedTests?: Record<string, any>;
}

export class AnalyzerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  model: string;

  @ApiProperty({ enum: AnalyzerType })
  type: AnalyzerType;

  @ApiProperty()
  serialNumber: string;

  @ApiProperty()
  ipAddress: string;

  @ApiPropertyOptional()
  port?: number;

  @ApiPropertyOptional()
  location?: string;

  @ApiProperty({ enum: Direction })
  direction: Direction;

  @ApiProperty({ enum: AnalyzerStatus })
  status: AnalyzerStatus;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  configuration?: Record<string, any>;

  @ApiPropertyOptional()
  supportedTests?: Record<string, any>;

  @ApiPropertyOptional()
  lastCommunication?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class QcBatchDto {
  @ApiProperty()
  @IsString()
  analyte: string;

  @ApiProperty()
  @IsString()
  lotNumber: string;

  @ApiPropertyOptional()
  @IsNumber()
  targetValue?: number;

  @ApiPropertyOptional()
  @IsNumber()
  targetSd?: number;

  @ApiPropertyOptional()
  @IsNumber()
  targetCv?: number;

  @ApiPropertyOptional()
  @IsDate()
  expiryDate?: Date;

  @ApiPropertyOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional()
  @IsObject()
  statistics?: Record<string, any>;
}

export class CreateQcRunDto {
  @ApiProperty()
  @IsString()
  analyzerId: string;

  @ApiProperty()
  @IsArray()
  qcBatches: QcBatchDto[];

  @ApiPropertyOptional()
  @IsString()
  operator?: string;

  @ApiPropertyOptional()
  @IsDate()
  runDateTime?: Date;

  @ApiPropertyOptional()
  @IsString()
  notes?: string;
}

export class QcResultDto {
  @ApiProperty()
  @IsString()
  analyte: string;

  @ApiProperty()
  @IsString()
  lotNumber: string;

  @ApiProperty()
  @IsNumber()
  measuredValue: number;

  @ApiPropertyOptional()
  @IsNumber()
  expectedValue?: number;

  @ApiPropertyOptional()
  @IsNumber()
  deviation?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  withinRange?: boolean;

  @ApiPropertyOptional()
  @IsString()
  flag?: string;
}

export class QcRunResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  analyzerId: string;

  @ApiProperty()
  qcBatches: QcBatchDto[];

  @ApiProperty()
  qcResults: QcResultDto[];

  @ApiPropertyOptional()
  operator?: string;

  @ApiPropertyOptional()
  runDateTime?: Date;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  isPassed: boolean;

  @ApiPropertyOptional()
  westgardRules?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
