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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const compliance_service_1 = require("./compliance.service");
const aadhaar_service_1 = require("./services/aadhaar.service");
const audit_service_1 = require("./services/audit.service");
const birth_death_service_1 = require("./services/birth-death.service");
const pcpndt_service_1 = require("./services/pcpndt.service");
const prescription_service_1 = require("./services/prescription.service");
const data_localization_service_1 = require("./services/data-localization.service");
const compliance_guard_1 = require("./guards/compliance.guard");
const pcpndt_guard_1 = require("./guards/pcpndt.guard");
const prescription_guard_1 = require("./guards/prescription.guard");
const aadhaar_dto_1 = require("./dto/aadhaar.dto");
const birth_death_dto_1 = require("./dto/birth-death.dto");
const prescription_dto_1 = require("./dto/prescription.dto");
const compliance_dto_1 = require("./dto/compliance.dto");
let ComplianceController = class ComplianceController {
    complianceService;
    aadhaarService;
    auditService;
    birthDeathService;
    pcpndtService;
    prescriptionService;
    dataLocalizationService;
    constructor(complianceService, aadhaarService, auditService, birthDeathService, pcpndtService, prescriptionService, dataLocalizationService) {
        this.complianceService = complianceService;
        this.aadhaarService = aadhaarService;
        this.auditService = auditService;
        this.birthDeathService = birthDeathService;
        this.pcpndtService = pcpndtService;
        this.prescriptionService = prescriptionService;
        this.dataLocalizationService = dataLocalizationService;
    }
    async createAadhaar(createAadhaarDto, req) {
        return this.aadhaarService.createAadhaar(createAadhaarDto, req.user);
    }
    async updateAadhaar(id, updateAadhaarDto, req) {
        return this.aadhaarService.updateAadhaar(id, updateAadhaarDto, req.user);
    }
    async recordAadhaarConsent(id, consentDto, req) {
        return this.aadhaarService.recordConsent(id, consentDto, req.user);
    }
    async getAadhaar(id, req) {
        return this.aadhaarService.getAadhaar(id, req.user);
    }
    async createBirthRegistration(createDto, req) {
        return this.birthDeathService.createBirthRegistration(createDto, req.user);
    }
    async updateBirthRegistration(id, updateDto, req) {
        return this.birthDeathService.updateBirthRegistration(id, updateDto, req.user);
    }
    async approveBirthRegistration(id, approvalDto, req) {
        return this.birthDeathService.approveBirthRegistration(id, approvalDto, req.user);
    }
    async createDeathRegistration(createDto, req) {
        return this.birthDeathService.createDeathRegistration(createDto, req.user);
    }
    async updateDeathRegistration(id, updateDto, req) {
        return this.birthDeathService.updateDeathRegistration(id, updateDto, req.user);
    }
    async approveDeathRegistration(id, approvalDto, req) {
        return this.birthDeathService.approveDeathRegistration(id, approvalDto, req.user);
    }
    async requestPcpndtAccess(requestDto, req) {
        return this.pcpndtService.requestAccess(requestDto, req.user);
    }
    async getPcpndtAccessLogs(query, req) {
        return this.pcpndtService.getAccessLogs(query, req.user);
    }
    async createPrescription(createDto, req) {
        return this.prescriptionService.createPrescription(createDto, req.user);
    }
    async updatePrescription(id, updateDto, req) {
        return this.prescriptionService.updatePrescription(id, updateDto, req.user);
    }
    async recordNarcoticsDispense(registerDto, req) {
        return this.prescriptionService.recordNarcoticsDispense(registerDto, req.user);
    }
    async getAuditLogs(query, req) {
        return this.auditService.getAuditLogs(query, req.user);
    }
    async createAuditLog(auditDto, req) {
        return this.auditService.createAuditLog(auditDto, req.user);
    }
    async getComplianceReports(query, req) {
        return this.complianceService.generateComplianceReport(query, req.user);
    }
    async getDataLocalizationStatus(req) {
        return this.dataLocalizationService.getLocalizationStatus(req.user);
    }
    async complyWithDataLocalization(complianceDto, req) {
        return this.dataLocalizationService.ensureCompliance(complianceDto, req.user);
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Post)('aadhaar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof aadhaar_dto_1.CreateAadhaarDto !== "undefined" && aadhaar_dto_1.CreateAadhaarDto) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createAadhaar", null);
__decorate([
    (0, common_1.Put)('aadhaar/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof aadhaar_dto_1.UpdateAadhaarDto !== "undefined" && aadhaar_dto_1.UpdateAadhaarDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateAadhaar", null);
__decorate([
    (0, common_1.Post)('aadhaar/:id/consent'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof aadhaar_dto_1.AadhaarConsentDto !== "undefined" && aadhaar_dto_1.AadhaarConsentDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "recordAadhaarConsent", null);
__decorate([
    (0, common_1.Get)('aadhaar/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getAadhaar", null);
__decorate([
    (0, common_1.Post)('birth-registration'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof birth_death_dto_1.CreateBirthRegistrationDto !== "undefined" && birth_death_dto_1.CreateBirthRegistrationDto) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createBirthRegistration", null);
__decorate([
    (0, common_1.Put)('birth-registration/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof birth_death_dto_1.UpdateBirthRegistrationDto !== "undefined" && birth_death_dto_1.UpdateBirthRegistrationDto) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateBirthRegistration", null);
__decorate([
    (0, common_1.Post)('birth-registration/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof birth_death_dto_1.BirthRegistrationApprovalDto !== "undefined" && birth_death_dto_1.BirthRegistrationApprovalDto) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "approveBirthRegistration", null);
__decorate([
    (0, common_1.Post)('death-registration'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof birth_death_dto_1.CreateDeathRegistrationDto !== "undefined" && birth_death_dto_1.CreateDeathRegistrationDto) === "function" ? _g : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createDeathRegistration", null);
__decorate([
    (0, common_1.Put)('death-registration/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_h = typeof birth_death_dto_1.UpdateDeathRegistrationDto !== "undefined" && birth_death_dto_1.UpdateDeathRegistrationDto) === "function" ? _h : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateDeathRegistration", null);
__decorate([
    (0, common_1.Post)('death-registration/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_j = typeof birth_death_dto_1.DeathRegistrationApprovalDto !== "undefined" && birth_death_dto_1.DeathRegistrationApprovalDto) === "function" ? _j : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "approveDeathRegistration", null);
__decorate([
    (0, common_1.Post)('pcpndt/access-request'),
    (0, common_1.UseGuards)(pcpndt_guard_1.PcpndtGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "requestPcpndtAccess", null);
__decorate([
    (0, common_1.Get)('pcpndt/access-logs'),
    (0, common_1.UseGuards)(pcpndt_guard_1.PcpndtGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getPcpndtAccessLogs", null);
__decorate([
    (0, common_1.Post)('prescription'),
    (0, common_1.UseGuards)(prescription_guard_1.PrescriptionGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof prescription_dto_1.CreatePrescriptionDto !== "undefined" && prescription_dto_1.CreatePrescriptionDto) === "function" ? _k : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Put)('prescription/:id'),
    (0, common_1.UseGuards)(prescription_guard_1.PrescriptionGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_l = typeof prescription_dto_1.UpdatePrescriptionDto !== "undefined" && prescription_dto_1.UpdatePrescriptionDto) === "function" ? _l : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updatePrescription", null);
__decorate([
    (0, common_1.Post)('narcotics-register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof prescription_dto_1.NarcoticsRegisterDto !== "undefined" && prescription_dto_1.NarcoticsRegisterDto) === "function" ? _m : Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "recordNarcoticsDispense", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_dto_1.AuditQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Post)('audit-logs'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_dto_1.AuditLogDto, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createAuditLog", null);
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_dto_1.ComplianceReportDto, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getComplianceReports", null);
__decorate([
    (0, common_1.Get)('data-localization/status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getDataLocalizationStatus", null);
__decorate([
    (0, common_1.Post)('data-localization/comply'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "complyWithDataLocalization", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, common_1.Controller)('compliance'),
    (0, common_1.UseGuards)(compliance_guard_1.ComplianceGuard),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService,
        aadhaar_service_1.AadhaarService,
        audit_service_1.AuditService,
        birth_death_service_1.BirthDeathService,
        pcpndt_service_1.PcpndtService,
        prescription_service_1.PrescriptionService,
        data_localization_service_1.DataLocalizationService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map