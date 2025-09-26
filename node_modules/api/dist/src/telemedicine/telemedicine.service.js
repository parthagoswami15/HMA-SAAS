"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TelemedicineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemedicineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const video_service_1 = require("./services/video.service");
const scheduling_service_1 = require("./services/scheduling.service");
const prescription_service_1 = require("./services/prescription.service");
const payment_service_1 = require("./services/payment.service");
const file_service_1 = require("./services/file.service");
const state_restriction_service_1 = require("./services/state-restriction.service");
const identity_verification_service_1 = require("./services/identity-verification.service");
const bandwidth_service_1 = require("./services/bandwidth.service");
const notification_service_1 = require("./services/notification.service");
const audit_service_1 = require("../audit/audit.service");
let TelemedicineService = TelemedicineService_1 = class TelemedicineService {
    prisma;
    videoService;
    schedulingService;
    prescriptionService;
    paymentService;
    fileService;
    stateRestrictionService;
    identityVerificationService;
    bandwidthService;
    notificationService;
    auditService;
    logger = new common_1.Logger(TelemedicineService_1.name);
    constructor(prisma, videoService, schedulingService, prescriptionService, paymentService, fileService, stateRestrictionService, identityVerificationService, bandwidthService, notificationService, auditService) {
        this.prisma = prisma;
        this.videoService = videoService;
        this.schedulingService = schedulingService;
        this.prescriptionService = prescriptionService;
        this.paymentService = paymentService;
        this.fileService = fileService;
        this.stateRestrictionService = stateRestrictionService;
        this.identityVerificationService = identityVerificationService;
        this.bandwidthService = bandwidthService;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }
    async createConsultation(createDto, user) {
        this.logger.log(`Creating telemedicine consultation for patient ${createDto.patientId}`);
        const patient = await this.prisma.patient.findUnique({
            where: { id: createDto.patientId },
            include: { telemedicinePreferences: true },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (!patient.telemedicinePreferences?.telemedicineEnabled) {
            throw new common_1.BadRequestException('Patient has not enabled telemedicine services');
        }
        const doctorAvailability = await this.schedulingService.checkDoctorAvailability(createDto.doctorId, createDto.scheduledAt);
        if (!doctorAvailability.available) {
            throw new common_1.BadRequestException('Doctor is not available at the scheduled time');
        }
        if (createDto.isPrescriptionRequired) {
            await this.stateRestrictionService.validatePrescriptionRestrictions(patient.state, user.id);
        }
        const consultation = await this.prisma.telemedicineConsultation.create({
            data: {
                patientId: createDto.patientId,
                doctorId: createDto.doctorId,
                scheduledAt: new Date(createDto.scheduledAt),
                duration: createDto.duration || 30,
                consultationType: createDto.consultationType,
                isEmergency: createDto.isEmergency || false,
                isPrescriptionRequired: createDto.isPrescriptionRequired || false,
                paymentMode: createDto.paymentMode || 'POST_PAID',
                status: 'SCHEDULED',
                notes: createDto.notes,
                createdBy: user.id,
                tenantId: user.tenantId,
            },
        });
        await this.videoService.createRoom(consultation.id, {
            maxParticipants: 2,
            enableRecording: true,
            enableScreenShare: true,
            quality: 'HD',
        });
        await this.notificationService.scheduleConsultationReminders(consultation.id);
        await this.auditService.logActivity({
            action: 'TELEMEDICINE_CONSULTATION_CREATED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: consultation.id,
            userId: user.id,
            details: {
                patientId: createDto.patientId,
                doctorId: createDto.doctorId,
                scheduledAt: createDto.scheduledAt,
                consultationType: createDto.consultationType,
            },
        });
        return consultation;
    }
    async updateConsultation(id, updateDto, user) {
        this.logger.log(`Updating telemedicine consultation ${id}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cannot update completed consultation');
        }
        const oldValues = { ...consultation };
        const updatedConsultation = await this.prisma.telemedicineConsultation.update({
            where: { id },
            data: {
                ...updateDto,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'TELEMEDICINE_CONSULTATION_UPDATED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: id,
            userId: user.id,
            oldValues,
            newValues: updatedConsultation,
        });
        return updatedConsultation;
    }
    async cancelConsultation(id, user) {
        this.logger.log(`Cancelling telemedicine consultation ${id}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cannot cancel completed consultation');
        }
        const updatedConsultation = await this.prisma.telemedicineConsultation.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
                cancelledBy: user.id,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.videoService.closeRoom(id);
        await this.notificationService.cancelConsultationNotifications(id);
        if (consultation.paymentStatus === 'PAID') {
            await this.paymentService.processRefund(id, { reason: 'Consultation cancelled' }, user);
        }
        await this.auditService.logActivity({
            action: 'TELEMEDICINE_CONSULTATION_CANCELLED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: id,
            userId: user.id,
            details: { reason: 'User cancelled consultation' },
        });
        return updatedConsultation;
    }
    async getConsultations(query, user) {
        const { status, consultationType, doctorId, patientId, fromDate, toDate, page = '1', limit = '20', } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {
            tenantId: user.tenantId,
        };
        if (status)
            where.status = status;
        if (consultationType)
            where.consultationType = consultationType;
        if (doctorId)
            where.doctorId = doctorId;
        if (patientId)
            where.patientId = patientId;
        if (fromDate || toDate) {
            where.scheduledAt = {};
            if (fromDate)
                where.scheduledAt.gte = new Date(fromDate);
            if (toDate)
                where.scheduledAt.lte = new Date(toDate);
        }
        const [consultations, total] = await Promise.all([
            this.prisma.telemedicineConsultation.findMany({
                where,
                include: {
                    patient: {
                        select: { id: true, name: true, phone: true, email: true },
                    },
                    doctor: {
                        select: { id: true, name: true, specialization: true },
                    },
                    prescriptions: true,
                    payments: true,
                },
                orderBy: { scheduledAt: 'desc' },
                skip,
                take: limitNum,
            }),
            this.prisma.telemedicineConsultation.count({ where }),
        ]);
        return {
            consultations,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        };
    }
    async getConsultation(id, user) {
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                        dateOfBirth: true,
                        gender: true,
                        address: true,
                        state: true,
                    },
                },
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        specialization: true,
                        licenseNumber: true,
                    },
                },
                prescriptions: {
                    include: {
                        medications: true,
                    },
                },
                payments: true,
                files: true,
                labOrders: true,
                radioOrders: true,
                recordings: true,
            },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        return consultation;
    }
    async startConsultation(id, user) {
        this.logger.log(`Starting telemedicine consultation ${id}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.status !== 'SCHEDULED') {
            throw new common_1.BadRequestException('Consultation is not scheduled');
        }
        const updatedConsultation = await this.prisma.telemedicineConsultation.update({
            where: { id },
            data: {
                status: 'IN_PROGRESS',
                startedAt: new Date(),
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.videoService.openRoom(id);
        await this.auditService.logActivity({
            action: 'TELEMEDICINE_CONSULTATION_STARTED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: id,
            userId: user.id,
        });
        return updatedConsultation;
    }
    async completeConsultation(id, completionDto, user) {
        this.logger.log(`Completing telemedicine consultation ${id}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.status !== 'IN_PROGRESS') {
            throw new common_1.BadRequestException('Consultation is not in progress');
        }
        const updatedConsultation = await this.prisma.telemedicineConsultation.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                notes: completionDto.notes,
                rating: completionDto.rating,
                feedback: completionDto.feedback,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.videoService.closeRoom(id);
        if (consultation.paymentMode === 'POST_PAID' && consultation.paymentStatus !== 'PAID') {
            await this.paymentService.processPostPayment(id, completionDto.paymentDetails);
        }
        if (consultation.isPrescriptionRequired && !completionDto.prescriptionId) {
            await this.prescriptionService.generateFinalPrescription(id, user);
        }
        await this.auditService.logActivity({
            action: 'TELEMEDICINE_CONSULTATION_COMPLETED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: id,
            userId: user.id,
            details: { rating: completionDto.rating, feedback: completionDto.feedback },
        });
        return updatedConsultation;
    }
    async createLabOrder(labOrderDto, user) {
        this.logger.log(`Creating lab order for consultation ${labOrderDto.consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: labOrderDto.consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const labOrder = await this.prisma.labOrder.create({
            data: {
                consultationId: labOrderDto.consultationId,
                patientId: consultation.patientId,
                doctorId: consultation.doctorId,
                tests: labOrderDto.tests,
                priority: labOrderDto.priority || 'ROUTINE',
                notes: labOrderDto.notes,
                status: 'ORDERED',
                createdBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'LAB_ORDER_CREATED',
            entityType: 'LAB_ORDER',
            entityId: labOrder.id,
            userId: user.id,
            details: { consultationId: labOrderDto.consultationId, tests: labOrderDto.tests },
        });
        return labOrder;
    }
    async createRadioOrder(radioOrderDto, user) {
        this.logger.log(`Creating radiology order for consultation ${radioOrderDto.consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: radioOrderDto.consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const radioOrder = await this.prisma.radioOrder.create({
            data: {
                consultationId: radioOrderDto.consultationId,
                patientId: consultation.patientId,
                doctorId: consultation.doctorId,
                imagingType: radioOrderDto.imagingType,
                bodyPart: radioOrderDto.bodyPart,
                priority: radioOrderDto.priority || 'ROUTINE',
                notes: radioOrderDto.notes,
                status: 'ORDERED',
                createdBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'RADIO_ORDER_CREATED',
            entityType: 'RADIO_ORDER',
            entityId: radioOrder.id,
            userId: user.id,
            details: { consultationId: radioOrderDto.consultationId, imagingType: radioOrderDto.imagingType },
        });
        return radioOrder;
    }
    async getConsultationOrders(consultationId, user) {
        const [labOrders, radioOrders] = await Promise.all([
            this.prisma.labOrder.findMany({
                where: { consultationId },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.radioOrder.findMany({
                where: { consultationId },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return {
            labOrders,
            radioOrders,
        };
    }
    async getConsultationReports(query, user) {
        const { fromDate, toDate, doctorId, consultationType } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate)
            where.scheduledAt = { ...where.scheduledAt, gte: new Date(fromDate) };
        if (toDate)
            where.scheduledAt = { ...where.scheduledAt, lte: new Date(toDate) };
        if (doctorId)
            where.doctorId = doctorId;
        if (consultationType)
            where.consultationType = consultationType;
        const consultations = await this.prisma.telemedicineConsultation.findMany({
            where,
            include: {
                patient: { select: { id: true, name: true } },
                doctor: { select: { id: true, name: true } },
            },
        });
        const reportData = consultations.reduce((acc, consultation) => {
            acc.totalConsultations++;
            if (consultation.status === 'COMPLETED')
                acc.completed++;
            if (consultation.status === 'CANCELLED')
                acc.cancelled++;
            if (consultation.isEmergency)
                acc.emergency++;
            if (consultation.isPrescriptionRequired)
                acc.withPrescriptions++;
            acc.byType[consultation.consultationType] = (acc.byType[consultation.consultationType] || 0) + 1;
            acc.byDoctor[consultation.doctorId] = (acc.byDoctor[consultation.doctorId] || 0) + 1;
            return acc;
        }, {
            totalConsultations: 0,
            completed: 0,
            cancelled: 0,
            emergency: 0,
            withPrescriptions: 0,
            byType: {},
            byDoctor: {},
        });
        return {
            period: { from: fromDate, to: toDate },
            summary: reportData,
            consultations,
        };
    }
    async getRevenueReports(query, user) {
        const { fromDate, toDate } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate)
            where.completedAt = { ...where.completedAt, gte: new Date(fromDate) };
        if (toDate)
            where.completedAt = { ...where.completedAt, lte: new Date(toDate) };
        const consultations = await this.prisma.telemedicineConsultation.findMany({
            where: { ...where, status: 'COMPLETED' },
            include: { payments: true },
        });
        const revenueData = consultations.reduce((acc, consultation) => {
            const consultationRevenue = consultation.payments.reduce((sum, payment) => sum + payment.amount, 0);
            acc.totalRevenue += consultationRevenue;
            acc.totalConsultations++;
            acc.averageRevenuePerConsultation = acc.totalRevenue / acc.totalConsultations;
            if (consultation.paymentMode === 'PRE_PAID')
                acc.prePaid++;
            if (consultation.paymentMode === 'POST_PAID')
                acc.postPaid++;
            return acc;
        }, {
            totalRevenue: 0,
            totalConsultations: 0,
            averageRevenuePerConsultation: 0,
            prePaid: 0,
            postPaid: 0,
        });
        return {
            period: { from: fromDate, to: toDate },
            revenue: revenueData,
            consultations,
        };
    }
    async getPatientSatisfaction(query, user) {
        const { fromDate, toDate } = query;
        const where = { tenantId: user.tenantId };
        if (fromDate)
            where.completedAt = { ...where.completedAt, gte: new Date(fromDate) };
        if (toDate)
            where.completedAt = { ...where.completedAt, lte: new Date(toDate) };
        const consultations = await this.prisma.telemedicineConsultation.findMany({
            where: { ...where, status: 'COMPLETED', rating: { not: null } },
        });
        const satisfactionData = consultations.reduce((acc, consultation) => {
            acc.totalRatings++;
            acc.averageRating += consultation.rating || 0;
            if (consultation.rating === 5)
                acc.fiveStar++;
            if (consultation.rating === 4)
                acc.fourStar++;
            if (consultation.rating === 3)
                acc.threeStar++;
            if (consultation.rating === 2)
                acc.twoStar++;
            if (consultation.rating === 1)
                acc.oneStar++;
            return acc;
        }, {
            totalRatings: 0,
            averageRating: 0,
            fiveStar: 0,
            fourStar: 0,
            threeStar: 0,
            twoStar: 0,
            oneStar: 0,
        });
        if (satisfactionData.totalRatings > 0) {
            satisfactionData.averageRating = satisfactionData.averageRating / satisfactionData.totalRatings;
        }
        return {
            period: { from: fromDate, to: toDate },
            satisfaction: satisfactionData,
            consultations,
        };
    }
    async createEmergencyConsultation(emergencyDto, user) {
        this.logger.log(`Creating emergency telemedicine consultation`);
        const emergencyDoctor = await this.schedulingService.findEmergencyDoctor(user.tenantId);
        if (!emergencyDoctor) {
            throw new common_1.BadRequestException('No emergency doctors available');
        }
        const consultation = await this.prisma.telemedicineConsultation.create({
            data: {
                patientId: emergencyDto.patientId,
                doctorId: emergencyDoctor.id,
                scheduledAt: new Date(),
                duration: 60,
                consultationType: 'EMERGENCY',
                isEmergency: true,
                isPrescriptionRequired: emergencyDto.isPrescriptionRequired || false,
                paymentMode: 'POST_PAID',
                status: 'IN_PROGRESS',
                notes: emergencyDto.notes,
                symptoms: emergencyDto.symptoms,
                severity: emergencyDto.severity,
                createdBy: user.id,
                tenantId: user.tenantId,
            },
        });
        await this.videoService.createEmergencyRoom(consultation.id);
        await this.notificationService.notifyEmergencyConsultation(consultation.id, emergencyDoctor.id);
        await this.auditService.logActivity({
            action: 'EMERGENCY_CONSULTATION_CREATED',
            entityType: 'TELEMEDICINE_CONSULTATION',
            entityId: consultation.id,
            userId: user.id,
            details: {
                patientId: emergencyDto.patientId,
                symptoms: emergencyDto.symptoms,
                severity: emergencyDto.severity,
            },
        });
        return consultation;
    }
    async getEmergencyQueue(user) {
        const emergencyConsultations = await this.prisma.telemedicineConsultation.findMany({
            where: {
                tenantId: user.tenantId,
                isEmergency: true,
                status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
            },
            include: {
                patient: { select: { id: true, name: true, phone: true } },
                doctor: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        return emergencyConsultations;
    }
};
exports.TelemedicineService = TelemedicineService;
exports.TelemedicineService = TelemedicineService = TelemedicineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        video_service_1.VideoService,
        scheduling_service_1.SchedulingService,
        prescription_service_1.PrescriptionService,
        payment_service_1.PaymentService,
        file_service_1.FileService,
        state_restriction_service_1.StateRestrictionService,
        identity_verification_service_1.IdentityVerificationService,
        bandwidth_service_1.BandwidthService,
        notification_service_1.NotificationService,
        audit_service_1.AuditService])
], TelemedicineService);
//# sourceMappingURL=telemedicine.service.js.map