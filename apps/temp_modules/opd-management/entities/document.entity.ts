import { ApiProperty } from '@nestjs/swagger';

export enum DocumentType {
  PRESCRIPTION = 'PRESCRIPTION',
  LAB_REPORT = 'LAB_REPORT',
  RADIOLOGY_REPORT = 'RADIOLOGY_REPORT',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
  REFERRAL_LETTER = 'REFERRAL_LETTER',
  MEDICAL_CERTIFICATE = 'MEDICAL_CERTIFICATE',
  CONSENT_FORM = 'CONSENT_FORM',
  ID_PROOF = 'ID_PROOF',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER'
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  FINAL = 'FINAL',
  VERIFIED = 'VERIFIED',
  AMENDED = 'AMENDED',
  REJECTED = 'REJECTED'
}

export class DocumentMetadata {
  @ApiProperty({ description: 'Document title', required: false })
  title?: string;

  @ApiProperty({ description: 'Document description', required: false })
  description?: string;

  @ApiProperty({ description: 'Document author name', required: false })
  author?: string;

  @ApiProperty({ description: 'Document creation date', type: Date, required: false })
  dateCreated?: Date;

  @ApiProperty({ description: 'Document keywords for search', type: [String], required: false })
  keywords?: string[];

  @ApiProperty({ description: 'Custom metadata fields', type: 'object', required: false })
  custom?: Record<string, any>;
}

export class DocumentVersion {
  @ApiProperty({ description: 'Version number' })
  version: number;

  @ApiProperty({ description: 'File URL or path' })
  fileUrl: string;

  @ApiProperty({ description: 'File MIME type' })
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'Version creation date', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Staff ID who created this version' })
  createdById: string;

  @ApiProperty({ description: 'Version notes', required: false })
  notes?: string;

  @ApiProperty({ description: 'Checksum/hash of the file content', required: false })
  checksum?: string;
}

export class Document {
  @ApiProperty({ description: 'Unique identifier for the document' })
  id: string;

  @ApiProperty({ description: 'Document type' })
  type: DocumentType;

  @ApiProperty({ enum: DocumentStatus, default: DocumentStatus.DRAFT })
  status: DocumentStatus;

  @ApiProperty({ description: 'Patient ID this document belongs to' })
  patientId: string;

  @ApiProperty({ description: 'Visit ID this document is associated with', required: false })
  visitId?: string;

  @ApiProperty({ description: 'Encounter ID this document is associated with', required: false })
  encounterId?: string;

  @ApiProperty({ description: 'Original filename' })
  filename: string;

  @ApiProperty({ description: 'Document metadata', type: DocumentMetadata })
  metadata: DocumentMetadata;

  @ApiProperty({ description: 'Current version of the document', type: DocumentVersion })
  currentVersion: DocumentVersion;

  @ApiProperty({ type: [DocumentVersion], description: 'Document version history', required: false })
  versions?: DocumentVersion[];

  @ApiProperty({ description: 'Date and time when the document was created', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the document was last updated', type: Date })
  updatedAt: Date;

  @ApiProperty({ description: 'Date and time when the document was deleted', type: Date, required: false })
  deletedAt?: Date;

  @ApiProperty({ description: 'Staff ID who created the document' })
  createdById: string;

  @ApiProperty({ description: 'Staff ID who last updated the document', required: false })
  updatedById?: string;
}
