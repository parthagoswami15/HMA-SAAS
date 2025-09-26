import { PatientPortalService } from './patient-portal.service';
import { OnboardingService } from './services/onboarding.service';
import { AppointmentService } from './services/appointment.service';
import { FamilyService } from './services/family.service';
import { HealthTimelineService } from './services/health-timeline.service';
import { ConsentService } from './services/consent.service';
import { PaymentService } from './services/payment.service';
import { ReportService } from './services/report.service';
import { NotificationService } from './services/notification.service';
import { LanguageService } from './services/language.service';
export declare class PatientPortalController {
    private readonly patientPortalService;
    private readonly onboardingService;
    private readonly appointmentService;
    private readonly familyService;
    private readonly healthTimelineService;
    private readonly consentService;
    private readonly paymentService;
    private readonly reportService;
    private readonly notificationService;
    private readonly languageService;
    constructor(patientPortalService: PatientPortalService, onboardingService: OnboardingService, appointmentService: AppointmentService, familyService: FamilyService, healthTimelineService: HealthTimelineService, consentService: ConsentService, paymentService: PaymentService, reportService: ReportService, notificationService: NotificationService, languageService: LanguageService);
    onboardPatient(onboardDto: any, req: any): Promise<{
        onboardingId: any;
        message: string;
        expiresIn: number;
    }>;
    verifyOtp(verifyDto: any): Promise<{
        onboardingId: any;
        message: string;
        nextStep: string;
    }>;
    verifyAadhaar(aadhaarDto: any, req: any): Promise<{
        onboardingId: any;
        message: string;
        nextStep: string;
    }>;
    completeProfile(profileDto: any, req: any): Promise<{
        userId: any;
        message: string;
        temporaryPassword: string;
        nextStep: string;
    }>;
    getAppointments(query: any, req: any): Promise<{
        appointments: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    bookAppointment(appointmentDto: any, req: any): Promise<any>;
    updateAppointment(appointmentId: string, updateDto: any, req: any): Promise<any>;
    cancelAppointment(appointmentId: string, req: any): Promise<void>;
    getAppointmentDetails(appointmentId: string, req: any): Promise<any>;
    getFamilyMembers(req: any): Promise<any>;
    addFamilyMember(familyDto: any, req: any): Promise<any>;
    updateFamilyMember(memberId: string, updateDto: any, req: any): Promise<any>;
    removeFamilyMember(memberId: string, req: any): Promise<void>;
    switchToFamilyMember(memberId: string, req: any): Promise<{
        switchedTo: string;
        context: {
            primaryUserId: any;
            familyMemberId: string;
            profileId: any;
            switchedAt: Date;
        };
    }>;
    getHealthTimeline(query: any, req: any): Promise<{
        entries: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    getTimelineSummary(req: any): Promise<{
        userId: any;
        totalEntries: any;
        entriesByType: any;
        recentEntries: any;
        monthlyEntries: any;
    }>;
    addTimelineEntry(entryDto: any, req: any): Promise<any>;
    getConsents(req: any): Promise<any>;
    createConsent(consentDto: any, req: any): Promise<any>;
    updateConsent(consentId: string, updateDto: any, req: any): Promise<any>;
    revokeConsent(consentId: string, req: any): Promise<void>;
    getConsentStatus(consentId: string, req: any): Promise<{
        consentId: string;
        status: any;
        isValid: boolean;
        validFrom: any;
        validUntil: any;
        daysUntilExpiry: number | null;
    }>;
    getBills(query: any, req: any): Promise<{
        bills: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    processPayment(paymentDto: any, req: any): Promise<{
        paymentId: any;
        billId: any;
        amount: any;
        status: string;
        reference: string;
    }>;
    getPaymentHistory(query: any, req: any): Promise<{
        payments: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    getPaymentStatus(paymentId: string, req: any): Promise<{
        paymentId: string;
        amount: any;
        paymentMethod: any;
        status: any;
        paidAt: any;
        bill: any;
    }>;
    getReports(query: any, req: any): Promise<{
        reports: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    getReport(reportId: string, req: any): Promise<any>;
    downloadReport(reportId: string, req: any): Promise<{
        reportId: string;
        fileName: any;
        fileType: any;
        content: Buffer<ArrayBuffer>;
    }>;
    getPrescriptions(query: any, req: any): Promise<{
        prescriptions: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    getPrescription(prescriptionId: string, req: any): Promise<any>;
    downloadPrescription(prescriptionId: string, req: any): Promise<{
        prescriptionId: string;
        fileName: string;
        content: Buffer<ArrayBuffer>;
    }>;
    shareDocument(shareDto: any, req: any): Promise<{
        shareId: any;
        shareToken: any;
        expiresAt: any;
    }>;
    requestDocumentAccess(accessDto: any, req: any): Promise<{
        requestId: any;
        status: string;
        message: string;
    }>;
    getAvailableLanguages(req: any): Promise<{
        code: string;
        name: string;
        nativeName: string;
        isDefault: boolean;
        isActive: any;
    }[]>;
    setLanguage(languageDto: any, req: any): Promise<{
        language: any;
        message: string;
    }>;
    getNotifications(query: any, req: any): Promise<{
        notifications: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            pages: number;
        };
    }>;
    markNotificationAsRead(notificationId: string, req: any): Promise<any>;
    markAllNotificationsAsRead(req: any): Promise<{
        updatedCount: any;
    }>;
    getDashboard(req: any): Promise<{
        user: {
            id: any;
            name: any;
            email: any;
            phone: any;
        };
        upcomingAppointments: any;
        recentTimeline: any;
        pendingBills: any;
        unreadNotifications: {
            unreadCount: any;
        };
        familyMembers: any;
        activeConsents: any;
        quickActions: {
            type: string;
            label: string;
            icon: string;
        }[];
    }>;
    getProfile(req: any): Promise<{
        id: any;
        personalInfo: {
            name: any;
            email: any;
            phone: any;
            dateOfBirth: any;
            gender: any;
            bloodGroup: any;
            address: any;
            city: any;
            state: any;
            pincode: any;
        };
        emergencyContacts: any;
        preferences: any;
        language: any;
        aadhaarVerified: any;
        phoneVerified: any;
        emailVerified: any;
        profileCompleted: any;
        createdAt: any;
        updatedAt: any;
    }>;
    updateProfile(profileDto: any, req: any): Promise<any>;
    updatePreferences(preferencesDto: any, req: any): Promise<any>;
    getEmergencyContacts(req: any): Promise<any>;
    addEmergencyContact(contactDto: any, req: any): Promise<any>;
    updateEmergencyContact(contactId: string, contactDto: any, req: any): Promise<any>;
    removeEmergencyContact(contactId: string, req: any): Promise<void>;
    getReminders(query: any, req: any): Promise<any>;
    setReminder(reminderDto: any, req: any): Promise<any>;
    updateReminder(reminderId: string, reminderDto: any, req: any): Promise<any>;
    deleteReminder(reminderId: string, req: any): Promise<void>;
}
