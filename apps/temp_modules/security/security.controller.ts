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
} from '@nestjs/common';
import { SecurityService } from './security.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthorizationService } from './services/authorization.service';
import { MfaService } from './services/mfa.service';
import { EncryptionService } from './services/encryption.service';
import { AuditService } from './services/audit.service';
import { SessionService } from './services/session.service';
import { DeviceService } from './services/device.service';
import { IpService } from './services/ip.service';
import { DataRetentionService } from './services/data-retention.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';

@Controller('security')
export class SecurityController {
  constructor(
    private readonly securityService: SecurityService,
    private readonly authenticationService: AuthenticationService,
    private readonly authorizationService: AuthorizationService,
    private readonly mfaService: MfaService,
    private readonly encryptionService: EncryptionService,
    private readonly auditService: AuditService,
    private readonly sessionService: SessionService,
    private readonly deviceService: DeviceService,
    private readonly ipService: IpService,
    private readonly dataRetentionService: DataRetentionService,
    private readonly anomalyDetectionService: AnomalyDetectionService,
  ) {}

  // Authentication endpoints
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any, @Request() req) {
    return this.authenticationService.login(loginDto, req);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return this.authenticationService.logout(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshDto: any) {
    return this.authenticationService.refreshToken(refreshDto.refreshToken);
  }

  // MFA endpoints
  @Post('mfa/setup')
  @HttpCode(HttpStatus.CREATED)
  async setupMfa(@Request() req) {
    return this.mfaService.setupMfa(req.user);
  }

  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  async verifyMfa(@Body() verifyDto: any, @Request() req) {
    return this.mfaService.verifyMfa(verifyDto, req.user);
  }

  @Post('mfa/disable')
  @HttpCode(HttpStatus.OK)
  async disableMfa(@Body() disableDto: any, @Request() req) {
    return this.mfaService.disableMfa(disableDto, req.user);
  }

  @Post('mfa/backup-codes')
  @HttpCode(HttpStatus.OK)
  async generateBackupCodes(@Request() req) {
    return this.mfaService.generateBackupCodes(req.user);
  }

  // SSO endpoints
  @Get('sso/saml/login')
  async samlLogin(@Request() req) {
    return this.authenticationService.initiateSamlLogin(req);
  }

  @Post('sso/saml/callback')
  async samlCallback(@Body() callbackDto: any) {
    return this.authenticationService.handleSamlCallback(callbackDto);
  }

  @Get('sso/oidc/login')
  async oidcLogin(@Request() req) {
    return this.authenticationService.initiateOidcLogin(req);
  }

  @Post('sso/oidc/callback')
  async oidcCallback(@Body() callbackDto: any) {
    return this.authenticationService.handleOidcCallback(callbackDto);
  }

  // Authorization endpoints
  @Get('permissions')
  async getPermissions(@Request() req) {
    return this.authorizationService.getUserPermissions(req.user);
  }

  @Get('roles')
  async getRoles(@Request() req) {
    return this.authorizationService.getUserRoles(req.user);
  }

  @Post('permissions/check')
  @HttpCode(HttpStatus.OK)
  async checkPermission(@Body() permissionDto: any, @Request() req) {
    return this.authorizationService.checkPermission(permissionDto, req.user);
  }

  // Session management
  @Get('sessions')
  async getUserSessions(@Request() req) {
    return this.sessionService.getUserSessions(req.user);
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeSession(@Param('sessionId') sessionId: string, @Request() req) {
    await this.sessionService.revokeSession(sessionId, req.user);
  }

  @Delete('sessions')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeAllSessions(@Request() req) {
    await this.sessionService.revokeAllSessions(req.user);
  }

  // Device management
  @Get('devices')
  async getUserDevices(@Request() req) {
    return this.deviceService.getUserDevices(req.user);
  }

  @Post('devices/trust')
  @HttpCode(HttpStatus.OK)
  async trustDevice(@Body() trustDto: any, @Request() req) {
    return this.deviceService.trustDevice(trustDto, req.user);
  }

  @Delete('devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeDevice(@Param('deviceId') deviceId: string, @Request() req) {
    await this.deviceService.revokeDevice(deviceId, req.user);
  }

  // IP management
  @Get('ip-allowlist')
  async getIpAllowlist(@Request() req) {
    return this.ipService.getIpAllowlist(req.user.tenantId);
  }

  @Post('ip-allowlist')
  @HttpCode(HttpStatus.CREATED)
  async addIpToAllowlist(@Body() ipDto: any, @Request() req) {
    return this.ipService.addIpToAllowlist(ipDto, req.user);
  }

  @Delete('ip-allowlist/:ipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeIpFromAllowlist(@Param('ipId') ipId: string, @Request() req) {
    await this.ipService.removeIpFromAllowlist(ipId, req.user);
  }

  // Encryption endpoints
  @Post('encrypt')
  @HttpCode(HttpStatus.OK)
  async encryptData(@Body() encryptDto: any, @Request() req) {
    return this.encryptionService.encryptData(encryptDto, req.user);
  }

  @Post('decrypt')
  @HttpCode(HttpStatus.OK)
  async decryptData(@Body() decryptDto: any, @Request() req) {
    return this.encryptionService.decryptData(decryptDto, req.user);
  }

  // Data retention
  @Get('retention-policies')
  async getRetentionPolicies(@Request() req) {
    return this.dataRetentionService.getRetentionPolicies(req.user.tenantId);
  }

  @Post('retention-policies')
  @HttpCode(HttpStatus.CREATED)
  async createRetentionPolicy(@Body() policyDto: any, @Request() req) {
    return this.dataRetentionService.createRetentionPolicy(policyDto, req.user);
  }

  @Put('retention-policies/:policyId')
  async updateRetentionPolicy(
    @Param('policyId') policyId: string,
    @Body() policyDto: any,
    @Request() req,
  ) {
    return this.dataRetentionService.updateRetentionPolicy(policyId, policyDto, req.user);
  }

  @Delete('retention-policies/:policyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRetentionPolicy(@Param('policyId') policyId: string, @Request() req) {
    await this.dataRetentionService.deleteRetentionPolicy(policyId, req.user);
  }

  // Right to erasure
  @Post('data-erasure')
  @HttpCode(HttpStatus.OK)
  async requestDataErasure(@Body() erasureDto: any, @Request() req) {
    return this.dataRetentionService.requestDataErasure(erasureDto, req.user);
  }

  @Get('data-erasure-requests')
  async getDataErasureRequests(@Request() req) {
    return this.dataRetentionService.getDataErasureRequests(req.user.tenantId);
  }

  // Audit logs
  @Get('audit-logs')
  async getAuditLogs(@Query() query: any, @Request() req) {
    return this.auditService.getAuditLogs(query, req.user);
  }

  @Get('audit-logs/:entityType/:entityId')
  async getEntityAuditLogs(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Request() req,
  ) {
    return this.auditService.getEntityAuditLogs(entityType, entityId, req.user);
  }

  // Anomaly detection
  @Get('anomalies')
  async getAnomalies(@Query() query: any, @Request() req) {
    return this.anomalyDetectionService.getAnomalies(query, req.user);
  }

  @Post('anomalies/:anomalyId/resolve')
  @HttpCode(HttpStatus.OK)
  async resolveAnomaly(@Param('anomalyId') anomalyId: string, @Body() resolveDto: any, @Request() req) {
    return this.anomalyDetectionService.resolveAnomaly(anomalyId, resolveDto, req.user);
  }

  // Security settings
  @Get('settings')
  async getSecuritySettings(@Request() req) {
    return this.securityService.getSecuritySettings(req.user.tenantId);
  }

  @Put('settings')
  async updateSecuritySettings(@Body() settingsDto: any, @Request() req) {
    return this.securityService.updateSecuritySettings(settingsDto, req.user);
  }

  // Security reports
  @Get('reports/login-attempts')
  async getLoginAttemptsReport(@Query() query: any, @Request() req) {
    return this.securityService.getLoginAttemptsReport(query, req.user);
  }

  @Get('reports/security-events')
  async getSecurityEventsReport(@Query() query: any, @Request() req) {
    return this.securityService.getSecurityEventsReport(query, req.user);
  }

  @Get('reports/compliance')
  async getComplianceReport(@Query() query: any, @Request() req) {
    return this.securityService.getComplianceReport(query, req.user);
  }

  // Password management
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() passwordDto: any, @Request() req) {
    return this.authenticationService.changePassword(passwordDto, req.user);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetDto: any) {
    return this.authenticationService.resetPassword(resetDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotDto: any) {
    return this.authenticationService.forgotPassword(forgotDto);
  }

  // Security health check
  @Get('health')
  async getSecurityHealth(@Request() req) {
    return this.securityService.getSecurityHealth(req.user.tenantId);
  }

  // TLS certificate management
  @Get('certificates')
  async getCertificates(@Request() req) {
    return this.securityService.getCertificates(req.user.tenantId);
  }

  @Post('certificates/renew')
  @HttpCode(HttpStatus.OK)
  async renewCertificate(@Body() renewDto: any, @Request() req) {
    return this.securityService.renewCertificate(renewDto, req.user);
  }

  // Security policies
  @Get('policies')
  async getSecurityPolicies(@Request() req) {
    return this.securityService.getSecurityPolicies(req.user.tenantId);
  }

  @Put('policies')
  async updateSecurityPolicies(@Body() policiesDto: any, @Request() req) {
    return this.securityService.updateSecurityPolicies(policiesDto, req.user);
  }
}
