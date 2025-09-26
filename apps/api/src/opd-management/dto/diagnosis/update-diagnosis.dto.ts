import { PartialType } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsDateString, 
  IsBoolean, 
  IsEnum, 
  ValidateNested, 
  IsObject,
  IsUUID
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDiagnosisDto } from './create-diagnosis.dto';
import { DiagnosisStatus } from '../../entities/diagnosis.entity';

export class UpdateDiagnosisDto extends PartialType(CreateDiagnosisDto) {
  @IsEnum(DiagnosisStatus)
  @IsOptional()
  status?: DiagnosisStatus;

  @IsDateString()
  @IsOptional()
  resolvedDate?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  metadata?: Record<string, any>;

  @IsUUID()
  @IsOptional()
  encounterId?: string | null;
}

export class ResolveDiagnosisDto {
  @IsDateString()
  @IsOptional()
  resolvedDate?: string = new Date().toISOString();

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ReactivateDiagnosisDto {
  @IsString()
  @IsOptional()
  notes?: string;
}
