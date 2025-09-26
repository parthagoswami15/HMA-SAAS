import { PartialType } from '@nestjs/mapped-types';
import { CreateAdmissionDto } from './create-admission.dto';
import { IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { AdmissionStatus } from '../../../enums/admission-status.enum';

export class UpdateAdmissionDto extends PartialType(CreateAdmissionDto) {
  @IsOptional()
  @IsUUID()
  bedId?: string;

  @IsOptional()
  @IsEnum(AdmissionStatus)
  status?: AdmissionStatus;

  @IsOptional()
  @IsDateString()
  dischargeDate?: Date;

  @IsOptional()
  @IsString()
  dischargeNotes?: string;

  @IsOptional()
  @IsBoolean()
  isSelfDischarge?: boolean;

  @IsOptional()
  @IsString()
  selfDischargeReason?: string;
}
