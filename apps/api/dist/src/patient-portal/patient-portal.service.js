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
var PatientPortalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientPortalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const onboarding_service_1 = require("./services/onboarding.service");
const appointment_service_1 = require("./services/appointment.service");
const family_service_1 = require("./services/family.service");
const health_timeline_service_1 = require("./services/health-timeline.service");
const consent_service_1 = require("./services/consent.service");
const payment_service_1 = require("./services/payment.service");
const report_service_1 = require("./services/report.service");
const notification_service_1 = require("./services/notification.service");
const language_service_1 = require("./services/language.service");
let PatientPortalService = PatientPortalService_1 = class PatientPortalService {
    prisma;
    onboardingService;
    appointmentService;
    familyService;
    healthTimelineService;
    consentService;
    paymentService;
    reportService;
    notificationService;
    languageService;
    logger = new common_1.Logger(PatientPortalService_1.name);
    constructor(prisma, onboardingService, appointmentService, familyService, healthTimelineService, consentService, paymentService, reportService, notificationService, languageService) {
        this.prisma = prisma;
        this.onboardingService = onboardingService;
        this.appointmentService = appointmentService;
        this.familyService = familyService;
        this.healthTimelineService = healthTimelineService;
        this.consentService = consentService;
        this.paymentService = paymentService;
        this.reportService = reportService;
        this.notificationService = notificationService;
        this.languageService = languageService;
    }
    async getDashboard(user) {
        this.logger.log(`Getting dashboard for user: ${user.id}`);
        const upcomingAppointments = await this.appointmentService.getUpcomingAppointments(user);
        const recentTimeline = await this.healthTimelineService.getRecentTimeline(user);
        const pendingBills = await this.paymentService.getPendingBills(user);
        const unreadNotifications = await this.notificationService.getUnreadCount(user);
        const familyMembers = await this.familyService.getFamilyMembers(user);
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
    async getProfile(user) {
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
    async updateProfile(profileDto, user) {
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
    async updatePreferences(preferencesDto, user) {
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
    async getEmergencyContacts(user) {
        this.logger.log(`Getting emergency contacts for user: ${user.id}`);
        const contacts = await this.prisma.emergencyContact.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });
        return contacts;
    }
    async addEmergencyContact(contactDto, user) {
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
    async updateEmergencyContact(contactId, contactDto, user) {
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
    async removeEmergencyContact(contactId, user) {
        this.logger.log(`Removing emergency contact: ${contactId}`);
        await this.prisma.emergencyContact.delete({
            where: { id: contactId, userId: user.id },
        });
    }
    async getReminders(query, user) {
        this.logger.log(`Getting reminders for user: ${user.id}`);
        const { type, fromDate, toDate } = query;
        const where = { userId: user.id };
        if (type)
            where.type = type;
        if (fromDate)
            where.reminderDate = { ...where.reminderDate, gte: new Date(fromDate) };
        if (toDate)
            where.reminderDate = { ...where.reminderDate, lte: new Date(toDate) };
        const reminders = await this.prisma.healthReminder.findMany({
            where,
            orderBy: { reminderDate: 'asc' },
        });
        return reminders;
    }
    async setReminder(reminderDto, user) {
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
    async updateReminder(reminderId, reminderDto, user) {
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
    async deleteReminder(reminderId, user) {
        this.logger.log(`Deleting reminder: ${reminderId}`);
        await this.prisma.healthReminder.delete({
            where: { id: reminderId, userId: user.id },
        });
    }
    async getHealthStats(user) {
        this.logger.log(`Getting health stats for user: ${user.id}`);
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
    async getQuickAccess(user) {
        this.logger.log(`Getting quick access for user: ${user.id}`);
        const recentAppointments = await this.prisma.appointment.findMany({
            where: { patientId: user.id },
            orderBy: { scheduledAt: 'desc' },
            take: 3,
            include: {
                doctor: { select: { name: true, specialization: true } },
            },
        });
        const recentReports = await this.prisma.medicalReport.findMany({
            where: { patientId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });
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
};
exports.PatientPortalService = PatientPortalService;
exports.PatientPortalService = PatientPortalService = PatientPortalService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        onboarding_service_1.OnboardingService,
        appointment_service_1.AppointmentService,
        family_service_1.FamilyService,
        health_timeline_service_1.HealthTimelineService,
        consent_service_1.ConsentService,
        payment_service_1.PaymentService,
        report_service_1.ReportService,
        notification_service_1.NotificationService,
        language_service_1.LanguageService])
], PatientPortalService);
//# sourceMappingURL=patient-portal.service.js.map