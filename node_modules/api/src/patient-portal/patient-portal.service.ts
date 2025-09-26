import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnboardingService } from './services/onboarding.service';
import { AppointmentService } from './services/appointment.service';
import { FamilyService } from './services/family.service';
import { HealthTimelineService } from './services/health-timeline.service';
import { ConsentService } from './services/consent.service';
import { PaymentService } from './services/payment.service';
import { ReportService } from './services/report.service';
import { NotificationService } from './services/notification.service';
import { LanguageService } from './services/language.service';

@Injectable()
export class PatientPortalService {
  private readonly logger = new Logger(PatientPortalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly onboardingService: OnboardingService,
    private readonly appointmentService: AppointmentService,
    private readonly familyService: FamilyService,
    private readonly healthTimelineService: HealthTimelineService,
    private readonly consentService: ConsentService,
    private readonly paymentService: PaymentService,
    private readonly reportService: ReportService,
    private readonly notificationService: NotificationService,
    private readonly languageService: LanguageService,
  ) {}

  async getDashboard(user: any) {
    this.logger.log(`Getting dashboard for user: ${user.id}`);

    // Get upcoming appointments
    const upcomingAppointments = await this.appointmentService.getUpcomingAppointments(user);

    // Get recent health timeline entries
    const recentTimeline = await this.healthTimelineService.getRecentTimeline(user);

    // Get pending bills
    const pendingBills = await this.paymentService.getPendingBills(user);

    // Get unread notifications
    const unreadNotifications = await this.notificationService.getUnreadCount(user);

    // Get family members
    const familyMembers = await this.familyService.getFamilyMembers(user);

    // Get active consents
    const activeConsents = await this.consentService.getActiveConsents(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      upcomingAppointments,
      recentTimeline,
      pendingBills,
      unreadNotifications,
      familyMembers: familyMembers.length,
      activeConsents: activeConsents.length,
      quickActions: [
        {
          type: 'book_appointment',
          label: 'Book Appointment',
          icon: 'calendar-plus',
        },
        {
          type: 'view_reports',
          label: 'View Reports',
          icon: 'file-medical',
        },
        {
          type: 'family_members',
          label: 'Family Members',
          icon: 'users',
        },
        {
          type: 'payments',
          label: 'Payments',
          icon: 'credit-card',
        },
      ],
    };
  }

