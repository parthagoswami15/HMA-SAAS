import { PartialType } from '@nestjs/swagger';
import { CreateBedDto } from './create-bed.dto';
import { IsOptional, IsEnum, IsBoolean, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BedStatus } from '../enums';

export class UpdateBedDto extends PartialType(CreateBedDto) {
  @ApiProperty({ 
    description: 'New status of the bed',
    enum: BedStatus,
    required: false,
    example: BedStatus.MAINTENANCE
  })
  @IsEnum(BedStatus)
  @IsOptional()
  status?: BedStatus;

  @ApiProperty({ 
    description: 'Whether to mark the bed as cleaned',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  markAsCleaned?: boolean = false;

  @ApiProperty({ 
    description: 'Whether to mark the bed as available',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  markAsAvailable?: boolean = false;

  @ApiProperty({ 
    description: 'Whether to mark the bed as under maintenance',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  markForMaintenance?: boolean = false;

  @ApiProperty({ 
    description: 'Reason for maintenance',
    required: false,
    example: 'Routine maintenance and equipment check'
  })
  @IsString()
  @IsOptional()
  maintenanceReason?: string;

  @ApiProperty({ 
    description: 'Scheduled date for maintenance',
    required: false,
    type: Date,
    example: '2023-12-01T00:00:00Z'
  })
  @IsOptional()
  maintenanceScheduledAt?: Date;

  @ApiProperty({ 
    description: 'ID of the ward to transfer this bed to',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsUUID()
  @IsOptional()
  transferToWardId?: string;

  @ApiProperty({ 
    description: 'Reason for the update',
    required: false,
    example: 'Routine status update after patient discharge'
  })
  @IsString()
  @IsOptional()
  updateReason?: string;

  @ApiProperty({ 
    description: 'ID of the staff member performing the update',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174003'
  })
  @IsUUID()
  @IsOptional()
  updatedById?: string;

  @ApiProperty({ 
    description: 'Whether to update the bed class and related properties',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  updateBedClass?: boolean = false;

  @ApiProperty({ 
    description: 'Whether to update the bed features',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  updateFeatures?: boolean = false;

  @ApiProperty({ 
    description: 'Whether to update the bed rate',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  updateRate?: boolean = false;

  @ApiProperty({ 
    description: 'Whether to update the bed status',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  updateStatus?: boolean = false;

  @ApiProperty({ 
    description: 'Whether to update the bed maintenance information',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  updateMaintenance?: boolean = false;

  @ApiProperty({ 
    description: 'Whether to transfer the bed to another ward',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  transferBed?: boolean = false;

  @ApiProperty({ 
    description: 'Whether to update the bed notes',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  updateNotes?: boolean = false;

  @ApiProperty({ 
    description: 'Whether to update the bed custom fields',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  updateCustomFields?: boolean = false;
}
