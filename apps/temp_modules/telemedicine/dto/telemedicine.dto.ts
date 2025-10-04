import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean, IsNumber, IsArray, IsObject, Min, Max } from 'class-validator';

export class CreateConsultationDto {
  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(120)
  duration?: number;

  @IsEnum(['GENERAL', 'SPECIALIST', 'FOLLOW_UP', 'EMERGENCY', 'MENTAL_HEALTH'])
  consultationType: 'GENERAL' | 'SPECIALIST' | 'FOLLOW_UP' | 'EMERGENCY' | 'MENTAL_HEALTH';

  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;

  @IsOptional()
  @IsBoolean()
  isPrescriptionRequired?: boolean;

  @IsOptional()
  @IsEnum(['PRE_PAID', 'POST_PAID'])
  paymentMode?: 'PRE_PAID' | 'POST_PAID';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class UpdateConsultationDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(120)
  duration?: number;

  @IsOptional()
  @IsEnum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}

export class ConsultationQueryDto {
  @IsOptional()
  @IsEnum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

  @IsOptional()
  @IsEnum(['GENERAL', 'SPECIALIST', 'FOLLOW_UP', 'EMERGENCY', 'MENTAL_HEALTH'])
  consultationType?: 'GENERAL' | 'SPECIALIST' | 'FOLLOW_UP' | 'EMERGENCY' | 'MENTAL_HEALTH';

  @IsOptional()
  @IsString()
  doctorId?: string;

  @IsOptional()
  @IsString()
  patientId?: string;

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

export class JoinRoomDto {
  @IsString()
  consultationId: string;

  @IsEnum(['DOCTOR', 'PATIENT'])
  userType: 'DOCTOR' | 'PATIENT';

  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @IsOptional()
  @IsString()
  networkInfo?: string;
}

export class ScheduleDto {
  @IsString()
  doctorId: string;

  @IsDateString()
  date: string;

  @IsString()
  timeSlot: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(120)
  duration?: number;

  @IsOptional()
  @IsEnum(['GENERAL', 'SPECIALIST', 'FOLLOW_UP', 'EMERGENCY', 'MENTAL_HEALTH'])
  consultationType?: 'GENERAL' | 'SPECIALIST' | 'FOLLOW_UP' | 'EMERGENCY' | 'MENTAL_HEALTH';

  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;
}

export class PrescriptionDto {
  @IsString()
  consultationId: string;

  @IsArray()
  @IsObject({ each: true })
  medications: Array<{
    drugName: string;
    genericName?: string;
    strength: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions?: string;
    isScheduledDrug?: boolean;
    scheduleCategory?: string;
  }>;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labTests?: string[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  imaging?: Array<{
    type: string;
    bodyPart: string;
    priority: string;
    notes?: string;
  }>;
}

export class FileUploadDto {
  @IsString()
  consultationId: string;

  @IsEnum(['PRESCRIPTION', 'LAB_REPORT', 'IMAGING', 'CONSULTATION_NOTES', 'OTHER'])
  fileType: 'PRESCRIPTION' | 'LAB_REPORT' | 'IMAGING' | 'CONSULTATION_NOTES' | 'OTHER';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}

export class PaymentDto {
  @IsString()
  consultationId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET', 'INSURANCE'])
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'INSURANCE';

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsObject()
  paymentDetails?: any;
}

export class CreateNotificationDto {
  @IsString()
  consultationId: string;

  @IsEnum(['REMINDER', 'FOLLOW_UP', 'PRESCRIPTION_READY', 'REPORT_READY', 'PAYMENT_DUE'])
  notificationType: 'REMINDER' | 'FOLLOW_UP' | 'PRESCRIPTION_READY' | 'REPORT_READY' | 'PAYMENT_DUE';

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(['SMS', 'EMAIL', 'WHATSAPP', 'PUSH'])
  channels?: ('SMS' | 'EMAIL' | 'WHATSAPP' | 'PUSH')[];
}

export class VideoQualityDto {
  @IsEnum(['SD', 'HD', 'FHD', 'UHD'])
  quality: 'SD' | 'HD' | 'FHD' | 'UHD';

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(2000)
  maxBitrate?: number;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(60)
  maxFrameRate?: number;
}

export class BandwidthTestDto {
  @IsOptional()
  @IsNumber()
  downloadSpeed?: number;

  @IsOptional()
  @IsNumber()
  uploadSpeed?: number;

  @IsOptional()
  @IsNumber()
  latency?: number;

  @IsOptional()
  @IsString()
  connectionType?: string;
}
