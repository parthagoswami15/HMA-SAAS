import { PrismaService } from '../prisma/prisma.service';
import { VideoService } from './services/video.service';
import { SchedulingService } from './services/scheduling.service';
import { PrescriptionService } from './services/prescription.service';
import { PaymentService } from './services/payment.service';
import { FileService } from './services/file.service';
import { StateRestrictionService } from './services/state-restriction.service';
import { IdentityVerificationService } from './services/identity-verification.service';
import { BandwidthService } from './services/bandwidth.service';
import { NotificationService } from './services/notification.service';
import { AuditService } from '../audit/audit.service';
import { CreateConsultationDto, UpdateConsultationDto, ConsultationQueryDto } from './dto/telemedicine.dto';
export declare class TelemedicineService {
    private readonly prisma;
    private readonly videoService;
    private readonly schedulingService;
    private readonly prescriptionService;
    private readonly paymentService;
    private readonly fileService;
    private readonly stateRestrictionService;
    private readonly identityVerificationService;
    private readonly bandwidthService;
    private readonly notificationService;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, videoService: VideoService, schedulingService: SchedulingService, prescriptionService: PrescriptionService, paymentService: PaymentService, fileService: FileService, stateRestrictionService: StateRestrictionService, identityVerificationService: IdentityVerificationService, bandwidthService: BandwidthService, notificationService: NotificationService, auditService: AuditService);
    createConsultation(createDto: CreateConsultationDto, user: any): Promise<any>;
    updateConsultation(id: string, updateDto: UpdateConsultationDto, user: any): Promise<any>;
    cancelConsultation(id: string, user: any): Promise<any>;
    getConsultations(query: ConsultationQueryDto, user: any): Promise<{
        consultations: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getConsultation(id: string, user: any): Promise<any>;
    startConsultation(id: string, user: any): Promise<any>;
    completeConsultation(id: string, completionDto: any, user: any): Promise<any>;
    createLabOrder(labOrderDto: any, user: any): Promise<any>;
    createRadioOrder(radioOrderDto: any, user: any): Promise<any>;
    getConsultationOrders(consultationId: string, user: any): Promise<{
        labOrders: any;
        radioOrders: any;
    }>;
    getConsultationReports(query: any, user: any): Promise<{
        period: {
            from: any;
            to: any;
        };
        summary: any;
        consultations: any;
    }>;
    getRevenueReports(query: any, user: any): Promise<{
        period: {
            from: any;
            to: any;
        };
        revenue: any;
        consultations: any;
    }>;
    getPatientSatisfaction(query: any, user: any): Promise<{
        period: {
            from: any;
            to: any;
        };
        satisfaction: any;
        consultations: any;
    }>;
    createEmergencyConsultation(emergencyDto: any, user: any): Promise<any>;
    getEmergencyQueue(user: any): Promise<any>;
}
