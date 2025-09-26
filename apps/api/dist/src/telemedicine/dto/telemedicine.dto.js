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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BandwidthTestDto = exports.VideoQualityDto = exports.CreateNotificationDto = exports.PaymentDto = exports.FileUploadDto = exports.PrescriptionDto = exports.ScheduleDto = exports.JoinRoomDto = exports.ConsultationQueryDto = exports.UpdateConsultationDto = exports.CreateConsultationDto = void 0;
const class_validator_1 = require("class-validator");
class CreateConsultationDto {
    patientId;
    doctorId;
    scheduledAt;
    duration;
    consultationType;
    isEmergency;
    isPrescriptionRequired;
    paymentMode;
    notes;
    symptoms;
    severity;
}
exports.CreateConsultationDto = CreateConsultationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], CreateConsultationDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['GENERAL', 'SPECIALIST', 'FOLLOW_UP', 'EMERGENCY', 'MENTAL_HEALTH']),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "consultationType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConsultationDto.prototype, "isEmergency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConsultationDto.prototype, "isPrescriptionRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['PRE_PAID', 'POST_PAID']),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "paymentMode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateConsultationDto.prototype, "symptoms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "severity", void 0);
class UpdateConsultationDto {
    scheduledAt;
    duration;
    status;
    notes;
    rating;
    feedback;
}
exports.UpdateConsultationDto = UpdateConsultationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], UpdateConsultationDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], UpdateConsultationDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "feedback", void 0);
class ConsultationQueryDto {
    status;
    consultationType;
    doctorId;
    patientId;
    fromDate;
    toDate;
    page;
    limit;
}
exports.ConsultationQueryDto = ConsultationQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
    __metadata("design:type", String)
], ConsultationQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['GENERAL', 'SPECIALIST', 'FOLLOW_UP', 'EMERGENCY', 'MENTAL_HEALTH']),
    __metadata("design:type", String)
], ConsultationQueryDto.prototype, "consultationType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConsultationQueryDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConsultationQueryDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ConsultationQueryDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ConsultationQueryDto.prototype, "toDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConsultationQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConsultationQueryDto.prototype, "limit", void 0);
class JoinRoomDto {
    consultationId;
    userType;
    deviceInfo;
    networkInfo;
}
exports.JoinRoomDto = JoinRoomDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "consultationId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['DOCTOR', 'PATIENT']),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "userType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "networkInfo", void 0);
class ScheduleDto {
    doctorId;
    date;
    timeSlot;
    duration;
    consultationType;
    isEmergency;
}
exports.ScheduleDto = ScheduleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScheduleDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleDto.prototype, "timeSlot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], ScheduleDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['GENERAL', 'SPECIALIST', 'FOLLOW_UP', 'EMERGENCY', 'MENTAL_HEALTH']),
    __metadata("design:type", String)
], ScheduleDto.prototype, "consultationType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ScheduleDto.prototype, "isEmergency", void 0);
class PrescriptionDto {
    consultationId;
    medications;
    diagnosis;
    notes;
    isEmergency;
    labTests;
    imaging;
}
exports.PrescriptionDto = PrescriptionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionDto.prototype, "consultationId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], PrescriptionDto.prototype, "medications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PrescriptionDto.prototype, "isEmergency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PrescriptionDto.prototype, "labTests", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], PrescriptionDto.prototype, "imaging", void 0);
class FileUploadDto {
    consultationId;
    fileType;
    description;
    isPrivate;
}
exports.FileUploadDto = FileUploadDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FileUploadDto.prototype, "consultationId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PRESCRIPTION', 'LAB_REPORT', 'IMAGING', 'CONSULTATION_NOTES', 'OTHER']),
    __metadata("design:type", String)
], FileUploadDto.prototype, "fileType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FileUploadDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FileUploadDto.prototype, "isPrivate", void 0);
class PaymentDto {
    consultationId;
    amount;
    paymentMethod;
    paymentReference;
    paymentDetails;
}
exports.PaymentDto = PaymentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "consultationId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET', 'INSURANCE']),
    __metadata("design:type", String)
], PaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "paymentReference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PaymentDto.prototype, "paymentDetails", void 0);
class CreateNotificationDto {
    consultationId;
    notificationType;
    message;
    scheduledAt;
    channels;
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "consultationId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['REMINDER', 'FOLLOW_UP', 'PRESCRIPTION_READY', 'REPORT_READY', 'PAYMENT_DUE']),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "notificationType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(['SMS', 'EMAIL', 'WHATSAPP', 'PUSH']),
    __metadata("design:type", Array)
], CreateNotificationDto.prototype, "channels", void 0);
class VideoQualityDto {
    quality;
    maxBitrate;
    maxFrameRate;
}
exports.VideoQualityDto = VideoQualityDto;
__decorate([
    (0, class_validator_1.IsEnum)(['SD', 'HD', 'FHD', 'UHD']),
    __metadata("design:type", String)
], VideoQualityDto.prototype, "quality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(2000),
    __metadata("design:type", Number)
], VideoQualityDto.prototype, "maxBitrate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], VideoQualityDto.prototype, "maxFrameRate", void 0);
class BandwidthTestDto {
    downloadSpeed;
    uploadSpeed;
    latency;
    connectionType;
}
exports.BandwidthTestDto = BandwidthTestDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BandwidthTestDto.prototype, "downloadSpeed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BandwidthTestDto.prototype, "uploadSpeed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BandwidthTestDto.prototype, "latency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BandwidthTestDto.prototype, "connectionType", void 0);
//# sourceMappingURL=telemedicine.dto.js.map