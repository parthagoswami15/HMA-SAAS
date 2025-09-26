import { IsOptional, IsEnum, IsDateString, IsBoolean, IsUUID } from 'class-validator';
import { AdmissionType } from '../../enums/admission-type.enum';
import { AdmissionStatus } from '../../enums/admission-status.enum';
import { Transform } from 'class-transformer';

export class AdmissionFilterDto {
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @IsOptional()
  @IsUUID()
  wardId?: string;

  @IsOptional()
  @IsUUID()
  bedId?: string;

  @IsOptional()
  @IsEnum(AdmissionType)
  admissionType?: AdmissionType;

  @IsOptional()
  @IsEnum(AdmissionStatus)
  status?: AdmissionStatus;

  @IsOptional()
  @IsDateString()
  admissionDateFrom?: Date;

  @IsOptional()
  @IsDateString()
  admissionDateTo?: Date;

  @IsOptional()
  @IsDateString()
  dischargeDateFrom?: Date;

  @IsOptional()
  @IsDateString()
  dischargeDateTo?: Date;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  activeOnly?: boolean = true;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'admissionDate';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === 'asc' ? 'ASC' : 'DESC'))
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
