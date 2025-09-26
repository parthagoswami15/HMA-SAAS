import { ApiProperty } from '@nestjs/swagger';
import { Ward } from '../entities/ward.entity';

export class WardResponseDto {
  @ApiProperty({ description: 'Unique identifier for the ward', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Name of the ward', example: 'General Ward A' })
  name: string;

  @ApiProperty({ description: 'Code/identifier for the ward', example: 'GW-A' })
  code: string;

  @ApiProperty({ 
    description: 'Description of the ward',
    required: false,
    example: 'General medical ward for adult patients'
  })
  description?: string;

  @ApiProperty({ 
    description: 'Floor number where the ward is located',
    example: 2
  })
  floor: number;

  @ApiProperty({ 
    description: 'Type of ward',
    example: 'GENERAL',
    enum: ['GENERAL', 'ICU', 'CCU', 'PEDIATRICS', 'MATERNITY', 'SURGICAL', 'ONCOLOGY', 'PSYCHIATRIC', 'ISOLATION', 'OTHER']
  })
  type: string;

  @ApiProperty({ 
    description: 'Total number of beds in the ward',
    example: 20
  })
  totalBeds: number;

  @ApiProperty({ 
    description: 'Number of occupied beds',
    example: 15
  })
  occupiedBeds: number;

  @ApiProperty({ 
    description: 'Number of available beds',
    example: 5
  })
  availableBeds: number;

  @ApiProperty({ 
    description: 'Contact number for the ward',
    required: false,
    example: '+1234567890'
  })
  contactNumber?: string;

  @ApiProperty({ 
    description: 'Email contact for the ward',
    required: false,
    example: 'ward.a@hospital.com'
  })
  email?: string;

  @ApiProperty({ 
    description: 'Name of the ward in charge',
    required: false,
    example: 'Dr. Sarah Johnson'
  })
  inChargeName?: string;

  @ApiProperty({ 
    description: 'ID of the staff member in charge',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  inChargeId?: string;

  @ApiProperty({ 
    description: 'Whether the ward is currently active',
    default: true
  })
  isActive: boolean;

  @ApiProperty({ 
    description: 'List of bed types available in this ward',
    required: false,
    example: ['GENERAL', 'PRIVATE', 'DELUXE']
  })
  bedTypes?: string[];

  @ApiProperty({ 
    description: 'Specialties or services available in this ward',
    required: false,
    example: ['Cardiology', 'Pulmonology', 'General Medicine']
  })
  specialties?: string[];

  @ApiProperty({ 
    description: 'Additional notes about the ward',
    required: false,
    example: 'Visiting hours: 2 PM - 6 PM. Only 2 visitors per patient allowed.'
  })
  notes?: string;

  @ApiProperty({ 
    description: 'Custom fields for additional ward information',
    required: false,
    example: {
      hasPrivateBathroom: true,
      hasAC: true,
      visitingHours: {
        weekdays: '2 PM - 6 PM',
        weekends: '11 AM - 7 PM'
      }
    }
  })
  customFields?: Record<string, any>;

  @ApiProperty({ description: 'Date when the record was created', example: '2023-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the record was last updated', example: '2023-06-15T10:30:00Z' })
  updatedAt: Date;

  constructor(ward: Ward) {
    this.id = ward.id;
    this.name = ward.name;
    this.code = ward.code;
    this.description = ward.description;
    this.floor = ward.floor;
    this.type = ward.type;
    this.contactNumber = ward.contactNumber;
    this.email = ward.email;
    this.inChargeName = ward.inChargeName;
    this.inChargeId = ward.inChargeId;
    this.isActive = ward.isActive;
    this.bedTypes = ward.bedTypes;
    this.specialties = ward.specialties;
    this.notes = ward.notes;
    this.customFields = ward.customFields;
    this.createdAt = ward.createdAt;
    this.updatedAt = ward.updatedAt;

    // Calculate bed statistics if beds are included
    if (ward.beds) {
      this.totalBeds = ward.beds.length;
      this.occupiedBeds = ward.beds.filter(bed => bed.isOccupied).length;
      this.availableBeds = this.totalBeds - this.occupiedBeds;
    } else {
      this.totalBeds = 0;
      this.occupiedBeds = 0;
      this.availableBeds = 0;
    }
  }

  // Static method to transform an array of wards
  static fromWards(wards: Ward[]): WardResponseDto[] {
    return wards.map(ward => new WardResponseDto(ward));
  }
}
