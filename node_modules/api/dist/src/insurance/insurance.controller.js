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
exports.InsuranceController = void 0;
const common_1 = require("@nestjs/common");
const insurance_service_1 = require("./insurance.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const insurance_dto_1 = require("./insurance.dto");
let InsuranceController = class InsuranceController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async createPlan(tenantId, dto) {
        return this.svc.createPlan(tenantId, dto);
    }
    async getPlans(tenantId, payerId) {
        return this.svc.getPlans(tenantId, payerId);
    }
    async getPlan(tenantId, id) {
        return this.svc.getPlanById(tenantId, id);
    }
    async updatePlan(tenantId, id, dto) {
        return this.svc.updatePlan(tenantId, id, dto);
    }
    async deletePlan(tenantId, id) {
        return this.svc.deletePlan(tenantId, id);
    }
    async createPolicy(tenantId, dto) {
        return this.svc.createPolicy(tenantId, dto);
    }
    async getPolicies(tenantId, patientId) {
        return this.svc.getPolicies(tenantId, patientId);
    }
    async getPolicy(tenantId, id) {
        return this.svc.getPolicyById(tenantId, id);
    }
    async updatePolicy(tenantId, id, dto) {
        return this.svc.updatePolicy(tenantId, id, dto);
    }
    async deletePolicy(tenantId, id) {
        return this.svc.deletePolicy(tenantId, id);
    }
    async createTPA(tenantId, dto) {
        return this.svc.createTPA(tenantId, dto);
    }
    async getTPAs(tenantId) {
        return this.svc.getTPAs(tenantId);
    }
    async getTPA(tenantId, id) {
        return this.svc.getTPAById(tenantId, id);
    }
    async updateTPA(tenantId, id, dto) {
        return this.svc.updateTPA(tenantId, id, dto);
    }
    async deleteTPA(tenantId, id) {
        return this.svc.deleteTPA(tenantId, id);
    }
    async createPreAuth(tenantId, dto) {
        return this.svc.createPreAuth(tenantId, dto);
    }
    async getPreAuths(tenantId, query) {
        return this.svc.getPreAuths(tenantId, query);
    }
    async getPreAuth(tenantId, id) {
        return this.svc.getPreAuthById(tenantId, id);
    }
    async updatePreAuth(tenantId, id, dto) {
        return this.svc.updatePreAuth(tenantId, id, dto);
    }
    async submitPreAuth(tenantId, id, dto) {
        return this.svc.submitPreAuth(tenantId, { ...dto, preAuthId: id });
    }
    async deletePreAuth(tenantId, id) {
        return this.svc.deletePreAuth(tenantId, id);
    }
    async createAuthorization(tenantId, dto) {
        return this.svc.createAuthorization(tenantId, dto);
    }
    async getAuthorizations(tenantId, query) {
        return this.svc.getAuthorizations(tenantId, query);
    }
    async getAuthorization(tenantId, id) {
        return this.svc.getAuthorizationById(tenantId, id);
    }
    async updateAuthorization(tenantId, id, dto) {
        return this.svc.updateAuthorization(tenantId, id, dto);
    }
    async deleteAuthorization(tenantId, id) {
        return this.svc.deleteAuthorization(tenantId, id);
    }
    async createClaim(tenantId, dto) {
        return this.svc.createClaim(tenantId, dto);
    }
    async getClaims(tenantId, query) {
        return this.svc.getClaims(tenantId, query);
    }
    async getClaim(tenantId, id) {
        return this.svc.getClaimById(tenantId, id);
    }
    async updateClaim(tenantId, id, dto) {
        return this.svc.updateClaim(tenantId, id, dto);
    }
    async submitClaim(tenantId, id, dto) {
        return this.svc.submitClaim(tenantId, { ...dto, claimId: id });
    }
    async processClaimSettlement(tenantId, id, dto) {
        return this.svc.processClaimSettlement(tenantId, { ...dto, claimId: id });
    }
    async createEOB(tenantId, dto) {
        return this.svc.createEOB(tenantId, dto);
    }
    async getEOB(tenantId, id) {
        return this.svc.getEOBById(tenantId, id);
    }
    async createPayerConfig(tenantId, dto) {
        return this.svc.createPayerConfig(tenantId, dto);
    }
    async getPayerConfigs(tenantId, payerId) {
        return this.svc.getPayerConfigs(tenantId, payerId);
    }
    async updatePayerConfig(tenantId, id, dto) {
        return this.svc.updatePayerConfig(tenantId, id, dto);
    }
    async deletePayerConfig(tenantId, id) {
        return this.svc.deletePayerConfig(tenantId, id);
    }
    async checkEligibility(tenantId, dto) {
        return this.svc.checkEligibility(tenantId, dto);
    }
    async splitBill(tenantId, dto) {
        return this.svc.splitBill(tenantId, dto);
    }
    async processRoomUpgrade(tenantId, dto) {
        return this.svc.processRoomUpgrade(tenantId, dto);
    }
    async getPolicyBalance(tenantId, policyId) {
        return this.svc.getPolicyBalance(tenantId, policyId);
    }
    async getInsuranceSummary(tenantId, fromDate, toDate) {
        return this.svc.getInsuranceSummary(tenantId, fromDate ? new Date(fromDate) : undefined, toDate ? new Date(toDate) : undefined);
    }
    async handlePartialApproval(tenantId, id, { approvedAmount, reason }) {
        return this.svc.handlePartialApproval(tenantId, id, approvedAmount, reason);
    }
    async handleExhaustedLimit(tenantId, id) {
        return this.svc.handleExhaustedLimit(tenantId, id);
    }
};
exports.InsuranceController = InsuranceController;
__decorate([
    (0, common_1.Post)('plans'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.CreatePlanDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Get)('plans'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('payerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Get)('plans/:id'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getPlan", null);
__decorate([
    (0, common_1.Put)('plans/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, insurance_dto_1.UpdatePlanDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Delete)('plans/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "deletePlan", null);
__decorate([
    (0, common_1.Post)('policies'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.CreatePolicyDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "createPolicy", null);
__decorate([
    (0, common_1.Get)('policies'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getPolicies", null);
__decorate([
    (0, common_1.Get)('policies/:id'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getPolicy", null);
__decorate([
    (0, common_1.Put)('policies/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, insurance_dto_1.UpdatePolicyDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updatePolicy", null);
__decorate([
    (0, common_1.Delete)('policies/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "deletePolicy", null);
__decorate([
    (0, common_1.Post)('tpas'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.CreateTPADto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "createTPA", null);
__decorate([
    (0, common_1.Get)('tpas'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getTPAs", null);
__decorate([
    (0, common_1.Get)('tpas/:id'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getTPA", null);
__decorate([
    (0, common_1.Put)('tpas/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, insurance_dto_1.UpdateTPADto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updateTPA", null);
__decorate([
    (0, common_1.Delete)('tpas/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "deleteTPA", null);
__decorate([
    (0, common_1.Post)('pre-auths'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.CreatePreAuthDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "createPreAuth", null);
__decorate([
    (0, common_1.Get)('pre-auths'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.PreAuthQueryDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getPreAuths", null);
__decorate([
    (0, common_1.Get)('pre-auths/:id'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getPreAuth", null);
__decorate([
    (0, common_1.Put)('pre-auths/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, insurance_dto_1.UpdatePreAuthDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updatePreAuth", null);
__decorate([
    (0, common_1.Post)('pre-auths/:id/submit'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, insurance_dto_1.SubmitPreAuthDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "submitPreAuth", null);
__decorate([
    (0, common_1.Delete)('pre-auths/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "deletePreAuth", null);
__decorate([
    (0, common_1.Post)('authorizations'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.CreateAuthorizationDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "createAuthorization", null);
__decorate([
    (0, common_1.Get)('authorizations'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.AuthorizationQueryDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getAuthorizations", null);
__decorate([
    (0, common_1.Get)('authorizations/:id'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getAuthorization", null);
__decorate([
    (0, common_1.Put)('authorizations/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, insurance_dto_1.UpdateAuthorizationDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updateAuthorization", null);
__decorate([
    (0, common_1.Delete)('authorizations/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "deleteAuthorization", null);
__decorate([
    (0, common_1.Post)('claims'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.CreateClaimDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "createClaim", null);
__decorate([
    (0, common_1.Get)('claims'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.ClaimQueryDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getClaims", null);
__decorate([
    (0, common_1.Get)('claims/:id'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getClaim", null);
__decorate([
    (0, common_1.Put)('claims/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, insurance_dto_1.UpdateClaimDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updateClaim", null);
__decorate([
    (0, common_1.Post)('claims/:id/submit'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, insurance_dto_1.SubmitClaimDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "submitClaim", null);
__decorate([
    (0, common_1.Post)('claims/:id/settle'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, insurance_dto_1.ClaimSettlementDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "processClaimSettlement", null);
__decorate([
    (0, common_1.Post)('eobs'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.CreateEOBDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "createEOB", null);
__decorate([
    (0, common_1.Get)('eobs/:id'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getEOB", null);
__decorate([
    (0, common_1.Post)('payer-configs'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.CreatePayerConfigDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "createPayerConfig", null);
__decorate([
    (0, common_1.Get)('payer-configs'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('payerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getPayerConfigs", null);
__decorate([
    (0, common_1.Put)('payer-configs/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, insurance_dto_1.UpdatePayerConfigDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updatePayerConfig", null);
__decorate([
    (0, common_1.Delete)('payer-configs/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "deletePayerConfig", null);
__decorate([
    (0, common_1.Post)('eligibility-check'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.EligibilityCheckDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "checkEligibility", null);
__decorate([
    (0, common_1.Post)('bill-split'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.BillSplitDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "splitBill", null);
__decorate([
    (0, common_1.Post)('room-upgrade'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.RoomUpgradeDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "processRoomUpgrade", null);
__decorate([
    (0, common_1.Get)('policy-balance/:policyId'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('policyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getPolicyBalance", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('fromDate')),
    __param(2, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getInsuranceSummary", null);
__decorate([
    (0, common_1.Post)('pre-auths/:id/partial-approval'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "handlePartialApproval", null);
__decorate([
    (0, common_1.Post)('policies/:id/exhausted-limit'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "handleExhaustedLimit", null);
exports.InsuranceController = InsuranceController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('insurance'),
    __metadata("design:paramtypes", [insurance_service_1.InsuranceService])
], InsuranceController);
//# sourceMappingURL=insurance.controller.js.map