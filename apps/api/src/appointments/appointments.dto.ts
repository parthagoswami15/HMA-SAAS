import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString, IsArray, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

// Define enums locally to avoid Prisma client issues
export enum BookingChannel {
  WEB = 'WEB',
  APP = 'APP',
  CALL = 'CALL',
  PARTNER = 'PARTNER',
  KIOSK = 'KIOSK',
  WALK_IN = 'WALK_IN'
}

export enum BookingStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED'
}

export enum TokenState {
  ISSUED = 'ISSUED',
  CALLED = 'CALLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  EXPIRED = 'EXPIRED'
}

// Schedule DTOs
export class CreateScheduleDto {
  @IsString()
  providerId!: string;

  @IsInt()
  @Min(0)
  @Min(6)
  dayOfWeek!: number;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  slotLength?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Min(100)
  overbookingPercentage?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateScheduleDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Min(6)
  dayOfWeek?: number;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  slotLength?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Min(100)
  overbookingPercentage?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Slot DTOs
export class CreateSlotDto {
  @IsString()
  scheduleId!: string;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class UpdateSlotDto {
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

// Booking DTOs
export class CreateBookingDto {
  @IsString()
  patientId: string;

  @IsString()
  scheduleId: string;

  @IsOptional()
  @IsString()
  slotId?: string;

  @IsOptional()
  @IsEnum(BookingChannel)
  channel?: BookingChannel;

  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isPrePaid?: boolean;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  checkInTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isPrePaid?: boolean;
}

export class BookAppointmentDto {
  @IsString()
  patientId!: string;

  @IsString()
  providerId!: string;

  @IsDateString()
  appointmentDate!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(BookingChannel)
  channel?: BookingChannel;
}

export class RescheduleBookingDto {
  @IsString()
  bookingId!: string;

  @IsDateString()
  newStartTime!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

// Token DTOs
export class CreateTokenDto {
  @IsString()
  bookingId: string;

  @IsOptional()
  @IsString()
  counterId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  tokenNumber?: number;
}

export class UpdateTokenDto {
  @IsOptional()
  @IsString()
  counterId?: string;

  @IsOptional()
  @IsEnum(TokenState)
  state?: TokenState;

  @IsOptional()
  @IsDateString()
  calledAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

// Counter DTOs
export class CreateCounterDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCounterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Reminder DTOs
export class CreateReminderDto {
  @IsString()
  bookingId!: string;

  @IsString()
  name!: string;

  @IsString()
  message: string;

  @IsDateString()
  scheduledAt: string;
}

export class UpdateReminderDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsDateString()
  sentAt?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

// Config DTOs
export class CreateAppointmentConfigDto {
  @IsString()
  key: string;

  value: any;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAppointmentConfigDto {
  @IsOptional()
  value?: any;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Query DTOs
export class ScheduleQueryDto {
  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Min(6)
  dayOfWeek?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class BookingQueryDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsEnum(BookingChannel)
  channel?: BookingChannel;
}

export class TokenQueryDto {
  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsString()
  counterId?: string;

  @IsOptional()
  @IsEnum(TokenState)
  state?: TokenState;

  @IsOptional()
  @IsInt()
  @Min(1)
  tokenNumber?: number;
}

// Workflow DTOs
export class CheckInDto {
  @IsString()
  bookingId: string;

  @IsOptional()
  @IsString()
  counterId?: string;
}

export class KioskCheckInDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  bookingNumber?: string;

  @IsOptional()
  @IsString()
  qrCode?: string;
}

export class SearchSlotsDto {
  @IsString()
  providerId: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;
}

export class GenerateQrCodeDto {
  @IsString()
  bookingId: string;

  @IsOptional()
  @IsString()
  format?: string; // 'png', 'svg', 'base64'

  @IsOptional()
  @IsInt()
  size?: number; // size in pixels
}

export class BulkRescheduleDto {
  @IsString()
  providerId: string;

  @IsDateString()
  oldDate: string;

  @IsDateString()
  newDate: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
