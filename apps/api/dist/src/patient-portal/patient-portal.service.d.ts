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
export declare class PatientPortalService {
    private readonly prisma;
    private readonly onboardingService;
    private readonly appointmentService;
    private readonly familyService;
    private readonly healthTimelineService;
    private readonly consentService;
    private readonly paymentService;
    private readonly reportService;
    private readonly notificationService;
    private readonly languageService;
    private readonly logger;
    constructor(prisma: PrismaService, onboardingService: OnboardingService, appointmentService: AppointmentService, familyService: FamilyService, healthTimelineService: HealthTimelineService, consentService: ConsentService, paymentService: PaymentService, reportService: ReportService, notificationService: NotificationService, languageService: LanguageService);
    getDashboard(user: any): Promise<{
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
    getProfile(user: any): Promise<{
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
    updateProfile(profileDto: any, user: any): Promise<any>;
    updatePreferences(preferencesDto: any, user: any): Promise<any>;
    getEmergencyContacts(user: any): Promise<any>;
    addEmergencyContact(contactDto: any, user: any): Promise<any>;
    updateEmergencyContact(contactId: string, contactDto: any, user: any): Promise<any>;
    removeEmergencyContact(contactId: string, user: any): Promise<void>;
    getReminders(query: any, user: any): Promise<any>;
    setReminder(reminderDto: any, user: any): Promise<any>;
    updateReminder(reminderId: string, reminderDto: any, user: any): Promise<any>;
    deleteReminder(reminderId: string, user: any): Promise<void>;
    getHealthStats(user: any): Promise<{
        userId: any;
        appointments: {
            total: any;
            completed: any;
            completionRate: number;
        };
        reports: {
            total: any;
        };
        prescriptions: {
            total: any;
        };
        bills: {
            total: any;
            paid: any;
            paymentRate: number;
        };
    }>;
    getQuickAccess(user: any): Promise<{
        recentAppointments: any;
        recentReports: any;
        recentPrescriptions: any;
    }>;
}
