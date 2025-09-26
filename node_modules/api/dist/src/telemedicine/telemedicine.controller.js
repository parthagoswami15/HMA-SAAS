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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemedicineController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const telemedicine_service_1 = require("./telemedicine.service");
const video_service_1 = require("./services/video.service");
const scheduling_service_1 = require("./services/scheduling.service");
const prescription_service_1 = require("./services/prescription.service");
const payment_service_1 = require("./services/payment.service");
const file_service_1 = require("./services/file.service");
const state_restriction_service_1 = require("./services/state-restriction.service");
const identity_verification_service_1 = require("./services/identity-verification.service");
const bandwidth_service_1 = require("./services/bandwidth.service");
const notification_service_1 = require("./services/notification.service");
const telemedicine_dto_1 = require("./dto/telemedicine.dto");
let TelemedicineController = class TelemedicineController {
    telemedicineService;
    videoService;
    schedulingService;
    prescriptionService;
    paymentService;
    fileService;
    stateRestrictionService;
    identityVerificationService;
    bandwidthService;
    notificationService;
    constructor(telemedicineService, videoService, schedulingService, prescriptionService, paymentService, fileService, stateRestrictionService, identityVerificationService, bandwidthService, notificationService) {
        this.telemedicineService = telemedicineService;
        this.videoService = videoService;
        this.schedulingService = schedulingService;
        this.prescriptionService = prescriptionService;
        this.paymentService = paymentService;
        this.fileService = fileService;
        this.stateRestrictionService = stateRestrictionService;
        this.identityVerificationService = identityVerificationService;
        this.bandwidthService = bandwidthService;
        this.notificationService = notificationService;
    }
    async createConsultation(createDto, req) {
        return this.telemedicineService.createConsultation(createDto, req.user);
    }
    async getConsultations(query, req) {
        return this.telemedicineService.getConsultations(query, req.user);
    }
    async getConsultation(id, req) {
        return this.telemedicineService.getConsultation(id, req.user);
    }
    async updateConsultation(id, updateDto, req) {
        return this.telemedicineService.updateConsultation(id, updateDto, req.user);
    }
    async cancelConsultation(id, req) {
        await this.telemedicineService.cancelConsultation(id, req.user);
    }
    async joinRoom(joinDto, req) {
        return this.videoService.joinRoom(joinDto, req.user);
    }
    async leaveRoom(leaveDto, req) {
        return this.videoService.leaveRoom(leaveDto, req.user);
    }
    async getRoomStatus(consultationId, req) {
        return this.videoService.getRoomStatus(consultationId, req.user);
    }
    async startScreenShare(consultationId, screenShareDto, req) {
        return this.videoService.startScreenShare(consultationId, screenShareDto, req.user);
    }
    async stopScreenShare(consultationId, req) {
        await this.videoService.stopScreenShare(consultationId, req.user);
    }
    async scheduleConsultation(scheduleDto, req) {
        return this.schedulingService.scheduleConsultation(scheduleDto, req.user);
    }
    async getAvailability(query, req) {
        return this.schedulingService.getAvailability(query, req.user);
    }
    async getTimeSlots(query, req) {
        return this.schedulingService.getTimeSlots(query, req.user);
    }
    async rescheduleConsultation(id, rescheduleDto, req) {
        return this.schedulingService.rescheduleConsultation(id, rescheduleDto, req.user);
    }
    async createPrescription(prescriptionDto, req) {
        return this.prescriptionService.createPrescription(prescriptionDto, req.user);
    }
    async getConsultationPrescription(consultationId, req) {
        return this.prescriptionService.getConsultationPrescription(consultationId, req.user);
    }
    async sharePrescription(id, shareDto, req) {
        return this.prescriptionService.sharePrescription(id, shareDto, req.user);
    }
    async getPrescriptionPdf(id, req) {
        const pdfBuffer = await this.prescriptionService.generatePrescriptionPdf(id, req.user);
        return new common_1.StreamableFile(pdfBuffer);
    }
    async createLabOrder(labOrderDto, req) {
        return this.telemedicineService.createLabOrder(labOrderDto, req.user);
    }
    async createRadioOrder(radioOrderDto, req) {
        return this.telemedicineService.createRadioOrder(radioOrderDto, req.user);
    }
    async getConsultationOrders(consultationId, req) {
        return this.telemedicineService.getConsultationOrders(consultationId, req.user);
    }
    async processPayment(paymentDto, req) {
        return this.paymentService.processPayment(paymentDto, req.user);
    }
    async getPaymentStatus(consultationId, req) {
        return this.paymentService.getPaymentStatus(consultationId, req.user);
    }
    async processRefund(consultationId, refundDto, req) {
        return this.paymentService.processRefund(consultationId, refundDto, req.user);
    }
    async getPaymentMethods(req) {
        return this.paymentService.getPaymentMethods(req.user);
    }
    async uploadFile(file, fileUploadDto, req) {
        return this.fileService.uploadFile(file, fileUploadDto, req.user);
    }
    async getConsultationFiles(consultationId, req) {
        return this.fileService.getConsultationFiles(consultationId, req.user);
    }
    async downloadFile(fileId, req) {
        const fileBuffer = await this.fileService.downloadFile(fileId, req.user);
        return new common_1.StreamableFile(fileBuffer);
    }
    async deleteFile(fileId, req) {
        await this.fileService.deleteFile(fileId, req.user);
    }
    async getStateRestrictions(state, req) {
        return this.stateRestrictionService.getStateRestrictions(state, req.user);
    }
    async verifyIdentity(identityDto, req) {
        return this.identityVerificationService.verifyIdentity(identityDto, req.user);
    }
    async getIdentityVerificationStatus(consultationId, req) {
        return this.identityVerificationService.getVerificationStatus(consultationId, req.user);
    }
    async testBandwidth(req) {
        return this.bandwidthService.testBandwidth(req.user);
    }
    async updateVideoQuality(id, qualityDto, req) {
        return this.bandwidthService.updateVideoQuality(id, qualityDto, req.user);
    }
    async getQualitySettings(req) {
        return this.bandwidthService.getQualitySettings(req.user);
    }
    async sendConsultationNotification(consultationId, notificationDto, req) {
        return this.notificationService.sendConsultationNotification(consultationId, notificationDto, req.user);
    }
    async getConsultationReports(query, req) {
        return this.telemedicineService.getConsultationReports(query, req.user);
    }
    async getRevenueReports(query, req) {
        return this.telemedicineService.getRevenueReports(query, req.user);
    }
    async getPatientSatisfaction(query, req) {
        return this.telemedicineService.getPatientSatisfaction(query, req.user);
    }
    async createEmergencyConsultation(emergencyDto, req) {
        return this.telemedicineService.createEmergencyConsultation(emergencyDto, req.user);
    }
    async getEmergencyQueue(req) {
        return this.telemedicineService.getEmergencyQueue(req.user);
    }
    async startRecording(consultationId, req) {
        return this.videoService.startRecording(consultationId, req.user);
    }
    async stopRecording(consultationId, req) {
        return this.videoService.stopRecording(consultationId, req.user);
    }
    async getRecording(consultationId, req) {
        return this.videoService.getRecording(consultationId, req.user);
    }
};
exports.TelemedicineController = TelemedicineController;
__decorate([
    (0, common_1.Post)('consultations'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telemedicine_dto_1.CreateConsultationDto, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "createConsultation", null);
__decorate([
    (0, common_1.Get)('consultations'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telemedicine_dto_1.ConsultationQueryDto, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getConsultations", null);
__decorate([
    (0, common_1.Get)('consultations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getConsultation", null);
__decorate([
    (0, common_1.Put)('consultations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, telemedicine_dto_1.UpdateConsultationDto, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "updateConsultation", null);
__decorate([
    (0, common_1.Delete)('consultations/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "cancelConsultation", null);
__decorate([
    (0, common_1.Post)('rooms/join'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telemedicine_dto_1.JoinRoomDto, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Post)('rooms/leave'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "leaveRoom", null);
__decorate([
    (0, common_1.Get)('rooms/:consultationId/status'),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getRoomStatus", null);
__decorate([
    (0, common_1.Post)('rooms/:consultationId/screen-share'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "startScreenShare", null);
__decorate([
    (0, common_1.Delete)('rooms/:consultationId/screen-share'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "stopScreenShare", null);
__decorate([
    (0, common_1.Post)('schedule'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telemedicine_dto_1.ScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "scheduleConsultation", null);
__decorate([
    (0, common_1.Get)('availability'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Get)('time-slots'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getTimeSlots", null);
__decorate([
    (0, common_1.Put)('consultations/:id/reschedule'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "rescheduleConsultation", null);
__decorate([
    (0, common_1.Post)('prescriptions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telemedicine_dto_1.PrescriptionDto, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Get)('consultations/:consultationId/prescription'),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getConsultationPrescription", null);
__decorate([
    (0, common_1.Post)('prescriptions/:id/share'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "sharePrescription", null);
__decorate([
    (0, common_1.Get)('prescriptions/:id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getPrescriptionPdf", null);
__decorate([
    (0, common_1.Post)('lab-orders'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "createLabOrder", null);
__decorate([
    (0, common_1.Post)('radio-orders'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "createRadioOrder", null);
__decorate([
    (0, common_1.Get)('consultations/:consultationId/orders'),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getConsultationOrders", null);
__decorate([
    (0, common_1.Post)('payments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telemedicine_dto_1.PaymentDto, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Get)('payments/:consultationId'),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getPaymentStatus", null);
__decorate([
    (0, common_1.Post)('payments/:consultationId/refund'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "processRefund", null);
__decorate([
    (0, common_1.Get)('payment-methods'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getPaymentMethods", null);
__decorate([
    (0, common_1.Post)('files/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, telemedicine_dto_1.FileUploadDto, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('files/:consultationId'),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getConsultationFiles", null);
__decorate([
    (0, common_1.Get)('files/:fileId/download'),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Delete)('files/:fileId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Get)('restrictions/:state'),
    __param(0, (0, common_1.Param)('state')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getStateRestrictions", null);
__decorate([
    (0, common_1.Post)('verify-identity'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "verifyIdentity", null);
__decorate([
    (0, common_1.Get)('identity-verification-status/:consultationId'),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getIdentityVerificationStatus", null);
__decorate([
    (0, common_1.Get)('bandwidth-test'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "testBandwidth", null);
__decorate([
    (0, common_1.Put)('consultations/:id/quality'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "updateVideoQuality", null);
__decorate([
    (0, common_1.Get)('quality-settings'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getQualitySettings", null);
__decorate([
    (0, common_1.Post)('consultations/:consultationId/notify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "sendConsultationNotification", null);
__decorate([
    (0, common_1.Get)('reports/consultations'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getConsultationReports", null);
__decorate([
    (0, common_1.Get)('reports/revenue'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getRevenueReports", null);
__decorate([
    (0, common_1.Get)('reports/patient-satisfaction'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getPatientSatisfaction", null);
__decorate([
    (0, common_1.Post)('emergency-consultation'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "createEmergencyConsultation", null);
__decorate([
    (0, common_1.Get)('emergency-queue'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getEmergencyQueue", null);
__decorate([
    (0, common_1.Post)('consultations/:consultationId/recording/start'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "startRecording", null);
__decorate([
    (0, common_1.Post)('consultations/:consultationId/recording/stop'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "stopRecording", null);
__decorate([
    (0, common_1.Get)('consultations/:consultationId/recording'),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TelemedicineController.prototype, "getRecording", null);
exports.TelemedicineController = TelemedicineController = __decorate([
    (0, common_1.Controller)('telemedicine'),
    __metadata("design:paramtypes", [telemedicine_service_1.TelemedicineService,
        video_service_1.VideoService,
        scheduling_service_1.SchedulingService,
        prescription_service_1.PrescriptionService,
        payment_service_1.PaymentService,
        file_service_1.FileService,
        state_restriction_service_1.StateRestrictionService,
        identity_verification_service_1.IdentityVerificationService,
        bandwidth_service_1.BandwidthService,
        notification_service_1.NotificationService])
], TelemedicineController);
//# sourceMappingURL=telemedicine.controller.js.map