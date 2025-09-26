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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimSettlementDto = exports.AuthorizationQueryDto = exports.ClaimQueryDto = exports.PreAuthQueryDto = exports.RoomUpgradeDto = exports.BillSplitDto = exports.EligibilityCheckDto = exports.UpdatePayerConfigDto = exports.CreatePayerConfigDto = exports.CreateEOBDto = exports.SubmitClaimDto = exports.UpdateClaimDto = exports.CreateClaimDto = exports.UpdateAuthorizationDto = exports.CreateAuthorizationDto = exports.SubmitPreAuthDto = exports.UpdatePreAuthDto = exports.CreatePreAuthDto = exports.UpdateTPADto = exports.CreateTPADto = exports.UpdatePolicyDto = exports.CreatePolicyDto = exports.UpdatePlanDto = exports.CreatePlanDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreatePlanDto {
    name;
    code;
    description;
    payerId;
    policyType;
    flowType;
    sumInsured;
    deductible;
    roomRentLimit;
    icuLimit;
    copayPercent;
    opdLimit;
    pharmacyLimit;
    networkType;
    preAuthRequired;
    claimTAT;
    exclusions;
    inclusions;
}
exports.CreatePlanDto = CreatePlanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "payerId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.PolicyType),
    __metadata("design:type", typeof (_a = typeof client_1.PolicyType !== "undefined" && client_1.PolicyType) === "function" ? _a : Object)
], CreatePlanDto.prototype, "policyType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.FlowType),
    __metadata("design:type", typeof (_b = typeof client_1.FlowType !== "undefined" && client_1.FlowType) === "function" ? _b : Object)
], CreatePlanDto.prototype, "flowType", void 0);
__decorate([
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "sumInsured", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "deductible", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "roomRentLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "icuLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "copayPercent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "opdLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "pharmacyLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "networkType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePlanDto.prototype, "preAuthRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "claimTAT", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePlanDto.prototype, "exclusions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePlanDto.prototype, "inclusions", void 0);
class UpdatePlanDto {
    name;
    code;
    description;
    policyType;
    flowType;
    sumInsured;
    deductible;
    roomRentLimit;
    icuLimit;
    copayPercent;
    opdLimit;
    pharmacyLimit;
    networkType;
    preAuthRequired;
    claimTAT;
    exclusions;
    inclusions;
}
exports.UpdatePlanDto = UpdatePlanDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PolicyType),
    __metadata("design:type", typeof (_c = typeof client_1.PolicyType !== "undefined" && client_1.PolicyType) === "function" ? _c : Object)
], UpdatePlanDto.prototype, "policyType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.FlowType),
    __metadata("design:type", typeof (_d = typeof client_1.FlowType !== "undefined" && client_1.FlowType) === "function" ? _d : Object)
], UpdatePlanDto.prototype, "flowType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "sumInsured", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "deductible", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "roomRentLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "icuLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "copayPercent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "opdLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "pharmacyLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "networkType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePlanDto.prototype, "preAuthRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "claimTAT", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePlanDto.prototype, "exclusions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePlanDto.prototype, "inclusions", void 0);
class CreatePolicyDto {
    policyNumber;
    planId;
    patientId;
    primaryInsuredId;
    startDate;
    endDate;
    sumInsuredUsed;
    tpaId;
}
exports.CreatePolicyDto = CreatePolicyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "policyNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "planId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "primaryInsuredId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreatePolicyDto.prototype, "sumInsuredUsed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "tpaId", void 0);
class UpdatePolicyDto {
    policyNumber;
    planId;
    primaryInsuredId;
    startDate;
    endDate;
    sumInsuredUsed;
    opdLimitUsed;
    pharmacyLimitUsed;
    roomRentUsed;
    icuUsed;
    tpaId;
    status;
}
exports.UpdatePolicyDto = UpdatePolicyDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "policyNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "planId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "primaryInsuredId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePolicyDto.prototype, "sumInsuredUsed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePolicyDto.prototype, "opdLimitUsed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePolicyDto.prototype, "pharmacyLimitUsed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePolicyDto.prototype, "roomRentUsed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdatePolicyDto.prototype, "icuUsed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "tpaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "status", void 0);
class CreateTPADto {
    name;
    code;
    contact;
    email;
    phone;
    address;
    website;
    contactPerson;
    contactEmail;
    contactPhone;
}
exports.CreateTPADto = CreateTPADto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTPADto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTPADto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTPADto.prototype, "contact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTPADto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTPADto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTPADto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTPADto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTPADto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTPADto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTPADto.prototype, "contactPhone", void 0);
class UpdateTPADto {
    name;
    code;
    contact;
    email;
    phone;
    address;
    website;
    contactPerson;
    contactEmail;
    contactPhone;
}
exports.UpdateTPADto = UpdateTPADto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTPADto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTPADto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTPADto.prototype, "contact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTPADto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTPADto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTPADto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTPADto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTPADto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTPADto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTPADto.prototype, "contactPhone", void 0);
class CreatePreAuthDto {
    policyId;
    planId;
    patientId;
    visitId;
    tpaId;
    requestedAmount;
    status;
    priority;
    diagnosis;
    procedureCodes;
    clinicalNotes;
    estimatedLOS;
    roomType;
}
exports.CreatePreAuthDto = CreatePreAuthDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreAuthDto.prototype, "policyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreAuthDto.prototype, "planId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreAuthDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreAuthDto.prototype, "visitId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreAuthDto.prototype, "tpaId", void 0);
__decorate([
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePreAuthDto.prototype, "requestedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PreAuthStatus),
    __metadata("design:type", typeof (_e = typeof client_1.PreAuthStatus !== "undefined" && client_1.PreAuthStatus) === "function" ? _e : Object)
], CreatePreAuthDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreAuthDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreAuthDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePreAuthDto.prototype, "procedureCodes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreAuthDto.prototype, "clinicalNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePreAuthDto.prototype, "estimatedLOS", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreAuthDto.prototype, "roomType", void 0);
class UpdatePreAuthDto {
    requestedAmount;
    approvedAmount;
    status;
    priority;
    diagnosis;
    procedureCodes;
    clinicalNotes;
    estimatedLOS;
    roomType;
    approvedAt;
    rejectedAt;
    approvedBy;
    rejectionReason;
    tpaReferenceNumber;
}
exports.UpdatePreAuthDto = UpdatePreAuthDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePreAuthDto.prototype, "requestedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePreAuthDto.prototype, "approvedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PreAuthStatus),
    __metadata("design:type", typeof (_f = typeof client_1.PreAuthStatus !== "undefined" && client_1.PreAuthStatus) === "function" ? _f : Object)
], UpdatePreAuthDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePreAuthDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePreAuthDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreAuthDto.prototype, "procedureCodes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePreAuthDto.prototype, "clinicalNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePreAuthDto.prototype, "estimatedLOS", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePreAuthDto.prototype, "roomType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePreAuthDto.prototype, "approvedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePreAuthDto.prototype, "rejectedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePreAuthDto.prototype, "approvedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePreAuthDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePreAuthDto.prototype, "tpaReferenceNumber", void 0);
class SubmitPreAuthDto {
    preAuthId;
    documents;
}
exports.SubmitPreAuthDto = SubmitPreAuthDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitPreAuthDto.prototype, "preAuthId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SubmitPreAuthDto.prototype, "documents", void 0);
class CreateAuthorizationDto {
    preAuthId;
    policyId;
    patientId;
    tpaId;
    approvedAmount;
    validFrom;
    validUntil;
    roomTypeApproved;
    icuApproved;
    pharmacyLimit;
    opdLimit;
    specialConditions;
    approvalNotes;
    approvedBy;
}
exports.CreateAuthorizationDto = CreateAuthorizationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuthorizationDto.prototype, "preAuthId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuthorizationDto.prototype, "policyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuthorizationDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuthorizationDto.prototype, "tpaId", void 0);
__decorate([
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAuthorizationDto.prototype, "approvedAmount", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAuthorizationDto.prototype, "validFrom", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAuthorizationDto.prototype, "validUntil", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuthorizationDto.prototype, "roomTypeApproved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAuthorizationDto.prototype, "icuApproved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateAuthorizationDto.prototype, "pharmacyLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateAuthorizationDto.prototype, "opdLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuthorizationDto.prototype, "specialConditions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuthorizationDto.prototype, "approvalNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuthorizationDto.prototype, "approvedBy", void 0);
class UpdateAuthorizationDto {
    approvedAmount;
    utilizedAmount;
    status;
    validFrom;
    validUntil;
    roomTypeApproved;
    icuApproved;
    pharmacyLimit;
    opdLimit;
    specialConditions;
    approvalNotes;
    exhaustedAt;
}
exports.UpdateAuthorizationDto = UpdateAuthorizationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateAuthorizationDto.prototype, "approvedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateAuthorizationDto.prototype, "utilizedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AuthorizationStatus),
    __metadata("design:type", typeof (_g = typeof client_1.AuthorizationStatus !== "undefined" && client_1.AuthorizationStatus) === "function" ? _g : Object)
], UpdateAuthorizationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateAuthorizationDto.prototype, "validFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateAuthorizationDto.prototype, "validUntil", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAuthorizationDto.prototype, "roomTypeApproved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAuthorizationDto.prototype, "icuApproved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateAuthorizationDto.prototype, "pharmacyLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateAuthorizationDto.prototype, "opdLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAuthorizationDto.prototype, "specialConditions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAuthorizationDto.prototype, "approvalNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateAuthorizationDto.prototype, "exhaustedAt", void 0);
class CreateClaimDto {
    invoiceId;
    policyId;
    planId;
    patientId;
    preAuthId;
    authorizationId;
    tpaId;
    claimedAmount;
    status;
}
exports.CreateClaimDto = CreateClaimDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "invoiceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "policyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "planId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "preAuthId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "authorizationId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClaimDto.prototype, "tpaId", void 0);
__decorate([
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateClaimDto.prototype, "claimedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ClaimStatus),
    __metadata("design:type", typeof (_h = typeof client_1.ClaimStatus !== "undefined" && client_1.ClaimStatus) === "function" ? _h : Object)
], CreateClaimDto.prototype, "status", void 0);
class UpdateClaimDto {
    claimedAmount;
    approvedAmount;
    rejectedAmount;
    patientShare;
    status;
    denialCodes;
    denialReasons;
    submittedAt;
    processedAt;
    settledAt;
    processedBy;
    settlementRef;
}
exports.UpdateClaimDto = UpdateClaimDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateClaimDto.prototype, "claimedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateClaimDto.prototype, "approvedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateClaimDto.prototype, "rejectedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateClaimDto.prototype, "patientShare", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ClaimStatus),
    __metadata("design:type", typeof (_j = typeof client_1.ClaimStatus !== "undefined" && client_1.ClaimStatus) === "function" ? _j : Object)
], UpdateClaimDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateClaimDto.prototype, "denialCodes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClaimDto.prototype, "denialReasons", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateClaimDto.prototype, "submittedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateClaimDto.prototype, "processedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateClaimDto.prototype, "settledAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClaimDto.prototype, "processedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClaimDto.prototype, "settlementRef", void 0);
class SubmitClaimDto {
    claimId;
    documents;
}
exports.SubmitClaimDto = SubmitClaimDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitClaimDto.prototype, "claimId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SubmitClaimDto.prototype, "documents", void 0);
class CreateEOBDto {
    claimId;
    eobNumber;
    processedDate;
    paymentDate;
    paymentRef;
    totalClaimed;
    totalApproved;
    totalRejected;
    patientShare;
    disallowances;
    paymentDetails;
    remarks;
    processedBy;
}
exports.CreateEOBDto = CreateEOBDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEOBDto.prototype, "claimId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEOBDto.prototype, "eobNumber", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEOBDto.prototype, "processedDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEOBDto.prototype, "paymentDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEOBDto.prototype, "paymentRef", void 0);
__decorate([
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateEOBDto.prototype, "totalClaimed", void 0);
__decorate([
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateEOBDto.prototype, "totalApproved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateEOBDto.prototype, "totalRejected", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateEOBDto.prototype, "patientShare", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateEOBDto.prototype, "disallowances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateEOBDto.prototype, "paymentDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEOBDto.prototype, "remarks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEOBDto.prototype, "processedBy", void 0);
class CreatePayerConfigDto {
    payerId;
    configKey;
    configValue;
}
exports.CreatePayerConfigDto = CreatePayerConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePayerConfigDto.prototype, "payerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePayerConfigDto.prototype, "configKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePayerConfigDto.prototype, "configValue", void 0);
class UpdatePayerConfigDto {
    configKey;
    configValue;
}
exports.UpdatePayerConfigDto = UpdatePayerConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePayerConfigDto.prototype, "configKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdatePayerConfigDto.prototype, "configValue", void 0);
class EligibilityCheckDto {
    policyNumber;
    patientId;
    serviceCode;
    amount;
}
exports.EligibilityCheckDto = EligibilityCheckDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EligibilityCheckDto.prototype, "policyNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EligibilityCheckDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EligibilityCheckDto.prototype, "serviceCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], EligibilityCheckDto.prototype, "amount", void 0);
class BillSplitDto {
    invoiceId;
    policyId;
    preAuthId;
    authorizationId;
}
exports.BillSplitDto = BillSplitDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BillSplitDto.prototype, "invoiceId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BillSplitDto.prototype, "policyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BillSplitDto.prototype, "preAuthId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BillSplitDto.prototype, "authorizationId", void 0);
class RoomUpgradeDto {
    admissionId;
    newRoomType;
    differentialAmount;
    approvalRef;
}
exports.RoomUpgradeDto = RoomUpgradeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RoomUpgradeDto.prototype, "admissionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RoomUpgradeDto.prototype, "newRoomType", void 0);
__decorate([
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RoomUpgradeDto.prototype, "differentialAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RoomUpgradeDto.prototype, "approvalRef", void 0);
class PreAuthQueryDto {
    patientId;
    policyId;
    tpaId;
    status;
    fromDate;
    toDate;
}
exports.PreAuthQueryDto = PreAuthQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PreAuthQueryDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PreAuthQueryDto.prototype, "policyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PreAuthQueryDto.prototype, "tpaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PreAuthStatus),
    __metadata("design:type", typeof (_k = typeof client_1.PreAuthStatus !== "undefined" && client_1.PreAuthStatus) === "function" ? _k : Object)
], PreAuthQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PreAuthQueryDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PreAuthQueryDto.prototype, "toDate", void 0);
class ClaimQueryDto {
    patientId;
    policyId;
    tpaId;
    status;
    fromDate;
    toDate;
}
exports.ClaimQueryDto = ClaimQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimQueryDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimQueryDto.prototype, "policyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimQueryDto.prototype, "tpaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ClaimStatus),
    __metadata("design:type", typeof (_l = typeof client_1.ClaimStatus !== "undefined" && client_1.ClaimStatus) === "function" ? _l : Object)
], ClaimQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ClaimQueryDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ClaimQueryDto.prototype, "toDate", void 0);
class AuthorizationQueryDto {
    patientId;
    policyId;
    status;
    validFrom;
    validUntil;
}
exports.AuthorizationQueryDto = AuthorizationQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuthorizationQueryDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuthorizationQueryDto.prototype, "policyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AuthorizationStatus),
    __metadata("design:type", typeof (_m = typeof client_1.AuthorizationStatus !== "undefined" && client_1.AuthorizationStatus) === "function" ? _m : Object)
], AuthorizationQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AuthorizationQueryDto.prototype, "validFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AuthorizationQueryDto.prototype, "validUntil", void 0);
class ClaimSettlementDto {
    claimId;
    settlementRef;
    paymentDate;
    paymentAmount;
    shortPayment;
    remarks;
    disallowances;
    paymentDetails;
}
exports.ClaimSettlementDto = ClaimSettlementDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimSettlementDto.prototype, "claimId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimSettlementDto.prototype, "settlementRef", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ClaimSettlementDto.prototype, "paymentDate", void 0);
__decorate([
    (0, class_validator_1.IsDecimal)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ClaimSettlementDto.prototype, "paymentAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], ClaimSettlementDto.prototype, "shortPayment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimSettlementDto.prototype, "remarks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ClaimSettlementDto.prototype, "disallowances", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ClaimSettlementDto.prototype, "paymentDetails", void 0);
//# sourceMappingURL=insurance.dto.js.map