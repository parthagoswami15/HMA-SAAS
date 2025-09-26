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
exports.ComplianceReportDto = exports.AuditQueryDto = exports.AuditLogDto = exports.NarcoticsRegisterDto = exports.UpdatePrescriptionDto = exports.CreatePrescriptionDto = exports.DeathRegistrationApprovalDto = exports.UpdateDeathRegistrationDto = exports.CreateDeathRegistrationDto = exports.BirthRegistrationApprovalDto = exports.UpdateBirthRegistrationDto = exports.CreateBirthRegistrationDto = exports.AadhaarConsentDto = exports.UpdateAadhaarDto = exports.CreateAadhaarDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAadhaarDto {
    patientId;
    aadhaarNumber;
    maskedAadhaar;
    hashedAadhaar;
    consentGiven;
    consentDetails;
    consentDate;
}
exports.CreateAadhaarDto = CreateAadhaarDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAadhaarDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAadhaarDto.prototype, "aadhaarNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAadhaarDto.prototype, "maskedAadhaar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAadhaarDto.prototype, "hashedAadhaar", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAadhaarDto.prototype, "consentGiven", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAadhaarDto.prototype, "consentDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAadhaarDto.prototype, "consentDate", void 0);
class UpdateAadhaarDto {
    maskedAadhaar;
    hashedAadhaar;
    consentGiven;
    consentDetails;
    consentDate;
}
exports.UpdateAadhaarDto = UpdateAadhaarDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAadhaarDto.prototype, "maskedAadhaar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAadhaarDto.prototype, "hashedAadhaar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAadhaarDto.prototype, "consentGiven", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAadhaarDto.prototype, "consentDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateAadhaarDto.prototype, "consentDate", void 0);
class AadhaarConsentDto {
    consentGiven;
    consentDetails;
    ipAddress;
    userAgent;
}
exports.AadhaarConsentDto = AadhaarConsentDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AadhaarConsentDto.prototype, "consentGiven", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AadhaarConsentDto.prototype, "consentDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AadhaarConsentDto.prototype, "ipAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AadhaarConsentDto.prototype, "userAgent", void 0);
class CreateBirthRegistrationDto {
    patientId;
    hospitalId;
    birthDetails;
    parentDetails;
    witnesses;
    registrationNumber;
}
exports.CreateBirthRegistrationDto = CreateBirthRegistrationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBirthRegistrationDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBirthRegistrationDto.prototype, "hospitalId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateBirthRegistrationDto.prototype, "birthDetails", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateBirthRegistrationDto.prototype, "parentDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateBirthRegistrationDto.prototype, "witnesses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBirthRegistrationDto.prototype, "registrationNumber", void 0);
class UpdateBirthRegistrationDto {
    birthDetails;
    parentDetails;
    witnesses;
    registrationNumber;
}
exports.UpdateBirthRegistrationDto = UpdateBirthRegistrationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateBirthRegistrationDto.prototype, "birthDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateBirthRegistrationDto.prototype, "parentDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateBirthRegistrationDto.prototype, "witnesses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBirthRegistrationDto.prototype, "registrationNumber", void 0);
class BirthRegistrationApprovalDto {
    status;
    approvalComments;
    approvedBy;
    approvalDate;
}
exports.BirthRegistrationApprovalDto = BirthRegistrationApprovalDto;
__decorate([
    (0, class_validator_1.IsEnum)(['APPROVED', 'REJECTED', 'PENDING']),
    __metadata("design:type", String)
], BirthRegistrationApprovalDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BirthRegistrationApprovalDto.prototype, "approvalComments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BirthRegistrationApprovalDto.prototype, "approvedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BirthRegistrationApprovalDto.prototype, "approvalDate", void 0);
class CreateDeathRegistrationDto {
    patientId;
    hospitalId;
    deathDetails;
    deceasedDetails;
    informantDetails;
    witnesses;
    registrationNumber;
}
exports.CreateDeathRegistrationDto = CreateDeathRegistrationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeathRegistrationDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeathRegistrationDto.prototype, "hospitalId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateDeathRegistrationDto.prototype, "deathDetails", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateDeathRegistrationDto.prototype, "deceasedDetails", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateDeathRegistrationDto.prototype, "informantDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateDeathRegistrationDto.prototype, "witnesses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeathRegistrationDto.prototype, "registrationNumber", void 0);
class UpdateDeathRegistrationDto {
    deathDetails;
    deceasedDetails;
    informantDetails;
    witnesses;
    registrationNumber;
}
exports.UpdateDeathRegistrationDto = UpdateDeathRegistrationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateDeathRegistrationDto.prototype, "deathDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateDeathRegistrationDto.prototype, "deceasedDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateDeathRegistrationDto.prototype, "informantDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateDeathRegistrationDto.prototype, "witnesses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeathRegistrationDto.prototype, "registrationNumber", void 0);
class DeathRegistrationApprovalDto {
    status;
    approvalComments;
    approvedBy;
    approvalDate;
}
exports.DeathRegistrationApprovalDto = DeathRegistrationApprovalDto;
__decorate([
    (0, class_validator_1.IsEnum)(['APPROVED', 'REJECTED', 'PENDING']),
    __metadata("design:type", String)
], DeathRegistrationApprovalDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeathRegistrationApprovalDto.prototype, "approvalComments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeathRegistrationApprovalDto.prototype, "approvedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DeathRegistrationApprovalDto.prototype, "approvalDate", void 0);
class CreatePrescriptionDto {
    patientId;
    doctorId;
    medications;
    diagnosis;
    isEmergency;
    validTill;
}
exports.CreatePrescriptionDto = CreatePrescriptionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePrescriptionDto.prototype, "medications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePrescriptionDto.prototype, "isEmergency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "validTill", void 0);
class UpdatePrescriptionDto {
    medications;
    diagnosis;
    isEmergency;
    validTill;
}
exports.UpdatePrescriptionDto = UpdatePrescriptionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Object)
], UpdatePrescriptionDto.prototype, "medications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePrescriptionDto.prototype, "isEmergency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePrescriptionDto.prototype, "validTill", void 0);
class NarcoticsRegisterDto {
    prescriptionId;
    drugName;
    batchNumber;
    dispensedBy;
    witnessName;
    witnessSignature;
    patientSignature;
    remarks;
}
exports.NarcoticsRegisterDto = NarcoticsRegisterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NarcoticsRegisterDto.prototype, "prescriptionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NarcoticsRegisterDto.prototype, "drugName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NarcoticsRegisterDto.prototype, "batchNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NarcoticsRegisterDto.prototype, "dispensedBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NarcoticsRegisterDto.prototype, "witnessName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NarcoticsRegisterDto.prototype, "witnessSignature", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NarcoticsRegisterDto.prototype, "patientSignature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NarcoticsRegisterDto.prototype, "remarks", void 0);
class AuditLogDto {
    action;
    entityType;
    entityId;
    oldValues;
    newValues;
    ipAddress;
    userAgent;
}
exports.AuditLogDto = AuditLogDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditLogDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditLogDto.prototype, "entityType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditLogDto.prototype, "entityId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AuditLogDto.prototype, "oldValues", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AuditLogDto.prototype, "newValues", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditLogDto.prototype, "ipAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditLogDto.prototype, "userAgent", void 0);
class AuditQueryDto {
    entityType;
    entityId;
    action;
    userId;
    fromDate;
    toDate;
    page;
    limit;
}
exports.AuditQueryDto = AuditQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditQueryDto.prototype, "entityType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditQueryDto.prototype, "entityId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditQueryDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditQueryDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AuditQueryDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AuditQueryDto.prototype, "toDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditQueryDto.prototype, "limit", void 0);
class ComplianceReportDto {
    period;
    type;
    components;
    fromDate;
    toDate;
}
exports.ComplianceReportDto = ComplianceReportDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
    __metadata("design:type", String)
], ComplianceReportDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['summary', 'detailed', 'regulatory']),
    __metadata("design:type", String)
], ComplianceReportDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ComplianceReportDto.prototype, "components", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ComplianceReportDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ComplianceReportDto.prototype, "toDate", void 0);
//# sourceMappingURL=compliance.dto.js.map