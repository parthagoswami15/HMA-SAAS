export declare class CreateConsultationDto {
    patientId: string;
    doctorId: string;
    scheduledAt: string;
    duration?: number;
    consultationType: 'GENERAL' | 'SPECIALIST' | 'FOLLOW_UP' | 'EMERGENCY' | 'MENTAL_HEALTH';
    isEmergency?: boolean;
    isPrescriptionRequired?: boolean;
    paymentMode?: 'PRE_PAID' | 'POST_PAID';
    notes?: string;
    symptoms?: string[];
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
export declare class UpdateConsultationDto {
    scheduledAt?: string;
    duration?: number;
    status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    notes?: string;
    rating?: number;
    feedback?: string;
}
export declare class ConsultationQueryDto {
    status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    consultationType?: 'GENERAL' | 'SPECIALIST' | 'FOLLOW_UP' | 'EMERGENCY' | 'MENTAL_HEALTH';
    doctorId?: string;
    patientId?: string;
    fromDate?: string;
    toDate?: string;
    page?: string;
    limit?: string;
}
export declare class JoinRoomDto {
    consultationId: string;
    userType: 'DOCTOR' | 'PATIENT';
    deviceInfo?: string;
    networkInfo?: string;
}
export declare class ScheduleDto {
    doctorId: string;
    date: string;
    timeSlot: string;
    duration?: number;
    consultationType?: 'GENERAL' | 'SPECIALIST' | 'FOLLOW_UP' | 'EMERGENCY' | 'MENTAL_HEALTH';
    isEmergency?: boolean;
}
export declare class PrescriptionDto {
    consultationId: string;
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
    diagnosis?: string;
    notes?: string;
    isEmergency?: boolean;
    labTests?: string[];
    imaging?: Array<{
        type: string;
        bodyPart: string;
        priority: string;
        notes?: string;
    }>;
}
export declare class FileUploadDto {
    consultationId: string;
    fileType: 'PRESCRIPTION' | 'LAB_REPORT' | 'IMAGING' | 'CONSULTATION_NOTES' | 'OTHER';
    description?: string;
    isPrivate?: boolean;
}
export declare class PaymentDto {
    consultationId: string;
    amount: number;
    paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'INSURANCE';
    paymentReference?: string;
    paymentDetails?: any;
}
export declare class CreateNotificationDto {
    consultationId: string;
    notificationType: 'REMINDER' | 'FOLLOW_UP' | 'PRESCRIPTION_READY' | 'REPORT_READY' | 'PAYMENT_DUE';
    message?: string;
    scheduledAt?: string;
    channels?: ('SMS' | 'EMAIL' | 'WHATSAPP' | 'PUSH')[];
}
export declare class VideoQualityDto {
    quality: 'SD' | 'HD' | 'FHD' | 'UHD';
    maxBitrate?: number;
    maxFrameRate?: number;
}
export declare class BandwidthTestDto {
    downloadSpeed?: number;
    uploadSpeed?: number;
    latency?: number;
    connectionType?: string;
}
