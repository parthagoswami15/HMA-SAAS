import { IsString, IsOptional, IsBoolean, IsNumber, IsDate, IsEnum, IsObject, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TestCategory {
  HEMATOLOGY = 'HEMATOLOGY',
  CHEMISTRY = 'CHEMISTRY',
  MICROBIOLOGY = 'MICROBIOLOGY',
  IMMUNOLOGY = 'IMMUNOLOGY',
  SEROLOGY = 'SEROLOGY',
  TOXICOLOGY = 'TOXICOLOGY',
  URINALYSIS = 'URINALYSIS',
  COAGULATION = 'COAGULATION',
  ENDOCRINOLOGY = 'ENDOCRINOLOGY',
  GENETICS = 'GENETICS',
}

export enum TestPriority {
  STAT = 'STAT',
  URGENT = 'URGENT',
  ROUTINE = 'ROUTINE',
}

export enum SampleType {
  BLOOD = 'BLOOD',
  URINE = 'URINE',
  SPUTUM = 'SPUTUM',
  STOOL = 'STOOL',
  CSF = 'CSF',
  TISSUE = 'TISSUE',
  SWAB = 'SWAB',
  FLUID = 'FLUID',
}

export enum ContainerType {
  RED_TOP = 'RED_TOP',
  PURPLE_TOP = 'PURPLE_TOP',
  BLUE_TOP = 'BLUE_TOP',
  GREEN_TOP = 'GREEN_TOP',
  GREY_TOP = 'GREY_TOP',
  YELLOW_TOP = 'YELLOW_TOP',
  VACUTAINER = 'VACUTAINER',
  TUBE = 'TUBE',
  BOTTLE = 'BOTTLE',
}

export enum TestStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEPRECATED = 'DEPRECATED',
}

export class ReferenceRangeDto {
  @ApiProperty()
  @IsString()
  ageGroup: string;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsNumber()
  low: number;

  @ApiProperty()
  @IsNumber()
  high: number;

  @ApiPropertyOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional()
  @IsString()
  condition?: string;
}

export class CreateLabTestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: TestCategory })
  @IsEnum(TestCategory)
  category: TestCategory;

  @ApiPropertyOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional()
  @IsString()
  section?: string;

  @ApiPropertyOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsNumber()
  tatHours?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  requiresValidation?: boolean;

  @ApiPropertyOptional()
  @IsString()
  method?: string;

  @ApiPropertyOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional()
  @IsArray()
  sampleTypes?: SampleType[];

  @ApiPropertyOptional()
  @IsArray()
  containerTypes?: ContainerType[];

  @ApiPropertyOptional()
  @IsArray()
  referenceRanges?: ReferenceRangeDto[];

  @ApiPropertyOptional()
  @IsObject()
  analyzerSettings?: Record<string, any>;

  @ApiPropertyOptional()
  @IsObject()
  qcSettings?: Record<string, any>;
}

export class UpdateLabTestDto extends CreateLabTestDto {
  @ApiPropertyOptional({ enum: TestStatus })
  @IsOptional()
  @IsEnum(TestStatus)
  status?: TestStatus;
}

export class LabTestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: TestCategory })
  category: TestCategory;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  section?: string;

  @ApiPropertyOptional()
  price?: number;

  @ApiPropertyOptional()
  tatHours?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  requiresValidation?: boolean;

  @ApiPropertyOptional()
  method?: string;

  @ApiPropertyOptional()
  unit?: string;

  @ApiPropertyOptional()
  sampleTypes?: SampleType[];

  @ApiPropertyOptional()
  containerTypes?: ContainerType[];

  @ApiPropertyOptional()
  referenceRanges?: ReferenceRangeDto[];

  @ApiPropertyOptional()
  analyzerSettings?: Record<string, any>;

  @ApiPropertyOptional()
  qcSettings?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
