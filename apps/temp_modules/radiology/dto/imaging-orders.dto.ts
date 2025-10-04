import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsBoolean, IsDateString, IsUUID, IsNumber, IsArray } from 'class-validator';
import { ModalityType, ImagingOrderStatus, ImagingPriority, ContrastType } from '@prisma/client';

export class CreateImagingOrderDto {
  @ApiProperty({ description: 'Patient visit ID' })
  @IsOptional()
  @IsUUID()
  visitId?: string;

  @ApiProperty({ description: 'Patient ID', required: true })
  @IsUUID()
  patientId: string;

  @ApiProperty({ enum: ModalityType, description: 'Imaging modality type' })
  @IsEnum(ModalityType)
  modalityType: ModalityType;

  @ApiPropertyOptional({ description: 'Specific modality ID' })
  @IsOptional()
  @IsUUID()
  modalityId?: string;

  @ApiProperty({ description: 'Imaging protocol' })
  @IsString()
  protocol: string;

  @ApiPropertyOptional({ description: 'Body part being imaged' })
  @IsOptional()
  @IsString()
  bodyPart?: string;

  @ApiPropertyOptional({ description: 'Clinical indication' })
  @IsOptional()
  @IsString()
  clinicalHistory?: string;

  @ApiPropertyOptional({ enum: ImagingPriority, default: ImagingPriority.ROUTINE })
  @IsOptional()
  @IsEnum(ImagingPriority)
  priority?: ImagingPriority;

  @ApiPropertyOptional({ description: 'Contrast type' })
  @IsOptional()
  @IsEnum(ContrastType)
  contrastType?: ContrastType;

  @ApiPropertyOptional({ description: 'Contrast agent name' })
  @IsOptional()
  @IsString()
  contrastAgent?: string;

  @ApiPropertyOptional({ description: 'Contrast volume' })
  @IsOptional()
  @IsString()
  contrastVolume?: string;

  @ApiPropertyOptional({ description: 'Has contrast allergy' })
  @IsOptional()
  @IsBoolean()
  contrastAllergy?: boolean;

  @ApiPropertyOptional({ description: 'Allergy details' })
  @IsOptional()
  @IsString()
  allergyDetails?: string;

  @ApiPropertyOptional({ description: 'Is patient pregnant' })
  @IsOptional()
  @IsBoolean()
  isPregnant?: boolean;

  @ApiPropertyOptional({ description: 'Pregnancy details' })
  @IsOptional()
  @IsString()
  pregnancyDetails?: string;

  @ApiPropertyOptional({ description: 'Is inpatient' })
  @IsOptional()
  @IsBoolean()
  isInpatient?: boolean;

  @ApiPropertyOptional({ description: 'Requires isolation' })
  @IsOptional()
  @IsBoolean()
  isolationRequired?: boolean;

  @ApiPropertyOptional({ description: 'Special instructions' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({ description: 'Previous relevant studies' })
  @IsOptional()
  @IsString()
  previousStudies?: string;

  @ApiPropertyOptional({ description: 'Cumulative radiation dose (mSv)' })
  @IsOptional()
  @IsNumber()
  cumulativeDose?: number;
}

export class UpdateImagingOrderDto {
  @ApiPropertyOptional({ enum: ModalityType })
  @IsOptional()
  @IsEnum(ModalityType)
  modalityType?: ModalityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  modalityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  protocol?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bodyPart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clinicalHistory?: string;

  @ApiPropertyOptional({ enum: ImagingPriority })
  @IsOptional()
  @IsEnum(ImagingPriority)
  priority?: ImagingPriority;

  @ApiPropertyOptional({ enum: ImagingOrderStatus })
  @IsOptional()
  @IsEnum(ImagingOrderStatus)
  status?: ImagingOrderStatus;

  @ApiPropertyOptional({ description: 'Scheduled date/time' })
  @IsOptional()
  @IsDateString()
  scheduledFor?: string;

  @ApiPropertyOptional({ enum: ContrastType })
  @IsOptional()
  @IsEnum(ContrastType)
  contrastType?: ContrastType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contrastAgent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contrastVolume?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  contrastAllergy?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  allergyDetails?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPregnant?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pregnancyDetails?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isInpatient?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isolationRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  previousStudies?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cumulativeDose?: number;
}

export class ScheduleImagingOrderDto {
  @ApiProperty({ description: 'Scheduled date/time', required: true })
  @IsDateString()
  scheduledFor: string;

  @ApiPropertyOptional({ description: 'Specific modality ID' })
  @IsOptional()
  @IsUUID()
  modalityId?: string;

  @ApiPropertyOptional({ description: 'User scheduling the appointment' })
  @IsOptional()
  @IsUUID()
  scheduledBy?: string;
}

export class ImagingOrderFilterDto {
  @ApiPropertyOptional({ enum: ImagingOrderStatus })
  @IsOptional()
  @IsEnum(ImagingOrderStatus)
  status?: ImagingOrderStatus;

  @ApiPropertyOptional({ enum: ModalityType })
  @IsOptional()
  @IsEnum(ModalityType)
  modalityType?: ModalityType;

  @ApiPropertyOptional({ enum: ImagingPriority })
  @IsOptional()
  @IsEnum(ImagingPriority)
  priority?: ImagingPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  contrastAllergy?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPregnant?: boolean;
}

export class ImagingOrderListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string = 'orderedAt';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  sortOrder?: boolean = false; // false = ASC, true = DESC
}
