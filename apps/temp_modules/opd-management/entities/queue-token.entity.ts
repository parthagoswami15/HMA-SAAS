import { ApiProperty } from '@nestjs/swagger';
import { QueuePriority } from '../enums/visit.enum';

export enum TokenStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export class QueueToken {
  @ApiProperty({ description: 'Unique identifier for the queue token' })
  id: string;

  @ApiProperty({ description: 'Visit ID this token is associated with' })
  visitId: string;

  @ApiProperty({ description: 'Facility ID where the token is issued' })
  facilityId: string;

  @ApiProperty({ description: 'Department/Service point ID' })
  departmentId: string;

  @ApiProperty({ description: 'Token number (display number)' })
  tokenNumber: string;

  @ApiProperty({ description: 'Display name for the token (e.g., A001, B012)' })
  displayNumber: string;

  @ApiProperty({ enum: QueuePriority, default: QueuePriority.NORMAL })
  priority: QueuePriority;

  @ApiProperty({ enum: TokenStatus, default: TokenStatus.WAITING })
  status: TokenStatus;

  @ApiProperty({ description: 'Estimated wait time in minutes', required: false })
  estimatedWaitTime?: number;

  @ApiProperty({ description: 'Date and time when the token was issued', type: Date })
  issuedAt: Date;

  @ApiProperty({ description: 'Date and time when the token was called', type: Date, required: false })
  calledAt?: Date;

  @ApiProperty({ description: 'Date and time when the token was served', type: Date, required: false })
  servedAt?: Date;

  @ApiProperty({ description: 'Date and time when the token was completed', type: Date, required: false })
  completedAt?: Date;

  @ApiProperty({ description: 'Staff ID who called/served the token', required: false })
  servedById?: string;

  @ApiProperty({ description: 'Additional notes about the token', required: false })
  notes?: string;

  @ApiProperty({ description: 'Date and time when the record was created', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the record was last updated', type: Date })
  updatedAt: Date;
}

export class QueueStats {
  @ApiProperty({ description: 'Total number of tokens in the queue' })
  total: number;

  @ApiProperty({ description: 'Number of waiting tokens' })
  waiting: number;

  @ApiProperty({ description: 'Number of in-progress tokens' })
  inProgress: number;

  @ApiProperty({ description: 'Average wait time in minutes' })
  averageWaitTime: number;

  @ApiProperty({ description: 'Estimated wait time for new tokens in minutes' })
  estimatedWaitTime: number;
}
