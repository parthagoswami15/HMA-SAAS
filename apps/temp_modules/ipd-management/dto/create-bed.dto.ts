import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BedClass, BedStatus } from '../enums';

export class CreateBedDto {
  @ApiProperty({ 
    description: 'Bed number/identifier', 
    example: 'B-101',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  bedNumber: string;

  @ApiProperty({ 
    description: 'Name of the bed', 
    example: 'Bed 1',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'ID of the ward this bed belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  wardId: string;

  @ApiProperty({ 
    description: 'Class/type of the bed',
    enum: BedClass,
    example: BedClass.GENERAL,
    required: true
  })
  @IsEnum(BedClass)
  @IsNotEmpty()
  bedClass: BedClass;

  @ApiProperty({ 
    description: 'Initial status of the bed',
    enum: BedStatus,
    example: BedStatus.AVAILABLE,
    default: BedStatus.AVAILABLE,
    required: false
  })
  @IsEnum(BedStatus)
  @IsOptional()
  status?: BedStatus = BedStatus.AVAILABLE;

  @ApiProperty({ 
    description: 'Features and equipment available with the bed',
    required: false,
    example: ['Oxygen', 'Suction', 'Monitor'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiProperty({ 
    description: 'Daily tariff for the bed',
    required: false,
    example: 150.50,
    type: Number
  })
  @IsNumber()
  @IsOptional()
  dailyRate?: number;

  @ApiProperty({ 
    description: 'Additional notes about the bed',
    required: false,
    example: 'Near nursing station, has window view'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ 
    description: 'Whether the bed is currently active',
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ 
    description: 'Date when the bed was last cleaned',
    required: false,
    type: Date,
    example: '2023-06-15T08:30:00Z'
  })
  @IsOptional()
  lastCleanedAt?: Date;

  @ApiProperty({ 
    description: 'Date when the bed is scheduled for maintenance',
    required: false,
    type: Date,
    example: '2023-12-01T00:00:00Z'
  })
  @IsOptional()
  maintenanceScheduledAt?: Date;

  @ApiProperty({ 
    description: 'Reason for bed maintenance',
    required: false,
    example: 'Routine maintenance and equipment check'
  })
  @IsString()
  @IsOptional()
  maintenanceReason?: string;

  @ApiProperty({ 
    description: 'Custom fields for additional bed information',
    required: false,
    example: {
      isWheelchairAccessible: true,
      hasTv: false,
      view: 'Garden view',
      lastDeepCleaned: '2023-05-01T00:00:00Z'
    }
  })
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiProperty({ 
    description: 'ID of the staff member creating this bed record',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  @IsOptional()
  createdById?: string;
}
