import { IsString, IsOptional, IsArray, IsEnum, IsDateString, IsObject, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  recipientId: string;

  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsArray()
  @IsEnum(['SMS', 'EMAIL', 'WHATSAPP', 'IVR'], { each: true })
  channels: ('SMS' | 'EMAIL' | 'WHATSAPP' | 'IVR')[];

  @IsOptional()
  @IsObject()
  data?: any;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(['SMS', 'EMAIL', 'WHATSAPP', 'IVR'], { each: true })
  channels?: ('SMS' | 'EMAIL' | 'WHATSAPP' | 'IVR')[];

  @IsOptional()
  @IsObject()
  data?: any;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'SCHEDULED', 'SENT', 'PARTIAL', 'FAILED', 'CANCELLED'])
  status?: 'PENDING' | 'SCHEDULED' | 'SENT' | 'PARTIAL' | 'FAILED' | 'CANCELLED';

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export class NotificationQueryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'SCHEDULED', 'SENT', 'PARTIAL', 'FAILED', 'CANCELLED'])
  status?: 'PENDING' | 'SCHEDULED' | 'SENT' | 'PARTIAL' | 'FAILED' | 'CANCELLED';

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

export class BulkNotificationDto {
  @IsArray()
  @IsString({ each: true })
  recipientIds: string[];

  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsArray()
  @IsEnum(['SMS', 'EMAIL', 'WHATSAPP', 'IVR'], { each: true })
  channels: ('SMS' | 'EMAIL' | 'WHATSAPP' | 'IVR')[];

  @IsOptional()
  @IsObject()
  data?: any;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export class NotificationResponseDto {
  id: string;
  recipientId: string;
  tenantId: string;
  type: string;
  title: string;
  message: string;
  channels: string[];
  data?: any;
  scheduledAt?: Date;
  priority: string;
  status: string;
  sentAt?: Date;
  readAt?: Date;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
