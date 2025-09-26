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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientPortalController = void 0;
const common_1 = require("@nestjs/common");
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
let PatientPortalController = class PatientPortalController {
    patientPortalService;
    onboardingService;
    appointmentService;
    familyService;
    healthTimelineService;
    consentService;
    paymentService;
    reportService;
    notificationService;
    languageService;
    constructor(patientPortalService, onboardingService, appointmentService, familyService, healthTimelineService, consentService, paymentService, reportService, notificationService, languageService) {
        this.patientPortalService = patientPortalService;
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
    async onboardPatient(onboardDto, req) {
        return this.onboardingService.onboardPatient(onboardDto, req);
    }
    async verifyOtp(verifyDto) {
        return this.onboardingService.verifyOtp(verifyDto);
    }
    async verifyAadhaar(aadhaarDto, req) {
        return this.onboardingService.verifyAadhaar(aadhaarDto, req);
    }
    async completeProfile(profileDto, req) {
        return this.onboardingService.completeProfile(profileDto, req);
    }
    async getAppointments(query, req) {
        return this.appointmentService.getAppointments(query, req.user);
    }
    async bookAppointment(appointmentDto, req) {
        return this.appointmentService.bookAppointment(appointmentDto, req.user);
    }
    async updateAppointment(appointmentId, updateDto, req) {
        return this.appointmentService.updateAppointment(appointmentId, updateDto, req.user);
    }
    async cancelAppointment(appointmentId, req) {
        await this.appointmentService.cancelAppointment(appointmentId, req.user);
    }
    async getAppointmentDetails(appointmentId, req) {
        return this.appointmentService.getAppointmentDetails(appointmentId, req.user);
    }
    async getFamilyMembers(req) {
        return this.familyService.getFamilyMembers(req.user);
    }
    async addFamilyMember(familyDto, req) {
        return this.familyService.addFamilyMember(familyDto, req.user);
    }
    async updateFamilyMember(memberId, updateDto, req) {
        return this.familyService.updateFamilyMember(memberId, updateDto, req.user);
    }
    async removeFamilyMember(memberId, req) {
        await this.familyService.removeFamilyMember(memberId, req.user);
    }
    async switchToFamilyMember(memberId, req) {
        return this.familyService.switchToFamilyMember(memberId, req.user);
    }
    async getHealthTimeline(query, req) {
        return this.healthTimelineService.getHealthTimeline(query, req.user);
    }
    async getTimelineSummary(req) {
        return this.healthTimelineService.getTimelineSummary(req.user);
    }
    async addTimelineEntry(entryDto, req) {
        return this.healthTimelineService.addTimelineEntry(entryDto, req.user);
    }
    async getConsents(req) {
        return this.consentService.getConsents(req.user);
    }
    async createConsent(consentDto, req) {
        return this.consentService.createConsent(consentDto, req.user);
    }
    async updateConsent(consentId, updateDto, req) {
        return this.consentService.updateConsent(consentId, updateDto, req.user);
    }
    async revokeConsent(consentId, req) {
        await this.consentService.revokeConsent(consentId, req.user);
    }
    async getConsentStatus(consentId, req) {
        return this.consentService.getConsentStatus(consentId, req.user);
    }
    async getBills(query, req) {
        return this.paymentService.getBills(query, req.user);
    }
    async processPayment(paymentDto, req) {
        return this.paymentService.processPayment(paymentDto, req.user);
    }
    async getPaymentHistory(query, req) {
        return this.paymentService.getPaymentHistory(query, req.user);
    }
    async getPaymentStatus(paymentId, req) {
        return this.paymentService.getPaymentStatus(paymentId, req.user);
    }
    async getReports(query, req) {
        return this.reportService.getReports(query, req.user);
    }
    async getReport(reportId, req) {
        return this.reportService.getReport(reportId, req.user);
    }
    async downloadReport(reportId, req) {
        return this.reportService.downloadReport(reportId, req.user);
    }
    async getPrescriptions(query, req) {
        return this.reportService.getPrescriptions(query, req.user);
    }
    async getPrescription(prescriptionId, req) {
        return this.reportService.getPrescription(prescriptionId, req.user);
    }
    async downloadPrescription(prescriptionId, req) {
        return this.reportService.downloadPrescription(prescriptionId, req.user);
    }
    async shareDocument(shareDto, req) {
        return this.reportService.shareDocument(shareDto, req.user);
    }
    async requestDocumentAccess(accessDto, req) {
        return this.reportService.requestDocumentAccess(accessDto, req.user);
    }
    async getAvailableLanguages(req) {
        return this.languageService.getAvailableLanguages(req.user.tenantId);
    }
    async setLanguage(languageDto, req) {
        return this.languageService.setLanguage(languageDto, req.user);
    }
    async getNotifications(query, req) {
        return this.notificationService.getNotifications(query, req.user);
    }
    async markNotificationAsRead(notificationId, req) {
        return this.notificationService.markAsRead(notificationId, req.user);
    }
    async markAllNotificationsAsRead(req) {
        return this.notificationService.markAllAsRead(req.user);
    }
    async getDashboard(req) {
        return this.patientPortalService.getDashboard(req.user);
    }
    async getProfile(req) {
        return this.patientPortalService.getProfile(req.user);
    }
    async updateProfile(profileDto, req) {
        return this.patientPortalService.updateProfile(profileDto, req.user);
    }
    async updatePreferences(preferencesDto, req) {
        return this.patientPortalService.updatePreferences(preferencesDto, req.user);
    }
    async getEmergencyContacts(req) {
        return this.patientPortalService.getEmergencyContacts(req.user);
    }
    async addEmergencyContact(contactDto, req) {
        return this.patientPortalService.addEmergencyContact(contactDto, req.user);
    }
    async updateEmergencyContact(contactId, contactDto, req) {
        return this.patientPortalService.updateEmergencyContact(contactId, contactDto, req.user);
    }
    async removeEmergencyContact(contactId, req) {
        await this.patientPortalService.removeEmergencyContact(contactId, req.user);
    }
    async getReminders(query, req) {
        return this.patientPortalService.getReminders(query, req.user);
    }
    async setReminder(reminderDto, req) {
        return this.patientPortalService.setReminder(reminderDto, req.user);
    }
    async updateReminder(reminderId, reminderDto, req) {
        return this.patientPortalService.updateReminder(reminderId, reminderDto, req.user);
    }
    async deleteReminder(reminderId, req) {
        await this.patientPortalService.deleteReminder(reminderId, req.user);
    }
};
exports.PatientPortalController = PatientPortalController;
__decorate([
    (0, common_1.Post)('onboard'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "onboardPatient", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('verify-aadhaar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "verifyAadhaar", null);
__decorate([
    (0, common_1.Post)('complete-profile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "completeProfile", null);
__decorate([
    (0, common_1.Get)('appointments'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Post)('appointments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "bookAppointment", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId'),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "updateAppointment", null);
__decorate([
    (0, common_1.Delete)('appointments/:appointmentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_1.Get)('appointments/:appointmentId/details'),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getAppointmentDetails", null);
__decorate([
    (0, common_1.Get)('family'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getFamilyMembers", null);
__decorate([
    (0, common_1.Post)('family'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "addFamilyMember", null);
__decorate([
    (0, common_1.Put)('family/:memberId'),
    __param(0, (0, common_1.Param)('memberId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "updateFamilyMember", null);
__decorate([
    (0, common_1.Delete)('family/:memberId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('memberId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "removeFamilyMember", null);
__decorate([
    (0, common_1.Post)('family/:memberId/switch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('memberId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "switchToFamilyMember", null);
__decorate([
    (0, common_1.Get)('timeline'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getHealthTimeline", null);
__decorate([
    (0, common_1.Get)('timeline/summary'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getTimelineSummary", null);
__decorate([
    (0, common_1.Post)('timeline/entries'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "addTimelineEntry", null);
__decorate([
    (0, common_1.Get)('consents'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getConsents", null);
__decorate([
    (0, common_1.Post)('consents'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "createConsent", null);
__decorate([
    (0, common_1.Put)('consents/:consentId'),
    __param(0, (0, common_1.Param)('consentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "updateConsent", null);
__decorate([
    (0, common_1.Delete)('consents/:consentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('consentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "revokeConsent", null);
__decorate([
    (0, common_1.Get)('consents/:consentId/status'),
    __param(0, (0, common_1.Param)('consentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getConsentStatus", null);
__decorate([
    (0, common_1.Get)('bills'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getBills", null);
__decorate([
    (0, common_1.Post)('payments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Get)('payments/history'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getPaymentHistory", null);
__decorate([
    (0, common_1.Get)('payments/:paymentId/status'),
    __param(0, (0, common_1.Param)('paymentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getPaymentStatus", null);
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getReports", null);
__decorate([
    (0, common_1.Get)('reports/:reportId'),
    __param(0, (0, common_1.Param)('reportId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)('reports/:reportId/download'),
    __param(0, (0, common_1.Param)('reportId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "downloadReport", null);
__decorate([
    (0, common_1.Get)('prescriptions'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getPrescriptions", null);
__decorate([
    (0, common_1.Get)('prescriptions/:prescriptionId'),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getPrescription", null);
__decorate([
    (0, common_1.Get)('prescriptions/:prescriptionId/download'),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "downloadPrescription", null);
__decorate([
    (0, common_1.Post)('documents/share'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "shareDocument", null);
__decorate([
    (0, common_1.Post)('documents/request-access'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "requestDocumentAccess", null);
__decorate([
    (0, common_1.Get)('languages'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getAvailableLanguages", null);
__decorate([
    (0, common_1.Put)('language'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "setLanguage", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Put)('notifications/:notificationId/read'),
    __param(0, (0, common_1.Param)('notificationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "markNotificationAsRead", null);
__decorate([
    (0, common_1.Put)('notifications/read-all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "markAllNotificationsAsRead", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('profile/preferences'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Get)('emergency-contacts'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getEmergencyContacts", null);
__decorate([
    (0, common_1.Post)('emergency-contacts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "addEmergencyContact", null);
__decorate([
    (0, common_1.Put)('emergency-contacts/:contactId'),
    __param(0, (0, common_1.Param)('contactId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "updateEmergencyContact", null);
__decorate([
    (0, common_1.Delete)('emergency-contacts/:contactId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('contactId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "removeEmergencyContact", null);
__decorate([
    (0, common_1.Get)('reminders'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getReminders", null);
__decorate([
    (0, common_1.Post)('reminders'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "setReminder", null);
__decorate([
    (0, common_1.Put)('reminders/:reminderId'),
    __param(0, (0, common_1.Param)('reminderId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "updateReminder", null);
__decorate([
    (0, common_1.Delete)('reminders/:reminderId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('reminderId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "deleteReminder", null);
exports.PatientPortalController = PatientPortalController = __decorate([
    (0, common_1.Controller)('patient-portal'),
    __metadata("design:paramtypes", [patient_portal_service_1.PatientPortalService,
        onboarding_service_1.OnboardingService,
        appointment_service_1.AppointmentService,
        family_service_1.FamilyService,
        health_timeline_service_1.HealthTimelineService,
        consent_service_1.ConsentService,
        payment_service_1.PaymentService,
        report_service_1.ReportService,
        notification_service_1.NotificationService,
        language_service_1.LanguageService])
], PatientPortalController);
//# sourceMappingURL=patient-portal.controller.js.map