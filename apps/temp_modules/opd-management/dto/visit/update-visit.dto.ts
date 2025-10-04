import { PartialType } from '@nestjs/swagger';
import { CreateVisitDto } from './create-visit.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { VisitStatus } from '../../enums/visit.enum';

export class UpdateVisitDto extends PartialType(CreateVisitDto) {
  @ApiProperty({ 
    description: 'Status of the visit',
    enum: VisitStatus,
    required: false 
  })
  @IsEnum(VisitStatus)
  @IsOptional()
  status?: VisitStatus;

  @ApiProperty({ 
    description: 'Date and time when the visit started',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  startedAt?: Date;

  @ApiProperty({ 
    description: 'Date and time when the visit was completed',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  completedAt?: Date;

  @ApiProperty({ 
    description: 'ID of the staff who completed the visit',
    required: false 
  })
  @IsString()
  @IsOptional()
  completedById?: string;

  @ApiProperty({ 
    description: 'Additional notes or follow-up instructions',
    required: false 
  })
  @IsString()
  @IsOptional()
  followUpNotes?: string;

  @ApiProperty({ 
    description: 'Follow-up date and time',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  followUpDate?: Date;
}
