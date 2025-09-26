import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReactivateDiagnosisDto {
  @ApiPropertyOptional({
    description: 'Notes about the reactivation',
    example: 'Patient reported recurrence of symptoms',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
