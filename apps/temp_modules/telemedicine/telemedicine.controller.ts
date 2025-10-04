import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  UploadedFile,
  UseInterceptors,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TelemedicineService } from './telemedicine.service';
import { VideoService } from './services/video.service';
import { SchedulingService } from './services/scheduling.service';
import { PrescriptionService } from './services/prescription.service';
import { PaymentService } from './services/payment.service';
import { FileService } from './services/file.service';
import { StateRestrictionService } from './services/state-restriction.service';
import { IdentityVerificationService } from './services/identity-verification.service';
import { BandwidthService } from './services/bandwidth.service';
import { NotificationService } from './services/notification.service';
import {
  CreateConsultationDto,
  UpdateConsultationDto,
  ConsultationQueryDto,
  JoinRoomDto,
  PrescriptionDto,
  FileUploadDto,
  PaymentDto,
  ScheduleDto,
} from './dto/telemedicine.dto';

@Controller('telemedicine')
export class TelemedicineController {
  constructor(
    private readonly telemedicineService: TelemedicineService,
    private readonly videoService: VideoService,
    private readonly schedulingService: SchedulingService,
    private readonly prescriptionService: PrescriptionService,
    private readonly paymentService: PaymentService,
    private readonly fileService: FileService,
    private readonly stateRestrictionService: StateRestrictionService,
    private readonly identityVerificationService: IdentityVerificationService,
    private readonly bandwidthService: BandwidthService,
    private readonly notificationService: NotificationService,
  ) {}

  // Consultation Management
  @Post('consultations')
  @HttpCode(HttpStatus.CREATED)
  async createConsultation(
    @Body() createDto: CreateConsultationDto,
    @Request() req,
  ) {
    return this.telemedicineService.createConsultation(createDto, req.user);
  }

  @Get('consultations')
  async getConsultations(@Query() query: ConsultationQueryDto, @Request() req) {
    return this.telemedicineService.getConsultations(query, req.user);
  }

  @Get('consultations/:id')
  async getConsultation(@Param('id') id: string, @Request() req) {
    return this.telemedicineService.getConsultation(id, req.user);
  }

  @Put('consultations/:id')
  async updateConsultation(
    @Param('id') id: string,
    @Body() updateDto: UpdateConsultationDto,
    @Request() req,
  ) {
    return this.telemedicineService.updateConsultation(id, updateDto, req.user);
  }

  @Delete('consultations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelConsultation(@Param('id') id: string, @Request() req) {
    await this.telemedicineService.cancelConsultation(id, req.user);
  }

  // Video Room Management
  @Post('rooms/join')
  @HttpCode(HttpStatus.OK)
  async joinRoom(@Body() joinDto: JoinRoomDto, @Request() req) {
    return this.videoService.joinRoom(joinDto, req.user);
  }

  @Post('rooms/leave')
  @HttpCode(HttpStatus.OK)
  async leaveRoom(@Body() leaveDto: any, @Request() req) {
    return this.videoService.leaveRoom(leaveDto, req.user);
  }

  @Get('rooms/:consultationId/status')
  async getRoomStatus(@Param('consultationId') consultationId: string, @Request() req) {
    return this.videoService.getRoomStatus(consultationId, req.user);
  }

  @Post('rooms/:consultationId/screen-share')
  @HttpCode(HttpStatus.OK)
  async startScreenShare(
    @Param('consultationId') consultationId: string,
    @Body() screenShareDto: any,
    @Request() req,
  ) {
    return this.videoService.startScreenShare(consultationId, screenShareDto, req.user);
  }

  @Delete('rooms/:consultationId/screen-share')
  @HttpCode(HttpStatus.NO_CONTENT)
  async stopScreenShare(
    @Param('consultationId') consultationId: string,
    @Request() req,
  ) {
    await this.videoService.stopScreenShare(consultationId, req.user);
  }

