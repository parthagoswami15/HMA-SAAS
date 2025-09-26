import { PartialType } from '@nestjs/swagger';
import { CreateWardDto } from './create-ward.dto';
import { IsOptional, IsString, IsNumber, IsBoolean, IsArray, ValidateNested, Type } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWardDto extends PartialType(CreateWardDto) {
  @ApiProperty({ 
    description: 'Name of the ward', 
    required: false,
    example: 'General Ward A - Updated'
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    description: 'Code/identifier for the ward',
    required: false,
    example: 'GW-A-UPDATED'
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ 
    description: 'Whether to update the beds in this ward',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  updateBeds?: boolean = false;

  @ApiProperty({ 
    description: 'Beds to be added or updated in this ward',
    required: false,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          description: 'Required for updating existing beds',
          example: '123e4567-e89b-12d3-a456-426614174000'
        },
        bedNumber: { type: 'string', example: 'B-101' },
        name: { type: 'string', example: 'Bed 1' },
        bedClass: { 
          type: 'string', 
          enum: ['GENERAL', 'PRIVATE', 'DELUXE', 'ICU', 'ISOLATION', 'HDU', 'PEDIATRIC', 'MATERNITY', 'OTHER'],
          example: 'GENERAL'
        },
        status: {
          type: 'string',
          enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING', 'QUARANTINE'],
          example: 'AVAILABLE'
        },
        features: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['Oxygen', 'Suction', 'Monitor']
        },
        dailyRate: { type: 'number', example: 150.50 },
        notes: { type: 'string', example: 'Near nursing station' },
        isActive: { type: 'boolean', example: true },
        action: {
          type: 'string',
          enum: ['create', 'update', 'delete'],
          description: 'Action to perform on the bed (create/update/delete)'
        }
      }
    }
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  beds?: Array<{
    id?: string;
    bedNumber: string;
    name: string;
    bedClass: string;
    status?: string;
    features?: string[];
    dailyRate?: number;
    notes?: string;
    isActive?: boolean;
    action?: 'create' | 'update' | 'delete';
  }>;

  @ApiProperty({ 
    description: 'IDs of beds to be removed from this ward',
    required: false,
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bedsToRemove?: string[];

  @ApiProperty({ 
    description: 'Reason for the update',
    required: false,
    example: 'Ward renovation and bed reallocation'
  })
  @IsString()
  @IsOptional()
  updateReason?: string;

  @ApiProperty({ 
    description: 'ID of the staff member performing the update',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174003'
  })
  @IsString()
  @IsOptional()
  updatedById?: string;
}
