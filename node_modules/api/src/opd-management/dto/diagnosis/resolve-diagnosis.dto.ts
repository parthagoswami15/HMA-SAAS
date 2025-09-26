import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ResolveDiagnosisDto {
  @ApiPropertyOptional({
    description: 'Date when the diagnosis was resolved',
    default: () => new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  resolvedDate?: string = new Date().toISOString();

  @ApiPropertyOptional({
    description: 'Notes about the resolution',
    example: 'Patient reported resolution of symptoms',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