  async getProfile(user: any) {
    this.logger.log(`Getting profile for user: ${user.id}`);

    const profile = await this.prisma.patientProfile.findUnique({
      where: { userId: user.id },
      include: {
        emergencyContacts: true,
        preferences: true,
        language: true,
      },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    return {
      id: profile.id,
      personalInfo: {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
      },
      emergencyContacts: profile.emergencyContacts,
      preferences: profile.preferences,
      language: profile.language,
      aadhaarVerified: profile.aadhaarVerified,
      phoneVerified: profile.phoneVerified,
      emailVerified: profile.emailVerified,
      profileCompleted: profile.profileCompleted,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  async updateProfile(profileDto: any, user: any) {
    this.logger.log(`Updating profile for user: ${user.id}`);

    const updatedProfile = await this.prisma.patientProfile.update({
      where: { userId: user.id },
      data: {
        ...profileDto,
        updatedAt: new Date(),
      },
    });

    return updatedProfile;
  }

  async updatePreferences(preferencesDto: any, user: any) {
    this.logger.log(`Updating preferences for user: ${user.id}`);

    const preferences = await this.prisma.patientPreferences.upsert({
      where: { userId: user.id },
      update: {
        ...preferencesDto,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        ...preferencesDto,
      },
    });

    return preferences;
  }

  async getEmergencyContacts(user: any) {
    this.logger.log(`Getting emergency contacts for user: ${user.id}`);

    const contacts = await this.prisma.emergencyContact.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return contacts;
  }

  async addEmergencyContact(contactDto: any, user: any) {
    this.logger.log(`Adding emergency contact for user: ${user.id}`);

    const contact = await this.prisma.emergencyContact.create({
      data: {
        userId: user.id,
        name: contactDto.name,
        relationship: contactDto.relationship,
        phone: contactDto.phone,
        email: contactDto.email,
        address: contactDto.address,
      },
    });

    return contact;
  }

  async updateEmergencyContact(contactId: string, contactDto: any, user: any) {
    this.logger.log(`Updating emergency contact: ${contactId}`);

    const contact = await this.prisma.emergencyContact.update({
      where: { id: contactId, userId: user.id },
      data: {
        ...contactDto,
        updatedAt: new Date(),
      },
    });

    return contact;
  }

  async removeEmergencyContact(contactId: string, user: any) {
    this.logger.log(`Removing emergency contact: ${contactId}`);

    await this.prisma.emergencyContact.delete({
      where: { id: contactId, userId: user.id },
    });
  }

  async getReminders(query: any, user: any) {
    this.logger.log(`Getting reminders for user: ${user.id}`);

    const { type, fromDate, toDate } = query;

    const where: any = { userId: user.id };
    if (type) where.type = type;
    if (fromDate) where.reminderDate = { ...where.reminderDate, gte: new Date(fromDate) };
    if (toDate) where.reminderDate = { ...where.reminderDate, lte: new Date(toDate) };

    const reminders = await this.prisma.healthReminder.findMany({
      where,
      orderBy: { reminderDate: 'asc' },
    });

    return reminders;
  }

  async setReminder(reminderDto: any, user: any) {
    this.logger.log(`Setting reminder for user: ${user.id}`);

    const reminder = await this.prisma.healthReminder.create({
      data: {
        userId: user.id,
        title: reminderDto.title,
        description: reminderDto.description,
        type: reminderDto.type,
        reminderDate: new Date(reminderDto.reminderDate),
        frequency: reminderDto.frequency,
        isActive: true,
      },
    });

    return reminder;
  }

  async updateReminder(reminderId: string, reminderDto: any, user: any) {
    this.logger.log(`Updating reminder: ${reminderId}`);

    const reminder = await this.prisma.healthReminder.update({
      where: { id: reminderId, userId: user.id },
      data: {
        ...reminderDto,
        updatedAt: new Date(),
      },
    });

    return reminder;
  }

  async deleteReminder(reminderId: string, user: any) {
    this.logger.log(`Deleting reminder: ${reminderId}`);

    await this.prisma.healthReminder.delete({
      where: { id: reminderId, userId: user.id },
    });
  }

  async getHealthStats(user: any) {
    this.logger.log(`Getting health stats for user: ${user.id}`);

    // Get various health statistics
    const totalAppointments = await this.prisma.appointment.count({
      where: { patientId: user.id },
    });

    const completedAppointments = await this.prisma.appointment.count({
      where: {
        patientId: user.id,
        status: 'COMPLETED',
      },
    });

    const totalReports = await this.prisma.medicalReport.count({
      where: { patientId: user.id },
    });

    const totalPrescriptions = await this.prisma.prescription.count({
      where: { patientId: user.id },
    });

    const totalBills = await this.prisma.bill.count({
      where: { patientId: user.id },
    });

    const paidBills = await this.prisma.bill.count({
      where: {
        patientId: user.id,
        status: 'PAID',
      },
    });

    return {
      userId: user.id,
      appointments: {
        total: totalAppointments,
        completed: completedAppointments,
        completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
      },
      reports: {
        total: totalReports,
      },
      prescriptions: {
        total: totalPrescriptions,
      },
      bills: {
        total: totalBills,
        paid: paidBills,
        paymentRate: totalBills > 0 ? (paidBills / totalBills) * 100 : 0,
      },
    };
  }

  async getQuickAccess(user: any) {
    this.logger.log(`Getting quick access for user: ${user.id}`);

    // Get recent appointments
    const recentAppointments = await this.prisma.appointment.findMany({
      where: { patientId: user.id },
      orderBy: { scheduledAt: 'desc' },
      take: 3,
      include: {
        doctor: { select: { name: true, specialization: true } },
      },
    });

    // Get recent reports
    const recentReports = await this.prisma.medicalReport.findMany({
      where: { patientId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    // Get recent prescriptions
    const recentPrescriptions = await this.prisma.prescription.findMany({
      where: { patientId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    return {
      recentAppointments,
      recentReports,
      recentPrescriptions,
    };
  }
}
