import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { VisitType } from '../../enums/visit.enum';

export class CreateVisitDto {
  @ApiProperty({ description: 'Patient ID for the visit' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ 
    description: 'Type of visit',
    enum: VisitType,
    default: VisitType.OPD 
  })
  @IsEnum(VisitType)
  @IsOptional()
  type?: VisitType;

  @ApiProperty({ 
    description: 'Scheduled date and time for the visit',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  scheduledAt?: Date;

  @ApiProperty({ 
    description: 'Chief complaint or reason for visit',
    required: false 
  })
  @IsString()
  @IsOptional()
  chiefComplaint?: string;

  @ApiProperty({ 
    description: 'ID of the referring doctor',
    required: false 
  })
  @IsString()
  @IsOptional()
  referredById?: string;

  @ApiProperty({ 
    description: 'Referral notes',
    required: false 
  })
  @IsString()
  @IsOptional()
  referralNotes?: string;

  @ApiProperty({ 
    description: 'Additional notes about the visit',
    required: false 
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ 
    description: 'Custom metadata for the visit',
    type: 'object',
    required: false 
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
