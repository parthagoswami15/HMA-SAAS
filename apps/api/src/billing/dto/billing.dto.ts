import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsEnum, 
  IsArray, 
  ValidateNested, 
  IsDateString,
  Min,
  ArrayMinSize
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

/**
 * DTO for creating invoice items
 */
export class CreateInvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  itemType: string; // 'CONSULTATION', 'LAB_TEST', 'MEDICATION', 'PROCEDURE', 'OTHER'

  @IsString()
  @IsNotEmpty()
  itemId: string; // ID of the related entity (appointment, lab order, pharmacy order, etc.)

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;
}

/**
 * DTO for creating an invoice
 */
export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  @ArrayMinSize(1)
  items: CreateInvoiceItemDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxAmount?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;
}

/**
 * DTO for updating an invoice
 */
export class UpdateInvoiceDto {
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}

/**
 * DTO for creating a payment
 */
export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;
}

/**
 * DTO for updating a payment
 */
export class UpdatePaymentDto {
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * DTO for filtering invoices
 */
export class InvoiceFilterDto {
  @IsString()
  @IsOptional()
  patientId?: string;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}

/**
 * DTO for filtering payments
 */
export class PaymentFilterDto {
  @IsString()
  @IsOptional()
  invoiceId?: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
