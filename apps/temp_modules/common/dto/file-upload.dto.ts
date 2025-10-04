import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class FileUploadResponseDto {
  @ApiProperty({ description: 'Unique identifier for the uploaded file' })
  id: string;

  @ApiProperty({ description: 'Original file name' })
  fileName: string;

  @ApiProperty({ description: 'File MIME type' })
  fileType: string;

  @ApiProperty({ description: 'File size in bytes' })
  fileSize: number;

  @ApiProperty({ description: 'URL to access the uploaded file' })
  url: string;

  @ApiProperty({ description: 'Document type (if applicable)' })
  documentType?: string;

  @ApiProperty({ description: 'Upload timestamp' })
  uploadedAt: Date;

  @ApiProperty({ description: 'File metadata' })
  metadata?: Record<string, any>;
}

export class FileUploadOptions {
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  allowedMimeTypes: string;

  @IsString()
  @IsNotEmpty()
  maxFileSize: string;

  @IsString()
  @IsNotEmpty()
  fileFilter: string;
}
