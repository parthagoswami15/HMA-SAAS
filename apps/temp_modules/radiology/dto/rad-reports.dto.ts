import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsEnum, IsObject, IsBoolean, IsDateString } from 'class-validator';
import { ReportStatus, BIRADS, LungRADS } from '@prisma/client';

export class CreateRadReportDto {
  @ApiProperty({ description: 'Study ID', required: true })
  @IsUUID()
  studyId: string;

  @ApiPropertyOptional({ description: 'Imaging order ID' })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiPropertyOptional({ description: 'Report type' })
  @IsOptional()
  @IsString()
  reportType?: string;

  @ApiPropertyOptional({ description: 'Clinical history' })
  @IsOptional()
  @IsString()
  clinicalHistory?: string;

  @ApiPropertyOptional({ description: 'Comparison with previous studies' })
  @IsOptional()
  @IsString()
  comparison?: string;

  @ApiPropertyOptional({ description: 'Imaging technique used' })
  @IsOptional()
  @IsString()
  technique?: string;

  @ApiPropertyOptional({ description: 'Narrative findings' })
  @IsOptional()
  @IsString()
  findingsText?: string;

  @ApiPropertyOptional({ description: 'Clinical impression' })
  @IsOptional()
  @IsString()
  impression?: string;

  @ApiPropertyOptional({ description: 'Recommendations' })
  @IsOptional()
  @IsString()
  recommendations?: string;

  @ApiPropertyOptional({ description: 'Conclusion' })
  @IsOptional()
  @IsString()
  conclusion?: string;

  @ApiPropertyOptional({ description: 'Structured findings as JSON' })
  @IsOptional()
  @IsObject()
  findings?: Record<string, any>;

  @ApiPropertyOptional({ enum: BIRADS })
  @IsOptional()
  @IsEnum(BIRADS)
  biRadsScore?: BIRADS;

  @ApiPropertyOptional({ enum: LungRADS })
  @IsOptional()
  @IsEnum(LungRADS)
  lungRadsScore?: LungRADS;

  @ApiPropertyOptional({ description: 'Other structured scores as JSON' })
  @IsOptional()
  @IsObject()
  otherScores?: Record<string, any>;

  @ApiPropertyOptional({ description: 'User who dictated the report' })
  @IsOptional()
  @IsUUID()
  dictatedBy?: string;

  @ApiPropertyOptional({ description: 'Primary radiologist' })
  @IsOptional()
  @IsUUID()
  primaryReadBy?: string;

  @ApiPropertyOptional({ description: 'Second opinion radiologist' })
  @IsOptional()
  @IsUUID()
  secondReadBy?: string;

  @ApiPropertyOptional({ description: 'Final signing radiologist' })
  @IsOptional()
  @IsUUID()
  signedBy?: string;

  @ApiPropertyOptional({ description: 'Share with patient' })
  @IsOptional()
  @IsBoolean()
  sharedWithPatient?: boolean;

  @ApiPropertyOptional({ description: 'Share with doctor' })
  @IsOptional()
  @IsBoolean()
  sharedWithDoctor?: boolean;

  @ApiPropertyOptional({ description: 'Requires second read' })
  @IsOptional()
  @IsBoolean()
  requiresSecondRead?: boolean;

  @ApiPropertyOptional({ description: 'Peer review required' })
  @IsOptional()
  @IsBoolean()
  peerReviewRequired?: boolean;
}

export class UpdateRadReportDto {
  @ApiPropertyOptional({ enum: ReportStatus })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clinicalHistory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comparison?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  technique?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  findingsText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  impression?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendations?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conclusion?: string;

  @ApiPropertyOptional({ description: 'Structured findings as JSON' })
  @IsOptional()
  @IsObject()
  findings?: Record<string, any>;

  @ApiPropertyOptional({ enum: BIRADS })
  @IsOptional()
  @IsEnum(BIRADS)
  biRadsScore?: BIRADS;

  @ApiPropertyOptional({ enum: LungRADS })
  @IsOptional()
  @IsEnum(LungRADS)
  lungRadsScore?: LungRADS;

  @ApiPropertyOptional({ description: 'Other structured scores as JSON' })
  @IsOptional()
  @IsObject()
  otherScores?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  dictatedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  primaryReadBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  secondReadBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  signedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  sharedWithPatient?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  sharedWithDoctor?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requiresSecondRead?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  peerReviewRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  peerReviewedBy?: string;
}

export class SignRadReportDto {
  @ApiProperty({ description: 'Radiologist signing the report', required: true })
  @IsUUID()
  signedBy: string;

  @ApiPropertyOptional({ description: 'Final impression' })
  @IsOptional()
  @IsString()
  finalImpression?: string;

  @ApiPropertyOptional({ description: 'Final recommendations' })
  @IsOptional()
  @IsString()
  finalRecommendations?: string;
}

export class RadReportFilterDto {
  @ApiPropertyOptional({ enum: ReportStatus })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({ enum: BIRADS })
  @IsOptional()
  @IsEnum(BIRADS)
  biRadsScore?: BIRADS;

  @ApiPropertyOptional({ enum: LungRADS })
  @IsOptional()
  @IsEnum(LungRADS)
  lungRadsScore?: LungRADS;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  studyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  dictatedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  primaryReadBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  signedBy?: string;

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
  requiresSecondRead?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  peerReviewRequired?: boolean;
}

export class RadReportListDto {
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
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  sortOrder?: boolean = false;
}
