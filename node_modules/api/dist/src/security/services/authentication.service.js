"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthenticationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const mfa_service_1 = require("./mfa.service");
const session_service_1 = require("./session.service");
const device_service_1 = require("./device.service");
const ip_service_1 = require("./ip.service");
const audit_service_1 = require("./audit.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
let AuthenticationService = AuthenticationService_1 = class AuthenticationService {
    jwtService;
    configService;
    prisma;
    mfaService;
    sessionService;
    deviceService;
    ipService;
    auditService;
    logger = new common_1.Logger(AuthenticationService_1.name);
    constructor(jwtService, configService, prisma, mfaService, sessionService, deviceService, ipService, auditService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
        this.mfaService = mfaService;
        this.sessionService = sessionService;
        this.deviceService = deviceService;
        this.ipService = ipService;
        this.auditService = auditService;
    }
    async login(loginDto, req) {
        this.logger.log(`Login attempt for user: ${loginDto.email}`);
        const { email, password, deviceInfo, ipAddress } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                roles: true,
                tenant: true,
            },
        });
        if (!user) {
            await this.recordLoginAttempt(email, false, ipAddress, deviceInfo);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            await this.recordLoginAttempt(email, false, ipAddress, deviceInfo);
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        if (user.tenant.ipAllowlistEnabled) {
            const ipAllowed = await this.ipService.isIpAllowed(ipAddress, user.tenantId);
            if (!ipAllowed) {
                await this.recordLoginAttempt(email, false, ipAddress, deviceInfo);
                throw new common_1.UnauthorizedException('IP address not allowed');
            }
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await this.recordLoginAttempt(email, false, ipAddress, deviceInfo);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.mfaEnabled) {
            return {
                requiresMfa: true,
                mfaToken: await this.generateMfaToken(user.id),
                message: 'MFA verification required',
            };
        }
        const session = await this.sessionService.createSession(user.id, deviceInfo, ipAddress);
        const tokens = await this.generateTokens(user, session.id);
        await this.recordLoginAttempt(email, true, ipAddress, deviceInfo);
        await this.auditService.logActivity({
            action: 'USER_LOGIN',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
            details: {
                ipAddress,
                deviceInfo,
                userAgent: req.headers['user-agent'],
            },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                roles: user.roles.map(r => r.name),
                tenantId: user.tenantId,
            },
            ...tokens,
        };
    }
    async logout(user) {
        this.logger.log(`Logout for user: ${user.id}`);
        await this.sessionService.revokeSession(user.sessionId, user);
        await this.auditService.logActivity({
            action: 'USER_LOGOUT',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
        });
        return { success: true };
    }
    async refreshToken(refreshToken) {
        this.logger.log('Token refresh attempt');
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const session = await this.sessionService.getSession(decoded.sessionId);
            if (!session || session.expiresAt < new Date()) {
                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: decoded.userId },
                include: { roles: true, tenant: true },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const tokens = await this.generateTokens(user, session.id);
            await this.auditService.logActivity({
                action: 'TOKEN_REFRESHED',
                entityType: 'USER',
                entityId: user.id,
                userId: user.id,
            });
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async changePassword(passwordDto, user) {
        this.logger.log(`Password change for user: ${user.id}`);
        const { currentPassword, newPassword } = passwordDto;
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        await this.validatePasswordStrength(newPassword);
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordChangedAt: new Date(),
                updatedAt: new Date(),
            },
        });
        await this.sessionService.revokeAllSessions(user);
        await this.auditService.logActivity({
            action: 'PASSWORD_CHANGED',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
        });
        return { success: true };
    }
    async resetPassword(resetDto) {
        this.logger.log(`Password reset for: ${resetDto.email}`);
        const { email, resetToken, newPassword } = resetDto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isTokenValid = await this.verifyResetToken(user.id, resetToken);
        if (!isTokenValid) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        await this.validatePasswordStrength(newPassword);
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordChangedAt: new Date(),
                updatedAt: new Date(),
            },
        });
        await this.sessionService.revokeAllSessions(user);
        await this.invalidateResetToken(user.id);
        await this.auditService.logActivity({
            action: 'PASSWORD_RESET',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
        });
        return { success: true };
    }
    async forgotPassword(forgotDto) {
        this.logger.log(`Password reset request for: ${forgotDto.email}`);
        const { email } = forgotDto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { success: true, message: 'If the email exists, a reset link has been sent' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.passwordReset.create({
            data: {
                userId: user.id,
                token: await bcrypt.hash(resetToken, 12),
                expiresAt: resetTokenExpiry,
            },
        });
        await this.auditService.logActivity({
            action: 'PASSWORD_RESET_REQUESTED',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
        });
        return { success: true, message: 'If the email exists, a reset link has been sent' };
    }
    async initiateSamlLogin(req) {
        this.logger.log('Initiating SAML login');
        return {
            samlRequest: 'mock_saml_request',
            redirectUrl: 'https://saml-provider.example.com/sso',
        };
    }
    async handleSamlCallback(callbackDto) {
        this.logger.log('Handling SAML callback');
        const mockUser = {
            id: 'saml_user_id',
            email: 'user@saml-provider.com',
            name: 'SAML User',
            roles: ['PATIENT'],
            tenantId: 'tenant_id',
        };
        const session = await this.sessionService.createSession(mockUser.id, 'SAML', '0.0.0.0');
        const tokens = await this.generateTokens(mockUser, session.id);
        return { user: mockUser, ...tokens };
    }
    async initiateOidcLogin(req) {
        this.logger.log('Initiating OIDC login');
        return {
            authorizationUrl: 'https://oidc-provider.example.com/auth',
            state: 'random_state',
        };
    }
    async handleOidcCallback(callbackDto) {
        this.logger.log('Handling OIDC callback');
        const mockUser = {
            id: 'oidc_user_id',
            email: 'user@oidc-provider.com',
            name: 'OIDC User',
            roles: ['PATIENT'],
            tenantId: 'tenant_id',
        };
        const session = await this.sessionService.createSession(mockUser.id, 'OIDC', '0.0.0.0');
        const tokens = await this.generateTokens(mockUser, session.id);
        return { user: mockUser, ...tokens };
    }
    async generateTokens(user, sessionId) {
        const payload = {
            sub: user.id,
            email: user.email,
            roles: user.roles.map(r => r.name),
            tenantId: user.tenantId,
            sessionId,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION', '15m'),
            }),
            this.jwtService.signAsync({ sessionId, userId: user.id }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async generateMfaToken(userId) {
        const payload = { userId, type: 'mfa' };
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: '5m',
        });
    }
    async recordLoginAttempt(email, success, ipAddress, deviceInfo) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        await this.prisma.loginAttempt.create({
            data: {
                userId: user?.id || null,
                email,
                success,
                ipAddress,
                userAgent: deviceInfo?.userAgent || '',
                deviceInfo: JSON.stringify(deviceInfo),
                attemptedAt: new Date(),
            },
        });
        if (!success && user) {
            const recentFailedAttempts = await this.prisma.loginAttempt.count({
                where: {
                    userId: user.id,
                    success: false,
                    attemptedAt: {
                        gte: new Date(Date.now() - 15 * 60 * 1000),
                    },
                },
            });
            if (recentFailedAttempts >= 5) {
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        isLocked: true,
                        lockedAt: new Date(),
                    },
                });
                await this.auditService.logActivity({
                    action: 'ACCOUNT_LOCKED',
                    entityType: 'USER',
                    entityId: user.id,
                    userId: user.id,
                    details: { reason: 'Too many failed login attempts' },
                });
            }
        }
    }
    async validatePasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (password.length < minLength) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long');
        }
        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSymbols) {
            throw new common_1.BadRequestException('Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol');
        }
    }
    async verifyResetToken(userId, token) {
        const resetRecord = await this.prisma.passwordReset.findFirst({
            where: {
                userId,
                expiresAt: { gt: new Date() },
            },
        });
        if (!resetRecord) {
            return false;
        }
        return await bcrypt.compare(token, resetRecord.token);
    }
    async invalidateResetToken(userId) {
        await this.prisma.passwordReset.deleteMany({
            where: { userId },
        });
    }
};
exports.AuthenticationService = AuthenticationService;
exports.AuthenticationService = AuthenticationService = AuthenticationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService,
        mfa_service_1.MfaService,
        session_service_1.SessionService,
        device_service_1.DeviceService,
        ip_service_1.IpService,
        audit_service_1.AuditService])
], AuthenticationService);
//# sourceMappingURL=authentication.service.js.map