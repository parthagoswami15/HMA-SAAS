import { IsString, IsOptional, IsEnum, IsDate, IsObject, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestPriority } from './lab-test.dto';

export enum OrderStatus {
  PENDING = 'PENDING',
  ORDERED = 'ORDERED',
  COLLECTED = 'COLLECTED',
  ACCESSIONED = 'ACCESSIONED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VALIDATED = 'VALIDATED',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}

export enum SampleStatus {
  PENDING = 'PENDING',
  COLLECTED = 'COLLECTED',
  RECEIVED = 'RECEIVED',
  PROCESSED = 'PROCESSED',
  STORED = 'STORED',
  DISPOSED = 'DISPOSED',
}

export class CreateLabOrderDto {
  @ApiProperty()
  @IsString()
  visitId: string;

  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiPropertyOptional()
  @IsString()
  panelId?: string;

  @ApiProperty()
  @IsArray()
  testIds: string[];

  @ApiPropertyOptional({ enum: TestPriority })
  @IsEnum(TestPriority)
  priority?: TestPriority;

  @ApiPropertyOptional()
  @IsString()
  orderingPhysician?: string;

  @ApiPropertyOptional()
  @IsString()
  clinicalNotes?: string;

  @ApiPropertyOptional()
  @IsDate()
  requiredDateTime?: Date;

  @ApiPropertyOptional()
  @IsBoolean()
  isStat?: boolean;

  @ApiPropertyOptional()
  @IsString()
  diagnosis?: string;
}

export class UpdateLabOrderDto {
  @ApiPropertyOptional({ enum: TestPriority })
  @IsOptional()
  @IsEnum(TestPriority)
  priority?: TestPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderingPhysician?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  requiredDateTime?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isStat?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;
}

export class LabOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  visitId: string;

  @ApiProperty()
  patientId: string;

  @ApiPropertyOptional()
  panelId?: string;

  @ApiProperty()
  testIds: string[];

  @ApiPropertyOptional()
  testNames?: string[];

  @ApiPropertyOptional()
  panelName?: string;

  @ApiProperty({ enum: TestPriority })
  priority: TestPriority;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiPropertyOptional()
  orderingPhysician?: string;

  @ApiPropertyOptional()
  clinicalNotes?: string;

  @ApiPropertyOptional()
  requiredDateTime?: Date;

  @ApiProperty()
  isStat: boolean;

  @ApiPropertyOptional()
  diagnosis?: string;

  @ApiPropertyOptional()
  barcode?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  samples?: any[];

  @ApiPropertyOptional()
  results?: any[];
}

export class SampleDto {
  @ApiProperty()
  @IsString()
  sampleType: string;

  @ApiProperty()
  @IsString()
  containerType: string;

  @ApiPropertyOptional()
  @IsNumber()
  volume?: number;

  @ApiPropertyOptional()
  @IsString()
  collectionNotes?: string;

  @ApiPropertyOptional()
  @IsDate()
  collectedAt?: Date;

  @ApiPropertyOptional()
  @IsDate()
  stabilityExpiresAt?: Date;
}

export class CreateSampleDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  sampleType: string;

  @ApiProperty()
  @IsString()
  containerType: string;

  @ApiPropertyOptional()
  @IsNumber()
  volume?: number;

  @ApiPropertyOptional()
  @IsString()
  collectionNotes?: string;

  @ApiPropertyOptional()
  @IsDate()
  collectedAt?: Date;

  @ApiPropertyOptional()
  @IsDate()
  stabilityExpiresAt?: Date;
}

export class SampleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  sampleType: string;

  @ApiProperty()
  containerType: string;

  @ApiPropertyOptional()
  volume?: number;

  @ApiPropertyOptional()
  collectionNotes?: string;

  @ApiPropertyOptional()
  collectedAt?: Date;

  @ApiPropertyOptional()
  stabilityExpiresAt?: Date;

  @ApiProperty({ enum: SampleStatus })
  status: SampleStatus;

  @ApiPropertyOptional()
  barcode?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
