import { PartialType } from '@nestjs/swagger';
import { CreatePrescriptionDto, PrescriptionItemDto } from './create-prescription.dto';
import { 
  ApiProperty, 
  ApiPropertyOptional 
} from '@nestjs/swagger';
import { 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsEnum, 
  IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PrescriptionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export class UpdatePrescriptionItemDto extends PrescriptionItemDto {
  @ApiPropertyOptional({ description: 'ID of the prescription item (for updates)' })
  @IsOptional()
  id?: string;
}

export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {
  @ApiPropertyOptional({ 
    enum: PrescriptionStatus,
    description: 'Status of the prescription',
  })
  @IsEnum(PrescriptionStatus)
  @IsOptional()
  status?: PrescriptionStatus;

  @ApiPropertyOptional({ 
    type: [UpdatePrescriptionItemDto],
    description: 'List of prescribed items to update',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePrescriptionItemDto)
  @IsOptional()
  items?: UpdatePrescriptionItemDto[];

  @ApiPropertyOptional({
    description: 'Date when the prescription was filled',
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  filledAt?: Date;

  @ApiPropertyOptional({
    description: 'ID of the pharmacist who filled the prescription',
  })
  @IsOptional()
  filledById?: string;

  @ApiPropertyOptional({
    description: 'Date when the prescription was verified',
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  verifiedAt?: Date;

  @ApiPropertyOptional({
    description: 'ID of the staff who verified the prescription',
  })
  @IsOptional()
  verifiedById?: string;

  @ApiPropertyOptional({
    description: 'Reason for cancellation if applicable',
  })
  @IsOptional()
  cancellationReason?: string;

  @ApiPropertyOptional({
    description: 'Date when the prescription was cancelled',
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  cancelledAt?: Date;

  @ApiPropertyOptional({
    description: 'ID of the staff who cancelled the prescription',
  })
  @IsOptional()
  cancelledById?: string;
}
