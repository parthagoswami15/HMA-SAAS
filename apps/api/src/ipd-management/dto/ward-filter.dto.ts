import { IsOptional, IsString, IsNumber, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WardFilterDto {
  @ApiProperty({
    description: 'Search term to filter wards (searches in name, code, description)',
    required: false,
    example: 'General or GW'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Filter by ward type',
    required: false,
    example: 'GENERAL',
    enum: ['GENERAL', 'ICU', 'CCU', 'PEDIATRICS', 'MATERNITY', 'SURGICAL', 'ONCOLOGY', 'PSYCHIATRIC', 'ISOLATION', 'OTHER']
  })
  @IsString()
  @IsOptional()
  type?: string;

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
    description: 'Filter by active status',
    required: false,
    default: true
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Filter by bed availability',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  hasAvailableBeds?: boolean = false;

  @ApiProperty({
    description: 'Filter by bed class',
    required: false,
    example: 'GENERAL',
    enum: ['GENERAL', 'PRIVATE', 'DELUXE', 'ICU', 'ISOLATION', 'HDU', 'PEDIATRIC', 'MATERNITY', 'OTHER']
  })
  @IsString()
  @IsOptional()
  bedClass?: string;

  @ApiProperty({
    description: 'Filter by specialty',
    required: false,
    example: 'Cardiology'
  })
  @IsString()
  @IsOptional()
  specialty?: string;

  @ApiProperty({
    description: 'Filter by minimum number of available beds',
    required: false,
    example: 5
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minAvailableBeds?: number;

  @ApiProperty({
    description: 'Filter by maximum number of available beds',
    required: false,
    example: 20
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxAvailableBeds?: number;

  @ApiProperty({
    description: 'Filter by minimum occupancy percentage',
    required: false,
    example: 50,
    minimum: 0,
    maximum: 100
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minOccupancyPercent?: number;

  @ApiProperty({
    description: 'Filter by maximum occupancy percentage',
    required: false,
    example: 90,
    minimum: 0,
    maximum: 100
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxOccupancyPercent?: number;

  @ApiProperty({
    description: 'Include bed details in the response',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  includeBeds?: boolean = false;

  @ApiProperty({
    description: 'Include only available beds',
    required: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  onlyAvailableBeds?: boolean = false;

  @ApiProperty({
    description: 'Sort field',
    required: false,
    enum: ['name', 'code', 'floor', 'type', 'availableBeds', 'occupancyRate'],
    default: 'name'
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'name';

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
  @IsNumber()
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
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by multiple ward types',
    required: false,
    type: [String],
    example: ['GENERAL', 'ICU', 'CCU']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  types?: string[];

  @ApiProperty({
    description: 'Filter by multiple floors',
    required: false,
    type: [Number],
    example: [1, 2, 3]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsOptional()
  floors?: number[];

  @ApiProperty({
    description: 'Filter by multiple specialties',
    required: false,
    type: [String],
    example: ['Cardiology', 'Neurology', 'Orthopedics']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];

  @ApiProperty({
    description: 'Filter by bed features',
    required: false,
    type: [String],
    example: ['Oxygen', 'Monitor', 'Ventilator']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bedFeatures?: string[];

  @ApiProperty({
    description: 'Filter by gender-specific wards',
    required: false,
    enum: ['MALE', 'FEMALE', 'MIXED'],
    example: 'FEMALE'
  })
  @IsString()
  @IsOptional()
  genderSpecific?: 'MALE' | 'FEMALE' | 'MIXED';

  @ApiProperty({
    description: 'Filter by wards that allow specific patient types',
    required: false,
    type: [String],
    example: ['ADULT', 'PEDIATRIC', 'GERIATRIC']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  patientTypes?: string[];
}
