import { IsUUID, IsEnum, IsDateString, IsOptional, IsString, IsNumber, IsBoolean, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AdmissionType } from '../../enums/admission-type.enum';

export class CreateAdmissionDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  admittingDoctorId: string;

  @IsUUID()
  bedId: string;

  @IsEnum(AdmissionType)
  admissionType: AdmissionType;

  @IsDateString()
  admissionDate: Date;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  admissionNotes?: string;

  @IsObject()
  @IsOptional()
  insuranceInfo?: Record<string, any>;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdmissionDocumentDto)
  documents?: AdmissionDocumentDto[];
}

export class AdmissionDocumentDto {
  @IsString()
  type: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
