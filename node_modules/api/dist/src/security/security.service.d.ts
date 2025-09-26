import { PrismaService } from '../prisma/prisma.service';
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
export declare class SecurityService {
    private readonly prisma;
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
    private readonly logger;
    constructor(prisma: PrismaService, authenticationService: AuthenticationService, authorizationService: AuthorizationService, mfaService: MfaService, encryptionService: EncryptionService, auditService: AuditService, sessionService: SessionService, deviceService: DeviceService, ipService: IpService, dataRetentionService: DataRetentionService, anomalyDetectionService: AnomalyDetectionService);
    getSecuritySettings(tenantId: string): Promise<any>;
    updateSecuritySettings(settingsDto: any, user: any): Promise<any>;
    getSecurityHealth(tenantId: string): Promise<{
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
    getLoginAttemptsReport(query: any, user: any): Promise<{
        total: any;
        successful: any;
        failed: number;
        successRate: number;
        attempts: any;
    }>;
    getSecurityEventsReport(query: any, user: any): Promise<{
        total: any;
        byType: any;
        bySeverity: any;
        events: any;
    }>;
    getComplianceReport(query: any, user: any): Promise<{
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
    getCertificates(tenantId: string): Promise<any>;
    renewCertificate(renewDto: any, user: any): Promise<any>;
    getSecurityPolicies(tenantId: string): Promise<any>;
    updateSecurityPolicies(policiesDto: any, user: any): Promise<any[]>;
    private calculateOverallHealth;
    private generateSecurityRecommendations;
    private generateComplianceRecommendations;
}
