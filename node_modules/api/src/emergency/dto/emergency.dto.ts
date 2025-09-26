import { IsString, IsOptional, IsObject, IsDateString } from 'class-validator';

export class CreateEmergencyCaseDto {
  @IsString()
  patientId: string;

  @IsString()
  triageLevel: string; // CRITICAL | HIGH | MEDIUM | LOW

  @IsString()
  chiefComplaint: string;

  @IsOptional()
  @IsObject()
  vitals?: any;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateEmergencyCaseDto {
  @IsOptional()
  @IsString()
  triageLevel?: string;

  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @IsOptional()
  @IsObject()
  vitals?: any;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  dischargeTime?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