  // Scheduling
  @Post('schedule')
  @HttpCode(HttpStatus.CREATED)
  async scheduleConsultation(@Body() scheduleDto: ScheduleDto, @Request() req) {
    return this.schedulingService.scheduleConsultation(scheduleDto, req.user);
  }

  @Get('availability')
  async getAvailability(@Query() query: any, @Request() req) {
    return this.schedulingService.getAvailability(query, req.user);
  }

  @Get('time-slots')
  async getTimeSlots(@Query() query: any, @Request() req) {
    return this.schedulingService.getTimeSlots(query, req.user);
  }

  @Put('consultations/:id/reschedule')
  async rescheduleConsultation(
    @Param('id') id: string,
    @Body() rescheduleDto: any,
    @Request() req,
  ) {
    return this.schedulingService.rescheduleConsultation(id, rescheduleDto, req.user);
  }

  // e-Prescription
  @Post('prescriptions')
  @HttpCode(HttpStatus.CREATED)
  async createPrescription(@Body() prescriptionDto: PrescriptionDto, @Request() req) {
    return this.prescriptionService.createPrescription(prescriptionDto, req.user);
  }

  @Get('consultations/:consultationId/prescription')
  async getConsultationPrescription(
    @Param('consultationId') consultationId: string,
    @Request() req,
  ) {
    return this.prescriptionService.getConsultationPrescription(consultationId, req.user);
  }

  @Post('prescriptions/:id/share')
  @HttpCode(HttpStatus.OK)
  async sharePrescription(
    @Param('id') id: string,
    @Body() shareDto: any,
    @Request() req,
  ) {
    return this.prescriptionService.sharePrescription(id, shareDto, req.user);
  }

  @Get('prescriptions/:id/pdf')
  async getPrescriptionPdf(@Param('id') id: string, @Request() req) {
    const pdfBuffer = await this.prescriptionService.generatePrescriptionPdf(id, req.user);
    return new StreamableFile(pdfBuffer);
  }

  // Lab/Radio Orders
  @Post('lab-orders')
  @HttpCode(HttpStatus.CREATED)
  async createLabOrder(@Body() labOrderDto: any, @Request() req) {
    return this.telemedicineService.createLabOrder(labOrderDto, req.user);
  }

  @Post('radio-orders')
  @HttpCode(HttpStatus.CREATED)
  async createRadioOrder(@Body() radioOrderDto: any, @Request() req) {
    return this.telemedicineService.createRadioOrder(radioOrderDto, req.user);
  }

  @Get('consultations/:consultationId/orders')
  async getConsultationOrders(
    @Param('consultationId') consultationId: string,
    @Request() req,
  ) {
    return this.telemedicineService.getConsultationOrders(consultationId, req.user);
  }

  // Payment Management
  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  async processPayment(@Body() paymentDto: PaymentDto, @Request() req) {
    return this.paymentService.processPayment(paymentDto, req.user);
  }

  @Get('payments/:consultationId')
  async getPaymentStatus(@Param('consultationId') consultationId: string, @Request() req) {
    return this.paymentService.getPaymentStatus(consultationId, req.user);
  }

  @Post('payments/:consultationId/refund')
  @HttpCode(HttpStatus.OK)
  async processRefund(
    @Param('consultationId') consultationId: string,
    @Body() refundDto: any,
    @Request() req,
  ) {
    return this.paymentService.processRefund(consultationId, refundDto, req.user);
  }

  @Get('payment-methods')
  async getPaymentMethods(@Request() req) {
    return this.paymentService.getPaymentMethods(req.user);
  }

  // File Management
  @Post('files/upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @UploadedFile() file: any,
    @Body() fileUploadDto: FileUploadDto,
    @Request() req,
  ) {
    return this.fileService.uploadFile(file, fileUploadDto, req.user);
  }

  @Get('files/:consultationId')
  async getConsultationFiles(
    @Param('consultationId') consultationId: string,
    @Request() req,
  ) {
    return this.fileService.getConsultationFiles(consultationId, req.user);
  }

