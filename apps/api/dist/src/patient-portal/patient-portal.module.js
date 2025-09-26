"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientPortalModule = void 0;
const common_1 = require("@nestjs/common");
const patient_portal_controller_1 = require("./patient-portal.controller");
const patient_portal_service_1 = require("./patient-portal.service");
const onboarding_service_1 = require("./services/onboarding.service");
const appointment_service_1 = require("./services/appointment.service");
const family_service_1 = require("./services/family.service");
const health_timeline_service_1 = require("./services/health-timeline.service");
const consent_service_1 = require("./services/consent.service");
const payment_service_1 = require("./services/payment.service");
const report_service_1 = require("./services/report.service");
const notification_service_1 = require("./services/notification.service");
const language_service_1 = require("./services/language.service");
const prisma_module_1 = require("../prisma/prisma.module");
const audit_module_1 = require("../audit/audit.module");
const notifications_module_1 = require("../notifications/notifications.module");
const telemedicine_module_1 = require("../telemedicine/telemedicine.module");
const security_module_1 = require("../security/security.module");
let PatientPortalModule = class PatientPortalModule {
};
exports.PatientPortalModule = PatientPortalModule;
exports.PatientPortalModule = PatientPortalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            audit_module_1.AuditModule,
            notifications_module_1.NotificationsModule,
            telemedicine_module_1.TelemedicineModule,
            security_module_1.SecurityModule,
        ],
        controllers: [patient_portal_controller_1.PatientPortalController],
        providers: [
            patient_portal_service_1.PatientPortalService,
            onboarding_service_1.OnboardingService,
            appointment_service_1.AppointmentService,
            family_service_1.FamilyService,
            health_timeline_service_1.HealthTimelineService,
            consent_service_1.ConsentService,
            payment_service_1.PaymentService,
            report_service_1.ReportService,
            notification_service_1.NotificationService,
            language_service_1.LanguageService,
        ],
        exports: [
            patient_portal_service_1.PatientPortalService,
            onboarding_service_1.OnboardingService,
            appointment_service_1.AppointmentService,
            family_service_1.FamilyService,
            health_timeline_service_1.HealthTimelineService,
            consent_service_1.ConsentService,
            payment_service_1.PaymentService,
            report_service_1.ReportService,
            notification_service_1.NotificationService,
            language_service_1.LanguageService,
        ],
    })
], PatientPortalModule);
//# sourceMappingURL=patient-portal.module.js.map