import { IsString, IsOptional, IsNumber, IsDateString, IsArray, IsEnum, IsBoolean } from 'class-validator';
import { ItemType, SaleStatus, ReturnStatus, InventoryReason } from '@prisma/client';

// Existing DTOs
export class CreateInventoryItemDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsNumber()
  priceCents?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class UpdateInventoryItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsNumber()
  priceCents?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class CreatePrescriptionDto {
  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @IsArray()
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    instructions?: string;
  }>;

  @IsOptional()
  @IsString()
  notes?: string;
}

// New DTOs for Pharmacy & Inventory

export class CreateItemDto {
  @IsString()
  name: string;

  @IsEnum(ItemType)
  type: ItemType;

  @IsOptional()
  @IsString()
  hsn?: string;

  @IsOptional()
  @IsNumber()
  gstRate?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ItemType)
  type?: ItemType;

  @IsOptional()
  @IsString()
  hsn?: string;

  @IsOptional()
  @IsNumber()
  gstRate?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateBatchDto {
  @IsString()
  itemId: string;

  @IsString()
  batchNo: string;

  @IsDateString()
  expDt: string;

  @IsNumber()
  mrp: number;

  @IsOptional()
  @IsNumber()
  qtyOnHand?: number;

  @IsOptional()
  @IsDateString()
  mfgDt?: string;

  @IsOptional()
  @IsString()
  vendorId?: string;

  @IsOptional()
  @IsString()
  grnId?: string;

  @IsOptional()
  @IsBoolean()
  isQuarantined?: boolean;

  @IsOptional()
  @IsString()
  quarantineReason?: string;
}

export class UpdateBatchDto {
  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsString()
  batchNo?: string;

  @IsOptional()
  @IsDateString()
  expDt?: string;

  @IsOptional()
  @IsNumber()
  mrp?: number;

  @IsOptional()
  @IsNumber()
  qtyOnHand?: number;

  @IsOptional()
  @IsDateString()
  mfgDt?: string;

  @IsOptional()
  @IsString()
  vendorId?: string;

  @IsOptional()
  @IsString()
  grnId?: string;

  @IsOptional()
  @IsBoolean()
  isQuarantined?: boolean;

  @IsOptional()
  @IsString()
  quarantineReason?: string;
}

export class CreateVendorDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateGrnDto {
  @IsString()
  grnNo: string;

  @IsString()
  vendorId: string;

  @IsOptional()
  @IsString()
  poNo?: string;

  @IsOptional()
  @IsDateString()
  receivedDt?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateGrnDto {
  @IsOptional()
  @IsString()
  grnNo?: string;

  @IsOptional()
  @IsString()
  vendorId?: string;

  @IsOptional()
  @IsString()
  poNo?: string;

  @IsOptional()
  @IsDateString()
  receivedDt?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateFormularyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateFormularyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateFormularyItemDto {
  @IsString()
  formularyId: string;

  @IsString()
  itemId: string;

  @IsOptional()
  @IsBoolean()
  isPreferred?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateFormularyItemDto {
  @IsOptional()
  @IsString()
  formularyId?: string;

  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsBoolean()
  isPreferred?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateReorderRuleDto {
  @IsString()
  itemId: string;

  @IsNumber()
  minStock: number;

  @IsNumber()
  maxStock: number;

  @IsNumber()
  reorderQty: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateReorderRuleDto {
  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsNumber()
  minStock?: number;

  @IsOptional()
  @IsNumber()
  maxStock?: number;

  @IsOptional()
  @IsNumber()
  reorderQty?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateRxFillDto {
  @IsString()
  prescriptionId: string;

  @IsString()
  itemId: string;

  @IsNumber()
  qty: number;

  @IsOptional()
  @IsString()
  batchId?: string;

  @IsNumber()
  rate: number;

  @IsOptional()
  @IsString()
  dispensedBy?: string;

  @IsOptional()
  @IsDateString()
  dispensedAt?: string;
}

export class UpdateRxFillDto {
  @IsOptional()
  @IsString()
  prescriptionId?: string;

  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsNumber()
  qty?: number;

  @IsOptional()
  @IsString()
  batchId?: string;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsString()
  dispensedBy?: string;

  @IsOptional()
  @IsDateString()
  dispensedAt?: string;
}

export class CreateSaleDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsString()
  storeId: string;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  gstAmount: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsEnum(SaleStatus)
  status?: SaleStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  items: Array<{
    itemId: string;
    batchId?: string;
    qty: number;
    rate: number;
    amount: number;
    gstRate?: number;
  }>;
}

export class UpdateSaleDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  storeId?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  gstAmount?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsEnum(SaleStatus)
  status?: SaleStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  items?: Array<{
    itemId: string;
    batchId?: string;
    qty: number;
    rate: number;
    amount: number;
    gstRate?: number;
  }>;
}

export class CreateReturnDto {
  @IsString()
  saleId: string;

  @IsString()
  reason: string;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsEnum(ReturnStatus)
  status?: ReturnStatus;

  @IsArray()
  items: Array<{
    itemId: string;
    batchId?: string;
    qty: number;
    rate: number;
    amount: number;
  }>;
}

export class UpdateReturnDto {
  @IsOptional()
  @IsString()
  saleId?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsEnum(ReturnStatus)
  status?: ReturnStatus;

  @IsOptional()
  @IsArray()
  items?: Array<{
    itemId: string;
    batchId?: string;
    qty: number;
    rate: number;
    amount: number;
  }>;
}

export class CreateInventoryTxDto {
  @IsString()
  itemId: string;

  @IsOptional()
  @IsString()
  batchId?: string;

  @IsNumber()
  qty: number;

  @IsEnum(InventoryReason)
  reason: InventoryReason;

  @IsOptional()
  @IsString()
  refDoc?: string;
}

export class UpdateInventoryTxDto {
  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsString()
  batchId?: string;

  @IsOptional()
  @IsNumber()
  qty?: number;

  @IsOptional()
  @IsEnum(InventoryReason)
  reason?: InventoryReason;

  @IsOptional()
  @IsString()
  refDoc?: string;
}
