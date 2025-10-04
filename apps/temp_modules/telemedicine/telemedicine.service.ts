import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
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
import {
  CreateConsultationDto,
  UpdateConsultationDto,
  ConsultationQueryDto,
} from './dto/telemedicine.dto';

@Injectable()
export class TelemedicineService {
  private readonly logger = new Logger(TelemedicineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly videoService: VideoService,
    private readonly schedulingService: SchedulingService,
    private readonly prescriptionService: PrescriptionService,
    private readonly paymentService: PaymentService,
    private readonly fileService: FileService,
    private readonly stateRestrictionService: StateRestrictionService,
    private readonly identityVerificationService: IdentityVerificationService,
    private readonly bandwidthService: BandwidthService,
    private readonly notificationService: NotificationService,
    private readonly auditService: AuditService,
  ) {}

  async createConsultation(createDto: CreateConsultationDto, user: any) {
    this.logger.log(`Creating telemedicine consultation for patient ${createDto.patientId}`);

    // Validate patient exists and has telemedicine access
    const patient = await this.prisma.patient.findUnique({
      where: { id: createDto.patientId },
      // include: { telemedicinePreferences: true },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Check if patient has opted for telemedicine
    // if (!patient.telemedicinePreferences?.telemedicineEnabled) {
    if (false) { // TODO: Implement telemedicine preferences check
      throw new BadRequestException('Patient has not enabled telemedicine services');
    }

    // Validate doctor availability
    const doctorAvailability = await this.schedulingService.checkDoctorAvailability(
      createDto.doctorId,
      createDto.scheduledAt,
    );

    if (!doctorAvailability.available) {
      throw new BadRequestException('Doctor is not available at the scheduled time');
    }

    // Check state restrictions for prescribing
    if (createDto.isPrescriptionRequired) {
      await this.stateRestrictionService.validatePrescriptionRestrictions(
        patient.state,
        user.id,
      );
    }

    // Create consultation
    const consultation = await this.prisma.telemedicineConsultation.create({
      data: {
        patientId: createDto.patientId,
        doctorId: createDto.doctorId,
        scheduledAt: new Date(createDto.scheduledAt),
        duration: createDto.duration || 30, // Default 30 minutes
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

    // Create video room
    await this.videoService.createRoom(consultation.id, {
      maxParticipants: 2, // Doctor + Patient
      enableRecording: true,
      enableScreenShare: true,
      quality: 'HD',
    });

    // Schedule notifications
    await this.notificationService.scheduleConsultationReminders(consultation.id);

    // Log the creation
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

  async updateConsultation(id: string, updateDto: UpdateConsultationDto, user: any) {
    this.logger.log(`Updating telemedicine consultation ${id}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.status === 'COMPLETED') {
      throw new BadRequestException('Cannot update completed consultation');
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

    // Log the update
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

  async cancelConsultation(id: string, user: any) {
    this.logger.log(`Cancelling telemedicine consultation ${id}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel completed consultation');
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

    // Cancel video room
    await this.videoService.closeRoom(id);

    // Cancel scheduled notifications
    await this.notificationService.cancelConsultationNotifications(id);

    // Process refund if payment was made
    if (consultation.paymentStatus === 'PAID') {
      await this.paymentService.processRefund(id, { reason: 'Consultation cancelled' }, user);
    }

    // Log the cancellation
    await this.auditService.logActivity({
      action: 'TELEMEDICINE_CONSULTATION_CANCELLED',
      entityType: 'TELEMEDICINE_CONSULTATION',
      entityId: id,
      userId: user.id,
      details: { reason: 'User cancelled consultation' },
    });

    return updatedConsultation;
  }

  async getConsultations(query: ConsultationQueryDto, user: any) {
    const {
      status,
      consultationType,
      doctorId,
      patientId,
      fromDate,
      toDate,
      page = '1',
      limit = '20',
    } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      tenantId: user.tenantId,
    };

    if (status) where.status = status;
    if (consultationType) where.consultationType = consultationType;
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
    if (fromDate || toDate) {
      where.scheduledAt = {};
      if (fromDate) where.scheduledAt.gte = new Date(fromDate);
      if (toDate) where.scheduledAt.lte = new Date(toDate);
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

  async getConsultation(id: string, user: any) {
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
      throw new NotFoundException('Consultation not found');
    }

    return consultation;
  }

  async startConsultation(id: string, user: any) {
    this.logger.log(`Starting telemedicine consultation ${id}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.status !== 'SCHEDULED') {
      throw new BadRequestException('Consultation is not scheduled');
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

    // Open video room
    await this.videoService.openRoom(id);

    // Log the start
    await this.auditService.logActivity({
      action: 'TELEMEDICINE_CONSULTATION_STARTED',
      entityType: 'TELEMEDICINE_CONSULTATION',
      entityId: id,
      userId: user.id,
    });

    return updatedConsultation;
  }

  async completeConsultation(id: string, completionDto: any, user: any) {
    this.logger.log(`Completing telemedicine consultation ${id}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Consultation is not in progress');
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

    // Close video room
    await this.videoService.closeRoom(id);

    // Process post-payment if applicable
    if (consultation.paymentMode === 'POST_PAID' && consultation.paymentStatus !== 'PAID') {
      await this.paymentService.processPostPayment(id, completionDto.paymentDetails);
    }

    // Generate final prescription if required
    if (consultation.isPrescriptionRequired && !completionDto.prescriptionId) {
      await this.prescriptionService.generateFinalPrescription(id, user);
    }

    // Log the completion
    await this.auditService.logActivity({
      action: 'TELEMEDICINE_CONSULTATION_COMPLETED',
      entityType: 'TELEMEDICINE_CONSULTATION',
      entityId: id,
      userId: user.id,
      details: { rating: completionDto.rating, feedback: completionDto.feedback },
    });

    return updatedConsultation;
  }

  async createLabOrder(labOrderDto: any, user: any) {
    this.logger.log(`Creating lab order for consultation ${labOrderDto.consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: labOrderDto.consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    const labOrder = await this.prisma.labOrder.create({
      data: {
        consultationId: labOrderDto.consultationId,
        patientId: consultation.patientId,
        doctorId: consultation.doctorId,
        tests: labOrderDto.tests,
        priority: labOrderDto.priority || 'ROUTINE',
        notes: labOrderDto.notes,
        status: 'PENDING',
        createdBy: user.id,
      },
    });

    // Log the order
    await this.auditService.logActivity({
      action: 'LAB_ORDER_CREATED',
      entityType: 'LAB_ORDER',
      entityId: labOrder.id,
      userId: user.id,
      details: { consultationId: labOrderDto.consultationId, tests: labOrderDto.tests },
    });

    return labOrder;
  }

  async createRadioOrder(radioOrderDto: any, user: any) {
    this.logger.log(`Creating radiology order for consultation ${radioOrderDto.consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: radioOrderDto.consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // const radioOrder = await this.prisma.radioOrder.create({
    //   data: {
    //     consultationId: radioOrderDto.consultationId,
    //     patientId: consultation.patientId,
    //     doctorId: consultation.doctorId,
    //     imagingType: radioOrderDto.imagingType,
    //     bodyPart: radioOrderDto.bodyPart,
    //     priority: radioOrderDto.priority || 'ROUTINE',
    //     notes: radioOrderDto.notes,
    //     status: 'PENDING',
    //     createdBy: user.id,
    //   },
    // });
    const radioOrder = null; // TODO: Implement radiology order creation

    // Log the order
    await this.auditService.logActivity({
      action: 'RADIO_ORDER_CREATED',
      entityType: 'RADIO_ORDER',
      entityId: radioOrder.id,
      userId: user.id,
      details: { consultationId: radioOrderDto.consultationId, imagingType: radioOrderDto.imagingType },
    });

    return radioOrder;
  }

  async getConsultationOrders(consultationId: string, user: any) {
    const [labOrders, radioOrders] = await Promise.all([
      this.prisma.labOrder.findMany({
        // where: { consultationId },
        orderBy: { createdAt: 'desc' },
      }),
      // this.prisma.radioOrder.findMany({
      //   where: { consultationId },
      //   orderBy: { createdAt: 'desc' },
      // }),
      Promise.resolve([]), // TODO: Implement radiology order findMany
    ]);

    return {
      labOrders,
      radioOrders,
    };
  }

  async getConsultationReports(query: any, user: any) {
    const { fromDate, toDate, doctorId, consultationType } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate) where.scheduledAt = { ...where.scheduledAt, gte: new Date(fromDate) };
    if (toDate) where.scheduledAt = { ...where.scheduledAt, lte: new Date(toDate) };
    if (doctorId) where.doctorId = doctorId;
    if (consultationType) where.consultationType = consultationType;

    const consultations = await this.prisma.telemedicineConsultation.findMany({
      where,
      include: {
        patient: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true } },
      },
    });

    // Generate reports
    const reportData = consultations.reduce(
      (acc, consultation) => {
        acc.totalConsultations++;
        if (consultation.status === 'COMPLETED') acc.completed++;
        if (consultation.status === 'CANCELLED') acc.cancelled++;
        if (consultation.isEmergency) acc.emergency++;
        if (consultation.isPrescriptionRequired) acc.withPrescriptions++;

        acc.byType[consultation.consultationType] = (acc.byType[consultation.consultationType] || 0) + 1;
        acc.byDoctor[consultation.doctorId] = (acc.byDoctor[consultation.doctorId] || 0) + 1;

        return acc;
      },
      {
        totalConsultations: 0,
        completed: 0,
        cancelled: 0,
        emergency: 0,
        withPrescriptions: 0,
        byType: {},
        byDoctor: {},
      },
    );

    return {
      period: { from: fromDate, to: toDate },
      summary: reportData,
      consultations,
    };
  }

  async getRevenueReports(query: any, user: any) {
    const { fromDate, toDate } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate) where.completedAt = { ...where.completedAt, gte: new Date(fromDate) };
    if (toDate) where.completedAt = { ...where.completedAt, lte: new Date(toDate) };

    const consultations = await this.prisma.telemedicineConsultation.findMany({
      where: { ...where, status: 'COMPLETED' },
      include: { payments: true },
    });

    const revenueData = consultations.reduce(
      (acc, consultation) => {
        const consultationRevenue = consultation.payments.reduce((sum, payment) => sum + payment.amount, 0);

        acc.totalRevenue += consultationRevenue;
        acc.totalConsultations++;
        acc.averageRevenuePerConsultation = acc.totalRevenue / acc.totalConsultations;

        if (consultation.paymentMode === 'PRE_PAID') acc.prePaid++;
        if (consultation.paymentMode === 'POST_PAID') acc.postPaid++;

        return acc;
      },
      {
        totalRevenue: 0,
        totalConsultations: 0,
        averageRevenuePerConsultation: 0,
        prePaid: 0,
        postPaid: 0,
      },
    );

    return {
      period: { from: fromDate, to: toDate },
      revenue: revenueData,
      consultations,
    };
  }

  async getPatientSatisfaction(query: any, user: any) {
    const { fromDate, toDate } = query;

    const where: any = { tenantId: user.tenantId };
    if (fromDate) where.completedAt = { ...where.completedAt, gte: new Date(fromDate) };
    if (toDate) where.completedAt = { ...where.completedAt, lte: new Date(toDate) };

    const consultations = await this.prisma.telemedicineConsultation.findMany({
      where: { ...where, status: 'COMPLETED', rating: { not: null } },
    });

    const satisfactionData = consultations.reduce(
      (acc, consultation) => {
        acc.totalRatings++;
        acc.averageRating += consultation.rating || 0;

        if (consultation.rating === 5) acc.fiveStar++;
        if (consultation.rating === 4) acc.fourStar++;
        if (consultation.rating === 3) acc.threeStar++;
        if (consultation.rating === 2) acc.twoStar++;
        if (consultation.rating === 1) acc.oneStar++;

        return acc;
      },
      {
        totalRatings: 0,
        averageRating: 0,
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
      },
    );

    if (satisfactionData.totalRatings > 0) {
      satisfactionData.averageRating = satisfactionData.averageRating / satisfactionData.totalRatings;
    }

    return {
      period: { from: fromDate, to: toDate },
      satisfaction: satisfactionData,
      consultations,
    };
  }

  async createEmergencyConsultation(emergencyDto: any, user: any) {
    this.logger.log(`Creating emergency telemedicine consultation`);

    // Find available emergency doctor
    const emergencyDoctor = await this.schedulingService.findEmergencyDoctor(user.tenantId);

    if (!emergencyDoctor) {
      throw new BadRequestException('No emergency doctors available');
    }

    const consultation = await this.prisma.telemedicineConsultation.create({
      data: {
        patientId: emergencyDto.patientId,
        doctorId: emergencyDoctor.id,
        scheduledAt: new Date(), // Start immediately
        duration: 60, // Emergency consultations are 1 hour
        consultationType: 'EMERGENCY',
        isEmergency: true,
        isPrescriptionRequired: emergencyDto.isPrescriptionRequired || false,
        paymentMode: 'POST_PAID', // Emergency consultations are post-paid
        status: 'IN_PROGRESS',
        notes: emergencyDto.notes,
        symptoms: emergencyDto.symptoms,
        severity: emergencyDto.severity,
        createdBy: user.id,
        tenantId: user.tenantId,
      },
    });

    // Create emergency video room
    await this.videoService.createEmergencyRoom(consultation.id);

    // Notify emergency doctor
    await this.notificationService.notifyEmergencyConsultation(consultation.id, emergencyDoctor.id);

    // Log the emergency consultation
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

  async getEmergencyQueue(user: any) {
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
}
