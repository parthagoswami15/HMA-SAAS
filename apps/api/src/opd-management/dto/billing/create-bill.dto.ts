import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsNumber,
  Min,
  IsEnum,
  IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';

export enum BillStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  WRITTEN_OFF = 'WRITTEN_OFF'
}

export enum BillItemType {
  CONSULTATION = 'CONSULTATION',
  PROCEDURE = 'PROCEDURE',
  LAB_TEST = 'LAB_TEST',
  RADIOLOGY = 'RADIOLOGY',
  MEDICATION = 'MEDICATION',
  SUPPLY = 'SUPPLY',
  ROOM = 'ROOM',
  OTHER = 'OTHER'
}

export class BillItemDto {
  @ApiProperty({ 
    description: 'ID of the item being billed (e.g., procedure ID, test ID)' 
  })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Name of the item' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    enum: BillItemType, 
    description: 'Type of the billable item' 
  })
  @IsEnum(BillItemType)
  type: BillItemType;

  @ApiProperty({ 
    description: 'Description of the item',
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Quantity of the item',
    minimum: 0.01,
    default: 1 
  })
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ 
    description: 'Unit price of the item',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ 
    description: 'Discount amount for this item',
    minimum: 0,
    default: 0 
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({ 
    description: 'Tax amount for this item',
    minimum: 0,
    default: 0 
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tax?: number;

  @ApiProperty({ 
    description: 'Total amount for this item (quantity * unitPrice - discount + tax)',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ 
    description: 'Additional notes about this item',
    required: false 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class PaymentDto {
  @ApiProperty({ 
    description: 'Payment amount',
    minimum: 0.01 
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ 
    description: 'Payment method (e.g., CASH, CARD, INSURANCE, BANK_TRANSFER)',
    example: 'CASH' 
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ 
    description: 'Transaction reference number',
    required: false 
  })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiProperty({ 
    description: 'Payment date and time',
    type: Date,
    default: () => new Date().toISOString() 
  })
  @IsDateString()
  @IsOptional()
  paymentDate?: Date;

  @ApiProperty({ 
    description: 'Additional notes about the payment',
    required: false 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateBillDto {
  @ApiProperty({ description: 'Visit ID this bill is associated with' })
  @IsString()
  @IsNotEmpty()
  visitId: string;

  @ApiProperty({ description: 'Patient ID this bill is for' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ 
    type: [BillItemDto], 
    description: 'List of items being billed' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillItemDto)
  items: BillItemDto[];

  @ApiProperty({ 
    description: 'Subtotal amount before discounts and taxes',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ 
    description: 'Total discount amount',
    minimum: 0,
    default: 0 
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({ 
    description: 'Total tax amount',
    minimum: 0,
    default: 0 
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tax?: number;

  @ApiProperty({ 
    description: 'Total bill amount (subtotal - discount + tax)',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ 
    description: 'Amount paid so far',
    minimum: 0,
    default: 0 
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amountPaid?: number;

  @ApiProperty({ 
    description: 'Outstanding balance',
    minimum: 0,
    default: 0 
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number;

  @ApiProperty({ 
    enum: BillStatus, 
    description: 'Status of the bill',
    default: BillStatus.PENDING 
  })
  @IsEnum(BillStatus)
  @IsOptional()
  status?: BillStatus;

  @ApiProperty({ 
    description: 'Due date for payment',
    type: Date,
    required: false 
  })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ 
    type: [PaymentDto], 
    description: 'List of payments made towards this bill',
    required: false 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  @IsOptional()
  payments?: PaymentDto[];

  @ApiProperty({ 
    description: 'Additional notes about the bill',
    required: false 
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ 
    description: 'Insurance information',
    type: 'object',
    required: false 
  })
  @IsObject()
  @IsOptional()
  insurance?: Record<string, any>;
}
