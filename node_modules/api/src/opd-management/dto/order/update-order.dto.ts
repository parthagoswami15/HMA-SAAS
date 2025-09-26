import { PartialType } from '@nestjs/swagger';
import { 
  CreateOrderDto, 
  OrderItemDto, 
  OrderPriority,
  OrderItemType
} from './create-order.dto';
import { 
  ApiProperty, 
  ApiPropertyOptional 
} from '@nestjs/swagger';
import { 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsEnum, 
  IsDateString,
  IsString,
  IsNumber,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED'
}

export class UpdateOrderItemDto extends OrderItemDto {
  @ApiPropertyOptional({ description: 'ID of the order item (for updates)' })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ 
    enum: OrderStatus,
    description: 'Status of the order item',
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({ 
    description: 'Result or findings for this order item',
    required: false 
  })
  @IsString()
  @IsOptional()
  result?: string;

  @ApiPropertyOptional({ 
    description: 'Date and time when the item was completed',
    type: Date,
    required: false 
  })
  @IsDateString()
  @IsOptional()
  completedAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Staff ID who completed this item',
    required: false 
  })
  @IsString()
  @IsOptional()
  completedById?: string;

  @ApiPropertyOptional({ 
    description: 'Notes about this order item',
    required: false 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiPropertyOptional({ 
    enum: OrderStatus,
    description: 'Status of the order',
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({ 
    type: [UpdateOrderItemDto],
    description: 'List of order items to update',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @IsOptional()
  items?: UpdateOrderItemDto[];

  @ApiPropertyOptional({ 
    description: 'Date and time when the order was completed',
    type: Date,
    required: false 
  })
  @IsDateString()
  @IsOptional()
  completedAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Staff ID who completed the order',
    required: false 
  })
  @IsString()
  @IsOptional()
  completedById?: string;

  @ApiPropertyOptional({ 
    description: 'Reason for cancellation if applicable',
    required: false 
  })
  @IsString()
  @IsOptional()
  cancellationReason?: string;

  @ApiPropertyOptional({ 
    description: 'Date and time when the order was cancelled',
    type: Date,
    required: false 
  })
  @IsDateString()
  @IsOptional()
  cancelledAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Staff ID who cancelled the order',
    required: false 
  })
  @IsString()
  @IsOptional()
  cancelledById?: string;
}
