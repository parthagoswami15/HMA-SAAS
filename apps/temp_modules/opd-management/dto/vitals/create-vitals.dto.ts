import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min, Max, IsUUID } from 'class-validator';

export class CreateVitalsDto {
  @ApiProperty({ description: 'ID of the visit', required: true })
  @IsUUID()
  visitId: string;

  @ApiProperty({ description: 'ID of the patient', required: true })
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Body temperature in °C', required: false })
  @IsNumber()
  @Min(30)
  @Max(45)
  @IsOptional()
  temperature?: number;

  @ApiProperty({ description: 'Heart rate in bpm', required: false })
  @IsNumber()
  @Min(30)
  @Max(250)
  @IsOptional()
  heartRate?: number;

  @ApiProperty({ example: '120/80', description: 'Blood pressure in mmHg', required: false })
  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @ApiProperty({ description: 'Respiratory rate in breaths per minute', required: false })
  @IsNumber()
  @Min(5)
  @Max(60)
  @IsOptional()
  respiratoryRate?: number;

  @ApiProperty({ description: 'Oxygen saturation in %', required: false })
  @IsNumber()
  @Min(70)
  @Max(100)
  @IsOptional()
  oxygenSaturation?: number;

  @ApiProperty({ description: 'Height in cm', required: false })
  @IsNumber()
  @Min(30)
  @Max(250)
  @IsOptional()
  height?: number;

  @ApiProperty({ description: 'Weight in kg', required: false })
  @IsNumber()
  @Min(1)
  @Max(300)
  @IsOptional()
  weight?: number;

  @ApiProperty({ description: 'Pain score (0-10)', required: false })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  painScore?: number;

  @ApiProperty({ description: 'Additional vitals metrics', required: false })
  @IsOptional()
  additionalMetrics?: Record<string, any>;

  @ApiProperty({ description: 'Clinical notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
