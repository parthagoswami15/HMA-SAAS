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
exports.SecurityController = void 0;
const common_1 = require("@nestjs/common");
const security_service_1 = require("./security.service");
const authentication_service_1 = require("./services/authentication.service");
const authorization_service_1 = require("./services/authorization.service");
const mfa_service_1 = require("./services/mfa.service");
const encryption_service_1 = require("./services/encryption.service");
const audit_service_1 = require("./services/audit.service");
const session_service_1 = require("./services/session.service");
const device_service_1 = require("./services/device.service");
const ip_service_1 = require("./services/ip.service");
const data_retention_service_1 = require("./services/data-retention.service");
const anomaly_detection_service_1 = require("./services/anomaly-detection.service");
let SecurityController = class SecurityController {
    securityService;
    authenticationService;
    authorizationService;
    mfaService;
    encryptionService;
    auditService;
    sessionService;
    deviceService;
    ipService;
    dataRetentionService;
    anomalyDetectionService;
    constructor(securityService, authenticationService, authorizationService, mfaService, encryptionService, auditService, sessionService, deviceService, ipService, dataRetentionService, anomalyDetectionService) {
        this.securityService = securityService;
        this.authenticationService = authenticationService;
        this.authorizationService = authorizationService;
        this.mfaService = mfaService;
        this.encryptionService = encryptionService;
        this.auditService = auditService;
        this.sessionService = sessionService;
        this.deviceService = deviceService;
        this.ipService = ipService;
        this.dataRetentionService = dataRetentionService;
        this.anomalyDetectionService = anomalyDetectionService;
    }
    async login(loginDto, req) {
        return this.authenticationService.login(loginDto, req);
    }
    async logout(req) {
        return this.authenticationService.logout(req.user);
    }
    async refreshToken(refreshDto) {
        return this.authenticationService.refreshToken(refreshDto.refreshToken);
    }
    async setupMfa(req) {
        return this.mfaService.setupMfa(req.user);
    }
    async verifyMfa(verifyDto, req) {
        return this.mfaService.verifyMfa(verifyDto, req.user);
    }
    async disableMfa(disableDto, req) {
        return this.mfaService.disableMfa(disableDto, req.user);
    }
    async generateBackupCodes(req) {
        return this.mfaService.generateBackupCodes(req.user);
    }
    async samlLogin(req) {
        return this.authenticationService.initiateSamlLogin(req);
    }
    async samlCallback(callbackDto) {
        return this.authenticationService.handleSamlCallback(callbackDto);
    }
    async oidcLogin(req) {
        return this.authenticationService.initiateOidcLogin(req);
    }
    async oidcCallback(callbackDto) {
        return this.authenticationService.handleOidcCallback(callbackDto);
    }
    async getPermissions(req) {
        return this.authorizationService.getUserPermissions(req.user);
    }
    async getRoles(req) {
        return this.authorizationService.getUserRoles(req.user);
    }
    async checkPermission(permissionDto, req) {
        return this.authorizationService.checkPermission(permissionDto, req.user);
    }
    async getUserSessions(req) {
        return this.sessionService.getUserSessions(req.user);
    }
    async revokeSession(sessionId, req) {
        await this.sessionService.revokeSession(sessionId, req.user);
    }
    async revokeAllSessions(req) {
        await this.sessionService.revokeAllSessions(req.user);
    }
    async getUserDevices(req) {
        return this.deviceService.getUserDevices(req.user);
    }
    async trustDevice(trustDto, req) {
        return this.deviceService.trustDevice(trustDto, req.user);
    }
    async revokeDevice(deviceId, req) {
        await this.deviceService.revokeDevice(deviceId, req.user);
    }
    async getIpAllowlist(req) {
        return this.ipService.getIpAllowlist(req.user.tenantId);
    }
    async addIpToAllowlist(ipDto, req) {
        return this.ipService.addIpToAllowlist(ipDto, req.user);
    }
    async removeIpFromAllowlist(ipId, req) {
        await this.ipService.removeIpFromAllowlist(ipId, req.user);
    }
    async encryptData(encryptDto, req) {
        return this.encryptionService.encryptData(encryptDto, req.user);
    }
    async decryptData(decryptDto, req) {
        return this.encryptionService.decryptData(decryptDto, req.user);
    }
    async getRetentionPolicies(req) {
        return this.dataRetentionService.getRetentionPolicies(req.user.tenantId);
    }
    async createRetentionPolicy(policyDto, req) {
        return this.dataRetentionService.createRetentionPolicy(policyDto, req.user);
    }
    async updateRetentionPolicy(policyId, policyDto, req) {
        return this.dataRetentionService.updateRetentionPolicy(policyId, policyDto, req.user);
    }
    async deleteRetentionPolicy(policyId, req) {
        await this.dataRetentionService.deleteRetentionPolicy(policyId, req.user);
    }
    async requestDataErasure(erasureDto, req) {
        return this.dataRetentionService.requestDataErasure(erasureDto, req.user);
    }
    async getDataErasureRequests(req) {
        return this.dataRetentionService.getDataErasureRequests(req.user.tenantId);
    }
    async getAuditLogs(query, req) {
        return this.auditService.getAuditLogs(query, req.user);
    }
    async getEntityAuditLogs(entityType, entityId, req) {
        return this.auditService.getEntityAuditLogs(entityType, entityId, req.user);
    }
    async getAnomalies(query, req) {
        return this.anomalyDetectionService.getAnomalies(query, req.user);
    }
    async resolveAnomaly(anomalyId, resolveDto, req) {
        return this.anomalyDetectionService.resolveAnomaly(anomalyId, resolveDto, req.user);
    }
    async getSecuritySettings(req) {
        return this.securityService.getSecuritySettings(req.user.tenantId);
    }
    async updateSecuritySettings(settingsDto, req) {
        return this.securityService.updateSecuritySettings(settingsDto, req.user);
    }
    async getLoginAttemptsReport(query, req) {
        return this.securityService.getLoginAttemptsReport(query, req.user);
    }
    async getSecurityEventsReport(query, req) {
        return this.securityService.getSecurityEventsReport(query, req.user);
    }
    async getComplianceReport(query, req) {
        return this.securityService.getComplianceReport(query, req.user);
    }
    async changePassword(passwordDto, req) {
        return this.authenticationService.changePassword(passwordDto, req.user);
    }
    async resetPassword(resetDto) {
        return this.authenticationService.resetPassword(resetDto);
    }
    async forgotPassword(forgotDto) {
        return this.authenticationService.forgotPassword(forgotDto);
    }
    async getSecurityHealth(req) {
        return this.securityService.getSecurityHealth(req.user.tenantId);
    }
    async getCertificates(req) {
        return this.securityService.getCertificates(req.user.tenantId);
    }
    async renewCertificate(renewDto, req) {
        return this.securityService.renewCertificate(renewDto, req.user);
    }
    async getSecurityPolicies(req) {
        return this.securityService.getSecurityPolicies(req.user.tenantId);
    }
    async updateSecurityPolicies(policiesDto, req) {
        return this.securityService.updateSecurityPolicies(policiesDto, req.user);
    }
};
exports.SecurityController = SecurityController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('mfa/setup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "setupMfa", null);
__decorate([
    (0, common_1.Post)('mfa/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "verifyMfa", null);
__decorate([
    (0, common_1.Post)('mfa/disable'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "disableMfa", null);
__decorate([
    (0, common_1.Post)('mfa/backup-codes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "generateBackupCodes", null);
__decorate([
    (0, common_1.Get)('sso/saml/login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "samlLogin", null);
__decorate([
    (0, common_1.Post)('sso/saml/callback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "samlCallback", null);
__decorate([
    (0, common_1.Get)('sso/oidc/login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "oidcLogin", null);
__decorate([
    (0, common_1.Post)('sso/oidc/callback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "oidcCallback", null);
__decorate([
    (0, common_1.Get)('permissions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Get)('roles'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Post)('permissions/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "checkPermission", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getUserSessions", null);
__decorate([
    (0, common_1.Delete)('sessions/:sessionId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "revokeSession", null);
__decorate([
    (0, common_1.Delete)('sessions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "revokeAllSessions", null);
__decorate([
    (0, common_1.Get)('devices'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getUserDevices", null);
__decorate([
    (0, common_1.Post)('devices/trust'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "trustDevice", null);
__decorate([
    (0, common_1.Delete)('devices/:deviceId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('deviceId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "revokeDevice", null);
__decorate([
    (0, common_1.Get)('ip-allowlist'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getIpAllowlist", null);
__decorate([
    (0, common_1.Post)('ip-allowlist'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "addIpToAllowlist", null);
__decorate([
    (0, common_1.Delete)('ip-allowlist/:ipId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('ipId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "removeIpFromAllowlist", null);
__decorate([
    (0, common_1.Post)('encrypt'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "encryptData", null);
__decorate([
    (0, common_1.Post)('decrypt'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "decryptData", null);
__decorate([
    (0, common_1.Get)('retention-policies'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getRetentionPolicies", null);
__decorate([
    (0, common_1.Post)('retention-policies'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "createRetentionPolicy", null);
__decorate([
    (0, common_1.Put)('retention-policies/:policyId'),
    __param(0, (0, common_1.Param)('policyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "updateRetentionPolicy", null);
__decorate([
    (0, common_1.Delete)('retention-policies/:policyId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('policyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "deleteRetentionPolicy", null);
__decorate([
    (0, common_1.Post)('data-erasure'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "requestDataErasure", null);
__decorate([
    (0, common_1.Get)('data-erasure-requests'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getDataErasureRequests", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('audit-logs/:entityType/:entityId'),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getEntityAuditLogs", null);
__decorate([
    (0, common_1.Get)('anomalies'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getAnomalies", null);
__decorate([
    (0, common_1.Post)('anomalies/:anomalyId/resolve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('anomalyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "resolveAnomaly", null);
__decorate([
    (0, common_1.Get)('settings'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getSecuritySettings", null);
__decorate([
    (0, common_1.Put)('settings'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "updateSecuritySettings", null);
__decorate([
    (0, common_1.Get)('reports/login-attempts'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getLoginAttemptsReport", null);
__decorate([
    (0, common_1.Get)('reports/security-events'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getSecurityEventsReport", null);
__decorate([
    (0, common_1.Get)('reports/compliance'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getComplianceReport", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Get)('health'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getSecurityHealth", null);
__decorate([
    (0, common_1.Get)('certificates'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getCertificates", null);
__decorate([
    (0, common_1.Post)('certificates/renew'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "renewCertificate", null);
__decorate([
    (0, common_1.Get)('policies'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getSecurityPolicies", null);
__decorate([
    (0, common_1.Put)('policies'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "updateSecurityPolicies", null);
exports.SecurityController = SecurityController = __decorate([
    (0, common_1.Controller)('security'),
    __metadata("design:paramtypes", [security_service_1.SecurityService,
        authentication_service_1.AuthenticationService,
        authorization_service_1.AuthorizationService,
        mfa_service_1.MfaService,
        encryption_service_1.EncryptionService,
        audit_service_1.AuditService,
        session_service_1.SessionService,
        device_service_1.DeviceService,
        ip_service_1.IpService,
        data_retention_service_1.DataRetentionService,
        anomaly_detection_service_1.AnomalyDetectionService])
], SecurityController);
//# sourceMappingURL=security.controller.js.map