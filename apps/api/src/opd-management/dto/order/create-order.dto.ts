import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsEnum,
  IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderPriority {
  ROUTINE = 'ROUTINE',
  URGENT = 'URGENT',
  STAT = 'STAT',
  ASAP = 'ASAP'
}

export enum OrderItemType {
  LAB_TEST = 'LAB_TEST',
  RADIOLOGY = 'RADIOLOGY',
  PROCEDURE = 'PROCEDURE',
  MEDICATION = 'MEDICATION',
  CONSULT = 'CONSULT',
  NURSING = 'NURSING',
  OTHER = 'OTHER'
}

export class OrderItemDto {
  @ApiProperty({ description: 'ID of the item being ordered' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Name of the item being ordered' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({ 
    enum: OrderItemType, 
    description: 'Type of order item' 
  })
  @IsEnum(OrderItemType)
  itemType: OrderItemType;

  @ApiProperty({ 
    description: 'Quantity of the item', 
    default: 1,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ 
    description: 'Instructions for this order item', 
    required: false 
  })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty({ 
    description: 'Priority for this specific item',
    enum: OrderPriority,
    default: OrderPriority.ROUTINE,
    required: false
  })
  @IsEnum(OrderPriority)
  @IsOptional()
  priority?: OrderPriority;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Visit ID this order is associated with' })
  @IsString()
  @IsNotEmpty()
  visitId: string;

  @ApiProperty({ description: 'Provider (staff) ID who created this order' })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ description: 'Department ID where the order was created' })
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @ApiProperty({ 
    type: [OrderItemDto], 
    description: 'List of items in this order' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ 
    enum: OrderPriority, 
    description: 'Overall priority for the order',
    default: OrderPriority.ROUTINE 
  })
  @IsEnum(OrderPriority)
  @IsOptional()
  priority?: OrderPriority;

  @ApiProperty({ 
    description: 'Clinical notes related to this order',
    required: false 
  })
  @IsString()
  @IsOptional()
  clinicalNotes?: string;

  @ApiProperty({ 
    description: 'Diagnosis code related to this order',
    required: false 
  })
  @IsString()
  @IsOptional()
  diagnosisCode?: string;

  @ApiProperty({ 
    description: 'Diagnosis description',
    required: false 
  })
  @IsString()
  @IsOptional()
  diagnosisDescription?: string;

  @ApiProperty({ 
    description: 'Date and time when the order should be completed',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;
}
