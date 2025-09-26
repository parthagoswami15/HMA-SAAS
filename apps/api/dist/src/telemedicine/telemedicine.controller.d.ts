import { StreamableFile } from '@nestjs/common';
import { TelemedicineService } from './telemedicine.service';
import { VideoService } from './services/video.service';
import { SchedulingService } from './services/scheduling.service';
import { PrescriptionService } from './services/prescription.service';
import { PaymentService } from './services/payment.service';
import { FileService } from './services/file.service';
import { StateRestrictionService } from './services/state-restriction.service';
import { IdentityVerificationService } from './services/identity-verification.service';
import { BandwidthService } from './services/bandwidth.service';
import { NotificationService } from './services/notification.service';
import { CreateConsultationDto, UpdateConsultationDto, ConsultationQueryDto, JoinRoomDto, PrescriptionDto, FileUploadDto, PaymentDto, ScheduleDto } from './dto/telemedicine.dto';
export declare class TelemedicineController {
    private readonly telemedicineService;
    private readonly videoService;
    private readonly schedulingService;
    private readonly prescriptionService;
    private readonly paymentService;
    private readonly fileService;
    private readonly stateRestrictionService;
    private readonly identityVerificationService;
    private readonly bandwidthService;
    private readonly notificationService;
    constructor(telemedicineService: TelemedicineService, videoService: VideoService, schedulingService: SchedulingService, prescriptionService: PrescriptionService, paymentService: PaymentService, fileService: FileService, stateRestrictionService: StateRestrictionService, identityVerificationService: IdentityVerificationService, bandwidthService: BandwidthService, notificationService: NotificationService);
    createConsultation(createDto: CreateConsultationDto, req: any): Promise<any>;
    getConsultations(query: ConsultationQueryDto, req: any): Promise<{
        consultations: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getConsultation(id: string, req: any): Promise<any>;
    updateConsultation(id: string, updateDto: UpdateConsultationDto, req: any): Promise<any>;
    cancelConsultation(id: string, req: any): Promise<void>;
    joinRoom(joinDto: JoinRoomDto, req: any): Promise<{
        roomId: any;
        roomToken: any;
        quality: any;
        enableRecording: any;
        enableScreenShare: any;
    }>;
    leaveRoom(leaveDto: any, req: any): Promise<{
        success: boolean;
    }>;
    getRoomStatus(consultationId: string, req: any): Promise<{
        consultationId: string;
        roomStatus: any;
        participants: any;
        settings: {
            enableRecording: any;
            enableScreenShare: any;
            quality: any;
        };
    }>;
    startScreenShare(consultationId: string, screenShareDto: any, req: any): Promise<{
        success: boolean;
        streamId: string;
    }>;
    stopScreenShare(consultationId: string, req: any): Promise<void>;
    scheduleConsultation(scheduleDto: ScheduleDto, req: any): Promise<any>;
    getAvailability(query: any, req: any): Promise<{
        available: boolean;
        reason: string;
        doctorId?: undefined;
        date?: undefined;
        workingHours?: undefined;
        slotDuration?: undefined;
        availableSlots?: undefined;
    } | {
        doctorId: any;
        date: any;
        workingHours: {
            start: any;
            end: any;
        };
        slotDuration: any;
        availableSlots: {
            startTime: string;
            endTime: string;
            duration: any;
        }[];
        available?: undefined;
        reason?: undefined;
    }>;
    getTimeSlots(query: any, req: any): Promise<{
        startTime: string;
        endTime: string;
        duration: any;
    }[] | undefined>;
    rescheduleConsultation(id: string, rescheduleDto: any, req: any): Promise<any>;
    createPrescription(prescriptionDto: PrescriptionDto, req: any): Promise<any>;
    getConsultationPrescription(consultationId: string, req: any): Promise<any>;
    sharePrescription(id: string, shareDto: any, req: any): Promise<{
        prescriptionId: string;
        shareMethod: any;
        sharedAt: Date;
        expiresAt: Date | null;
    }>;
    getPrescriptionPdf(id: string, req: any): Promise<StreamableFile>;
    createLabOrder(labOrderDto: any, req: any): Promise<any>;
    createRadioOrder(radioOrderDto: any, req: any): Promise<any>;
    getConsultationOrders(consultationId: string, req: any): Promise<{
        labOrders: any;
        radioOrders: any;
    }>;
    processPayment(paymentDto: PaymentDto, req: any): Promise<{
        paymentId: any;
        amount: number;
        status: string;
        reference: string;
    }>;
    getPaymentStatus(consultationId: string, req: any): Promise<{
        consultationId: string;
        paymentStatus: any;
        payments: any;
        refunds: any;
        totalPaid: any;
        totalRefunded: any;
    }>;
    processRefund(consultationId: string, refundDto: any, req: any): Promise<any>;
    getPaymentMethods(req: any): Promise<{
        method: string;
        name: string;
        supported: boolean;
        fees: number;
    }[]>;
    uploadFile(file: Express.Multer.File, fileUploadDto: FileUploadDto, req: any): Promise<any>;
    getConsultationFiles(consultationId: string, req: any): Promise<any>;
    downloadFile(fileId: string, req: any): Promise<StreamableFile>;
    deleteFile(fileId: string, req: any): Promise<void>;
    getStateRestrictions(state: string, req: any): Promise<{
        state: string;
        allowed: boolean;
        restrictions: {
            restrictedDrugs: never[];
            requiredLicenses: never[];
            specialConditions: null;
            lastUpdated?: undefined;
        };
    } | {
        state: string;
        allowed: boolean;
        restrictions: {
            restrictedDrugs: any;
            requiredLicenses: any;
            specialConditions: any;
            lastUpdated: any;
        };
    }>;
    verifyIdentity(identityDto: any, req: any): Promise<{
        success: boolean;
        error: string;
        method?: undefined;
        verifiedAt?: undefined;
    } | {
        success: boolean;
        method: string;
        verifiedAt: Date;
        error: string | null;
    } | {
        success: boolean;
        method: string;
        verifiedAt: Date;
        error?: undefined;
    } | {
        verified: boolean;
        method: string;
    }>;
    getIdentityVerificationStatus(consultationId: string, req: any): Promise<{
        consultationId: string;
        required: boolean;
        reason: string;
        methods: any;
        verifications: any;
        isVerified: any;
    }>;
    testBandwidth(req: any): Promise<{
        downloadSpeed: number;
        uploadSpeed: number;
        latency: number;
        connectionType: string;
        timestamp: Date;
        quality: string;
    }>;
    updateVideoQuality(id: string, qualityDto: any, req: any): Promise<{
        success: boolean;
        quality: any;
    }>;
    getQualitySettings(req: any): Promise<{
        recentTests: any;
        averageDownload: number;
        averageLatency: number;
        recommendedQuality: string;
        qualityPresets: {
            UHD: {
                resolution: string;
                bitrate: number;
                frameRate: number;
                minBandwidth: number;
            };
            FHD: {
                resolution: string;
                bitrate: number;
                frameRate: number;
                minBandwidth: number;
            };
            HD: {
                resolution: string;
                bitrate: number;
                frameRate: number;
                minBandwidth: number;
            };
            SD: {
                resolution: string;
                bitrate: number;
                frameRate: number;
                minBandwidth: number;
            };
            AUDIO_ONLY: {
                resolution: string;
                bitrate: number;
                frameRate: number;
                minBandwidth: number;
            };
        };
    }>;
    sendConsultationNotification(consultationId: string, notificationDto: any, req: any): Promise<{
        success: boolean;
        recipients: any;
    }>;
    getConsultationReports(query: any, req: any): Promise<{
        period: {
            from: any;
            to: any;
        };
        summary: any;
        consultations: any;
    }>;
    getRevenueReports(query: any, req: any): Promise<{
        period: {
            from: any;
            to: any;
        };
        revenue: any;
        consultations: any;
    }>;
    getPatientSatisfaction(query: any, req: any): Promise<{
        period: {
            from: any;
            to: any;
        };
        satisfaction: any;
        consultations: any;
    }>;
    createEmergencyConsultation(emergencyDto: any, req: any): Promise<any>;
    getEmergencyQueue(req: any): Promise<any>;
    startRecording(consultationId: string, req: any): Promise<any>;
    stopRecording(consultationId: string, req: any): Promise<any>;
    getRecording(consultationId: string, req: any): Promise<any>;
}
