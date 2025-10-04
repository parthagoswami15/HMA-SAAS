import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsNumber,
  IsDateString
} from 'class-validator';

export enum TokenStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export class UpdateQueueTokenDto {
  @ApiPropertyOptional({ 
    enum: TokenStatus,
    description: 'Status of the token' 
  })
  @IsEnum(TokenStatus)
  @IsOptional()
  status?: TokenStatus;

  @ApiPropertyOptional({ 
    description: 'Estimated wait time in minutes',
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  estimatedWaitTime?: number;

  @ApiPropertyOptional({ 
    description: 'Date and time when the token was called',
    type: Date 
  })
  @IsDateString()
  @IsOptional()
  calledAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Date and time when the token was served',
    type: Date 
  })
  @IsDateString()
  @IsOptional()
  servedAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Date and time when the token was completed',
    type: Date 
  })
  @IsDateString()
  @IsOptional()
  completedAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Staff ID who called/served the token' 
  })
  @IsString()
  @IsOptional()
  servedById?: string;

  @ApiPropertyOptional({ 
    description: 'Additional notes about the token' 
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ 
    description: 'Reason for cancellation if applicable' 
  })
  @IsString()
  @IsOptional()
  cancellationReason?: string;
}
