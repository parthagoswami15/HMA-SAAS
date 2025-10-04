import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReportStatus {
  PRELIMINARY = 'PRELIMINARY',
  FINAL = 'FINAL',
  CORRECTED = 'CORRECTED',
}

export enum ReportType {
  PATIENT = 'PATIENT',
  PHYSICIAN = 'PHYSICIAN',
  BOTH = 'BOTH',
}

export enum ExportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  EXCEL = 'EXCEL',
}

export class LabResultDataDto {
  @ApiProperty()
  testId: string;

  @ApiProperty()
  testName: string;

  @ApiProperty()
  analyte: string;

  @ApiProperty()
  value: number | string;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  flag: string;

  @ApiProperty()
  referenceRange: string;

  @ApiProperty()
  resultDateTime: Date;

  @ApiProperty()
  validationStatus: string;

  @ApiPropertyOptional()
  performedBy?: string;
}

export class ReportSummaryDto {
  @ApiProperty()
  totalTests: number;

  @ApiProperty()
  abnormalTests: number;

  @ApiProperty()
  criticalTests: number;

  @ApiProperty()
  pendingTests: number;

  @ApiProperty()
  tatHours: number;
}

export class LabReportDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  patientName: string;

  @ApiProperty()
  patientDOB: Date;

  @ApiPropertyOptional()
  physicianName?: string;

  @ApiProperty()
  orderDate: Date;

  @ApiPropertyOptional()
  collectionDate?: Date;

  @ApiProperty({ type: [LabResultDataDto] })
  results: LabResultDataDto[];

  @ApiProperty()
  summary: ReportSummaryDto;

  @ApiProperty({ enum: ReportStatus })
  status: ReportStatus;

  @ApiProperty({ enum: ReportType })
  reportType: ReportType;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  generatedAt: Date;
}

export class GeneratePatientReportDto {
  @ApiProperty()
  @IsString()
  orderId: string;
}

export class GenerateCumulativeReportDto {
  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;
}

export class GenerateWorkloadReportDto {
  @ApiProperty()
  @IsString()
  tenantId: string;

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;
}

export class GenerateQCReportDto {
  @ApiProperty()
  @IsString()
  analyzerId: string;

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;
}

export class ExportReportDto {
  @ApiProperty()
  @IsString()
  reportId: string;

  @ApiProperty({ enum: ExportFormat })
  @IsEnum(ExportFormat)
  format: ExportFormat;
}

export class WorkloadReportDto {
  @ApiProperty()
  summary: {
    totalOrders: number;
    completedOrders: number;
    statOrders: number;
    totalTests: number;
    totalSamples: number;
    averageTAT: number;
  };

  @ApiProperty()
  priorityBreakdown: {
    STAT: number;
    URGENT: number;
    ROUTINE: number;
  };

  @ApiProperty()
  dailyStats: any[];

  @ApiProperty()
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export class QCReportDto {
  @ApiProperty()
  analyzer: any;

  @ApiProperty()
  summary: {
    totalRuns: number;
    passedRuns: number;
    failedRuns: number;
    passRate: number;
  };

  @ApiProperty()
  analyteStats: any[];

  @ApiProperty()
  period: {
    startDate: Date;
    endDate: Date;
  };
}
