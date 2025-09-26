export declare class CreateNotificationDto {
    recipientId: string;
    type: string;
    title: string;
    message: string;
    channels: ('SMS' | 'EMAIL' | 'WHATSAPP' | 'IVR')[];
    data?: any;
    scheduledAt?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
export declare class UpdateNotificationDto {
    title?: string;
    message?: string;
    channels?: ('SMS' | 'EMAIL' | 'WHATSAPP' | 'IVR')[];
    data?: any;
    scheduledAt?: string;
    status?: 'PENDING' | 'SCHEDULED' | 'SENT' | 'PARTIAL' | 'FAILED' | 'CANCELLED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
export declare class NotificationQueryDto {
    type?: string;
    status?: 'PENDING' | 'SCHEDULED' | 'SENT' | 'PARTIAL' | 'FAILED' | 'CANCELLED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    fromDate?: string;
    toDate?: string;
    page?: string;
    limit?: string;
}
export declare class BulkNotificationDto {
    recipientIds: string[];
    type: string;
    title: string;
    message: string;
    channels: ('SMS' | 'EMAIL' | 'WHATSAPP' | 'IVR')[];
    data?: any;
    scheduledAt?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
export declare class NotificationResponseDto {
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
