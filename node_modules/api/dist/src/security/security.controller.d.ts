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
export declare class SecurityController {
    private readonly securityService;
    private readonly authenticationService;
    private readonly authorizationService;
    private readonly mfaService;
    private readonly encryptionService;
    private readonly auditService;
    private readonly sessionService;
    private readonly deviceService;
    private readonly ipService;
    private readonly dataRetentionService;
    private readonly anomalyDetectionService;
    constructor(securityService: SecurityService, authenticationService: AuthenticationService, authorizationService: AuthorizationService, mfaService: MfaService, encryptionService: EncryptionService, auditService: AuditService, sessionService: SessionService, deviceService: DeviceService, ipService: IpService, dataRetentionService: DataRetentionService, anomalyDetectionService: AnomalyDetectionService);
    login(loginDto: any, req: any): Promise<{
        requiresMfa: boolean;
        mfaToken: string;
        message: string;
    } | {
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            roles: any;
            tenantId: any;
        };
        requiresMfa?: undefined;
        mfaToken?: undefined;
        message?: undefined;
    }>;
    logout(req: any): Promise<{
        success: boolean;
    }>;
    refreshToken(refreshDto: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    setupMfa(req: any): Promise<{
        secret: any;
        qrCodeUrl: any;
        backupCodes: never[];
    }>;
    verifyMfa(verifyDto: any, req: any): Promise<{
        success: boolean;
        backupCodes: any;
        message: string;
    } | {
        success: boolean;
        backupCodes?: undefined;
        message?: undefined;
    }>;
    disableMfa(disableDto: any, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    generateBackupCodes(req: any): Promise<string[]>;
    samlLogin(req: any): Promise<{
        samlRequest: string;
        redirectUrl: string;
    }>;
    samlCallback(callbackDto: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            roles: string[];
            tenantId: string;
        };
    }>;
    oidcLogin(req: any): Promise<{
        authorizationUrl: string;
        state: string;
    }>;
    oidcCallback(callbackDto: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            roles: string[];
            tenantId: string;
        };
    }>;
    getPermissions(req: any): Promise<{
        userId: any;
        permissions: {
            id: any;
            name: any;
            resource: any;
            action: any;
            conditions: any;
        }[];
    }>;
    getRoles(req: any): Promise<{
        userId: any;
        roles: any;
    }>;
    checkPermission(permissionDto: any, req: any): Promise<{
        userId: any;
        permission: any;
        resource: any;
        granted: boolean;
        conditions: any;
    }>;
    getUserSessions(req: any): Promise<any>;
    revokeSession(sessionId: string, req: any): Promise<void>;
    revokeAllSessions(req: any): Promise<void>;
    getUserDevices(req: any): Promise<any>;
    trustDevice(trustDto: any, req: any): Promise<any>;
    revokeDevice(deviceId: string, req: any): Promise<void>;
    getIpAllowlist(req: any): Promise<any>;
    addIpToAllowlist(ipDto: any, req: any): Promise<any>;
    removeIpFromAllowlist(ipId: string, req: any): Promise<void>;
    encryptData(encryptDto: any, req: any): Promise<{
        id: any;
        dataType: any;
        encryptedAt: any;
    }>;
    decryptData(decryptDto: any, req: any): Promise<{
        id: any;
        dataType: any;
        data: any;
        decryptedAt: Date;
    }>;
    getRetentionPolicies(req: any): Promise<any>;
    createRetentionPolicy(policyDto: any, req: any): Promise<any>;
    updateRetentionPolicy(policyId: string, policyDto: any, req: any): Promise<any>;
    deleteRetentionPolicy(policyId: string, req: any): Promise<void>;
    requestDataErasure(erasureDto: any, req: any): Promise<any>;
    getDataErasureRequests(req: any): Promise<any>;
    getAuditLogs(query: any, req: any): Promise<any>;
    getEntityAuditLogs(entityType: string, entityId: string, req: any): Promise<any>;
    getAnomalies(query: any, req: any): Promise<any>;
    resolveAnomaly(anomalyId: string, resolveDto: any, req: any): Promise<any>;
    getSecuritySettings(req: any): Promise<any>;
    updateSecuritySettings(settingsDto: any, req: any): Promise<any>;
    getLoginAttemptsReport(query: any, req: any): Promise<{
        total: any;
        successful: any;
        failed: number;
        successRate: number;
        attempts: any;
    }>;
    getSecurityEventsReport(query: any, req: any): Promise<{
        total: any;
        byType: any;
        bySeverity: any;
        events: any;
    }>;
    getComplianceReport(query: any, req: any): Promise<{
        period: {
            from: any;
            to: any;
        };
        compliance: {
            mfaAdoption: {
                total: any;
                withMfa: any;
                rate: number;
            };
            securityIncidents: {
                failedLogins: any;
                suspiciousActivities: number;
            };
            audit: {
                totalLogs: any;
                logsPerDay: number;
            };
            dataRetention: {
                policiesConfigured: any;
                compliance: string;
            };
        };
        recommendations: string[];
    }>;
    changePassword(passwordDto: any, req: any): Promise<{
        success: boolean;
    }>;
    resetPassword(resetDto: any): Promise<{
        success: boolean;
    }>;
    forgotPassword(forgotDto: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getSecurityHealth(req: any): Promise<{
        tenantId: string;
        overall: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
        metrics: {
            totalUsers: any;
            usersWithMfa: any;
            mfaAdoptionRate: number;
            recentLoginAttempts: any;
            failedLoginAttempts: any;
            failedLoginRate: number;
            activeSessions: any;
            securityEvents: any;
        };
        recommendations: string[];
    }>;
    getCertificates(req: any): Promise<any>;
    renewCertificate(renewDto: any, req: any): Promise<any>;
    getSecurityPolicies(req: any): Promise<any>;
    updateSecurityPolicies(policiesDto: any, req: any): Promise<any[]>;
}
