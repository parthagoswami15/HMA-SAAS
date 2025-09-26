import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsNumber,
  IsDateString
} from 'class-validator';
import { QueuePriority } from '../../../enums/visit.enum';

export class CreateQueueTokenDto {
  @ApiProperty({ description: 'Visit ID this token is associated with' })
  @IsString()
  @IsNotEmpty()
  visitId: string;

  @ApiProperty({ description: 'Department/Service point ID' })
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @ApiProperty({ 
    enum: QueuePriority, 
    description: 'Priority of the token',
    default: QueuePriority.NORMAL 
  })
  @IsEnum(QueuePriority)
  @IsOptional()
  priority?: QueuePriority;

  @ApiProperty({ 
    description: 'Estimated wait time in minutes',
    required: false 
  })
  @IsNumber()
  @IsOptional()
  estimatedWaitTime?: number;

  @ApiProperty({ 
    description: 'Additional notes about the token',
    required: false 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
