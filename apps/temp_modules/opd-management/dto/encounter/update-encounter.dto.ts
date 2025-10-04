import { PartialType } from '@nestjs/swagger';
import { CreateEncounterDto } from './create-encounter.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class UpdateEncounterDto extends PartialType(CreateEncounterDto) {
  @ApiProperty({ 
    description: 'End date and time of the encounter',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  endTime?: Date;

  @ApiProperty({ 
    description: 'Whether the encounter is completed',
    required: false,
    default: false 
  })
  @IsOptional()
  isCompleted?: boolean;

  @ApiProperty({ 
    description: 'Staff ID who completed the encounter',
    required: false 
  })
  @IsOptional()
  completedById?: string;
}
