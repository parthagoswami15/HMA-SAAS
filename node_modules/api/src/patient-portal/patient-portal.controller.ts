import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
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

@Controller('patient-portal')
export class PatientPortalController {
  constructor(
    private readonly patientPortalService: PatientPortalService,
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

  // Onboarding endpoints
  @Post('onboard')
  @HttpCode(HttpStatus.CREATED)
  async onboardPatient(@Body() onboardDto: any, @Request() req) {
    return this.onboardingService.onboardPatient(onboardDto, req);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyDto: any) {
    return this.onboardingService.verifyOtp(verifyDto);
  }

  @Post('verify-aadhaar')
  @HttpCode(HttpStatus.OK)
  async verifyAadhaar(@Body() aadhaarDto: any, @Request() req) {
    return this.onboardingService.verifyAadhaar(aadhaarDto, req);
  }

  @Post('complete-profile')
  @HttpCode(HttpStatus.OK)
  async completeProfile(@Body() profileDto: any, @Request() req) {
    return this.onboardingService.completeProfile(profileDto, req);
  }

  // Appointment endpoints
  @Get('appointments')
  async getAppointments(@Query() query: any, @Request() req) {
    return this.appointmentService.getAppointments(query, req.user);
  }

  @Post('appointments')
  @HttpCode(HttpStatus.CREATED)
  async bookAppointment(@Body() appointmentDto: any, @Request() req) {
    return this.appointmentService.bookAppointment(appointmentDto, req.user);
  }

  @Put('appointments/:appointmentId')
  async updateAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() updateDto: any,
    @Request() req,
  ) {
    return this.appointmentService.updateAppointment(appointmentId, updateDto, req.user);
  }

  @Delete('appointments/:appointmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelAppointment(@Param('appointmentId') appointmentId: string, @Request() req) {
    await this.appointmentService.cancelAppointment(appointmentId, req.user);
  }

  @Get('appointments/:appointmentId/details')
  async getAppointmentDetails(@Param('appointmentId') appointmentId: string, @Request() req) {
    return this.appointmentService.getAppointmentDetails(appointmentId, req.user);
  }

  // Family management endpoints
  @Get('family')
  async getFamilyMembers(@Request() req) {
    return this.familyService.getFamilyMembers(req.user);
  }

  @Post('family')
  @HttpCode(HttpStatus.CREATED)
  async addFamilyMember(@Body() familyDto: any, @Request() req) {
    return this.familyService.addFamilyMember(familyDto, req.user);
  }

  @Put('family/:memberId')
  async updateFamilyMember(
    @Param('memberId') memberId: string,
    @Body() updateDto: any,
    @Request() req,
  ) {
    return this.familyService.updateFamilyMember(memberId, updateDto, req.user);
  }

  @Delete('family/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFamilyMember(@Param('memberId') memberId: string, @Request() req) {
    await this.familyService.removeFamilyMember(memberId, req.user);
  }

  @Post('family/:memberId/switch')
  @HttpCode(HttpStatus.OK)
  async switchToFamilyMember(@Param('memberId') memberId: string, @Request() req) {
    return this.familyService.switchToFamilyMember(memberId, req.user);
  }

  // Health timeline endpoints
  @Get('timeline')
  async getHealthTimeline(@Query() query: any, @Request() req) {
    return this.healthTimelineService.getHealthTimeline(query, req.user);
  }

  @Get('timeline/summary')
  async getTimelineSummary(@Request() req) {
    return this.healthTimelineService.getTimelineSummary(req.user);
  }

  @Post('timeline/entries')
  @HttpCode(HttpStatus.CREATED)
  async addTimelineEntry(@Body() entryDto: any, @Request() req) {
    return this.healthTimelineService.addTimelineEntry(entryDto, req.user);
  }

  // Consent management endpoints
  @Get('consents')
  async getConsents(@Request() req) {
    return this.consentService.getConsents(req.user);
  }

  @Post('consents')
  @HttpCode(HttpStatus.CREATED)
  async createConsent(@Body() consentDto: any, @Request() req) {
    return this.consentService.createConsent(consentDto, req.user);
  }

  @Put('consents/:consentId')
  async updateConsent(
    @Param('consentId') consentId: string,
    @Body() updateDto: any,
    @Request() req,
  ) {
    return this.consentService.updateConsent(consentId, updateDto, req.user);
  }

  @Delete('consents/:consentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeConsent(@Param('consentId') consentId: string, @Request() req) {
    await this.consentService.revokeConsent(consentId, req.user);
  }

  @Get('consents/:consentId/status')
  async getConsentStatus(@Param('consentId') consentId: string, @Request() req) {
    return this.consentService.getConsentStatus(consentId, req.user);
  }

  // Payment endpoints
  @Get('bills')
  async getBills(@Query() query: any, @Request() req) {
    return this.paymentService.getBills(query, req.user);
  }

  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  async processPayment(@Body() paymentDto: any, @Request() req) {
    return this.paymentService.processPayment(paymentDto, req.user);
  }

