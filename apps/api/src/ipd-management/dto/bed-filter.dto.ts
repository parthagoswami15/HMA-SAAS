import { IsOptional, IsString, IsEnum, IsBoolean, IsUUID, IsNumber, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BedStatus, BedClass } from '../enums';

export class BedFilterDto {
  @ApiProperty({
    description: 'Search term to filter beds (searches in bed number, name, ward name)',
    required: false,
    example: 'B-101 or Ward A'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Filter by bed status',
    enum: BedStatus,
    required: false,
    example: BedStatus.AVAILABLE
  })
  @IsEnum(BedStatus)
  @IsOptional()
  status?: BedStatus;

  @ApiProperty({
    description: 'Filter by bed class',
    enum: BedClass,
    required: false,
    example: BedClass.GENERAL
  })
  @IsEnum(BedClass)
  @IsOptional()
  bedClass?: BedClass;

  @ApiProperty({
    description: 'Filter by ward ID',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsOptional()
  wardId?: string;

  @ApiProperty({
    description: 'Filter by ward name',
    required: false,
    example: 'General Ward A'
  })
  @IsString()
  @IsOptional()
  wardName?: string;

  @ApiProperty({
    description: 'Filter by floor number',
    required: false,
    example: 2
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  floor?: number;

  @ApiProperty({
    description: 'Filter by bed features',
    required: false,
    example: ['Oxygen', 'Monitor'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiProperty({
    description: 'Filter by minimum daily rate',
    required: false,
    example: 100
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  minDailyRate?: number;

  @ApiProperty({
    description: 'Filter by maximum daily rate',
    required: false,
    example: 500
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  maxDailyRate?: number;

  @ApiProperty({
    description: 'Filter by bed availability',
    required: false,
    default: true
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Filter by active status',
    required: false,
    default: true
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Filter by maintenance status',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  needsMaintenance?: boolean = false;

  @ApiProperty({
    description: 'Filter by cleaning status',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  needsCleaning?: boolean = false;

  @ApiProperty({
    description: 'Include related ward information',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  includeWard?: boolean = false;

  @ApiProperty({
    description: 'Include current admission information',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  includeAdmission?: boolean = false;

  @ApiProperty({
    description: 'Sort field',
    required: false,
    enum: ['bedNumber', 'name', 'wardName', 'status', 'bedClass', 'dailyRate', 'lastCleanedAt'],
    default: 'bedNumber'
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'bedNumber';

  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'ASC'
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by multiple bed statuses',
    required: false,
    enum: BedStatus,
    isArray: true,
    example: [BedStatus.AVAILABLE, BedStatus.OCCUPIED]
  })
  @IsArray()
  @IsEnum(BedStatus, { each: true })
  @IsOptional()
  statuses?: BedStatus[];

  @ApiProperty({
    description: 'Filter by multiple bed classes',
    required: false,
    enum: BedClass,
    isArray: true,
    example: [BedClass.GENERAL, BedClass.PRIVATE]
  })
  @IsArray()
  @IsEnum(BedClass, { each: true })
  @IsOptional()
  bedClasses?: BedClass[];

  @ApiProperty({
    description: 'Filter by multiple ward IDs',
    required: false,
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001']
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  wardIds?: string[];
}
