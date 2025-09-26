import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED'
}

export enum OrderPriority {
  ROUTINE = 'ROUTINE',
  URGENT = 'URGENT',
  STAT = 'STAT',
  ASAP = 'ASAP'
}

export enum OrderType {
  LAB_TEST = 'LAB_TEST',
  RADIOLOGY = 'RADIOLOGY',
  PROCEDURE = 'PROCEDURE',
  MEDICATION = 'MEDICATION',
  CONSULT = 'CONSULT',
  NURSING = 'NURSING',
  OTHER = 'OTHER'
}

export class OrderItem {
  @ApiProperty({ description: 'Unique identifier for the order item' })
  id: string;

  @ApiProperty({ description: 'ID of the item being ordered' })
  itemId: string;

  @ApiProperty({ description: 'Name of the item being ordered' })
  itemName: string;

  @ApiProperty({ enum: OrderType, description: 'Type of order item' })
  itemType: OrderType;

  @ApiProperty({ description: 'Quantity of the item', default: 1 })
  quantity: number;

  @ApiProperty({ description: 'Instructions for this order item', required: false })
  instructions?: string;

  @ApiProperty({ enum: OrderStatus, default: OrderStatus.REQUESTED })
  status: OrderStatus;

  @ApiProperty({ description: 'Result or findings for this order item', required: false })
  result?: string;

  @ApiProperty({ description: 'Date and time when the item was completed', type: Date, required: false })
  completedAt?: Date;

  @ApiProperty({ description: 'Staff ID who completed this item', required: false })
  completedById?: string;

  @ApiProperty({ description: 'Notes about this order item', required: false })
  notes?: string;
}

export class Order {
  @ApiProperty({ description: 'Unique identifier for the order' })
  id: string;

  @ApiProperty({ description: 'Visit ID this order is associated with' })
  visitId: string;

  @ApiProperty({ description: 'Patient ID this order is for' })
  patientId: string;

  @ApiProperty({ description: 'Provider (staff) ID who created this order' })
  providerId: string;

  @ApiProperty({ description: 'Facility ID where the order was created' })
  facilityId: string;

  @ApiProperty({ description: 'Department ID where the order was created' })
  departmentId: string;

  @ApiProperty({ type: [OrderItem], description: 'List of items in this order' })
  items: OrderItem[];

  @ApiProperty({ enum: OrderStatus, default: OrderStatus.REQUESTED })
  status: OrderStatus;

  @ApiProperty({ enum: OrderPriority, default: OrderPriority.ROUTINE })
  priority: OrderPriority;

  @ApiProperty({ description: 'Clinical notes related to this order', required: false })
  clinicalNotes?: string;

  @ApiProperty({ description: 'Diagnosis code related to this order', required: false })
  diagnosisCode?: string;

  @ApiProperty({ description: 'Diagnosis description', required: false })
  diagnosisDescription?: string;

  @ApiProperty({ description: 'Date and time when the order was created', type: Date })
  orderDate: Date;

  @ApiProperty({ description: 'Date and time when the order was completed', type: Date, required: false })
  completedAt?: Date;

  @ApiProperty({ description: 'Staff ID who completed the order', required: false })
  completedById?: string;

  @ApiProperty({ description: 'Additional notes about the order', required: false })
  notes?: string;

  @ApiProperty({ description: 'Date and time when the record was created', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the record was last updated', type: Date })
  updatedAt: Date;
}
