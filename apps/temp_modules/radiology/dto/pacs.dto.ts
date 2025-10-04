import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsObject, IsEnum } from 'class-validator';

export enum DicomStorageClass {
  CT_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.2',           // CT Image Storage
  MR_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.4',           // MR Image Storage
  US_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.6.1',        // Ultrasound Image Storage
  CR_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.1',           // Computed Radiography Image Storage
  DX_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.1.1',        // Digital X-Ray Image Storage
  MG_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.1.2',        // Digital Mammography X-Ray Image Storage
  NM_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.20',          // Nuclear Medicine Image Storage
  PT_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.128',         // Positron Emission Tomography Image Storage
  XA_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.12.1',        // X-Ray Angiographic Image Storage
  RF_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.12.2',        // X-Ray Radiofluoroscopic Image Storage
  US_MULTIFRAME_IMAGE_STORAGE = '1.2.840.10008.5.1.4.1.1.3.1', // Ultrasound Multi-frame Image Storage
}

export enum DicomQueryLevel {
  PATIENT = 'PATIENT',
  STUDY = 'STUDY',
  SERIES = 'SERIES',
  IMAGE = 'IMAGE'
}

export class StoreDicomDto {
  @ApiProperty({ description: 'Study Instance UID', required: true })
  @IsString()
  studyInstanceUID: string;

  @ApiProperty({ description: 'Series Instance UID', required: true })
  @IsString()
  seriesInstanceUID: string;

  @ApiProperty({ description: 'SOP Instance UID', required: true })
  @IsString()
  sopInstanceUID: string;

  @ApiProperty({ description: 'SOP Class UID (DICOM storage class)', required: true })
  @IsString()
  sopClassUID: string;

  @ApiProperty({ description: 'DICOM file content as base64', required: true })
  @IsString()
  dicomData: string;

  @ApiPropertyOptional({ description: 'Patient ID' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Accession number' })
  @IsOptional()
  @IsString()
  accessionNumber?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class QueryDicomDto {
  @ApiProperty({ enum: DicomQueryLevel, description: 'Query level', required: true })
  @IsEnum(DicomQueryLevel)
  queryLevel: DicomQueryLevel;

  @ApiPropertyOptional({ description: 'Patient ID' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Patient name' })
  @IsOptional()
  @IsString()
  patientName?: string;

  @ApiPropertyOptional({ description: 'Study Instance UID' })
  @IsOptional()
  @IsString()
  studyInstanceUID?: string;

  @ApiPropertyOptional({ description: 'Accession number' })
  @IsOptional()
  @IsString()
  accessionNumber?: string;

  @ApiPropertyOptional({ description: 'Study date (YYYYMMDD)' })
  @IsOptional()
  @IsString()
  studyDate?: string;

  @ApiPropertyOptional({ description: 'Modality' })
  @IsOptional()
  @IsString()
  modality?: string;

  @ApiPropertyOptional({ description: 'Series Instance UID' })
  @IsOptional()
  @IsString()
  seriesInstanceUID?: string;

  @ApiPropertyOptional({ description: 'SOP Instance UID' })
  @IsOptional()
  @IsString()
  sopInstanceUID?: string;

  @ApiPropertyOptional({ description: 'Additional query parameters' })
  @IsOptional()
  @IsObject()
  queryParams?: Record<string, any>;
}

export class RetrieveDicomDto {
  @ApiProperty({ description: 'Study Instance UID', required: true })
  @IsString()
  studyInstanceUID: string;

  @ApiPropertyOptional({ description: 'Series Instance UID' })
  @IsOptional()
  @IsString()
  seriesInstanceUID?: string;

  @ApiPropertyOptional({ description: 'SOP Instance UID' })
  @IsOptional()
  @IsString()
  sopInstanceUID?: string;

  @ApiPropertyOptional({ description: 'Include bulk data' })
  @IsOptional()
  @IsString()
  includeBulkData?: string;
}

export class DicomStudyDto {
  @ApiProperty({ description: 'Study Instance UID' })
  @IsString()
  studyInstanceUID: string;

  @ApiPropertyOptional({ description: 'Accession number' })
  @IsOptional()
  @IsString()
  accessionNumber?: string;

  @ApiPropertyOptional({ description: 'Study date' })
  @IsOptional()
  @IsString()
  studyDate?: string;

  @ApiPropertyOptional({ description: 'Study time' })
  @IsOptional()
  @IsString()
  studyTime?: string;

  @ApiPropertyOptional({ description: 'Study description' })
  @IsOptional()
  @IsString()
  studyDescription?: string;

  @ApiPropertyOptional({ description: 'Patient name' })
  @IsOptional()
  @IsString()
  patientName?: string;

  @ApiPropertyOptional({ description: 'Patient ID' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Modalities in study' })
  @IsOptional()
  @IsString()
  modalitiesInStudy?: string;

  @ApiPropertyOptional({ description: 'Number of study related series' })
  @IsOptional()
  @IsString()
  numberOfStudyRelatedSeries?: string;

  @ApiPropertyOptional({ description: 'Number of study related instances' })
  @IsOptional()
  @IsString()
  numberOfStudyRelatedInstances?: string;
}

export class DicomSeriesDto {
  @ApiProperty({ description: 'Series Instance UID' })
  @IsString()
  seriesInstanceUID: string;

  @ApiPropertyOptional({ description: 'Series number' })
  @IsOptional()
  @IsString()
  seriesNumber?: string;

  @ApiPropertyOptional({ description: 'Modality' })
  @IsOptional()
  @IsString()
  modality?: string;

  @ApiPropertyOptional({ description: 'Series date' })
  @IsOptional()
  @IsString()
  seriesDate?: string;

  @ApiPropertyOptional({ description: 'Series time' })
  @IsOptional()
  @IsString()
  seriesTime?: string;

  @ApiPropertyOptional({ description: 'Series description' })
  @IsOptional()
  @IsString()
  seriesDescription?: string;

  @ApiPropertyOptional({ description: 'Body part examined' })
  @IsOptional()
  @IsString()
  bodyPartExamined?: string;

  @ApiPropertyOptional({ description: 'Number of series related instances' })
  @IsOptional()
  @IsString()
  numberOfSeriesRelatedInstances?: string;
}

export class DicomImageDto {
  @ApiProperty({ description: 'SOP Instance UID' })
  @IsString()
  sopInstanceUID: string;

  @ApiPropertyOptional({ description: 'Instance number' })
  @IsOptional()
  @IsString()
  instanceNumber?: string;

  @ApiPropertyOptional({ description: 'SOP Class UID' })
  @IsOptional()
  @IsString()
  sopClassUID?: string;

  @ApiPropertyOptional({ description: 'Rows' })
  @IsOptional()
  @IsString()
  rows?: string;

  @ApiPropertyOptional({ description: 'Columns' })
  @IsOptional()
  @IsString()
  columns?: string;
}
