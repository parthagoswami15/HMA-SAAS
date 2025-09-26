import { PartialType } from '@nestjs/swagger';
import { 
  CreateBillDto, 
  BillStatus, 
  BillItemDto, 
  PaymentDto 
} from './create-bill.dto';
import { 
  ApiProperty, 
  ApiPropertyOptional 
} from '@nestjs/swagger';
import { 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsNumber, 
  Min,
  IsString,
  IsDateString,
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBillItemDto extends BillItemDto {
  @ApiPropertyOptional({ 
    description: 'ID of the bill item (for updates)',
    required: false 
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ 
    description: 'Whether this item is cancelled',
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isCancelled?: boolean;

  @ApiPropertyOptional({ 
    description: 'Reason for cancellation if applicable',
    required: false 
  })
  @IsString()
  @IsOptional()
  cancellationReason?: string;
}

export class UpdatePaymentDto extends PaymentDto {
  @ApiPropertyOptional({ 
    description: 'ID of the payment (for updates)',
    required: false 
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ 
    description: 'Whether this payment is refunded',
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isRefunded?: boolean;

  @ApiPropertyOptional({ 
    description: 'Refund amount if applicable',
    minimum: 0,
    required: false 
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  refundAmount?: number;

  @ApiPropertyOptional({ 
    description: 'Refund date and time',
    type: Date,
    required: false 
  })
  @IsDateString()
  @IsOptional()
  refundDate?: Date;

  @ApiPropertyOptional({ 
    description: 'Reason for refund if applicable',
    required: false 
  })
  @IsString()
  @IsOptional()
  refundReason?: string;
}

export class UpdateBillDto extends PartialType(CreateBillDto) {
  @ApiPropertyOptional({ 
    enum: BillStatus,
    description: 'Updated status of the bill',
  })
  @IsEnum(BillStatus)
  @IsOptional()
  status?: BillStatus;

  @ApiPropertyOptional({ 
    type: [UpdateBillItemDto],
    description: 'Updated list of bill items',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBillItemDto)
  @IsOptional()
  items?: UpdateBillItemDto[];

  @ApiPropertyOptional({ 
    type: [UpdatePaymentDto],
    description: 'Updated list of payments',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePaymentDto)
  @IsOptional()
  payments?: UpdatePaymentDto[];

  @ApiPropertyOptional({ 
    description: 'Date and time when the bill was paid in full',
    type: Date,
    required: false 
  })
  @IsDateString()
  @IsOptional()
  paidAt?: Date;

  @ApiPropertyOptional({ 
    description: 'ID of the staff who marked the bill as paid',
    required: false 
  })
  @IsString()
  @IsOptional()
  paidById?: string;

  @ApiPropertyOptional({ 
    description: 'Reason for cancellation if applicable',
    required: false 
  })
  @IsString()
  @IsOptional()
  cancellationReason?: string;

  @ApiPropertyOptional({ 
    description: 'Date and time when the bill was cancelled',
    type: Date,
    required: false 
  })
  @IsDateString()
  @IsOptional()
  cancelledAt?: Date;

  @ApiPropertyOptional({ 
    description: 'ID of the staff who cancelled the bill',
    required: false 
  })
  @IsString()
  @IsOptional()
  cancelledById?: string;

  @ApiPropertyOptional({ 
    description: 'Reason for write-off if applicable',
    required: false 
  })
  @IsString()
  @IsOptional()
  writeOffReason?: string;

  @ApiPropertyOptional({ 
    description: 'Date and time when the bill was written off',
    type: Date,
    required: false 
  })
  @IsDateString()
  @IsOptional()
  writtenOffAt?: Date;

  @ApiPropertyOptional({ 
    description: 'ID of the staff who wrote off the bill',
    required: false 
  })
  @IsString()
  @IsOptional()
  writtenOffById?: string;
}