  @Get('payments/history')
  async getPaymentHistory(@Query() query: any, @Request() req) {
    return this.paymentService.getPaymentHistory(query, req.user);
  }

  @Get('payments/:paymentId/status')
  async getPaymentStatus(@Param('paymentId') paymentId: string, @Request() req) {
    return this.paymentService.getPaymentStatus(paymentId, req.user);
  }

  // Reports and prescriptions endpoints
  @Get('reports')
  async getReports(@Query() query: any, @Request() req) {
    return this.reportService.getReports(query, req.user);
  }

  @Get('reports/:reportId')
  async getReport(@Param('reportId') reportId: string, @Request() req) {
    return this.reportService.getReport(reportId, req.user);
  }

  @Get('reports/:reportId/download')
  async downloadReport(@Param('reportId') reportId: string, @Request() req) {
    return this.reportService.downloadReport(reportId, req.user);
  }

  @Get('prescriptions')
  async getPrescriptions(@Query() query: any, @Request() req) {
    return this.reportService.getPrescriptions(query, req.user);
  }

  @Get('prescriptions/:prescriptionId')
  async getPrescription(@Param('prescriptionId') prescriptionId: string, @Request() req) {
    return this.reportService.getPrescription(prescriptionId, req.user);
  }

  @Get('prescriptions/:prescriptionId/download')
  async downloadPrescription(@Param('prescriptionId') prescriptionId: string, @Request() req) {
    return this.reportService.downloadPrescription(prescriptionId, req.user);
  }

  // Download/Share controls
  @Post('documents/share')
  @HttpCode(HttpStatus.OK)
  async shareDocument(@Body() shareDto: any, @Request() req) {
    return this.reportService.shareDocument(shareDto, req.user);
  }

  @Post('documents/request-access')
  @HttpCode(HttpStatus.OK)
  async requestDocumentAccess(@Body() accessDto: any, @Request() req) {
    return this.reportService.requestDocumentAccess(accessDto, req.user);
  }

  // Language support
  @Get('languages')
  async getAvailableLanguages(@Request() req) {
    return this.languageService.getAvailableLanguages(req.user.tenantId);
  }

  @Put('language')
  async setLanguage(@Body() languageDto: any, @Request() req) {
    return this.languageService.setLanguage(languageDto, req.user);
  }

  // Notifications
  @Get('notifications')
  async getNotifications(@Query() query: any, @Request() req) {
    return this.notificationService.getNotifications(query, req.user);
  }

  @Put('notifications/:notificationId/read')
  async markNotificationAsRead(@Param('notificationId') notificationId: string, @Request() req) {
    return this.notificationService.markAsRead(notificationId, req.user);
  }

  @Put('notifications/read-all')
  async markAllNotificationsAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user);
  }

  // Dashboard
  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.patientPortalService.getDashboard(req.user);
  }

  // Profile management
  @Get('profile')
  async getProfile(@Request() req) {
    return this.patientPortalService.getProfile(req.user);
  }

  @Put('profile')
  async updateProfile(@Body() profileDto: any, @Request() req) {
    return this.patientPortalService.updateProfile(profileDto, req.user);
  }

  @Put('profile/preferences')
  async updatePreferences(@Body() preferencesDto: any, @Request() req) {
    return this.patientPortalService.updatePreferences(preferencesDto, req.user);
  }

  // Emergency contact
  @Get('emergency-contacts')
  async getEmergencyContacts(@Request() req) {
    return this.patientPortalService.getEmergencyContacts(req.user);
  }

  @Post('emergency-contacts')
  @HttpCode(HttpStatus.CREATED)
  async addEmergencyContact(@Body() contactDto: any, @Request() req) {
    return this.patientPortalService.addEmergencyContact(contactDto, req.user);
  }

  @Put('emergency-contacts/:contactId')
  async updateEmergencyContact(
    @Param('contactId') contactId: string,
    @Body() contactDto: any,
    @Request() req,
  ) {
    return this.patientPortalService.updateEmergencyContact(contactId, contactDto, req.user);
  }

  @Delete('emergency-contacts/:contactId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeEmergencyContact(@Param('contactId') contactId: string, @Request() req) {
    await this.patientPortalService.removeEmergencyContact(contactId, req.user);
  }

  // Health reminders
  @Get('reminders')
  async getReminders(@Query() query: any, @Request() req) {
    return this.patientPortalService.getReminders(query, req.user);
  }

  @Post('reminders')
  @HttpCode(HttpStatus.CREATED)
  async setReminder(@Body() reminderDto: any, @Request() req) {
    return this.patientPortalService.setReminder(reminderDto, req.user);
  }

  @Put('reminders/:reminderId')
  async updateReminder(
    @Param('reminderId') reminderId: string,
    @Body() reminderDto: any,
    @Request() req,
  ) {
    return this.patientPortalService.updateReminder(reminderId, reminderDto, req.user);
  }

  @Delete('reminders/:reminderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReminder(@Param('reminderId') reminderId: string, @Request() req) {
    await this.patientPortalService.deleteReminder(reminderId, req.user);
  }
}
