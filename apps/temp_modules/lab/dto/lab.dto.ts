import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateLabTestDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  priceCents?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class CreateLabOrderDto {
  @IsString()
  patientId: string;

  @IsString()
  testId: string;
}

export class CreateLabSampleDto {
  @IsString()
  orderId: string;

  @IsString()
  sampleType: string;

  @IsOptional()
  @IsDateString()
  collectedAt?: Date;

  @IsOptional()
  @IsString()
  collectedBy?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateLabResultDto {
  @IsString()
  orderId: string;

  @IsString()
  testName: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  referenceRange?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsString()
  reportedBy: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
