import { ApiProperty } from '@nestjs/swagger';
import { Bed } from '../entities/bed.entity';
import { BedStatus } from '../enums/bed-status.enum';
import { BedClass } from '../enums/bed-class.enum';

export class BedResponseDto {
  @ApiProperty({ description: 'Unique identifier for the bed', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Bed number/identifier', example: 'B-101' })
  bedNumber: string;

  @ApiProperty({ description: 'Name of the bed', example: 'Bed 1' })
  name: string;

  @ApiProperty({ 
    description: 'Current status of the bed',
    enum: BedStatus,
    example: BedStatus.AVAILABLE
  })
  status: BedStatus;

  @ApiProperty({ 
    description: 'Class/type of the bed',
    enum: BedClass,
    example: BedClass.GENERAL
  })
  bedClass: BedClass;

  @ApiProperty({ 
    description: 'Features and equipment available with the bed',
    required: false,
    example: ['Oxygen', 'Suction', 'Monitor']
  })
  features?: string[];

  @ApiProperty({ 
    description: 'Daily tariff for the bed',
    required: false,
    example: 150.50
  })
  dailyRate?: number;

  @ApiProperty({ 
    description: 'Whether the bed is currently occupied',
    default: false
  })
  isOccupied: boolean;

  @ApiProperty({ 
    description: 'ID of the ward this bed belongs to',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  wardId: string;

  @ApiProperty({ 
    description: 'Name of the ward this bed belongs to',
    example: 'General Ward A'
  })
  wardName: string;

  @ApiProperty({ 
    description: 'Additional notes about the bed',
    required: false,
    example: 'Near nursing station, has window view'
  })
  notes?: string;

  @ApiProperty({ 
    description: 'Date when the bed was last cleaned',
    required: false,
    example: '2023-06-15T08:30:00Z'
  })
  lastCleanedAt?: Date;

  @ApiProperty({ 
    description: 'Date when the bed is scheduled for maintenance',
    required: false,
    example: '2023-12-01T00:00:00Z'
  })
  maintenanceScheduledAt?: Date;

  @ApiProperty({ 
    description: 'Custom fields for additional bed information',
    required: false,
    example: {
      isWheelchairAccessible: true,
      hasTv: false,
      view: 'Garden view'
    }
  })
  customFields?: Record<string, any>;

  @ApiProperty({ description: 'Date when the record was created', example: '2023-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the record was last updated', example: '2023-06-15T10:30:00Z' })
  updatedAt: Date;

  constructor(bed: Bed) {
    this.id = bed.id;
    this.bedNumber = bed.bedNumber;
    this.name = bed.name;
    this.status = bed.status;
    this.bedClass = bed.bedClass;
    this.features = bed.features;
    this.dailyRate = bed.dailyRate;
    this.isOccupied = bed.isOccupied;
    this.wardId = bed.wardId;
    this.wardName = bed.ward?.name || '';
    this.notes = bed.notes;
    this.lastCleanedAt = bed.lastCleanedAt;
    this.maintenanceScheduledAt = bed.maintenanceScheduledAt;
    this.customFields = bed.customFields;
    this.createdAt = bed.createdAt;
    this.updatedAt = bed.updatedAt;
  }

  // Static method to transform an array of beds
  static fromBeds(beds: Bed[]): BedResponseDto[] {
    return beds.map(bed => new BedResponseDto(bed));
  }
}
