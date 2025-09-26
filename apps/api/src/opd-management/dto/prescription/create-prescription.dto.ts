import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsNumber, 
  IsBoolean, 
  IsDateString,
  IsEnum,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';

export enum FrequencyUnit {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  AS_NEEDED = 'AS_NEEDED'
}

export enum DurationUnit {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  INDEFINITE = 'INDEFINITE'
}

export enum PrescriptionItemType {
  MEDICATION = 'MEDICATION',
  LAB_TEST = 'LAB_TEST',
  IMAGING = 'IMAGING',
  PROCEDURE = 'PROCEDURE',
  DIET = 'DIET',
  OTHER = 'OTHER'
}

class DosageInstructionDto {
  @ApiProperty({ description: 'Dose quantity (e.g., 1, 2.5)' })
  @IsNumber()
  @Min(0.1)
  dose: number;

  @ApiProperty({ description: 'Dose unit (e.g., mg, ml, tablet)' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ 
    enum: FrequencyUnit, 
    description: 'Frequency unit for administration' 
  })
  @IsEnum(FrequencyUnit)
  frequency: FrequencyUnit;

  @ApiProperty({ 
    description: 'Number of times per frequency unit (e.g., 3 times per day)',
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  frequencyCount: number;

  @ApiProperty({ 
    description: 'Route of administration (e.g., oral, IV, topical)'
  })
  @IsString()
  @IsNotEmpty()
  route: string;

  @ApiProperty({ 
    description: 'Specific timing instructions (e.g., before meals, at bedtime)',
    required: false
  })
  @IsString()
  @IsOptional()
  timing?: string;

  @ApiProperty({ 
    description: 'Additional instructions for administration',
    required: false
  })
  @IsString()
  @IsOptional()
  instructions?: string;
}

export class PrescriptionItemDto {
  @ApiProperty({ description: 'ID of the medication, test, or procedure' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Name of the medication, test, or procedure' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({ 
    enum: PrescriptionItemType, 
    description: 'Type of prescription item' 
  })
  @IsEnum(PrescriptionItemType)
  itemType: PrescriptionItemType;

  @ApiProperty({ type: DosageInstructionDto, description: 'Dosage instructions' })
  @ValidateNested()
  @Type(() => DosageInstructionDto)
  dosage: DosageInstructionDto;

  @ApiProperty({ 
    description: 'Duration value (e.g., 7 for 7 days)',
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  durationValue: number;

  @ApiProperty({ 
    enum: DurationUnit, 
    description: 'Duration unit' 
  })
  @IsEnum(DurationUnit)
  durationUnit: DurationUnit;

  @ApiProperty({ 
    description: 'Total quantity to dispense',
    minimum: 1,
    required: false
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ 
    description: 'Unit of the quantity (e.g., tablets, ml, mg)',
    required: false
  })
  @IsString()
  @IsOptional()
  quantityUnit?: string;

  @ApiProperty({ 
    description: 'Date when the prescription becomes active',
    type: Date,
    required: false
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ 
    description: 'Additional notes about the prescription',
    required: false
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ 
    description: 'Whether to use generic substitution if available',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowGeneric?: boolean;

  @ApiProperty({ 
    description: 'Whether this is a refill of a previous prescription',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isRefill?: boolean;

  @ApiProperty({ 
    description: 'Number of refills allowed',
    minimum: 0,
    default: 0
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  refillsAllowed?: number;
}

export class CreatePrescriptionDto {
  @ApiProperty({ description: 'Visit ID this prescription is associated with' })
  @IsString()
  @IsNotEmpty()
  visitId: string;

  @ApiProperty({ description: 'Provider (staff) ID who prescribed this' })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ 
    type: [PrescriptionItemDto], 
    description: 'List of prescribed items' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];

  @ApiProperty({ 
    description: 'Additional notes about the prescription',
    required: false
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ 
    description: 'Date when the prescription was issued',
    type: Date,
    default: () => new Date().toISOString()
  })
  @IsDateString()
  @IsOptional()
  datePrescribed?: Date;
}
