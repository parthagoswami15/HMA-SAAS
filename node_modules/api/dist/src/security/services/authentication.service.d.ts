import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { MfaService } from './mfa.service';
import { SessionService } from './session.service';
import { DeviceService } from './device.service';
import { IpService } from './ip.service';
import { AuditService } from './audit.service';
export declare class AuthenticationService {
    private readonly jwtService;
    private readonly configService;
    private readonly prisma;
    private readonly mfaService;
    private readonly sessionService;
    private readonly deviceService;
    private readonly ipService;
    private readonly auditService;
    private readonly logger;
    constructor(jwtService: JwtService, configService: ConfigService, prisma: PrismaService, mfaService: MfaService, sessionService: SessionService, deviceService: DeviceService, ipService: IpService, auditService: AuditService);
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
    logout(user: any): Promise<{
        success: boolean;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword(passwordDto: any, user: any): Promise<{
        success: boolean;
    }>;
    resetPassword(resetDto: any): Promise<{
        success: boolean;
    }>;
    forgotPassword(forgotDto: any): Promise<{
        success: boolean;
        message: string;
    }>;
    initiateSamlLogin(req: any): Promise<{
        samlRequest: string;
        redirectUrl: string;
    }>;
    handleSamlCallback(callbackDto: any): Promise<{
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
    initiateOidcLogin(req: any): Promise<{
        authorizationUrl: string;
        state: string;
    }>;
    handleOidcCallback(callbackDto: any): Promise<{
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
    private generateTokens;
    private generateMfaToken;
    private recordLoginAttempt;
    private validatePasswordStrength;
    private verifyResetToken;
    private invalidateResetToken;
}