  @Get('files/:fileId/download')
  async downloadFile(@Param('fileId') fileId: string, @Request() req) {
    const fileBuffer = await this.fileService.downloadFile(fileId, req.user);
    return new StreamableFile(fileBuffer);
  }

  @Delete('files/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('fileId') fileId: string, @Request() req) {
    await this.fileService.deleteFile(fileId, req.user);
  }

  // State Restrictions
  @Get('restrictions/:state')
  async getStateRestrictions(@Param('state') state: string, @Request() req) {
    return this.stateRestrictionService.getStateRestrictions(state, req.user);
  }

  @Post('verify-identity')
  @HttpCode(HttpStatus.OK)
  async verifyIdentity(@Body() identityDto: any, @Request() req) {
    return this.identityVerificationService.verifyIdentity(identityDto, req.user);
  }

  @Get('identity-verification-status/:consultationId')
  async getIdentityVerificationStatus(
    @Param('consultationId') consultationId: string,
    @Request() req,
  ) {
    return this.identityVerificationService.getVerificationStatus(consultationId, req.user);
  }

  // Bandwidth & Quality
  @Get('bandwidth-test')
  async testBandwidth(@Request() req) {
    return this.bandwidthService.testBandwidth(req.user);
  }

  @Put('consultations/:id/quality')
  async updateVideoQuality(
    @Param('id') id: string,
    @Body() qualityDto: any,
    @Request() req,
  ) {
    return this.bandwidthService.updateVideoQuality(id, qualityDto, req.user);
  }

  @Get('quality-settings')
  async getQualitySettings(@Request() req) {
    return this.bandwidthService.getQualitySettings(req.user);
  }

  // Notifications
  @Post('consultations/:consultationId/notify')
  @HttpCode(HttpStatus.OK)
  async sendConsultationNotification(
    @Param('consultationId') consultationId: string,
    @Body() notificationDto: any,
    @Request() req,
  ) {
    return this.notificationService.sendConsultationNotification(
      consultationId,
      notificationDto,
      req.user,
    );
  }

  // Reports & Analytics
  @Get('reports/consultations')
  async getConsultationReports(@Query() query: any, @Request() req) {
    return this.telemedicineService.getConsultationReports(query, req.user);
  }

  @Get('reports/revenue')
  async getRevenueReports(@Query() query: any, @Request() req) {
    return this.telemedicineService.getRevenueReports(query, req.user);
  }

  @Get('reports/patient-satisfaction')
  async getPatientSatisfaction(@Query() query: any, @Request() req) {
    return this.telemedicineService.getPatientSatisfaction(query, req.user);
  }

  // Emergency Features
  @Post('emergency-consultation')
  @HttpCode(HttpStatus.CREATED)
  async createEmergencyConsultation(@Body() emergencyDto: any, @Request() req) {
    return this.telemedicineService.createEmergencyConsultation(emergencyDto, req.user);
  }

  @Get('emergency-queue')
  async getEmergencyQueue(@Request() req) {
    return this.telemedicineService.getEmergencyQueue(req.user);
  }

  // Recording Management
  @Post('consultations/:consultationId/recording/start')
  @HttpCode(HttpStatus.OK)
  async startRecording(
    @Param('consultationId') consultationId: string,
    @Request() req,
  ) {
    return this.videoService.startRecording(consultationId, req.user);
  }

  @Post('consultations/:consultationId/recording/stop')
  @HttpCode(HttpStatus.OK)
  async stopRecording(
    @Param('consultationId') consultationId: string,
    @Request() req,
  ) {
    return this.videoService.stopRecording(consultationId, req.user);
  }

  @Get('consultations/:consultationId/recording')
  async getRecording(
    @Param('consultationId') consultationId: string,
    @Request() req,
  ) {
    return this.videoService.getRecording(consultationId, req.user);
  }
}
